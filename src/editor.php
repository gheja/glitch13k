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
	
	$js_url = $basename . ".js?r=" . rand();
	$json_url = $basename . ".json?r=" . rand();
?>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui" />
		<script type="text/javascript" src="consts.js"></script>
		<script type="text/javascript" src="resources.js"></script>
		<script type="text/javascript" src="lib.js"></script>
		<script type="text/javascript" src="gfx.js"></script>
		<script type="text/javascript" src="map.js"></script>
		<script type="text/javascript" src="obj.js"></script>
		<script type="text/javascript" src="obj_player.js"></script>
		<script type="text/javascript" src="obj_cube.js"></script>
		<script type="text/javascript" src="obj_potion.js"></script>
		<script type="text/javascript" src="obj_switch.js"></script>
		<script type="text/javascript" src="obj_switch2.js"></script>
		<script type="text/javascript" src="obj_explosion.js"></script>
		<script type="text/javascript" src="obj_door.js"></script>
		<script type="text/javascript" src="obj_portal.js"></script>
		<script type="text/javascript" src="obj_highlight.js"></script>
		<script type="text/javascript" src="obj_crystal.js"></script>
		<script type="text/javascript" src="lights_out.js"></script>
		<script type="text/javascript" src="profiler.js"></script>
		<script type="text/javascript" src="editor.js"></script>
		<script type="text/javascript" src="<?php echo $js_url; ?>"></script>
		<script type="text/javascript">
			var MAP_JSON = "<?php echo $json_url; ?>";
		</script>
		<!-- insert minified javascript here -->
		<style type="text/css">
			body
			{
				padding: 30px 0 30px 0;
				margin: 0;
				background: #1b1b1b;
				color: #fff;
				font-size: 8pt;
				font-family: Arial;
			}
			#controls,
			#controls-play
			{
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				background: #444;
				padding: 4px;
				z-index: 10000;
			}
			#canvas2
			{
				position: fixed;
				top: 100px;
				right: 0;
				width: 200px;
				height: 120px;
				opacity: 0.8;
				z-index: 9000;
				display: none;
			}
			body.paused #canvas1
			{
				left: 0;
				top: 0;
			}
			#controls a,
			#controls a:hover,
			#controls a:active,
			#controls a:visited
			{
				text-decoration: none;
			}
			.tile_button_void,
			.tile_button_ground,
			.tile_button_wall,
			.tile_button_void2
			{
				width: 16px;
				height: 16px;
				margin: 0 2px 0 0;
				border: 2px solid #000000;
				float: left;
				display: block;
				overflow: hidden;
			}
			.tile_button_void
			{
				background: #111;
			}
			.tile_button_ground
			{
				background: #063;
			}
			.tile_button_wall
			{
				background: #b63;
			}
			.tile_button_void2
			{
				background: #022;
			}
			textarea
			{
				max-width: 100%;
				min-width: 100%;
				background: #222;
				color: #fff;
				border: none;
				resize: vertical;
			}
			.title
			{
				background: #555;
				padding: 2px 0 2px 4px;
				font-weight: bold;
				color: #aaa;
			}
			.title1
			{
				background: #123;
			}
			.title2
			{
				background: #132;
			}
			.title3
			{
				background: #321;
			}
			#map_objs
			{
				background: #012;
			}
			#map_init
			{
				background: #021;
			}
			#map_update
			{
				background: #210;
			}
			.button,
			.button_warning
			{
				margin: 0 0 0 4px;
				border: 0;
				background: #666;
				color: #ddd;
				padding: 4px 16px;
				font-size: 12px;
			}
			.button:active,
			.button:hover
			{
				background: #888;
				color: #fff;
			}
			.button_warning
			{
				background: #e50;
				color: #eee;
			}
			.button_warning:active,
			.button_warning:hover
			{
				background: #f60;
				color: #fff;
			}
			#buttons
			{
				text-align: right;
				position: fixed;
				right: 0;
				bottom: 0;
				left: 0;
				height: 30px;
			}
			.clearer
			{
				float: none;
				clear: both;
			}
			.invalid
			{
				background: #f66;
				border: #e00;
			}
		</style>
	</head>
	<body>
		<canvas id="canvas1">Canvas not supported :(</canvas>
		<form action="editor_save.php" method="post" onsubmit="return validateMapName()">
			<input id="map_width" name="map_width" type="hidden" value="" />
			<input id="map_height" name="map_height" type="hidden" value="" />
			<input id="map_data" name="map_data" type="hidden" value="" />
			<div class="title title1" onclick="toggleTextarea('map_objs');">Objects</div>
			<textarea id="map_objs" name="map_objs" onkeyup="onTextareaChange();"></textarea>
			<div class="title title2" onclick="toggleTextarea('map_init');">Init script</div>
			<textarea id="map_init" name="map_init" onkeyup="onTextareaChange();"></textarea>
			<div class="title title3" onclick="toggleTextarea('map_update');">Update script</div>
			<textarea id="map_update" name="map_update" onkeyup="onTextareaChange();"></textarea>
			<br class="clearer" />
			<div id="controls">
				<a href="#" class="tile_button_void" onclick="editorSelectTile(TILE_VOID); return false;">&nbsp;</a>
				<a href="#" class="tile_button_ground" onclick="editorSelectTile(TILE_GROUND); return false;">&nbsp;</a>
				<a href="#" class="tile_button_wall" onclick="editorSelectTile(TILE_WALL); return false;">&nbsp;</a>
				<a href="#" class="tile_button_void2" onclick="editorSelectTile(TILE_VOID2); return false;">&nbsp;</a>
				<input id="zoom" type="checkbox" onclick="resize();" onchange="resize();"/>zoom | 
				<input type="text" id="map_name" name="map_name" value="<?php echo $current_map; ?>" onkeyup="validateMapName(true);" onchange="validateMapName(true);" />
				<input class="button" type="submit" id="submit" name="submit" value="Save" />
				<button class="button" onclick="if (checkUnsavedChanges()) { window.location = 'editor_list.php'; }; return false; ">Load map</button>
				<button class="button" onclick="if (checkUnsavedChanges()) { window.location = 'index.php'; }; return false;">Play</button>
			</div>
			<br class="clearer" />
		</form>
		<canvas id="canvas2" width="200" height="100">Canvas not supported :(</canvas>
	</body>
</html>
