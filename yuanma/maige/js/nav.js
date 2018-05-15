/*
 * 下拉导航样式
 */
function NavList()
{
	this.navClass = "";
	this.navTimer = 0;
	this.Timer = null;
}

NavList.prototype = {
	version: "1.00",
	author: "jzy",
	initialize: function(){
		var thisTemp = this;
		if (!this.navClass) {
			throw new Error("必须指定navClass.");
			return;
		};
		clearTimeout(this.Timer);
		$('.' + thisTemp.navClass + '> ul > li').hover(function(){
			var _this = $(this);
			thisTemp.Timer = setTimeout(function(){
				_this.find('div').slideDown();
			}, thisTemp.navTimer);
		},
		function(){
			clearTimeout(thisTemp.Timer);
			$(this).find('div').stop(true, true).slideUp();
		}
		);
	}
}