"use strict";

var inputKeys = [
	{ keyCodes: [ 38, 87 ], keyboardActive: false, touchActive: false }, // IH_KEY_UP
	{ keyCodes: [ 39, 68 ], keyboardActive: false, touchActive: false }, // IH_KEY_RIGHT
	{ keyCodes: [ 40, 83 ], keyboardActive: false, touchActive: false }, // IH_KEY_DOWN
	{ keyCodes: [ 37, 65 ], keyboardActive: false, touchActive: false }, // IH_KEY_LEFT
	{ keyCodes: [ 81 ], keyboardActive: false, touchActive: false }, // IH_KEY_GRAB
	{ keyCodes: [ 69 ], keyboardActive: false, touchActive: false }, // IH_KEY_USE
	{ keyCodes: [ 77 ], keyboardActive: false, touchActive: false } // IH_KEY_MUTE
];

function inputSetKeyboardStatus(key, status)
{
	inputKeys[key].keyboardActive = status;
}

function inputSetKeyboardStatusByCode(keyCode, status)
{
	var i;
	
	for (i=0; i<inputKeys.length; i++)
	{
		if (inputKeys[i].keyCodes.indexOf(keyCode) != -1)
		{
			inputKeys[i].keyboardActive = status;
		}
	}
}

function inputSetTouchStatusOn(key)
{
	inputKeys[key].touchActive = true;
}

function inputClearTouchStatuses()
{
	var i;
	
	for (i=0; i<inputKeys.length; i++)
	{
		inputKeys[i].touchActive = false;
	}
}

function inputIsKeyActive(key)
{
	if (inputKeys[key].keyboardActive || inputKeys[key].touchActive)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function inputOnKeyDown(e)
{
	var keyCode;
	
	keyCode = e.which ? e.which : e.keyCode;
	
	inputSetKeyboardStatusByCode(keyCode, true);
}

function inputOnKeyUp(e)
{
	var keyCode;
	
	keyCode = e.which ? e.which : e.keyCode;
	
	inputSetKeyboardStatusByCode(keyCode, false);
}

function inputInit()
{
	window.addEventListener('keydown', inputOnKeyDown);
	window.addEventListener('keyup', inputOnKeyUp);
}
