/**
 * Created by xiaochuntian on 2018/5/25.
 * 营销传播智能管理系统对应数据获取接口
 */


tywx.PropagateInterface = {
    ShareConfig: {},
    /**
     * 通过http获取分享相关信息
     * http://market.touch4.me/?act=api.getShareConfig&time=1421755384&game_mark=richddz&sign=a30ab1292aa5929e7f913ceed795f78c
     test demo
     var param = {
                 share_type:"hyyq2",      //获取分享点相关参数,可不传,传则代表获取单个分享点,不传表示获取all
                 config_id:"002003003"    //获取方案对应数据,不论该方案是否已发布,内部测试接口参数,代码发布上线时请删除
             };
     tywx.PropagateInterface.getShareConfigInfo(param);
     */
    getShareConfigInfo: function(reqObj) {
        if(typeof(reqObj) != 'object') {
            reqObj = {};
        }

        var timeStamp = new Date().getTime();
        reqObj.act = 'api.getShareConfig';
        reqObj.time = timeStamp;
        reqObj.game_mark = tywx.SystemInfo.cloudId + "-" + tywx.SystemInfo.gameId;

        var signStr = this.getConfigSignStr(reqObj);
        var paramStrList = [];
        for(var key in reqObj) {
            paramStrList.push(key + '=' + reqObj[key]);
        }
        paramStrList.push('sign=' + signStr);
        var finalUrl = tywx.SystemInfo.shareManagerUrl + '?' + paramStrList.join('&');
        var successcb = function(ret) {
            for(var key in ret.retmsg) {
                tywx.PropagateInterface.ShareConfig[key] = ret.retmsg[key];
            }
            tywx.NotificationCenter.trigger(tywx.EventType.GET_SHARE_CONFIG_SUCCESS, ret);
        };

        var failcb = function(ret) {
            tywx.NotificationCenter.trigger(tywx.EventType.GET_SHARE_CONFIG_FAIL, ret);
        };
        tywx.HttpUtil.httpGet({'url':finalUrl}, successcb, failcb);
    },


    /**
     * 通过http获取分享相关信息,根据权重自动选择条目,
     * 本地有缓存,调用后会立刻返回分享信息,不会出现http请求带来的延迟
     * http://market.touch4.me/?act=api.getShareConfig&time=1421755384&game_mark=28-20015&sign=1d356c1417a1d58fcec442eb8f655a4e
     tywx.PropagateInterface.getShareConfigInfoAutoWeight();
     * 返回值例子:
      {
		    "normalshare": {
                "sharePicUrl": "http:\/\/xiaoyouxi.qiniu.andla.cn\/pkgame\/share_wx\/mr_gun_share4.png",
                "shareContent": "精彩街机射击游戏，玩出你风格",
                "sharePointId": "024",
                "shareSchemeId": "035032",
                "extraAdd": [],
                "weight": 10
		    }
	  }
     *
     *
     */
    _cachedShareConfig: undefined,
    _pendingFlag: false,
    getShareConfigInfoAutoWeight: function () {
        if (this._cachedShareConfig == undefined) {
            // 还未获取到分享配置,记录当前请求,走异步接口
            this._pendingFlag = true;
            return -1;
        }
        else {
            // 本地已有分享配置,立即返回事件
            // tywx.NotificationCenter.trigger(tywx.EventType.GET_SHARE_CONFIG_SUCCESS, this._shuffleByWeights());
            return this._shuffleByWeights();
        }
    },

    _doHttpGetShareConfig: function () {
        var reqObj = {};
        var timeStamp = new Date().getTime();
        reqObj.act = 'api.getShareConfig';
        reqObj.time = timeStamp;
        reqObj.game_mark = tywx.SystemInfo.cloudId + "-" + tywx.SystemInfo.gameId;

        var signStr = this.getConfigSignStr(reqObj);
        var paramStrList = [];
        for (var key in reqObj) {
            paramStrList.push(key + '=' + reqObj[key]);
        }
        paramStrList.push('sign=' + signStr);
        var finalUrl = tywx.SystemInfo.shareManagerUrl + '?' + paramStrList.join('&');

        var self = this;
        var successcb = function (ret) {
            self._cachedShareConfig = ret.retmsg;
            if (self._pendingFlag) {
                tywx.NotificationCenter.trigger(tywx.EventType.GET_SHARE_CONFIG_SUCCESS, self._shuffleByWeights());
                self._pendingFlag = false;
            }
        };

        var failcb = function (ret) {
            if (self._pendingFlag) {
                tywx.NotificationCenter.trigger(tywx.EventType.GET_SHARE_CONFIG_FAIL, ret);
                self._pendingFlag = false;
            }
            tywx.Timer.setTimer(cc.director, function () {
                self._doHttpGetShareConfig();
            }, 10, 0, 0);
        };
        tywx.HttpUtil.httpGet({'url': finalUrl}, successcb, failcb);
    },

    _shuffleByWeights: function () {
        var ret = {};
        for (var key in this._cachedShareConfig) {
            if(key == 'shareExt') continue;
            var slotArr = this._cachedShareConfig[key];
            if (slotArr.length == 0) {
                ret[key] = {};
            }
            else if (slotArr.length == 1) {
                ret[key] = {};
                ret[key].title = slotArr[0].shareContent;
                ret[key].imageUrl = slotArr[0].sharePicUrl;
                ret[key].sharePointId = slotArr[0].sharePointId;
                ret[key].shareSchemeId = slotArr[0].shareSchemeId;
            }
            else {
                var totalWeights = slotArr.reduce(function (x, y) {
                    return x + y.weight;
                }, 0);
                var rnd = Math.random() * totalWeights;
                for (var i = 0; i < slotArr.length; i++) {
                    rnd -= slotArr[i].weight;
                    if (rnd <= 0) {
                        ret[key] = {};
                        ret[key].title = slotArr[i].shareContent;
                        ret[key].imageUrl = slotArr[i].sharePicUrl;
                        ret[key].sharePointId = slotArr[i].sharePointId;
                        ret[key].shareSchemeId = slotArr[i].shareSchemeId;
                        break;
                    }
                }
            }
        }
        return ret;
    },

    /**
     * 获取用户特征值接口
     * http://market.touch4.me/?act=api.getUserFeature&cloud_id=24&game_id=6&time=1527235026&user_id=1404248&sign=a2b6938904ac3759fe6404ea8ed49267
     * @param reqObj
     */
    getUserFeatureInfo: function() {
        var reqObj = {};
        var timeStamp = new Date().getTime();
        reqObj.act = 'api.getUserFeature';
        reqObj.cloud_id = tywx.SystemInfo.cloudId;
        reqObj.game_id = tywx.SystemInfo.gameId;
        reqObj.user_id = tywx.UserInfo.userId;
        reqObj.time = timeStamp;

        var signStr = this.getConfigSignStr(reqObj);
        var paramStrList = [];
        for(var key in reqObj) {
            paramStrList.push(key + '=' + reqObj[key]);
        }
        paramStrList.push('sign=' + signStr);
        var finalUrl = tywx.SystemInfo.shareManagerUrl + '?' + paramStrList.join('&');
        var successcb = function(ret) {
            tywx.NotificationCenter.trigger(tywx.EventType.GET_USER_FEATURE_SUCCESS, ret);
        };

        var failcb = function(ret) {
            tywx.NotificationCenter.trigger(tywx.EventType.GET_USER_FEATURE_FAIL, ret);
        };
        tywx.HttpUtil.httpGet({'url':finalUrl}, successcb, failcb);
    },

    /**
     * 获取用户区域
     */
    getUserAreaInfo : function () {
        var finalUrl = tywx.SystemInfo.areaUrl + 'api/iploc5/search/city';
        var successcb = function(ret) {
            if(ret&&ret['ok']===1){
                var loc = ret['loc'];
                if(loc&&loc.length>3){
                    console.log("fengbing", " *--*-*-*-*-*  获取用户区域:  "+loc[2]);
                    tywx.UserInfo.userArea = loc[2];
                }
            }
        };

        var failcb = function(ret) {
        };
        tywx.HttpUtil.httpGet({'url':finalUrl}, successcb, failcb);
    },

    /**
     * 计算签名字符串
     * @param reqObj
     * @returns {string}
     */
    getConfigSignStr: function(reqObj) {
        var sortedKeys = Object.keys(reqObj).sort();
        var signStr = '';
        for(var i=0;i<sortedKeys.length;i++){
            var key = sortedKeys[i];
            if(key == 'act' || key == 'sign') {
                continue;
            } else {
                signStr += key + '=' + reqObj[key];
            }
        }
        var finalSign = tywx.hex_md5('market.tuyoo.com-api-' + signStr + '-market.tuyoo-api') || '';
        return finalSign;
    },
};