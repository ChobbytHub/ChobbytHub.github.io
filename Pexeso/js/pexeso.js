// ゲーム画面のサイズを決める
$(document).ready(function () {
  $(".container-box").css("width", "100%");
  h1 = $(".container-box").height();
  h2 = ($(".card").height() + 4) * 6;
  if (h1 < h2) {
    w = (h1 * 100) / h2;
    $(".container-box").css("width", w + "%");
  }
  if ($(window).width() >= 768) {
    $(".forBtn").css(
      "height",
      $(".score-area").height() - $(".score-box").height() - 4 + "px"
    );
  } else {
    $(".forBtn").css("height", "100%");
  }
  $(".reset-btn .btn").css(
    "margin-left",
    ($(".forBtn").width() - 130) / 2 + "px"
  );
  $(".reset-btn .btn").css(
    "margin-top",
    ($(".forBtn").height() - $(".btn").height() - 16) / 2 + "px"
  );
});
$(window).resize(function () {
  $(".container-box").css("width", "100%");
  h1 = $(".container-box").height();
  h2 = ($(".card").height() + 4) * 6;
  if (h1 < h2) {
    w = (h1 * 100) / h2;
    $(".container-box").css("width", w + "%");
  }
  if ($(window).width() >= 768) {
    $(".forBtn").css(
      "height",
      $(".score-area").height() - $(".score-box").height() - 4 + "px"
    );
  } else {
    $(".forBtn").css("height", "100%");
  }
  $(".reset-btn .btn").css(
    "margin-left",
    ($(".forBtn").width() - 130) / 2 + "px"
  );
  $(".reset-btn .btn").css(
    "margin-top",
    ($(".forBtn").height() - $(".btn").height() - 16) / 2 + "px"
  );
});

const cards = []; // 全てのカード情報を入れる配列

// s:スペード, d:ダイヤ, h:ハート, c:クローバー, j:ジョーカー
const suits = ["s", "d", "h", "c", "j"];

// オブジェクトをつくる関数
class Card {
  constructor(suit, num) {
    this.suit = suit;
    this.num = num;
    this.front = `${this.suit}${("0" + this.num).slice(-2)}.png`;
  }
}

// カード情報を配列に格納
for (let i = 0; i < suits.length; i++) {
  for (let j = 1; j <= 13; j++) {
    let card;
    if (i == 4) {
      if (j == 3) {
        break;
      } else {
        card = new Card(suits[i], 20);
      }
    } else {
      card = new Card(suits[i], j);
    }
    cards.push(card);
  }
}

// シャッフルする関数
function shuffle(arrays) {
  const array = arrays.slice();
  for (let i = array.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

//カードをシャッフルする
const shuffled = shuffle(cards);

// カードを並べるHTML生成する関数
function putCards() {
  for (let i = 0; i < 6; i++) {
    let row = '<div class="row">';
    for (let j = 0; j < 9; j++) {
      row =
        row +
        '<div class="card col"><div class="open_flg" id="' +
        (i * 9 + j) +
        '"><img class="i2" data-src="img/cards/' +
        shuffled[i * 9 + j].front +
        '" src=""><img class="i1" src="img/cards/z01.png"></div></div>';
    }
    row = row + "</div>";
    document.getElementById("cards").insertAdjacentHTML("beforeend", row);
  }
}

// シャッフルしたカードを並べる
putCards();

// 1枚目のカードの変数を宣言 最初はnull
let firstCard = null;
// setTimeoutを格納する変数
let flipTimerId = NaN;
// スコア関係
let time = 0;
let playingTime = 0;
let turn = 0;
let combo = 0;
let maxCombo = 0;
let score = 0;
let openedCards = 0;
let started = false;
let interval = NaN;

// スタートボタンを押すとゲーム画面に切り替わり、カウントダウンが始まる
$(".start-btn").click(function () {
  started = true;
  $("header").css({ height: "5rem" });
  $("header").html("<h2>Pexeso</h2>");
  // score, timeの初期設定
  score = 500;
  $("#score").text(score);
  time = 300;
  $("#time").text(time);
  let interval = setInterval(function () {
    time--;
    playingTime++;
    if(playingTime % 10 == 0) {
      score -= playingTime;
      if(score < 0){
        score = 0;
      }
      $("#score").text(score);
    }
    if((score <= 0 || time == 0) && started){
      started = false;
      gameOver(interval);
    }
    if(!started){
      clearInterval(interval);
    }
    $("#time").text(time);
  }, 1000);
});

// カードをクリックしたときの動作
$(window).on("load", function () {
  $(".i2").each(function (i) {
    $(this).attr("src", $(this).attr("data-src"));
  });
  $(".card").on("click", ".open_flg", function (e) {
    //タイマー起動中はクリックしても何も反応させない。
    if (flipTimerId) {
      return;
    }
    // めくる動作
    $(this).addClass("close_flg").removeClass("open_flg");
    $(this).find(".i1").addClass("ani1_1").removeClass("ani2_1");
    $(this).find(".i2").addClass("ani1_2").removeClass("ani2_2");
    // めくるのが1枚目の時
    if (firstCard === null) {
      firstCard = this; // めくったカードをfirstCardに設定
      turn++;
      $("#turn").text(turn);
    } else {
      //2枚目だったら1枚目と比較して結果を判定する。
      if (
        shuffled[Number(firstCard.id)].num === shuffled[Number(this.id)].num
      ) {
        //2枚が同じだった時、firstCardを初期値に戻す
        firstCard = null;
        combo++;
        if (maxCombo < combo) {
          maxCombo = combo;
        }
        $("#combo").text(combo);
        $("#maxCombo").text(maxCombo);
        let num = shuffled[Number(this.id)].num;
        let basePoint;
        if (num == 20) {
          // ジョーカーのとき
          basePoint = 2000;
        } else if (num == 1 || (num > 10 && num < 14)) {
          // A,J,Q,Kのとき
          basePoint = 500;
        } else {
          // 2~10のとき
          basePoint = 100;
        }
        if (maxCombo > 0) {
          basePoint += 100 * (maxCombo - 1);
        }
        if (combo > 1) {
          score += Math.trunc(basePoint * 1.2 ** combo);
        } else {
          score += basePoint;
        }
        time += 10;
        $("#time").text(time);
        $("#score").text(score);
        openedCards += 2;
        if(openedCards == 54){
          gameClear(interval);
        }
      } else {
        // 2枚が違う数字だった時、2枚を裏に戻す
        combo = 0;
        $("#combo").text(combo);
        score -= 10;
        if(score < 0){
          score = 0;
        }
        $("#score").text(score);
        if(score <= 0 && started){
          started = false;
          gameOver(interval);
        }
        new Promise((resolve) => {
          flipTimerId = setTimeout(function () {
            $(firstCard).addClass("open_flg").removeClass("close_flg");
            $(firstCard).find(".i1").addClass("ani2_1").removeClass("ani1_1");
            $(firstCard).find(".i2").addClass("ani2_2").removeClass("ani1_2");
            firstCard = null;
            resolve();
          }, 1500);
        }).then(() => {
          $(this).addClass("open_flg").removeClass("close_flg");
          $(this).find(".i1").addClass("ani2_1").removeClass("ani1_1");
          $(this).find(".i2").addClass("ani2_2").removeClass("ani1_2");
          flipTimerId = NaN;
        });
      }
    }
  });
});

let endScoreBox = 
  '<div class="end-score-box">'
  + '<p class="result">Result</p>'
  + '<div class="score">'
    + '<p class="subject">Time:</p>'
    + '<p class="number"><span id="time">' + time + '</span></p>'
    + '<p class="subject">Turn:</p>'
    + '<p class="number"><span id="turn">' + turn + '</span></p>'
    + '<p class="subject">Combo:</p>'
    + '<p class="number"><span id="combo">' + combo + '</span></p>'
    + '<p class="subject">maxCombo:</p>'
    + '<p class="number"><span id="maxCombo">' + maxCombo + '</span></p>'
    + '<p class="last-subject">Score:</p>'
    + '<p class="last-number"><span id="score">' + score + '</span></p>'
  + '</div>'
+ '</div>'

// ゲームクリア時の処理
function gameClear(e){
  clearInterval(e);
  $("footer").css({ height: "100vh" });
  document.querySelector(`footer`).animate(
    [{ opacity: 0 },{ opacity: 1 }],
    {duration: 2000,fill: 'forwards'}
  );
  $("footer .footer").html('<h3>Congratulations</h3>' + endScoreBox);
}

// ゲームオーバー時の処理
function gameOver(e){
  clearInterval(e);
  $("footer").css({ height: "100vh" });
  document.querySelector(`footer`).animate(
    [{ opacity: 0 },{ opacity: 1 }],
    {duration: 2000,fill: 'forwards'}
  );
  $("footer .footer").html('<h3>Game Over</h3>' + endScoreBox);
}

// リセットボタンを押すとリロードしてスタート画面に戻る
$(".reset-btn, .retry-btn").click(function () {
  location.reload();
});
