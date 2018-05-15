//滚动图片构造函数
function ScrollPic() {
	this.scrollContId = "";
	this.arrLeftId = "";
	this.arrRightId = "";
	this.circularly = true;
	this.pageWidth = 0;
	this.frameWidth = 0;
	this.speed = 20;
	this.space = 20;
	this.upright = false;
	this.autoPlay = true;
	this.autoPlayTime = 5;
	this._autoTimeObj;
	this.scrollTimeObj;
	this.state = "ready";
	this.stripDiv = document.createElement("DIV");
	this.lDiv01 = document.createElement("DIV");
	this.lDiv02 = document.createElement("DIV");
	
};
ScrollPic.prototype = {
	version: "1.00",
	author: "jzy",
	initialize: function() {
		var thisTemp = this;
		if (!this.scrollContId) {
			throw new Error("必须指定scrollContId.");
			return
		};

		this.scDiv = this._$(this.scrollContId);
		if (!this.scDiv) {
			throw new Error("scrollContId不是正确的对象.(scrollContId = \"" + this.scrollContId + "\")");
			return
		};

		this.scDiv.style[this.upright ? 'height': 'width'] = this.frameWidth + "px";
		this.scDiv.style.overflow = "hidden";
		this.lDiv01.innerHTML = this.scDiv.innerHTML;
		this.scDiv.innerHTML = "";
		this.scDiv.appendChild(this.stripDiv);
		this.stripDiv.appendChild(this.lDiv01);
		this.stripDiv.style.overflow = "hidden";
		this.stripDiv.style.zoom = "1";
		this.stripDiv.style[this.upright ? 'height': 'width'] = "4560px";
		this.lDiv01.style.overflow = "hidden";
		this.lDiv01.style.zoom = "1";
		
		if (this.circularly) {
			this.stripDiv.appendChild(this.lDiv02);
			this.lDiv02.innerHTML = this.lDiv01.innerHTML;
			this.lDiv02.style.overflow = "hidden";
			this.lDiv02.style.zoom = "1";
		};

		if (!this.upright) {
			this.lDiv01.style.cssFloat = "left";
			this.lDiv01.style.styleFloat = "left"
		};
		if (this.circularly && !this.upright) {
			this.lDiv02.style.cssFloat = "left";
			this.lDiv02.style.styleFloat = "left"
		};
		this.addEvent(this.scDiv, "mouseover",
		function() {
			thisTemp.stop()
		});
		this.addEvent(this.scDiv, "mouseout",
		function() {
			thisTemp.play()
		});
		if (this.arrLeftId) {
			this.alObj = this._$(this.arrLeftId);
			if (this.alObj) {
				this.addEvent(this.alObj, "mousedown",
				function(e) {
					thisTemp.rightMouseDown();
				});
				this.addEvent(this.alObj, "mouseup",
				function() {
					thisTemp.rightEnd()
				});
				this.addEvent(this.alObj, "mouseout",
				function() {
					thisTemp.rightEnd()
				})
			}
		};
		if (this.arrRightId) {
			this.arObj = this._$(this.arrRightId);
			if (this.arObj) {
				this.addEvent(this.arObj, "mousedown",
				function(e) {
					thisTemp.leftMouseDown();
				});
				this.addEvent(this.arObj, "mouseup",
				function() {
					thisTemp.leftEnd()
				});
				this.addEvent(this.arObj, "mouseout",
				function() {
					thisTemp.leftEnd()
				})
			}
		};
		
		this.scDiv[this.upright ? 'scrollTop': 'scrollLeft'] = 0;
		if (this.autoPlay) {
			this.play()
		};
		this.scroll = this.upright ? 'scrollTop': 'scrollLeft';
		this.sWidth = this.upright ? 'scrollHeight': 'scrollWidth';
	},
	leftMouseDown: function() {
		if (this.state != "ready") {
			return
		};
		var thisTemp = this;
		this.state = "floating";
		clearInterval(this.scrollTimeObj);
		this.scrollTimeObj = setInterval(function() {
			thisTemp.moveLeft();
		},
		this.speed);
		
		this.moveLeft()
	},
	rightMouseDown: function() {
		if (this.state != "ready") {
			return
		};
		var thisTemp = this;
		this.state = "floating";
		clearInterval(this.scrollTimeObj);
		this.scrollTimeObj = setInterval(function() {
			thisTemp.moveRight()
		},
		this.speed);
		this.moveRight()
	},
	moveLeft: function() {
		if (this.state != "floating") {
			return
		};
		if (this.circularly) {
			if (this.scDiv[this.scroll] + this.space >= this.lDiv01[this.sWidth]) {
				this.scDiv[this.scroll] = this.scDiv[this.scroll] + this.space - this.lDiv01[this.sWidth];
				//this._$("jzy").innerHTML += this.scDiv[this.scroll] +" == ";
			} else {
				this.scDiv[this.scroll] += this.space;
			}
		} else {
			if (this.scDiv[this.scroll] + this.space >= this.lDiv01[this.sWidth] - this.frameWidth) {
				this.scDiv[this.scroll] = this.lDiv01[this.sWidth] - this.frameWidth;
				this.leftEnd()
			} else {
				this.scDiv[this.scroll] += this.space
			}
		};
	},
	moveRight: function() {
		if (this.state != "floating") {
			return
		};
		if (this.circularly) {
			if (this.scDiv[this.scroll] - this.space <= 0) {
				this.scDiv[this.scroll] = this.lDiv01[this.sWidth] + this.scDiv[this.scroll] - this.space;
				//this._$("jzy").innerHTML += this.scDiv[this.scroll] +" == ";
			} else {
				this.scDiv[this.scroll] -= this.space
			}
		} else {
			if (this.scDiv[this.scroll] - this.space <= 0) {
				this.scDiv[this.scroll] = 0;
				this.rightEnd()
			} else {
				this.scDiv[this.scroll] -= this.space
			}
		};
	},
	leftEnd: function() {
		if (this.state != "floating") {
			return
		};
		this.state = "stoping";
		clearInterval(this.scrollTimeObj);
		var fill = this.pageWidth - this.scDiv[this.scroll] % this.pageWidth;
		//alert(this.scDiv[this.scroll]/this.pageWidth + " == " + this.scDiv[this.scroll] % this.pageWidth);
		this.move(fill)
	},
	rightEnd: function() {
		if (this.state != "floating") {
			return
		};
		this.state = "stoping";
		clearInterval(this.scrollTimeObj);
		var fill = -this.scDiv[this.scroll] % this.pageWidth;
		//alert(fill);
		this.move(fill)
	},
	move: function(num, quick) {
		var thisTemp = this;
		var thisMove = num / 8;
		var theEnd = false;
		if (!quick) {
			if (thisMove > this.space) {
				thisMove = this.space
			};
			if (thisMove < -this.space) {
				thisMove = -this.space
			}
		};
		if (Math.abs(thisMove) < 1 && thisMove != 0) {
			thisMove = thisMove >= 0 ? 1 : -1
		} else {
			thisMove = Math.round(thisMove)
		};
		var temp = this.scDiv[this.scroll] + thisMove;
		if (thisMove > 0) {
			if (this.circularly) {
				if (this.scDiv[this.scroll] + thisMove >= this.lDiv01[this.sWidth]) {
					this.scDiv[this.scroll] = this.scDiv[this.scroll] + thisMove - this.lDiv01[this.sWidth]
				} else {
					this.scDiv[this.scroll] += thisMove
				}
			} else {
				if (this.scDiv[this.scroll] + thisMove >= this.lDiv01[this.sWidth] - this.frameWidth) {
					this.scDiv[this.scroll] = this.lDiv01[this.sWidth] - this.frameWidth;
					this.state = "ready";
					theEnd = true
				} else {
					this.scDiv[this.scroll] += thisMove
				}
			}
		} else {
			if (this.circularly) {
				if (this.scDiv[this.scroll] + thisMove < 0) {
					this.scDiv[this.scroll] = this.lDiv01[this.sWidth] + this.scDiv[this.scroll] + thisMove
				} else {
					this.scDiv[this.scroll] += thisMove
				}
			} else {
				if (this.scDiv[this.scroll] + thisMove <= 0) {
					this.scDiv[this.scroll] = 0;
					this.state = "ready";
					theEnd = true
				} else {
					this.scDiv[this.scroll] += thisMove
				}
			}
		};
		if (theEnd) {
			return
		};
		num -= thisMove;
		if (Math.abs(num) == 0) {
			this.state = "ready";
			if (this.autoPlay) {
				this.play()
			};
			return
		} else {
			clearTimeout(this.scrollTimeObj);
			this.scrollTimeObj = setTimeout(function() {
				thisTemp.move(num, quick)
			},
			this.speed)
		}
	},
	next: function() {
		if (this.state != "ready") {
			return
		};
		this.state = "stoping";
		if (this.circularly) {
			this.move(this.pageWidth)
		} else {
			if (this.scDiv[this.scroll] >= this.lDiv01[this.sWidth] - this.frameWidth) {
				this.state = "ready";
			} else {
				this.move(this.pageWidth)
			}
		}
	},
	play: function() {
		var thisTemp = this;
		if (!this.autoPlay) {
			return
		};
		clearInterval(this._autoTimeObj);
		this._autoTimeObj = setInterval(function() {
			thisTemp.next()
		},
		this.autoPlayTime * 1000)
	},
	stop: function() {
		clearInterval(this._autoTimeObj)
	},
	startMove: function(obj, attr, iTarget){
		var thisTemp = this;
        clearInterval(obj.timer);
        obj.timer = setInterval(function(){
        	thisTemp.doMove(obj, attr, iTarget);
        }, 10);
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
            }
            else {
                obj.style[attr] = iCur + iSpeed + 'px';
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
	getStyle: function(obj, attr){
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        }
		else if(window.getComputedStyle){
            return window.getComputedStyle(obj, false)[attr];
        }
    },
	isIE: navigator.appVersion.indexOf("MSIE") != -1 ? true: false,
	//isIE6: navigator.appVersion.indexOf("MSIE 6.0") != -1 ? true: false,
	isIE6: !window.XMLHttpRequest,
	getEbyTag: function(obj, oTag) {
		return obj.getElementsByTagName(oTag);
    },
    getEbyClass: function(obj, tag, className) {
        var reArray = [];
        var target = obj.getElementsByTagName(tag);
        for (i = 0; i < target.length; i++) {
            if (target[i].className == className) {
                reArray.push(target[i]);
            }
        }
        return reArray;
    },
	setClassName: function(obj, oClassName, state) {
		var temp;
		temp = obj.className;
		if (state == 'add') {
			if (temp) {
				temp += " " + oClassName;
			} else {
				temp = oClassName;
			}
		} else {
			if (temp) {
				temp = temp.replace(oClassName, '');
			} else {
				return
			}	
		};
		obj.className = temp
	},
	getChildNodes: function(obj) {
        var reArray = [];
        var target = obj.childNodes;
        for (i = 0; i < target.length; i++) {
            if (target[i].nodeType == 1) {
                reArray.push(target[i]);
            }
        }
        return reArray;
    },
	getChildNodesByTag: function(obj, tag) {
        var reArray = [];
		tag = tag.toUpperCase();
        var target = obj.childNodes;
        for (i = 0; i < target.length; i++) {
            if (target[i].nodeName == tag) {
                reArray.push(target[i]);
            }
        }
        return reArray;
    },
	insertAfter: function(newObj, targetObj){
		var parent = targetObj.parentNode;
		if (parent.lastChild == targetObj) {
			parent.appendChild(newObj);
		} else {
			parent.insertBefore(newObj, targetObj.nextSibling);
		}

	},
	getNextSibling: function(obj){
		var tempObj = obj.nextSibling;
		while (tempObj.nodeType != 1){
			tempObj = tempObj.nextSibling;
		};
		return tempObj;
	},
	getPrevSibling: function(obj){
		var tempObj = obj.previousSibling;
		while (tempObj.nodeType != 1){
			tempObj = tempObj.previousSibling;
		};
		return tempObj;
	},
	getFirstChild: function(obj){
		var tempObj = obj.firstChild;
		while (tempObj.nodeType != 1){
			tempObj = tempObj.nextSibling;
		};
		return tempObj;
	},
	getLastChild: function(obj){
		var tempObj = obj.lastChild;
		while (tempObj.nodeType != 1){
			tempObj = tempObj.previousSibling;
		};
		return tempObj;
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
	getOs: function(){ 
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