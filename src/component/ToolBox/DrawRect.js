import $ from 'jquery';

export default class DrawRect {
    constructor () {
        this.startX = 0;
        this.startY = 0;
        this.rectLeft = '0px';
        this.rectTop = '0px';
        this.rectHeight = '0px';
        this.rectWidth = '0px';
        this.flag = false;
        this.result = {};
        this.def = $.Deferred();

        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.cleanUp = this.cleanUp.bind(this);
        this.addDrawRectEventListener = this.addDrawRectEventListener.bind(this);
        this.removeDrawRectEventListener = this.removeDrawRectEventListener.bind(this);
        this.start = this.start.bind(this);
        this.end = this.end.bind(this);
    }

    start() {
        this.addDrawRectEventListener();
    }

    cleanUp() {
        this.startX = 0;
        this.startY = 0;
        this.rectLeft = '0px';
        this.rectTop = '0px';
        this.rectHeight = '0px';
        this.rectWidth = '0px';
        this.flag = false;
        this.result = {};
        this.def = $.Deferred();
        document.body.removeChild(document.getElementById('drawRect'));
    }

    end() {
        this.removeDrawRectEventListener();
    }

    onMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
        this.flag = true;
        //创建临时的方框div
        var evt = window.event || e;
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
        this.startX = evt.clientX + scrollLeft;
        this.startY = evt.clientY + scrollTop;
        var div = document.createElement('div');
        div.id = 'drawRect';
        div.className = 'div';
        div.style.position = 'absolute';
        div.style.left = this.startX + 'px';
        div.style.top = this.startY + 'px';
        div.style.backgroundColor = '#a0a0a0';
        div.style.opacity = '0.2';
        div.style.border = '1px solid #000';
        document.body.appendChild(div);
    }

    onMouseUp(e)  {
        e.preventDefault();
        e.stopPropagation();
        //画图结束
        var canvasRect = document.getElementById('canvas-dom').getBoundingClientRect();
        var result = {
            shapeWidth: parseInt(this.rectWidth),
            shapeHeight: parseInt(this.rectHeight),
            positionX: parseInt(this.rectLeft) - canvasRect.left,
            positionY: parseInt(this.rectTop) - canvasRect.top
        };
        this.result = result;
        if(this.flag) {
            this.def.resolve(this.result);
        } else {
            this.def.reject();
        }
    }

    onMouseMove(e)  {
        e.preventDefault();
        e.stopPropagation();
        if(this.flag){
            //画图跟踪
            var evt = window.event || e;
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
            var drawRectDiv = document.getElementById('drawRect');
            this.rectLeft = (this.startX - evt.clientX - scrollLeft > 0 ? evt.clientX + scrollLeft : this.startX) + 'px';
            this.rectTop = (this.startY - evt.clientY - scrollTop > 0 ? evt.clientY + scrollTop : this.startY) + 'px';
            this.rectHeight = Math.abs(this.startY - evt.clientY - scrollTop) + 'px';
            this.rectWidth = Math.abs(this.startX - evt.clientX - scrollLeft) + 'px';
            drawRectDiv.style.left = this.rectLeft;
            drawRectDiv.style.top = this.rectTop;
            drawRectDiv.style.width = this.rectWidth;
            drawRectDiv.style.height = this.rectHeight;
        }
    }

    addDrawRectEventListener() {
        //添加listener
        document.body.style.cursor = 'crosshair';
        document.body.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.body.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.body.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    removeDrawRectEventListener() {
        //移除listener
        document.body.style.cursor = 'auto';
        document.body.removeEventListener('mousedown', this.onMouseDown.bind(this));
        document.body.removeEventListener('mouseup', this.onMouseUp.bind(this));
        document.body.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }
}

module.exports = DrawRect;