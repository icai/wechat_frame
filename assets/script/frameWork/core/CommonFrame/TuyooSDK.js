/**
 * @author zhaoliang
 * @date 1.28
 * 
 * 全局对象
 * 系统信息
 * 包括clientId，loginUrl等
 */
console.log("TuyooSDK loaded");
tywx.TuyooSDK = {
    SESSION_KEY: 'TU_SESSION_STORAGE',

    /***************************以下为登录相关接口*********************************/
    login: function() {
        if(tywx.IsWechatPlatform()) {
            tywx.LOGD("login ---->>>>>.  Tuyoo")
            tywx.TuyooSDK.getSystemInfo();
            tywx.TuyooSDK.wechatLogin();
        }
        else {
            //其他平台,待添加
        }
    },

    /**
     * 判断游戏是否已经登录
     */
    checkIsLogin : function () {
        if(!tywx.UserInfo.userId)
            return false;
        return true;
    },
    // 微信登录
    wechatLogin: function() {
        if(!tywx.IsWechatPlatform()) {
            return;
        }
        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeWxLoginStart, []);
        wx.login({
            success: function(params) {
                tywx.LOGD(null, 'wx login success, params:' + JSON.stringify(params));
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeWxLoginSuccess, [params.code]);
                if (params.code) {
                    var code = params.code;
                    tywx.TuyooSDK.loginTuyooWithCode(code, {});
                    tywx.NotificationCenter.trigger(tywx.EventType.WEIXIN_LOGIN_SUCCESS);
                }
            },

            fail: function(params) {
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeWxLoginFailed, []);
                tywx.LOGD(null, 'wx login fail, params:' + JSON.stringify(params));
		tywx.NotificationCenter.trigger(tywx.EventType.WEIXIN_LOGIN_FAIL);
            },

            complete: function(params) {

            }
        });
    },

    // 微信不需要重新授权，使用
    loginTuyooWith3rdSession: function() {
        if(!tywx.IsWechatPlatform()) {
            return;
        }
        wx.getStorage({
            key: tywx.TuyooSDK.SESSION_KEY,
            success: function(params) {
                if (!params.data) {
                    tywx.TuyooSDK.wechatLogin();
                    return;
                }
                // 微信授权成功后使用code登录途游服务器

                //console.log (tywx.SystemInfo.loginUrl);
         
                wx.request({
                    url: tywx.SystemInfo.loginUrl + 'player/getOpenId/',
                
                    //url: tywx.SystemInfo.loginUrl,
                    data: {
                        snsId: params.data,
                        deviceName: 'wechatGame',
                        clientId: tywx.SystemInfo.clientId,
                        appId: tywx.SystemInfo.appId
                    },

                    success: function(params) {
                        tywx.LOGD(null, 'tuyoo login success, params:' + JSON.stringify(params));
                    },

                    fail: function(params) {
                        tywx.LOGD(null, 'tuyoo login fail, params:' + JSON.stringify(params));
                    },

                    complete: function(params) {

                    }
                });
            },
            fail: function(params) {
                tywx.TuyooSDK.wechatLogin();
            },
            complete:function(params) {

            }
        });
    },

    // 微信授权成功后，使用
    /* {
        "data": {
            "result": {
                "code": 0,
                "userId": 10116,
                "exception_report": 0,
                "userType": 4,
                "authInfo": "{\"authcode\": \"eyJ1aWQiOiAxMDExNiwgInVuYW1lIjogIlx1Njc2NVx1NWJiZTAwNzRBaWJzVCIsICJ1dG9rZW4iOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzEzMzgiLCAiY29pbiI6IDAsICJlbWFpbCI6ICIiLCAidXRpbWUiOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzA0NzEifQ==\", \"account\": \"\", \"uid\": 10116, \"usercode\": \"\"}",
                "tcpsrv": {
                    "ip": "192.168.10.88",
                    "port": 8041
                },
                "isCreate": 1,
                "changePwdCount": 0,
                "360.vip": 0,
                "logclient": {
                    "loguploadurl": "",
                    "logreporturl": ""
                },
                "userPwd": "ty817142",
                "purl": "http://ddz.image.tuyoo.com/avatar/head_female_0.png",
                "snsId": "wxapp:071Nehqt0Z4XEe1jN6qt007Cqt0Nehqz",
                "userEmail": "",
                "connectTimeOut": 35,
                "appId": 9999,
                "heartBeat": 6,
                "userName": "来宾0074AibsT",
                "mobile": "",
                "token": "cce362d6-68a8-485e-b137-86ae6828e07a",
                "authorCode": "eyJ1aWQiOiAxMDExNiwgInVuYW1lIjogIlx1Njc2NVx1NWJiZTAwNzRBaWJzVCIsICJ1dG9rZW4iOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzEzMzgiLCAiY29pbiI6IDAsICJlbWFpbCI6ICIiLCAidXRpbWUiOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzA0NzEifQ==",
                "log_report": 0,
                "showAd": 1
            }
        },
        "header": {
            "Server": "nginx/1.4.1",
            "Date": "Mon, 29 Jan 2018 06:13:12 GMT",
            "Content-Type": "application/json;charset=UTF-8",
            "Transfer-Encoding": "chunked",
            "Connection": "keep-alive",
            "Content-Encoding": "gzip"
        },
        "statusCode": 200,
        "errMsg": "request:ok"
    }
    */
    loginTuyooWithCode: function(code, userInfo) {
        if(!tywx.IsWechatPlatform()) {
            return;
        }
        console.log ("微信授权成功后使用code登录途游服务器");

        // 微信授权成功后使用code登录途游服务器
        wx.showShareMenu({
            withShareTicket: true
        });

        var local_uuid = tywx.Util.getLocalUUID();
        tywx.LOGD("local_uuid:",local_uuid);
        var sdkPath = tywx.SystemInfo.loginUrl;
        var dataObj = {
            appId: tywx.SystemInfo.appId,
            wxAppId: tywx.SystemInfo.wxAppId,
            clientId: tywx.SystemInfo.clientId,
            snsId: 'wxapp:' + code,
            uuid : local_uuid,
            //以下为上传玩家的微信用户信息
            //nickName: userInfo.nickName,
            //avatarUrl: userInfo.avatarUrl,
            scene_id : tywx.UserInfo.scene_id || "",
            scene_param : tywx.UserInfo.scene_param || "",
            invite_id : tywx.UserInfo.invite_id || 0
        };
        if(userInfo && userInfo.nickName) {
            dataObj.nickName = userInfo.nickName;
        }

        if(userInfo && userInfo.avatarUrl) {
            dataObj.avatarUrl = userInfo.avatarUrl;
        }

        tywx.LOGD("fengbing", " *-*-*-*-*-  dataobj:  "+JSON.stringify(dataObj));

        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeLoginSDKStart, [code, local_uuid, userInfo.nickName]);

    
        //console.log ( sdkPath + 'open/v6/user/LoginBySnsIdNoVerify');
        wx.request({
            url: sdkPath +"player/getOpenId/" ,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: dataObj,
            method:'POST',

            success: function(params) {
                tywx.LOGD(null, 'tuyoo login success, params:' + JSON.stringify(params));
                console.log ("******************************");
                var checkData = params.data;
                if ((checkData.error && checkData.error.code == 1) || !(checkData.result && checkData.result.userId)){
                    console.log('tuyoo login fail...');
                    setTimeout(tywx.TuyooSDK.login, 200);
                    return;
                }
                // 保存用户名/用户ID/用户头像
                var result = checkData.result;
                tywx.UserInfo.userId = result.userId;
                tywx.UserInfo.userName = result.userName;
                tywx.UserInfo.userPic = result.purl;
                tywx.UserInfo.authorCode = result.authorCode;
                tywx.UserInfo.wxgame_session_key = result.wxgame_session_key;
                tywx.LOGD(null, 'userId:' + tywx.UserInfo.userId + ' userName:' + tywx.UserInfo.userName + ' userPic:' + tywx.UserInfo.userPic);

                var token = result.token;
                tywx.LOGD(null, 'token:' + token);
                wx.setStorage({
                    key: tywx.TuyooSDK.SESSION_KEY,
                    data: token
                });

                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeLoginSDKSuccess, [code, local_uuid, userInfo.nickName, result.userId]);
                if(tywx.showScene && tywx.showQuery && tywx.showQuery.sourceCode) {
                    tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom,[tywx.showScene, tywx.showQuery.inviteCode, tywx.showQuery.sourceCode, tywx.showQuery.imageType, "GameStart"]);
                }
                // tywx.TuyooSDK.initWebSocketUrl(result);

                // 发送登录成功事件
                tywx.NotificationCenter.trigger(tywx.EventType.SDK_LOGIN_SUCCESS);
		        tywx.NotificationCenter.trigger(tywx.EventType.MSG_LOGIN_SUCCESS);
            },

            fail: function(params) {
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeLoginSDKFailed, [code, local_uuid, userInfo.nickName]);
                tywx.LOGD(null, 'tuyoo login fail, params:' + JSON.stringify(params));
                tywx.NotificationCenter.trigger(tywx.EventType.SDK_LOGIN_FAIL);
            },

            complete: function(params) {

            }
        });



    },

    /**
     * 使用sdk登陆返回信息解析得到服务器连接地址,对于单机游戏来说无效
     * @param loginResult
     */
    initWebSocketUrl: function(loginResult) {
        if(loginResult && loginResult.tcpsrv) {
            var ip = loginResult.tcpsrv.ip;
            var port = loginResult.tcpsrv.wsport || loginResult.tcpsrv.port; //优先使用wsport
            var webSocketUrl;
            if (tywx.SystemInfo.loginUrl.indexOf("https://") > -1){
                webSocketUrl = 'wss://' + ip + '/';
            }
            else{
                webSocketUrl = 'ws://' + ip + ':' + port.toString() + '/';
            }
            tywx.LOGD(null, 'webSocketUrl:' + webSocketUrl);
            tywx.SystemInfo.webSocketUrl = webSocketUrl;
        }
    },

    getSystemInfo : function () {
        if(!tywx.IsWechatPlatform()) {
            return;
        }
        wx.getSystemInfo({
            success : function (result) {
                var model = result.model;
                var isiPhone = model.indexOf("iPhone") >= 0;
                var windowHeight = result.windowHeight;
                var resultType = 0;
                if (isiPhone){
                    if(windowHeight == 812){   //iPhoneX
                        resultType = 2;
                    }else if (windowHeight == 736){ // 7p 8p
                        resultType = 4;
                    }else {  //其他iPhone
                        resultType = 1;
                    }
                }else { //cc.sys.OS_ANDROID
                    resultType = 3;
                }
                tywx.UserInfo.systemType = resultType;
                tywx.UserInfo.wechatType = result.version;
                tywx.UserInfo.model = result.model;
                tywx.UserInfo.system = result.system;
                tywx.UserInfo.SDKVersion = result.SDKVersion;
                //上报顺序为微信版本 基础库版本 平台 操作系统版本
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeSubmitVersionInfo,
                    [result.version, result.SDKVersion, result.platform, result.system]);
            },
            fail : function () {
            },
            complete : function () {
            }
        });
    },

    wechatAuthorize: function() {
        if(!tywx.IsWechatPlatform()) {
            return;
        }
        wx.getSetting({
            success:function(res) {
                if (!res.authSetting['scope.userInfo']) {
                    tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeAuthorizationStart, []);
                    wx.authorize({
                        scope : "scope.userInfo",
                        success : function () {
                            tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeAuthorizationSuccess, []);
                            tywx.NotificationCenter.trigger(tywx.EventType.START_AUTHORIZATION_SUCCESS);
                        },
                        fail:function () {
                            tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeAuthorizationFailed, []);
                            tywx.NotificationCenter.trigger(tywx.EventType.START_AUTHORIZATION_FAILED);
                        },
                        complete:function () {
                        }
                    });
                }
                else{
                    tywx.NotificationCenter.trigger(tywx.EventType.START_AUTHORIZATION_SUCCESS);
                }
            }
        })
    },

    compareSDkVersion:function(SDkVersion){
        if(SDkVersion == "2.0.1"){
            return true;
        }
        var data = SDkVersion.split(".");
        var index = 2;
        console.log("data"+JSON.stringify(data));
        for(var i = 0;i<data.length;i++){
            var per = parseInt(data[i]);
            if(i == 0){
                index = 2;
            }else if(i == 1){
                index = 0;
            }else{
                index = 1; 
            }
            console.log("per"+per+"index"+index);
            if(per >index){
                return true;
            }else if(per < index){
                return false;
            }else{
                continue;
            }
        }
        return false;
    },

    wxInviteFriendShare : function(titlestr, imageUrl, successCallBackFun, failCallBackFun){
        var query =  minihall.GlobalFuncs.getInvitedQuery();
        wx.shareAppMessage({
            title: titlestr,
            imageUrl : imageUrl,//5:4
            query : query,//'key1=val1&key2=val2',
            success : function (result) {
                tywx.LOGE(null, "shareAppMessage+++++++++++++++++"+JSON.stringify(result));
                if (successCallBackFun){
                    successCallBackFun(result);
                }
            },
            fail : function () {
                if (failCallBackFun){
                    failCallBackFun();
                }
                tywx.LOGD(null, JSON.stringify(arguments));
            },
            complete : function () {
            }
        })
    },

    wxShare : function(titlestr, imageUrl, successCallBackFun, failCallBackFun, isforce){
        wx.shareAppMessage({
            title: titlestr,
            imageUrl : imageUrl,//5:4
            query : 'shareid='+tywx.UserInfo.userId,
            success : function (result) {
                if(isforce==true)
                    tywx.NotificationCenter.trigger(tywx.EventType.SHARE_RESULT, result);
                tywx.LOGE(null, "shareAppMessage+++++++++++++++++"+JSON.stringify(result));
                if (successCallBackFun){
                    successCallBackFun(result);
                }
            },
            fail : function () {
                if (failCallBackFun){
                    failCallBackFun();
                }
                tywx.LOGD(null, JSON.stringify(arguments));
            },
            complete : function () {
            }
        })
    }
};
wx.onShareAppMessage(function (result) {
    if (result.from === 'button') {
    }
    var _index = Math.floor(Math.random()*2);
    return {
        title:tywx.ShareInfo.message,
        imageUrl:tywx.ShareInfo.imgurl[_index],
        success: function (result) {
        },
        fail: function (result) {
        },
        complete: function () {
        }
    }
});
tywx.WechatInterfaceInit = function() {
    if(tywx.IsWechatPlatform()) {
        /**
         * 小程序回到前台,具体逻辑自己实现
         */
        wx.onShow(function (result) {
            // {"0":{"scene":1044,"shareTicket":"beecdf9e-e881-492c-8a3f-a7d8c54dfcdb","query":{}}}  (从后台切到前台才有shareTicket,启动时没有)
            tywx.LOGE('', "+++++++++++++++++onShow+++++++++++++++++"+JSON.stringify(result));
            tywx.PropagateInterface.getUserAreaInfo();
            //取相关参数
            var scene = result.scene;
            var query = result.query;
            var scenePath = '';
            tywx.showScene = scene;
            tywx.showQuery = query;
            //来源处理
            tywx.UserInfo.scene_id = scene;
            tywx.UserInfo.scene_param = query.from || "";
            tywx.UserInfo.invite_id = query.shareid || 0;
            tywx.StateInfo.isOnForeground = true;
            tywx.NotificationCenter.trigger(tywx.EventType.GAME_SHOW, result);
            var hasUUID = tywx.Util.checkLocalUUID();
            if(query && query.shareid) {
                //进行相应的处理和记录
                tywx.ShareInfo.queryId = query.shareid;
                tywx.LOGD("fengbing","========share id : "+tywx.ShareInfo.queryId);
            }
            var newUserFlag = hasUUID ? 1 : 0;
            if (query && query.gdt_vid && query.weixinadinfo) {
                //从广点通广告跳过来的，from的开头加入gdt标识区分
                var from = "gdt." + query.weixinadinfo;
                tywx.UserInfo.scene_param = from;
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom,[scene, from, newUserFlag]);
            }
            else if(query && query.sourceCode) {
                //从小程序消息卡片中点入,该场景为"点击用户分享卡片进入游戏注册时，分享用户的user_id直接当做场景参数放在param02，param03和param04分别代表分享点id和分享图文id"
                //var query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+imageMap.imageType+"&inviteName="+ty.UserInfo.userName;
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom, [scene, query.shareid, query.sourceCode, query.imageType, "CardActive", newUserFlag]);
            } else {
                if(tywx.Util.isSceneQrCode(scene)) {
                    //从小程序码进入,相关见文档https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/qrcode.html
                    if (query.hasOwnProperty('scene')){
                        scenePath = query.scene;
                    } else if(result.hasOwnProperty('path')) {
                        scenePath = result.path;
                    }
                    scenePath.replace(".html", "");     //生成时可能会在path后面添加.html
                    scenePath = decodeURIComponent(scenePath);
                    tywx.UserInfo.scene_param = scenePath;
                    tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom,[scene, scenePath, newUserFlag]);
                } else {
                    //场景值和场景参数分别记录到可选参数param01和param02当中，如param01=1058，param02=tuyouqipai
                    //场景参数由项目组接入推广渠道时配置，如公众号dacihua、tuyouqipai，二维码填写企业或个人标识
                    tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom,[scene, query.from, newUserFlag]);
                }
            }
            tywx.TuyooSDK.login();
        });
    }
}

/**
 * 小程序进入后台
 */
wx.onHide(function () {
            tywx.UserInfo.scene_id = 0;
    tywx.StateInfo.isOnForeground = false;
    var date = new Date().getTime();
    tywx.NotificationCenter.trigger(tywx.EventType.GAME_HIDE);
    tywx.LOGE('',"+++++++++++++++++onHide+++++++++++++++++");
    // tywx.TCPClient.close();
});

var getNetSuccess = function (res) {
    if (res.hasOwnProperty('isConnected')){
        tywx.StateInfo.networkConnected = res.isConnected;
    }
    else if (res.hasOwnProperty('errMsg')){
        tywx.StateInfo.networkConnected = res.errMsg == 'getNetworkType:ok'
    }
    else{
        tywx.StateInfo.networkConnected = res.networkType != 'none';
    }

    tywx.StateInfo.networkType = res.networkType;//wifi,2g,3g,4g,none,unknown
};

wx.getNetworkType({
    success:getNetSuccess
});

wx.onNetworkStatusChange(getNetSuccess);

wx.onError(function (res) {
    tywx.ErrorUploadInterface.uploadErrorLog(res.message);
});


tywx.WechatInterfaceInit();
