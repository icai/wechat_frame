

cc.Class({
    extends: cc.Component,

    properties: {
        takeUpTime : 5,  
        uiType : 2,
        uiName : "TouchButtonModel",
  
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {

        this.bIsMotion= true;
     },

    start () {

         this.actionNode =null;
         this. originPos = cc.p(0,0);
        
        this.node.on('touchstart', function () {
        
            this.unscheduleAllCallbacks();
            this.appearAction();
            // 出现
      
        }, this);

        this.node.on('touchend', function () {

            this.scheduleOnce(function() {
                this.takeUpAction();
            }, this.takeUpTime);
        }, this);
        this.node.on('touchcancel', function () {

            this.scheduleOnce(function() {
                this.takeUpAction();
            }, this.takeUpTime);
        }, this);
        this.scheduleOnce(function() {
            this.takeUpAction();
        }, this.takeUpTime);
    },
    // 出现动画
    appearAction : function()
    {

        if ( this.bIsMotion  )
        {
           return ;
        }
        this.bIsMotion=true;
        this.actionNode.stopAllActions();
        var mv = cc.moveTo(0.5, this.originPos);
        this.actionNode.runAction(mv);

    },

    //  收起动画
    takeUpAction ()
    {

        console.log ("动画收起"+this.bIsMotion);

        if ( this.bIsMotion == false )
        {
           return ;
        }
        this.bIsMotion =false;
        var mv = cc.moveBy(0.5, 100, 0);
        this.actionNode.runAction(mv);


    },

    update (dt) {
       if (      this.actionNode == null  ) 
       {
        this.actionNode  =  cc.find ( "GameUE/right",this.node.parent);
        if ( this.actionNode )
        {
            this. originPos= cc.p(this.actionNode.x, this.bIsMotion.y);
        }

       }



    },
});
