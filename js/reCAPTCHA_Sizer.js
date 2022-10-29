function reCAPTCHA_Sizer(){
  var $w = $("html").width(); //全体の幅
  var $v = ($w - 32) / 302; //幅に対するreCAPTCHAの比率
  var $h = 78 * $v + 20; //高さ
  if($w < 640) {
    $(".g-recaptcha").css("transform","scale(" + $v + ")");
    $(".g-recaptcha > div").css("height",$h);
  } else {
    $(".g-recaptcha").css("transform","scale(1)");
    $(".g-recaptcha > div").css("height",78);
  }
}

window.onresize = function () {
  reCAPTCHA_Sizer();
};
