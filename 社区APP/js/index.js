//mui初始化
mui.init({
	swipeBack: false,
	statusBarBackground: '#000',
	gestureConfig: {
		doubletap: true
	}
});

//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function() {

	function child (link, data, style) {
		return plus.webview.create(link, link.replace(/^html\//g,''), style || {top:'0px', bottom:'45px'}, data || {});
	}
	
	var view = plus.webview.currentWebview();

	view.append(child('html/user.html'));
	view.append(child('html/cart.html'));
	view.append(child('html/home.html'));
	
	setTimeout(function() { plus.nativeUI.closeWaiting(); }, 200);
});

mui('nav.bar-tab').on('tap', '.tab-item', function() {
	$('nav.bar-tab .tab-item').removeClass("active");
	$(this).addClass("active");
	//app.load({'url' : 'html/' + this.getAttribute('data-url')});
	plus.webview.show(this.getAttribute('data-url'), 'pop-in', 200);
});
