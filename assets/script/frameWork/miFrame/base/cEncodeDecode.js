/**
 * Created by wangqi on 2018/7/28.
 */

miFrame.EncodeDecode = {


    base64Encode: function(input) {
       
        return tywx.EncodeDecode.base64Encode(input);
    },

    base64Decode: function(input) {
        
        return tywx.EncodeDecode.base64Decode(input);
    },

    utf8Encode: function(string) {
       

        return tywx.EncodeDecode.utf8Encode(string);
    },

    utf8Decode: function(input) {
       
        return tywx.EncodeDecode.utf8Decode(input);
    }
};