//mui初始化
mui.init({
	swipeBack: false,
	statusBarBackground: '#c80000',
	gestureConfig: {
		doubletap: true
	}
});
var subpages = ['html/home.html', 'html/cart.html', 'html/user.html'];
var subpage_style = {
	top: '0px',
	bottom: '50px'
};

var aniShow = {};
//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function() {
	//读取本地存储，检查是否为首次启动
	var showGuide = localStorage.getItem("lauchFlag");
	if (showGuide) {
		//有值，说明已经显示过了，无需显示；
		//		plus.navigator.closeSplashscreen();
		//		plus.navigator.setFullscreen(false);
		mui.openWindow({
			url: 'html/start.html',
			id: 'start.html',
			show: {
				aniShow: 'none'
			},
			waiting: {
				autoShow: false, //自动显示等待框，默认为true
				title: '', //等待对话框上显示的提示内容
			}
		});
		//延迟的原因：优先打开启动导航页面，避免资源争夺
		setTimeout(function() {
			//初始化模板
			initView();
		}, 200);
	} else {
		localStorage.setItem("lauchFlag",true);
		mui.openWindow({
			url: 'html/guide.html',
			id: 'guide.html',
			show: {
				aniShow: 'none'
			},
			waiting: {
				autoShow: true, //自动显示等待框，默认为true
				title: '', //等待对话框上显示的提示内容
			}
		});
		//延迟的原因：优先打开启动导航页面，避免资源争夺
		setTimeout(function() {
			//初始化模板
			initView();
		}, 200);
	}

	function initView() {
		var self = plus.webview.currentWebview();
		for (var i = 0; i < subpages.length; i++) {
			var temp = {};
			var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
			if (i > 0) {
				sub.hide();
			}
			self.append(sub);
		}
	}
});
//首页返回键处理
//处理逻辑：1秒内，连续两次按返回键，则退出应用；
var first = null;
mui.back = function() {

	//首次按键，提示‘再按一次退出应用’
	if (first) {
		first = new Date().getTime();
		mui.toast('再按一次退出应用');
		setTimeout(function() {
			first = 1;
		}, 1000)
	} else {
		if (new Date().getTime() - first < 1000) {
			plus.runtime.quit();
		}
	}
};

//当前激活选项
var activeTab = subpages[2];
//选项卡点击事件
mui('.bar-tab').on('tap', 'a', function(e) {
	var targetTab = this.getAttribute('href');
	if (targetTab == activeTab) {
		return;
	}
	//显示目标选项卡
	if (mui.os.ios || aniShow[targetTab]) {
		plus.webview.show(targetTab);
	} else {
		var temp = {};
		temp[targetTab] = "true";
		mui.extend(aniShow, temp);
		plus.webview.show(targetTab, "pop-in", 300);
	}
	var targetView = plus.webview.getWebviewById(targetTab);
	//隐藏当前;
	plus.webview.hide(activeTab);
	//更改当前活跃的选项卡
	activeTab = targetTab;
});
//自定义事件，模拟点击“首页选项卡”
document.addEventListener('gohome', function() {
	var defaultTab =  document.querySelector("#defaultTab");
	//模拟首页点击
	mui.trigger(defaultTab, 'tap');
	//切换选项卡高亮
	var current = document.querySelector(".active");
	if (defaultTab !== current) {
		current.classList.removeClass('active');
		defaultTab.classList.addClass('active');
	}
});


