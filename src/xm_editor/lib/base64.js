/** @const */
var BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/**
  * Returns a base64 encoded string of input data
  *
  * @nosideeffects
  * @param {array} data the array to be encoded
  * @returns {string}
  */
base64_encode = function(data)
{
	// the base64 encoding was originally written by @maettig for https://github.com/grumdrig/jsfxr
	
	var output = "", used = data.length;
	
	for (i = 0; i < used; i += 3)
	{
		a = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
		output += BASE64_CHARS[a >> 18] + BASE64_CHARS[a >> 12 & 63] + BASE64_CHARS[a >> 6 & 63] + BASE64_CHARS[a & 63];
	}
	i -= used;
	
	return output.slice(0, output.length - i) + '=='.slice(0, i);
}

// TODO: implement a cross-browser solution instead of atob()
/**
  * Returns an array of unsigned 8 bit integers from a base64 encoded string.
  *
  * @nosideeffects
  * @param {string} encoded_data to be decoded
  * @returns {array}
  */
base64_decode = function(encoded_data)
{
	var data = atob(encoded_data), output = [];
	
	for (i=0; i<data.length; i++)
	{
		output[i] = data.charCodeAt(i);
	}
	
	return output;
}

/**
  * Returns an array of signed 16 bit integers from a base64 encoded string.
  *
  * @nosideeffects
  * @param {string} encoded_data to be decoded
  * @returns {array}
  */
base64_to_int16array = function(encoded_data)
{
	var i, data = atob(encoded_data);
	
	var output = new Int16Array(data.length / 2);
	
	for (i=0; i<data.length/2; i++)
	{
		output[i] = data.charCodeAt(i*2+1) * 256 + data.charCodeAt(i*2);
	}
	
	return output;
}
