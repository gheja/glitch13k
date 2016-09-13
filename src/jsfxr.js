/**
 * SfxrParams and SfxrSynth
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 *
 * Reformatted and restructured by Gabor Heja, 2015
 */

/**
 * @return {buffer|rawData}
 */
function Jsfxr(ctx, values)
{
	var i, totalTime, multiplier;
	
	for (i=0; i<24; i++ )
	{
		values[i] = values[i] || 0;
	}
	
	if (values[2] < .01)
	{
		values[2] = .01;
	}
	
	totalTime = values[1] + values[2] + values[4];
	
	if (totalTime < .18)
	{
		multiplier = .18 / totalTime;
		values[1] *= multiplier;
		values[2] *= multiplier;
		values[4] *= multiplier;
	}
	
	//--------------------------------------------------------------------------
	//
	//  Synth Variables
	//
	//--------------------------------------------------------------------------
	
	var _envelopeLength0, // Length of the attack stage
		_envelopeLength1, // Length of the sustain stage
		_envelopeLength2, // Length of the decay stage
		
		_period,          // Period of the wave
		_maxPeriod,       // Maximum period before sound stops (from minFrequency)
		
		_slide,           // Note slide
		_deltaSlide,      // Change in slide
		
		_changeAmount,    // Amount to change the note by
		_changeTime,      // Counter for the note change
		_changeLimit,     // Once the time reaches this limit, the note changes
		
		_squareDuty,      // Offset of center switching point in the square wave
		_dutySweep;       // Amount to change the duty by
	
	//--------------------------------------------------------------------------
	//
	//  Synth Methods
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Resets the runing variables from the params
	 * Used once at the start (total reset) and for the repeat effect (partial reset)
	 */
	function reset()
	{
		_period       = 100 / (values[5] * values[5] + .001);
		_maxPeriod    = 100 / (values[6]   * values[6]   + .001);
		
		_slide        = 1 - values[7] * values[7] * values[7] * .01;
		_deltaSlide   = -values[8] * values[8] * values[8] * .000001;
		
		if (!values[0]) {
			_squareDuty = .5 - values[13] / 2;
			_dutySweep  = -values[14] * .00005;
		}
		
		_changeAmount =  1 + values[11] * values[11] * (values[11] > 0 ? -.9 : 10);
		_changeTime   = 0;
		_changeLimit  = values[12] == 1 ? 0 : (1 - values[12]) * (1 - values[12]) * 20000 + 32;
	}
	
	// I split the reset() function into two functions for better readability
	function totalReset()
	{
		reset();
		
		// Calculating the length is all that remained here, everything else moved somewhere
		_envelopeLength0 = values[1] * values[1] * 100000;
		_envelopeLength1 = values[2] * values[2] * 100000;
		_envelopeLength2 = values[4] * values[4] * 100000 + 12;
		
		// Full length of the volume envelop (and therefore sound)
		// Make sure the length can be divided by 3 so we will not need the padding "==" after base64 encode
		return ((_envelopeLength0 + _envelopeLength1 + _envelopeLength2) / 3 | 0) * 3;
	}
	
	/**
	 * Writes the wave to the supplied buffer ByteArray
	 * @param buffer A ByteArray to write the wave to
	 * @return If the wave is finished
	 */
	function synthWave(buffer, length)
	{
		// If the filters are active
		var _filters = values[18] != 1 || values[21],
			// Cutoff multiplier which adjusts the amount the wave position can move
			_hpFilterCutoff = values[21] * values[21] * .1,
			// Speed of the high-pass cutoff multiplier
			_hpFilterDeltaCutoff = 1 + values[22] * .0003,
			// Cutoff multiplier which adjusts the amount the wave position can move
			_lpFilterCutoff = values[18] * values[18] * values[18] * .1,
			// Speed of the low-pass cutoff multiplier
			_lpFilterDeltaCutoff = 1 + values[19] * .0001,
			// If the low pass filter is active
			_lpFilterOn = values[18] != 1,
			// masterVolume * masterVolume (for quick calculations)
			_masterVolume = values[23] * values[23],
			// Minimum frequency before stopping
			_minFreqency = values[6],
			// If the phaser is active
			_phaser = values[16] || values[17],
			// Change in phase offset
			_phaserDeltaOffset = values[17] * values[17] * values[17] * .2,
			// Phase offset for phaser effect
			_phaserOffset = values[16] * values[16] * (values[16] < 0 ? -1020 : 1020),
			// Once the time reaches this limit, some of the    iables are reset
			_repeatLimit = values[15] ? ((1 - values[15]) * (1 - values[15]) * 20000 | 0) + 32 : 0,
			// The punch factor (louder at begining of sustain)
			_sustainPunch = values[3],
			// Amount to change the period of the wave by at the peak of the vibrato wave
			_vibratoAmplitude = values[9] / 2,
			// Speed at which the vibrato phase moves
			_vibratoSpeed = values[10] * values[10] * .01,
			// The type of wave to generate
			_waveType = values[0];
		
		var _envelopeLength      = _envelopeLength0,     // Length of the current envelope stage
			_envelopeOverLength0 = 1 / _envelopeLength0, // (for quick calculations)
			_envelopeOverLength1 = 1 / _envelopeLength1, // (for quick calculations)
			_envelopeOverLength2 = 1 / _envelopeLength2; // (for quick calculations)
		
		// Damping muliplier which restricts how fast the wave position can move
		var _lpFilterDamping = 5 / (1 + values[20] * values[20] * 20) * (.01 + _lpFilterCutoff);
		
		if (_lpFilterDamping > .8)
		{
			_lpFilterDamping = .8;
		}
		_lpFilterDamping = 1 - _lpFilterDamping;
		
		var _finished         = 0, // If the sound has finished
			_envelopeStage    = 0, // Current stage of the envelope (attack, sustain, decay, end)
			_envelopeTime     = 0, // Current time through current enelope stage
			_envelopeVolume   = 0, // Current volume of the envelope
			_hpFilterPos      = 0, // Adjusted wave position after high-pass filter
			_lpFilterDeltaPos = 0, // Change in low-pass wave position, as allowed by the cutoff and damping
			_lpFilterPos      = 0, // Adjusted wave position after low-pass filter
			_phase            = 0, // Phase through the wave
			_phaserPos        = 0, // Position through the phaser buffer
			_repeatTime       = 0, // Counter for the repeats
			_vibratoPhase     = 0, // Phase through the vibrato sine wave
			_lpFilterOldPos,       // Previous low-pass wave position
			_periodTemp,           // Period modified by vibrato
			_phaserInt,            // Integer phaser offset, for bit maths
			_pos,                  // Phase expresed as a Number from 0-1, used for fast sin approx
			_sample,               // Sub-sample calculated 8 times per actual sample, averaged out to get the super sample
			_superSample;          // Actual sample writen to the wave
		
		// Buffer of wave values used to create the out of phase second wave
		var _phaserBuffer = new Array(1024),
			// Buffer of random values used to generate noise
			_noiseBuffer  = new Array(32);
		
		for (var i = _phaserBuffer.length; i--; )
		{
			_phaserBuffer[i] = 0;
		}
		
		for (var i = _noiseBuffer.length; i--; )
		{
			_noiseBuffer[i] = Math.random() * 2 - 1;
		}
		
		for (var i = 0; i < length; i++) {
			if (_finished)
			{
				return i;
			}
			
			// Repeats every _repeatLimit times, partially resetting the sound parameters
			if (_repeatLimit)
			{
				if (++_repeatTime >= _repeatLimit)
				{
					_repeatTime = 0;
					reset();
				}
			}
			
			// If _changeLimit is reached, shifts the pitch
			if (_changeLimit)
			{
				if (++_changeTime >= _changeLimit)
				{
					_changeLimit = 0;
					_period *= _changeAmount;
				}
			}
			
			// Acccelerate and apply slide
			_slide += _deltaSlide;
			_period *= _slide;
			
			// Checks for frequency getting too low, and stops the sound if a minFrequency was set
			if (_period > _maxPeriod)
			{
				_period = _maxPeriod;
				if (_minFreqency > 0)
				{
					_finished = true;
				}
			}
			
			_periodTemp = _period;
			
			// Applies the vibrato effect
			if (_vibratoAmplitude > 0)
			{
				_vibratoPhase += _vibratoSpeed;
				_periodTemp *= 1 + Math.sin(_vibratoPhase) * _vibratoAmplitude;
			}
			
			_periodTemp |= 0;
			if (_periodTemp < 8)
			{
				_periodTemp = 8;
			}
			
			// Sweeps the square duty
			if (!_waveType)
			{
				_squareDuty += _dutySweep;
				if (_squareDuty < 0)
				{
					_squareDuty = 0;
				}
				else if (_squareDuty > .5)
				{
					_squareDuty = .5;
				}
			}
			
			// Moves through the different stages of the volume envelope
			if (++_envelopeTime > _envelopeLength)
			{
				_envelopeTime = 0;
				
				_envelopeStage++;
				
				if (_envelopeStage == 1)
				{
					_envelopeLength = _envelopeLength1;
				}
				
				if (_envelopeStage == 2)
				{
					_envelopeLength = _envelopeLength2;
				}
			}
			
			// Sets the volume based on the position in the envelope
			if (_envelopeStage == 0)
			{
				_envelopeVolume = _envelopeTime * _envelopeOverLength0;
			}
			if (_envelopeStage == 1)
			{
				_envelopeVolume = 1 + (1 - _envelopeTime * _envelopeOverLength1) * 2 * _sustainPunch;
			}
			if (_envelopeStage == 2)
			{
				_envelopeVolume = 1 - _envelopeTime * _envelopeOverLength2;
			}
			if (_envelopeStage == 3)
			{
				_envelopeVolume = 0;
				_finished = true;
			}
			
			// Moves the phaser offset
			if (_phaser)
			{
				_phaserOffset += _phaserDeltaOffset;
				_phaserInt = _phaserOffset | 0;
				if (_phaserInt < 0)
				{
					_phaserInt = -_phaserInt;
				}
				else if (_phaserInt > 1023)
				{
					_phaserInt = 1023;
				}
			}
			
			// Moves the high-pass filter cutoff
			if (_filters && _hpFilterDeltaCutoff)
			{
				_hpFilterCutoff *= _hpFilterDeltaCutoff;
				if (_hpFilterCutoff < .00001)
				{
					_hpFilterCutoff = .00001;
				}
				else if (_hpFilterCutoff > .1)
				{
					_hpFilterCutoff = .1;
				}
			}
			
			_superSample = 0;
			for (var j = 8; j--; )
			{
				// Cycles through the period
				_phase++;
				if (_phase >= _periodTemp)
				{
					_phase %= _periodTemp;
					
					// Generates new random noise for this period
					if (_waveType == 3)
					{
						for (var n = _noiseBuffer.length; n--; )
						{
							_noiseBuffer[n] = Math.random() * 2 - 1;
						}
					}
				}
				
				// Gets the sample from the oscillator
				switch (_waveType)
				{
					case 0: // Square wave
						_sample = ((_phase / _periodTemp) < _squareDuty) ? .5 : -.5;
					break;
					
					case 1: // Saw wave
						_sample = 1 - _phase / _periodTemp * 2;
					break;
					
					case 2: // Sine wave (fast and accurate approx)
						// TODO: why not Math.sin()???
						_pos = _phase / _periodTemp;
						_pos = (_pos > .5 ? _pos - 1 : _pos) * 6.28318531;
						_sample = 1.27323954 * _pos + .405284735 * _pos * _pos * (_pos < 0 ? 1 : -1);
						_sample = .225 * ((_sample < 0 ? -1 : 1) * _sample * _sample  - _sample) + _sample;
					break;
					
					case 3: // Noise
						_sample = _noiseBuffer[Math.abs(_phase * 32 / _periodTemp | 0)];
					break;
				}
				
				// Applies the low and high pass filters
				if (_filters)
				{
					_lpFilterOldPos = _lpFilterPos;
					_lpFilterCutoff *= _lpFilterDeltaCutoff;
					
					if (_lpFilterCutoff < 0)
					{
						_lpFilterCutoff = 0;
					}
					else if (_lpFilterCutoff > .1)
					{
						_lpFilterCutoff = .1;
					}
					
					if (_lpFilterOn)
					{
						_lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff;
						_lpFilterDeltaPos *= _lpFilterDamping;
					}
					else
					{
						_lpFilterPos = _sample;
						_lpFilterDeltaPos = 0;
					}
					
					_lpFilterPos += _lpFilterDeltaPos;
					
					_hpFilterPos += _lpFilterPos - _lpFilterOldPos;
					_hpFilterPos *= 1 - _hpFilterCutoff;
					_sample = _hpFilterPos;
				}
				
				// Applies the phaser effect
				if (_phaser)
				{
					_phaserBuffer[_phaserPos % 1024] = _sample;
					_sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) % 1024];
					_phaserPos++;
				}
				
				_superSample += _sample;
			}
			
			// Averages out the super samples and applies volumes
			_superSample *= .125 * _envelopeVolume * _masterVolume;
			
			// Clipping if too loud
			buffer[i] = _superSample >= 1 ? 1 : _superSample <= -1 ? -1 : _superSample;
		}
		
		return length;
	}
	
	
	
	var envelopeFullLength, result, buffer, data;
	
	envelopeFullLength = totalReset();
	
	result = { buffer: null, rawData: new Float32Array(envelopeFullLength) };
	synthWave(result.rawData, envelopeFullLength);
	
	result.buffer = ctx.createBuffer(1, envelopeFullLength, 44100);
/*
	if ('copyToChannel' in result.buffer)
	{
		result.buffer.copyToChannel(result.rawData, 0);
	}
	else
*/
	{
		data = result.buffer.getChannelData(0);
		for (i=0; i<envelopeFullLength; i++)
		{
			data[i] = result.rawData[i];
		}
	}
	
	return result;
}
