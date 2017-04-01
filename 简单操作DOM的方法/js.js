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

            if(selector==null) return this;
            if(typeof selector==="string"){//如果传入的参数是字符串
                //判断传入的是html标签
                if(selector[0]=="<"&&selector[selector.length-1]==">"&&selector.length>=3){
                    //在内存中创建一个DOM元素，实现操作
                    var div=document.createElement("div");
                    div.innerHTML=selector;
                    var childs=div.childNodes;
                    push.apply(this,childs);
                }else{
                    push.apply(this,Sizzle(selector));
                }
            }else if(selector.nodeType){//如果传入的参数不是字符串，是DOM对象
                this[0]=selector;
                this.length=1;
            }else{//传入的是jQuery对象
                jquery.merge(this,selector)
            }
            return this;
        }
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
        },
        insert:function(parent,child,isappend){
            var $parent=$(parent);
            var $child=$(child);
            var set=isappend?"appendChild":"insertBefore";
            $parent.each(function(){
                var parent=this;
                var child=parent.firstChild
                $child.each(function(){
                    parent[set](this.cloneNode(true),child);
                });
            });
        }
    });

    //$.fn.each封装，方便DOM元素的操作
    jquery.fn.extend({
        each:function(callback){
            jquery.each(this,callback);
            return this;
        },
        css:function(){
            //判断传入的实参的个数
            var len=arguments.length;
            var arg0=arguments[0];
            var arg1=arguments[1];
            //如果是一个参数
            if(len==1){
                if(jquery.isString(arg0)){
                    return window.getComputedStyle(this[0],null)[arg0];
                }else{
                    return this.each(function(){
                        $.extend(this.style,arg0);
//                        var self=this;
//                        $.each(arg0,function(key,value){
//                            self.style[key]=value;
//                        });
                    });
                }
            }else{
                return this.each(function(){
                    this.style[arg0]=arg1;
                });
            }

        },
        show:function(){
            return this.css("display","block");
        },
        hide:function(){
            return this.css("display","none");
        },
        toggle:function(){
            //1、获取DOM元素
           return this.each(function(){
                var dom=this;
                var $dom=jquery(dom);
                //2、判断该元素是否隐藏？-->display:"none"
                //          错误做法：因为dom是一个DOM元素，无法访问到css方法：var isHidden=dom.css("display")==="none";//
                //      正确做法：联想到jquery中具有将dom元素转换为jquery对象的功能，实现方式：$(dom)
//                $dom.css("display")==="block"?$dom.show():$dom.hide();
                $dom[$dom.css("display")==="block"?"show":"hide"]();
            });
        },
        get:function(){
            //需要根据传入的实参确定具体的DOM元素
            var len=arguments.length;
            var arg0=arguments[0];
            //传入值为空时
            if(len==0) return jQuery.makeArray(this);
            //index大于0的实况
            if(len==1){
                return this[arg0>=0?arg0:this.length+arg0];
//              return arg0>=0?this[arg0]:this[this.length+arg0];
            }
        },
        first:function(){
            return jquery(this.get(0));
        },
        last:function(){
            return jquery(this.get(-1));
        },
        eq:function(index){
            return jquery(this.get(index));
        },
        find:function(selector){
            //定义一个$对象，接收获取的DOM元素
            var $=jquery();//任然是伪数组，里面只有一个length属性
            //遍历$对象，获取每个DOM元素中的需要的DOM对象
            this.each(function(){
                jquery.merge($,this.querySelectorAll(selector));
            });
            return $;
        },
        append:function(){//给父jQuery对象追加元素。
            var child=arguments[0];
            jquery.insert(this,child,true);
            return this;
        },
        appendTo:function(){
            var $parent=$(arguments[0]);
            jquery.insert($parent,this,true);
            return this;
        },
        prepend:function(){
            //转化参数为jQuery对象
            var $child=$(arguments[0]);
            jquery.insert(this,$child);
            return this;
        },
        prependTo:function(){
            var $parent=$(arguments[0]);
            jquery.insert($parent,this);
            return this;
        },
        before:function(){
            var $pre=$(arguments[0]);
            this.each(function(){
                var next=this;
                var parent=next.parentNode;
                $pre.each(function(){
                    parent.insertBefore(this.cloneNode(true),next);
                })
            });
            return this;
        },
        after:function(){
            var $next=$(arguments[0]);
            this.each(function(){
                var pre=this;
                var parent=pre.parentNode;
                var next=pre.nextSibling;
                $next.each(function(){
                    parent.insertBefore(this.cloneNode(true),next);
                });
            });
            return this;
        }
    });
    a.$= a.jquery=jquery;
})(window);