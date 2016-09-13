<?php
	if (array_key_exists('file1', $_FILES))
	{
		if (!file_exists($_FILES['file1']["tmp_name"]))
		{
			header("Location: update.php?error");
			die();
		}
		
		if (file_exists("images/spritesheet.png"))
		{
			$i = 0;
			
			while (file_exists("images/spritesheet_" . $i . ".png"))
			{
				$i++;
			}
			
			rename("images/spritesheet.png", "images/spritesheet_" . $i . ".png");
		}
		if (!move_uploaded_file($_FILES['file1']["tmp_name"], "images/spritesheet.png"))
		{
			header("Location: update.php?error");
			die();
		}
		header("Location: update.php?ok");
		die();
	}
?>
<html>
	<head>
		<title>glitch13k / gfx / update</title>
	</head>
	<body>
		<img src="images/spritesheet.png?r=<?php echo rand(); ?>" /><br/>
		<form action="update.php" method="post" enctype="multipart/form-data">
			<input type="file" name="file1" id="file1" multiple="multiple"/> <input type="submit" name="upload_submit" value="Go!" />
		</form>
	</body>
</html>
