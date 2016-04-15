var _Data = {'lat':'', 'lng':'', 'key':app.store('key'), 'page':0, 'limit':20, 'category':''};
mui.init();
	
mui.plusReady(function () {
	//plus.nativeUI.showWaiting('加载中...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/cateseller/convenient_seller_cate'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page+1})
	})
	.fail(function (res) {
		app.log('取得全部分类失败：' + JSON.stringify(res));
		app.error('取得全部分类失败');
		//plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		app.log('全部分类：' + JSON.stringify(res));
		//plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('#pnl-category').html(template('tpl-category', res));
		//$('[data-primary-category]:first').trigger('tap');
	})
	;
});
	
	
// 点击大分类
$('body').delegate('[data-primary-category]', 'tap', function () {
	var dom = this; id = $(this).attr('data-primary-category');
	
	$('[data-primary-category]').removeClass('active');
	$(dom).addClass('active');
	
	$('[data-parent]').removeClass('active');
	$('[data-parent='+id+']').addClass('active');
	
	// 没有二级分类刷新为第一级分类
	if ($('[data-parent='+id+'] [data-secondary-category]').length == 0) {
		category (id); return;
	}
	
	if (!id) {$('[data-parent='+id+'] li').trigger('tap');}
});
// 点击小分类
$('body').delegate('[data-secondary-category]', 'tap', function () {
	var dom = this, id = $(dom).attr('data-secondary-category');
	$('[data-secondary-category]').removeClass('active');
	$(dom).addClass('active');
	
	category (id);
});
function category (id) {
	// 切换TAB页回本社区
	var js = '$(\'[data-page="convenient.local.scroll.html"]\').addClass("activet").siblings().removeClass("activet");'
	plus.webview.getWebviewById('convenient.html').evalJS(js);
	// 重新加载数据
	var view = plus.webview.getWebviewById('convenient.local.scroll.html');
	view.evalJS('init({category:"'+(id||'')+'"})');
	view.show();
};








