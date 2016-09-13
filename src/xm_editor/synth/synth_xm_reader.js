/**
  * Part of https://github.com/gheja/jsstuffs/
  */
SynthXmReader = function()
{
	this.header = {};
	this.patterns = [];
	this.instruments = [];
	
	this.log = function(s)
	{
		console.log("SynthXmReader: " + s);
	}
	
	this.readFile = function(data)
	{
		var dv = new jDataView(data);
		
		this.log("Attempting to load file...")
		
		// the little/bigendian conversion was not working (why?)
		dv.getUint16_2 = function()
		{
			return this.getUint8() + this.getUint8() * 256;
		}
		dv.getUint32_2 = function()
		{
			return this.getUint8() + this.getUint8() * 256 + this.getUint8() * 256*256 + this.getUint8() * 256*256*256;
		}
		dv.getWords_2 = function(length)
		{
			var i, a = [];
			for (i=0; i<length; i++)
			{
				a[i] = this.getUint16_2();
			}
			return a;
		}
		
		if (dv.getString(17) != "Extended Module: ")
		{
			this.log("\"Extended Module: \" header not found.");
			return false;
		}
		this.log("File seems to be valid, reading the rest of the header...");
		
		this.header = {
			song_name: dv.getString(20),
			x1a: dv.getUint8(),
			tracker_name: dv.getString(20),
			version_number: dv.getUint16_2(),
			header_size: dv.getUint32_2(),
			song_length: dv.getUint16_2(),
			restart_position: dv.getUint16_2(),
			number_of_channels: dv.getUint16_2(),
			number_of_patterns: dv.getUint16_2(),
			number_of_instruments: dv.getUint16_2(),
			flags: dv.getUint16_2(),
			default_tempo: dv.getUint16_2(), // = speed
			default_bpm: dv.getUint16_2(),
			pattern_order_table: dv.getBytes(256)
		};
		
		if (this.header.x1a != 0x1A)
		{
			this.log("Failed to read header: 0x1A not found.");
			return false;
		}
		
		this.log("Header succesfully read, seeking to first pattern header...");
		
		dv.seek(60 + this.header.header_size);
		
		for (i=0; i<this.header.number_of_patterns; i++)
		{
			this.log("Reading pattern #" + i + " header...");
			var pattern = {
				header_size: dv.getUint32_2(),
				packing_type: dv.getUint8(), // dummy
				number_of_rows: dv.getUint16_2(),
				packed_pattern_data_size: dv.getUint16_2()
			};
			
			if (pattern.header_size != 9)
			{
				this.log("WARNING: Pattern header is " + pattern.header_size + " bytes long. This is probably bad, continuing anyway...");
			}
			
			if (pattern.packed_pattern_data_size == 0)
			{
				this.log("Pattern is empty, not reading data...");
				// channels = 4
				pattern.data = new Uint8Array(4 * pattern.header.number_of_rows);
			}
			else
			{
				this.log("Reading pattern #" + i + " data...");
				pattern.data = dv.getBytes(pattern.packed_pattern_data_size);
			}
			
			this.patterns[i] = pattern;
		}
		this.log("End of patterns, reading instruments...");
		
		for (i=0; i<this.header.number_of_instruments; i++)
		{
			this.log("Reading instrument #" + i + " header...");
			var instrument = {
				header_size: dv.getUint32_2(),
				name: dv.getString(22),
				instrument_type: dv.getUint8(), // dummy
				number_of_samples: dv.getUint16_2()
			};
			
			if (instrument.header_size != 263 && instrument.header_size != 29)
			{
				this.log("WARNING: Instrument header is " + instrument.header_size + " bytes long. This is probably bad, continuing anyway...");
			}
			
			if (instrument.number_of_samples == 0)
			{
				this.log("Instrument #" + i + " has no samples.");
				continue;
			}
			
			instrument.sample_header_size = dv.getUint32_2();
			instrument.sample_keymap_assignments = dv.getBytes(96);
			instrument.points_for_volume_envelope = dv.getWords_2(24);
			instrument.points_for_panning_envelope = dv.getWords_2(24);
			
			instrument.number_of_volume_points = dv.getUint8();
			instrument.number_of_panning_points = dv.getUint8();
			instrument.volume_sustain_point = dv.getUint8();
			instrument.volume_loop_start_point = dv.getUint8();
			instrument.volume_loop_end_point = dv.getUint8();
			instrument.panning_sustain_point = dv.getUint8();
			instrument.panning_loop_start_point = dv.getUint8();
			instrument.panning_loop_end_point = dv.getUint8();
			instrument.volume_type = dv.getUint8();
			instrument.panning_type = dv.getUint8();
			instrument.vibratio_type = dv.getUint8();
			instrument.vibratio_sweep = dv.getUint8();
			instrument.vibratio_depth = dv.getUint8();
			instrument.vibratio_rate = dv.getUint8();
			instrument.volume_fadeout = dv.getUint16_2();
			dv.skip(22); // reserved
			
			instrument.samples = [];
			
			for (j=0; j<instrument.number_of_samples; j++)
			{
				this.log("Reading instrument #" + i + ", sample #" + j + " header...");
				var sample = {
					length: dv.getUint32_2(),
					loop_start: dv.getUint32_2(),
					loop_length: dv.getUint32_2(),
					volume: dv.getUint8(),
					finetune: dv.getInt8(), // signed!
					type: dv.getUint8(),
					panning: dv.getUint8(),
					relative_note_number: dv.getInt8(), // signed!
					compression_type: dv.getUint8(),
					name: dv.getString(22)
				};
				
				// dv.skip(instrument.sample_header_size - 40);
				
				this.log(sample.name);
				
				this.log("Reading instrument #" + i + ", sample #" + j + " data...");
				this.log(sample.length);
				sample.data = new Int8Array(dv.getBytes(sample.length));
				
				instrument.samples[j] = sample;
			}
			
			this.instruments[i] = instrument;
		}
		
		this.log("File was successfully read.");
		
		return true;
	}
	
	this.unpackPatternRows = function()
	{
		var i, j, k, unpacked;
		
		for (i in this.patterns)
		{
			this.log("Unpacking pattern #" + i + "...");
			k = 0;
			unpacked = [];
			for (j=0; j<this.patterns[i].packed_pattern_data_size; j++)
			{
				// compressed
				a = this.patterns[i].data[j];
				if (a & 128)
				{
					/*
					// this is a more compact form, but the latter is easier to read and debug
					unpacked[k] = [
						a & 1  ? this.patterns[i].data[++j] : 0, // note
						a & 2  ? this.patterns[i].data[++j] : 0, // instrument
						a & 4  ? this.patterns[i].data[++j] : 0, // volume
						a & 8  ? this.patterns[i].data[++j] : 0, // effect type
						a & 16 ? this.patterns[i].data[++j] : 0  // effect parameter
					];
					*/
					
					unpacked[k] = [ 0, 0, 0, 0, 0 ];
					
					// note follows
					if (a & 1)
					{
						j++;
						unpacked[k][0] = this.patterns[i].data[j];
					}
					// instrument follows
					if (a & 2)
					{
						j++;
						unpacked[k][1] = this.patterns[i].data[j];
					}
					// volume follows
					if (a & 4)
					{
						j++;
						unpacked[k][2] = this.patterns[i].data[j];
					}
					// effect type follows
					if (a & 8)
					{
						j++;
						unpacked[k][3] = this.patterns[i].data[j];
					}
					// effect parameter follows
					if (a & 16)
					{
						j++;
						unpacked[k][4] = this.patterns[i].data[j];
					}
				}
				else
				{
					unpacked[k] = [ a, this.patterns[i].data[j + 1], this.patterns[i].data[j + 2], this.patterns[i].data[j + 3], this.patterns[i].data[j + 4] ];
					j += 4;
				}
				k++;
			}
			this.patterns[i].data_unpacked = unpacked;
		}
		this.log("Unpacking finished.");
	}
	
	this.getXmStructure = function()
	{
		return {
			header: this.header,
			patterns: this.patterns,
			instruments: this.instruments
		};
	}
}
