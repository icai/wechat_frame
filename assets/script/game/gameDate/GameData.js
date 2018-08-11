
miDB.GameData = {
    TAG : "GameData",
    DB : {
        corn : 50, //金币
        diamond : 0, //钻石
    },

    init : function () {
        
        var time = new Date().getDate();
        
        if(this.DB.shareTime != time){
            //隔天清零
        }
        tywx.NotificationCenter.listen(miDB.EVENT.GAIN_CORN_DATA,this._gainCornCallback,this);
        tywx.NotificationCenter.listen(miDB.EVENT.COST_GAME_CORN,this._costCornCallback,this);
    },
    //获得金币
    _gainCornCallback : function(params){
        var storageCorn = params.storageCorn || 0
        this.setItemByName("corn",this.DB.corn + storageCorn)
    },

    _costCornCallback : function(params){
        var cost = params.cost || 0
        this.setItemByName("corn",this.DB.corn - cost)
    },
    getDataBase : function(){
        return this.DB
    },
    
    getItemByName : function(keyStr){
        return this.DB[keyStr];

    },

    setItemByName : function(keyStr,valueStr){
        this.DB[keyStr] = valueStr;
        // this.setItemByLocalStorage(keyStr,valueStr)
        tywx.NotificationCenter.trigger(miDB.EVENT.CHANGE_GAME_DATA,this.DB);
    },

    getItemByLocalStorage : function(keyStr,defaultValue){
        var value = tywx.Util.getItemFromLocalStorage(keyStr, defaultValue);
        ////cc.log("value "+ value)
        if(value && value != undefined && value != "nan"){
            return value;
        }
        return undefined;
    },

    setItemByLocalStorage : function(keyStr,ValueStr){
        tywx.Util.setItemToLocalStorage(keyStr, ValueStr);
    },

    cleanGameData : function(){
       this.DB.corn = 0;
       this.DB.diamond = 0;
    },
    destory : function(){
        tywx.NotificationCenter.ignore(miDB.EVENT.COST_GAME_CORN,this.costCornCallback,this);
    }
};
