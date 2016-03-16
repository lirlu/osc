
$(function(){
	$('.contol .appraise1').click(function(){
		if(!$(this).hasClass('activet')){
			$(this).addClass('activet');
			$('.section').hide().eq($(this).index()/2).show();
			$(this).siblings('.appraise1').removeClass('activet');
		}
	});
	$('.left-div ul li').click(function(){
		if(!$(this).hasClass('active1')){
			$(this).addClass('active1').siblings().removeClass('active1');
			$('.right-div').hide().eq($(this).index()).show();
			
		}
	});
	$('.right-div ul li').click(function(){
		if(!$(this).hasClass('active1')){
			$(this).addClass('active1').siblings().removeClass('active1');
			mui.openWindow({
				url: 'shop.detail1.html',
				id:'shop.detail1.html',
			    show:{
			      autoShow:false
			    }
			});
		}
	});
	
});










