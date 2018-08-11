
// 道具 数据模型   type （1：增加 全部建筑的收益时间， 2: 增加金币）



var propCOnfig ={
                                                                          // 收益增倍   所有秒产 时间内 *倍数
    "P1001" : { type : 1 , propIndex:"P1001" ,name : "加速卡",  propSumTime : 100,  PropGain : 2    },
    "P1002" : { type : 2 , propIndex:"P1002" ,name : "金币红包",  propSumTime : 0 , PropGain : 1 },
  //  "P1003" : { type : 1 , propIndex:"P1003" ,name : "加速卡",  propSumTime : 50 , propGain : 3 },
}


miDB.PropData = {
    TAG : "PropData",

    sumPropNum:2,

    DB : {
        propList : [], 


    },
    //建筑对象数据模型
    createPropModel : function( ){

        var model = new Object();
        model.propIdx = undefined ;//道具索引

      //  道具停留的总时间  
        model.propinitTime = 0; // 道具 初始化时间
        model.getcfg =function (propIdx)
        {
          this.getcfg ( propIdx);
        }

        return model;
    },

    getcfg : function (  propIndex )
    {

        if (this.DB.propList[propIndex])
        {
            return  propCOnfig [propIndex];

        }
    },
 

    init : function () {

         // 增加一个道具
         tywx.NotificationCenter.listen(miDB.EVENT.ADD_PROP_DATA ,this.addPropData,this);
        //  时间到了 删除
         tywx.NotificationCenter.listen(miDB.EVENT.REMOVE_PROP_DATA,this.removePropData,this);

        // 领取后 删除
         tywx.NotificationCenter.listen(miDB.EVENT.REMOVE_HAND_PROP_DATA,this.removeHandPropData,this);

    },

    updateProptime ()
    {

    },




    // 增加一个建筑物
    addPropData : function(propIdx){

        //   界面显示最多  ，增加到三个红包 
        if (this.DB.propList.length >this.sumPropNum)
        {
            return ;
        }

        if(propIdx){
            var isExist = false;
            for(var i=0;i<this.DB.propList.length;i++){


                var propData = this.DB.propList[i];
                if(propData.propIdx === propIdx){
                    isExist = true;
                }
            }
            if(!isExist){
                // 创建了一个道具
                var oneProp = new this.createPropModel();
                oneBuilding.propIdx = propIdx; //建筑索引

                this.DB.propList.push(oneBuilding);

                // //修改GameDate数据
                // tywx.NotificationCenter.trigger(miDB.EVENT.COST_GAME_CORN,{cost : cfg.initPrice});
              
                // //刷新主界面
                // tywx.NotificationCenter.trigger(miDB.EVENT.ADD_BUILDING_DATA,oneBuilding);

                //   // 修改当前页面属性面板 数据
                //   //console.log (this.page);
                //   tywx.NotificationCenter.trigger(miDB.EVENT.UPDATE_BUILDING_DATA_OUTPUT, this.page);
            }else{
                tywx.LOGE("道具以及增加了");
            }
        }
    },

     // 点击领取 
    removeHandPropData : function(propIdx){
        if(propIdx){
 
            for(var i=0;i<this.DB.propList.length;i++){
                if(this.DB.propList[i] && (this.DB.propList[i].propIdx === propIdx)){
                    this.DB.propIdx[i] = undefined;
                    this.DB.propIdx.splice(i,1);
                    
                    //tywx.NotificationCenter.trigger(miDB.EVENT.REMOVE_BUILDING_DATA,{buildingIdx : buildingIdx ,idx : idx});
                    break;
                }
            }
            // // 修改当前页面属性面板 数据
            // tywx.NotificationCenter.trigger(miDB.EVENT.UPDATE_BUILDING_DATA_OUTPUT, this.page);
        }
    },

     


       // 时间 到了道具 消失 
       removePropData : function(propIdx){
        if(propIdx){
 
            for(var i=0;i<this.DB.propList.length;i++){
                if(this.DB.propList[i] && (this.DB.propList[i].propIdx === propIdx)){
                    this.DB.propIdx[i] = undefined;
                    this.DB.propIdx.splice(i,1);
                    
                    //tywx.NotificationCenter.trigger(miDB.EVENT.REMOVE_BUILDING_DATA,{buildingIdx : buildingIdx ,idx : idx});
                    break;
                }
            }
            // // 修改当前页面属性面板 数据
            // tywx.NotificationCenter.trigger(miDB.EVENT.UPDATE_BUILDING_DATA_OUTPUT, this.page);
        }
    },



    cleanGameData : function(){

        this.DB.propList= [];
    },  









};
