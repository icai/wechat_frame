/**
 * 声音播放工具
 */
tywx.AudioHelper = {
    soundOpen : 0,

    init : function () {
        this.getMusicPlayManager();
        this.getMusicState();
    },
    getMusicPlayManager:function () {

        this.stopMusic();

        this.musicPlayManager = wx.createInnerAudioContext();
        return this.musicPlayManager;
    },

    /**
     * 播放音乐 (音效只可以播放一个,如果再调用此方法,之前的音乐会被停止)
     * @param file 文件名,例如: '/resources/sound/table_sound_After_the_bomb.mp3'
     * @param isloop 是否循环
     * @param volume 可选参数,音量
     */
    playMusic : function (file, isloop, volume) {

        if(this.soundOpen == -1)
            return;

        if (this._curMusicFile && this._curMusicFile == file){
            return;
        }
        this._curMusicFile = file;
        var playManager = this.getMusicPlayManager();

        if(playManager) {
            if (arguments.length == 3) {
                playManager.volume = volume;
            }

            playManager.autoplay = true;
            playManager.loop = isloop;
            playManager.src = tywx.SystemInfo.cdnPath + file;
        }
    },

    rePlayMusic:function () {
        if (this.musicPlayManager && this.musicPlayManager.loop){
            this.musicPlayManager.play();
        }
    },

    stopMusic:function () {
        if (this.musicPlayManager){
            this.musicPlayManager.stop();
            this.musicPlayManager.destroy();
            this.musicPlayManager = null;
            this._curMusicFile = undefined;
        }
    },


    /**
     * 播放音效 (音效可以同时播放多个)
     * @param file 文件名,例如: '/resources/sound/table_sound_After_the_bomb.mp3'
     * @param isloop 是否循环
     * @param volume 可选参数,音量
     */
    playEffect : function (file, isloop, volume) {

        if(this.soundOpen == -1)
            return;

        if (arguments.length == 3){
            this.setEffectsVolume(volume);
        }
        tywx.LOGD("fengbing", "  play effect *-*-*-   :  "+(tywx.SystemInfo.cdnPath + file));
        cc.audioEngine.playEffect(tywx.SystemInfo.cdnPath + file, isloop);
    },
    /**
     * 播放本地音效
     * @param file
     * @param isloop
     * @param volume
     */
    playLocalEffect : function (file, isloop, volume) {

        if(this.soundOpen == -1)
            return;

        if (arguments.length == 3){
            this.setEffectsVolume(volume);
        }
        // tywx.LOGD("fengbing", "  play local effect *-*-*-   :  "+file);
        cc.audioEngine.playEffect(cc.url.raw(file), isloop);
    },

    /**
     * 停止音效
     * @param effectId
     */
    stopEffect: function(effectId) {
        if(effectId < 0) {
            return;
        }
        cc.audioEngine.stopEffect(effectId);
    },

    /**
     * 停止所有音效
     */
    stopAllEffects: function() {
        tywx.LOGD("fengbing", "-========== stop effect =======");
        cc.audioEngine.stopAllEffects();
    },

    /**
     * 卸载所有文件
     */
    unloadAll: function() {
        cc.audioEngine.uncacheAll();
    },

    /**
     * 更改音效音量
     * @param val 音量
     */
    setEffectsVolume : function (val) {
        tywx.Util.setItemToLocalStorage("effect_sound_volume_", val)
        cc.audioEngine.setEffectsVolume(val);
        tywx.LOGD("fengbing", "-========== setEffectsVolume ======="+val);
        if(val==0)
            this.stopAllEffects();
    },

    /**
     * 更改音乐音量
     * @param val 音量
     */
    setMusicVolume : function (val) {
        tywx.Util.setItemToLocalStorage("music_sound_volume_", val)
        if(this.musicPlayManager) {
            this.musicPlayManager.volume = val;
            tywx.LOGD("fengbing", "-========== setMusicVolume ======="+val);
        }
        if(val==0)
            this.stopMusic();
    },

    /**
     * 获取音乐音量
     */
    getMusicVolume: function() {
        var _temp = tywx.Util.getItemFromLocalStorage("music_sound_volume_", 1);
        return _temp? 1 : _temp;
    },

    /**
     * 获取音效音量
     */
    getEffectsVolume: function() {
        var _temp = tywx.Util.getItemFromLocalStorage("effect_sound_volume_", 1);
        return _temp? 0 : _temp;
    },

    closeMusic : function () {
        this.soundOpen = -1;
        tywx.Util.setItemToLocalStorage("_sound_state_", -1);
        tywx.AudioHelper.setMusicVolume(0);
        tywx.AudioHelper.setEffectsVolume(0);

    },

    openMusic : function () {
        this.soundOpen = 1;
        tywx.Util.setItemToLocalStorage("_sound_state_", 1);
        tywx.AudioHelper.setMusicVolume(1);
        tywx.AudioHelper.setEffectsVolume(1);
    },

    getMusicState : function () {
        var _temp = tywx.Util.getItemFromLocalStorage("_sound_state_");
        ty.LOGD("fengbing",  "  music state:   "+_temp);
        this.soundOpen = _temp==-1? -1 : 1;
        return this.soundOpen;
    }
    
};
