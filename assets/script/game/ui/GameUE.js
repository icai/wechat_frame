
cc.Class({
    extends: cc.Component,

    properties: {
        uiType : 2,
        uiName : "GameUE",
        cornCount : cc.Label,
        diamondCount : cc.Label,
    },

    onLoad: function () {

        tywx.NotificationCenter.listen(miDB.EVENT.CHANGE_GAME_DATA, this.changeUICallback, this);

        // miDB.GameData.setItemByName("corn",500000000000000000000000000000000000000);
        // miDB.GameData.setItemByName("diamond",500000000);


        // if (  cc.userInfo )
        // {
        //     cc.find("richsetHead/nickNamelabel",this.node).getComponent(cc.Label).string = cc.userInfo.nickName ;
           
        //     var self = this;
        //     cc.loader.loadRes(cc.userInfo.avatarUrl, cc.SpriteFrame, function (err, spriteFrame) {
        //        cc.find("richsetHead",self.node).getComponent(cc.Sprite).spriteFrame = spriteFrame;
        //     });


        // }
    },

    //刷新UI界面
    changeUICallback : function(params){
        cc.find("top/cornCount",this.node).getComponent(cc.Label).string = (params.corn || 0)
        cc.find("top/zuanshiCount",this.node).getComponent(cc.Label).string = (params.diamond || 0)
    },

    start : function () {
        
    },
    

    update: function (dt) {
        //console.log("start");
    },
    rankBtnCallback : function(){
        tywx.NotificationCenter.trigger(miDB.EVENT.ACCULARATE_ALL_CORN_DATA,{time : 1 * 60}) ;
    },
    rewardBtnCallback : function(){
        tywx.NotificationCenter.trigger(miDB.EVENT.ACCULARATE_ALL_CORN_DATA,{time : 60 * 60}) ;
    },
    invaitBtnCallback : function(){
        tywx.NotificationCenter.trigger(miDB.EVENT.ACCULARATE_ALL_CORN_DATA,{time : 60 * 24 * 60}) ;
    },
    getCornBtnCallback : function(){
        tywx.NotificationCenter.trigger(miDB.EVENT.GAIN_ALL_CORN_DATA);
    },
    fristBtnCallback : function(){

        // 加速
     //   tywx.NotificationCenter.trigger(miDB.EVENT.ACCULARATE_ALL_CORN_DATA,{time : 0}) 

     
    },
    buildingaBtnCallback : function(){

    },
    getRankList : function()
    {
        console.log ("获取排行榜");
       mi.UIManager.showUI("RankListModel",{ceng : 50});
    },
    getReward : function()
    {
        console.log ("奖励");
       mi.UIManager.showUI("RewardModel",{ceng : 50});
    },
    getInvi : function()
    {
        console.log ("邀请");
       mi.UIManager.showUI("InviModel",{ceng : 50});
    },
    getBuild : function()
    {
        mi.UIManager.showUI("OutPutModel",{ceng : 50});

    },
    getSpeed : function()
    {

        mi.UIManager.showUI("SpeedModel",{ceng : 50});
    },
    getTest( target, data)
    {
        mi.UIManager.showUI("FadeActionModel",{ceng : 500});
        if (data == "R")
        {
            cc.find("BuildingsModel" ,this.node.parent).getComponent("BuildingsModel").right();
        }
       else if (data == "L")
        {
            cc.find("BuildingsModel" ,this.node.parent).getComponent("BuildingsModel").left();
        }
   

    },
    
    onDestroy : function(){
        tywx.NotificationCenter.ignore(miDB.EVENT.CHANGE_GAME_UI, this.changeUICallback, this);
    }


    
    
});
