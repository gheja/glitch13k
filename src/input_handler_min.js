"use strict";

var inputKeys = [
	{ k: [ 38, 87 ], a: 0, b: 0 }, // IH_KEY_UP
	{ k: [ 39, 68 ], a: 0, b: 0 }, // IH_KEY_RIGHT
	{ k: [ 40, 83 ], a: 0, b: 0 }, // IH_KEY_DOWN
	{ k: [ 37, 65 ], a: 0, b: 0 }, // IH_KEY_LEFT
	{ k: [ 81 ], a: 0, b: 0 }, // IH_KEY_GRAB
	{ k: [ 69 ], a: 0, b: 0 }, // IH_KEY_USE
	{ k: [ 82 ], a: 0, b: 0 } // IH_KEY_THROW
];

function inputSetKeyboardStatus(key, status)
{
	inputKeys[key].a = status;
}

function inputSetKeyboardStatusByCode(keyCode, status)
{
	var i;
	
	for (i=0; i<inputKeys.length; i++)
	{
		if (inputKeys[i].k.indexOf(keyCode) != -1)
		{
			inputKeys[i].a = status;
		}
	}
}

function inputSetTouchStatusOn(key)
{
	inputKeys[key].b = 1;
}

function inputClearTouchStatuses()
{
	var i;
	
	for (i=0; i<inputKeys.length; i++)
	{
		inputKeys[i].b = 0;
	}
}

function inputIsKeyActive(key)
{
	return (inputKeys[key].a || inputKeys[key].b);
}

function inputOnKeyDown(e)
{
	inputSetKeyboardStatusByCode(e.which ? e.which : e.keyCode, 1);
}

function inputOnKeyUp(e)
{
	inputSetKeyboardStatusByCode(e.which ? e.which : e.keyCode, 0);
}

function inputInit()
{
	window.addEventListener('keydown', inputOnKeyDown);
	window.addEventListener('keyup', inputOnKeyUp);
}
