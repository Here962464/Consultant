/*
 * 幻灯片插件
 */
function Slider(){
	this.focusViewId = "";
	this.focusTextId = "";
	this.focusSliderId = "";
	this.sliderNum = "";
	this.Num = 0;
	this.Prev = "";
	this.Next = "";
	this.upMove = false;
	this.listEvent = "onmouseover";
	this.OsObject = "";
};
Slider.prototype = {
	version: "1.20",
	author: "jzy",
	initialize: function(){
		var thisTemp = this;
		if (!this.focusViewId) {
			throw new Error("必须指定focusViewId.");
			return;
		};
		if (!this.focusTextId) {
			throw new Error("必须指定focusTextId.");
			return;
		};
		if (!this.focusTextId) {
			throw new Error("必须指定focusTextId.");
			return;
		};
		this.aImg = this._$(this.focusViewId).getElementsByTagName('li');
		this.aTxt = this._$(this.focusTextId).getElementsByTagName('li');
		this.aSmg = this._$(this.focusSliderId).getElementsByTagName('li');
		this.aaImg = this._$(this.focusViewId).getElementsByTagName('img');
		this.aaSmg = this._$(this.focusSliderId).getElementsByTagName('img');
		this.oUl = this._$(this.focusSliderId).getElementsByTagName('ul')[0];
	    this.oSliderNum = this._$(this.sliderNum);
	   	this.oPrev = this._$(this.Prev);
	    this.oNext = this._$(this.Next);
		
		this.intCountNext = 0;
		this.intCountPre = new Number();
		this.sListEvent = this.listEvent.substr(2);
		this.oSliderNum.innerHTML = 1 + '/' + this.aSmg.length;
		this.aWid = this.upMove ? 'height': 'width';
		this.aMarLeft = this.upMove ? 'marginTop': 'marginLeft';
		this.aSmgNum = this.aSmg.length - this.Num;
		this.aSmgWid = this.getStyle(this.aSmg[0], this.aWid);
		this.aSmgWid = parseInt(this.aSmgWid.substr(0, (this.aSmgWid.length - 2)));
		this.oUl.style[this.aWid] = this.aSmg.length * this.aSmgWid + "px";
		this.oUlMarLeft = parseInt(this.oUl.style[this.aMarLeft])?parseInt(this.oUl.style[this.aMarLeft]): 0;
		for (var i = 0; i < this.aSmg.length; i++) {
			this.aSmg[i].index = i;
			this.aImg[i].index = i;
			this.addEvent(this.aSmg[i], this.sListEvent, (function(d){
	　			return function(){thisTemp.fn.call(d)};
			})(this.aSmg[i]));
		};
		
		this.fn = function(){
			for (var n = 0; n < thisTemp.aSmg.length; n++) {
				thisTemp.aSmg[n].className = '';
				thisTemp.aTxt[n].className = '';
				thisTemp.startMove(thisTemp.aImg[n], 'opacity', 0);
				thisTemp.aImg[n].style.zIndex = 1;
			};
			thisTemp.aSmg[this.index].className = 'current';
			thisTemp.aTxt[this.index].className = 'show';
			thisTemp.oSliderNum.innerHTML = (this.index + 1) + '/' + thisTemp.aSmg.length;
			thisTemp.startMove(thisTemp.aImg[this.index], 'opacity', 100);
			thisTemp.aImg[this.index].style.zIndex = 2;
		};
		
		this.addEvent(this.oPrev, "mouseover", function(){
			if (!thisTemp.oUlMarLeft) {
				thisTemp.intCountPre = 0;
	        }else{
				thisTemp.intCountPre = Math.ceil(Math.abs(thisTemp.oUlMarLeft / thisTemp.aSmgWid));
			}			
		});
		this.addEvent(this.oPrev, "click", function(){
			if (thisTemp.aSmg.length <= thisTemp.Num) {
				return;
			}
			else {
				thisTemp.intCountPre--;
				if (thisTemp.intCountPre >= 0) {
					var aLeft = -thisTemp.aSmgWid * thisTemp.intCountPre;
					thisTemp.oUlMarLeft = aLeft;
					thisTemp.startMove(thisTemp.oUl, thisTemp.aMarLeft, aLeft);
				}
				else {
					thisTemp.oUlMarLeft = 0;
					thisTemp.startMove(thisTemp.oUl, thisTemp.aMarLeft, 0);
					return;
				}
			}	
		});
		
		this.addEvent(this.oNext, "mouseover", function(){
			if (!thisTemp.oUlMarLeft) {
				thisTemp.intCountNext = 0;
	        }else{
				thisTemp.intCountNext = Math.ceil(Math.abs(thisTemp.oUlMarLeft / thisTemp.aSmgWid));
			}			
		});
		this.addEvent(this.oNext, "click", function(){
			if (thisTemp.aSmg.length <= thisTemp.Num) {
				return;
			}
			else {
				thisTemp.intCountNext++;
				if (thisTemp.intCountNext <= thisTemp.aSmgNum) {
					var aLeft = -thisTemp.aSmgWid * thisTemp.intCountNext;
					thisTemp.oUlMarLeft = aLeft;
					thisTemp.startMove(thisTemp.oUl, thisTemp.aMarLeft, aLeft);
				}
				else {
					thisTemp.oUlMarLeft = -thisTemp.aSmgNum * thisTemp.aSmgWid;
					thisTemp.startMove(thisTemp.oUl, thisTemp.aMarLeft, -thisTemp.aSmgNum * thisTemp.aSmgWid);
					return;
				}
			}
		});
	},
	startMove: function(obj, attr, iTarget){
		var thisTemp = this;
        clearInterval(obj.timer);
        obj.timer = setInterval(function(){
        	thisTemp.doMove(obj, attr, iTarget);
        }, 20);
    },
    doMove: function(obj, attr, iTarget){
        var iCur = 0;
        if (attr == 'opacity') {
            iCur = parseInt(100 * this.getStyle(obj, attr)) || 0;
        }
        else {
            iCur = parseInt(this.getStyle(obj, attr)) || 0;
        }
        var iSpeed = (iTarget - iCur) / 8;
        iSpeed = (iSpeed > 0) ? Math.ceil(iSpeed) : Math.floor(iSpeed);
		//alert(iTarget);
		//_$("aa").innerHTML += "iSpeed= " + iSpeed +" ::: "+"iCur= " + iCur + " ::: " + "iTarget= " + iTarget + "<br /><br />";
        if (iCur == iTarget) {
            clearInterval(obj.timer);
        } else if (attr == 'opacity') {
			obj.style.filter = 'alpha(opacity=' + (iCur + iSpeed) + ')';
			obj.style.opacity = (iCur + iSpeed) / 100;
		} else {
			obj.style[attr] = iCur + iSpeed + 'px';
		}
    },
    getStyle: function(obj, attr){
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        }
		else if(window.getComputedStyle){
            return window.getComputedStyle(obj, false)[attr];
        }
    },
	_$: function(objectId) {
	  	if(document.getElementById && document.getElementById(objectId)) {
			// W3C DOM
			return document.getElementById(objectId);
		} else if (document.all && document.all(objectId)) {
			// MSIE 4 DOM
			return document.all(objectId);
		} else if (document.layers && document.layers[objectId]) {
			// NN 4 DOM.. note: this won't find nested layers
			return document.layers[objectId];
		} else {
			return false;
	  	}
	},
	isIE: navigator.appVersion.indexOf("MSIE") != -1 ? true: false,
	isIE6:navigator.appVersion.indexOf("MSIE 6.0") != -1 ? true: false,
    getEbyClass: function(obj, tag, clsName) {
        var reArray = [];
        var target = obj.getElementsByTagName(tag);
        for (i = 0; i < target.length; i++) {
            if (target[i].className == clsName) {
                reArray.push(target[i]);
            }
        }
        return reArray;
    },
	addEvent: function(obj, eventType, func) {
		if (obj.attachEvent) {
			obj.attachEvent("on" + eventType, func)
		} else {
			obj.addEventListener(eventType, func, false)
		}
	},
	delEvent: function(obj, eventType, func) {
		if (obj.detachEvent) {
			obj.detachEvent("on" + eventType, func)
		} else {
			obj.removeEventListener(eventType, func, false)
		}
	},
	getOs: function()
	{ 
	   var OsObject = ""; 
	   if(navigator.userAgent.indexOf("MSIE")>0) { 
	        this.OsObject = "MSIE"; 
	   } 
	   if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){ 
	        this.OsObject =  "Firefox"; 
	   } 
	   if(isSafari=navigator.userAgent.indexOf("Safari")>0) { 
	       this.OsObject =  "Safari"; 
	   } 
	   if(isCamino=navigator.userAgent.indexOf("Camino")>0){ 
	        this.OsObject =  "Camino"; 
	   } 
	   if(isMozilla=navigator.userAgent.indexOf("Gecko")>0){ 
	        this.OsObject =  "Gecko"; 
	   }  
	}
};
