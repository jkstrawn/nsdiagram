<?php
session_start();
$oldPass = $_POST['data']['user_old_pass'];
$newPass = $_POST['data']['user_new_pass'];

if(isset($oldPass)) {

	$server = "BCISERVER01\\EXPRESS";
	$options = array(  "UID" => "diagramer",  "PWD" => "Face1010",  "Database" => "NSDiagram");
	$conn = sqlsrv_connect($server, $options);
	if ($conn === false) die("<pre>".print_r(sqlsrv_errors(), true));

	$params = array($_SESSION['name']);
	$sql = "SELECT * FROM dbo.users WHERE name = ?"; 
	$query = sqlsrv_query($conn, $sql, $params); 
	if ($query === false) {
		exit("<pre>".print_r(sqlsrv_errors(), true));
	}

	$row = sqlsrv_fetch_array($query);
	if($row) {
		$password = $row[pass];
		if($password == sha1($oldPass)) {
			//correct user, so change password
			$newPass = sha1($newPass);
			$params = array($newPass, $_SESSION['name']);
			$sql = "UPDATE dbo.users set pass = ? where name = ?"; 
			$query = sqlsrv_query($conn, $sql, $params); 
			if ($query === false) {
				exit("<pre>".print_r(sqlsrv_errors(), true));
			} else {
				//successful password change
				echo json_encode(4);
			}
		} else {
			echo json_encode(2);
		}
	} else {
		echo json_encode(3);
	}

	sqlsrv_free_stmt($query);


	sqlsrv_close($conn);
} else {
	echo json_encode(1);
}

/*Error Codes
	1- old password not specified
	2- incorrect password
	3- database issue, relog maybe
	4- successful change
*/

?>

