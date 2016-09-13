# synth

"Synth" is more or less an XM player, supporting multiple songs with shared samples, instruments and patterns.

The Synth is aimimg at simplicity and small size both for player and data.

The Synth.render() loads the samples, instruments, patterns and songs, and then renders all the songs to separate HTML audio objects. Synth.play() can play the generated objects.

## Samples

No pre-generated samples are stored (i.e. WAV files) but they are stored as "recipes". These recpies tell the SynthSampleGenerator how to create the final samples.

## Instruments

Intstruments are instruments can be found in XMs.

## Patterns

Patterns are stored compressed based on ...

## Compression method (for multiple .XM files)

1. Load the .XM file (in order of appearance of the data)
  * Load the pattern order table
  * Load content of patterns
  * Load instrument namess and parameters
  * Load sample names and numbers
  * Ignore actual sample data

2. Create a map of instrument names and numbers, sample names and numbers
  * Remap numbers in patterns and instruments if necessary (i.e. common instrument/sample found by their name)

3. Assemble the patterns based on pattern order table
  * All rows are now in order from the first to the last

4. Append the generated pattern to the previous ones, make note of the starting id and length

5. Do the previous steps for all the remaining .XM files

6. Disassemble rows
  * Create a flat array of all the notes, instruments, volumes, effect ids, effect parameters
  * I.e. ```C-4 3 30 A08```, ```C-5 4 40 A07``` becomes ```C-4 C-5 3 4 30 40 A08 A07```

7. Create the compressed row data
  * Create a dictionary based on repeating "strings"
  * Create a map to reassemble the original rows

...

## XM/mod effects

Sources:
  * http://metamorph0sis.nm.ru/xmeffects.html

### 0xy Arpegio
**x**: first halftone, **y**: second halftone

First tick the ```note``` is played, the next tick: ```note + x```, the next tick: ```note + y```, then repeat.

Example: ```C-1 037```, first tick: ```C1```, next tick: ```C1 + 3 = Eb1```, next tick: ```C1 + 7 = G1```, then repeat.

### 1xx Portamento up
**xx**: speed

This command is used to slide the sample pitch up. 

Note: If Amiga frequence table is used, the sliding will be non-linear (the speed depends on the frequency).

Actually sliding (really tone stepping) is being performed at every tick since command is active. So the final tone depends on the **xx** parameter.

Example: TODO


### 2xx Portamento down
**xx**: speed

This command is used to slide the sample pitch down. 

Note: If Amiga frequence table is used, the sliding will be non-linear (the speed depends on the frequency).

Actually sliding (really tone stepping) is being performed at every tick since command is active. So the final tone depends on the **xx** parameter.

Example: TODO


### 3xx Tone portanemto
**xx**: speed

This command is used together with a note, and will slide to its frequency.

If glissando mode is set (by E3x command), the frequency will be rounded to the nearest halftone.

Example: TODO


### 4xy	Vibrato
**x**: rate, **y**: depth

Adds frequency vibrato to the channel with a specified rate and speed.

Set vibrato mode command (E4x) can be used to change the vibrato waveform.

Example: TODO
