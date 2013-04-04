<?php
session_start();
$username = $_POST['data']['user_name'];
$userpass = $_POST['data']['user_pass'];

if(isset($username)) {

	$server = "BCISERVER01\\EXPRESS";
	$options = array(  "UID" => "diagramer",  "PWD" => "Face1010",  "Database" => "NSDiagram");
	$conn = sqlsrv_connect($server, $options);
	if ($conn === false) die("<pre>".print_r(sqlsrv_errors(), true));

	$params = array($username, $userpass);
	$sql = "SELECT * FROM dbo.users WHERE name = ? or email = ?"; 
	$query = sqlsrv_query($conn, $sql, $params); 
	if ($query === false) {
		exit("<pre>".print_r(sqlsrv_errors(), true));
	}

	$row = sqlsrv_fetch_array($query);
	if($row) {
		$password = $row[pass];
		if($password == sha1($userpass)) {
		//successful login
			$_SESSION['loggedin'] = "YES";
			$_SESSION['name'] = $username;
			$_SESSION['cdb']="1";
			echo json_encode($row);
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
	1- no username specified
	2- incorrect password
	3- user does not exist
*/

?>

