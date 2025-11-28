<?php

$host = "localhost";
$port = 5432;
$dbname = "your_database_name";
$username = "your_username";
$password = "your_password";


try{
    $pdo = new PDO ("pgsql:host=$host;port=$port;dbname=$dbname" , $username , $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE , PDO::ERRMODE_EXCEPTION) ;

}catch (Exception $e){
    die("Databse error : ". $e->getMessage());
}
