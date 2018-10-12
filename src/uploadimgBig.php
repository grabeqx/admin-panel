<?php
    $success = 0;
    $uploadedFile = '';
    $uploadPath = 'img/advert/';
    $date = new DateTime();
    $filename = $date->getTimestamp() . basename( $_FILES['file']['name']);
    $targetPath = $uploadPath . $filename;
    if(@move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)){
        $success = 1;
        echo $filename;
    } else {
        echo 'lipa';
    }
?>