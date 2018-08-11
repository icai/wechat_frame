
cc.Class({
    extends: cc.Component,

    properties: {
        index : -1,
        menuModel : cc.Node,
    },
    
    onLoad: function () {
        var that = this
        // this.index = -1
        // this.menuModel = undefined
        if(mi.isDebug){
            var uiName = "BuildMenuModel"
            miTools.Utils.loadPrefab("model/gameModel/shapeModel/"+uiName,function(model){
                if(model != undefined){
                    // model.getComponent("BulidMenuModel").setOwner(that.node)
                    //设置层级
                    that.node.addChild(model)
                    model.active = true;
                    that.menuModel = model
                }else{
                    tywx.LOGD("加载错误 model = ",uiName)
                }
            })
        }
    },
    setIndx : function(idx){
        this.index = idx
    },

    start : function () {
    },

    update: function (dt) {
    },

    reFreshUI : function(buildData){
        // tywx.LOGD("reFreshUI = ",this.menuModel)
        if(this.menuModel != undefined){
            this.menuModel.getComponent("BulidMenuModel").reFreshUI(buildData)
        }
        cc.find("namelabel",this.node).getComponent(cc.Label).string = buildData.getCfgInfo().name;
    },

    removeBuildBtnCallback :function(){
        // tywx.LOGD("removeBuildBtnCallback =   =  "+ this.index)
        mi.BM.removeBuilding(this.index)
    },
    updateBuildingBtnCallback : function(data,addLevel){
        // tywx.LOGD("updateBuildingBtnCallback =   =  "+ idx)
        mi.BM.updateBuilding(this.index,data,addLevel)
    },

    gainCornByBuildingIdx : function(){
        mi.BM.gainCornByBuildingIdx(this.index)
    }
    
});
