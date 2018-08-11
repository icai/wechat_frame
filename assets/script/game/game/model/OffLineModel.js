
cc.Class({
    extends: cc.Component,

    properties: {

        uiType : 2,
        uiName : "OffLineModel",
        offLineItem : cc.Prefab,
        


    },





    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

        

    },
    closeBtnCallback : function(){
        console.log ("close");
       mi.UIManager.hideUI("OffLineModel",{ceng : 50});

    },
    
    lookScreenBtnCallback : function()
    {
        console.log ("观看视屏");

    },
    shareBtnCallback : function()
    {
        console.log (" 分享");

    },
    
    show : function(data)
    {
        let parentNode =this.node.getChildByName("list");

        for(var i=0; i<7; i++)
        {
            var node = cc.instantiate(this.offLineItem);
            node.parent =parentNode;
            node.usData =i;
            this.buttonBind(node.getChildByName("itemSp").getComponent(cc.Button) );


        }

    },
    itemSpBtnCallback(event , data)
    {
        var node = event.target;
        console.log (node.parent.usData);
    },

    buttonBind : function( button)
    {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler . target = this.node
        clickEventHandler.component = "OffLineModel";
        if ( button.node.name == "itemSp" ){
           
            clickEventHandler.handler = "itemSpBtnCallback";
        }
      
        button.clickEvents.push(clickEventHandler);
    },

    close : function()
    {
        console.log ("close");
       mi.UIManager.hideUI("InviModel",{ceng : 50});
    },

    hide : function(data)
    {
        console.log ("hide");
        console.log (data);
        let parentNode =this.node.getChildByName("list");
        parentNode.removeAllChildren();
    },

    

    // update (dt) {},
});
