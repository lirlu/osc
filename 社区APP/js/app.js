var app = window.lirlu = {};
app.esced = new Date();
app.pages = [];
app.link = {
	'server' : 'http://mtesh.cdlinglu.com/index.php?s=/',
	'image'  : 'http://mtesh.cdlinglu.com/attachs/',
	//'server' : 'http://192.168.2.68/index.php?s=/',
	//'image'  : 'http://192.168.2.68/attachs/',
	'share'  : 'http://mtesh.cdlinglu.com/index.php?s=mobile/share/index'
}
// 检测网络连接是否正常
app.isNetwordReady = function () {
	return plus.networkinfo.getCurrentType() == 1;
};
/**
 * 添加缓存数据
 * @param {Object} key
 * @param {Object} value
 */
app.store = function (key, value) {
	if (!key && !value) {
		return localStorage.get();
	} else if (key && value) {
		localStorage.setItem(key, JSON.stringify(value));
	} else if (!value) {
		var v = localStorage.getItem(key);
		try { v = JSON.parse(v); } catch (e) {}
		return v;
	}
}
/**
 * 显示3.5秒的toast错误提示信息
 * @param {String} 提示字符串
 */
app.error = function (text) {
	plus.nativeUI.toast(text, {'duration':'long'});
};
app.toast = function (text) {
	plus.nativeUI.toast(text);
}
/**
 * 获取当前地址
 * @param {Function} 回调方法，如果获取失败会返回一个默认的地址
 * @return {Object} 地址信息。JSON对象 
 */
app.locate = function (cb) {
	var view = plus.webview.currentWebview();
	plus.geolocation.getCurrentPosition(
		function (res) {
			localStorage.setItem("LocationAddress", JSON.stringify(res));
			if (cb) cb(res);
		}, 
		function () {
			plus.nativeUI.toast('定位失败,请检查手机定位是否开启！');
			if (cb) cb({'address':{'city':'北京市'}});
		}, 
		{ provider : 'baidu' }
	);
}
/**
 * 取得ArtTemplate并填充数据再把数据放于直接dom下。已做try catch处理
 * @param {Object} 用于放置构造出来的tpl代码的容器，可是jquery对象也可以是jquery的选择表达式
 * @return {String} 模板ID
 * @return {Object} 数据
 */
app.tpl = function (dom, tpl, data) {
	if (undefined !== data) {
		try { $(dom).html(template(tpl, data)); } catch (e) { app.log(e); };	
	} else if (undefined !== tpl) {
		return template(dom, tpl);
	}
};
/**
 * 补全URL地址
 * @param {String} API的URL后半段
 */
app.url = function (link) {
	return app.link.server + link;
}
app.home = function () {
	var preload = ['HBuilder', 'cart.html', 'user.html', 'home.html'];
	var pages = plus.webview.all();
	var views = [], uid = -1;
	function close_later () {
		setTimeout(function () {
			if (views.length > 0) {
				var v = views.pop();
				app.log('关闭页面：'+v.id);
				try {v.close();} catch (e) {}
				close_later();
			} else {
				app.log('关闭结束');
			}
		}, 200);
	}
	for (var i in pages) {
		try {
			var view = pages[i];
			if (-1 == preload.indexOf(view.id) && -1 < view.id.indexOf('.html')) {
				view.hide(); views.push(view);
			}
		} catch (e) {}
	}
	close_later();
}
app.log = function (k, v) {
	console.log(k,v);
}
/**
 * 预加载页面
 * @param {Object} link
 * @param {Object} data
 * @param {Object} style
 */
app.preload = function (link, data, style) {
	// 作用域是公用的
	return mui.preload({
		'url'    : link,
		'id'     : link,
		'styles' : style || {top:'0px', bottom:'45px'},
		'extras' : {extras:mui.extend({_FROM_:plus.webview.currentWebview().id}, data || {})},
	});
};
/**
 * 打开一个部分自定义的页面（头部，内容 均自己定义。底部使用通用）
 * @param {Object} link
 * @param {Object} data
 */
app.load = function (link, data) {
	return app.open(link, data, {top:'0px', bottom:'45px'});
};
/**
 * 打开一个完全自己定义的新页面（头部，内容，底部 均自己定义）
 * @param {Object} link
 * @param {Object} data
 */
app.open = function (link, data, style) {
	app.pages.push(link);
	
	return mui.openWindow({
	    'url'       : link,
	    'id'        : link,
	    'styles'    : style || {},
	    'extras'    : {extras:mui.extend({_FROM_:plus.webview.currentWebview().id}, data || {})},
	    'createNew' : false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
	    'waiting'   : {
	    	autoShow : true,//自动显示等待框，默认为true
	    	title    : '正在加载...',//等待对话框上显示的提示内容
	    }
	});
};




