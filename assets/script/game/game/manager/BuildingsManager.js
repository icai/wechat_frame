cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        tywx.NotificationCenter.listen(miDB.EVENT.REMOVE_BUILDING_DATA,this._removeBuildingShape,this);   // 移除
        tywx.NotificationCenter.listen(miDB.EVENT.UPDATE_BUILDING_DATA,this._updateBuildingShape,this);  //   升级


        tywx.NotificationCenter.listen(miDB.EVENT.ADD_BUILDING_DATA,this._addBuildingShape,this);    // 添加
        tywx.NotificationCenter.listen(miDB.EVENT.REFRESH_BUILDINGS,this._reFreshBuidingShape,this); 
    },

    start : function(){
        this.BuildShapeList = []
    },

    onDestroy :function(){
        tywx.NotificationCenter.ignore(miDB.EVENT.REMOVE_BUILDING_DATA,this._removeBuildingShape,this);
        tywx.NotificationCenter.ignore(miDB.EVENT.UPDATE_BUILDING_DATA,this._updateBuildingShape,this);
        tywx.NotificationCenter.ignore(miDB.EVENT.ADD_BUILDING_DATA,this._addBuildingShape,this);
        tywx.NotificationCenter.ignore(miDB.EVENT.REFRESH_BUILDINGS,this._reFreshBuidingShape,this);
    },

    addBuilding : function(idx,data){
        // 增加建筑，先创建数据
        miDB.BuildingData.addBuildingData(idx)
    },

    removeBuilding : function(idx,data){
        tywx.LOGD("移除建筑 idx = ",idx)
        // 移除建筑，先创建数据
        miDB.BuildingData.removeBuildingData(idx)
    },
    updateBuilding : function(idx,data,addLevel){
        tywx.LOGD("升级建筑 idx = ",idx)
        // 升级建筑，先创建数据
        miDB.BuildingData.updateBuildingData(idx,data,addLevel)
    },
    gainCornByBuildingIdx : function(idx){
        // 增加建筑，先创建数据
        miDB.BuildingData.gainCornByBuildingIdx(idx)
    },


    _reFreshBuidingShape : function(data){
        
       // console.log ("刷新建筑形态");
        var params = data;

    
 
        // for(var i=0;i<buildingList.length;i++){
            
        //     var params = buildingList[i]
            this._updateBuildingShape(params)
       // }
    },

    
    //绘制建筑形状
    _addBuildingShape : function(params){
        var that = this;
        //params 建筑物对象
        var cfgInfo = params.getCfgInfo();
        tywx.LOGD("绘制建筑形状 = ",cfgInfo.name);

        var uiName = cfgInfo.buildShapeName;
        if (uiName =="R1008" ||uiName =="R1009")
        {
            uiName = "R1007";
        }
        var seatIdx = cfgInfo.seatPos;
        miTools.Utils.loadPrefab("model/gameModel/shapeModel/"+uiName,function(model){
            if(model != undefined){
                // var buildset = cc.find("list/buil"+(seatIdx+1),that.node);
                var buildset = that.node.getComponent("BuildingsModel").seatIdxArray[seatIdx];
                //设置层级
                model.getComponent("OneBulidingModel").setIndx(cfgInfo.idx);
                // model.getComponent("OneBulidingModel").setMenuModel(model)
                model.getComponent("OneBulidingModel").reFreshUI(params);
               
                // model.tag = cfgInfo.idx
                that.BuildShapeList.push(model);
                model.getChildByTag(cfgInfo.seatPos);
                buildset.addChild(model);
                model.position.y = model.getContentSize().height/2;
                model.active = true;
            }else{
                tywx.LOGD("加载错误 model = ",uiName);
            }
        })
    },

    //升级建筑形状
    _updateBuildingShape : function(params){
        
        // console.log (params);
        var buildingIdx = params.buildingIdx
        // tywx.LOGD("升级建筑形状！ " ,buildingIdx)
        // var buildset = cc.find("buildGround/buildset"+(idx+1),this.node)
        
        // var model = buildset.getChildren[0]
// 
        for(var i=0;i<this.BuildShapeList.length;i++){
            var model = this.BuildShapeList[i].getComponent("OneBulidingModel")
            
            if(model.index == buildingIdx){
                // tywx.LOGD("model.index -->>= "+model.index)
                model.reFreshUI(params)
                // this.BuildShapeList[i].removeFromParent(true)
                // this.BuildShapeList.splice(i,1)
                break
            }
        }
    },

    //移除建筑形状
    _removeBuildingShape : function(params){
        
        console.log ("移除建筑形状");
        var idx = params.idx
        var buildingIdx = params.buildingIdx
        // tywx.LOGD("移除建筑形状！ "+(idx+1))
        // tywx.LOGD("建筑形状数组大小！ "+this.BuildShapeList.length)
        for(var i=0;i<this.BuildShapeList.length;i++){
            var model = this.BuildShapeList[i].getComponent("OneBulidingModel")
            // tywx.LOGD("model.index = "+model.index)
            if(model.index == buildingIdx){
                this.BuildShapeList[i].removeFromParent(true)
                this.BuildShapeList.splice(i,1)
                break
            }
        }
    }
});
