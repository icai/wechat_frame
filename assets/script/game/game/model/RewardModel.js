

cc.Class({
    extends: cc.Component,

    properties: {


        uiType : 2,
        uiName : "RewardModel",
    },



    start () {

    },
    show(data)
    {
        console.log (data);

    },
    close()
    {
        console.log ("close");
       mi.UIManager.hideUI("RewardModel",{ceng : 50});
    },

    hide(data)
    {
        console.log ("hide");
        console.log (data);
    },

    reward(target , data)
    {
        console.log ("第"+data+"天");

    },



    // update (dt) {},
});
