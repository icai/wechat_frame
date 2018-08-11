
cc.Class({
    extends: cc.Component,

    properties: {
        uiType : 2,
        uiName : "LoginLayer",
      
    },

    onLoad: function () {
        tywx.NotificationCenter.listen("test", this.onCallback, this);
    },

    start : function () {
        
    },
    

    update: function (dt) {
        //console.log("start");
    },

    loginBtnCallBack : function(ret){
        console.log("登陆")
        mi.UIManager.hideUI(this.uiName);
        mi.UIManager.showUI("GameLayer");

    },


    onDestory : function () {
        
    }
    // update (dt) {},
});
