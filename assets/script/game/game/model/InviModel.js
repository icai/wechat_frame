

cc.Class({
    extends: cc.Component,

    properties: {


        uiType : 2,
        uiName : "InviModel",
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    show(data)
    {
        console.log (data);

    },
    close()
    {
        console.log ("close");
       mi.UIManager.hideUI("InviModel",{ceng : 50});
    },

    hide(data)
    {
        console.log ("hide");
        console.log (data);

    },
    inviReward(target ,data)
    {
        console.log ("获取邀请"+data+"人奖励");


    },

    invi()
    {
        console.log ("邀请好友");

    },

    // update (dt) {},
});
