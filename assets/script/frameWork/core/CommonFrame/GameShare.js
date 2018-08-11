/**
 * 游戏中智能分享接口使用:
 * 1.创建对象
 * 2.监听智能分享事件
 * 3.调用接口wxAutoShare
 */

tywx.GameShare = {

    init : function () {
        tywx.NotificationCenter.listen(tywx.EventType.GET_SHARE_CONFIG_SUCCESS, this._onGetShareConfigSuc, this);
    },

    /**
     * 获取分享成功
     * @private
     */
    _onGetShareConfigSuc : function () {
        if(this._inshare==true){
            var config = tywx.ShareInterface.getRandomOnShareAppMessageInfo();
            if(config){
                tywx.ShareInterface.share(config.title, config.imageUrl, config.sharePointId, config.shareSchemeId
                    , this._successCallBack, this._failCallBack);
            }
            this._inshare = false;
        }
    },

    destroy : function () {
        tywx.NotificationCenter.ignoreScope(this);
    },

    /**
     * 智能分享 权重
     */
    wxAutoShareWeights: function (sharepoint, param) {
        if(this._inshare==true)
            return;

        this._shareparam = param;
        this._sharepoint = sharepoint;

        var config =  tywx.PropagateInterface.getShareConfigInfoAutoWeight();
        tywx.LOGD("wxAutoShareWeights", "config  = " + JSON.stringify(config));
        if(config==-1)
            return;
        config = config[this._sharepoint];
        this._inshare = true;
        if(config){
            this._inshare = false;
            tywx.ShareInterface.share(config.title, config.imageUrl, config.sharePointId, config.shareSchemeId
                , this._successCallBack, this._failCallBack);
        }else {
            tywx.PropagateInterface.getShareConfigInfo();
        }
    },
    /**
     * 智能分享接口 (平均)
     * @param sharepoint: 分享点, 回传, 用于游戏辨别不同分享源
     * @param param : 分享参数 回传
     */
    wxAutoShare : function (sharepoint, param) {
        if(this._inshare==true)
            return;

        this._shareparam = param;
        this._sharepoint = sharepoint;

        var config =  this._getShareMessageInfo(sharepoint);
        if(config==-1)
            return;

        this._inshare = true;
        if(config){
            this._inshare = false;
            tywx.ShareInterface.share(config.title, config.imageUrl, config.sharePointId, config.shareSchemeId
                , this._successCallBack, this._failCallBack);
        }else {
            tywx.PropagateInterface.getShareConfigInfo();
        }
    },

    /**
     * 获取来自指定分享点的配置信息
     * @param sharepoint
     * @returns {*}
     * @private
     */
    _getShareMessageInfo: function(sharepoint) {
        var shareKeys = Object.keys(tywx.PropagateInterface.ShareConfig);
        if(shareKeys && shareKeys.length > 0) {
            var sharePointKey = sharepoint;
            if(sharepoint && shareKeys.indexOf(sharepoint)<0){
                var randomIndex = (Math.floor(Math.random()*10000))%shareKeys.length;
                sharePointKey = shareKeys[randomIndex];
            }
            var sharePointInfo = tywx.PropagateInterface.ShareConfig[sharePointKey];
            if(sharePointInfo && sharePointInfo.length > 0) {
                randomIndex = (Math.floor(Math.random()*10000))%sharePointInfo.length;
                var config = {
                    title: sharePointInfo[randomIndex].shareContent,
                    imageUrl: sharePointInfo[randomIndex].sharePicUrl,
                    sharePointId: sharePointInfo[randomIndex].sharePointId,
                    shareSchemeId: sharePointInfo[randomIndex].shareSchemeId
                }
                return config;
            }else{

            }
            return -1;
        }
        return null;
    },
    /**
     * 微信分享成功回调
     * @private
     */
    _successCallBack : function (result) {
        if(result) {
            var ret = {
                result : result,
                sharefrom : tywx.GameShare._sharepoint,
                param : tywx.GameShare._shareparam
            };
            tywx.NotificationCenter.trigger(tywx.EventType.PROPAGATE_SHARE_SUCESS, ret)
        }
    },

    /**
     * 微信分享失败回调
     * @private
     */
    _failCallBack : function (result) {
        if(result) {
            var ret = {
                result : result,
                sharefrom : tywx.GameShare._sharepoint
            };
            tywx.NotificationCenter.trigger(tywx.EventType.PROPAGATE_SHARE_FAIL, ret)
        }
        wx.showToast({title: "分享失败"});
    }

};