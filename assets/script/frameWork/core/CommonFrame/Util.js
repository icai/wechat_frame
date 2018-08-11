/**
 * Created by xiaochuntian on 2018/5/2.
 */


tywx.Util = {

    isSceneQrCode:function (scene) {
        var qrCodeList = [1047, 1048, 1049]; //扫描小程序码,选取小程序码,识别小程序码
        return qrCodeList.indexOf(scene) > -1;
    },

    createUUID: function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "";

        var uuid = s.join("");
        return uuid;
    },

    checkLocalUUID: function() {
        var local_uuid = tywx.Util.getItemFromLocalStorage("LOCAL_UUID_KEY", "");
        return local_uuid != "";
    },

    getLocalUUID: function() {
        var local_uuid = tywx.Util.getItemFromLocalStorage("LOCAL_UUID_KEY", "");
        if (!local_uuid){
            local_uuid = tywx.Util.createUUID();
            tywx.Util.setItemToLocalStorage("LOCAL_UUID_KEY", local_uuid)
        }
        return local_uuid;
    },

    getItemFromLocalStorage: function (keyStr, defaultValue) {
        try {
            if(wx && wx.getStorageSync) {
                var value = wx.getStorageSync(keyStr);
                if (value) {
                    return value;
                }
            } else {
                var tmp = cc.sys.localStorage.getItem(keyStr);
                if (tmp) {
                    return tmp;
                }
            }
            return defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    setItemToLocalStorage: function (keyStr, ValueStr) {
        try {
            if(wx && wx.getStorageSync) {
                wx.setStorage({
                    key: keyStr,
                    data: ValueStr + ''
                });
            } else {
                cc.sys.localStorage.setItem(keyStr, ValueStr+"");
            }
        } catch (e) {
            tywx.LOGE("tywx.Util", "setItemToLocalStorage fail");
        }
    },

    wechatShowModal: function (content,showCancel,confirmText,successCallbackFun, failCallBackFun){
        if(!confirmText)
        {
            var confirmText = "";
        }

        wx.showModal({
            content:content,
            showCancel:showCancel,
            confirmText:confirmText,
            success:function(){
                if(successCallbackFun){
                    successCallbackFun();
                }
            },
            fail:function(){
                if(failCallBackFun){
                    failCallBackFun();
                }
            },
            complete:function(){
            }

        })
    },
    /**
     * 微信版本基础库对比
     * @param v1
     * @param v2
     * @returns {number} 0:v1/v2相同  1:v1高于v2 -1:v1低于v2
     */
    compareVersion:function(v1, v2) {
        v1 = v1.split('.')
        v2 = v2.split('.')
        var len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i])
            var num2 = parseInt(v2[i])

            if (num1 > num2) {
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }

        return 0
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
        var res = tywx.Util.compareVersion(tywx.UserInfo.SDKVersion, '2.0.3');
        if(res>=0){
            var iconobj = wx.createGameClubButton({
                icon: icon,
                style: {
                    left: left,
                    top: top,
                    width: w,
                    height: h
                }
            })
            return iconobj;
        }
        return null;
    },

    /**
     * 截取字符串为固定长度
     */
    sliceStringToLength: function (str, length) {
        if (typeof str !== "string") {
            return "";
        }
        else {
            var len = 0;
            var tmp = 0;
            var s;
            for (var i = 0; i < str.length; i++) {
                var charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) {
                    tmp += 1;
                } else { // 如果是中文则长度加2
                    tmp += 2;
                }
                if (tmp <= length - 2) {
                    len++;
                }
            }
            if (tmp <= length) {
                s = str.slice(0);
            } else {
                s = str.slice(0, len);
                s += "..";
            }
            return s;
        }
    },

    /**
     * 判断对象是不是数组
     * @param object
     */
    isArrayObject : function (object) {
        return  (object && (Object.prototype.toString.call(object) === '[object Array]'));
    },
    /**
     * 在图片上加自定义信息
     * @param nowIndex 默认为0
     * @param extraAdd 添加的自定义数据
     * @param imageUrl 底图
     * @param callBackF
     */
    getShareImageWithShareMap: function (nowIndex, extraAdd, imageUrl, callBackF) {
        var tempCavas = wx.createCanvas();
        tempCavas.width = 360;
        tempCavas.height = 288;
        var context = tempCavas.getContext("2d");
        var image = wx.createImage();
        image.src = imageUrl;
        image.onload = function (event) {
            var ima = event.target;
            context.drawImage(ima, 0, 0);
            var preTextWidth = 0;
            var preTextHeight = 0;
            var preX = 0;
            var preY = 0;
            while (nowIndex < extraAdd.length) {
                var extraMap = extraAdd[nowIndex];
                if (extraMap.type == "text") {
                    var textInformation = extraMap.textInformation;
                    var text = textInformation.textformatString;
                    context.font = textInformation.fontSize+"px Arial";
                    if (textInformation.textColorRGB.indexOf('#') == -1) {
                        textInformation.textColorRGB = "#" + textInformation.textColorRGB;
                    }
                    context.fillStyle = textInformation.textColorRGB;
                    context.textAlign = textInformation.textAlign.replace('middle', 'center');
                    var textX = parseInt(textInformation.originPointX);
                    if (textX < 0) {
                        if (textX == -1) {
                            textX = preX - preTextWidth / 2;
                        } else if (textX == -2) {
                            textX = preX + preTextWidth / 2;
                        }
                    }
                    var textY = parseInt(textInformation.originPointY);
                    if (textY < 0) {
                        if (textY == -1) {
                            textY = preY - preTextHeight / 2;
                        }
                        if (textY == -2) {
                            textY = preY + preTextHeight / 2;
                        }
                    }
                    context.fillText(text, textX, textY);
                    preTextWidth = context.measureText(text).width;
                    preTextHeight = context.measureText(text).height;
                    preX = textX;
                    preY = textY;
                    nowIndex++;
                }
                else if (extraMap.type == "image") {
                    var imageInformation = extraMap.imageInformation;
                    var sunImage = wx.createImage();           
                    sunImage.src = imageInformation.addImageUrl;    
                    sunImage.originPointX = imageInformation.originPointX;
                    sunImage.originPointY = imageInformation.originPointY;
                    sunImage.sizeWidth = imageInformation.sizeWidth;
                    sunImage.sizeHeight = imageInformation.sizeHeight;
                    if (imageInformation.shape && imageInformation.shape == 2) {
                        context.beginPath();
                        context.arc(sunImage.originPointX + sunImage.sizeWidth / 2, sunImage.originPointY + sunImage.sizeHeight / 2, sunImage.sizeWidth / 2, 0, 2 * Math.PI);
                        context.stroke();
                        context.clip();
                    }
                    sunImage.onload = function (event) {
                        var img = event.target;
                        context.drawImage(img, img.originPointX, img.originPointY, img.sizeWidth, img.sizeHeight);
                        var tempFilePath = tempCavas.toTempFilePathSync({
                            x: 0,
                            y: 0,
                            width: tempCavas.width,
                            height: tempCavas.height,
                            destWidth: tempCavas.width,
                            destHeight: tempCavas.height
                        });
                        if (callBackF) {
                            callBackF(tempFilePath);
                        }
                    };
                    sunImage.onerror = function (event) {
                        var img = event.target;
                        // hall.LOGW("==","============加载头像失败==========="+sunImage.src+"===="+imageInformation.addImageUrl+"====");                    
                        var tempFilePath = tempCavas.toTempFilePathSync({
                            x: 0,
                            y: 0,
                            width: tempCavas.width,
                            height: tempCavas.height,
                            destWidth: tempCavas.width,
                            destHeight: tempCavas.height
                        });
                        if (callBackF) {
                            callBackF(tempFilePath);
                        }
                    };
                    return;
                }
            }
            var tempFilePath = tempCavas.toTempFilePathSync({
                x: 0,
                y: 0,
                width: tempCavas.width,
                height: tempCavas.height,
                destWidth: tempCavas.width,
                destHeight: tempCavas.height
            });
            if (callBackF) {
                callBackF(tempFilePath);
            }
        };
        image.onerror = function (event) {
            var img = event.target;
            if (callBackF) {
                callBackF(img);
            }
            // hall.LOGW("==","============加载底图失败==========="+img.src);   
        };
    }
 
};
