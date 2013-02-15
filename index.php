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


		<script>
$(document).ready(function() {
	$('a.login-window').click(function() {
		
                //Getting the variable's value from a link 
		var loginBox = $(this).attr('href');

		//Fade in the Popup
		$(loginBox).fadeIn(300);
		
		//Set the center alignment padding + border see css style
		var popMargTop = ($(loginBox).height() + 24) / 2; 
		var popMargLeft = ($(loginBox).width() + 24) / 2; 
		
		$(loginBox).css({ 
			'margin-top' : -popMargTop,
			'margin-left' : -popMargLeft
		});
		
		// Add the mask to body
		$('body').append('<div id="mask"></div>');
		$('#mask').fadeIn(300);
		
		return false;
	});
	
	// When clicking on the button close or the mask layer the popup closed
	$('a.close, #mask').live('click', function() { 
	  $('#mask , .login-popup').fadeOut(300 , function() {
		$('#mask').remove();  
	}); 
	return false;
	});
});

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
			var replyText = {user_name: userName, user_pass: userPass};

			AjaxPostCall("login.php", replyText, function(data){
				console.log("data: " + data);

			}, function(error){
				console.log(error);
			});
		}


		</script>
	</head>

	<body>

		<div id="main" class="center" style="z-index:1;">

			<div class="navbar">
				<div class="menuBar">
					<ul>
						<li><a href="index.html">Home</a></li>
						<li><a href="notes.html">Patch Notes</a></li>
					<br style="clear: left" />
				</div>

				<div id="login">
					<a href="#login-box" class="login-window">Login / Sign In</a>
				</div>
			</div>

			<div id="canvasContainer" tabindex="0" style="z-index: 1">
				<div id="menuCanvasDiv">
					<canvas id="menuCanvas" width="690" height="75"></canvas>
					<div id="buttonBar">
						<div id="button1" onclick="buttonClick(this);" title="Block" class="diagramButton left" ></div>
						<div id="button2" onclick="buttonClick(this);" title="If" class="diagramButton middle" ></div>
						<div id="button3" onclick="buttonClick(this);" title="Function" class="diagramButton middle" ></div>
						<div id="button4" onclick="buttonClick(this);" title="While" class="diagramButton middle" ></div>
						<div id="button5" onclick="buttonClick(this);" title="Case" class="diagramButton middle" ></div>
						<div id="button6" onclick="buttonClick(this);" title="Delete" class="diagramButton middle" ></div>
						<div id="button7" onclick="buttonClick(this);" title="Export" class="diagramButton middle" ></div>
						<div id="button8" onclick="buttonClick(this);" title="Save" class="diagramButton middle" ></div>
						<div id="button9" onclick="buttonClick(this);" title="Load" class="diagramButton middle" ></div>
						<div id="button10" onclick="buttonClick(this);" title="Undo" class="diagramButton right" ></div>
					</div>
					<select id="selectSize" onclick="app.changeSelection(selectedIndex);" style="z-index: 5; position:absolute;">
						<option value="8">8 1/2"</option>
						<option value="11">11"</option>
					</select>
				</div>
				<!--<canvas id="mainCanvas" width="690" height="525" style="z-index: 2; position:absolute; top: 159px;"></canvas>-->
				<canvas id="mainCanvas" width="690" height="600" style="z-index: 2;"></canvas>
			</div>

			<div id="container2"> </div>
		</div>

		<div id="login-box" class="login-popup">
			<form method="post" class="signin" action="#">
				<fieldset class="textbox">
					<label class="username">
						<span class="lblLogin">Username</span>
						<input id="txtName" class="login" type="text" name="user_name">
					</label>
					<label class="email">
						<span class="lblLogin">Email (optional)</span>
						<input id="txtEmail" class="login" type="text" name="user_email">
					</label>
					<label class="password">
						<span class="lblLogin">Password</span>
						<input id="txtPass" class="login" type="text" name="user_pass">
					</label>
					<label class="password">
						<span class="lblLogin">Confirm Password</span>
						<input id="txtPass2" class="login" type="text" name="user_pass2">
					</label>
					<div>
						<label class="lblLogin"><input type="checkbox" /> remember me!</label>
					</div>
					<input id="btnLogin" type="button" onclick="attemptLogin();" value="Login">
					<p>
						<a class="forgot" href="#">Forgot your password?</a>
					</p>        
				</fieldset>
			</form>
		</div>
	</body>
</html>