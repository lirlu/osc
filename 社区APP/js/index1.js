//mui初始化
mui.init({
	swipeBack: false,
	statusBarBackground: '#ffffff',
	gestureConfig: {
		doubletap: true
	}
});
//设置默认加载页面
var subpages = ['home.html', 'cart.html', 'user.html'];
var subpagesName = ['首页', '购物车', '我'];
var subpage_style = {
	top: '44px',
	bottom: '54px'
};

var aniShow = {};
//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function() {
	console.log("当前页面URL：" + plus.webview.currentWebview().getURL());
	//读取本地存储，检查是否为首次启动
	var showGuide = localStorage.getItem("lauchFlag");
	if (showGuide) {
		//有值，说明已经显示过了，无需显示；
		openWindow.openwinTwo('html/start.html', 'start'); //调用打开窗口方法
		//延迟的原因：优先打开启动导航页面，避免资源争夺
		setTimeout(function() {
			//初始化模板,默认加载首页
			loadWin(0);
		}, 1000);
	} else {
		localStorage.setItem("lauchFlag", true);
		openWindow.openwinTwo('html/guide.html', 'guide');
		//延迟的原因：优先打开启动导航页面，避免资源争夺
		setTimeout(function() {
			//初始化模板,默认加载首页
			loadWin(0);
		}, 1000);
	}
	
	//首页返回键处理
	//处理逻辑：1秒内，连续两次按返回键，则退出应用；
	var first = null;
	mui.back = function() {
		//首次按键，提示‘再按一次退出应用’
		if (!first) {
			first = new Date().getTime();
			mui.toast('再按一次退出应用');
			setTimeout(function() {
				first = null;
			}, 1000)
		} else {
			if (new Date().getTime() - first < 1000) {
				plus.runtime.quit();
			}
		}
	};
	
	tableSwitch();
});

//底部导航切换方法
function tableSwitch() {
	var btnArry = new Array();
	btnArry[0] = true;
	//当前激活选项
	var activeTab = subpages[0];
	//导航点击事件
	mui('.bar-tab').on('tap', 'a', function(e) {
		console.log('aaa');
		var current = document.querySelector(".bar-tab>.tab-item.active");
		current.classList.remove('active');
		this.classList.add('active');

		
		//alert($(this).index())
		var targetTab = this.getAttribute('Address');
		if (targetTab == activeTab) {
			return;
		}
		//判断是否加载页面
		if (btnArry[$(this).index()]) {
			showTable();
		} else {
			plus.nativeUI.showWaiting("加载中...", {
				background: "rgba(0,0,0,0.5)"
			});
			loadWin($(this).index());
			showTable();
			btnArry[$(this).index()] = true;
		}
		
		//显示目标选项卡
		function showTable() {
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
		}
	});
	//自定义事件，模拟点击“首页选项卡”
	document.addEventListener('gohome', function() {
		var defaultTab = document.getElementById("defaultTab");
		//模拟首页点击
		mui.trigger(defaultTab, 'tap');
		//切换选项卡高亮
		var current = document.querySelector(".bar-tab>.tab-item.active");
		if (defaultTab !== current) {
			current.classList.remove('active');
			defaultTab.classList.add('active');
		}
	});
}

function loadWin(index) {
	var self = plus.webview.currentWebview();
	//var sub = plus.webview.create(subpages[index], subpages[index], subpage_style);
	subpage_extras={
		Address:subpages[index],
		wType:subpages[index],
		wName:subpagesName[index]
	}
	var sub = plus.webview.create("html/publicHead.html", subpages[index], subpage_style,subpage_extras);
	self.append(sub);
	setTimeout(function() {
		plus.nativeUI.closeWaiting();
	}, 200);
}