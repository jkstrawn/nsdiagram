<?php
session_start();
?>
<!DOCTYPE HTML>
<html>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<head>
		<title>Nassi Shneiderman Diagram Maker</title>
		<meta name="description" content="Create, save, and load Nassi-Shneiderman charts all in the browser.">
		<meta name="keywords" content="Nassi, Shneiderman, diagram, chart, maker, creator, flowchart, HTML, editor, ns, free">
		<meta name="author" content="Jeremy Strawn">
		<meta charset="UTF-8">
		<link rel="stylesheet" type="text/css" href="css/styles.css" />
		<script src="scripts/jQuery/jquery.js"></script>
		<script src="scripts/jQuery/jquery.rightClick.js"></script>

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

			function logout() {
				console.log("logout");
				AjaxPostCall("logout.php", function(data){
					$(".submenu").hide();
					document.getElementById('loginText').innerHTML = "<a href='#login-box' class='login-window'>Login / Register</a>";
				}, function(error){
					console.log(error);
				});
			}

			function setMenuDropdown() {
				//Set the login text to be a drop down menu instead of the login link
				document.getElementById('loginText').innerHTML = 
					"<div class='dropdown'>" +
						"<a class='account' ><span>My Account</span></a>" +
						"<div class='submenu' style='display: none;'>" +
							"<ul class='root'>" +
								"<li><a href='#viewCharts'>View Charts</a></li>" +
								"<li><a href='#changeEmail'>Change Email</a></li>" +
								"<li><a href='#changePass' onclick='openChangePass();'>Change Password</a></li>" +
								"<li><a href='#feedback'>Send Feedback</a></li>" +
								"<li><a href='#signout' onclick='logout();''>Sign Out</a></li>" +
							"</ul>" +
						"</div>" +
					"</div>";

				//Show or hide the menu when its clicked on
				$(".account").click(function() {
					var X=$(this).attr('id');

					if(X==1) {
						$(".submenu").hide();
						$(this).attr('id', '0');	
					}
					else {
						$(".submenu").show();
						$(this).attr('id', '1');
					}
					
				});

				//Mouseup textarea false
				$(".submenu").mouseup(function() {
					return false
				});
				$(".account").mouseup(function() {
					return false
				});

				//Textarea without editing.
				$(document).mouseup(function() {
					$(".submenu").hide();
					$(".account").attr('id', '');
				});
			}

			$(document).ready(function() {
				$('a.login-window').live('click', function() {

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

					var storedName = getCookie('name');
					if(storedName) {
						document.getElementById('txtLoginName').value = storedName;
					}

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
					setCookie('name', userName, 365);
				}

				//Create the variable object to send
				var replyText = {user_name: userName, user_pass: userPass};

				console.log("name: " + userName + ", pass: " + userPass);

				//Send the data to the PHP page
				AjaxPostCall("login.php", replyText, function(data){
					console.log("login: " + data);
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
						setMenuDropdown();
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
							setMenuDropdown();
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
				} else {
					console.log("passwords dont match");
					document.getElementById('txtRegisterPass').value = document.getElementById('txtRegisterPass2').value = "";
					document.getElementById('errorsRegister').innerHTML = "* Passwords do not match *";
				}
			}

			function changePassword() {
				//get the values
				var oldPass = document.getElementById('txtOldPass').value;
				var newPass1 = document.getElementById('txtNewPass').value;
				var newPass2 = document.getElementById('txtNewPass2').value;

				var replyText = {user_old_pass: oldPass, user_new_pass: newPass1};

				//if the passwords match
				if(newPass1 == newPass2) {
					AjaxPostCall("changePassword.php", replyText, function(data){
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
							setMenuDropdown();
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
				} else {
					document.getElementById('txtNewPass').value = document.getElementById('txtNewPass2').value = "";
					document.getElementById('errorsPassword').innerHTML = "* Passwords do not match *";
				}


			}

			function openChangePass() {
				//Getting the variable's value from a link 
				var passwordBox = $('#password-box');

				//Fade in the Popup
				$(passwordBox).fadeIn(300);

				//Set the center alignment padding + border see css style
				var popMargTop = ($(passwordBox).height() + 24) / 2; 
				var popMargLeft = ($(passwordBox).width() + 24) / 2; 

				$(passwordBox).css({ 
					'margin-top' : -popMargTop,
					'margin-left' : -popMargLeft
				});

				// Add the mask to body
				$('body').append('<div id="mask"></div>');
				$('#mask').fadeIn(300);
			}


			function setCookie(c_name,value,exdays) {
				var exdate=new Date();
				exdate.setDate(exdate.getDate() + exdays);
				var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
				document.cookie=c_name + "=" + c_value;
			}

			function getCookie(c_name) {
				var i,x,y,ARRcookies=document.cookie.split(";");
				for (i=0;i<ARRcookies.length;i++)
				{
					x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
					y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
					x=x.replace(/^\s+|\s+$/g,"");
					if (x==c_name)
					{
						return unescape(y);
					}
				}
			}


		</script>

	</head>

	<body>
		<div id="main" class="center" style="z-index:1;">
			<div class="navbar">
				<div class="menuBar">
					<ul>
						<li><a href="index.php">Home</a></li>
						<li><a href="notes.php">Patch Notes</a></li>
					<br style="clear: left" />
				</div>

				<div id="login">
					<div id="loginText">
						<a href="#login-box" class="login-window">Login / Register</a>
					</div>
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

			<div id="password-box" class="login-popup">
				<h3>Change Password</h3>
				</br>
				<form method="post" class="signin" action="javascript:">
					<fieldset class="textbox">
						<label class="password">
							<span class="lblLogin">Old Password</span>
							<input id="txtOldPass" class="login" type="text" name="user_old_pass">
						</label>
						<label class="password">
							<span class="lblLogin">New Password</span>
							<input id="txtNewPass" class="login" type="text" name="user_pass">
						</label>
						<label class="password">
							<span class="lblLogin">Confirm Password</span>
							<input id="txtNewPass2" class="login" type="text" name="user_pass2">
						</label>
						<input class="btnLogin" type="submit" onclick="changePassword();" value="Change Password">   
					</fieldset>
				</form>
				<div class="errors" id="errorsPassword"></div>
			</div>

<?php
	if(isset($_SESSION['loggedin'])) {
		if($_SESSION['loggedin'] == "YES")
			echo '<script type="text/javascript">setMenuDropdown();</script>';
	}
?>