
/*星际评价*/
$('.score .back_img').on('tap', function(){
	if ($(this).hasClass('star')) {
		if($(this).nextAll('.back_img').hasClass('star')){
			$(this).nextAll('.back_img').removeClass('star');
		}else{
			$(this).removeClass('star');
			$(this).prevAll('.back_img').removeClass('star');
		}				
	}else{
		$(this).addClass('star');
		$(this).prevAll('.back_img').addClass('star');
	}
});

// 提交评论
$('.btn-submit').on('tap', function () {
	var view = plus.webview.currentWebview();
	var data = {
		'key'      : app.store('key'),
		'order_id' : view.extras.order_id, 
		'order_no' : view.extras.order_no,
		'star'     : $('.star').length,
		'content'  : $('#comment-text').val(),
	};
	
	if (!data.content || data.content.length < 10) { plus.nativeUI.toast('评论内容至少写10个字'); return; }
	
	plus.nativeUI.showWaiting('提交中...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/order/evaluate'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('提交商品评论失败：' + JSON.stringify(res));
		app.error('提交商品评论失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('商品评论结果：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		plus.webview.currentWebview().close();
	})
	;
});
