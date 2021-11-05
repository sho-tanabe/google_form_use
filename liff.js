$(document).ready(function () {
    // liffId: LIFF URL "https://liff.line.me/xxx"のxxxに該当する箇所
    // LINE DevelopersのLIFF画面より確認可能
    var liffId = "1656567556-8kxZVdJv";
    initializeLiff(liffId);
})

function initializeLiff(liffId) {
    liff
        .init({
            liffId: liffId
        })
        .then(() => {
            // Webブラウザからアクセスされた場合は、LINEにログインする
            if (!liff.isInClient() && !liff.isLoggedIn()) {
                window.alert("LINEアカウントにログインしてください。");
                liff.login({redirectUri: location.href});
            }
        })
        .catch((err) => {
            console.log('LIFF Initialization failed ', err);
        });
}


//旧sendText部の開始
//function sendText(text) {
//    if (!liff.isInClient()) {
//        shareTargetPicker(text);
//    } else {
//        //sendautomail(text);ガス料金単価計算の結果をメール転送するならこちら
//        sendMessages(text);
//    }
//}
//旧sendText部の終了


function sendText(text) {
    if (!liff.isInClient()) {
//WEBブラウザアクセスの場合の動作↓

//        shareTargetPicker(text);

        alert('本画面をLINEアプリ以外で起動している場合、料金を診断できません。スマートフォンのLINEアプリから料金診断を行って下さい。');
//WEBブラウザアクセス以外の場合の動作↑
    } else {

//GoogleForm送信機能を動かすために必要なのか？開始    
//        document.googleform1.submit();//sendMesseageの中に移植するため一時コメントアウトして検証する。
//GoogleForm送信機能を動かすために必要なのか？終了 
        

        //sendMessageを5秒後に実施する実験のためコメントアウト。なんだか動いていない・・・きゃっか
        sendMessages(text);
        //setTimeout(sendMessages(text),5000);
        //sendMessageを5秒後に実施する実験のためコメントアウト
       
        
        
        
        
        
        //画面クローズを出来るだけ最後にテスト///うまくいかなかった
       // liff.closeWindow();
        //画面クローズを出来るだけ最後にテスト

        
//        sendautomail(text);//これを利用すると画面が3回目以降フリーズする現象に見舞われる。パスワードなどをトークン化して再度テストする。→成功！!数日ごも維持できているか確認する。→3回目フリーズ再発。再度コメントアウト
//        sendLineNotifyMessage();//実験中。
//        myFunction();//実験中２。
    }
}

// LINEトーク画面上でメッセージ送信→2通同時テスト成功のため、メッセージ2通目を動的に代入するテストが成功するまで、コメントアウトのままとしている。
//function sendMessages(text) {
//    liff.sendMessages([{
//        'type': 'text',
//        'text': text
//    }]).then(function () {
//        liff.closeWindow();
//    }).catch(function (error) {
//        window.alert('Failed to send message ' + error);
//    });
//}


//2通同時に送れるかテスト→テスト結果：同時送信成功！！コメントアウトのままとしている。
// LINEトーク画面上でメッセージ送信
function sendMessages(text) {
    liff.sendMessages([{
        'type': 'text',
        'text': text
    },{
        'type': 'text',
        'text': "見積もり申し込み"
    }]).then(function () {
        document.googleform1.submit();

//thenを書いて段階的に進むようにテスト中。GoogleFormに記載されない件を検証中。
    }).then(function () {
        window.alert('テストだよーん、あとで消す！！診断結果はLINEチャット画面に表示されます。');

        //タイマー機能を実験するためコメントアウト
        //        liff.closeWindow();
        //タイマー機能を実験するためコメントアウト
        
        //setTimeout(closeWin,5000);/////なんだか動いていない。きゃっか
        
//thenを書いて段階的に進むようにテスト中。GoogleFormに記載されない件を検証中。

    }).catch(function (error) {
        window.alert('Failed to send message ' + error);
    });
}
//2通同時に送れるかテスト


//close
function closeWin() {
    liff.closeWindow();
}
//close



// Webブラウザからメッセージ送信
function shareTargetPicker(text) {
    liff.shareTargetPicker([{
        'type': 'text',
        'text': text
    }]).catch(function (error) {
        window.alert('Failed to send message ' + error);
    });
    
    //GoogleForm送信機能を動かすために必要なのか？開始    
    //document.googleform1.submit();
    //GoogleForm送信機能を動かすために必要なのか？終了 
    
}



//Email送信(Elastic Emailを利用中。永久無料プランでは、1日に最大100通のメールを送信できます。この制限を超えた場合には、使用量に対して支払いを行うことができます。メール1,000通あたり0.09ドルです。)
//function sendautomail(text){
function sendautomail(msg){
    Email.send({
        SecureToken : "720bc3d8-8906-4b0d-bb67-6ed51d1861f0", //HOSTやユーザーパスワード等の直書きをやめてセキュアトークン発行をしたところ再び成功した。（参照：https://www.smtpjs.com/）
        To : 'lpg.switching@gmail.com',
        From : "lpg.switching@gmail.com",
        Subject : "LINE経由でガス料金単価の計算実行あり。",
        Body : msg
//      3回目以降フリーズする理由。この後のthen以降のalert出すのを消したらうまくいくのではないか？？またはtextとmsgが怪しい。だめだ・・・同じ現象が発生・・
//        Body : text
    }).then(
        message => alert(message)
    )
};


//クリアボタン押下時の動作
function refresh() {
    isInit = true;
    secondNum = 0;
    ans = 0;
    kigou = "";
    type.innerHTML = "";
    display.innerHTML = 0;
    textbox1.value = "";
    textbox2.value = "";
}

//----------------------------------------算出ロジック開始----------------------------------------

function update_field(){    
    var resultabout = Math.floor( ( $('#billingamount').val() - $('#basiccharge').val() ) / $('#quantity').val() );
    var result = `${resultabout}円`;
    $('#unitprice').text(result);
}
$(function() {
  $('input[type="number"]').on('keyup change', function() {
    update_field();
  });
});

//----------------------------------------算出ロジック終了----------------------------------------

//----------------------------------------以下Sendtextテスト２----------------------------------------
function sendText2(text) {
    if (!liff.isInClient()) {
//        shareTargetPicker2(text);
//        liff.openWindow({
//            url: "https://goofy-offer-5121.glide.page/dl//s/d0a5f4",
//            external: true
//        });
    } else {
        sendMessages2(text);
    }
}

// LINEトーク画面上でメッセージ送信
function sendMessages2(text) {
    liff.sendMessages([{
        'type': 'text',
        'text': text
    }]).then(function () {
        liff.closeWindow();
    }).catch(function (error) {
        window.alert('Failed to send message ' + error);
    });
}

// Webブラウザからメッセージ送信
function shareTargetPicker2(text) {
    liff.shareTargetPicker([{
        'type': 'text',
        'text': text
    }]).catch(function (error) {
        window.alert('Failed to send message ' + error);
    });
}
//----------------------------------------以上Sendtextテスト２----------------------------------------
//----------------------------------------GoogleForm送信ボタンオンクリックテスト--------------------------------
    // 送信
//    $('form').submit(function () {

        //練習エリア開始
//        var text1 = $('input[name="text1"]').val();
//        var select1 = $('[name="select1"] option:selected').val();
//        var text10 = $('input[name="text10"]').val();
//        var date = $('input[name="date"]').val();
//        var number = $('input[name="number"]:checked').val();
       
//        var names = '';
//        $('#form-name').children().each(function (i, elm) {
//            names += $(elm).val() + '、';
//        })
//        names = names.slice(0, -1);
        //練習エリア終了
        
        //住所項目
//        var address1num = $('[name="address1"] option:selected').val();//番号が表示される。後続の判定用。
//        var address1 = $('[name="address1"] option:selected').text();//区分値に紐づく表示項目が表示される。
//        var address2 = $('input[name="address2"]').val();
//        var address3 = $('input[name="address3"]').val();
        
        
        
        //計算要素項目
//        var billingamount = $('input[name="billingamount"]').val();
//        var basiccharge = $('input[name="basiccharge"]').val();
//        var quantity = $('input[name="quantity"]').val();
//        var unitprice = $('[name="unitprice"]').val();
        
//        var nametest = $('input[name="entry.2144812415"]').val();
        

        //算出結果
//        var difference = ( $('#billingamount').val() - $('#basiccharge').val() ) / $('#quantity').val();
//        var resultround = Math.floor(difference);
        
        //コスト削減予定額
//        var costcut = (resultround - 280) * $('#quantity').val();

        //コスト削減予定額（LINEトーク送信用）
//        if (costcut < 1000){
//            var costcutmsg = `判定結果をご確認ください(${costcut})`;
//        }　else if (costcut < 10000){
//            var costcutfloor = Math.floor(costcut / 100) * 100;
//            var costcutmsg = `約${costcutfloor}円程度`;
//            } else {
//                var costcutfloor = Math.floor(costcut / 1000) * 1000;
//                var costcutmsg = `約${costcutfloor}円程度`;
//                }
        
//        if ( 7 >= address1num || address1num >= 15 ){
//            var msg = `【現在お住まいの地域】\nGoogleFormTest:${nametest}【現在お住まいの地域】\n都道府県:${address1}\n市区町村:${address2}\n町・番地:${address3}\n【現在のガス料金情報】\nご請求予定金額(円):${billingamount}\n基本料金(円):${basiccharge}\n今回ご使用量(㎥):${quantity}\nガス料金単価:${resultround}\n-----------\n【お安くなる金額目安】\n対象外地域のため判定できません。`;
//        } else {
//            var msg = `【現在お住まいの地域】\n都道府県:${address1}\n市区町村:${address2}\n町・番地:${address3}\n【現在のガス料金情報】\nご請求予定金額(円):${billingamount}\n基本料金(円):${basiccharge}\n今回ご使用量(㎥):${quantity}\nガス料金単価:${resultround}\n-----------\n【お安くなる金額目安】\n${costcutmsg}`;
//        }

                
//        if ( 7 >= address1num || address1num >= 15 ){
//            var msg2 = `対象外地域`;
//        } else if (difference < 281){
//            var msg2 = `Sランク`; 
//        } else if (difference >= 281 && difference < 300){
//            var msg2 = `Aランク`; 
//        } else if (difference >= 301 && difference < 500){
//            var msg2 = `Bランク`; 
//        } else {
//            var msg2 = `Cランク`; 
//        } 

              
        
//        sendText(msg);
//        sendText2(msg2);
        
//Gmail送信後にフリーズする奴の解決なるか!？開始
//        sendautomail(msg);
//Gmail送信後にフリーズする奴の解決なるか!？終了
        
        
//        return false;
//    });
