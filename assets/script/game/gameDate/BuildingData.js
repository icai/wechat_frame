

miDB.BuildingData = {
    TAG : "BuildingData",
    page:1,  //  1-3 页面； // 这个页面需要 三个 数据 
    DB : {
        buildingList : [], 
        //friendsBuildingList : []

    },

    
// 秒产 增益   
 


    
    //建筑对象数据模型
    createBuildingModel : function(){
        var model = new Object();
        model.buildingIdx = undefined ;//建筑索引
        // model.buildingName = "美其名" //建筑名称
        model.onceProductCorn = 0 ;// 秒产金额
        model.buildPrice = 0; // 当前升级建筑
        model.storageCorn = 0 ;// 存储金额
        model.replyMaxTime = 0; // 总回复时间
        model.replyLastTime = 0 ;// 剩余回复时间
        model.level = 1;  //建筑等级
        model.gain=0; // 建筑增益；

        // 获取静态数据
        model.getCfgInfo = function(){
            
            return miDB.BuildingData.getCfgInfo(this.buildingIdx);
        }
        //获得属性值
        model.getPropertyByKey = function(keyName){
            if(this[keyName]){
                return this[keyName];
            }
            return undefined;
        },
        //修改属性值
        model.setPropertyByKey = function(keyName,value){
            if(this[keyName]){
                this[keyName] = value;
            }else{
                tywx.LOGD("修改属性值不存在  keyName= ",keyName);
            }
        },
        model.changeLevel  = function(level){
            this.level = level;

            tywx.LOGD("this.getCfgInfo() = ",JSON.stringify(this.getCfgInfo()));
            this.buildPrice = Math.floor(this.getCfgInfo().initPrice + this.getCfgInfo().basePrice * Math.pow(1.08,this.level-1));  //成长参数
            this.onceProductCorn = Math.floor(this.getCfgInfo().monentProduct * this.level);
        },

        model.changeStorge = function(time){
            
            this.storageCorn += time * this.onceProductCorn;

        },


        model.gainCorn = function(){
            tywx.NotificationCenter.trigger(miDB.EVENT.GAIN_CORN_DATA,{storageCorn : this.storageCorn});
            this.storageCorn = 0;

            //刷新界面
            var isExist = undefined
            for(var i=0;i< miDB.BuildingData.DB.buildingList.length;i++){
                var buildingData = miDB.BuildingData.DB.buildingList[i];
                if(buildingData && (buildingData.buildingIdx === this.buildingIdx)){
                    isExist = i;
                }
            }
            if(isExist != undefined){
                console.log (" model.gainCorn");
                tywx.NotificationCenter.trigger(miDB.EVENT.UPDATE_BUILDING_DATA,miDB.BuildingData.DB.buildingList[isExist]);
            }
            
        }
        return model;
    },

    getCfgInfo : function(buildingIdx){
        if(buildingIdx != undefined && miCfg.Building[buildingIdx] != undefined){
            return miCfg.Building[buildingIdx];
        }
        return undefined;
    },

    addGain(data)
    {


        var seatPos=data.getCfgInfo().seatPos;
        if (seatPos ==3|| seatPos ==4 || seatPos ==5)
        {
            var buildIndex1="R100"+(seatPos-2);
            console.log (buildIndex1);

            for (var i=0;i<this.DB.buildingList.length;i++){
                if (this.DB.buildingList[i].buildingIdx ==buildIndex1)
                {
                    this.DB.buildingList[i].gain +=30;
                    break;
                }
            }

        }


    },

    init : function () {
        // tywx.Timer.setTimer (this, function(dt){
        //     console.log (dt);
        // } ,3,1,1 );
        // tywx.Timer.setUpdateTimer(this);

        tywx.NotificationCenter.listen(miDB.EVENT.GAIN_ALL_CORN_DATA,this.gainAllCornCallback,this);
        tywx.NotificationCenter.listen(miDB.EVENT.ACCULARATE_ALL_CORN_DATA,this.acculerateCallback,this);

        // 增加事件页数 改造 ， 升级
        tywx.NotificationCenter.listen(miDB.EVENT.UPDATE_BUILDING_DATA_OUTPUT,this.chagePage,this);

    },
   
    // 改变当前页面
    chagePage : function(page)
    {
        
        
        this.page =page; 
        var currentPage=[];
         var index=3*page;
        for(var i=0;i<this.DB.buildingList.length;i++){
           
        var  seatpos= this.DB.buildingList[i].getCfgInfo().seatPos +1;

   
            if (seatpos>=(index-2) &&seatpos <=index)
            {
                currentPage.push( this.DB.buildingList[i]);
            }
            
        }
  
        

     // 刷新 改造页面  
    tywx.NotificationCenter.trigger(miDB.EVENT.REFRESH_BUILDINGS_OUTPUT,{ currentPage : currentPage ,page : this.page});




    },


    //秒产
    update :function(dt){

        if(this.time == undefined){
            this.time = 0;
        }
        this.time += dt;
        
        if(Math.round(this.time*100) >= 100){
            this.time = 0;
            for (var i=0;i<this.DB.buildingList.length;i++){
                this.DB.buildingList[i].storageCorn = this.DB.buildingList[i].storageCorn + this.DB.buildingList[i].onceProductCorn +this.DB.buildingList[i].gain ;

                // tywx.NotificationCenter.trigger(miDB.EVENT.UPDATE_BUILDING_DATA,miDB.BuildingData.DB.buildingList[i]);

                tywx.NotificationCenter.trigger(miDB.EVENT.REFRESH_BUILDINGS,miDB.BuildingData.DB.buildingList[i]);

                
            }
        }
    },

    acculerateCallback : function(params){

        var time = params.time
        for(var i=0;i<this.DB.buildingList.length;i++){
            var buildingData = this.DB.buildingList[i]
            buildingData.changeStorge(time)
        }
        tywx.NotificationCenter.trigger(miDB.EVENT.REFRESH_BUILDINGS,{buildingList : this.DB.buildingList});
        
    },

    gainAllCornCallback : function(){
        console.log ("gainAllCornCallback");
        tywx.LOGD("收取所有金币")
        for(var i=0;i<this.DB.buildingList.length;i++){
            var buildingData = this.DB.buildingList[i]
            buildingData.gainCorn()
        }
    },

    gainCornByBuildingIdx : function(buildingIdx){
        for(var i=0;i<this.DB.buildingList.length;i++){
            var buildingData = this.DB.buildingList[i]
            if(buildingData && (buildingData.buildingIdx === buildingIdx)){
                buildingData.gainCorn()
            }
        }
    },
    // 增加一个建筑物
    addBuildingData : function(buildingIdx,buildData){
        if(buildingIdx){
            var isExist = false
            for(var i=0;i<this.DB.buildingList.length;i++){
                var buildingData = this.DB.buildingList[i];
                if(buildingData && (buildingData.buildingIdx === buildingIdx)){
                    isExist = true;
                }
            }
            if(!isExist){

                var corn = miDB.GameData.getItemByName("corn");
                var cfg = this.getCfgInfo(buildingIdx);
                if(corn < cfg.initPrice ){
                    tywx.NotificationCenter.trigger(miDB.EVENT.SHOW_COMMENT_TIPS,{title : "提示",content : "金币不足，购买建筑！ "});
                    return 
                }
                var oneBuilding = new this.createBuildingModel();
                //默认为1级
                oneBuilding.buildingIdx = buildingIdx; //建筑索引
         

                oneBuilding.changeLevel(1);
                 
                if(buildData){
                    for (var i=0;i<Object.keys(buildData).length;i++){
                        var keyName = Object.keys(buildData)[i];
                        var value = buildData[keyName];
                        if(oneBuilding[keyName] != undefined){
                            oneBuilding[keyName] = value;
                        }
                    }
                }
                //   增加建筑 收益 
                this.addGain(oneBuilding); 

                this.DB.buildingList.push(oneBuilding);

                //修改GameDate数据
                tywx.NotificationCenter.trigger(miDB.EVENT.COST_GAME_CORN,{cost : cfg.initPrice});
              
                //刷新主界面
                tywx.NotificationCenter.trigger(miDB.EVENT.ADD_BUILDING_DATA,oneBuilding);

                  // 修改当前页面属性面板 数据
                  //console.log (this.page);
                  tywx.NotificationCenter.trigger(miDB.EVENT.UPDATE_BUILDING_DATA_OUTPUT, this.page);
            }else{
                tywx.LOGE("增加的建筑物已存在！");
            }
        }
    },
    //更新数据
    updateBuildingData : function(buildingIdx,buildData,addLevel){
        if(buildingIdx!=undefined){
            var isExist = undefined
            for(var i=0;i<this.DB.buildingList.length;i++){
                var buildingData = this.DB.buildingList[i]
                if(buildingData && (buildingData.buildingIdx === buildingIdx)){
                    isExist = i
                }
            }
            if(isExist != undefined){
                var oneBuilding = this.DB.buildingList[isExist];
                var corn = miDB.GameData.getItemByName("corn");
                if(corn < oneBuilding.buildPrice ){
                    tywx.NotificationCenter.trigger(miDB.EVENT.SHOW_COMMENT_TIPS,{title : "提示",content : "金币不足，无法升级建筑！ "});
                    return 
                }

                if(buildData != undefined){
                    for (var i=0;i<Object.keys(buildData).length;i++){
                        var keyName = Object.keys(buildData)[i]
                        var value = buildData[keyName]
                        if(oneBuilding[keyName] != undefined){
                            oneBuilding[keyName] = value;
                        }
                    }
                }
                var curlevel = this.DB.buildingList[isExist].level + addLevel
                this.DB.buildingList[isExist].changeLevel(curlevel)
                //修改GameDate数据
                tywx.NotificationCenter.trigger(miDB.EVENT.COST_GAME_CORN,{cost : this.DB.buildingList[isExist].buildPrice});
                //TODO 更新前把旧的数据存下来，一起发给UI
                tywx.NotificationCenter.trigger(miDB.EVENT.UPDATE_BUILDING_DATA,this.DB.buildingList[isExist]);

                 // 修改当前页面属性面板 数据
                  tywx.NotificationCenter.trigger(miDB.EVENT.UPDATE_BUILDING_DATA_OUTPUT, this.page);
                
            }else{
                tywx.LOGE("更新的建筑物不存在！")
            }
        }
    },
    // 删除一个建筑物属性
    removeBuildingData : function(buildingIdx){
        if(buildingIdx){
 
            for(var i=0;i<this.DB.buildingList.length;i++){
                if(this.DB.buildingList[i] && (this.DB.buildingList[i].buildingIdx === buildingIdx)){
                    //清理数组对象
                    var idx = this.DB.buildingList[i].getCfgInfo().seatPos
                    this.DB.buildingList[i] = undefined
                    this.DB.buildingList.splice(i,1)
                    
                    tywx.NotificationCenter.trigger(miDB.EVENT.REMOVE_BUILDING_DATA,{buildingIdx : buildingIdx ,idx : idx});
                    break
                }
            }
            // 修改当前页面属性面板 数据
            tywx.NotificationCenter.trigger(miDB.EVENT.UPDATE_BUILDING_DATA_OUTPUT, this.page);
        }
    },

    // 清理内存
    cleanGameData : function(){
        if(this.DB.buildingList.length > 0){
            for(var i=this.DB.buildingList.length-1;i>=0;i++){
                this.DB.buildingList[i] = undefined
                this.DB.buildingList.splice(i)
            }
        }
    },
    getIndexBySeat :function(){


    },

    //----------------------------------
    getDataBase : function(){
        return this.DB
    },
    
    getItemByName : function(keyStr){
        return this.DB[keyStr];
    },

    setItemByName : function(keyStr,valueStr){
        this.DB[keyStr] = valueStr;
        this.setItemByLocalStorage(keyStr,valueStr)
        tywx.NotificationCenter.trigger(miDB.EVENT.BUILDING_DATA,undefined);
    },

    getItemByLocalStorage : function(keyStr,defaultValue){
        var value = tywx.Util.getItemFromLocalStorage(keyStr, defaultValue)
        ////cc.log("value "+ value)
        if(value && value != undefined && value != "nan"){
            return value
        }
        return undefined
    },

    setItemByLocalStorage : function(keyStr,ValueStr){
        tywx.Util.setItemToLocalStorage(keyStr, ValueStr)
    },
    destory : function(){

        tywx.Timer.cancelUpdateTimer(this);
    }
};
