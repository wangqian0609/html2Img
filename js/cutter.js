;(function(window, document, undefined) {
	'use strict';

	function Cutter(ele, opts) {
		this.ele = ele;
		this.defaults = {
			conWidth: ele.offsetWidth,
			conHeight: ele.offsetHeight,
			speed: 2
		};
		this.opts = this._extend({}, this.defaults, opts);
		this.cutData = {};

		this._init();
	}

	Cutter.prototype = {
		_init: function() {
			var img = new Image(),
				hammer = new Hammer(this.ele),
				_this = this,
				scaleIndex = 1;

			img.src = this.opts.imgUrl;
			img.style.webkitUserSelect = 'none';
			img.id = 'cutImgObj';

			img.onload = function() {

				var imgWidth = img.width,
					imgHeight = img.height,
					imgRate = imgWidth / imgHeight,
					conRate = _this.opts.conWidth / _this.opts.conHeight;

				if (imgRate > conRate) { //宽型

					var imgCurrentHeight = _this.opts.conHeight,
						imgCurrentWidth = imgCurrentHeight * imgRate,
						maxOffset = _this.opts.conWidth - imgCurrentWidth;

					img.setAttribute('width', 'auto');
					img.setAttribute('height', _this.opts.conHeight);
					
					hammer.on('pan', function(e) {
						var current = img.style.transform ? img.style.transform.split('(')[1].split('px')[0] : 0,
							move = Number(current) + (e.deltaX * (_this.opts.speed/10));

						if (move >= 0 || move <= maxOffset) {
							return;
						}

						img.style.transform = 'translateX('+move+'px)';

						_this.cutData.moveX = Math.abs(move);
						_this.cutData.moveY = 0;
					});

				} else { //高型

					var imgCurrentWidth = _this.opts.conWidth,
						imgCurrentHeight = imgCurrentWidth / imgRate,
						maxOffset = _this.opts.conHeight - imgCurrentHeight;

					img.setAttribute('width', '100%');
					
					hammer.get('pan').set({
			    		direction: Hammer.DIRECTION_VERTICAL
					});
					hammer.on('pan', function(e) {
						var current = img.style.transform ? img.style.transform.split('(')[1].split('px')[0] : 0,
							move = Number(current) + (e.deltaY * (_this.opts.speed/10));

						if (move >= 0 || move <= maxOffset) {
							return;
						}

						img.style.transform = 'translateY('+move+'px)';

						_this.cutData.moveX = 0;
						_this.cutData.moveY = Math.abs(move);
					});
				}
				
				_this.cutData.scaleRate = imgCurrentWidth / imgWidth;

				if(_this.ele.children.length > 0){
					for(var i = 0 ; i < _this.ele.children.length; i++){
						_this.ele.removeChild(_this.ele.childNodes[i]);
					}
				}

				_this.ele.appendChild(img);

				_this.opts.callback && _this.opts.callback();
			}

		},

		cut: function() {
			var canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d'),
				img = document.querySelector('#cutImgObj'),
				msg = document.querySelector('#cutMsg').value,
				lineWidth = 0,
				lastSubStrIndex = 0,
				lineHeight = 44,
				initX = 0, initY = 0,
				data = this.cutData,
				sx = data.moveX/data.scaleRate,sy = data.moveY/data.scaleRate,
				cutWidth = this.opts.conWidth / data.scaleRate,
				cutHeight = this.opts.conHeight / data.scaleRate;

			canvas.width = cutWidth;
			canvas.height = cutHeight;

			if(isNaN(sx)){
				sx = 0;
			}
			if(isNaN(sy)){
				sy = 0;
			}

			ctx.drawImage(img, sx, sy, cutWidth, cutHeight, 0, 0, cutWidth, cutHeight);
			if(msg !=''){
				ctx.beginPath();
				ctx.font = "normal 44px PingFangSC-Medium";
				ctx.textAlign = "start";
				ctx.textBaseline = "hanging";
				ctx.fillStyle = "#999";
				for(let i = 0; i < msg.length; i++){
					lineWidth += ctx.measureText(msg[i]).width;
					if(lineWidth > img.width/5*4){
						ctx.fillText(msg.substring(lastSubStrIndex,i),initX,initY);
						initY += lineHeight;
						lineWidth = 0;
						lastSubStrIndex = i;
					}
					if( i== msg.length -1){
						ctx.fillText(msg.substring(lastSubStrIndex,i+1),initX,initY);
					}
				}
				// ctx.fillText(msg,0,0,375);
			}
			return canvas.toDataURL('image/png');
		},

		_extend: function() {
			var args = Array.prototype.slice.call(arguments),
				len = args.length,
				obj = null, i;

			for (i = 0; i < len; i ++) {
				if (typeof(args[i]) !== 'object') {
					break;
				}
				if (i !== 0) {
					for (var o in args[i]) {
						if (args[i].hasOwnProperty(o)) obj[o] = args[i][o];
					}
				} else {
					obj = args[0];
				}
			}

			return obj;
		}
	}

	window.Cutter = Cutter;

})(window, document);

if (typeof module !== 'undefined') {
	module.exports = window.Cutter;
} else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.Cutter;
    });
}