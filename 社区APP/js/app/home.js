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
	});
}
/**主要板块跳转**/
mui(".col-xs-1").on("tap", "li", function() {
	var address = this.getAttribute("address");
	if (typeof(address) != "undefined" || address != null){
		addWin(address);
	}
});
/**便民功能跳转**/
mui(".ad").on("tap", "li", function() {
	var address = this.getAttribute("address");
	if (typeof(address) != "undefined" || address != null){
		addWin(address);
	}
});
/**搜索跳转**/
mui("header").on("tap", "a.right", function() {
	var address = this.getAttribute("address");
	if (typeof(address) != "undefined" || address != null){
		addWin(address);
	} 
});
	
















