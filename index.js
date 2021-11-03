$(function () {
    
    // カレンダー
    $(function () {
        $('input[name="date"]').datepicker({
            dateFormat: 'yy/mm/dd',
        });
    });

    // 参加人数分の氏名欄を生成
    $('#form-number').click(function () {
        $('#form-name').empty();
        var num = $('input[name="number"]:checked').val();
        for (i = 0; i < num; i++) {
            $('#form-name').append(
                `<input class="form-control w-100 mt-1" name="name" maxlength="10">`
            );
        }
    });

    
    //ブラウザバリデーション　→ 原因不明だがトーク投稿に至らないため、失敗。いったんコメントアウト中。ここが悪いのではなくhtml側の問題かもしれない。。。調査中。

//    $(function () {
//        var forms = document.querySelectorAll('.needs-validation');
//        Array.prototype.slice.call(forms).forEach(function (form) {    
//            form.addEventListener('submit', function (event) {
//                if (!form.checkValidity()) {
//                    event.preventDefault();        
//                    event.stopPropagation();
//                }
//                form.classList.add('was-validated');
//            }, false);
//        })
//    })();
    
    
    
    
    // 送信
    $('form').submit(function () {

        //練習エリア開始
        var text1 = $('input[name="text1"]').val();
        var select1 = $('[name="select1"] option:selected').val();
        var text10 = $('input[name="text10"]').val();
        var date = $('input[name="date"]').val();
        var number = $('input[name="number"]:checked').val();
        
        var names = '';
        $('#form-name').children().each(function (i, elm) {
            names += $(elm).val() + '、';
        })
        names = names.slice(0, -1);
        //練習エリア終了
        
        //住所項目
        var address1num = $('[name="address1"] option:selected').val();//番号が表示される。後続の判定用。
        var address1 = $('[name="address1"] option:selected').text();//区分値に紐づく表示項目が表示される。
        var address2 = $('input[name="address2"]').val();
        var address3 = $('input[name="address3"]').val();
        
        //計算要素項目
        var billingamount = $('input[name="billingamount"]').val();
        var basiccharge = $('input[name="basiccharge"]').val();
        var quantity = $('input[name="quantity"]').val();
        var unitprice = $('[name="unitprice"]').val();

        //算出結果
        var difference = ( $('#billingamount').val() - $('#basiccharge').val() ) / $('#quantity').val();
        var resultround = Math.floor(difference);
        
        //コスト削減予定額
        var costcut = (resultround - 280) * $('#quantity').val();

        //コスト削減予定額（LINEトーク送信用）
        if (costcut < 1000){
            var costcutmsg = `判定結果をご確認ください(${costcut})`;
        }　else if (costcut < 10000){
            var costcutfloor = Math.floor(costcut / 100) * 100;
            var costcutmsg = `約${costcutfloor}円程度`;
            } else {
                var costcutfloor = Math.floor(costcut / 1000) * 1000;
                var costcutmsg = `約${costcutfloor}円程度`;
                }
        
        if ( 7 >= address1num || address1num >= 15 ){
            var msg = `【現在お住まいの地域】\n都道府県:${address1}\n市区町村:${address2}\n町・番地:${address3}\n【現在のガス料金情報】\nご請求予定金額(円):${billingamount}\n基本料金(円):${basiccharge}\n今回ご使用量(㎥):${quantity}\nガス料金単価:${resultround}\n-----------\n【お安くなる金額目安】\n対象外地域のため判定できません。`;
        } else {
            var msg = `【現在お住まいの地域】\n都道府県:${address1}\n市区町村:${address2}\n町・番地:${address3}\n【現在のガス料金情報】\nご請求予定金額(円):${billingamount}\n基本料金(円):${basiccharge}\n今回ご使用量(㎥):${quantity}\nガス料金単価:${resultround}\n-----------\n【お安くなる金額目安】\n${costcutmsg}`;
        }

                
        if ( 7 >= address1num || address1num >= 15 ){
            var msg2 = `対象外地域`;
        } else if (difference < 281){
            var msg2 = `Sランク`; 
        } else if (difference >= 281 && difference < 300){
            var msg2 = `Aランク`; 
        } else if (difference >= 301 && difference < 500){
            var msg2 = `Bランク`; 
        } else {
            var msg2 = `Cランク`; 
        } 

              
        
        sendText(msg);
        sendText2(msg2);
        
//Gmail送信後にフリーズする奴の解決なるか!？開始
        sendautomail(msg);
//Gmail送信後にフリーズする奴の解決なるか!？終了
        
        
        return false;
    });
    

});
