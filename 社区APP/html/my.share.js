var shares = {};
mui.plusReady(function () {
	// 初始化分享服务
	plus.share.getServices(function (services) {
		if (services && services.length > 0) {
			for (var i = 0; i < services.length; i++) {
				var item = services[i]; shares[item.id] = item;
				app.log(item.id);
			}
		}
	}, function() {
		app.log("获取分享服务列表失败");
	});
	
	//plus.nativeUI.showWaiting('加载中...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/share/income'),
		'data'     : {'key':app.store('key')}
	})
	.fail(function (res) {
		app.log('取得我获得的米币失败：' + JSON.stringify(res));
		app.error('取得我获得的米币失败');
	})
	.done(function (res) {
		app.log('我获得的米币：' + JSON.stringify(res));
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('.total').text(res.total || '0');
	})
	;
});
// 分享
function _doShareMessage (share, ex) {
	var view = plus.webview.currentWebview();
	var user = app.store('user');
	var message = {
		'extra'   : {'scene': ex},
		'href'    : app.link.share + '&uid=' + user.user_id,
		'title'   : '我正在使用米土e生活',
		'content' : '你们也快来试试吧',
	};
	if (~share.id.indexOf('weibo')) {
		message.content += "；体验地址：" + message.href;
	}
	message.thumbs = ["../img/10-01.png"];
	share.send(message, function() {
		app.log('分享到"' + share.description + '"成功！ ');
		app.toast('分享成功');
	}, function(e) {
		app.log('分享失败：', e);
		app.toast('分享失败');
	});
}
// 点击分享
$('.btn-share').on('tap', function () {
	var ids = [
		{'id':"weixin", 'ex': "WXSceneSession"},
		{'id':"weixin", 'ex': "WXSceneTimeline"}, 
		{'id':"sinaweibo"}, 
		//{'id':"tencentweibo"}, 
		{'id':"qq"}
	];
	
	var idx = parseInt($(this).attr('data-idx'), 10);
	var share = shares[ids[idx].id];
	if (!share) { app.toast('无法获取分享服务'); }

	if (share.authenticated) {
		_doShareMessage(share, ids[idx].ex); return;
	}
	share.authorize(function() {
		_doShareMessage(share, ids[idx].ex);
	}, function(e) {
		app.log('分享认证授权失败：' + e);
		app.toast('分享认证授权失败');
	});
});

// 快速回到首页
$('.btn-home').on('tap', function () {
	$(this).prop('disabled', true);
	plus.webview.getWebviewById('home.html').evalJS('app.home()');
});
