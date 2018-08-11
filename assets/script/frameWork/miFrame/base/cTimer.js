/**
 * 对scheduler进行封装
 */

miFrame.Timer = {
    /**
     * 开始定时器
     * 参数的含义依次是：回调的obj、回调函数、tick的间隔、不算这次还要重复的次数，开始tick的delay时间
     * @param {[type]}   obj       [description]
     * @param {Function} callback  [description]
     * @param {[type]}   interval  [description]
     * @param {[type]}   repeatNum [description]
     * @param {[type]}   delay     [description]
     */
	setTimer:function(obj, callback, interval, repeatNum, delay){
        tywx.Timer.setTimer(obj, callback, interval, repeatNum, delay)
	},

    /**
     * 取消定时器
     * @param  {[type]}   obj      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
	cancelTimer:function(obj, callback){
		tywx.Timer.cancelTimer(obj, callback)
	},
    /**
     * 判断定时器
     * @param  {[type]}   obj      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    isScheduledTimer:function(obj, callback){
        return tywx.Timer.isScheduledTimer(obj, callback)
    }
};
