
cc.Class({
    extends: cc.Component,

    properties: {
        uiType : 3,
        uiName : "TipsAlter",
        titleText : cc.Label,
        contentText : cc.Label,
    },

    onLoad: function () {
        
     
    },

    start : function () {
        
    },
    
    show : function (params){
        this.okCallback = params.okCallback
        this.cancelCallback = params.cancelCallback
        this.closeCallback = params.closeCallback

        cc.find("title",this.node).getComponent(cc.Label).string = params.titleName || "提示"
        cc.find("content",this.node).getComponent(cc.Label).string = params.contentText || ""
        console.log(JSON.stringify(params))
    },
    hide : function(params){
        console.log(JSON.stringify(params))
    },
    update: function (dt) {
        //console.log("start");
    },

    okBtnCallBack : function(ret){
        console.log("确认")
        mi.UIManager.hideUI(this.uiName,{test : "测试关闭"});
    },
    closeBtnCallBack : function(ret){
        console.log("关闭")
        mi.UIManager.hideUI(this.uiName);
    },
    cancalBtnCallBack : function(ret){
        console.log("取消")
        mi.UIManager.hideUI(this.uiName);
    },

    onDestory : function () {
       
    }
    // update (dt) {},
});
