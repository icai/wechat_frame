
cc.Class({
    extends: cc.Component,

    properties: {
        uiType : 2,
        uiName : "ShopLayer",
      
    },

    onLoad: function () {

     
    },

    start : function () {
        
    },
    

    update: function (dt) {
        //console.log("start");
    },

    shopBtnCallBack : function(ret){
        console.log("商城")
        mi.UIManager.hideUI(this.uiName);
        mi.UIManager.showUI("LoginLayer");
    },

    
    buyBtnCallBack : function(ret){
        console.log("购买")
        // mi.UIManager.hideUI(this.uiName);

        var obj = {
            titleName : "充值提示",
            contentText : "余额不足，请充值！",
            okcallback : function(){
                console.log("确定购买")
            },
            cancelCallback : function(){
                console.log("取消购买")
            },
            closeCallback : function(){
                console.log("关闭")
            }
        }
        mi.UIManager.showUI("TipsAlter",obj);

    },
    onDestory : function () {
        
    }
    // update (dt) {},
});
