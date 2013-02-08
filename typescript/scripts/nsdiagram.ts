var json = 0;

class AssetManager {
	private successCount: number;
	private errorCount: number;
	private cache: any;
	private downloadQueue: string[];

	constructor() {
		this.successCount = 0;
		this.errorCount = 0;
		this.downloadQueue = [];
		this.cache = {};
	}

	queueDownload(path: string) {
		this.downloadQueue.push(path);
	}

	downloadAll(callback: () => void) {
		if (this.downloadQueue.length === 0) {
			callback();
		}
		
		for (var i = 0; i < this.downloadQueue.length; i++) {
			var path = this.downloadQueue[i];
			var img = new Image();
			var that = this;
			img.addEventListener("load", function() {
				console.log(this.src + ' is loaded');
				that.successCount += 1;
				if (that.isDone()) {
					callback();
				}
			}, false);
			img.addEventListener("error", function() {
				that.errorCount += 1;
				if (that.isDone()) {
					callback();
				}
			}, false);
			img.src = path;
			this.cache[path] = img;
		}
	}

	getAsset(path: string) {
		return this.cache[path];
	}

	isDone() {
		return (this.downloadQueue.length == this.successCount + this.errorCount);
	}	
}

//***************************************************************** TEXT ********************************************************************
class Text {
	private id: number;
	private idTemp: number;
	private text: string;
	private parent: Box;
	private xOffset: number;
	private yOffset: number;
	private width: number;
	private label: bool;
	private writable: bool;
	private numOfLines: number;
	private bottom: bool;
	private link: HTMLElement;
	private input: HTMLElement;



	constructor() {

	}

	update() {

	}

	delete() {

	}
}

function Text(parent, xOffset, yOffset, width, id, writable, label, bottom) {
	this.id = id;
	this.idTemp = 0;
	this.text = "null";
	this.parent = parent;
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.width = width;
	this.label = label || false;
	this.writable = writable;
	this.numOfLines = 1;
	this.bottom = false || bottom;
	this.link = document.getElementById(this.id);
	var inputs = this.link.getElementsByTagName('textarea');
	this.input = inputs[0];
}

Text.prototype.update = function() {
	var _parent = this.parent;
	var _width = this.width || _parent.width;
	var lines = (this.bottom) ?  _parent.numOfLinesBottom : _parent.numOfLines;
	//ugly format, but only change the html elements if they need to be changed (and the parent box moved)
	if(this.link.style.left != (_parent.x-_parent.incrementX+this.xOffset+canvas.offsetLeft+2)+"px")
		this.link.style.left = (_parent.x-_parent.incrementX+this.xOffset+canvas.offsetLeft+2)+"px";
	if(this.link.style.top !=  (_parent.y-_parent.incrementY+this.yOffset+canvas.offsetTop)+"px")
		this.link.style.top =  (_parent.y-_parent.incrementY+this.yOffset+canvas.offsetTop)+"px";
	if(this.input.style.width !=  (_width-2) +"px")
		this.input.style.width =  (_width-2) +"px";
	if(this.input.style.height != 18+_parent.app.buttonHeight*(lines-1)+"px")
		this.input.style.height = 18+_parent.app.buttonHeight*(lines-1)+"px";

	//check for overlap in the text boxes
	//_length is how many effective characters there are in the textbox
	var _length = this.input.value.length + 1*(lines-1);
	//bottomLines holds the lines for this specific textBox so it doesnt change mid-update
	var bottomLines = this.numOfLines;
	//_width is how many characters a line of text can hold in this textbox
	_width = Math.ceil(_width/8);
	if(this.writable && _length >= _width*lines) {
		_parent.textOverflow(this, 1);
	}
	if(this.writable && !this.bottom && lines > 1 && _length <= _width*(lines-1)) {
	//if its the top label && is underflow
		_parent.textOverflow(this, -1);
	}
	if(this.bottom && lines > 1 && _length <= _width*(bottomLines-1)) {
	//if its the bottom label && is underflow
		_parent.textOverflow(this, -1);
	}
}

Text.prototype.delete = function() {
	this.parent.deleteTextBox(this.id);
	app.deleteTextBox(this.id);
	var container = document.getElementById('canvasContainer');
	container.removeChild(this.link);
}

//**************************************************************** COMMAND ******************************************************************
function Command(selected, index, text) {
	this.s = selected;
	this.i = index;
	this.text = text;
}

//***************************************************************** BOX ********************************************************************
var heightToMove = 0;
var isABoxSelected = false;

function Box(app, container) {
	this.app = app;
	this.container = container;
	this.id = 0;
	this.y = 0;
	this.x = 0;
	this.height = 0;
	this.width = 0;
    this.incrementY = 0;
    this.incrementX = 0;
	this.selected = false;
	this.boxListId = -1;
	this.boxListIdTemp = -1;
	if(container) {
	//if its not a button or the first container
		this.boxListId = app.boxList.length;
		app.boxList.push(this);
	}
}

Box.prototype.init = function(container) {

}

Box.prototype.draw = function(ctx, drawText) {
	var x = this.x - this.incrementX;
	var y = this.y - this.incrementY;
	var h = this.height;
	var w = this.width;

	ctx.translate(0.5, 0.5);

	if(this.selected) {
		var lingrad = ctx.createLinearGradient(x, y, x+w, y+h);
		lingrad.addColorStop(0, 'rgba(250,234,184,1)');
		lingrad.addColorStop(1, 'rgba(255,219,124,1)');
		ctx.fillStyle = lingrad;
	} else
		ctx.fillStyle = "rgb(255, 255, 255)";
		
	ctx.fillRect (x, y, this.width, this.height);		
	
	ctx.beginPath();
	ctx.moveTo(x + 0, y + 0);
	ctx.lineTo(x + 0, y + h);
	ctx.lineTo(x + w, y + h);
	ctx.lineTo(x + w, y + 0);
	ctx.closePath();
	ctx.lineWidth = 1;
	ctx.stroke();

	ctx.translate(-0.5, -0.5);
}

Box.prototype.update = function() {
	if(this.incrementY != 0) {
		var signY = 1;
		if(this.incrementY < 0)
			signY = -1;
		this.incrementY = Math.floor(Math.pow(this.incrementY*signY, .95)) * signY;
	    if(signY*this.incrementY <= 1.1)
	    	this.incrementY = 0;
	}

	if(this.incrementX != 0) {
		var signX = 1;
		if(this.incrementX < 0)
			signX = -1;
		this.incrementX = Math.floor(Math.pow(this.incrementX*signX, .95)) * signX;
	    if(signX*this.incrementX <= 1.1)
	    	this.incrementX = 0;
	}
}

Box.prototype.isInside = function(x, y) {
	if(x > this.x && x < (this.x + this.width) && y > this.y && y < (this.y + this.height)) {
	//if the coords are inside the box
		return true;
	} else {
		return false;
	}
}

Box.prototype.moveByY = function(height) {
	this.incrementY += height;
	this.y += height;
}

Box.prototype.moveByX = function(width) {
	this.incrementX += width;
	this.x += width;
}

Box.prototype.click = function(x, y) {
	this.selected = this.isInside(x, y);
	return this.selected;
}

Box.prototype.deselectAll = function() {
	this.selected = false;
}

Box.prototype.setHeight = function(height) {
	this.height = height;
}

Box.prototype.setWidth = function(width) {
	this.width = width;
}

Box.prototype.resetIdInList = function() {
	if(this.container) {
		this.boxListIdTemp = app.boxListTemp.length;
		app.boxListTemp.push(this);
	}

	if(this.textList) {
		for(var i = 0; i < this.textList.length; i++) {
			this.textList[i].idTemp = this.app.textListTemp.length;
			this.app.textListTemp.push(this.textList[i]);
		}
	}
}

Box.prototype.convertToCommand = function() {
	if(this.textList) {
		for(var i = 0; i < this.textList.length; i++) {
			var _text = this.textList[i];
			var div = _text.link;
			var inputs = div.getElementsByTagName('textarea');
			var input = inputs[0];
			var _command2 = new Command("text"+_text.idTemp, 9, input.value);
			this.app.commandsToExecute.push(_command2);
		}
	}
}

Box.prototype.delete =  function() {
}

Box.prototype.getSelected = function() {
}

Box.prototype.checkHover = function(x, y) {
}

Box.prototype.increaseHeight = function(height) {
}

Box.prototype.textOverflow = function(div, sign) {
}

//************************************************************* CONTAINER ******************************************************************
function Container(app, parent, x, y, w, h) {
    Box.call(this, app, parent.container);

	this.parent = parent;
	this.id = (parent) ? this.parent.containerList.nextId() : 0;
	this.y = y;
	this.x = x;
	this.height = h;
	this.width = w;

	this.nextY = this.y;
	this.blockList = new BlockList(app, this);
}

Container.prototype = new Box();
Container.prototype.constructor = Container;

Container.prototype.init = function(container) {
	//Box.call(this, parent);
}

Container.prototype.moveByY = function(height) {
	Box.prototype.moveByY.call(this, height);
	this.blockList.moveByY(height);
	this.nextY += height;
}

Container.prototype.moveByX = function(width) {
	Box.prototype.moveByX.call(this, width);
	this.blockList.moveByX(width);
}

Container.prototype.delete =  function() {
	this.blockList.deleteAll();
}

Container.prototype.draw = function(ctx, drawText) {
	Box.prototype.draw.call(this, ctx, drawText);
	this.blockList.draw(ctx, drawText);
}

Container.prototype.click = function(x, y) {
	this.selected = false;
	if(this.blockList.click(x, y))
		return true;
	this.selected = this.isInside(x, y);
	return this.selected;
}

Container.prototype.update = function() {
	Box.prototype.update.call(this);
	this.blockList.update();
}

Container.prototype.getSelected = function() {
	if(this.selected) return this;
	return this.blockList.getSelected();
}

Container.prototype.deselectAll = function() {
	this.selected = false;
	for(var i = 0; i < this.blockList.list.length; i++) {
		this.blockList.list[i].deselectAll();
	}
}

Container.prototype.checkHover = function(x, y) {
	this.blockList.checkHover(x, y);
}

Container.prototype.setWidth = function(width) {
	this.width = width;
	this.blockList.setWidth(width);
}

Container.prototype.resetIdInList = function() {
	Box.prototype.resetIdInList.call(this);
}

Container.prototype.resetIdInListContainer = function() {
	for(var i = 0; i < this.blockList.list.length; i++) {
		this.blockList.list[i].resetIdInList();
	}
}

Container.prototype.convertToCommand = function() {
	for(var i = 0; i < this.blockList.list.length; i++) {
		this.blockList.list[i].convertToCommand();
	}	
}

//***************************************************************** BLOCK ******************************************************************
function Block(app, container, makeBefore) {
	if(!container) return; //fix for inheritance issues
    Box.call(this, app, container);


	this.id = (container.nextY) ? container.blockList.nextId() : container.container.blockList.nextId();
	this.textList = new Array();
	this.x = this.container.x;		
	this.width = (this.app.BUTTON_DEFAULT_WIDTH < container.width) ? this.app.BUTTON_DEFAULT_WIDTH : container.width;
	this.height = heightToMove = app.buttonHeight;
	this.textWidth = 0;
	this.numOfLines = 1;
	this.widthOfLine = 1;
	this.builtAfterBox = false;

	this.init(container, makeBefore);
}

Block.prototype = new Box();
Block.prototype.constructor = Block;

Block.prototype.init = function(container, makeBefore) {
//	console.log("createBox: " + this.id);

	if(container.nextY) {
	//if there is a drawing space selected
		this.container = container;
		this.y = container.nextY;	
	}		
	else {
	//if there is a box selected
		this.builtAfterBox = true;
		if(makeBefore)
			this.y = container.y;
		else
			this.y = container.y + container.height;
		this.container = container = container.container;
	}
	this.createTextDiv(this, 0, 0, "null", 0, true);

	container.nextY += this.height;	
}

Block.prototype.createTextDiv = function(parent, x, y, text, width, writable, label, bottom) {
	//create the text div
	var id = this.app.nextText();
	var inputDiv = 
	"<div class='texts' id='text"+ id +"' style='position:absolute; z-index:3;'>" +
	"<textarea type='text' readonly='readonly' onblur='elementBlur(this);'" + 
	" onkeydown='inputFieldKey(event, this)' style='width:"+(this.width-2)+"px;'>"+text+"</textarea>" +
	"</div>";
	$("#canvasContainer").append(inputDiv);
	var _link = document.getElementById("text"+id);
	_link.style.value = text;
	var _text = new Text(parent, x, y, width, "text"+id, writable, label, bottom);
	this.textList.push(_text);
	this.app.appTextList.push(_text);
}

Block.prototype.update = function() {
	Box.prototype.update.call(this);
	for(var i = 0; i < this.textList.length; i++) {
		this.textList[i].update();
	}

}

Block.prototype.textOverflow = function(div, sign) {
	this.numOfLines += 1*sign;
	this.increaseHeight(this.app.buttonHeight*sign);
}

Block.prototype.delete =  function() {
	for(var i = this.textList.length-1; i >= 0; i--) {
		//remove textBox associated with it
		this.textList[i].delete();
	}
}

Block.prototype.getSelected = function() {
	if(this.selected) return this;
}

Block.prototype.draw = function(ctx, drawText) {
	Box.prototype.draw.call(this, ctx, drawText);
	if(drawText) {
	//if the box is being drawn onto the temp canvas to print it, then draw the text onto the canvas
		for(var i = 0; i < this.textList.length; i++) {
		//for each text box in the block
			var _text = this.textList[i];
			var canvas = document.getElementById('mainCanvas');
			var div = _text.link;
			var inputs = div.getElementsByTagName('textarea');
			var input = inputs[0];
			var text = input.value;

			ctx.font = "14px 'Courier New'";
			ctx.fillStyle = "#000000";
			ctx.textBaseline = "top";
			var width = (_text.width || this.width) - 2;

			var splitText = [];
			splitText[0] = text;
			if(text.length*8 > width) {
			//if the text in this textbox is more than 1 line
				var re = new RegExp(".{1,"+Math.floor(width/8)+"}", 'g');
				var splitText = text.match(re);

				for(var line = 0; line < splitText.length; line++) {
					if(input.style.textAlign == "center") {
						ctx.textAlign = "center";
						ctx.fillText(splitText[line], this.x+_text.xOffset+Math.floor(width/2), this.y+_text.yOffset+line*this.app.buttonHeight);
					} else {
						ctx.textAlign = "left";
						ctx.fillText(splitText[line], this.x+_text.xOffset+2, this.y+_text.yOffset+line*this.app.buttonHeight);
					}	
				}
			} else {
				if(input.style.textAlign == "center") {
					ctx.textAlign = "center";
					ctx.fillText(text, this.x+_text.xOffset+Math.floor(width/2), this.y+_text.yOffset);
				} else {
					ctx.textAlign = "left";
					ctx.fillText(text, this.x+_text.xOffset+2, this.y+_text.yOffset);
				}
			}	
		}
	}
}

Block.prototype.increaseHeight = function(height) {
	this.container.nextY += height;
	this.height += height;
	this.container.blockList.moveAllDown(this.id+1, height);
	this.container.blockList.moveAllDownREC();
}

Block.prototype.convertToCommand = function() {
	var _command = new Command(this.container.boxListIdTemp, 0);
	this.app.commandsToExecute.push(_command);

	Box.prototype.convertToCommand.call(this);
}

Block.prototype.deleteTextBox = function(id) {
	for(var i = 0; i < this.textList.length; i++) {
		if(this.textList[i].id == id) {
			this.textList.splice(i, 1);
			return;
		}
	}
	console.log("  ERROR: Failed to removed text box from BOX list");
}

//************************************************************ FUNCTIONBLOCK ****************************************************************
function FunctionBlock(app, container, makeBefore) {
    Block.call(this, app, container, makeBefore);
}

FunctionBlock.prototype = new Block();
FunctionBlock.prototype.constructor = FunctionBlock;


FunctionBlock.prototype.init = function(container, makeBefore) {
	Block.prototype.init.call(this, container, makeBefore);
	this.textList[0].xOffset = 5;
	this.textList[0].width = this.width - 10;
}

FunctionBlock.prototype.draw = function(ctx, drawText) {
	Block.prototype.draw.call(this, ctx, drawText);

	var x = this.x - this.incrementX;
	var y = this.y - this.incrementY;
	var h = this.height;
	var w = this.width;

	ctx.translate(0.5, 0.5);	
	ctx.beginPath();
	ctx.moveTo(x + 5, y + 0);
	ctx.lineTo(x + 5, y + h);
	ctx.lineTo(x + w - 5, y + h);
	ctx.lineTo(x + w - 5, y + 0);
	ctx.closePath();
	ctx.stroke();	
	ctx.translate(-0.5, -0.5);
}

FunctionBlock.prototype.convertToCommand = function() {
	var _command = new Command(this.container.boxListIdTemp, 2);
	this.app.commandsToExecute.push(_command);

	Box.prototype.convertToCommand.call(this);
}

//***************************************************************************************************************************************************
//******************************************************************* CONTAINERBLOCK ****************************************************************
//***************************************************************************************************************************************************
function ContainerBlock(app, container, makeBefore) {
    Block.call(this, app, container, makeBefore);
    this.multiple = true;
    this.extraCaseHeight = 0;
}

ContainerBlock.prototype = new Block();
ContainerBlock.prototype.constructor = ContainerBlock;

ContainerBlock.prototype.init = function(container, makeBefore) {
	this.childOffsetY = 40;
	this.childOffsetX = 0;
	this.containerList = new ContainerList();
	this.height = heightToMove = 40+this.app.buttonHeight;
	this.widthOfLine = .6;

	//call this after I have manually set the height so it calls things in order
	Block.prototype.init.call(this, container, makeBefore);

	//code to manually set the properties for the main textarea (was created in Block.init)
	this.textList[0].width = this.width*.6;
	this.textList[0].xOffset = this.width*.2;
	var div = this.textList[0].link;
	var inputs = div.getElementsByTagName('textarea');
	var input = inputs[0];
	input.value = "if(true)";
	input.style.textAlign = "center";

	//now make the True and False tags
	this.createTextDiv(this, 0, 20+(this.numOfLines-1)*this.app.buttonHeight, "True", 40, false);
	this.createTextDiv(this, this.width-50, 20+(this.numOfLines-1)*this.app.buttonHeight, "False", 50, false);

	//create the containers and add them to the container list
	var odd = (this.width/2 - Math.floor(this.width/2))*2;
	var width = Math.floor(this.width/2);
	var _container1 = new Container(this.app, this, this.x 			   , this.y+40, width, this.app.buttonHeight);
	this.containerList.addContainer(_container1);
	var _container2 = new Container(this.app, this, this.x+width, this.y+40, width+odd, this.app.buttonHeight);
	this.containerList.addContainer(_container2);
}

ContainerBlock.prototype.delete =  function() {
	this.containerList.deleteAll();
	Block.prototype.delete.call(this);
}

ContainerBlock.prototype.moveByY = function(height) {
	this.incrementY += height;
	this.y += height;
	this.containerList.moveByY(height);
}

ContainerBlock.prototype.moveByX = function(width) {
	this.incrementX += width;
	this.x += width;
	this.containerList.moveByX(width);
}

ContainerBlock.prototype.draw = function(ctx, drawText) {
	Block.prototype.draw.call(this, ctx, drawText);

	var x = this.x - this.incrementX;
	var y = this.y - this.incrementY;
	var h = this.height;
	var w = this.width;

	ctx.translate(0.5, 0.5);	
	ctx.beginPath();
	ctx.moveTo(x + 0, y + 0);
	ctx.lineTo(x + w/2, y + 40+(this.numOfLines-1)*this.app.buttonHeight);
	ctx.lineTo(x + w, y + 0);
	ctx.closePath();
	ctx.stroke();	
	ctx.translate(-0.5, -0.5);

	this.containerList.draw(ctx, drawText);
}

ContainerBlock.prototype.click = function(x, y) {
	this.selected = false;
	if(this.containerList.click(x, y))
		return true;
	this.selected = this.isInside(x, y);
	return this.selected;
}

ContainerBlock.prototype.update = function() {
	Block.prototype.update.call(this);

	this.containerList.update();
}

ContainerBlock.prototype.getSelected = function() {
	var selected = this.containerList.getSelected();
	if(selected) return selected;
	if(this.selected) return this;
	return false;
}

ContainerBlock.prototype.deselectAll = function() {
	this.selected = false;
	for(var i = 0; i < this.containerList.list.length; i++) {
		this.containerList.list[i].deselectAll();
	}
}

ContainerBlock.prototype.getLargestContainer = function() {
	var max = 0;
	for(var i = 0; i < this.containerList.list.length; i++) {
		if(this.containerList.list[i].height > max)
			max = this.containerList.list[i].height;
	}
	return max;
}

ContainerBlock.prototype.getLargestNextY = function() {
	var max = 0;
	for(var i = 0; i < this.containerList.list.length; i++) {
		if(this.containerList.list[i].nextY - this.containerList.list[i].y > max)
			max = this.containerList.list[i].nextY - this.containerList.list[i].y;
	}
	return max;
}

ContainerBlock.prototype.setHeightOfContainers = function(height) {
	for(var i = 0; i < this.containerList.list.length; i++) {
		this.containerList.list[i].height = height;
	}
}

ContainerBlock.prototype.checkHover = function(x, y) {
	this.containerList.checkHover(x, y);
}

ContainerBlock.prototype.setWidth = function(width) {
	this.width = width;
	width = Math.floor(width/2);
	var xToMove = width - this.containerList.list[1].width;
	this.containerList.setWidth(width);
	this.containerList.list[1].moveByX(xToMove);
}

ContainerBlock.prototype.textOverflow = function(div, sign) {
	Block.prototype.textOverflow.call(this, div, sign);
	this.childOffsetY += sign*this.app.buttonHeight;
	for(var i = 0; i < this.containerList.list.length; i++) {
		this.containerList.list[i].moveByY(this.app.buttonHeight*sign);		
	}
}

ContainerBlock.prototype.resetIdInList = function() {
	Box.prototype.resetIdInList.call(this);
	for(var i = 0; i < this.containerList.list.length; i++) {
		this.containerList.list[i].resetIdInList();
	}
	for(var i = 0; i < this.containerList.list.length; i++) {
		this.containerList.list[i].resetIdInListContainer();
	}
}

ContainerBlock.prototype.convertToCommand = function() {
	var _command = new Command(this.container.boxListIdTemp, 1);
	this.app.commandsToExecute.push(_command);

	Box.prototype.convertToCommand.call(this);

	for(var i = 0; i < this.containerList.list.length; i++) {
		this.containerList.list[i].convertToCommand();
	}
}
//********************************************************************************************************************************************
//************************************************************ WHILEBLOCK ********************************************************************
//********************************************************************************************************************************************
function WhileBlock(app, container, makeBefore) {
    ContainerBlock.call(this, app, container, makeBefore);
    this.multiple = false;
}

WhileBlock.prototype = new ContainerBlock();
WhileBlock.prototype.constructor = WhileBlock;

WhileBlock.prototype.init = function(container, makeBefore) {
	this.childOffsetY = 25;
	this.childOffsetX = 15;
	this.containerList = new ContainerList();
	this.height = heightToMove = 25+this.app.buttonHeight;
	
	//call this after I have manually set the height so it calls things in order
	Block.prototype.init.call(this, container, makeBefore);

	this.textList[0].xOffset = 10;
	this.textList[0].width = this.width - 10;
	var div = this.textList[0].link;
	var inputs = div.getElementsByTagName('textarea');
	var input = inputs[0];
	input.value = "while(true)";

	//create the container and add it to the container list
	var _container1 = new Container(this.app, this, this.x+15, this.y+25, this.width-15, this.app.buttonHeight);
	this.containerList.addContainer(_container1);
}

WhileBlock.prototype.draw = function(ctx, drawText) {
	Block.prototype.draw.call(this, ctx, drawText);

	this.containerList.draw(ctx, drawText);
}

WhileBlock.prototype.setWidth = function(width) {
	this.width = width;
	this.containerList.setWidth(width-15);
}

WhileBlock.prototype.convertToCommand = function() {
	var _command = new Command(this.container.boxListIdTemp, 3);
	this.app.commandsToExecute.push(_command);

	Box.prototype.convertToCommand.call(this);

	for(var i = 0; i < this.containerList.list.length; i++) {
		this.containerList.list[i].convertToCommand();
	}
}

//*****************************************************************************************************************************************************
//******************************************************************* CASEBLOCK ***********************************************************************
//*****************************************************************************************************************************************************
function CaseButton(x, y, sprite) {
	this.x = x;
	this.y = y;
	this.sprite = sprite;
	this.h = 16;
	this.w = 16;
	this.hover = false;
}

CaseButton.prototype.draw = function(ctx, drawText) {
	if(this.hover) {
		ctx.drawImage(ASSET_MANAGER.getAsset('img/'+this.sprite+'Hover.png'), this.x, this.y);
	} else {
		ctx.drawImage(ASSET_MANAGER.getAsset('img/'+this.sprite+'.png'), this.x, this.y);
	}
}

CaseButton.prototype.isInside = function(x, y) {
	return (x > this.x && x < this.x+this.w && y > this.y && y < this.y+this.h);
}

function CaseBlock(app, container, makeBefore) {
    ContainerBlock.call(this, app, container, makeBefore);
    this.drawButton = false;
}

CaseBlock.prototype = new ContainerBlock();
CaseBlock.prototype.constructor = CaseBlock;

CaseBlock.prototype.init = function(container, makeBefore) {
	this.childOffsetY = 60;
	this.containerList = new ContainerList();
	this.height = heightToMove = 60+this.app.buttonHeight;

	this.numOfLines = 1;
	this.numOfLinesBottom = 1;
	
	//call this after I have manually set the height so it calls things in order
	Block.prototype.init.call(this, container, makeBefore);

	this.textList[0].xOffset = this.width*.21;
	this.textList[0].width = this.width*.69;
	var div = this.textList[0].link;
	var inputs = div.getElementsByTagName('textarea');
	var input = inputs[0];
	input.value = "switch(var)";
	input.style.textAlign = "center";

	//create the extra case divs
	var third = Math.floor(this.width/3);
	for(var i = 0; i < 3; i++) {
		this.createTextDiv(this, third*i, 40, "null", third, true, true, true);
	}

	//create the containers and add them to the container list
	var _container1 = new Container(this.app, this, this.x 		, this.y+this.childOffsetY, third, this.app.buttonHeight);
	this.containerList.addContainer(_container1);
	var _container2 = new Container(this.app, this, this.x+  third, this.y+this.childOffsetY, third, this.app.buttonHeight);
	this.containerList.addContainer(_container2);
	var _container3 = new Container(this.app, this, this.x+ 2*third, this.y+this.childOffsetY, third+1, this.app.buttonHeight);
	this.containerList.addContainer(_container3);

	this.addCaseButton = new CaseButton(this.x+this.width-16, this.y+1, 'caseAdd');
	this.removeCaseButton = new CaseButton(this.x+this.width-16, this.y+16, 'caseRemove');
}

CaseBlock.prototype.draw = function(ctx, drawText) {
	Block.prototype.draw.call(this, ctx, drawText);

	var x = this.x - this.incrementX;
	var y = this.y - this.incrementY;
	var h = this.height;
	var w = this.width;

	var numOfCases = this.containerList.list.length;
	var width = Math.floor(this.width/numOfCases);

	var extraHeightTop = (this.numOfLines-1)*this.app.buttonHeight;
	var extraHeightBot = (this.numOfLinesBottom-1)*this.app.buttonHeight;
	var slope = (40 + extraHeightTop) / (w*((numOfCases-1)/numOfCases));
	ctx.translate(0.5, 0.5);
	for(var i = 0; i < numOfCases; i++) {
		ctx.beginPath();
		ctx.moveTo(x + width*i, y + slope*width*i);
		ctx.lineTo(x + width*i, y + 60 + extraHeightTop + extraHeightBot);
		ctx.closePath();
		ctx.stroke();	
	}	
	ctx.beginPath();
	ctx.moveTo(x + 0, y + 0);
	ctx.lineTo(x + w*((numOfCases-1)/numOfCases), y + 40 + extraHeightTop);
	ctx.lineTo(x + w, y);
	ctx.closePath();
	ctx.stroke();	
	ctx.translate(-0.5, -0.5);

	if(this.drawButton) {
		this.addCaseButton.draw(ctx, drawText);
		this.removeCaseButton.draw(ctx, drawText);
	}

	this.containerList.draw(ctx, drawText);
}

CaseBlock.prototype.checkHover = function(x, y) {
	this.drawButton = this.isInside(x, y);
	if(this.drawButton) {
		this.addCaseButton.hover = this.addCaseButton.isInside(x, y);
		this.removeCaseButton.hover = this.removeCaseButton.isInside(x, y);
	}
}

CaseBlock.prototype.click = function(x, y) {
	if(this.addCaseButton.hover) {
		this.app.executeCommand(this, 10);
	}
	if(this.removeCaseButton.hover) {
		this.app.executeCommand(this, 11);
	}

	this.selected = false;
	if(this.containerList.click(x, y))
		return true;
	this.selected = this.isInside(x, y);
	return this.selected;
}

CaseBlock.prototype.moveByY = function(height) {
	ContainerBlock.prototype.moveByY.call(this, height);
	this.addCaseButton.y += height;
	this.removeCaseButton.y += height;
}

CaseBlock.prototype.addCase = function() {
	var numOfCases = this.containerList.list.length + 1;
	var width = Math.floor(this.width/numOfCases);
	var odd = (numOfCases/2 - Math.floor(numOfCases/2))*2;

	var container = new Container(this.app, this, this.x+(numOfCases-1)*width, 
		this.y+this.childOffsetY+(this.numOfLinesBottom-1+this.numOfLines-1)*this.app.buttonHeight, width+odd, this.getLargestContainer());
	this.containerList.addContainer(container);
	this.createTextDiv(this, (numOfCases-1)*width, 40, "null", width+odd, true, true, true);

	for(var i = 0; i < this.containerList.list.length-1; i++) {
		var _container = this.containerList.list[i];
		var newX = this.x+i*width;
		this.textList[i+1].xOffset = i*width;
		this.textList[i+1].width = width;
		var xToMove = newX - _container.x;
		_container.setWidth(width);
		_container.moveByX(xToMove);
	}
}

CaseBlock.prototype.removeCase = function() {
	var len = this.containerList.list.length;
	this.containerList.list[len-1].delete();
	this.containerList.list.splice(len-1, 1);

	this.textList[this.textList.length-1].delete();

	var numOfCases = len-1;
	var width = Math.floor(this.width/numOfCases);
	var odd = (numOfCases/2 - Math.floor(numOfCases/2))*2;

	for(var i = 0; i < this.containerList.list.length; i++) {
		var _container = this.containerList.list[i];
		var newX = this.x + i*width;
		this.textList[i+1].xOffset = i*width;
		this.textList[i+1].width = width;
		var xToMove = newX - _container.x;
		if(i == this.containerList.list.length-1)
			width += odd;
		_container.setWidth(width);
		_container.moveByX(xToMove);
	}
}

CaseBlock.prototype.update = function() {
	Box.prototype.update.call(this);
	this.containerList.update();
	for(var i = 0; i < this.textList.length; i++) {
		this.textList[i].update();
	}
	this.extraCaseHeight = (this.numOfLinesBottom - 1) * this.app.buttonHeight;
}

CaseBlock.prototype.textOverflow = function(text, sign) {
	var isChanged = false;

	if(text.bottom) {
	//if its a bottom label
		if(1*sign > 0) {
		//if its overflow
			text.numOfLines++;
			if(text.numOfLines > this.numOfLinesBottom) {
			//if this text box is expanding past the current line height
				this.numOfLinesBottom = text.numOfLines;
				isChanged = true;
			}
		}
		if(1*sign < 0)
		//if its underflow
			text.numOfLines--;
			var maxLines = 0;
			for(var i = 1; i < this.textList.length; i++)
				if(this.textList[i].numOfLines > maxLines)
					//get the highest number of lines from the case labels
					maxLines = this.textList[i].numOfLines;
			if(maxLines < this.numOfLinesBottom) {
			//if the new highest amount of lines is less than the old highest amount, then shrink this
				this.numOfLinesBottom = maxLines;
				isChanged = true;
			}
	} else {
	//if its the top label
		this.numOfLines += 1*sign;
		for(var i = 1; i < this.textList.length; i++) {
			this.textList[i].yOffset += this.app.buttonHeight*sign;		
		}
	}

	if(isChanged) {
		this.increaseHeight(this.app.buttonHeight*sign);
		this.containerList.moveByY(this.app.buttonHeight*sign);
	}
}

CaseBlock.prototype.convertToCommand = function() {
	var _command = new Command(this.container.boxListIdTemp, 4);
	this.app.commandsToExecute.push(_command);

	Box.prototype.convertToCommand.call(this);

	for(var i = 0; i < this.containerList.list.length; i++) {
		this.containerList.list[i].convertToCommand();
	}
}

//****************************************************************************************************************************************************
//********************************************************************** BUTTON **********************************************************************
//****************************************************************************************************************************************************
function Button(app, x, y, w, h, image) {
    Box.call(this, app, 0);

    this.x = x;
    this.y = y;
    this.originalY = y;
    this.width = w;
    this.height = h;
    this.hover = false;
    this.id = this.app.buttonList.nextId();
    this.image = 'img/button'+this.id+'.png';
    this.hoverLabel = null;
    this.name = "temp";
}

Button.prototype = new Box();
Button.prototype.constructor = Button;

Button.prototype.update = function() {
	this.y = this.originalY;
	if(this.hover) {
		if(!this.hoverLabel)
			this.hoverLabel = this.createLabel(this.id, this.name, this.app.mouse.x, this.app.mouse.y-20);
		else
			this.setLabelXandY(this.hoverLabel, this.app.mouse.x, this.app.mouse.y-20);
	} else if(this.hoverLabel) {
		document.getElementById('canvasContainer').removeChild(this.hoverLabel);
		this.hoverLabel = null;
	}
}

Button.prototype.createLabel = function(id, labelText, x, y) {
	var newLabelDiv = 
		"<div class='texts' id='label"+id+"' style='position:absolute; z-index:30; background: rgba(255, 255, 255, 0.7);'>" +
		"<p>"+labelText+"</p>" +
		"</div>";
	$("#canvasContainer").append(newLabelDiv);

	var canvas = document.getElementById('mainCanvas');
	var label = document.getElementById('label'+id);
	label.style.left = (canvas.offsetLeft+x)+"px";
	label.style.top =  (canvas.offsetTop+y)+"px";
	return label;
}

Button.prototype.setLabelXandY = function(label, x, y) {
	var canvas = document.getElementById('mainCanvas');
	label.style.left = (canvas.offsetLeft+x)+"px";
	label.style.top =  (canvas.offsetTop+y)+"px";
}

Button.prototype.init = function() {

}

Button.prototype.draw = function(ctx, drawText) {
	var index = 0;
	if(this.id > 0)
		index += 2;
	if(this.id > this.app.numOfButtons - 2)
		index += 2;
	if(this.hover)
		index++;

	var imageURL = 'img/image' + index + '.png';

	ctx.drawImage(ASSET_MANAGER.getAsset(imageURL), this.x, this.y);
	ctx.drawImage(ASSET_MANAGER.getAsset(this.image), this.x, this.y);
}
//********************************************************** BUTTON-LIST *********************************************************************
function ButtonList(app) {
	this.app = app;
	this.list = new Array();
}

ButtonList.prototype.addButton = function(button) {
	console.log("adding button to list with id: " + this.list.length);
	this.list.push(button);
}

ButtonList.prototype.draw = function(ctx, drawText) {
	for(var i = 0; i < this.list.length; i++) {
		this.list[i].draw(ctx, drawText);
	}
}

ButtonList.prototype.update = function() {
	for(var i = 0; i < this.list.length; i++) {
		this.list[i].update();
	}
}

ButtonList.prototype.checkHover = function(x, y) {
	for(var i = 0; i < this.list.length; i++) {
		this.list[i].hover = this.list[i].isInside(x, y);
	}
}

ButtonList.prototype.nextId = function() {
	return this.list.length;
}

ButtonList.prototype.isHover = function() {
	for(var i = 0; i < this.list.length; i++) {
		if(this.list[i].hover)
			return true;
	}
	return false;
}

ButtonList.prototype.click = function() {
	var index = 0;
	for(var i = 0; i < this.list.length; i++) {
		if(this.list[i].hover) {
			index = i;
		}
	}
	var selected = this.app.base.getSelected();

	//cannot process command 1-5 without box selected, cannot delete when container is selected
	if((!selected && index < 6) || (index == 5 && selected.blockList)) return;

	//if the button index is past 6 then add 100: the command won't be saved when past 100
	if(index > 5) index += 100;
	this.app.executeCommand(selected, index);
}

ButtonList.prototype.rClick = function() {
	var index = 0;
	for(var i = 0; i < 5; i++) {
		if(this.list[i].hover) {
			index = i;
		}
	}
	var selected = this.app.base.getSelected();

	//cannot process command 1-5 without box selected
	if(!selected) return;

	index += 50;
	this.app.executeCommand(selected, index);
}

ButtonList.prototype.moveByY = function(height) {
	for(var i = 0; i < this.list.length; i++) {
		this.list[i].y = this.list[i].originalY + height;
	}
}
//*********************************************************** ITEM-LIST ******************************************************************
function ItemList(app) {
	this.app = app;
	this.list = new Array();
}

ItemList.prototype.nextId = function() {
	return this.list.length;
}

ItemList.prototype.click = function(x, y) {
	for(var i = 0; i < this.list.length; i++) {
		if(this.list[i].click(x, y))
			return true;
	}
	return false;
}

ItemList.prototype.getSelected = function() {
	for(var i = 0; i < this.list.length; i++) {
		var selected = this.list[i].getSelected();
		if(selected) return selected;
	}
	return false;
}

ItemList.prototype.draw = function(ctx, drawText) {
	for(var i = 0; i < this.list.length; i++) {
		this.list[i].draw(ctx, drawText);
	}
}

ItemList.prototype.update = function() {
	for(var i = 0; i < this.list.length; i++) {
		this.list[i].update();
	}
}

ItemList.prototype.moveByY = function(height) {
	for(var i = 0; i < this.list.length; i++) {
		this.list[i].moveByY(height);
	}
}

ItemList.prototype.moveByX = function(width) {
	for(var i = 0; i < this.list.length; i++) {
		this.list[i].moveByX(width);
	}
}

ItemList.prototype.deleteAll = function() {
	for(var i = 0; i < this.list.length; i++) {
		this.list[i].delete();
	}
}

ItemList.prototype.checkHover = function(x, y) {
	for(var i = 0; i < this.list.length; i++) {
		this.list[i].checkHover(x, y);
	}
}

ItemList.prototype.setWidth = function(width) {
	for(var i = 0; i < this.list.length; i++) {
		this.list[i].setWidth(width);
	}
}

//********************************************************** CONTAINER-LIST **************************************************************
function ContainerList(app) {
    ItemList.call(this, app);
}

ContainerList.prototype = new ItemList();
ContainerList.prototype.constructor = ContainerList;

ContainerList.prototype.addContainer = function(container) {
	this.list.push(container);
}

//************************************************************ BLOCK-LIST *******************************************************************
function BlockList(app, container) {
    ItemList.call(this, app);
    this.container = container;
}

BlockList.prototype = new ItemList();
BlockList.prototype.constructor = BlockList;

BlockList.prototype.addBox = function(newBox, isBoxSelected, parentBox, builtBefore) {
	if(isBoxSelected) {
		//add the boxId into the BlockList of its container
		if(builtBefore)
			this.list.splice(parentBox.id, 0, newBox);
		else
			this.list.splice(parentBox.id+1, 0, newBox);
		this.resetIds();
		//move all the boxes below it down
		this.moveAllDown(newBox.id+1, heightToMove);
	} else {
		//add the box to BlockList
		this.list.push(newBox);	
	}
	//Make the DS bigger and move boxes below if the new box goes past the end of the DS		
	this.moveAllDownREC();
}

BlockList.prototype.moveAllDownREC = function() {
//Check if the container is too small. Then increase the height & nextY and
//move down all the boxes following this container. Recursively check the next container.
	var container = this.container;
	if(container.nextY > (container.y + container.height)) {
	//calculate how much its overlapping the end and increase the height
		var heightToInc = container.nextY - (container.y + container.height);
		container.height += heightToInc;
		if(container.parent) {
		//if this is not the top container then increase the nextY and adjust the size of the parent
			container.container.nextY += heightToInc;
			container.parent.height = container.parent.childOffsetY + container.parent.extraCaseHeight + container.height;
			if(container.parent.multiple)
				container.parent.setHeightOfContainers(container.height);
			//move all the boxes below this one by the overlap distance
			container.container.blockList.moveAllDown(container.parent.id+1, heightToInc);
		} else {
		//it is the top container
			if(container.height > this.app.baseH) {
				this.app.setCanvasHeight();
			}
		}
	}
	if(container.parent)
	//if its not the top container then move down all boxes below
		container.container.blockList.moveAllDownREC();
}

BlockList.prototype.moveAllDown = function(start, height) {
//move down all the boxes in 'container' by 'height' starting with 'start'
	for(var i = start; i < this.list.length; i++) {
		this.list[i].moveByY(height);		
	}
}

BlockList.prototype.moveAllUpREC = function(box, height) {
	var heightMod = height;
	var container = this.container;
	container.nextY -= height;
	if(container.parent) {
	//only decrease the height if its not the top DS
		container.height -= height;
		if(container.height < this.app.buttonHeight) {
			container.height = this.app.buttonHeight;
			heightMod -= this.app.buttonHeight;
		}
	} else {
	//its the top container, and decrease the height if its over this.baseH
		if(container.height > this.app.baseH)
			container.height -= height;
		if(container.height < this.app.baseH)
			container.height = this.app.baseH;
		this.app.setCanvasHeight();
	}

	if(container.parent && container.parent.multiple) {
		var maxHeight = container.parent.getLargestContainer();
		var maxNextY = container.parent.getLargestNextY();
		heightMod = maxHeight - maxNextY;
		if(maxHeight - heightMod < this.app.buttonHeight)
			heightMod = maxHeight - this.app.buttonHeight;
		container.parent.setHeightOfContainers(maxHeight-heightMod);
	}

	if(container.parent) {
	//if the container has a parent then set the parent to the right height
		container.parent.height = container.parent.childOffsetY + container.parent.extraCaseHeight + container.height;
	}

	this.moveAllUp(box.id+1, height);
	if(container.parent && heightMod > 0) {
	//if its not the first container and the container was shrunk then move up all the boxes below the container
		container.container.blockList.moveAllUpREC(container.parent, heightMod);
	}
}

BlockList.prototype.moveAllUp = function(start, height) {
//Move all the boxes after 'start' by 'height'
	for(var i = start; i < this.list.length; i++) {
		this.list[i].moveByY(-height);
	}
}

BlockList.prototype.deleteBox = function(box) {
	//delete box from the app box list
	this.app.removeBoxFromBoxList(box);

	//do any box-specific deletions
	box.delete();

	//move up all the boxes after this box
	this.moveAllUpREC(box, box.height);	
	
	//remove the box from the list
	this.list.splice(box.id, 1);
	
	//reset the id's for all following boxes because the splice messed them up
	this.resetIds();
}

BlockList.prototype.resetIds = function() {
//reset the id's for all the boxes
	for(var i = 0; i < this.list.length; i++) {
		this.list[i].id = i;
	}
}

//********************************************************************************************************************************************
//******************************************************************* ENGINE *****************************************************************
//********************************************************************************************************************************************
function Engine() {
	this.GUI = [];
	this.ctx = null;
	this.ctxMenu = null;

	//for clicking
	this.click = null;
	this.rClick = null;
	this.dblClick = null;
	this.mouse = null;

	//canvas stuff
	this.surfaceWidth = null;
	this.surfaceHeight = null;
	this.scrollAmount = 0;

	//for dragging with mouse
	this.mouseTemp = null;
	this.mouseDownEvent = false;
	this.mouseUpEvent = false;
	this.mouseDown = false;

	//colors used with boxes
	this.BUTTON_COLOR_DARK = "rgb(0, 0, 255)";
	this.BUTTON_COLOR_LIGHT = "rgb(0, 0, 128)";
	this.BOX_COLOR_WHITE = "rgb(255, 255, 255)";
	this.BOX_COLOR_YELLOW = "rgb(220, 230, 240)";
	this.CANVAS_CLEAR_COLOR = '#344157';

	this.numOfButtons = 10;
	this.BUTTON_DEFAULT_WIDTH = 800;
	this.buttonList = new ButtonList(this);
	this.buttonHeight = 17;

	//variables that change
	this.base = null;
	this.sizeToPrint = 0;
	this.nextTextId = 0;
	this.boxList = [];
	this.appTextList = [];
	this.commandList = [];
	this.redoList = [];
	this.commandsToExecute = [];

	//save stuff
	this.boxListTemp = [];
	this.textListTemp = [];
}

Engine.prototype.init = function() {
    console.log('app initialized');
    this.ctx = canvas.getContext('2d');
    this.ctxMenu = menuCanvas.getContext('2d');
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;

	this.baseY = 100;
	this.baseW = this.ctx.canvas.width-40;
	this.baseH = this.ctx.canvas.height-(25+this.baseY);

	console.log("canvas: " + this.ctx.canvas.height);

    this.startInput();

    this.base = new Container(this, 0, 20, this.baseY, this.baseW, this.baseH, 0);
    //create the buttons
    for(var i = 0; i < this.numOfButtons; i++) {
    	this.buttonList.addButton(new Button(this, 20 + 38*i, 20, 38, 33));
    }
    this.buttonList.list[0].name = "Block";
    this.buttonList.list[1].name = "If";
    this.buttonList.list[2].name = "Function";
    this.buttonList.list[3].name = "While";
    this.buttonList.list[4].name = "Case";
    this.buttonList.list[5].name = "Delete";
    this.buttonList.list[6].name = "Export to Image";
    this.buttonList.list[7].name = "Save";
    this.buttonList.list[8].name = "Load";
    this.buttonList.list[9].name = "Undo";
}


Engine.prototype.start = function() {
    console.log("starting app");
    var that = this;
    (function appLoop() {
        that.loop();
        requestAnimFrame(appLoop, that.ctx.canvas);
    })();
}

Engine.prototype.startInput = function() {
    var getXandY = function(e) {
        var x =  e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
        return {x: x, y: y};
    }
    
    var that = this;
    
    canvasContainer.addEventListener("click", function(e) {
        that.click = getXandY(e);
        //e.stopPropagation();
        //e.preventDefault();
    }, false);

    canvasContainer.addEventListener("mousemove", function(e) {
        that.mouse = getXandY(e);
    }, false);
	
    canvasContainer.addEventListener("mousedown", function(e) {
		that.mouseDownEvent = true;
        that.mouseDown = true;
        that.mouseTemp = that.mouse;
    }, false);	
	
    canvasContainer.addEventListener("mouseup", function(e) {
        that.mouseDown = false;
		that.mouseUpEvent = true;
    }, false);
	
    canvasContainer.addEventListener("dblclick", function(e) {
        that.dblclick = getXandY(e);
        e.stopPropagation();
        e.preventDefault();
    }, false);

	$("body").on("click", ".texts", function(e) {
		var inputs = this.getElementsByTagName('textarea');
		inputs[0].removeAttribute("readonly",0);
		that.click = getXandY(e);
	});

    $("body").on("mousemove", ".texts", function(e) {
		that.mouse = getXandY(e);
	});

	$("body").on("dblclick", ".texts", function(e) {
		var inputs = this.getElementsByTagName('textarea');
		inputs[0].removeAttribute("readonly",0);
	});

	$(window).on("scroll", function(e) {
		var _scroll = document.documentElement.scrollTop || document.body.scrollTop;
		that.scroll = _scroll;
		that.updateMenuPosition(_scroll);
	});
}

Engine.prototype.rightClick = function(x, y) {
	this.rClick = {x: x, y: y};
}

Engine.prototype.addBox = function(box, parentBox, builtBefore) {
	box.container.blockList.addBox(box, box.builtAfterBox, parentBox, builtBefore);
}

Engine.prototype.updateSizeToPrint = function() {
	var lastBox = this.base.blockList.list[this.base.blockList.list.length-1];
	this.sizeToPrint = lastBox.y + lastBox.height - this.baseY + 1;
}

Engine.prototype.removeBoxFromBoxList = function(box) {
	this.boxList.splice(box.boxListId, 1);
	for(var i = 0; i < this.boxList.length; i++) {
		this.boxList[i].boxListId = i;
	}
}

Engine.prototype.deleteBox = function(box) {
	box.container.blockList.deleteBox(box);
}

Engine.prototype.getBoxFromId = function(id) {
	if(id == -1) return this.base;
	return this.boxList[id];
}

Engine.prototype.getTextBox = function(element) {
	for(var i = 0; i < this.appTextList.length; i++) {
		if(this.appTextList[i].id == element)
			return this.appTextList[i];
	}
}

Engine.prototype.deleteTextBox = function(id) {
	for(var i = 0; i < this.appTextList.length; i++) {
		if(this.appTextList[i].id == id)
			this.appTextList.splice(i, 1);
	}
}

Engine.prototype.getTextBoxTemp = function(element) {
	for(var i = 0; i < this.textListTemp.length; i++) {
		if(this.textList[i].id == element)
			return this.textListTemp[i];
	}
}

Engine.prototype.setCanvasHeight = function() {
	this.ctx.canvas.height = 600 + (this.base.height - this.baseH);

	var container = document.getElementById('container2');
	var top = parseInt(this.ctx.canvas.style.top);
	//container.style.top = (top+this.ctx.canvas.height+16)+'px';
}

Engine.prototype.setNewSave = function() {
	this.commandsToExecute = [];
	this.boxListTemp = [];
	this.textListTemp = [];
	this.base.resetIdInListContainer();
	this.base.convertToCommand();

	json = JSON.stringify(this.commandsToExecute);
	$("#status").html("% of Save used: " + json.length/3200*100);
	setCookie("chart",json,365);

	var textjson = getCookie("chart");
	if(textjson != json) {
		console.log("didnt save");
		console.log("length: " + json.length + " vs " + textjson.length);
	}
}

Engine.prototype.executeListOfCommands = function() {
	for(var i = 0; i < this.commandsToExecute.length; i++) {
		var _c = this.commandsToExecute[i];
		var _selected = (_c.i == 9) ? _c.s : this.getBoxFromId(_c.s);
		this.executeCommand(_selected, _c.i, _c.text);
	}
	for(var i = 0; i < this.boxList.length; i++) {
		this.boxList[i].incrementX = 0;
		this.boxList[i].incrementY = 0;
	}
}

Engine.prototype.executeCommand = function(selected, index, text) {
	//add the command to the list, which can be exported in order to save the diagram
	console.log("Execute Command-- index: " + index + ", selected: " + selected.boxListId + ", text: " + text);
	if(index < 100) {
		if(index == 9) {
		//if Im editing the text in a textbox, then use a different format
			this.commandList.push(new Command(selected, index, text));
		} else {
		//otherwise add the command to the list with the generic format
			this.commandList.push(new Command((selected.boxListId||-1), index));
		}
	}
	switch(index) {
	//do stuff depending on which button (command) was pressed
		case 0:
			this.addBox(new Block(this, selected), selected);
			break;
		case 1:
			this.addBox(new ContainerBlock(this, selected), selected);
			break;
		case 2:
			this.addBox(new FunctionBlock(this, selected), selected);
			break;
		case 3:
			this.addBox(new WhileBlock(this, selected), selected);
			break;
		case 4:
			this.addBox(new CaseBlock(this, selected), selected);
			break;
		case 5:
			this.deleteBox(selected);
			break;
		case 9:
		//edit text
			var _textBox = this.getTextBox(selected);		
			var div = _textBox.link;
			var inputs = div.getElementsByTagName('textarea');
			var input = inputs[0];
			input.value = text;
			break;
		case 10:
		//add a case to a case block
			selected.addCase();
			break;
		case 11:
		//remove a case from a case block
			selected.removeCase();
			break;

		case 50:
			this.addBox(new Block(this, selected, true), selected, true);
			break;
		case 51:
			this.addBox(new ContainerBlock(this, selected, true), selected, true);
			break;
		case 52:
			this.addBox(new FunctionBlock(this, selected, true), selected, true);
			break;
		case 53:
			this.addBox(new WhileBlock(this, selected, true), selected, true);
			break;
		case 54:
			this.addBox(new CaseBlock(this, selected, true), selected, true);

		case 100:
		//load from database
			if(!json) break;
			this.base = new Container(this, 0, 20, this.baseY, this.baseW, this.baseH, 0);
    		this.commandsToExecute = json;
    		this.executeListOfCommands();
			break;
		case 106:
			app.saveCanvasImage();
			break;
		case 107:
		//save
			this.setNewSave();
			//SendChart(json);
			break;
		case 108:
		//load from cookie
			this.resetApp();

			//get the cookie to load from
			json = getCookie("chart");
			//console.log(json);
			this.commandsToExecute = JSON.parse(json);
			this.executeListOfCommands();
			break;
		case 109:
		//undo
			//save commands, then reset the app
			this.commandsToExecute = this.commandList;
			this.resetApp();

			this.commandsToExecute.pop();
			this.executeListOfCommands();
			break;
		case 110:
		//redo
			break;
	}
	this.updateSizeToPrint();
}

Engine.prototype.resetApp = function() {
	var container = document.getElementById('canvasContainer');
	for(var i = 0; i < this.appTextList.length; i++) {
	//try to remove all the text boxes
		var child = this.appTextList[i].link;
		try{
			if(child) container.removeChild(child);
		} catch(ex) {
			console.log("  ERROR: Could not remove child" + child.id + ": " + child);
			alert("error");
		}
	}
	this.base = new Container(this, 0, 20, this.baseY, this.baseW, this.baseH, 0);
	this.sizeToPrint = 0;
	this.nextTextId = 0;
	this.boxList = [];
	this.appTextList = [];
	this.commandList = [];
	this.redoList = [];
}

Engine.prototype.nextText = function() {
	return this.nextTextId++;
}

Engine.prototype.updateMenuPosition = function(scroll) {
	console.log("scroll");
	if(scroll > 85 && scroll < 10+canvas.height) {
	/*
	//if the window is scrolled past the menu bar
		this.scrollAmount = scroll-85;
		if(menuCanvas.style.top != scroll+'px') {
			menuCanvas.style.top = scroll+'px';
			var selector = document.getElementById('selectSize');
		}
	*/
		this.scrollAmount = scroll-85;
		$('#menuCanvas').addClass('stick');
	} else {
		$('#menuCanvas').removeClass('stick');
		this.scrollAmount = 0;
	}
	//otherwise its not scrolled past the menu bar, so set the top
		//menuCanvas.style.top = '84px';

/*


*/		
}

Engine.prototype.changeSelection = function(selected) {
	console.log("select: " + selected);
}

Engine.prototype.updateSelector = function() {
	var selector = document.getElementById('selectSize');
	var top = $('#menuCanvas').offset().top;
	var left =  $('#menuCanvas').offset().left;
	if(selector.style.top != (top+20)+'px') {
		selector.style.top = (top+20)+'px';
	}
	if(selector.style.left != (left+500)+'px') {
		selector.style.left = (left+500)+'px';
	}
}

Engine.prototype.printCommands = function() {
	for(var i = 0; i < this.commandList.length; i++) {
		var _c = this.commandList[i];
	}
}

Engine.prototype.saveCanvasImage = function() {
	this.base.deselectAll();
    var offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = this.baseW+1;
    offscreenCanvas.height = this.sizeToPrint;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.translate(-20, -this.baseY);
    this.base.draw(offscreenCtx, true);

    //var myWindow=window.open('','','width=800,height=500');
	var img = offscreenCanvas.toDataURL();
	var container = document.getElementById('container2');
	$("#container2").append('<img src="'+img+'"/>');
}

Engine.prototype.update = function() {
	this.base.update();
	this.buttonList.update();
	this.updateSelector();

	//try{
		if(this.click) {
			if(this.buttonList.isHover()) {
			//if the mouse is over a button then click on the buttons
				this.buttonList.click();
			} else {
			//else click on the boxes
				this.base.deselectAll();
				this.base.click(this.click.x, this.click.y);
			}
		}
		if(this.rClick) {
			if(this.buttonList.isHover()) {
			//if the mouse is over a button then click on the buttons
				this.buttonList.rClick();
			}	
		}
	//} catch(ex) {
	//	console.log("error: " + ex);
	//	alert("error");
	//}

	if(this.mouse) {
		this.buttonList.checkHover(this.mouse.x, this.mouse.y-this.scrollAmount);
		this.base.checkHover(this.mouse.x, this.mouse.y);
	}
}
    
Engine.prototype.draw = function() {	
	this.ctx.fillStyle = this.CANVAS_CLEAR_COLOR;
	this.ctx.clearRect(0, 0, this.surfaceWidth, this.ctx.canvas.height);

	this.base.draw(this.ctx);

	this.ctx.restore();

	this.ctxMenu.clearRect(0, 0, this.surfaceWidth, menuCanvas.height);
	this.buttonList.draw(this.ctxMenu);
	this.ctxMenu.restore();
}

Engine.prototype.loop = function() {
    this.update();
    this.draw();
    this.click = null;
    this.rClick = null;
	this.dblClick = false;

	this.mouseTemp = null;
	this.mouseDownEvent = false;
	this.mouseUpEvent = false;
}

//*************************************************************** START **********************************************************************

window.requestAnimFrame = (function() {
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
})();

var canvas = null;
var menuCanvas = null;
var canvasContainer = null;
$(function() {
	canvas = document.getElementById('mainCanvas');
	menuCanvas = document.getElementById('menuCanvas');
	canvasContainer = document.getElementById('canvasContainer');
});

var app = new Engine(canvas);

var ASSET_MANAGER = new AssetManager();

for(var i = 0; i < app.numOfButtons; i++){
	ASSET_MANAGER.queueDownload('img/button'+i+'.png');
}
for(var i = 0; i < 6; i++){
	ASSET_MANAGER.queueDownload('img/image'+i+'.png');
}
ASSET_MANAGER.queueDownload('img/caseAdd.png');
ASSET_MANAGER.queueDownload('img/caseAddHover.png');
ASSET_MANAGER.queueDownload('img/caseRemove.png');
ASSET_MANAGER.queueDownload('img/caseRemoveHover.png');

ASSET_MANAGER.downloadAll(function() {
    app.init();
    app.start();
});

$(document).ready( function() {
	$("#canvasContainer").rightClick( function(e) {
		var x = e.pageX - app.ctx.canvas.offsetLeft;
		var y = e.pageY - app.ctx.canvas.offsetTop;
		app.rightClick(x, y);
		console.log(x + ", " + y);
    });
});

function inputFieldKey(e, element) {
	if (e.keyCode == 13) {
		element.blur();
		return false;
	}
}

function elementBlur(element) {
	var div = element.parentNode;
	var _text = app.getTextBox(div.id);
	if(_text.text != element.value) {
	//if the text has been changed then add the command to the list
		_text.text = element.value;
		app.commandList.push(new Command(div.id, 9, element.value));
	}
	element.readOnly=true;
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