<?php
	require_once('map_functions.php');
	
	if (array_key_exists('map', $_GET))
	{
		$current_map = array_key_exists('map', $_GET) ? $_GET['map'] : '';
		$current_map_version = array_key_exists('map_version', $_GET) ? $_GET['map_version'] : '';
		
		if (!isValidMap($current_map, $current_map_version))
		{
			header("Location: ?");
			die();
		}
		
		setcookie('map', $current_map, time() + 3600 * 23 * 365);
		setcookie('map_version', $current_map_version, time() + 3600 * 23 * 365);
		
		if (array_key_exists('edit', $_GET))
		{
			header("Location: editor.php");
			die();
		}
		else
		{
			header("Location: index.php");
			die();
		}
	}
	
	$tmp = scandir("./data/maps");
	
	natsort($tmp);
	
	$maps = array();
	
	foreach ($tmp as $file)
	{
		if (!preg_match('/^[-_a-z0-9]+_[-_a-z0-9]+\.js$/', $file))
		{
			continue;
		}
		$file = substr($file, 0, -3);
		
		$tmp = explode("_", $file);
		
		$map = join("_", array_slice($tmp, 0, count($tmp) - 3));
		$version = join("_", array_slice($tmp, count($tmp) - 3, 3));
		
		$gz = "./data/maps/" . $map . "_" . $version . ".js.gz";
		
		if (file_exists($gz))
		{
			$size = filesize("./data/maps/" . $map . "_" . $version . ".js.gz");
		}
		else
		{
			$size = -1;
		}
		
		$maps[] = array($map, $version, $size);
	}
?>
<html>
	<head>
		<title>Select map</title>
		<style type="text/css">
			body
			{
			}
			td
			{
				padding: 0 16px 0 0;
				margin: 0;
			}
			table
			{
				border-collapse: collapse;
			}
			tr:hover
			{
				background: #eee;
			}
		</style>
	</head>
<body>
	<table>
<?php
	foreach ($maps as $a)
	{
		$b = "map=" . $a[0] . "&map_version=" . $a[1];
		
		echo "\t\t<tr><td>" . $a[0] . "</td><td>" . $a[1] . "</td><td><a href=\"?" . $b . "&edit\">Edit</a></td><td><a href=\"?" . $b . "&play\">Play</a></td><td>" . ($a[2] != -1 ? $a[2] : "") . "</td></tr>";
	}
?>
	</table>
</body>
</html>