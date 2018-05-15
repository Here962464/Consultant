/*
 * 选项卡构造函数
 */
function SubShowClass(ID, eventType, defaultID, openClassName, closeClassName) {
	var t = this;
	this.parentObj = this._$(ID);
	if (this.parentObj == null && ID != "none") {
		throw new Error("SubShowClass(ID)参数错误:ID 对像不存在!(value:" + ID + ")")
	};
	this.autoPlay = true;
	this.autoPlayTimeObj = null;
	this.spaceTime = 5000;
	this.lock = false;
	this.label = [];
	this.defaultID = defaultID == null ? 0 : defaultID;
	this.selectedIndex = this.defaultID;
	this.openClassName = openClassName == null ? "selected": openClassName;
	this.closeClassName = closeClassName == null ? "": closeClassName;
	this.mouseIn = false;
	var mouseInFunc = function() {
		if (t.autoPlay == true) {
			t.stop();
		};
		t.mouseIn = true
	};
	var mouseOutFunc = function() {
		if (t.autoPlay == true) {
			t.play();
		};
		t.mouseIn = false
	};
	if (ID != "none" && ID != "") {
		this.addEvent(this.parentObj, "mouseover", mouseInFunc)
	};
	if (ID != "none" && ID != "") {
		this.addEvent(this.parentObj, "mouseout", mouseOutFunc)
	};
	if (typeof(eventType) != "string") {
		eventType = "onmousedown"
	};
	eventType = eventType.toLowerCase();
	switch (eventType) {
	case "onmouseover":
		this.eventType = "mouseover";
		break;
	case "onclick":
		this.eventType = "click";
		break;
	case "onmouseup":
		this.eventType = "mouseup";
		break;
	default:
		this.eventType = "mousedown"
	};
	if (this.autoPlay == true) {
		this.play();
	}
};
SubShowClass.prototype = {
	version: "1.00",
	author: "jzy",
	_delay: 200,
	addLabel: function(labelID, contID, parentBg, springEvent) {
		var t = this;
		var labelObj = this._$(labelID);
		var contObj = this._$(contID);
		if (labelObj == null && labelID != "none") {
			throw new Error("addLabel(labelID)参数错误:labelID 对像不存在!(value:" + labelID + ")")
		};
		var TempID = this.label.length;
		if (parentBg == "") {
			parentBg = null
		};
		this.label.push([labelID, contID, parentBg, springEvent]); //label 二维数组
		var tempFunc = function() {
			if (t.eventType == 'mouseover') {
				clearTimeout(labelObj._timeout);
				labelObj._timeout = setTimeout(function() {
					t.select(TempID)
				}, t._delay)
			} else {
				t.select(TempID)
			}
		};
		if (labelID != "none") {
			this.addEvent(labelObj, this.eventType, tempFunc);
			if (t.eventType == 'mouseover') {
				this.addEvent(labelObj, 'mouseout',
				function() {
					clearTimeout(labelObj._timeout)
				})
			}
		};
		if (TempID == this.defaultID) {
			if (labelID != "none") {
				this._setClassName(labelObj, "open")
			};
			if (this._$(contID)) {
				contObj.style.display = ""
			};
			if (this.ID != "none") {
				if (parentBg != null) {
					this.parentObj.style.background = parentBg
				}
			};
			if (springEvent != null) {
				eval(springEvent)
			}
		} else {
			if (labelID != "none") {
				this._setClassName(labelObj, "close")
			};
			if (contObj) {
				contObj.style.display = "none"
			}
		};
		var mouseInFunc = function() {
			if (t.autoPlay == true) {
				t.stop();
			};
			t.mouseIn = true
		};
		var mouseOutFunc = function() {
			if (t.autoPlay == true) {
				t.play();
			};
			t.mouseIn = false
		};
		if (labelObj) {
			this.addEvent(labelObj, 'mouseover', mouseInFunc);
			this.addEvent(labelObj, 'mouseout', mouseOutFunc)
		};
		if (contObj) {
			this.addEvent(contObj, 'mouseover', mouseInFunc);
			this.addEvent(contObj, 'mouseout', mouseOutFunc)
		}
	},
	select: function(num, force) {
		if (typeof(num) != "number") {
			throw new Error("select(num)参数错误:num 不是 number 类型!(value:" + num + ")")
		};
		if (force != true && this.selectedIndex == num) {
			return
		};
		var i;
		for (i = 0; i < this.label.length; i++) {
			if (i == num) {
				if (this.label[i][0] != "none") {
					this._setClassName(this._$(this.label[i][0]), "open")
				};
				if (this._$(this.label[i][1])) {
					this._$(this.label[i][1]).style.display = "";
				};
				if (this.ID != "none") {
					if (this.label[i][2] != null) {
						this.parentObj.style.background = this.label[i][2]
					}
				};
				if (this.label[i][3] != null) {
					if (typeof(this.label[i][3]) == 'function') {
						this.label[i][3]()
					} else {
						eval(this.label[i][3])
					}
				}
			} else if (this.selectedIndex == i || force == true) {
				if (this.label[i][0] != "none") {
					this._setClassName(this._$(this.label[i][0]), "close")
				};
				if (this._$(this.label[i][1])) {
					this._$(this.label[i][1]).style.display = "none"
				};
				if (this.label[i][4] != null) {
					if (typeof(this.label[i][4]) == 'function') {
						this.label[i][4]()
					} else {
						eval(this.label[i][4])
					}
				}
			}
		};
		this.selectedIndex = num
	},
	random: function() {
		if (arguments.length != this.label.length) {
			throw new Error("random()参数错误:参数数量与标签数量不符!(length:" + arguments.length + ")")
		};
		var sum = 0,
		i;
		for (i = 0; i < arguments.length; i++) {
			sum += arguments[i]
		};
		var randomNum = Math.random(),
		percent = 0;
		for (i = 0; i < arguments.length; i++) {
			percent += arguments[i] / sum;
			if (randomNum < percent) {
				this.select(i);
				break
			}
		}
	},
	play: function(spTime) {
		var t = this;
		if (typeof(spTime) == "number") {
			this.spaceTime = spTime
		};
		clearInterval(this.autoPlayTimeObj);
		this.autoPlayTimeObj = setInterval(function() {
			t.autoPlayFunc()
		}, this.spaceTime);
		this.autoPlay = true
	},
	autoPlayFunc: function() {
		if (this.autoPlay == false || this.mouseIn == true) {
			return
		};
		this.nextLabel()
	},
	nextLabel: function() {
		var t = this;
		var index = this.selectedIndex;
		index++;
		if (index >= this.label.length) {
			index = 0
		};
		this.select(index);
		if (this.autoPlay == true) {
			clearInterval(this.autoPlayTimeObj);
			this.autoPlayTimeObj = setInterval(function() {
				t.autoPlayFunc()
			}, this.spaceTime)
		}
	},
	previousLabel: function() {
		var t = this;
		var index = this.selectedIndex;
		index--;
		if (index < 0) {
			index = this.label.length - 1
		};
		this.select(index);
		if (this.autoPlay == true) {
			clearInterval(this.autoPlayTimeObj);
			this.autoPlayTimeObj = setInterval(function() {
				t.autoPlayFunc()
			}, this.spaceTime)
		}
	},
	stop: function() {
		clearInterval(this.autoPlayTimeObj);
		//this.autoPlay = false
	},
	_$: function(objName) {
		if (document.getElementById) {
			return eval('document.getElementById("' + objName + '")')
		} else {
			return eval('document.all.' + objName)
		}
	},
	_setClassName: function(obj, type) {
		var temp;
		temp = obj.className;
		if (temp) {
			temp = temp.replace(this.openClassName, "");
			temp = temp.replace(this.closeClassName, "");
			temp += " " + (type == "open" ? this.openClassName: this.closeClassName)
		} else {
			temp = (type == "open" ? this.openClassName: this.closeClassName)
		};
		obj.className = temp
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
	}
};
