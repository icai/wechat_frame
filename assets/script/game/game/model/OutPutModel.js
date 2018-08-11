

cc.Class({
    extends: cc.Component,

    properties: {
    
        uiType : 2,
        uiName : "OutPutModel",
        outPutItem : cc.Prefab,
    },


    // onLoad () {},

    start :　function() {

        let parentNode =this.node.getChildByName("list");

        this.modelItemList =[];

        for(var i=0; i<3; i++)
        {
            var node = cc.instantiate(this.outPutItem);
            node.parent =parentNode;
            node.usData =i;
            this.buttonBind(node.getChildByName("itemSp").getComponent(cc.Button) );
            this.modelItemList.push (node);

        }
         tywx.NotificationCenter.listen(miDB.EVENT.REFRESH_BUILDINGS_OUTPUT,this.updateBuildArritude,this);  


        
    },
    
    hideItem :function ()
    {
        for (var i =0 ;i<  this.modelItemList.length ;i++ )
        {
            this.modelItemList[i].active =false;

        }

    },
    updateModelItem : function ( data,index)
    {
        if (this.modelItemList [index])
        {
            this.modelItemList [index].active =true;
            this.updateLabel ( this.modelItemList [index].getChildByName("itemName"),data.name);
            this.updateLabel ( this.modelItemList [index].getChildByName("itemOutput"),data.monentProduct+"/秒");

        }

    },
    updateLabel(target ,data)
    {
        target.getComponent(cc.Label).string =data ;

    },


    updateBuildArritude ( data)
    {

        this .hideItem ();
        var page =data.page;
        for (var i=0; i< data.currentPage.length ;i++)
        {
            var  info =data.currentPage[i].getCfgInfo();
            var seatPos= info.seatPos-(page-1)*3;
            this.updateModelItem(info,seatPos);
    
        }

    },



    show : function(data)
    {
   

    },
    itemSpBtnCallback : function(event , data)
    {
        var node = event.target;
        console.log (node.parent.usData);
    },
    buttonBind : function( button)
    {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler . target = this.node
        clickEventHandler.component = "OutPutModel";
        if ( button.node.name == "itemSp" ){
           
            clickEventHandler.handler = "itemSpBtnCallback";
        }
      
        button.clickEvents.push(clickEventHandler);
    },
    hide : function(data)
    {
        console.log ("hide");
        console.log (data);
        let parentNode =this.node.getChildByName("list");
        parentNode.removeAllChildren();
    },

    
    upBuildBtnCallback : function()
    {
        console.log ("升级建筑");

    },
    reformBuildCallback : function()
    {
        console.log ("改善建筑");

    },

   close : function()
    {
        console.log ("close");
       mi.UIManager.hideUI("OutPutModel",{ceng : 50});
    },






    // update (dt) {},
});
