//mui初始化
mui.init({
	swipeBack: false,
	statusBarBackground: '#000',
	gestureConfig: {
		doubletap: true
	}
});

mui.back = function() {
	//首次按键，提示‘再按一次退出应用’
	if (new Date().getTime() - app.esced < 2000) {
		plus.runtime.quit();
	} else {
		app.esced = new Date().getTime();
		mui.toast('再按一次退出应用');
	}
};

//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function() {
	var view = plus.webview.currentWebview();
	
	if (!plus.storage.getItem('installed')) {
		//显示启动导航
		app.open('html/guide.html', {'top':'0px','bottom':'0px'});
		//延迟的原因：优先打开启动导航页面，避免资源争夺
		setTimeout(init, 500);
	} else {
		init();
	}
});
function init () {
	function child (link, data, style) {
		return plus.webview.create(link, link.replace(/^html\//g,''), style || {top:'0px', bottom:'45px'}, data || {});
	}
	var view = plus.webview.currentWebview();
	plus.navigator.closeSplashscreen();
	plus.navigator.setFullscreen(false);
	view.append(child('html/user.html'));
	view.append(child('html/cart.html'));
	view.append(child('html/home.html'));
	setTimeout(function() { plus.nativeUI.closeWaiting(); }, 200);
}

function trigger (name) {
	$('[data-url="'+name+'"]').trigger('tap');
}

$('nav.bar-tab .tab-item').on('tap', function() {
	$('nav.bar-tab .tab-item').removeClass("active");
	$(this).addClass("active");
	var view = this.getAttribute('data-url');
	if ('user.html' == view && !app.store('key')) {
		app.open('html/log.html');
	} else {
		plus.webview.show(view, 'pop-in', 200);
	}
});
