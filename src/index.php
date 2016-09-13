<?php
	require_once('map_functions.php');
	
	$current_map = array_key_exists('map', $_COOKIE) ? $_COOKIE['map'] : '';
	$current_map_version = array_key_exists('map_version', $_COOKIE) ? $_COOKIE['map_version'] : '';
	
	if (!isValidMap($current_map, $current_map_version))
	{
		header("Location: editor_list.php");
		die();
	}
	
	$basename = "data/maps/" . $current_map . "_" . $current_map_version;
	
	$js_url = $basename . ".js";
	$json_url = $basename . ".json";
?>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui" />
		<script type="text/javascript" src="consts.js"></script>
		<script type="text/javascript" src="resources.js"></script>
		<script type="text/javascript" src="lib.js"></script>
		<script type="text/javascript" src="input_handler.js"></script>
		<script type="text/javascript" src="gfx.js"></script>
		<script type="text/javascript" src="game.js"></script>
		<script type="text/javascript" src="map.js"></script>
		<script type="text/javascript" src="obj.js"></script>
		<script type="text/javascript" src="obj_player.js"></script>
		<script type="text/javascript" src="obj_cube.js"></script>
		<script type="text/javascript" src="obj_crystal.js"></script>
		<script type="text/javascript" src="obj_potion.js"></script>
		<script type="text/javascript" src="obj_switch.js"></script>
		<script type="text/javascript" src="obj_switch2.js"></script>
		<script type="text/javascript" src="obj_explosion.js"></script>
		<script type="text/javascript" src="obj_door.js"></script>
		<script type="text/javascript" src="obj_portal.js"></script>
		<script type="text/javascript" src="layer.js"></script>
		<script type="text/javascript" src="lights_out.js"></script>
		<script type="text/javascript" src="projection.js"></script>
		<script type="text/javascript" src="glitch.js"></script>
		<script type="text/javascript" src="profiler.js"></script>
		<script type="text/javascript" src="jsfxr.js"></script>
		<script type="text/javascript" src="synth.js"></script>
		<script type="text/javascript" src="touch.js"></script>
		<script type="text/javascript" src="ui.js"></script>
		<script type="text/javascript" src="main.js"></script>
<!--
		<script type="text/javascript" src="map_data.js"></script>
-->
		<script type="text/javascript" src="<?php echo $js_url; ?>"></script>
		<!-- insert minified javascript here -->
		<style type="text/css">
			html,
			body
			{
				background: #111;
			}
			#errors
			{
				position: fixed;
				right: 0;
				bottom: 0;
				left: 0;
				padding: 4px;
				background: rgba(255, 0, 0, 0.5);
				color: #fff;
				max-height: 200px;
				z-index: 10001;
				display: none;
			}
		</style>
	</head>
	<body>
		<canvas id="canvas2" width="200" height="100">Canvas not supported :(</canvas>
		<div id="errors"></div>
	</body>
</html>
