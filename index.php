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