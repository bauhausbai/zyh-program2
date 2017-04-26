//微信分享
(function () {
    var wxurl = location.href.split( '#' )[ 0 ];
    var title = 'iGola梦想营';
    var desc = '一场关于认知、自由与梦想的旅行';
    var imgUrl = 'http://www.hylinkcd-ad.com/active/M2016/160625_igola_MicroJournal/img/share.jpg';
    var link = 'http://www.hylinkcd-ad.com/active/M2016/160625_igola_MicroJournal/turkey.html';
    var act = 'weinxinjs';
    var token = encryption( act, 'TM_01');
    
    $.ajax({
        type: "POST",
        url: "../php/core.php?type="+act+"&token="+token+"&rand="+Math.random(),
        data: ( { "wxurl": wxurl } ),
        dataType: "json",
        success: function( data ) {
            wx.config({
                debug: false,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: [
                    // 所有要调用的 API 都要加到这个列表中
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline'
                ]
            });

            wx.error(function(res){
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                //alert(res);
            });

            wx.ready(function () {
                // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareAppMessage({
                    title: title,
                    desc: desc,
                    link: link,
                    imgUrl: imgUrl,
                    trigger: function (res) {
                        // alert('用户点击发送给朋友');
                    },
                    success: function (res) {                                   
                       alert(1);
                    },
                    cancel: function (res) {
                        // alert('已取消');
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });

                // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareTimeline({
                    title: desc,
                    desc: desc,
                    link: link,
                    imgUrl: imgUrl,
                    trigger: function (res) {
                        // alert('用户点击分享到朋友圈');
                    },
                    success: function (res) {                                
                        alert(2);
                    },
                    cancel: function (res) {
                        // alert('已取消');
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            });

            //判断当前客户端版本是否支持指定JS接口
            wx.checkJsApi({
                jsApiList: [
                'getNetworkType',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'previewImage'
                ],
                success: function (res) {
                    //alert(JSON.stringify(res));
                }
            });
        }
    });
})();
