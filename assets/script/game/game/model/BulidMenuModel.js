
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        this.rootNode = undefined
    },
    setOwner : function(node){
        this.rootNode = node
    },
    start : function () {
    },


    reFreshUI :function(buildData){
        cc.find("levelLabel",this.node).getComponent(cc.Label).string = "Lv"+buildData.level;
        cc.find("priceLabel",this.node).getComponent(cc.Label).string = "" + buildData.buildPrice;
        cc.find("timeProductLabel",this.node).getComponent(cc.Label).string = buildData.onceProductCorn+"/秒";
        cc.find("storeCornLabel",this.node).getComponent(cc.Label).string = "" + buildData.storageCorn;
        cc.find("gainLabel",this.node).getComponent(cc.Label).string = "增益+" + buildData.gain;
 
    },

    update: function (dt) {
    },

    removeBuildBtnCallback :function(){
        this.node.parent.getComponent("OneBulidingModel").removeBuildBtnCallback()
    },
    updateBuildingBtnCallback : function(){
        this.node.parent.getComponent("OneBulidingModel").updateBuildingBtnCallback({},1)
    },
    gainBuildingBtnCallback : function(){
        this.node.parent.getComponent("OneBulidingModel").gainCornByBuildingIdx()
    },
});
