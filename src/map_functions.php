<?php
	function isValidMap($map, $map_version)
	{
		if (!preg_match('/^[-_a-z0-9]+$/', $map) || !preg_match('/^[-_a-z0-9]+$/', $map_version))
		{
			return false;
		}
		
		$basename = "data/maps/" . $map . "_" . $map_version;
		
		if (!file_exists($basename . ".js") || !file_exists($basename . ".json"))
		{
			return false;
		}
		
		return true;
	}
	
	function getNextMapVersion($current_map)
	{
		$files = scandir("./data/maps");
		
		$i = 1;
		
		while (1)
		{
			$new_version = "v" . $i;
			
			$found = false;
			
			foreach ($files as $file)
			{
				if (!preg_match('/^[-_a-z0-9]+_[-_a-z0-9]+\.js$/', $file))
				{
					continue;
				}
				$file = substr($file, 0, -3);
				
				$tmp = explode("_", $file);
				
				$map = join("_", array_slice($tmp, 0, count($tmp) - 3));
				
				if ($map != $current_map)
				{
					continue;
				}
				
				$version = $tmp[count($tmp) - 3];
				
				if ($version == $new_version)
				{
					$found = true;
				}
			}
			
			if (!$found)
			{
				break;
			}
			
			$i++;
		}
		
		return $new_version . "_" . date("Ymd_His");
	}
?>
