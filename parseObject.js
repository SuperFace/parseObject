var parseObject = {
    do: function(data){//给data，瘦身
        var $this = this;
        var arrayBufferTypes = ["arraybufer", "int8array", "uint8array", "int16array", "uint16array", "int32array", "uint32array", "float32array", "float64array"];
        var _data = null;
        var _type = $this._type(data)
    
        if(_type == "object"){
            _data = {};
            for(var key in data){
                var _val = data[key];
                _data[key] = $this.do(_val);
            }
        }else if(_type == "string" && data.indexOf("data:image/") != -1 && data.indexOf(";base64,") != -1){//base64-image处理
            var subTop = data.split(";base64,")[0] + ";base64,";
            data = data.split(";base64,")[1];
            var l = data.length,i;
            var blen = 0;
            for(i=0; i<l; i++) {
                if ((data.charCodeAt(i) & 0xff00) != 0) {
                    blen ++;
                }
                blen ++;
            }
            _data = subTop + blen + "bytes";
        }else if(_type == "string"){
            var l = data.length,i;
            var blen = 0;
            for(i=0; i<l; i++) {
                if ((data.charCodeAt(i) & 0xff00) != 0) {
                    blen ++;
                }
                blen ++;
            }
            if(blen > 100) _data = "String@" + blen + "bytes";
            else _data = data.toString();
        }else if(_type == "array" || _type == "arguments"){
            _data = [];
            if(data.length > 0){
                for(var k=0; k< data.length; k++){
                    var __val = data[k];
                    _data[k] = $this.do(__val);
                }
            }
        }else if(arrayBufferTypes.indexOf(_type) > -1){
            _data = _type + "@" + data.byteLength + "bytes";
        }else if(_type == "undefined"){
            _data = "undefined";
        }else if(_type == "null"){
            _data = "null";
        }else if(_type == "nan"){
            _data = "NaN";
        }else _data = data.toString();
    
        return _data;
    },
    _type: function(val){
        switch (toString.call(val)) {
            case '[object Date]':
                return 'date';
            case '[object RegExp]':
                return 'regexp';
            case '[object Arguments]':
                return 'arguments';
            case '[object Array]':
                return 'array';
            case '[object ArrayBuffer]':
                return 'arraybufer';
            case '[object Int8Array]':
                return 'int8array';
            case '[object Uint8Array]':
                return 'uint8array';
            case '[object Int16Array]':
                return 'int16array';
            case '[object Uint16Array]':
                return 'uint16array';
            case '[object Int32Array]':
                return 'int32array';
            case '[object Uint32Array]':
                return 'uint32array';
            case '[object Float32Array]':
                return 'float32array';
            case '[object Float64Array]':
                return 'float64array';
            case '[object Error]':
                return 'error';
        }
    
        if (val === null) return 'null';
        if (val === undefined) return 'undefined';
        if (val !== val) return 'nan';
        if (val && val.nodeType === 1) return 'element';
    
        val = val.valueOf ? val.valueOf() : Object.prototype.valueOf.apply(val)
    
        return typeof val;
    }
}; 