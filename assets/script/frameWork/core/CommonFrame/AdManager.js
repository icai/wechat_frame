/**
 * Created by xiaochuntian on 2018/5/31.
 */

/**
 * 交叉导流相关系统接口, 调用导流接口使用showAd() 接口， 刷新导流显示icon使用resetBtnIcon() 接口
 */
tywx.AdManager = {
    adIconBtn: null,                //向其他小游戏的导流入口

    adInfoList : [],                //所有广告信息的列表
    currentAdInfo : null,           //当前做展示的导流信息
    currentWebPage : null,          //当前显示的最终导流游戏的信息
    retryTimes : 3,                 //网络请求失败重试次数
                                    //demo数据
    AnimType : {                    //广告显示的动画
        STATIC : 1, //静态
        SHAKE  : 2, //抖动
        FRAME  : 3  //帧动画
    },


    /**
     * 请求交叉倒流的信息
     */
    requestADInfo : function () {

        if(!tywx.IsWechatPlatform()) {
            return;
        }
        this.retryTimes--;
        var reqObj = {};
        var timeStamp = new Date().getTime();
        reqObj.act = 'api.getCrossConfig';
        reqObj.time = timeStamp;
        reqObj.game_mark = tywx.SystemInfo.cloudId + "-" + tywx.SystemInfo.gameId;
        var signStr = this.getConfigSignStr(reqObj);
        var paramStrList = [];
        for(var key in reqObj) {
            paramStrList.push(key + '=' + reqObj[key]);
        }
        paramStrList.push('sign=' + signStr);
        var finalUrl = tywx.SystemInfo.shareManagerUrl + '?' + paramStrList.join('&');
        var that = this;

        wx.request({
            url : finalUrl,
            method : 'GET',
            success : function (res) {
                if (res.statusCode == 200){

                    var ret = res.data;
                    console.log('RET:' + JSON.stringify(ret));
                    that.adInfoList = [];
                    if(ret.retmsg){
                        for(var index in ret.retmsg){
                            that.adInfoList.push(ret.retmsg[index]);
                        }
                    }

                    tywx.NotificationCenter.trigger('GET_AD_MSG_SUCCESS');

                    that.retryTimes = 3;
                }
            },
            fail : function (res) {

                if(that.retryTimes > 0){

                    that.requestADInfo();
                }else{
                    that.retryTimes = 0;
                }

            }
        });


    },

    /**
     * 获取广告推广节点（可任意添加动画）
     * @returns {null}
     */
    getAdNode : function () {

        return this.adIconBtn;

    },

    /**
     * 对外接口，用于添加广告位
     * position {x, y}
     */
    showAd: function(position) {

        this.genRandomFirstAdInfo();

        if(!this.currentAdInfo){
            return;
        }

        if(this.adIconBtn) {
            this.adIconBtn.active = true;
        } else {
            var that = this;
            //动态加载资源必须放在resources目录下,导流入口强制命名为adNode,放在resources/prefabs下
            cc.loader.loadRes('prefabs/adNode', function (err, prefab) {
                var preFabNode = cc.instantiate(prefab);
                preFabNode.position = cc.p(position.x, position.y);
                that.adIconBtn = preFabNode;
                cc.game.addPersistRootNode(preFabNode);
                that.adIconNode();
                var adButton = that.adIconBtn.getChildByName('adButton');
                adButton.on('click', function () {
                    that.onClickAdIconBtn();
                });
            });
        }
    },

    /**
     * 生成随机的一级导流信息
     */
    genRandomFirstAdInfo : function() {

        if(this.adInfoList.length == 0){
            return;
        }

        var weight_list = [
            {
                'weight':0,
                'id':'000'
            }
        ];
        var that = this;

        for(var i in this.adInfoList){

            var _randomObj = {
                'weight' : parseInt(that.adInfoList[i].icon_weight),
                'id' : that.adInfoList[i].icon_id,
            };
            weight_list.push(_randomObj);
        }

        weight_list.sort(function(a, b){
            return a.weight > b.weight;
        });

        var _total = 0;

        weight_list.forEach(element => {
            _total += element.weight;
    });

        var _randomIndex = parseInt(Math.random()*10000)%(_total+1);

        var _tTotal = 0;

        var _selectIndex = 0;

        for(var i=0; i<(weight_list.length-1);i++){
            _tTotal += weight_list[i].weight;
            if(_tTotal < _randomIndex && (_tTotal+weight_list[i+1].weight) >= _randomIndex){
                _selectIndex = i+1;
                break;
            }
        }
        var _selectObj= weight_list[_selectIndex];

        this.adInfoList.forEach(element => {
            if(element.icon_id == _selectObj.id){
            this.currentAdInfo = element;
        }
    });

    },

    /**
     * 生成随机的二级导流信息
     */
    genRandomSecondAdInfo : function() {

        var _webPages = this.currentAdInfo.webpages;

        if(_webPages.length == 0){
            return;
        }

        var weight_list = [{'weight':0, 'id':'000'}];

        for(var i in _webPages){

            var _randomObj = {
                'weight' : parseInt(_webPages[i].webpage_weight),
                'id' : _webPages[i].config_id
            }

            weight_list.push(_randomObj);
        }

        weight_list.sort(function(a, b){
            return a.weight > b.weight;
        });

        var _total = 0;

        weight_list.forEach(element => {
            _total += element.weight;
        });

        var _randomIndex = parseInt(Math.random()*10000)%(_total+1);

        var _tTotal = 0;

        var _selectIndex = 0;
        for(var i=0; i<(weight_list.length-1);i++){
            _tTotal +=  weight_list[i].weight;
            if(_tTotal < _randomIndex && (_tTotal+weight_list[i+1].weight) >= _randomIndex){
                _selectIndex = i+1;
                break;
            }
        }
        var _selectObj = weight_list[_selectIndex];


        _webPages.forEach(element => {
            if(element.config_id == _selectObj.id){
                this.currentWebPage = element;
            }
        });

    },

    adIconNode : function () {

        if(!this.currentAdInfo || !this.adIconBtn){
            return;
        }

        var _animaType = this.currentAdInfo.icon_type;
        var that = this;

        var spriteIco = this.adIconBtn.getChildByName('adIcon');
        var adButton = this.adIconBtn.getChildByName('adButton');

        spriteIco.stopAllActions();
        if(spriteIco.getComponent(cc.Animation)){
            spriteIco.removeComponent(cc.Animation);
        }

        spriteIco.setRotation(0);

        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeShowAdBtn, [that.currentAdInfo.icon_id,
                                                                                      that.currentAdInfo.icon_type,
                                                                                      that.currentAdInfo.icon_skip_type,
                                                                                      that.currentAdInfo.toappid,
                                                                                      that.currentAdInfo.togame]);

        switch (_animaType){

            case this.AnimType.STATIC:

                cc.loader.load({url: that.currentAdInfo.icon_url[0]}, function (err, texture) {
                    if (!err) {

                        spriteIco.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    }
                    else {

                    }
                });

                break;
            case this.AnimType.SHAKE:

                cc.loader.load({url:that.currentAdInfo.icon_url[0]}, function(error, texture){

                    spriteIco.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    spriteIco.anchorX = 0.5;
                    spriteIco.anchorY = 0.5;
                    var _act1 = cc.rotateBy(0.06, -20);
                    var _act2 = cc.rotateBy(0.12, 40);
                    var _act3 = cc.rotateBy(0.12, -40);
                    var _act4 = cc.rotateBy(0.06, 20);
                    var _delay = cc.delayTime(1);
                    spriteIco.runAction(cc.repeatForever(cc.sequence(_act1,
                        cc.repeat(cc.sequence(_act2, _act3), 4),
                        _act4,
                        _delay)));
                });


                break;
            case this.AnimType.FRAME:

                var allFrames =[];

                var playFrameAction = function () {

                    if(!spriteIco.getComponent(cc.Animation)) {

                        var animation = spriteIco.addComponent(cc.Animation);
                        var clip = cc.AnimationClip.createWithSpriteFrames(allFrames, 10);
                        clip.name = 'anim_frame';
                        clip.wrapMode = cc.WrapMode.Loop;
                        animation.addClip(clip);
                        animation.play('anim_frame');
                    }
                };

                for(var i = 0; i < that.currentAdInfo.icon_url.length; i++) {

                    cc.loader.load(that.currentAdInfo.icon_url,function (err, results) {


                        if (err) {
                            for (var i = 0; i < err.length; i++) {
                                cc.log('Error url [' + err[i] + ']: ' + results.getError(err[i]));
                            }
                        }

                        for(var i = 0; i < that.currentAdInfo.icon_url.length; i++) {

                            var _frame = new cc.SpriteFrame(results.getContent(that.currentAdInfo.icon_url[i]));
                            allFrames.push(_frame);
                        }
                        playFrameAction();
                    });
                }

                break;
            default:
                break;

        }

    },

    hideAd: function() {
        if(this.adIconBtn) {
            this.adIconBtn.active = false;
        }
    },

    onClickAdIconBtn: function() {

        this.genRandomSecondAdInfo();

        //先尝试直接跳转
        var skip_type =  this.currentAdInfo.icon_skip_type;
        var toappid = this.currentAdInfo.toappid;
        var togame = this.currentAdInfo.togame;
        var topath = this.currentAdInfo.path;
        var second_toappid = this.currentAdInfo.second_toappid;

        console.log('topath ====>' + topath);

        var that = this;

        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickAdBtn, [that.currentAdInfo.icon_id,
                                                                                    that.currentAdInfo.toappid,
                                                                                 that.currentAdInfo.togame]);

        //先尝试直接跳转
        if(wx && wx.navigateToMiniProgram){
            if(1 == skip_type){

                wx.navigateToMiniProgram({
                    appId: toappid,
                    path : topath ? topath : '?from=adcross',
                    envVersion: 'release',
                    extraData: {
                        from: topath ? topath : '?from=adcross',
                    },
                    success: function(res) {

                        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, [that.currentAdInfo.icon_id,
                                                                                                        that.currentWebPage.config_id,
                                                                                                        that.currentWebPage.webpage_url,
                                                                                                        that.currentAdInfo.toappid,
                                                                                                        that.currentAdInfo.togame]);
                        console.log('wx.navigateToMiniProgram success');
                        console.log(res);
                    },
                    fail: function (res) {
                        console.log('wx.navigateToMiniProgram fail');
                        console.log(res);

                        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, [that.currentAdInfo.icon_id,
                                                                                                                    that.currentWebPage.config_id,
                                                                                                                    that.currentWebPage.webpage_url,
                                                                                                                    that.currentAdInfo.toappid,
                                                                                                                    that.currentAdInfo.togame]);
                    },
                    complete: function (res) {

                        console.log('navigateToMiniProgram ==== complete');
                        that.resetBtnIcon();
                    }
                });

                return;
            }else if(2 == skip_type){

                wx.navigateToMiniProgram({
                    appId: second_toappid,
                    path : topath ? topath : '?from=adcross',
                    envVersion: 'release',
                    extraData: {
                        from: topath ? topath : '?from=adcross',
                    },
                    success: function(res) {
                        console.log('wx.navigateToMiniProgram success');
                        console.log(res);

                        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, [that.currentAdInfo.icon_id,
                                                                                                                        that.currentWebPage.config_id,
                                                                                                                        that.currentWebPage.webpage_url,
                                                                                                                        that.currentAdInfo.toappid,
                                                                                                                        that.currentAdInfo.togame]);
                    },
                    fail: function (res) {
                        console.log('wx.navigateToMiniProgram fail');
                        console.log(res);

                        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, [that.currentAdInfo.icon_id,
                                                                                                                    that.currentWebPage.config_id,
                                                                                                                    that.currentWebPage.webpage_url,
                                                                                                                    that.currentAdInfo.toappid,
                                                                                                                    that.currentAdInfo.togame]);
                    },
                    complete: function (res) {

                        console.log('navigateToMiniProgram ==== complete');
                        that.resetBtnIcon();
                    }
                });


            }else{
                console.error('Unsupported skip type! Please Check!');
            }


            return;
        }

        //直接跳转接口不好使，展示 小程序/小游戏 二维码图片
        if(!this.currentWebPage){
            return;
        }



        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeClickShowQRCode, [that.currentAdInfo.icon_id,
                                                                                                    that.currentWebPage.config_id,
                                                                                                    that.currentWebPage.webpage_url,
                                                                                                    that.currentAdInfo.toappid,
                                                                                                    that.currentAdInfo.togame]);
        if(tywx.IsWechatPlatform()) {
            wx.previewImage({
                current: [that.currentWebPage.webpage_url],
                urls: [that.currentWebPage.webpage_url],
                success:function(res){
                    tywx.LOGD(null, "预览图片成功！");
                },
                fail:function (res) {
                    tywx.LOGD(null, "预览图片失败！");
                },
                complete :function (res) {
                    console.log('预览图片完成');
                    that.resetBtnIcon();
                },
            });
        }

    },

    /**
     * 刷新ad按钮的icon
     */
    resetBtnIcon : function() {

        if(!this.adIconBtn){
            return;
        }else{
            this.genRandomFirstAdInfo();
            this.adIconNode();
        }

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

tywx.AdManager.requestADInfo();