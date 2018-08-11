/**
 * Created by xiaochuntian on 2018/5/28.
 */
/**
 * 开放域共用接口
 */
tywx.OpenDataContextUtil = {
    methodIndex: 0,
    methodCallDic: {},
    isOnTimer: false,
    /**
     * 开启检查定时器
     */
    initCheckTimer: function() {
        if(this.getOpenDataContext() == null) return;
        if(this.isOnTimer) return;
        this.isOnTimer = true;
        var cb = function() {
            tywx.OpenDataContextUtil.checkOpenDataContextStat()
        };
        tywx.Timer.setTimer(cc.director, cb, 1/10, cc.macro.REPEAT_FOREVER, 0);
    },

    getOpenDataContext: function(){
        if (wx && wx.hasOwnProperty('getOpenDataContext')) {
            var openDataContext = wx.getOpenDataContext();
            if (openDataContext) {
                return openDataContext;
            }
        }
        return null;
    },

    /**
     * 根据请求发出的列表,检查子域数据获取情况,结果分为成功|失败|超时三种,进行回调和事件通知
     */
    checkOpenDataContextStat: function() {
        var openDataContext = this.getOpenDataContext();
        if(openDataContext == null) return null;
        var sharedCanvas = openDataContext.canvas;
        var context = sharedCanvas.getContext("2d");
        for(var key in this.methodCallDic) {
            if(context[key]) {
                if(context[key]["status"] == true) {
                    //成功,有回调调回调,同时trigger事件出去
                    this.methodCallDic[key]["eventType"] && tywx.NotificationCenter.trigger(this.methodCallDic[key]["eventType"] , [key, context[key]["data"]])
                } else {
                    this.methodCallDic[key]["eventType"] && tywx.NotificationCenter.trigger(this.methodCallDic[key]["eventType"] , [key, context[key]["data"]]);
                }
                delete context[key];
                delete this.methodCallDic[key];
            } else {
                if((new Date()).valueOf() - this.methodCallDic[key]["time"] > 10000) {//2秒都没返回
                    //超时
                    delete context[key];
                    delete this.methodCallDic[key];
                }
            }
        }
    },

    /**
     * 向子域请求获取用户信息
     * @param successCallBack
     * @param failCallBack
     * @returns {string}
     */
    getUserInfo: function(successCallBack, failCallBack) {
        var methodName = "getUserInfo";
        var methodId = methodName + this.methodIndex;
        var openDataContext = this.getOpenDataContext();
        if(openDataContext == null) return null;
        openDataContext.postMessage({
            method : methodName,
            method_id: methodId

        });
        this.methodCallDic[methodId] = {
            time: (new Date()).valueOf(),
            eventType:tywx.EventType.GETUSERINFO_SUCCESS
        };
        return methodId;
    },
    /**
     * 向子域请求好友排行榜信息
     * @param successCallBack
     * @param failCallBack
     * @returns {string}
     */
    getFriendRankData: function(successCallBack, failCallBack) {
        var methodName = "getFriendRankData";
        var methodId = methodName + this.methodIndex;
        var openDataContext = this.getOpenDataContext();
        if(openDataContext == null) return null;
        openDataContext.postMessage({
            method : 'getFriendRankData',
            method_id: methodId,

        });

        this.methodCallDic[methodId] = {
            time: (new Date()).valueOf(),
            eventType:tywx.EventType.GETRFRIENDRANK_SUCCESS
        };
        return methodId;
    },

    /**
     * 向子域请求获取群排行榜信息
     * @param shareTicket
     * @param successCallBack
     * @param failCallBack
     * @returns {string}
     */
    getGroupRankData: function( shareTicket,  successCallBack, failCallBack) {
        var methodName = "getGroupRankData";
        var methodId = methodName + this.methodIndex;
        var openDataContext = this.getOpenDataContext();
        if(openDataContext == null) return null;
        openDataContext.postMessage({
            method : 'getGroupRankData',
            method_id: methodId,
            shareTicket: shareTicket,

        });
        this.methodCallDic[methodId] = {
            time: (new Date()).valueOf(),
            eventType:tywx.EventType.GETGROUPRANK_SUCCESS
        };
        return methodId;
    },
    /**
     * 获取开放域接口
     */
    getOpenData : function (update) {
        // var wechatTypeA = ty.UserInfo.SDKVersion.split(".");
        // if(wechatTypeA[1] && wechatTypeA[1]< 1){
        //     if(!update){
        //         wx.showToast({title: "你当前的微信版本不支持此功能,请升级至6.6.2以上"});
        //     }
        //     return null;
        // }else {
        //     if(wechatTypeA[1] && wechatTypeA[1] == 1 &&wechatTypeA[2] && wechatTypeA[2] < 9){
        //         if(!update){
        //             wx.showToast({"title":"你当前的微信版本不支持此功能,请升级至6.6.2以上"});
        //         }
        //         return null;
        //     }
        // }
        var openDataContext = wx.getOpenDataContext();
        if (openDataContext){
            return openDataContext
        }
        return null;
    },
    /**
     * 更新自己的排行榜数据
     * @param score
     */
    upRankData : function (score) {
        var openDataContext = tywx.OpenDataContextUtil.getOpenData(true);
        if(!openDataContext){
            return;
        }
        openDataContext.postMessage({
            method:'updateMaxScore',
            maxscore: score,
            userId:tywx.UserInfo.userId
        })
    },
    /**
     * 显示好友排行榜数
     */
    showFriendRank : function () {
        var openDataContext = tywx.OpenDataUtil.getOpenData();
        if(!openDataContext){
            return;
        }
        openDataContext.postMessage({
            method:'showFriendRank',
            userId:tywx.UserInfo.userId,
        });
    },
    /**
     * 显示群排行榜数
     */
    showGroupRank : function (shareTicket) {
        var openDataContext = tywx.OpenDataUtil.getOpenData();
        if (!openDataContext) {
            return;
        }
        openDataContext.postMessage({
            method: 'showGroupRank',
            userId: tywx.UserInfo.userId,
            shareTicket: shareTicket,
        });
    },
    /**
     * 显示个人信息 ： 头像&昵称
     */
    showUserInfo : function(){
        var openDataContext = tywx.OpenDataContextUtil.getOpenData();
        if(!openDataContext){
            return;
        }
        openDataContext.postMessage({
            method:'showUserInfo',
            userId:tywx.UserInfo.userId,
        });
    },
    /**
     * 初始化
     */
    clearShareCanvas : function () {
        var openDataContext = tywx.OpenDataContextUtil.getOpenData();
        if(!openDataContext){
            return;
        }
        openDataContext.postMessage({
            method:'showOrigin'
        })
    },
}
