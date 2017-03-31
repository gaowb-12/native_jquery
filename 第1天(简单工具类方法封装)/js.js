/**
 * Created by Lenovo on 2017/3/16.
 */
(function(a){
    var arr=[];
    var push=arr.push;
    var splice=arr.splice;
    var slice=arr.slice;
    var types="Number String Boolean Null Undefined Array RegExp Function Math Date Object".split(" ");
    var class2type={};
    for(var i=0;i<types.length;i++){
        var type=types[i];
        class2type["[object "+type+"]"]=type.toLocaleLowerCase();
    }
    function isLikeArray(data){
        var len=data.length;
        return typeof len=="number"&&len>=0&&len-1 in data;
    }
    function Sizzle(selector){
        return document.querySelectorAll(selector);
    }
    function jquery(selector){
        return new jquery.prototype.F(selector);
    }
    jquery.fn=jquery.prototype={
        constructor:jquery,
        F:function(selector){
            splice.call(this,0,this.length);
            push.apply(this,Sizzle(selector));
            return this;
        },
    };
    //构造函数F的原型指向jQuery的原型
    jquery.fn.F.prototype=jquery.fn;
    jquery.fn.extend=jquery.extend=function(){
        var arg0=arguments[0];
        var target,source;
        if(arguments.length==0) return this;
        if(arguments.length==1){
            target=this;
            source=[arg0];
        }else{
            target=arg0;
            source=slice.call(arguments,1);
        }
        for(var i=0;i<source.length;i++){
            for(var key in source[i]){
                target[key]=source[i][key];
            }
        }
        return target;
    };
    //$.each实现遍历（数组，伪数组，对象）
    jquery.extend({
        each:function(arr,callback){
            var i,l=arr.length;
            if(isLikeArray(arr)){
                for(i=0;i<l;){
                    if(callback.call(arr[i],i,arr[i++])===false) break;
                }
            }else{
                for(i in arr){
                    if(callback.call(arr[i],i,arr[i])===false) break;
                }
            }
        },
        isString:function(str){
            return typeof str=="string";
        },
        isFunction:function(fun){
            return typeof fun=="function";
        },
        //浏览器原生支持了isArray方法，但是es5之前没有，需要考虑到兼容新问题
        isArray:Array.isArray||function(array){
            return jquery.type(array)=="array";

        },
        type:function(data){
            return data==null?
                String(data):
                class2type[Object.prototype.toString.call(data)];
        },
        merge:function(target,source) {
            var len = target.length;
            for (var i = 0; i < source.length; i++) {
                target[len] = source[i];
                len++;
            }
            target.length = len;
            return target;
        },
        makeArray:function(data){
            if(isLikeArray(data)){
                return jquery.merge([],data);
            }else{
                return [data];
            }
        },
        //去除字符串的首尾空格-->正则表达式
        trim:function(str){
            return str.replace(/^\s+|\s+$/g,"");
        }
    });

    //$.fn.each封装，方便DOM元素的操作
    jquery.fn.extend({
        each:function(callback){
            jquery.each(this,callback);
            return this;
        }
    });
    a.$= a.jquery=jquery;
})(window);