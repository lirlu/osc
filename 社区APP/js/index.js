//mui初始化
mui.init({
	swipeBack: false,
	statusBarBackground: '#000',
	gestureConfig: {
		doubletap: true
	}
});
//设置默认加载页面
var subpages = ['home.html', 'cart.html', 'log.html'];
var subpagesName = ['首页', '购物车', '我'];
var subpage_style = {
	top: '0px',
	bottom: '50px'
};

var aniShow = {};
//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function() {
	loadWin(0);
	//首页返回键处理
	//处理逻辑：1秒内，连续两次按返回键，则退出应用;
	var first = null;
	mui.back = function() {
		//首次按键，提示‘再按一次退出应用;
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
		if ($(this).index() == 2) {
			if (!window.localStorage.getItem('key')) {
				mui.openWindow({
					url: 'html/log.html'
				});
			} else {
				$.ajax({
					url: 'http://192.168.2.15/index.php?s=/mobile/userinfo/index',
					type: 'post',
					success: function(data) {
						if (data.status == false) {
							mui.openWindow({
								url: 'html/log.html'
							});
						} else {
							mui.openWindow({
								url: 'html/user.html'
							});
						}
					},
					error: function(err) {
						console.log('错误提示：'+JSON.stringify(err));
					},
					dataType: 'json'
				})
			}

		}
		var current = document.querySelector(".bar-tab>.tab-item.active");
		current.classList.remove('active');
		this.classList.add('active');
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
			//plus.nativeUI.alert(aniShow[targetTab]);
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
}

function loadWin(index) {
	var self = plus.webview.currentWebview();
	subpage_extras = {
		Address: subpages[index],
		wType: subpages[index],
		wName: subpagesName[index]
	}
	var sub = plus.webview.create("html/" + subpages[index], subpages[index], subpage_style, subpage_extras);
	self.append(sub);
	setTimeout(function() {
		plus.nativeUI.closeWaiting();
	}, 200);
}