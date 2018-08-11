
cc.Class({
    extends: cc.Component,

    properties: {

        uiType : 2,
        uiName : "HumanModel",
        richestMan : cc.Node
    },

    onLoad: function () {
        
    },

    start : function () {

        var humanSet = cc.find("humanSet",this.node)
        this._createRichest(humanSet)

    },

    _createRichest : function(buildset){
        var that = this
        var uiName = "RichestModel"
        miTools.Utils.loadPrefab("model/gameModel/shapeModel/"+uiName,function(model){
            if(model != undefined){
                //设置层级
                buildset.addChild(model)
                model.active = true;
                that.richestMan = model
                that._runGameAI()
            }else{
                tywx.LOGD("加载错误 model = ",uiName)
            }
        })
    },

    _runGameAI : function(){
        var moveTo1 = cc.moveTo(1.5,-500,0)
        var moveTo2 = cc.moveTo(3,500,0)
        this.richestMan.runAction(cc.sequence(
            cc.callFunc(function () {
                // tywx.LOGD("开始")
            }), 
            moveTo1,
            moveTo2,
            cc.callFunc(function () {
                // tywx.LOGD("结束")
            })
        ).repeatForever());
    },
    update: function (dt) {

    },

});
