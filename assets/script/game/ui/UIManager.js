mi = {}
mi.UIManager = {

    TAG : "UIManager",
    rootNode : cc.Node,  //当前画布
    UIenum : {                 //画布上UI类型
        canvs : 1,
        layer : 2,
        alter : 3
    },
    UIStack : [],               //存储UI队列
  
    getCurrentCanvas : function () {
        //TODO 多个scene切换的时候需要实现当前画布的切换
        let Canvas = this.rootNode || cc.find("Canvas");
        return Canvas;
    },

    setCurrentCanvas : function (rootNode) {
        //TODO 多个scene切换的时候需要实现当前画布的切换
        this.rootNode = rootNode
    },
    findNodeByName : function(nodeName,targe){
        //cc.log("Canvas/"+targe.uiName+ "/"+nodeName);
        let UINode = cc.find("Canvas/"+targe.uiName+ "/"+nodeName);
        if(UINode){
            return UINode
        }
        return undefined
    },
    // TODO 每个类型的界面都是单例，一个prefab如果需要同时加载多个的时候需要扩展开发
    showUI :function(uiName,params){
        var that = this
        var modelType = "uiModel"
        var modelCeng = 0
        if(params && params["modelType"]){
            modelType = params["modelType"]
        }
        if(params && params["ceng"]){
            modelCeng = params["ceng"]
        }
        let UILayer = cc.find("Canvas/"+uiName);
        if(UILayer && UILayer!=undefined) {
            UILayer.setPosition(cc.p(0, 0));
            if(UILayer.getComponent(uiName).show){
                UILayer.getComponent(uiName).show(params)
            }
        
            UILayer.active = true;
            this.pushCurrentUI(UILayer)
            //播放动画
            that._showAni(UILayer,uiName)
        }else{
            
            
            miTools.Utils.loadPrefab("model/"+modelType+"/"+uiName,function(UILayer){
                UILayer.setPosition(cc.p(0, 0));
                if(UILayer.getComponent(uiName).show){
                    UILayer.getComponent(uiName).show(params)
                }
                if(UILayer != undefined){
                    var tag = UILayer.getComponent(uiName).uiType || 1;
                    //设置层级
                    UILayer.setLocalZOrder(tag * 1000 + modelCeng);
                    that.getCurrentCanvas().addChild(UILayer);
                    UILayer.active = true;
                    that.pushCurrentUI(UILayer);
                    //播放动画
                    that._showAni(UILayer,uiName);
                }
            })
        }
    }, 

    _showAni : function(uiLayer,uiName){
        uiLayer.active = false;
        if(uiLayer){
            var tag = uiLayer.getComponent(uiName).uiType
           if( tag === this.UIenum.canvs){
                uiLayer.active = true;
           }else if(tag === this.UIenum.layer){
                uiLayer.active = true;
           }else if(tag === this.UIenum.alter){
                uiLayer.stopAllActions()
                uiLayer.scale = 0.8
                uiLayer.active = true;

                // var scale1 = cc.scaleTo(0.2,0.8)
                var scale2 = cc.scaleTo(0.2,1.15)
                var scale3 = cc.scaleTo(0.05,1)
                
                uiLayer.runAction(cc.sequence(scale2,scale3,
                    cc.callFunc(function () {
                        console.log("调用成功！")
                        
                    })
                ));
           }
        } 
    },
    hideUI : function (uiName,params) {

        let UILayer = cc.find("Canvas/"+uiName);
    
        if(UILayer && UILayer!=undefined){

            if(UILayer.getComponent(uiName).hide){
                UILayer.getComponent(uiName).hide(params)
            }

            
            UILayer.active = false ;
            this.popCurrentUI()
            this._hideAni(UILayer,uiName)
        }else{
            console.log('UILayer not exist'+uiName)
        }
    },


    _hideAni : function(uiLayer,uiName){
        
        if(uiLayer){
            uiLayer.active = true;
            var tag = uiLayer.getComponent(uiName).uiType
           if( tag === this.UIenum.canvs){
                uiLayer.setPosition(cc.p(1500,0));
                uiLayer.active = false;
           }else if(tag === this.UIenum.layer){
                uiLayer.setPosition(cc.p(1500,0));
                uiLayer.active = false;
           }else if(tag === this.UIenum.alter){
                uiLayer.stopAllActions()
                uiLayer.scale = 1
                var scale2 = cc.scaleTo(0.05,1.15)
                var scale3 = cc.scaleTo(0.2,0.3)
                
                uiLayer.runAction(cc.sequence(scale2,scale3,
                    cc.callFunc(function () {
                        console.log("关闭调用成功！")
                        uiLayer.setPosition(cc.p(1500,0));
                        uiLayer.active = false;
                    })
                ));
           }
        } 
    },
    getCurrentUI : function () {
        if(this.UIStack.length> 0){
            return this.UIStack[this.UIStack.length-1];
        }
        return undefined;
    },

    pushCurrentUI : function (UILayer) {
        if(UILayer){
            this.UIStack.push(UILayer);
        }
    },
    popCurrentUI : function () {
        if(this.UIStack.length > 0){
            this.UIStack.pop();
        }
    }
};
