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
        },
        //封装获取dom元素所有兄弟元素的函数,返回jQuery对象
        elementSiblings:function(dom){
            var $arr=jquery();
            var parent=dom.parentNode;
            var childs=parent.childNodes;
            for(var i=0;i<childs.length;i++){//遍历所有的兄弟元素。
                var child=childs[i];
                if(child.nodeType==1&&child!=dom){//判断节点类型，并且排除自己
                    [].push.call($arr,child);//借用数组的push方法
                }
            }
            return $arr;//返回jquery对象
        },
        //封装获取dom元素所有兄弟元素的函数,返回jQuery对象
        nextElementSibling:function(dom){
            var next=dom.nextSibling;
            if(next==null) return null;
            if(next.nodeType==1) return next;
            return jquery.nextElementSibling(next);//返回jquery对象
        },
        valHooks:{
            input:{
                get:function(dom){
                    return dom.value;
                },
                set:function(dom,value){
                    if(dom.type=="checkbox"||dom.type=="radio"){
                        if(dom.value==value){
                            dom.checked=true;
                        }
                    }else{
                        dom.value=value;
                    }
                }
            },
            option:{
                get:function(dom){
                    return dom.value||dom.innerText;
                },
                set:function(dom,value){
                    dom.value=value;
                }
            },
            select:{
                get:function(dom){
                    if(dom.multiple){
                        var arr=[];
                        var options=dom.getElementsByTagName("option");
                        jquery.each(options,function(){
                            if(this.selected==true){
                                arr.push(this.value||this.innerText);
                            }
                        });
                        return arr;
                    }
                    return dom.value;
                },
                set:function(dom,value){
                    var flag=false;
                    var options=dom.getElementsByTagName("option");
                    jquery.each(options,function(){
                        if(this.value==value){
                            flag=true;
                            this.selected=true;
                        }
                    });
                    if(!flag){
                        dom.selectedIndex=-1;
                    }
                }
            }
        }
    });
    //$.fn.each封装，方便DOM元素的操作
    jquery.fn.extend({
        each:function(callback){
            jquery.each(this,callback);
            return this;
        },
        indexOf:function(dom){//为了获取索引，也可以判断数组中是否有某个元素，返回相应的索引
            var index=-1;
            this.each(function(i){
                if(this==dom){
                    index=i;
                    return false;
                }
            });
            return index;
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
        },
        siblings:function(filter){
            //两种情况：
            var $siblings=jquery();//定义一个jQuery对象
            this.each(function(){//遍历每一个dom元素
                jquery.merge($siblings,jquery.elementSiblings(this));
            });
            //不传参，表示获取每一个dom元素所有的兄弟元素
            if(!filter){
                return $siblings;
            }
            //传入选择器或者是标签，表示获取每一个dom元素指定的兄弟元素
            var $filters=jquery(filter);//获取页面上所有的filter，返回jQuery对象
            var $filter=jquery();
            //遍历所有的兄弟元素
            $siblings.each(function(){
                var sibling=this;
                //遍历页面上所有的符合要求的jQuery对象
                $filters.each(function(){
                    if(sibling==this){
                        [].push.call($filter,sibling);
                    }
                });
            });
            return $filter;
        },
        //设置跟获取标签文本
        html:function(html){
            //当参数为空或者是undefined时候，获取第一个dom元素的所有内容
            if(html===undefined) return this.get(0).innerHTML;
            //当参数不为空，给所有dom元素设置内容
            return this.each(function(){
                this.innerHTML=html;
            });
        },
        //设置跟获取文本
        text:function(text){
            var str="";
            this.each(function(){
                if(text===undefined){
                    str+=this.innerHTML;
                    return;
                };
                this.innerHTML=text;
            });
            return text===undefined?str:this;
        },
        next:function(filter){
            //两种情况
            var $nextElementSibing=jquery();
            this.each(function(){
                [].push.call($nextElementSibing,jquery.nextElementSibling(this));
            })
            //如果不穿参数，获取每一个dom下一个兄弟元素组成的jQuery对象
            if(!filter) return $nextElementSibing;
            //如果传入参数，表示获取每一个dom元素下一个指定的元素
            var $filters=jquery(filter);
            var $filter=jquery();
            $nextElementSibing.each(function(){
                var nextElement=this;
                $filters.each(function(){
                    if(nextElement==this){
                        [].push.call($filter,this);
                    }
                });
            });
            return $filter;
        },
        attr:function(){
            //分析，三种情况
            var len=arguments.length;
            var arg0=arguments[0];
            var arg1=arguments[1];
            //1.没有参数，返回当前的jQuery对象
            if(len==0) return this;
            //2.一个参数，分两种情况，参数类型为字符串，参数类型为对象
            if(len==1){
                if(jquery.isString(arg0)){
                    return this[0].getAttribute(arg0);
                }
                this.each(function(){
                    var set=this;
                    jquery.each(arg0,function(key,value){
                        set.setAttribute(key,value);
                    });
                });
            }
            //3.两个参数，设置属性
            else{
                this.each(function(){
                    this.setAttribute(arg0,arg1);
                });
            }
            return this;
        },
        prop:function(){
            //分析三种情况
            var len=arguments.length;
            var arg0=arguments[0];
            var arg1=arguments[1];
            //没有参数
            if(len==0) return this;
            if(len==1){
                if(jquery.isString(arg0)){
                    return this[0][arg0];
                }
                this.each(function(){
                    var set=this;
                    jquery.each(arg0,function(key,value){
                        set[key]=value;
                    });
                });
            }
            //3.两个参数，设置属性
            else{
                this.each(function(){
                    this[arg0]=arg1;
                });
            }
            return this;
        },
        removeAttr:function(attr){
            return this.each(function(){
                this.removeAttribute(attr);
            });
        },
        removeProp:function(attr){
            this.each(function(){
                delete this[attr];
            });
        },
        hasClass:function(Name){
            var flag=false;
            this.each(function(){
                var classNames=" "+this.className+" ";
                var className=" "+Name+" ";
                if(classNames.indexOf(className)>-1){
                    flag=true;
                    return false;
                }
            });
            return flag;
        },
        addClass:function(str){
            //判断每个DOM元素是否有某个类名，没有就添加，有就不添加
            var arr=str.split(" ");
            return this.each(function(){
                var dom=this;
                var classNames=dom.className;
                jquery.each(arr,function(i,v){
                    //判断每一个需要添加的类名是否存在于当前的类名中
                    if(!$(dom).hasClass(v)){//不存在就添加
                        classNames+=" "+v;
                    }
                });
                dom.className=classNames;
            });
        },
        removeClass:function(className){
            var len=arguments.length;
            //不传参数就是移除所有的类名
            if(len==0){
                return this.each(function(){
                    this.className="";
                });
            }
            //移除一个或多个参数。
            var classNames=className.split(" ");
            return this.each(function(){
                var currentNames=" "+this.className+" ";
                jquery.each(classNames,function(i,v){
                    currentNames=currentNames.replace(" "+v+" "," ");
                });
                this.className=currentNames;
            });
        },
        toggleClass:function(className){
            //如果传入的不是字符串，抛出异常
            if(!jquery.isString(className)) throw new Error("请输入一个字符串类型的类名");

            var classNames=className.split(" ");
            return this.each(function(){
                //切换一个或者多个类名
                var $dom=$(this);
                jquery.each(classNames,function(i,v){
                    //优化
                    $dom[$dom.hasClass(v)?"removeClass":"addClass"](v);
                });
                /* if($dom.hasClass(className)){
                 $dom.removeClass(className);
                 }else{
                 $dom.addClass(className);
                 }*/
            });
        },
        val:function(val){
            //获取
            if(!val){
                var firstDom=this.get(0);
                var nodeName=firstDom.nodeName.toLowerCase();
                return jquery.valHooks[nodeName].get(firstDom);
            }
            return this.each(function(){
                var nodeName=this.nodeName.toLowerCase();
                jquery.valHooks[nodeName].set(this,val);
            });
        }
    });

    a.$= a.jquery=jquery;
})(window);