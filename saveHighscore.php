<?php
$data = $_POST['data'];
file_put_contents("highscore.json", $data);
?>