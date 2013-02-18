
<link rel="stylesheet" type="text/css" href="css/styles.css" />

<script>
	//google analytics
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-36136584-1']);
	_gaq.push(['_trackPageview']);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();


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
		//Get the HTML elements
		var userName = document.getElementById('txtLoginName').value;
		var userPass = document.getElementById('txtLoginPass').value;
		var remember = document.getElementById('chkLogin');

		//if the user wants to stay logged in
		if(remember.checked) {

		}

		//Create the variable object to send
		var replyText = {user_name: userName, user_pass: userPass};

		//Send the data to the PHP page
		AjaxPostCall("login.php", replyText, function(data){
			//Do this when there is a response from the PHP page
			if (data == 1) {
				//no username specified
				document.getElementById('errorsLogin').innerHTML = "* No username specified *";
			} else if (data == 2) {
				//incorrect password
				document.getElementById('errorsLogin').innerHTML = "* Incorrect password *";
			} else if (data == 3) {
				//user does not exist
				document.getElementById('errorsLogin').innerHTML = "* User does not exist *";
			} else {
				//Successful login
				document.getElementById('errorsLogin').innerHTML = " ";
				$('#mask , .login-popup').fadeOut(300 , function() {
					$('#mask').remove();  
				});
			}
		}, function(error){
			console.log(error);
		});
	}

	function attemptRegister() {
		//Get the HTML elements
		var userName = document.getElementById('txtRegisterName').value;
		var userEmail = document.getElementById('txtEmail').value;
		var userPass = document.getElementById('txtRegisterPass').value;
		var userPass2 = document.getElementById('txtRegisterPass2').value;
		var remember = document.getElementById('chkRegister');

		//if the user wants to stay logged in
		if(remember.checked) {

		}

		if(!userEmail) {
			userEmail = '';
		}

		//Create the variable object to send
		var replyText = {user_name: userName, user_pass: userPass, user_email: userEmail};

		//If the passwords match
		if(userPass == userPass2) {
		//Send the data to the PHP page
			AjaxPostCall("register.php", replyText, function(data){
				//Do this when there is a response from the PHP page
				console.log("register: " + data);
				if (data == 1) {
					//no username specified
					document.getElementById('errorsRegister').innerHTML = "* No username specified *";
				} else if (data == 2) {
					//user name already in use
					document.getElementById('errorsRegister').innerHTML = "* User name already in use *";
				} else if (data == 3) {
					//successful register
					document.getElementById('errorsRegister').innerHTML = " ";
					$('#mask , .login-popup').fadeOut(300 , function() {
						$('#mask').remove();  
					});
				} else if (data == 5) {
					//no password
					document.getElementById('errorsRegister').innerHTML = "* No password entered *";
				} else {
					//an error occured
					document.getElementById('errorsRegister').innerHTML = "* An error occured *";
				}
			}, function(error){
				console.log(error);
			});
		}
	}
</script>

<div class="navbar">
	<div class="menuBar">
		<ul>
			<li><a href="index.php">Home</a></li>
			<li><a href="notes.php">Patch Notes</a></li>
		<br style="clear: left" />
	</div>

	<div id="login">
		<a href="#login-box" class="login-window">Login / Register</a>
	</div>
</div>

<div id="login-box" class="login-popup">
	<div id="loginSub">
		<h3>Login</h3>
		</br>
		<form method="post" class="signin" action="javascript:">
			<fieldset class="textbox">
				<label class="username">
					<span class="lblLogin">Username or Email</span>
					<input id="txtLoginName" class="login" type="text" name="user_name">
				</label>
				<label class="password">
					<span class="lblLogin">Password</span>
					<input id="txtLoginPass" class="login" type="text" name="user_pass">
				</label>
				<div>
					<label class="lblLogin"><input id="chkLogin" type="checkbox" /> remember me!</label>
				</div>
				<input class="btnLogin" type="submit" onclick="attemptLogin();" value="Login">
				<p>
					<a class="forgot" href="#">Forgot your password?</a>
				</p>        
			</fieldset>
		</form>
		<div class="errors" id="errorsLogin"></div>
	</div>

	<div id="registerSub">
		<h3>Register</h3>
		</br>
		<form method="post" class="signin" action="javascript:">
			<fieldset class="textbox">
				<label class="username">
					<span class="lblLogin">Username</span>
					<input id="txtRegisterName" class="login" type="text" name="user_name">
				</label>
				<label class="email">
					<span class="lblLogin">Email (optional)</span>
					<input id="txtEmail" class="login" type="text" name="user_email">
				</label>
				<label class="password">
					<span class="lblLogin">Password</span>
					<input id="txtRegisterPass" class="login" type="text" name="user_pass">
				</label>
				<label class="password">
					<span class="lblLogin">Confirm Password</span>
					<input id="txtRegisterPass2" class="login" type="text" name="user_pass2">
				</label>
				<div>
					<label class="lblLogin"><input id="chkRegister" type="checkbox" /> remember me!</label>
				</div>
				<input class="btnLogin" type="submit" onclick="attemptRegister();" value="Register">      
			</fieldset>
		</form>
		<div class="errors" id="errorsRegister"></div>
	</div>

</div>