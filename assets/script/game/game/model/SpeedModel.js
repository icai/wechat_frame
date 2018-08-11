
cc.Class({
    extends: cc.Component,

    properties: {

        uiType : 2,
        uiName : "SpeedModel",
        offLineItem : cc.Prefab,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    show : function(data)
    {
    },
    diamSpeedBtnCallback : function()
    {
        console.log ("钻石加速");

    },
    lookScreenBtnCallback : function()
    {
        console.log ("观看视屏加速");

    },
    close : function()
    {
        console.log ("close");
       mi.UIManager.hideUI("SpeedModel",{ceng : 50});
    },
    
    hide : function(data)
    {
        console.log ("hide");
    },

    // update (dt) {},
});
