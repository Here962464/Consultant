//menu部分
//给导航添加鼠标移入事件
$('.menu li').on('mouseenter',function(){
	//获取当前li索引
	t=$(this);
	//延时
	timer=setTimeout(function(){
		//折叠展开当前li下的盒子
		t.find("div").slideDown();	
	},400);
    t.addClass('change');   
});
//给li下面的dd添加鼠标移入事件
$('.menu li div dl dd').on('mouseenter',function(){
    $(this).addClass('change');
    //取消父级li的样式
    $(this).parents('.menu li').removeClass('change');
});
//给li添加鼠标移出事件
$('.menu li').on('mouseleave',function(){
	//清空延迟
	clearTimeout(timer);
	//折叠收起当前li下的盒子
	$(this).find("div").slideUp();
    $(this).removeClass('change');
});
//鼠标移出li下的盒子并且再次回到li时能有相应的样式
$('.menu li div dl').on('mouseleave',function(){	
    $(this).parents('.menu li').addClass('change');
});
//鼠标移出dd时清空样式
$('.menu li div dl dd').on('mouseleave',function(){	
    $(this).removeClass('change');
});
//二维码展示部分
$('.wechant').on('mouseenter',function(){
	aTimer=setTimeout(function(){
		$('.code').slideDown();
	},300);
});
$('.wechant').on('mouseleave',function(){
	clearInterval(aTimer);
	$('.code').slideUp();
});
//banner轮播图部分
var adTimer;
//定时器开启，每隔5秒向左轮播
adTimer=setInterval(movenext,5000);
//当鼠标移入轮播图时清除定时器并且触发向左向右箭头点击事件
$('.slideshow').on('mouseenter',function(){
	clearInterval(adTimer);
	$('#arrowl').click(function(){
		moveprev();
	});
	$('#arrowr').click(function(){
		movenext();
	});
});
//鼠标移出时开启定时器
$('.slideshow').on('mouseleave',function(){
	adTimer=setInterval(movenext,5000);
});
//向左轮播函数
function movenext() {
	//自定义动画，当事件被触发时，第一个li的marginLeft值在800毫秒内变成-760px
    $(".slideshow ul li:first-child").animate({marginLeft: "-760px"},800,
    //自定义动画结束后执行函数
	    function(){
	    	//克隆第一个li并声明一个变量变量保存
	    	var temp=$('.slideshow ul li:first-child').clone();
	    	//将原来的第一个li删除
	        $('.slideshow ul li:first-child').remove(); 
	        temp.css({marginLeft:"0"});
	        //将克隆的元素添加到ul的尾部，也就是说第一个元素现在成了最后一个元素
		    $(".slideshow ul").append(temp);
		});
}
//向右轮播函数
function moveprev(){
	//因为第一个元素如果向右移走了，从左边滑动过来的就会是空白，
	//所以要先克隆最后一个li，再移动第一个
	//同样，我们需要一个中间变量来保存这个元素
	var temp=$('.slideshow ul li:last-child').clone();
	//删除最后一个li
	$('.slideshow ul li:last-child').remove();
	temp.css({marginLeft:"-760px"});
	//将克隆的元素放到第一张
	$('.slideshow ul').prepend(temp);
	//给第一张添加自定义动画效果，改变其marginLeft值，并设置时间
	$(".slideshow ul li:first-child").animate({marginLeft:"0"},800);
}
//content consult轮播
var addTimer=setInterval(consult,3000);
function consult(){
	$('.content .consult ol li:first-child').animate({
		marginTop:"-20px"},800,function(){
			var temp=$('.content .consult ol li:first-child').clone();
			$('.content .consult ol li:first-child').remove();
			temp.css({marginTop:"0"});
			$('.content .consult ol').append(temp);
	});
}
//鼠标移入清空定时器
$('.content .consult ol').on('mouseenter',function(){
	clearInterval(addTimer);
});
//鼠标移出时开启定时器
$('.content .consult ol').on('mouseleave',function(){
	addTimer=setInterval(consult,3000);
});

//teachers部分
var oLi1=$('.teachers ul li');
var classN1='change';
var obj1=$('.content .teachers .select');
var sibling1='.content .teachers .select';
var box1=$('.teachers');
timer(oLi1,classN1,obj1,box1,sibling1,4300);

//videos部分
var oLi2=$('.videos ul li');
var classN2='change';
var obj2=$('.content .videos .select');
var sibling2='.content .videos .select';
var box2=$('.videos');
timer(oLi2,classN2,obj2,box2,sibling2,3700);

//shares部分
var oLi3=$('.shares ul li');
var classN3='change';
var obj3=$('.content .shares .select');
var sibling3='.content .shares .select';
var box3=$('.shares');
timer(oLi3,classN3,obj3,box3,sibling3,3400);

function timer(oLi,classN,obj,box,sibling,speed){
	var i=0;
	var len=oLi.length;
	var eddTimer=setInterval(function(){	
		autoTab(i);
		i++;
		if(i==len){
			i=0;
		}
	},speed);
	function autoTab(index){
		oLi.eq(index).addClass(classN).siblings().removeClass(classN);
		obj.eq(index).css("display","block").siblings(sibling).css("display","none");
	}
	//鼠标移入清空定时器
	oLi.on('mouseenter',function(){
		clearInterval(eddTimer);
		var temp=$(this).index();
		autoTab(temp);
	});
	//鼠标移出时开启定时器
	box.on('mouseleave',function(){
		eddTimer=setInterval(function(){	
			autoTab(i);
			i++;
			if(i==len){
				i=0;
			}
		},speed);
	});
}