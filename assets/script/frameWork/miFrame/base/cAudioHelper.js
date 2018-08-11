
/**
 * Created by wangqi on 2018/7/28.
 */

miFrame.AudioHelper = {

    init : function () {
        tywx.AudioHelper.init()
    },
    getMusicPlayManager:function () {
        return tywx.AudioHelper.getMusicPlayManager()
    },

    /**
     * 播放音乐 (音效只可以播放一个,如果再调用此方法,之前的音乐会被停止)
     * @param file 文件名,例如: '/resources/sound/table_sound_After_the_bomb.mp3'
     * @param isloop 是否循环
     * @param volume 可选参数,音量
     */
    playMusic : function (file, isloop, volume) {
        tywx.AudioHelper.playMusic(file, isloop, volume)
    },

    rePlayMusic:function () {
        tywx.AudioHelper.rePlayMusic()
    },

    stopMusic:function () {
        tywx.AudioHelper.stopMusic()
    },


    /**
     * 播放音效 (音效可以同时播放多个)
     * @param file 文件名,例如: '/resources/sound/table_sound_After_the_bomb.mp3'
     * @param isloop 是否循环
     * @param volume 可选参数,音量
     */
    playEffect : function (file, isloop, volume) {

        tywx.AudioHelper.playEffect(file, isloop, volume)
    },
    /**
     * 播放本地音效
     * @param file
     * @param isloop
     * @param volume
     */
    playLocalEffect : function (file, isloop, volume) {

        tywx.AudioHelper.playLocalEffect(file, isloop, volume)
    },

    /**
     * 停止音效
     * @param effectId
     */
    stopEffect: function(effectId) {
        tywx.AudioHelper.stopEffect(effectId)
    },

    /**
     * 停止所有音效
     */
    stopAllEffects: function() {
        tywx.AudioHelper.stopAllEffects()
    },

    /**
     * 卸载所有文件
     */
    unloadAll: function() {
        tywx.AudioHelper.unloadAll()
    },

    /**
     * 更改音效音量
     * @param val 音量
     */
    setEffectsVolume : function (val) {
        tywx.AudioHelper.setEffectsVolume(val)
    },

    /**
     * 更改音乐音量
     * @param val 音量
     */
    setMusicVolume : function (val) {
        tywx.AudioHelper.setMusicVolume(val)
    },

    /**
     * 获取音乐音量
     */
    getMusicVolume: function() {
        
        return tywx.AudioHelper.getMusicVolume()
    },

    /**
     * 获取音效音量
     */
    getEffectsVolume: function() {
        
        return tywx.AudioHelper.getEffectsVolume();
    },

    closeMusic : function () {
        tywx.AudioHelper.closeMusic()
    },

    openMusic : function () {
        tywx.AudioHelper.openMusic()
    },

    getMusicState : function () {
        
        return tywx.AudioHelper.getMusicState()
    }
    
};
