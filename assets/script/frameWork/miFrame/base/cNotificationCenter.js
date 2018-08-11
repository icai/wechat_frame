//全局的事件监听模块，可用于对象之间的消息传递，所以没有提供构造函数
miFrame.NotificationCenter = {
    listen : function(eName, handler, scope){
        tywx.NotificationCenter.listen(eName, handler, scope)
    },

    ignore : function(eName, handler, scope){
        return tywx.NotificationCenter.ignore(eName, handler, scope)
    },

    ignoreScope : function (scope) {
        return tywx.NotificationCenter.ignoreScope(scope)
    },
    trigger : function(eventName, params){
        tywx.NotificationCenter.trigger(eventName, params)
    },

    triggerScope : function(eventName, params,scope){
        tywx.NotificationCenter.triggerScope(eventName, params,scope)
    }
};