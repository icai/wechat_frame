

cc.Class({
    extends: cc.Component,

    properties: {
  
        uiType : 2,
        uiName : "FadeActionModel",
    },


    // onLoad () {},

    start () {

  
        var action1 = cc.fadeOut(2.5);
        var self =this;
        var finish = cc.callFunc(function(){
        self.close();
        }, this); 

         var seq1 =[action1,finish];
        var seq =  cc.sequence (seq1).clone() ;
        this.node.runAction(seq);


    },

    close : function()
    {
     //   console.log ("close");
       mi.UIManager.hideUI("FadeActionModel",{ceng : 50});
    },

    hide : function(data)
    {
     //   console.log ("hide");
        this.node. opacity = 255;
        this.node.destroy();
        //this.node.stopAllActions();
        
        
    },
    
 
    show : function(data)
    {

     //   console.log ("show");


    
        // var action1 = cc.fadeOut(2.5);
        // var self =this;
        // var finish = cc.callFunc(function(){
        // self.close();
        // }, this); 

        //  var seq1 =[action1,finish];
        // var seq =  cc.sequence (seq1).clone() ;
        // this.node.runAction(seq);


       
        

    },

    // update (dt) {},
});
