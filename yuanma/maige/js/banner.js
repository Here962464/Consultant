/*
 * banner 切换类
 */
function Banner(){
	this.banId = "";
	this.banListId = "";
	this.banImgId = "";
	this.banButId = "";
	this.banLeftId = "";
	this.banRightId = "";
	this.listEvent = "onmouseover";
	this.autoPlay = true;
	this.autoPlayTime = 5;
	this.autoTimeObj;
	this.scrollTimeObj;
	this.fadeMove = true;
	this.leftMove = false;
	this.upMove = false;
	this.circularly = true;
	this.space = 20;
	this.state = "ready";
}
Banner.prototype = {
	version: "1.00",
	author: "jzy",
	initialize: function(){
		var thisTemp = this;
		if (!this.banId) {
			throw new Error("必须指定banId.");
			return;
		};
		if (!this.banListId) {
			throw new Error("必须指定banListId.");
			return;
		};
		if (!this.banImgId) {
			throw new Error("必须指定banImgId.");
			return;
		};
		if (!this.listEvent) {
			throw new Error("必须指定listEvent.");
			return;
		};
		if ((this.fadeMove ? 1 : 0) + (this.leftMove ? 1 : 0) + (this.upMove ? 1 : 0) !== 1) {
			return;
		};

		this.GlobalIndex = 0;
		this.sListEvent = this.listEvent.substr(2);
		this.abanner = this._$(this.banId);
		this.aBanList = this._$(this.banListId);
		this.aImg = this._$(this.banImgId).getElementsByTagName("li");
		this.aBut = this._$(this.banButId).getElementsByTagName("span");
		if (this.banLeftId != "" && this.banRightId != "") {
			this.aLeftBut = this._$(this.banLeftId);
			this.aRightBut = this._$(this.banRightId);
		};
		this.Num = this.aImg.length;
		this.aImgWid = this.aImg[0].offsetWidth;
		this.aImgHei = this.aImg[0].offsetHeight;
		this.addEvent(this.abanner, "mouseover", function(){
			thisTemp.stop();
		});
		this.addEvent(this.abanner, "mouseout", function(){
			thisTemp.play();
		});
		if (this.fadeMove) {
			for(var i = 0;i < this.Num;i++){
				this.aImg[i].index = i;
				this.aBut[i].index = i;
				this.aImg[i].style.opacity = 0;
				this.aImg[i].style.position = "absolute";
				this.aImg[i].style.zIndex = 1;
				
				this.addEvent(this.aBut[i], this.sListEvent, (function(d){
					return function(){thisTemp.fn.call(d)};
				})(this.aBut[i]));
			}
			this.aImg[0].style.opacity = 100;
			this.aImg[0].style.zIndex = 2;
			
			this.fn = function(){
				//alert(this.index);
				thisTemp.cut(this.index, thisTemp.Num);
			};
			if (this.aRightBut && this.aLeftBut) {
				this.addEvent(this.aRightBut, "click", function(){
					thisTemp.GlobalIndex += 1;
					if (thisTemp.GlobalIndex >= thisTemp.Num) {
						thisTemp.GlobalIndex = 0;
					}
					thisTemp.cut(thisTemp.GlobalIndex, thisTemp.Num);
				});
				this.addEvent(this.aLeftBut, "click", function(){
					thisTemp.GlobalIndex -= 1;
					if (thisTemp.GlobalIndex < 0) {
						thisTemp.GlobalIndex = thisTemp.Num - 1;
					}
					thisTemp.cut(thisTemp.GlobalIndex, thisTemp.Num);
				});
			};
		} else if (this.leftMove){
			if (this.circularly) {
				var thisTemp = this;
				this.banDiv = this.aBanList;
				this.scroll = "scrollLeft";
				this.sWidth = "scrollWidth";
				this.pageIndex = 0;
				this.pageWidth = this.banDiv.offsetWidth;
				this.banDiv[this.scroll] = 0; //this.banDiv 滚动条的水平位置
				this.banDiv.style.overflow = "hidden";
				this.strUl = this._$(this.banImgId);
				this.strUl.style.overflow = "hidden";
				this.strUl.style.zoom = "1";
				this.strUl.style.width = "11520px";
				
				this.strUl.innerHTML += this.strUl.innerHTML;
				this.tempArr = this.getChildNodes(this.strUl);
				for (var i = 0;i < this.tempArr.length;i++){
					if (this.isIE) {
						this.tempArr[i].style.styleFloat = "left";
					} else {
						this.tempArr[i].style.cssFloat = "left";
					}
				};
				this.halfWidth = this.pageWidth * this.tempArr.length / 2;
				if (this.aRightBut && this.aLeftBut) {
					this.addEvent(this.aLeftBut, "mousedown",
					function(e) {
						thisTemp.rightMouseDown();
					});
					this.addEvent(this.aLeftBut, "mouseup",
					function() {
						thisTemp.rightEnd();
					});
					this.addEvent(this.aLeftBut, "mouseout",
					function() {
						thisTemp.rightEnd();
					});
					this.addEvent(this.aRightBut, "mousedown",
					function(e) {
						thisTemp.leftMouseDown();
					});
					this.addEvent(this.aRightBut, "mouseup",
					function() {
						thisTemp.leftEnd();
					});
					this.addEvent(this.aRightBut, "mouseout",
					function() {
						thisTemp.leftEnd();
					});
				};
				var pages = Math.ceil(this.halfWidth / this.pageWidth);
				this.pageLength = pages;
				for (i = 0; i < this.pageLength; i++) {
					this.aBut[i].index = i;
					if (i == this.pageIndex) {
						this.aBut[i].className = "sBanBtn";
					} else {
						this.aBut[i].className = "dBanBtn";
					};
					this.addEvent(this.aBut[i], this.sListEvent, (function(d){
						return function(){thisTemp.fn.call(d);};
					})(this.aBut[i]));
				};
				this.fn = function(){
					thisTemp.pageTo(this.index);
				}
			} else {
				this._$(this.banImgId).style.width = this.aImg[0].offsetWidth * this.Num + "px";
				for (var i = 0; i < this.Num; i++) {
					this.aImg[i].index = i;
					this.aBut[i].index = i;
					
					if (this.isIE) {
						this.aImg[i].style.styleFloat = "left";
					} else {
						this.aImg[i].style.cssFloat = "left";
					}
					
					this.addEvent(this.aBut[i], this.sListEvent, (function(d){
						return function(){thisTemp.fn.call(d);};
					})(this.aBut[i]));
				};
				this.fn = function(){
					thisTemp.cutLevel(this.index, thisTemp._$(thisTemp.banImgId), thisTemp.Num, "left", -thisTemp.aImgWid * this.index);
				};
				if (this.aRightBut && this.aLeftBut) {
					this.addEvent(this.aRightBut, "click", function(){
						thisTemp.GlobalIndex += 1;
						if (thisTemp.GlobalIndex >= thisTemp.Num) {
							thisTemp.GlobalIndex = 0;
						}
						thisTemp.cutLevel(thisTemp.GlobalIndex, thisTemp._$(thisTemp.banImgId), thisTemp.Num, "left", -thisTemp.aImgWid * thisTemp.GlobalIndex);
					});
					this.addEvent(this.aLeftBut, "click", function(){
						thisTemp.GlobalIndex -= 1;
						if (thisTemp.GlobalIndex < 0) {
							thisTemp.GlobalIndex = thisTemp.Num - 1;
						}
						thisTemp.cutLevel(thisTemp.GlobalIndex, thisTemp._$(thisTemp.banImgId), thisTemp.Num, "left", -thisTemp.aImgWid * thisTemp.GlobalIndex);
					});
				};
			};
		} else {
			for(var i = 0;i < this.Num;i++){
				this.aImg[i].index = i;
				this.aBut[i].index = i;
				
				this.addEvent(this.aBut[i], this.sListEvent, (function(d){
					return function(){thisTemp.fn.call(d);};
				})(this.aBut[i]));
			};
			this.fn = function(){
				thisTemp.cutLevel(this.index, thisTemp._$(thisTemp.banImgId), thisTemp.Num, "top", -thisTemp.aImgHei * this.index);
			};
			if (this.aRightBut && this.aLeftBut) {
				this.addEvent(this.aRightBut, "click", function(){
					thisTemp.GlobalIndex += 1;
					if (thisTemp.GlobalIndex >= thisTemp.Num) {
						thisTemp.GlobalIndex = 0;
					}
					thisTemp.cutLevel(thisTemp.GlobalIndex, thisTemp._$(thisTemp.banImgId), thisTemp.Num, "top", -thisTemp.aImgHei * thisTemp.GlobalIndex);
				});
				this.addEvent(this.aLeftBut, "click", function(){
					thisTemp.GlobalIndex -= 1;
					if (thisTemp.GlobalIndex < 0) {
						thisTemp.GlobalIndex = thisTemp.Num - 1;
					}
					thisTemp.cutLevel(thisTemp.GlobalIndex, thisTemp._$(thisTemp.banImgId), thisTemp.Num, "top", -thisTemp.aImgHei * thisTemp.GlobalIndex);
				});
			};
		}
		
		if (this.autoPlay) {
			this.play();
		};
	},
	play: function() {
		var thisTemp = this;
		if (!this.autoPlay) {
			return
		};
		clearInterval(this.autoTimeObj);
		var indexImg = this.getIndex();
		if (this.fadeMove) {
			this.autoTimeObj = setInterval(function() {
				indexImg++;
				if (indexImg >= thisTemp.Num) {
					indexImg = 0;
				};
				thisTemp.cut(indexImg, thisTemp.Num);
			},
			this.autoPlayTime * 1000);
		} else if (this.leftMove) {
			if (this.circularly) {
				var thisTemp = this;
				if (!this.autoPlay) {
					return;
				};
				clearInterval(this.autoTimeObj);
				this.autoTimeObj = setInterval(function() {
					thisTemp.next();
				}, this.autoPlayTime * 1000);
			} else {
				this.autoTimeObj = setInterval(function() {
					indexImg++;
					if (indexImg >= thisTemp.Num) {
						indexImg = 0;
					};
					thisTemp.cutLevel(indexImg, thisTemp._$(thisTemp.banImgId), thisTemp.Num, "left", -thisTemp.aImgWid * indexImg);
				}, this.autoPlayTime * 1000);
			}
		} else {
			this.autoTimeObj = setInterval(function() {
				indexImg++;
				if (indexImg >= thisTemp.Num) {
					indexImg = 0;
				};
				thisTemp.cutLevel(indexImg, thisTemp._$(thisTemp.banImgId), thisTemp.Num, "top", -thisTemp.aImgHei * indexImg);
			}, this.autoPlayTime * 1000);
		}
	},
	stop: function() {
		if (!this.autoPlay) {
			return
		};
		clearInterval(this.autoTimeObj);
	},
	next: function() {
		if (this.state != "ready") {
			return
		};
		this.state = "stoping";
		this.move(this.pageWidth);
	},
	pageTo: function(num) {
		if (this.pageIndex == num) {
			return
		};
		if (num < 0) {
			num = this.pageLength - 1;
		};
		clearTimeout(this.scrollTimeObj);
		clearInterval(this.scrollTimeObj);
		this.state = "stoping";
		var fill = num * this.pageWidth - this.banDiv[this.scroll];
		this.move(fill);
	},
	getIndex: function(){
		var indexImg;
		for(var i = 0;i < this.Num;i++){
			if(this.aBut[i].className == "sBanBtn"){
				indexImg = i;
			}
		}
		return indexImg;
	},
	cut: function(index, count) {
		for(var i = 0;i < count;i++){
			this.startMove(this.aImg[i], 'opacity', 0);
			this.aImg[i].style.zIndex = 1;
			this.aBut[i].className = "dBanBtn";
		}
		this.startMove(this.aImg[index], 'opacity', 100);
		this.aImg[index].style.zIndex = 2;
		this.aBut[index].className = "sBanBtn";
		
		this.GlobalIndex = index;
	},
	cutLevel: function(index, obj, count, attr, iTarget){
		for(var i = 0;i < count;i++){
			this.aBut[i].className = "dBanBtn";
		};
		this.startMove(obj, attr, iTarget);
		this.aBut[index].className = "sBanBtn";
		
		this.GlobalIndex = index;
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
        } else {
            iCur = parseInt(this.getStyle(obj, attr)) || 0;
        }
        var iSpeed = (iTarget - iCur) / 10;
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
	leftMouseDown: function() {
		if (this.state != "ready") {
			return;
		};
		var thisTemp = this;
		this.state = "floating";
		clearInterval(this.scrollTimeObj);
		this.scrollTimeObj = setInterval(function() {
			thisTemp.moveLeft();
		}, 20);
		
		this.moveLeft();
	},
	rightMouseDown: function() {
		if (this.state != "ready") {
			return;
		};
		var thisTemp = this;
		this.state = "floating";
		clearInterval(this.scrollTimeObj);
		this.scrollTimeObj = setInterval(function() {
			thisTemp.moveRight();
		}, 20);
		this.moveRight();
	},
	moveLeft: function() {
		if (this.state != "floating") {
			return;
		};
		if (this.banDiv[this.scroll] + this.space >= this.halfWidth) {
			this.banDiv[this.scroll] = this.banDiv[this.scroll] + this.space - this.halfWidth;
		} else {
			this.banDiv[this.scroll] += this.space;
		};
		this.accountPageIndex();
	},
	moveRight: function() {
		if (this.state != "floating") {
			return;
		};
		if (this.banDiv[this.scroll] - this.space <= 0) {
			this.banDiv[this.scroll] = this.halfWidth + this.banDiv[this.scroll] - this.space;
		} else {
			this.banDiv[this.scroll] -= this.space;
		};
		this.accountPageIndex();
	},
	leftEnd: function() {
		if (this.state != "floating") {
			return
		};
		this.state = "stoping";
		clearInterval(this.scrollTimeObj);
		var fill = this.pageWidth - this.banDiv[this.scroll] % this.pageWidth;
		this.move(fill);
	},
	rightEnd: function() {
		if (this.state != "floating") {
			return
		};
		this.state = "stoping";
		clearInterval(this.scrollTimeObj);
		var fill = -this.banDiv[this.scroll] % this.pageWidth;
		this.move(fill);
	},
	move: function(num) {
		var thisTemp = this;
		var thisMove = num / 8;
		if (Math.abs(thisMove) < 1 && thisMove != 0) {
			thisMove = thisMove >= 0 ? 1 : -1
		} else {
			thisMove = Math.round(thisMove);
		};
		var temp = this.banDiv[this.scroll] + thisMove;
		if (thisMove > 0) {
			if (this.banDiv[this.scroll] + thisMove >= this.halfWidth) {
				this.banDiv[this.scroll] = this.banDiv[this.scroll] + thisMove - this.halfWidth;
			} else {
				this.banDiv[this.scroll] += thisMove;
			}
		} else {
			if (this.banDiv[this.scroll] + thisMove < 0) {
				this.banDiv[this.scroll] = this.halfWidth + this.banDiv[this.scroll] + thisMove
			} else {
				this.banDiv[this.scroll] += thisMove;
			}
		};
		this.accountPageIndex();
		num -= thisMove;
		if (Math.abs(num) == 0) {
			this.state = "ready";
			if (this.autoPlay) {
				this.play();
			};
			this.accountPageIndex();
			return;
		} else {
			clearTimeout(this.scrollTimeObj);
			this.scrollTimeObj = setTimeout(function() {
				thisTemp.move(num);
			}, 20)
		}
	},
	accountPageIndex: function() {
		var pageIndex = Math.round(this.banDiv[this.scroll] / this.pageWidth);
		if (pageIndex >= this.pageLength) {
			pageIndex = 0;
		};
		this.scrollLeft = this.banDiv[this.scroll];
		var scrollMax = this.halfWidth - this.pageWidth;
		if (pageIndex == this.pageIndex) {
			return;
		};
		this.pageIndex = pageIndex;
		if (this.pageIndex > Math.floor(this.halfWidth / this.pageWidth)) {
			this.pageIndex = 0;
		};
		for (var i = 0; i < this.aBut.length; i++) {
			if (i == this.pageIndex) {
				this.aBut[i].className = "sBanBtn";
			} else {
				this.aBut[i].className = "dBanBtn";
			}
		};
	},
	_$: function(objectId) {
	  	if(document.getElementById && document.getElementById(objectId)) {
			return document.getElementById(objectId);
		} else if (document.all && document.all(objectId)) {
			return document.all(objectId);
		} else if (document.layers && document.layers[objectId]) {
			return document.layers[objectId];
		} else {
			return false;
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
	isIE: navigator.appVersion.indexOf("MSIE") != -1 ? true: false,
	isIE6: navigator.appVersion.indexOf("MSIE 6.0") != -1 ? true: false,
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
	getChildNodes: function(obj) {
        var reArray = [];
        var target = obj.childNodes;
        for (i = 0; i < target.length; i++) {
            if (target[i].tagName) {
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
	getOs: function() { 
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
}