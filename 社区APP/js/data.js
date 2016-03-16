var shequ = {};

shequ.AnimeList = {
	//加载数据等待效果
	DataLoad: function() {
		mui.plusReady(function() {
			plus.nativeUI.showWaiting("等待中...");
		});
	}
}

//地位地图
shequ.listMap = {
	//获取当前坐标
	shopMap: function() {
		mui.plusReady(function() {
			plus.geolocation.getCurrentPosition(function(e) {
				var lat = e.coords.latitude;
				var lng = e.coords.longitude;
				var Storage = window.localStorage;
				var lat1 = Storage.getItem('lat');
				var lng1 = Storage.getItem('lng');
				var a = new plus.maps.Point(lat, lng);
				var b = new plus.maps.Point(lat1, lng1)
				plus.maps.Map.calculateDistance(a, b, function(event) {
					var Storage = window.localStorage;
					Storage.setItem('dist', event.distance / 1000);
				}, function(e) {
					alert("Failed:" + JSON.stringify(e));
				});
			}, {
				provider: 'baidu'
			});
		})

	}
};

//请求数据
shequ.DataList = {
	_url: 'http://192.168.2.15/index.php?s=/',
	//请求函数
	ShopData: function(_url, _data, id, text, fn) {

		//加载数据等待效果
		shequ.AnimeList.DataLoad();
		//请求地址
		var rurl = shequ.DataList._url + _url;
		var Storage = window.localStorage;
		Storage.setItem('_url', rurl);

		console.log('当前请求的地址是：' + rurl);
		$.ajax({
			url: rurl,
			type: 'get',
			data: _data,
			success: function(data) {
				var datas = JSON.stringify(data);

				var nums = 10;
				var page = (data.sellerCount / nums);
				page = Math.ceil(page) - page < 1 ? (Math.ceil(page)) : (Math.floor(page));

				if (Storage.getItem('i') > page) {
					Storage.setItem('loop', true);
				} else {
					Storage.setItem('loop', false);
				}
				console.log('当前返回数据：' + datas);

				var html = template(id, data);

				$(text).html(html);
				try {
					plus.nativeUI.closeWaiting();
					fn && fn();
				} catch (e) {}

			},
			error: function(err) {
				console.log('当前错误提示：' + JSON.stringify(err));
				Storage.setItem('loop', true);
				try {
					plus.nativeUI.closeWaiting();
				} catch (e) {}
			},
			dataType: 'json'
		});
	},
	LoginFn: function(_url, _data, fn) {
		//请求地址
		var rurl = shequ.DataList._url + _url;
		var Storage = window.localStorage;
		console.log('当前请求的地址是：' + rurl);
		$.ajax({
			url: rurl,
			data: _data,
			type: 'post',
			success: function(data) {
				var datas = JSON.stringify(data);
				if (data.status == true) {
					Storage.setItem('key', data.key);
					fn && fn();
				} else {
					alert(data.msg);
				};
			},
			error: function(err) {
				console.log('当前错误提示：' + JSON.stringify(err));
			},
			dataType: 'json'
		})
	},
	//登录
	unLogoIn: function(_url, _data, fn) {
		if (Storage.getItem('mobile') == null) {
			return alert('用户名不存在');
		} else if (Storage.getItem('password') == null) {
			return alert('用户民吗错误');
		} else {
			Storage.setItem(_data);
		}
		fn && fn();
	}
};
//操作元素
shequ.DomArr = {

	//点击登录时
	Login: function(fn) {

		$('body').delegate('#logoin', 'tap', function() {

			var tel = $('#tel').val();

			var PassWord = $('#password').val();

			if (tel == '') {
				alert('手机号码输入不能为空');
				return false;
			} else if (!/^1[3,5,7,8,4]\d{9}$/.test(tel)) {
				alert('手机号码输入有错');
				return false;
			} else if (PassWord == '') {
				alert('密码输入不能为空');
				return false;
			} else {
				shequ.DataList.LoginFn('mobile/user/login', {
					mobile: tel,
					password: PassWord
				}, function() {

					fn && fn();
				});
			};
		});

	},
	//注册页面
	setUse: function(_url1, _url2, fn) {
		//获取验证码
		$('body').delegate('#code', 'tap', function() {
			var tel = $('#tel').val();

			if (tel == '') {
				alert('手机号码输入不能为空');
				return false;
			} else if (!/^1[3,5,7,8,4]\d{9}$/.test(tel)) {
				alert('手机号码输入有错');
				return false;
			} else {

				setTimeout(function() {
					shequ.DataList.LoginFn(_url1, {
						mobile: tel
					});
					$(this).attr(' disabled', "disabled");
				}, 500);
			}

		});
		//提交注册
		$('#submit').click(function() {

			var tel = $('#tel').val();
			var code1 = $('#code1').val();
			var password1 = $('#password1').val();
			var password2 = $('#password2').val();
			var CheckBox = $('#checkbox');

			if (tel == '') {
				alert('手机号码输入不能为空');
				return false;
			} else if (!/^1[3,5,7,8,4]\d{9}$/.test(tel)) {
				alert('手机号码输入有错');
				return false;
			} else if (code1 == '') {
				alert('验证码输入不能为空');
				return false;
			} else if (password1 == '') {
				alert('密码输入不能为空');
				return false;
			} else if (!/^\w\d{6,}$/.test(password1)) {
				alert('密码输入不能小于六位数');
				return false;
			} else if (password2 != password1) {
				alert('两次密码输入不一致');
				return false;
			}
			if (CheckBox.length != 0) {
				if (CheckBox.attr('checked') == undefined) {
					alert('请选择服务条款');
					return false;
				}
			}
			shequ.DataList.LoginFn(_url2, {
				'mobile': tel,
				'code': code1,
				'password1': password1,
				'password2': password2
			}, function() {
				fn && fn();
			});
		});

	},
	//滑动加载和刷新数据
	Pullup: function() {
		mui.init({
			pullRefresh: {
				container: '#refreshContainer', //待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
				up: {
					contentrefresh: "正在加载...",
					contentnomore: '没有更多数据了',
					callback: function() {
						var Storage = window.localStorage;
						var _url = Storage.getItem('_url');
						var i = 0;
						Storage.getItem('i', i++);
						shequ.DataList.ShopData(_url, {
							page: i++
						}, 'listLocalTemp', '#listLocal', function() {
							shequ.DomArr.Disfn();
							if (Storage.getItem('loop') == false) {
								this.endPullupToRefresh(false);
								mui('refreshContainer').pullRefresh().disablePullupToRefresh();
							} else {
								mui('#refreshContainer');
								this.endPullupToRefresh(true);
							}
						});
					}
				},
				down: {
					contentdown: "下拉可以刷新",
					contentrefresh: "正在刷新...",
					contentover: "释放立即刷新",
					callback: function() {
						var Storage = window.localStorage;
						var _url = Storage.getItem('_url');
						var i = 0;
						shequ.DataList.ShopData(_url, {
							page: i
						}, 'listLocalTemp', '#listLocal', function() {
							shequ.DomArr.Disfn();
						});
						(mui('#refreshContainer').pullRefresh().endPulldownToRefresh());
					}
				}
			}
		});
	},
	//主页点击跳转页面
	Address: function(Data) {
		$('body').delegate("[address]", 'tap', function() {

			var Storage = window.localStorage;
			Storage.setItem('title', $(this).attr('title'));
			Storage.setItem('goods_id', $(this).attr('goods_id'));
			Storage.setItem('shop_name', $(this).attr('shop_name'));

			mui.openWindow({
				url: $(this).attr('address'),
				id: $(this).attr('address'),
				extras: Data || {}
			});
		});
	},

	//点击购物车时
	ShopCart: function() {
		function yan(fn) {
			if (!window.localStorage.getItem('key')) {
				mui.openWindow({
					url: 'log.html'
				});
			} else {
				mui.openWindow({
					url: 'goods.detail.html'
				});
				fn && fn();
			};

		}
		$('body').delegate('#stars', 'tap', function() {
			yan(function() {
				alert('a0')
			});
		})
		$('body').delegate('#goods_id button', 'tap', function() {
			yan();
		});
	},
	//店铺列表
	ShopTab: function(_url, _data, _url2) {
		var iurl = _url2 || null;

		//操作元素按钮切换
		$('.contol').delegate('div.appraise1', 'tap', function() {
			$(this).addClass('activet').siblings().removeClass('activet');
			if ($(this).html() == '本社区') {
				shequ.DataList.ShopData(_url, _data, 'listLocalTemp', '#listLocal', function() {
					shequ.DomArr.Disfn();
				});
			} else if ($(this).html() == '全部分类') {
				//分类
				shequ.DataList.ShopData(_url, _data, 'listSortTemp', '#listLocal', function() {

					shequ.DomArr.Disfn();
					//分类第一项显示
					$('.right-div .namme').hide();
					$('.right-div ul').eq(0).show();

					$('.left-div:first').find('li').addClass('active1').css('background', '#eee');

					//点击一级列表
					$('body').delegate('.left-div', 'tap', function() {
						$(this).find('li').addClass('active1').css('background', '#eee');
						$(this).siblings().find('li').removeClass('active1').css('background', '');

						$('[data-name=' + $(this).attr('data-str') + ']').find('ul').css('display', 'block');
						$('[data-name=' + $(this).attr('data-str') + ']').siblings('.right-div').find('ul').css('display', 'none');
					});

					//点击二级列表
					$('.right-div').delegate('li', 'tap', function() {

						$(this).addClass('active1').siblings('li').removeClass('active1');
						$('div.appraise1').eq(0).addClass('activet').siblings().removeClass('activet');
						//本社区
						shequ.DataList.ShopData(iurl, {
							page: 1,
							cate_id: $(this).attr('data-name')
						}, 'listLocalTemp', '#listLocal', function() {
							shequ.DomArr.Disfn();
						});
					});
				});
			}
		});
	},
	//点击商家列表
	unShoping: function(fn) {
		$('body').delegate('.shop', 'tap', function() {
			var Storage = window.localStorage;
			Storage.setItem('shop_id', $(this).attr('shop_id'));
			Storage.setItem('cate_id', $(this).attr('cate_id'));

			mui.openWindow({
				url: $(this).attr('address'),
				id: $(this).attr('address')
			});
		});
		fn && fn();
	},
	//距离店铺
	Disfn: function(fn) {
		shequ.DomArr.unShoping();
		var Storage = window.localStorage;
		var lat1 = Storage.setItem('lat', $('.loction').attr('lat'));
		var lng1 = Storage.setItem('lng', $('.loction').attr('lng'));

		$('.loction').html((Number(Storage.getItem('dist')).toFixed(2)));
		fn && fn();
	},
	//店铺详情
	moveShop: function(_url, _data, fn) {
		shequ.DataList.ShopData(_url, _data, 'moveListTemp', '#moveList', function() {
			fn && fn();
		});
	},
	//附近商超nearby
	Nearby: function(_url, fn) {

		var iurl = fn || null;
		var Storage = window.localStorage;
		Storage.setItem('shop_id', $(this).attr('shop_id'));
		Storage.setItem('cate_id', $(this).attr('cate_id'));
		mui.plusReady(function() {
			plus.geolocation.getCurrentPosition(function(e) {
				shequ.DataList.ShopData(_url, {
					page: 1,
					lat: e.coords.latitude,
					lng: e.coords.longitude
				}, 'listLocalTemp', '#listLocal', iurl);
			});
		});
	},
	//附近商家列表
	shopList: function(_url1, _url2, _url3, fn) {

		$('.content').delegate(' .startime', 'tap', function() {	
			$(this).siblings('.startime1').toggle();
		});

		var Storage = window.localStorage;

		$('#shop_name').html(Storage.getItem('title'));
		//营业时间
		shequ.DomArr.moveShop(_url1, {
			shop_id: Storage.getItem('shop_id')
		});
		//左侧菜单列
		shequ.DataList.ShopData(_url1, {
			page: 1
		}, 'listLocalTemp', '#listLocal');

		//右侧侧菜单列
		shequ.DataList.ShopData(_url2, {
			page: 1,
			shop_id: Storage.getItem('shop_id')
		}, 'dataChilTemp', '#dataChil');

		//点击一级列表
		$('body').delegate('.left-div li', 'tap', function() {

			$(this).addClass('active1').css('background', '#eee').siblings().removeClass('active1').css('background', '');
			//本社区
			shequ.DataList.ShopData(_url2, {
				page: 1,
				shop_id: Storage.getItem('shop_id'),
				cate_id: $(this).attr('data-name')
			}, 'dataChilTemp', '#dataChil');
		});

		fn && fn();
	}
};