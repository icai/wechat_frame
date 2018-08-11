tywx.systemInfo = {
    brand: "",            //手机品牌  支持版本1.5.0
    model: "",            //手机型号  
    pixelRatio: 0,        //设备像素比
    screenWidth: 0,       //屏幕宽度  支持版本1.1.0
    screenHeight: 0,      //屏幕高度  支持版本1.1.0
    windowWidth: 0,       //可使用窗口宽度
    windowHeight: 0,      //可使用窗口高度
    language: "",         //微信设置的语言
    version: "",          //微信版本号
    system: "",           //操作系统版本
    platform: "",         //客户端平台
    fontSizeSetting: 0,   //用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px。
    SDKVersion: "",       //客户端基础库版本
    benchmarkLevel: 0,    //性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好(目前设备最高不到50)
    battery: 0,           //电量，范围 1 - 100
    wifiSignal: 0         //wifi 信号强度，范围 0 - 4
}

tywx.ad = {
    init: function(){
        tywx.systemInfo = wx.getSystemInfoSync();
    },

    bannerAd: null,
    rewardedVideoAd: null,

    bannerRealWidth: 0,
    bannerRealHeight: 0,
    isBannerHide : false,
    curBannerScale : 1,
    //横幅广告
    createBannerAd: function (adUnitId, left, top, width, height) {

        var res = tywx.Util.compareVersion(tywx.UserInfo.SDKVersion, '2.0.4');
        if (res < 0) {
            wx.showToast({ "title": "微信版本有点低哦~" });
            return;
        }

        this.bannerAd = wx.createBannerAd({
            adUnitId: adUnitId,     //广告单元id
            style: {
                left: left,         //左上角横坐标
                top: top,           //左上角纵坐标
                width: width,
                height: height
            }
        })

        this.bannerAd.show().catch(
            err => console.log(err)
        );
        // 显示广告 这里默认创建完就显示

        // 监听广告错误事件
        this.bannerAd.onError(err => {
            console.log(err)
        })

        // 取消监听广告错误事件
        // this.bannerAd.offError(err => {
        //     console.log(err)
        // })

        // 监听banner广告加载事件
        this.bannerAd.onLoad(() => {
            console.log('banner 广告加载成功')
        })

        // 取消监听banner广告加载事件
        // this.bannerAd.offLaod(() =>{

        // })


    },

    createBannerAdOnBottom : function (adid) {

        var res = tywx.Util.compareVersion(tywx.UserInfo.SDKVersion, '2.0.4');
        if (res < 0) {
            return;
        }

        tywx.LOGD("fengbing", "  *-*-*-  create banner ad on bottom *-*-*- "+this.isBannerHide);
        if(this.isBannerHide==true)
            return;

        var sysInfo = wx.getSystemInfoSync();
        var screenWidth = sysInfo.screenWidth;
        var screenHeight = sysInfo.screenHeight;
        var minwidth = 300;

        var scale = this.curBannerScale;
	//各项目自己调整上对齐调整
        var adheight = screenHeight/cc.winSize.height*(cc.winSize.height/2-425);
        this.bannerAdDestroy();

        tywx.LOGD('showBannerAd', '当前屏幕宽度:' + screenWidth + "; screenHeight:" + screenHeight);

        this.bannerAd = wx.createBannerAd({
            adUnitId: adid,
            style: {
                left:0,
                top:0,
                width: screenWidth*scale,
            }
        });

        var self = this;
        if(!this.bannerAd)
            return;

        tywx.LOGD("fengbing", "  *-*-*-  create banner ad *-*-*- ");
        try {
            this.bannerAd.onResize(function (res) {
                tywx.LOGD('showBannerAd', '当前banner,width:' + res.width + "; height:" + res.height);
                var _height=res.height;
                var _top = (screenHeight - adheight);

                if (self.bannerAd && self.bannerAd.style) {
                    self.bannerAd.style.left = (screenWidth - res.width) / 2;
                    self.bannerAd.style.top = screenHeight - adheight;
                }

                tywx.LOGD('showBannerAd', '_height: ' + _height + "; _top:" + _top + " screenHeight: "+screenHeight);
                //banner做二次调整,如果全宽,高度超出,以高度为准缩放.如果高度缩放后,宽度小于最低300像素后,默认取最低值.
                var diffH  = _height - adheight;
                if(diffH>0){
                    var minscale_h = ((adheight-5)/_height).toFixed(1);
                    var minscale_w = (minwidth/screenWidth).toFixed(1);
                    var scale = Math.max(minscale_h, minscale_w);
                    self.bannerAd.style.width = Math.floor(scale*screenWidth);

                    tywx.LOGD('showBannerAd', 'reset banner width: ' + self.bannerAd.style.width);
                }


            });
        }catch (error){
            
        }
        this.bannerAd.show().catch(
            err => console.log(err)
        );
    },

    bannerAdDestroy: function () {
        try {
            if (this.bannerAd) {
                this.bannerAd.destroy();
                this.bannerAd = null;
            }
        }catch (error){
            this.bannerAd = null;
        }
    }
    ,

    bannerAdHide: function () {
        if(this.bannerAd) {
            this.isBannerHide = true;
            this.bannerAd.hide();
        }
    },

    bannerAdShow : function () {
    	//TODO 判断是不是在需要显示的界面
        if(this.bannerAd) {
            this.isBannerHide = false;
            this.bannerAd.show();
        }
    },

    //监听隐藏banner
    bannerAdOnResize: function(){
        this.bannerAd.onResize(res =>{
            this.bannerRealWidth = res.width;  //缩放后的宽度
            this.bannerRealHeight = res.height;  //缩放后的高度
        })
    },

    //取消监听隐藏banner
    bannerAdOffResize: function(){
        this.bannerAd.offResize(() =>{
        })
    },

    /**
     * @param adUnitId 广告id
     * @param successCallBack 微信视频成功回调
     * @param failBallBack 微信视频失败回调
     */
    createRewardedVideoAd: function (adUnitId,successCallBack,failBallBack) {

        if(this.isLoadVideo==true)//如果正在加载video return
            return;

        tywx.LOGD("fengbing", " *-*-*-*  网络类型  *-*-*-*-*- "+tywx.StateInfo.networkConnected);
        if(tywx.StateInfo.networkConnected==false){
            wx.showToast({ "title": "网络异常" });
            tywx.LOGD("fengbing", " ---------  网络没有连接  -----------");
            if (typeof failBallBack == "function") {
                failBallBack();
            }
            return;
        }
        let res = tywx.Util.compareVersion(tywx.UserInfo.SDKVersion, '2.0.4');
        if (res < 0) {
            wx.showToast({ "title": "微信版本有点低哦~" });
            if (typeof failBallBack == "function") {
                failBallBack();
            }
            return;
        }

        this.isLoadVideo = true;
        this.rewardedVideoAd = wx.createRewardedVideoAd({
            adUnitId: adUnitId,
        })

        var self  = this;
        let callBack = (res) => {
            self.rewardedVideoAd.offClose(callBack);
            self._resumeMusic();
            var playEnded = (!res || (res && res.isEnded));
            if(playEnded) {
                if (typeof successCallBack == "function") {
                    successCallBack();
                }
            }
            else{
                if (typeof failBallBack == "function") {
                    failBallBack();
                }
            }
        }

        this.rewardedVideoAd.load()
        .then(() => {
            this._preMusicState = tywx.AudioHelper.getMusicState();
            tywx.AudioHelper.closeMusic();
            this.rewardedVideoAd.onClose(callBack);
            self.bannerAdHide();
            return this.rewardedVideoAd.show()
        })
        .catch(err => { 
            console.log(err.errMsg);
            self.bannerAdShow();
            if (typeof failBallBack == "function") {
                self._resumeMusic();
                failBallBack();
            }
        })

        // 监听reward广告加载事件
        this.rewardedVideoAd.onLoad(() => {
            console.log('video 视频加载成功')
        })

        this.rewardedVideoAd.onError(err => {
            console.log(err)
            tywx.LOGD("fengbing", " ---------  rewarded video ad onerror  -----------");
            self._resumeMusic();
        })
    },

    _resumeMusic : function () {
        let music = this._preMusicState;
        this.isLoadVideo = false;
        this.bannerAdShow();
        tywx.LOGD("fengbing", "  resume music :  "+music);
        if(music!=1)
            return;
        tywx.AudioHelper.openMusic();
        tywx.LOGD("fengbing", "  open music :  "+music);
     	this.bannerAdShow();
	//项目背景音乐恢复 TODO
   
    }
}