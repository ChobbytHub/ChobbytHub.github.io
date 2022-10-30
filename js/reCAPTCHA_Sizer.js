function reCAPTCHA_Sizer(){
  var $w = $("#mailForm table").width(); //全体の幅
  var $v = $w / 310; //幅に対するreCAPTCHAの比率
  var $h = 78 * $v; //高さ
  if($w < 500) {
    $(".g-recaptcha").css("transform","scale(" + $v + ")");
    $(".g-recaptcha > div").css("height",$h);
  } else {
    $(".g-recaptcha").css("transform","scale(1)");
    $(".g-recaptcha > div").css("height",78);
  }
}
window.onload = function () {
  reCAPTCHA_Sizer();
};
window.onresize = function () {
  reCAPTCHA_Sizer();
};
