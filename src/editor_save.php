<?php
	require_once('map_functions.php');
	
	error_reporting(E_ALL);
	ini_set('display_errors', 'on');
	
	if (array_key_exists('submit', $_POST))
	{
		$suffix = 1;
		
		while (file_exists("data/map_data.js." . $suffix) || file_exists("data/map_data.json." . $suffix))
		{
			$suffix++;
		}
		
		$map_width = (int) $_POST['map_width'];
		$map_height = (int) $_POST['map_height'];
		$map_data = $_POST['map_data'];
		
		$map_name = $_POST['map_name'];
		if (!preg_match('/^[-_a-z0-9]+$/', $map_name))
		{
			echo "Invalid name.\n";
			die();
		}
		
		$map_version = getNextMapVersion($map_name);
		
		$objs_data = str_replace("\r", "", $_POST['map_objs']);
		$init_script = str_replace("\r", "", $_POST['map_init']);
		$update_script = str_replace("\r", "", $_POST['map_update']);
		
		// remove the invalid object entries
		$tmp = explode("\n", $objs_data);
		$objs = array();
		foreach ($tmp as $a)
		{
			$a = trim($a);
			$a = preg_replace('/\s+/', ' ', $a);
			
			if ($a == "" || !preg_match('/^[A-Za-z]/', $a))
			{
				continue;
			}
			
			$objs[] = $a;
		}
		
		$special_objects = array("LightsOut");
		$obj_names = array();
		
		// sort the objects
		$first = array('Player');
		$last = array('Potion');
		$objs2 = array();
		foreach ($objs as $a)
		{
			$b = explode(' ', $a);
			if (in_array($b[1], $first))
			{
				$objs2[] = $a;
			}
		}
		
		foreach ($objs as $a)
		{
			$b = explode(' ', $a);
			if (!in_array($b[1], $first) && !in_array($b[1], $last))
			{
				$objs2[] = $a;
			}
		}
		
		foreach ($objs as $a)
		{
			$b = explode(' ', $a);
			if (in_array($b[1], $last))
			{
				$objs2[] = $a;
			}
		}
		
		$objs = array_slice($objs2, 0);
		//
		
		$output = "";
		$output .= "// DEBUG BEGIN\n";
		$output .= "try {\n";
		$output .= "// DEBUG END\n";
		$output .= "var MAP_WIDTH = " . $map_width . ";\n";
		$output .= "var MAP_HEIGHT = " . $map_height . ";\n";
		$output .= "var MAP_DATA = \"" . $map_data . "\";\n";
		$output .= "var MAP_OBJECT_NAMES;\n";
		
		foreach ($objs as $i=>$obj)
		{
			$tmp = explode(" ", $obj);
			
			if (!in_array($tmp[1], $special_objects))
			{
				continue;
			}
			
			$output .= "\tvar " . $tmp[0] . ";\n";
		}
/*
		foreach ($objs as $i=>$obj)
		{
			$tmp = explode(" ", $obj);
			
			$output .= "var " . $tmp[0] . ";\n";
		}
*/
		
		$output .= "// DEBUG BEGIN\n";
		$output .= "} catch (err) { alert(err); }\n";
		$output .= "// DEBUG END\n";
		$output .= "\n";
		
		$output .= "function mapInit()\n";
		$output .= "{\n";
		$output .= "// DEBUG BEGIN\n";
		$output .= "\ttry {\n";
		$output .= "// DEBUG END\n";
		$output .= "\t_objs.length = 0;\n";
		$output .= "\t\n";
		$output .= "\tmapLoadFromString(MAP_WIDTH, MAP_HEIGHT, MAP_DATA);\n";
		$output .= "\t\n";
		
		$output .= "\t_objs.push(\n";
		
		foreach ($objs as $i=>$obj)
		{
			$tmp = explode(" ", $obj);
			
			if (in_array($tmp[1], $special_objects))
			{
				continue;
			}
			
			$obj_names[] = $tmp[0];
			
			$output .= "\t\tnew Obj" . $tmp[1] . "(";
			
			for ($j=2; $j<count($tmp); $j++)
			{
				$output .= $tmp[$j];
				
				if ($j != count($tmp) - 1)
				{
					$output .= ", ";
				}
			}
			
			if ($i != count($objs) - 1)
			{
				$output .= "),\n";
			}
			else
			{
				$output .= ")\n";
			}
		}
		$output .= "\t);\n";
		
/*
		$j = 0;
		foreach ($objs as $i=>$obj)
		{
			$tmp = explode(" ", $obj);
			
			if (in_array($tmp[1], $special_objects))
			{
				continue;
			}
			
			$output .= "\t" . $tmp[0] . " = _objs[" . $j . "];\n";
			$j++;
		}
*/
		
		foreach ($objs as $i=>$obj)
		{
			$tmp = explode(" ", $obj);
			
			if (!in_array($tmp[1], $special_objects))
			{
				continue;
			}
			
			$output .= "\t" . $tmp[0] . " = new " . $tmp[1] . "(";
			
			for ($j=2; $j<count($tmp); $j++)
			{
				$output .= $tmp[$j];
				
				if ($j != count($tmp) - 1)
				{
					$output .= ", ";
				}
			}
			
			$output .= ");\n";
		}
		
		$output .= "\n";
		$output .= "\tMAP_OBJECT_NAMES = [ '" . join("', '", $obj_names) . "'];\n";
		$output .= "\n";
		$output .= $init_script . "\n";
		$output .= "// DEBUG BEGIN\n";
		$output .= "} catch (err) { alert(err); }\n";
		$output .= "// DEBUG END\n";
		$output .= "}\n";
		
		$output .= "\n";
		
		$output .= "function mapUpdate()\n";
		$output .= "{\n";
		$output .= "// DEBUG BEGIN\n";
		$output .= "try {\n";
		$output .= "// DEBUG END\n";
		
		$j = 0;
		foreach ($objs as $i=>$obj)
		{
			$tmp = explode(" ", $obj);
			
			if (in_array($tmp[1], $special_objects))
			{
				continue;
			}
			
			$output .= "\tvar " . $tmp[0] . " = _objs[" . $j . "];\n";
			$j++;
		}
		
		$output .= $update_script . "\n";
		$output .= "// DEBUG BEGIN\n";
		$output .= "} catch (err) { alert(err); }\n";
		$output .= "// DEBUG END\n";
		$output .= "}\n";
		
		file_put_contents("data/maps/" . $map_name . "_" . $map_version . ".json", json_encode($_POST));
		file_put_contents("data/maps/" . $map_name . "_" . $map_version . ".js", $output);
		file_put_contents("data/maps/" . $map_name . "_" . $map_version . ".js.gz", gzencode($output, 9));
		
		setcookie('map', $map_name, time() + 3600 * 23 * 365);
		setcookie('map_version', $map_version, time() + 3600 * 23 * 365);
		
		header("Location: editor.html");
	}
?>
