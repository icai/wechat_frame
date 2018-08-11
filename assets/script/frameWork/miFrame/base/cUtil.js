/**
 * Created by xiaochuntian on 2018/5/2.
 */


miFrame.Util = {

    isSceneQrCode:function (scene) {
        return tywx.Util.isSceneQrCode(scene)
    },

    createUUID: function() {
        return tywx.Util.createUUID();
    },

    getLocalUUID: function() {

        return tywx.Util.getLocalUUID();
    },

    getItemFromLocalStorage: function(keyStr, defaultValue) {
       
        return tywx.Util.getItemFromLocalStorage(keyStr, defaultValue);
    },

    setItemToLocalStorage: function(keyStr, ValueStr) {
        tywx.Util.setItemToLocalStorage(keyStr, ValueStr)
    },

    wechatShowModal: function (content,showCancel,confirmText,successCallbackFun, failCallBackFun){
        tywx.Util.wechatShowModal(content,showCancel,confirmText,successCallbackFun, failCallBackFun)
    },
    /**
     * 微信版本基础库对比
     * @param v1
     * @param v2
     * @returns {number} 0:v1/v2相同  1:v1高于v2 -1:v1低于v2
     */
    compareVersion:function(v1, v2) {

        return tywx.Util.compareVersion(v1, v2)
    },

    /**
     * 创建游戏圈按钮
     * @param icon 
     * @param left
     * @param top
     * @param w
     * @param h
     * @returns {*}
     * ex:
     *  icon: 'green',
        style: {
                    left: 10,
                    top: 10,
                    width: 40,
                    height: 40
                }
     */
    createGameClubButton : function (icon, left, top, w, h) {
        
        return tywx.Util.createGameClubButton(icon, left, top, w, h);
    },

    /**
     * 截取字符串为固定长度
     */
    sliceStringToLength: function (str, length) {
        tywx.Util.sliceStringToLength(str, length) 
    },

    /**
     * 判断对象是不是数组
     * @param object
     */
    isArrayObject : function (object) {
        return  tywx.Util.isArrayObject(object)
    },
};
