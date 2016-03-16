$(function() {
	$(window).resize(function() {
		windowChange();
	});

	function windowChange() {
		var myDataL = $(".all-div").length;
		var winWidth = $(window).width();
		var lDiv = "";
		for (i = 0; i < myDataL; i++) {
			lDiv = $(".all-div").eq(i).children(".left-div").width();
			$(".all-div").eq(i).children(".right-div").width(winWidth - lDiv);
		}
	}
	windowChange();
});