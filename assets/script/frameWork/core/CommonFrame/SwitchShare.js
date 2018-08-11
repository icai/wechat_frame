/**
 * Created by lvmengnan on 2018/6/8.
 */

 /**
  * 使用方法如下：
  * 接口调用 getLastLoginProvince（）city可以选择填写
  * 监听消息 tywx.NotificationCenter.listen(tywx.EventType.GETSWITCH_RESULT, this.callback);
  * 如果开关种类不足，可以在_getSwitchResult（）的SwitchFlag 里面直接扩展
  */

tywx.SwitchShare = {

    /**
     * 获取用户特征,调用消息请求
     */
    getLastLoginProvince: function(city)
    {
        //城市开关
        if(!city)
        {
            this._requestSwitchShare("", this._getSwitchResult, this);
            return
        }
        tywx.NotificationCenter.listen(tywx.EventType.GET_USER_FEATURE_SUCCESS, this._getUserFeatureResult, this);
        tywx.PropagateInterface.getUserFeatureInfo();
    },


    /**
     * 获取用户特征回调
     */
    _getUserFeatureResult: function(result)
    {
        ty.LOGD("lvmengnan", " ======= getUserFeatureResult's result "+ JSON.stringify(result));
        var last_login_province = ""
        if(result["retmsg"]&&result["retmsg"]["last_login_province"])
        {
            last_login_province = result["retmsg"]["last_login_province"]; //获取城市信息
            this._requestSwitchShare(last_login_province, this._getSwitchResult, this);
        }
    },


    /**
     * 最终获取开关结果回调
     */
    _getSwitchResult: function(params)
    {
        if(params&&params["data"]){
            var result_data = params["data"]["result"];
            var data_list = result_data["data"]
            if(data_list)
            {
                var SwitchFlag = {}
                SwitchFlag['treasureBoxShare'] = data_list["treasureBoxShare"];
                SwitchFlag['itemShare'] = data_list["itemShare"];
                SwitchFlag['MysteryTreasureShare'] = data_list["MysteryTreasureShare"];
                tywx.NotificationCenter.trigger(tywx.EventType.GETSWITCH_RESULT, SwitchFlag);
            }
        }
    },


    /**
     * 获取分享开关http请求
     */
    _requestSwitchShare : function(city,callback, scope){
        wx.request({
            url:tywx.SystemInfo.serverUrl+"get_online_switch",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method:'POST',
            data: {
                gameId:tywx.SystemInfo.gameId,
                city: city
            },
            success: function(params) {
                ty.LOGD("lvmengnan", " ======= _requestSwitchShare  "+JSON.stringify(params));
                if(callback){callback.call(scope, params)};
            },
            fail: function(params) {
                wx.showToast({title: "请求失败！"});
            },
            complete: function(params) {
            }
        }) 
    },

}

