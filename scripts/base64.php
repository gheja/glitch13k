<?php
	for ($i=1; $i<count($_SERVER['argv']); $i++)
	{
		echo "data:image/png;base64," . base64_encode(file_get_contents($_SERVER['argv'][$i])) . "\n";
	}
?>
