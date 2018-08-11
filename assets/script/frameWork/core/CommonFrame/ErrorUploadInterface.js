tywx.ErrorUploadInterface = {
    /**
     * 获取error日志,运维要求格式
     * @param errMsg:报错信息
     */
    getErrorUploadInfo(errMsg){
        var timestamp = new Date().getTime();
        var data = {
            cloud_id: tywx.SystemInfo.cloudId,//服务端cloudid
            time: timestamp,//用户当前时间戳
            client_id: tywx.SystemInfo.clientId,  //客户端clientid
            game_id: tywx.SystemInfo.gameId,//gameid
            user_id: tywx.UserInfo.userId,//userid
            sys_version: tywx.UserInfo.system,//系统版本号
            mobile_models: tywx.UserInfo.model,//手机型号
            baseVersion: tywx.UserInfo.SDKVersion,//除微信以外，其他没有的可以补0
            wxVersion: tywx.UserInfo.wechatType,//当前微信版本号，其他没有的可以补0
            clientVersion: tywx.SystemInfo.version,//客户端版本
            Nettype: tywx.StateInfo.networkType,//当前客户端使用的是4G/2G/3G/wifi
            ip: tywx.UserInfo.ip,//用户当前外网IP地址
            errMsg: errMsg//报错信息
        }
        return data;
    },

    /**
     * 非压缩
     * 上传error日志
     * @param errMsg:报错信息
     */
    uploadErrorLog:function (errMsg) {
        if(!tywx.StateInfo.networkConnected) {
            tywx.LOGD('tywx.ErrorUploadInterface', 'net error!');
            return;
        }
        var data = this.getErrorUploadInfo(errMsg);
        if(data) {
            var header = ['Content-Type:text/plain'];
            var configObj = {
                'url': tywx.SystemInfo.errorUploadServer,
                'header': header,
                'postData': data,
                'callback': null
            };
            tywx.HttpUtil.httpPost(configObj,'POST');
        }
    },

    /**
     * 压缩
     * 上传error日志
     * @param data:报错信息以及用户信息
     */
    // uploadErrorLogWithZip:function (data) {
    //     if(!tywx.StateInfo.networkConnected) {
    //         tywx.LOGD('tywx.ErrorUploadInterface', 'net error!');
    //         return;
    //     }
    //     //TODO
    //     //报错信息压缩处理
    //     if(data) {
    //         var header = ['Content-Type:text/plain'];
    //         var configObj = {
    //             'url': tywx.SystemInfo.errorUploadServer,
    //             'header': header,
    //             'postData': data,
    //             'callback': null
    //         };
    //         tywx.HttpUtil.httpPost(configObj,'POST');
    //     }
    // },
};