<?php
header('Content-Type: text/html; charset=utf-8');

$servername = "server";
$username = "user";
$password = "pass";
$dbmane = "database";
$conn = new mysqli($servername, $username, $password, $dbmane);
$conn->set_charset("utf8");

if (isset($_GET['function']) == 'getAdvert') {

	$limitFrom = $_GET['limitFrom'];
	$limitTo = $_GET['limitTo'];
    $sql2 = "SELECT * FROM advert LIMIT ". $limitFrom .", ". $limitTo;
	$result = $conn->query($sql2);
	// $row = $result->fetch_assoc();
	$outLista = [];
	while($row = mysqli_fetch_assoc($result)) {
		array_push($outLista,$row);
	}
	print_r(json_encode($outLista));

}



?>