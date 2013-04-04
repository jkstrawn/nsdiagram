<?php
session_start();

$user_name = $_POST['data']['user_name'];
$user_pass = $_POST['data']['user_pass'];
$user_email = $_POST['data']['user_email'];
$today = date("Y-m-d H:i:s");

if($user_name) {

	$server = "BCISERVER01\\EXPRESS";
	$options = array(  "UID" => "diagramer",  "PWD" => "Face1010",  "Database" => "NSDiagram");
	$conn = sqlsrv_connect($server, $options);
	if ($conn === false) die("<pre>".print_r(sqlsrv_errors(), true));

	#Check if the name is in use
	$params = array($user_name);
	$sql = "SELECT * FROM dbo.users WHERE name = ?"; 
	$query = sqlsrv_query($conn, $sql, $params); 
	if ($query === false) {
		exit("<pre>".print_r(sqlsrv_errors(), true));
	}
	$row = sqlsrv_fetch_array($query);
	sqlsrv_free_stmt($query);

	if($row) {
		#If the name is being used, send error
		echo json_encode(2);
	} else {
		if($user_pass) {
			$user_pass = sha1($user_pass);
			#The name is available, so create a new user
			$params = array($user_name, $user_pass, $user_email, $today);
			$sql = "INSERT into users(name, pass, email, date) values(?, ?, ?, ?)"; 
			$query = sqlsrv_query($conn, $sql, $params);
			if ($query === false) {
				exit("<pre>".print_r(sqlsrv_errors(), true));
			} else {
				//successful register			
				$_SESSION['loggedin'] = "YES";
				$_SESSION['name'] = $user_name;
				echo json_encode(3);
			}
			sqlsrv_free_stmt($query);			
		} else {
			echo json_encode(5);
		}
	}

	sqlsrv_close($conn);
} else {
	echo json_encode(1);
}

/* Codes
	1- no username specified
	2- user name already in use
	3- successful register
	4- an error occured
	5- no password
*/

?>

