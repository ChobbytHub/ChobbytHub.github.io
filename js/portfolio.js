/*--------------------------------
 gnav
---------------------------------*/
//基準点の準備
var elemTop = [];

//現在地を取得するための設定を関数でまとめる
function PositionCheck(){
    //headerの高さを取得
  var headerH = $("#header").outerHeight(true);
    //.scroll-pointというクラス名がついたエリアの位置を取得する設定
  $(".scroll-point").each(function(i) {//.scroll-pointクラスがついたエリアからトップまでの距離を計算して設定
    elemTop[i] =Math.round(parseInt($(this).offset().top-headerH));//追従するheader分の高さ（70px）を引き小数点を四捨五入
  });
}

//ナビゲーションに現在地のクラスをつけるための設定
function ScrollAnime() {//スクロールした際のナビゲーションの関数にまとめる
  var scroll = Math.round($(window).scrollTop());
  var NavElem = $("#g-nav li");//ナビゲーションのliの何番目かを定義するための準備
  $("#g-nav li").removeClass('current');//全てのナビゲーションの現在地クラスを除去
  if(scroll >= 0 && scroll < elemTop[1]) {//スクロール値が0以上 .scroll-point 1つめ（area-1）の高さ未満
      $(NavElem[0]).addClass('current');//1つめのliに現在地クラスを付与
    }
  else if(scroll >= elemTop[1] && scroll < elemTop[2]) {//.scroll-point 1つめ（area-1）以上.scroll-point 2つめ（area-2）未満
     $(NavElem[1]).addClass('current');//2つめのliに現在地クラスを付与
    } 
    else if(scroll >= elemTop[2] && scroll < elemTop[3]) {//.scroll-point 2つめ（area-2）以上.scroll-point 3つめ（area-3）未満
     $(NavElem[2]).addClass('current');//3つめのliに現在地クラスを付与
    } 
    else if(scroll >= elemTop[3]) {// .scroll-point 3つめ（area-3）以上
      $(NavElem[3]).addClass('current');//4つめのliに現在地クラスを付与
    } 
}

//ナビゲーションをクリックした際のスムーススクロール
$('#g-nav a, footer nav a').click(function () {
  var elmHash = $(this).attr('href'); //hrefの内容を取得
  var headerH = $("#header").outerHeight(true);//追従するheader分の高さ（70px）を引く
  var pos = Math.round($(elmHash).offset().top-headerH);  //headerの高さを引き小数点を四捨五入
  $('body,html').animate({scrollTop: pos}, 500);//取得した位置にスクロール※数値が大きいほどゆっくりスクロール
  return false;//リンクの無効化
});

// 画面をスクロールをしたら動かしたい場合の記述
$(window).scroll(function () {
  PositionCheck();/* 現在地を取得する関数を呼ぶ*/
  ScrollAnime();/* ナビゲーションに現在地のクラスをつけるための関数を呼ぶ*/
});

// ページが読み込まれたらすぐに動かしたい場合の記述
$(window).on('load', function () {
  PositionCheck();/* 現在地を取得する関数を呼ぶ*/
  ScrollAnime();/* ナビゲーションに現在地のクラスをつけるための関数を呼ぶ*/
});

$(window).resize(function() {
  //リサイズされたときの処理
  PositionCheck()
});

/*--------------------------------
 form label
---------------------------------*/
$('input, textarea').on('focusin', function() {
  $(this).parent().find('label').addClass('active');
});

$('input, textarea').on('focusout', function() {
  if (!this.value) {
    $(this).parent().find('label').removeClass('active');
  }
});
/*--------------------------------
 reCAPTCHA_Sizer
---------------------------------*/
function reCAPTCHA_Sizer(){
  var $w = $(".recaptcha-box").width(); //全体の幅
  var $v = $w / 310; //幅に対するreCAPTCHAの比率
  var $h = 78 * $v; //高さ
  if($w < 300) {
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
