"use strict";


/** @const @type {number} */ var FINAL_WIDTH = 288;
/** @const @type {number} */ var FINAL_HEIGHT = 256;

/** @const @type {number} */ var FPS = 30;

// /** @const @type {number} */ var VIEW_WIDTH = 20;
// /** @const @type {number} */ var VIEW_HEIGHT = 18;
/** @const @type {number} */ var VIEW_WIDTH = 22;
/** @const @type {number} */ var VIEW_HEIGHT = 20;
/** @const @type {number} */ var VIEW_CENTER_X = VIEW_WIDTH / 2;
/** @const @type {number} */ var VIEW_CENTER_Y = VIEW_HEIGHT / 2;
/** @const @type {number} */ var VIEW_SPEED = 0.12;

/** @const @type {number} */ var WIDTH = VIEW_WIDTH * 16;
/** @const @type {number} */ var HEIGHT = VIEW_HEIGHT * 16;

// InputHandler
/** @const @type {number} */ var IH_KEY_UP = 0;
/** @const @type {number} */ var IH_KEY_RIGHT = 1;
/** @const @type {number} */ var IH_KEY_DOWN = 2;
/** @const @type {number} */ var IH_KEY_LEFT = 3;
/** @const @type {number} */ var IH_KEY_GRAB = 4;
/** @const @type {number} */ var IH_KEY_USE = 5;
// /** @const @type {number} */ var IH_KEY_THROW = 6;
/** @const @type {number} */ var IH_KEY_MUTE = 6;

/** @const @type {number} */ var IH_KEY_STAUTS_RESET = 0;
/** @const @type {number} */ var IH_KEY_STAUTS_PRESSED = 1;
/** @const @type {number} */ var IH_KEY_STAUTS_RELEASED = 2;

/** @const @type {number} */ var TILE_VOID = 0;
/** @const @type {number} */ var TILE_GROUND = 1;
/** @const @type {number} */ var TILE_WALL = 3;
// /** @const @type {number} */ var TILE_DOOR = 4;
/** @const @type {number} */ var TILE_PLAYER = 5;
/** @const @type {number} */ var TILE_VOID2 = 6;

/** @const @type {number} */ var STATUS_UNMAPPED = 0;
/** @const @type {number} */ var STATUS_MAPPING = 1;
/** @const @type {number} */ var STATUS_VALID = 2;

/** @const @type {number} */ var PLAYER_SPEED = 1;
/** @const @type {number} */ var PLAYER_SPEED_REDUCTION = 0.7;
/** @const @type {number} */ var SHAKE_REDUCTION = 0.7;
/** @const @type {number} */ var FADE_REDUCTION = 0.8;

/** @const @type {number} */ var POTION_TYPE_HEALTH = 0;
/** @const @type {number} */ var POTION_TYPE_BOOM = 1;
/** @const @type {number} */ var POTION_TYPE_SUPER = 2;

/** @const @type {number} */ var SOUND_SWITCH = 0;
/** @const @type {number} */ var SOUND_EXPLOSION = 1;
/** @const @type {number} */ var SOUND_GRAB = 2;
/** @const @type {number} */ var SOUND_TELEPORT = 3;
/** @const @type {number} */ var SOUND_POWERUP = 4;
/** @const @type {number} */ var SOUND_SUPER = 5;
/** @const @type {number} */ var SOUND_RELEASE = SOUND_GRAB;
/** @const @type {number} */ var SOUND_FIRST_SONG_SAMPLE = 6;
/** @const @type {number} */ var SOUND_FIRST_CRYSTAL_SAMPLE = SOUND_FIRST_SONG_SAMPLE + 4;

/** @const @type {number} */ var SONG_DATA_INTERVAL = 0;
/** @const @type {number} */ var SONG_DATA_CHANNELS = 1;
/** @const @type {number} */ var SONG_DATA_PATTERNS = 2;
/** @const @type {number} */ var SONG_DATA_PATTERN_LOOP_START = 3;

/** @const @type {number} */ var SONG_CHANNEL_DATA_SAMPLE_ID = 0;
/** @const @type {number} */ var SONG_CHANNEL_DATA_BASE_NOTE = 1;
/** @const @type {number} */ var SONG_CHANNEL_DATA_NOTES = 2;

/** @const */ var FIRST_CUSTOM_PALETTE = 14;
