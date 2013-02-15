<?php

/* Execute the query. */    

$data = $_POST['data'];

$user_name = $data['user_name'];
$user_pass = $data['user_pass'];
if($user_name) {

	$server = "BCISERVER01\\EXPRESS";
	$options = array(  "UID" => "diagramer",  "PWD" => "Face1010",  "Database" => "NSDiagram");
	$conn = sqlsrv_connect($server, $options);
	if ($conn === false) die("<pre>".print_r(sqlsrv_errors(), true));
	#echo "<p>Successfully connected!</p>";

	$sql = "SELECT * FROM dbo.users WHERE name='$user_name'";
	#echo "<p>QUERY: ".$sql."</p>";
	$query = sqlsrv_query($conn, $sql);
	if ($query === false) {
		exit("<pre>".print_r(sqlsrv_errors(), true));
	}

	$row = sqlsrv_fetch_array($query);
	if($row) {
		$password = $row[pass];
		if($password == $user_pass) {
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

