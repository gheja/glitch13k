"use strict";

// /** @const */ var PALETTES = "00000000854f965f0000000085489658677f666f666f666f00000000111f333f00000000b65fd98f0000555f777fcccf0000b10fe20fffff00000c0ff00fffff0000f00ffa0fffff000009fffa0fffff000009ff0c0fffff0000222f444fcccf0000222f775fff7f00006b0f8e0fffff00000000590f8e0f0000f40ffb0fff0f0000000a00000000252f0a0f0b0f0c0f522fa00fb00fc00f0000f40ffb0fffff000006bf18ef1cef";
/** @const */ var PALETTES = "" +
"0000223f326f437f" + // 0
"0000000f335f547f" + // 1
"0000657f999faaaf" + // 2
"00000000b65fd98f" + // 3
"0000fffff33f3aff" + // 4
"000f333f777fbbbf" + // 5
"000000000000000f" + // 6
"00000000222f333f" + // 7
"000f444f777fbbbf" + // 8
"000006bf18ef1cef" + // 9
"0000414f102f657f" + // 10
"0000f40ffb0fff0f" + // 11
"0000000000000006" + // 12
"000f444f888fbbbf" + // 13

// FIRST_CUSTOM_PALETTE:
"00006b0f8e0fffff" + // +0
"0000f40ffb0fffff" + // +1
"000007bf0bffffff" + // +2
"0000202920292029" + // +3
"334f325f436f536f" + // +4
"0000415fbabfedef" + // +5
"0000000f323f525f";  // +6

// "0000a2bfe7ffffff" lila potion

// /** @const */ var DEFAULT_PALETTES = [ 0, 4, 1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13, 11, 14, 15, 15, 15, 15, 15, 15 ];
/** @const */ var DEFAULT_PALETTES = [ 0, 1, 2, 6, 12, 1, 4, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6, 7, 8, 9, 10, 10, 11, 11, 11, 13, 12, 13, 13, 13, 13, 13, 13, 19, 19, 19, 19 ];
//                                     0  1  2  3  4   5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36


/** @const */ var SPRITESHEET_URL = "./sprites.png";
/** @const */ var T_CEILING = 0;
/** @const */ var T_WALL = 1;
/** @const */ var T_CUBE = 2;
/** @const */ var T_DOOR_2_4 = 4;
/** @const */ var T_DOOR_1_3 = 5;
/** @const */ var T_POTION = 12;
/** @const */ var T_SW2_OFF_LAYER = 13;
/** @const */ var T_SW2_ON_LAYER = 14;
// /** @const */ var T_SW = 17;
// /** @const */ var T_SW_ON_LAYER = 18;
/** @const */ var T_SW_OFF = 17;
/** @const */ var T_SW_ON = 18;
/** @const */ var T_CRYSTAL = 19;
/** @const */ var T_SW2_OFF = 20;
/** @const */ var T_SW2_ON = 21;
/** @const */ var T_EXPLOSION_1 = 22;
/** @const */ var T_EXPLOSION_2 = 23;
/** @const */ var T_EXPLOSION_3 = 24;
/** @const */ var T_PORTAL = 25;
/** @const */ var T_SHADOW = 26;
/** @const */ var T_FIRST_GROUND = 27;
/** @const */ var T_CUBE_SIDE_1 = 33;
/** @const */ var T_CUBE_SIDE_2 = 34;
/** @const */ var T_CUBE_SIDE_3 = 35;
/** @const */ var T_CUBE_SIDE_4 = 36;


/** @const */ var SOUND_SAMPLES = [
	[1,0.13,0.01,,0.4,0.36,,0.12,0.64,,,,,,,0.83,,,1,,,,,0.3],
	[3,0.05,0.09,0.2,0.5,0.13,,-0.2,,,,,,,,,0.05,-0.05,1,,,0.45,-0.8,0.5],
	[3,,0.14,,0.04,0.12,,-0.24,,,,,,,,,,,0.51,,,,,0.5],
	[0,0.1,0.01,,0.47,0.35,,0.22,,,,,,,,0.7,,,1,,,,,0.5],
	[0,0.16,0.1,0.26,0.6,0.3,,-0.22,,,,,,,,0.6,,,1,,,0.7,,0.5],
	[3,0.24,0.32,,0.89,0.18,,-0.26,,,,,,,,0.6,,,0.79,-0.06,,0.62,,0.5],
	// SOUND_FIRST_SONG_SAMPLE:
	[0,,0.1663,0.4848,0.0778,0.1199,,-0.2491,,,,0.5415,0.8741,,,,0.0582,-0.254,1,,,,,0.32],
	[3,,0.25,0.7355,1,0.604,,,,,,,,,,0.4164,,,1,,,,,0.3],
	[0,0.08,0.01,,0.28,0.4099,,-0.0399,,,,,,0.019,0.1726,,,,1,,,,,0.43],
	[0,0.0799,0.01,,1,0.4099,,,,,,,,0.019,0.1726,,,,1,,,,,0.43]
];

/** @const */ var SONGS = [
	[
		150,
		[
			[ 2, 49, [ 34,38,41,45,46,45,41,38,34,38,41,45,46,45,41,38,34,38,41,45,46,45,41,38,34,38,41,45,46,45,41,38,33,37,40,44,45,44,40,37,33,37,40,44,45,44,40,37,33,37,40,44,45,44,40,37,33,37,40,44,45,44,40,37] ],
			[ 3, 49, [ 22,,,,,,,,,,,,,,,,,,,,,,,,,,,,26,,,,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,21,,,97] ],
			[ 3, 49, [ ,,26,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,,0] ],
			[ 0, 49, [ 37,49,,,37,49,,,,,,,,,,,,,,,,,,,,,,,,,,49,37,49,,,37,49,,,,,,,,,,,,,,,,,,,,,,,,,,0] ],
			[ 1, 49, [ ,,,,,,,,49,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,49,,,,,,,,,,,,,,,,,,,,,,,0] ],
			[ 2, 49, [ 32,36,39,43,44,43,39,36,32,36,39,43,44,43,39,36,31,35,38,42,43,42,38,35,31,35,38,42,43,42,38,35,30,,34,,37,,41,,42,,41,,37,,34,,29,,,33,,,,36,,,,,,40,,0] ],
			[ 3, 49, [ 20,,,,,,,,,,,,,,,,19,,,,,,,,,,,,,,22,,18,,,,,,,,,,,,,,21,,17,,,,,,,,,,,,21,,,0] ],
			[ 3, 49, [ ,,24,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,0] ],
			[ 0, 49, [ 37,49,,,37,49,,,,,,,,,,49,37,49,,,37,49,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,0] ],
			[ 1, 49, [ ,,,,,,,,49,,,,,,,,,,,,,,,,49,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,0] ],
		],
		[
			[1, , , , , , , , ,0],
			[1,1, , , , , , , ,0],
			[1,1,1, , , , , , ,0],
			[1,1,1,1,1, , , , ,0],
			[1,1,1,1,1, , , , ,0],
			[ , , , , ,1,1,1,1,1]
		],
		0
	]
];
