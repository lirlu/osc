mui.init();
function addWin(address) {
	mui.openWindow({
		url: address,
		id: address,
		show: {
			aniShow: 'pop-in'
			},
		extras: {
			urlAddress: address
		}
//		waiting:{
//			autoShow: true,
//			title:'加载中...',
//			options: {
//				background: "rgba(0,0,0,0.5)"
//			}
//		}
	});
}
/**页面跳转跳转**/
mui(".ulul").on("tap", "li", function() {
	var address = this.getAttribute("address");
	if (typeof(address) == "undefined" || address == null) {
		console.log("kong");
	} else {
		addWin(address);
	}
});

























