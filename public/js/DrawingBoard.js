var DrawingBoard = function (canvasId, opts) {
    this.shapes = [];
    this.ticksToLive = 200;

	this.stage = new createjs.Stage (canvasId);
	this.width = this.stage.canvas.width = $(window).width();
	this.height = this.stage.canvas.height = $(window).height();

    // arts
    this.brushSize = 16;
    this.brushType = "round";
    this.brushColour = '#FFFFFF';
    this.bgColour = '#000000';

	createjs.Ticker.addEventListener('tick', this.onTick.bind(this));
    createjs.Ticker.setFPS(30);
}

DrawingBoard.prototype.onTick = function () {
    var root = this;
    this.shapes.forEach(function (element, index, array) {
        element.ticks++;

        if (element.ticks >= root.ticksToLive) {
            createjs.Tween.get(element).to({alpha: 0}, 1000).call(function() {
                root.stage.removeChildAt(root.stage.numChildren);
            });
            root.shapes.splice(index, 1);
        }
    });
	this.stage.update();
}

DrawingBoard.prototype.draw = function (data) {
    s = new createjs.Shape();

    var prevX = data.prevX * this.width;
    var prevY = data.prevY * this.height;
    var xPos = data.xPos * this.width;
    var yPos = data.yPos * this.height;

    s.graphics.setStrokeStyle(this.brushSize, this.brushType).s(this.brushColour);
    s.graphics.moveTo(prevX, prevY);
    s.graphics.lineTo(xPos, yPos);
    s.graphics.endStroke();
    s.ticks = 0;
    s.alpha = 0;

    createjs.Tween.get(s).to({alpha: 1}, 200, createjs.Ease.quadInOut);

    this.shapes.push(s);
    this.stage.addChild(s);
}

DrawingBoard.prototype.clear = function() {
    this.shapes.length = 0;
    this.stage.removeAllChildren();
}
