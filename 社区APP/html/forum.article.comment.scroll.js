var _Data = {'lat':'', 'lng':'', 'key':app.store('key'), 'page':0, 'limit':20, 'category':''};

function next (cb) {
	console.log('查询数据：' + JSON.stringify(_Data));
	//plus.nativeUI.showWaiting('加载中...');
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/forum/forum_comment_list'),
		'data'     : mui.extend({}, _Data, {'page':_Data.page+1})
	})
	.fail(function (res) {
		console.log('取得评论数据失败：' + JSON.stringify(res));
		app.error('取得评论数据失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('评论数据：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		_Data.page++;
		cb && cb(res);
	})
	;
}

function funcPulldownRefresh () {
	_Data.page = 0;
	//console.log('重新刷新页面' + JSON.stringify(_Data));
	$('#pnl-comment').empty();
	plus.nativeUI.showWaiting('正在刷新...');
	
	next(function (res) {
		plus.nativeUI.closeWaiting();
		$('#pnl-comment').html(template('tpl-comment', res));
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();//参数为true代表没有更多数据了。
	});
}
function funcPullupRefresh () {
	next(function (res) {
		var noMore = _Data.page * _Data.limit >= (res.total||1);
		
		if (_Data.page == 1) {
			$('#pnl-comment').html(template('tpl-comment', res));
		} else {
			$('#pnl-comment').append(template('tpl-comment', res));
		}
		
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(noMore);//参数为true代表没有更多数据了。
	});
}

mui.init({
	pullRefresh   : {
		container : "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		down      : {
			contentdown    : "下拉可重新加载",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentover    : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback       : funcPulldownRefresh,
		},
		up        : {
			//contentdown    : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			//contentover    : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback       : funcPullupRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	}
});

function init () {
	var view = plus.webview.currentWebview();
	_Data.forum_id = view.extras.id;
	
	$('#pnl-comment').empty();
	
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/forum/forum_view'),
		'data'     : _Data
	})
	.fail(function (res) {
		console.log('取得帖子数据失败：' + JSON.stringify(res));
		app.error('取得帖子数据失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('帖子数据：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		$('.author-avatar').attr('src', res.forum_view.avatar ? (app.link.image + res.forum_view.avatar) : '../img/iconfont-morentouxiang.png');
		$('.article-author').text(res.forum_view.nickname || res.forum_view.account);
		$('.article-time').text(res.forum_view.add_time);
		$('.article-title').text(res.forum_view.title);
		$('.article-content').html(res.forum_view.content);
		
		$('#pnl-image').html(template('tpl-image', res.forum_view));
		
		setTimeout(function () { mui('#refreshContainer').pullRefresh().pullupLoading(); }, 200);
	})
	;
}

mui.plusReady(init);


template.helper('image', function (v) {
	return app.link.image + v;
});

template.helper('avatar', function (v) {
	return v ? (app.link.image + v) : '../img/iconfont-morentouxiang.png';
});

// 评论帖子
$('body').delegate('.btn-comment', 'tap', function(e) {
	var dom = this; e.stopPropagation();
	var data = {
		'id'   : _Data.forum_id,
	};
	app.open('forum.comment.html', data);
});
// 收藏帖子
$('body').delegate('.btn-like', 'tap', function(e) {
	var dom = this; e.stopPropagation();
	var data = {
		'key'  : app.store('key'),
		'id'   : _Data.forum_id,
	};
	
	//if ($(dom).hasClass('liked')) { plus.nativeUI.toast('你已经收藏过了'); return; }
	
	plus.nativeUI.showWaiting();
	$.ajax({
		'dataType' : 'json',
		'type'     : 'post',
		'url'      : app.url('mobile/forum/collection'),
		'data'     : data
	})
	.fail(function (res) {
		console.log('收藏失败：' + JSON.stringify(res));
		app.error('收藏失败');
		plus.nativeUI.closeWaiting();
	})
	.done(function (res) {
		console.log('收藏成功：' + JSON.stringify(res));
		plus.nativeUI.closeWaiting();
		
		if (res.error && res.error.msg) { app.error(res.error.msg); return; }
		if (false == res.status) {app.error(res.msg); return;};
		if (res.msg) { plus.nativeUI.toast(res.msg); };
		
		if ($(dom).hasClass('liked')) {
			$(dom).removeClass('liked').find('img').attr('src', '../img/icon.forum.like.png');
		} else {
			$(dom).addClass('liked').find('img').attr('src', '../img/icon.forum.liked.png');
		}
	})
	;
});


