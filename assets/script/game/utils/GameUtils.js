miTools = {}

miTools.Utils = {
    TAG : "Utils",

    init : function () {

    },

    loadPrefab: function (path,callback) {
        var url = path
        //this._releaseResource(url, cc.Prefab);
        cc.loader.loadRes(path,function(err,prefab){
            if(err){
            }else{
                var node = cc.instantiate(prefab);
                node.position = cc.v2(0, 0);
                callback(node)
            }
        })
    },

    loadSpriteFrame: function (path,name) {
        var url = path;
        var node = undefined;
        //this._releaseResource(url, cc.SpriteAtlas);
        cc.loader.loadRes(url, cc.SpriteAtlas,function (err, atlas){
            //cc.loader.setAutoRelease(atlas, true);
            node = new cc.Node();
            node.position = cc.v2(0, 0);
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = atlas.getSpriteFrame(name);
        });
        return node
    },
    _releaseResource: function (url, type) {
        var res = cc.loader.getRes(url, type);
        var all = cc.loader.getDependsRecursively(res);
        cc.loader.release(all);
    },
    createSprite : function (url) {
        var node = new cc.Node();
        var sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = new cc.SpriteFrame(cc.url.raw(url));
        return node;
    },
    getVectByV2 : function (fromPos,toPos,vect) {
        var len_y = toPos.y - fromPos.y;
        var len_x = toPos.x - fromPos.x;
        var tan_yx =  Math.abs(len_y)/Math.abs(len_x);
        var angle

        if(len_y > 0 && len_x < 0) {
            angle = Math.PI - Math.atan(tan_yx);
        } else if (len_y > 0 && len_x > 0) {
            angle = Math.atan(tan_yx);
        }

        var y = Math.sin(angle) * vect
        var x = Math.cos(angle) * vect
        return cc.v2(x,y)
    },

    getColorByNum : function (num) {
        if(num && num != undefined){
            for(var i=0;i<wxEnum.OBS_COLOR.length;i++){
                if(num >= wxEnum.OBS_COLOR[i].minLevel && num <= wxEnum.OBS_COLOR[i].maxLevel){
                    return wxEnum.OBS_COLOR[i].colorName
                }
            }
        }
        return undefined
    },

    alterLayer : function(title,content,sureBtn,callback){
        var params = {
            title : title,
            content : content,
            sureBtn : sureBtn,
            callback : callback
        }
        wxgm.UIManager.showUI("AlterLayer",params);
    },
    givenLayer : function(title,content,itemSpr,callback){
        var params = {
            title : title,
            content : content,
            itemSpr : itemSpr,
            callback : callback
        }
        wxgm.UIManager.showUI("GivenLayer",params);
    },
    helpGivenLayer : function(title,itemSpr,callback){
        var params = {
            title : title,
            itemSpr : itemSpr,
            callback : callback
        }
        wxgm.UIManager.showUI("HelpGivenLayer",params);
    }
};

