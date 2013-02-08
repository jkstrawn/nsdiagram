<!DOCTYPE HTML>
<html>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<script type="text/javascript">
		//google analytics
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-36136584-1']);
		_gaq.push(['_trackPageview']);

		(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();

		var AjaxPostCall = function(url, dataJSON, callback, error) {
			$.ajax({
					type : 'POST',
					url : url,
					dataType : 'json',
					data: {
						data : dataJSON
					},
					success : function(data){
						callback(data);
					},
					error : function(err) {
						error(err.responseText);
					}
			});
		};

		function attemptLogin() {
			var userName = document.getElementById('txtName').value;
			var userPass = document.getElementById('txtPass').value;
			var replyText = {name: userName, pass: userPass};

			AjaxPostCall("login.php", replyText, function(data){
				console.log("data: " + data);

			}, function(error){
				console.log(error);
			});
		}

	</script>


	<head>
		<title>Nassi Shneiderman Diagram Maker</title>
		<meta name="description" content="Create, save, and load Nassi-Shneiderman charts all in the browser.">
		<meta name="keywords" content="Nassi, Shneiderman, diagram, chart, maker, flowchart, HTML, editor, ns, free">
		<meta name="author" content="Jeremy Strawn">
		<meta charset="UTF-8">
		<script src="scripts/jQuery/jquery.js"></script>
		<script src="scripts/jQuery/jquery.rightClick.js"></script>
		<script src="scripts/buttonJS.js"></script>
		<link rel="stylesheet" type="text/css" href="css/styles.css" />
	</head>

	<body>
		<div id="testshadow" style="z-index:-1;"> </div>

		<div id="main" class="center" style="z-index:1;">
			<div class="navbar">
			<ul>
				<li><a href="index.html">Home</a></li>
				<li><a href="notes.html">Patch Notes</a></li>
			<br style="clear: left" />
			</div>

			<div id="canvasContainer" tabindex="0" style="z-index: 1">
				<canvas id="menuCanvas" width="690" height="75" style='position:absolute; z-index:4; top: 84px;'></canvas>
				<!--<canvas id="mainCanvas" width="690" height="525" style="z-index: 2; position:absolute; top: 159px;"></canvas>-->
				<canvas id="mainCanvas" width="690" height="600" style="z-index: 2;"></canvas>
			</div>

			<div id="container2" style="position:absolute; top: 700px;"> </div>
		</div>


<form action="index.php" method="post">
Name: <input id="txtName" class="login" type="text" name="user_name">
Pass: <input id="txtPass" class="login" type="text" name="user_pass">
<input type="button" onclick="attemptLogin();" value="Login">
</form>


	</body>
</html>
