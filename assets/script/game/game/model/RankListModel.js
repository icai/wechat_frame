
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        uiType : 2,
        uiName : "RankListModel",
        itemPrefab:cc.Prefab,
        content:cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    // var btArray = this.node.getComponentsInChildren(cc.Button);


    // for(var i=0;i<btArray.length; i++)
    // {

    //     this.buttonBind(btArray[i]);
    // }


   

    },
    // buttonBind:function( button)
    // {
    //     var clickEventHandler = new cc.Component.EventHandler();
    //     clickEventHandler . target = this.node
    //     clickEventHandler.component = "RankListModel";
    //     if ( button.node.name == "bt_rich" ){
           
    //         clickEventHandler.handler = "rich";
    //     }
    //     else if ( button.node.name == "bt_friend" ){
        
    //         clickEventHandler.handler = "friend";
    //     }
    //     else if (button.node.name =="bt_close"){
         
    //         clickEventHandler.handler = "close";
    //     }
    //     button.clickEvents.push(clickEventHandler);
    // },

    close()
    {
        console.log ("close");
       mi.UIManager.hideUI("RankListModel",{ceng : 50});
    },
    friend()
    {
        console.log ("friend");

    },
    rich()
    {
        console.log ("rich");

    },

    hide(data)
    {
        console.log ("hide");
        this.content.removeAllChildren();
       
    },
    show(data)
    {
        
        this.node.getChildByName("list").getComponent(cc.ScrollView).scrollToTop(0.1);
        this.content.height= 60*50;
        for(var i=0;i<50;i++)
        {
            var item = cc.instantiate(this.itemPrefab);
            this.content.addChild(item);
            this.updateLabel(item.getChildByName("New Label"),"label"+i);
        }

  
    },
    updateLabel(target,data)
    {
        target.getComponent(cc.Label).string=data;
        

    },

    // update (dt) {},
});
