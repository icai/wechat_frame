
cc.Class({
    extends: cc.Component,

    properties: {
        uiType : 2,
        uiName : "BuildingsModel",
        BuildingsModelItem : cc.Prefab,
        content : cc.Node,
        scrollView : cc.ScrollView,
    },

    onLoad () {
        mi.BM = this.node.getComponent("BuildingsManager");
        this.offset =0;
    },

    start () {


        this.seatIdxArray=[];

        for (var i =0; i<10 ;i++)
        {
            var node = cc.instantiate (this.BuildingsModelItem);
            node.parent = this.content;
            this.buttonBind(node.getChildByName("addBuildBtn").getComponent(cc.Button), i+1);
            this.seatIdxArray.push(node);
        }
       // console.log (mi.BM);
       miDB.GameData.setItemByName("corn",500000000000000000000000000000000000000);
        miDB.GameData.setItemByName("diamond",10);
      // console.log (miDB.GameData);

        //  for(var i=0;i<9;i++){
            
        //    mi.BM.addBuilding("R100"+(i+1));
        //  }



        this.scrollView.enabled=false;
    


    },


    // 向右切屏 刷行 数据
    
    right : function()
    {
        console.log ("right");
        this.scrollView.enabled=true;
        //this.scrollView. scrollBy(cc.v2(10, 0), 0);


        console.log (this.offset);
       if ( this.offset >=0 && this.offset<2)
        {
            this.offset++;
            tywx.NotificationCenter.trigger(miDB.EVENT.UPDATE_BUILDING_DATA_OUTPUT,  this.offset+1);
            this.scrollView.scrollToOffset(cc.p(750*this.offset, 0), 0);
        }
        this.scrollView.enabled=false;
      // this.scrollView. scrollToPercentHorizontal(0.33,0);
    },

    left : function()
    {
        console.log ("right");
        this.scrollView.enabled=true;
        //this.scrollView. scrollBy(cc.v2(10, 0), 0);


       if ( this.offset >0 && this.offset<3)
        {
            this.offset--;
           
            tywx.NotificationCenter.trigger(miDB.EVENT.UPDATE_BUILDING_DATA_OUTPUT,  this.offset+1);
            this.scrollView.scrollToOffset(cc.p(750*this.offset, 0), 0);
        }
        this.scrollView.enabled=false;
      // this.scrollView. scrollToPercentHorizontal(0.33,0);
    },
    


    buttonBind : function( button ,customEventData)
    {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler . target = this.node
        clickEventHandler.component = "BuildingsModel";
        clickEventHandler.customEventData = customEventData;
        if ( button.node.name == "addBuildBtn" ){
            clickEventHandler.handler = "buildModelBySeatBtnCallback";
        }
      
        button.clickEvents.push(clickEventHandler);
    },


    buildModelBySeatBtnCallback : function(event, customEventData){

        // var miDB.BuildingData.DB.buildingList
        var seatIdx = customEventData;
        mi.BM.addBuilding("R100"+seatIdx);
        tywx.LOGD("建筑位子 = "+seatIdx);
    },

    update: function (dt) {
    },

});
