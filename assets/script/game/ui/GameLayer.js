
cc.Class({
    extends: cc.Component,

    properties: {
        uiType : 2,
        uiName : "GameLayer",
      
    },

    onLoad: function () {
        tywx.NotificationCenter.listen(miDB.EVENT.SHOW_COMMENT_TIPS,this._showCommentTips,this);

    },

    start : function () {
        mi.UIManager.showUI("WeatherModel",{modelType : "gameModel/sceneModel",ceng : 10});
        mi.UIManager.showUI("BuildingsModel",{modelType : "gameModel/sceneModel",ceng : 20});
       mi.UIManager.showUI("HumanModel",{modelType : "gameModel/sceneModel",ceng : 30});
       mi.UIManager.showUI("GameUE",{ceng : 40});
        // mi.UIManager.showUI("FadeActionModel",{ceng : 500});
    
      // mi.UIManager.showUI("InviModel",{ceng : 50});

      mi.UIManager.showUI("TouchButtonModel",{ceng : 1});
    },

    update: function (dt) {
        //console.log("start");
    },
    onDestroy : function(){
        tywx.NotificationCenter.ignore(miDB.EVENT.SHOW_COMMENT_TIPS, this._showCommentTips, this);
    },

    _showCommentTips : function(params){
        var obj = {
            titleName : params.title || "提示",
            contentText : params.content || "无内容",
            okcallback : function(){
                // console.log("确定购买")
            },
            cancelCallback : function(){
                // console.log("取消购买")
            },
            closeCallback : function(){
                // console.log("关闭")
            }
        }
        mi.UIManager.showUI("TipsAlter",obj);
    },
});
