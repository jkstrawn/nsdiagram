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
		<meta name="keywords" content="Nassi, Shneiderman, diagram, chart, maker, creator, flowchart, HTML, editor, ns, free">
		<meta name="author" content="Jeremy Strawn">
		<meta charset="UTF-8">
		<script src="scripts/jQuery/jquery.js"></script>
<script src="scripts/jQuery/jquery.rightClick.js"></script>
	</head>

	<body>

		<div id="main" class="center" style="z-index:1;">

			<?php include('header.php')   ?>
			<script src="scripts/buttonJS.js"></script>

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


	</body>
</html>