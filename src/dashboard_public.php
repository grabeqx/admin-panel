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
    $sql2 = "SELECT advert.*, maincat.Category AS 'category', advert_promo.PromoTyp AS 'promo', advert_promo.PromoDo AS 'promoDo', log_userinfo.ip AS 'ip' FROM advert LEFT JOIN maincat ON advert.idCategory = maincat.idCategory LEFT JOIN log_userinfo ON advert.id_userinfo = log_userinfo.id LEFT JOIN advert_promo ON advert.idAdvert = advert_promo.PromoAdvertId AND advert_promo.PromoDo >= CURDATE() ORDER BY CASE WHEN advert_promo.PromoAdvertId IS NOT NULL THEN 0 ELSE 1 END, advert.". $sorting ." ". $sortDierction ." LIMIT ". $limitFrom .", ". $limitTo;
	$result = $conn->query($sql2);
	$outLista = [];
	while($row = mysqli_fetch_assoc($result)) {
		array_push($outLista,$row);
	}
	print_r(json_encode($outLista));
}

if ($_GET['function'] == 'search') {

	$searchValue = $_GET['searchValue'];
	$type = $_GET['type'];
	$fraze = '';
	if($type === 'ip') {
		$fraze = 'log_userinfo.'.$type;
	} else {
		$fraze = 'advert.'.$type;
	};
    $sql2 = "SELECT advert.*, maincat.Category AS 'category', advert_promo.PromoTyp AS 'promo', advert_promo.PromoDo AS 'promoDo', log_userinfo.ip AS 'ip' FROM advert LEFT JOIN maincat ON advert.idCategory = maincat.idCategory LEFT JOIN log_userinfo ON advert.id_userinfo = log_userinfo.id LEFT JOIN advert_promo ON advert.idAdvert = advert_promo.PromoAdvertId AND advert_promo.PromoDo >= CURDATE() WHERE ". $fraze ." LIKE '%". $searchValue ."%' ORDER BY CASE WHEN advert_promo.PromoAdvertId IS NOT NULL THEN 0 ELSE 1 END, advert.idAdvert";
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

if ($_GET['function'] == 'getTags') {

	$category = $_GET['category'];
    $sql2 = "SELECT * FROM tags_pl WHERE idCategory = ". $category;
	$result = $conn->query($sql2);
	$outLista = [];
	while($row = mysqli_fetch_assoc($result)) {
		array_push($outLista,$row);
	}
	print_r(json_encode($outLista));
}

if ($_GET['function'] == 'getPostcode') {

    $sql2 = "SELECT postcode FROM postcode";
	$result = $conn->query($sql2);
	$outLista = [];
	while($row = mysqli_fetch_assoc($result)) {
		array_push($outLista,$row);
	}
	print_r(json_encode($outLista));
}

if ($_GET['function'] == 'submit') {
	$json = $_GET['data'];
	$data = json_decode($json, true);
	$sql2 = "UPDATE advert SET Title = '". $data['Title'] ."', Price = ". $data['Price'] .", ValueText = '". $data['ValueText'] ."', ValueTags = '". $data['ValueTags'] ."', Postcode = '". $data['Postcode'] ."', pdIndex = ". $data['pdIndex'] .", Location = '". $data['Location'] ."', LocationIndex = '". $data['LocationIndex'] ."', LocationSlug = '". $data['LocationSlug'] ."', AreaSlug = '". $data['AreaSlug'] ."', CountrySlug = '". $data['CountrySlug'] ."', Description = '". $data['Description'] ."', DateCreated = '". $data['DateCreated'] ."', LastModified = '". $data['LastModified'] ."', Date = '". $data['Date'] ."', Landline = '". $data['Landline'] ."', Mobile = '". $data['Mobile'] ."', Email = '". $data['Email'] ."', UseEmail = ". $data['UseEmail'] .", Agent = ". $data['Agent'] .", company = '". $data['company'] ."', skype = '". $data['skype'] ."', msn = '". $data['msn'] ."', contact_type = '". $data['contact_type'] ."', contact_id = '". $data['contact_id'] ."', Name = '". $data['Name'] ."', idCategory = '". $data['idCategory'] ."', Type = '". $data['Type'] ."', UserTag = '". $data['UserTag'] ."', UserTagSlug = '". $data['UserTagSlug'] ."', adPassword = '". $data['adPassword'] ."', id_userinfo = '". $data['id_userinfo'] ."', expires = ". $data['expires'] .", MainFile = '". $data['MainFile'] ."', UploadedFiles = '". $data['UploadedFiles'] ."', Slug = '". $data['Slug'] ."', Tags = '". $data['Tags'] ."' WHERE idAdvert = ". $data['idAdvert'];
	$result = $conn->query($sql2);
	
	echo $_GET['data'];
}
if ($_GET['function'] == 'remove') {
	$adToRemove = explode(",", $_GET['adToRemove']);
	foreach ($adToRemove as $ad) {
		$sql2 .= "DELETE FROM advert WHERE idAdvert = ";
		$sql2 .= $ad;
		$sql2 .= "; ";
	}
	$result = $conn->query($sql2);
	echo $result;
}

if ($_GET['function'] == 'getPromoTypes') {

    $sql2 = "SELECT * FROM promo_typy";
	$result = $conn->query($sql2);
	$outLista = [];
	while($row = mysqli_fetch_assoc($result)) {
		array_push($outLista,$row);
	}
	print_r(json_encode($outLista));
}

if ($_GET['function'] == 'makePromo') {

	$id = $_GET['id'];
	$promoOd = $_GET['promoOd'];
	$promoDo = $_GET['promoDo'];
	$promoTyp = $_GET['promoTyp'];	
    $sql2 = "INSERT INTO advert_promo (PromoAdvertId, PromoTyp, PromoSort, PromoOd, PromoDo) VALUES (". $id .", ". $promoTyp .", 2, '". $promoOd ."', '". $promoDo ."')";
	$result = $conn->query($sql2);
}

if ($_GET['function'] == 'removePromo') {

	$id = $_GET['id'];
    $sql2 = "DELETE FROM advert_promo WHERE PromoAdvertId = " .$id;
	$result = $conn->query($sql2);
	echo $result;
}

?>