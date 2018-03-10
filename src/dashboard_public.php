<?php
header('Content-Type: text/html; charset=utf-8');

$servername = "server";
$username = "user";
$password = "pass";
$dbmane = "database";
$conn = new mysqli($servername, $username, $password, $dbmane);
$conn->set_charset("utf8");

if ($_GET['function'] == 'getAdverts') {

	$limitFrom = $_GET['limitFrom'];
	$limitTo = $_GET['limitTo'];
	$sorting = $_GET['sorting'];
	$sortDierction = $_GET['sortDierction'];
    $sql2 = "SELECT advert.*, maincat.Category AS 'category', advert_promo.PromoTyp AS 'promo', advert_promo.PromoDo AS 'promoDo' FROM advert LEFT JOIN maincat ON advert.idCategory = maincat.idCategory LEFT JOIN advert_promo ON advert.idAdvert = advert_promo.PromoAdvertId AND advert_promo.PromoDo >= CURDATE() ORDER BY CASE WHEN advert_promo.PromoAdvertId IS NOT NULL THEN 0 ELSE 1 END, advert.". $sorting ." ". $sortDierction ." LIMIT ". $limitFrom .", ". $limitTo;
	$result = $conn->query($sql2);
	$outLista = [];
	while($row = mysqli_fetch_assoc($result)) {
		array_push($outLista,$row);
	}
	print_r(json_encode($outLista));
}

if ($_GET['function'] == 'search') {

	$searchValue = $_GET['searchValue'];
    $sql2 = "SELECT advert.*, maincat.Category AS 'category', advert_promo.PromoTyp AS 'promo', advert_promo.PromoDo AS 'promoDo' FROM advert LEFT JOIN maincat ON advert.idCategory = maincat.idCategory LEFT JOIN advert_promo ON advert.idAdvert = advert_promo.PromoAdvertId AND advert_promo.PromoDo >= CURDATE() WHERE advert.Title LIKE '%". $searchValue ."%' ORDER BY CASE WHEN advert_promo.PromoAdvertId IS NOT NULL THEN 0 ELSE 1 END, advert.idAdvert";
	$result = $conn->query($sql2);
	$outLista = [];
	while($row = mysqli_fetch_assoc($result)) {
		array_push($outLista,$row);
	}
	print_r(json_encode($outLista));
}

if ($_GET['function'] == 'getAdvert') {

	$advertId = $_GET['advertId'];
    $sql2 = "SELECT advert.*, maincat.Category AS 'category', advert_promo.PromoTyp AS 'promo', advert_promo.PromoDo AS 'promoDo' FROM advert LEFT JOIN maincat ON advert.idCategory = maincat.idCategory LEFT JOIN advert_promo ON advert.idAdvert = advert_promo.PromoAdvertId AND advert_promo.PromoDo >= CURDATE() WHERE advert.idAdvert = ". $advertId;
	$result = $conn->query($sql2);
	$outLista = [];
	while($row = mysqli_fetch_assoc($result)) {
		array_push($outLista,$row);
	}
	print_r(json_encode($outLista));
}



?>