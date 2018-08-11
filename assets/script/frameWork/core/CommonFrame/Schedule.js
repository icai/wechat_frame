/**
 * 对scheduler进行封装
 */
miTime = {}
miTime.Schedule = {
    events : {},
    /**
     * 开启定时器
     */
	startUpdate:function(){
      
        var scheduler = cc.director.getScheduler();
        // 直接屏蔽paused
        var paused = false;
        scheduler.scheduleUpdate(this,0,paused,this.update);
	},

    update : function(dt){
        var keys = Object.keys(this.events)
        for(var i=0;keys.length;i++){

            // tywx.LOGD("keys[i]  -->> "+keys[i])
            // var event = this.events[keys[i]];
            
            // // 用call直接把各个参数回调出去
            // event.handler()
        }
    },
    /**
     * 取消定时器
     */
	stopUpdate : function(){
		// 这个类在jsb_cocos2dx_auto_api.js中可以找到
        var scheduler = cc.director.getScheduler();
		scheduler.unschedule(this.callback, this);
	},
    
    listen : function(eName, handler, scope){
        this.events[eName] = this.events[eName] || [];
        if(scope ){
            tywx.LOGD("scope --<< ")
        }else{
            tywx.LOGD("scope -->> ")
        }

        this.events[eName].push({
            scope: scope || this,
            handler: handler
        });
    },

    ignore : function(eName, handler, scope){
        scope = scope || this;
        var fns = this.events[eName];

        if(!fns) 
            return;
        this.events[eName] = fns.filter(function(fn){
            return fn.scope!=scope || fn.handler!=handler
        });
    },

};
