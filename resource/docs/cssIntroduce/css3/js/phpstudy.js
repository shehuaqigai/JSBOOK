var Doyoe = Doyoe||{};
Doyoe.classes = Doyoe.classes||{};
Doyoe.modules = Doyoe.modules||{};
Doyoe.util = {
	doWhileExists:function(id,foo){
		var dTmp = document.getElementById(id);
		if(dTmp){foo(dTmp);}
	},
	stopEvent:function(e){
		e = e||window.event;
		if(e.stopPropagation){
			e.stopPropagation();
			e.preventDefault();
		}else{
			e.cancelBubble = true;
			e.returnValue = false;
		}
	},
	bind:function(foo,othis){
		if(!foo||!othis){return;};
		var args = Array.prototype.slice.call(arguments,2);
		return function(e){e=e||top.window.event||window.event;foo.apply(othis,args.concat(e));};
	},
	addEvent:function(obj,sType,fFoo){
		if(document.attachEvent){
			obj.attachEvent('on'+sType,fFoo);
		}else{
			obj.addEventListener(sType,fFoo,false);
		}
	},
	visitIframe:function(obj){
		if(document.attachEvent){
			return obj.contentWindow.document;
		}else{
			return obj.contentDocument;
		}
	},
	contains:function(f,c){
		if(f==null){return false;}
		var bCB2F = false;
		if(f.contains){bCB2F = f.contains(c);}else{bCB2F = (f.compareDocumentPosition(c)==20)?true:false;}
		return bCB2F;
	},
	setCookie:function(sName,sValue,oExpires,sPath,sDomain,bSecure){
		var myCookie = sName + '=' + encodeURIComponent(sValue);
		if(oExpires){
			var cookieDate = new Date();
			cookieDate.setTime(cookieDate.getTime()+(oExpires*24*60*60*1000));
			myCookie += ';expires=' + cookieDate.toGMTString();
		};
		if(sPath){myCookie += ';path=' + sPath;};
		if(sDomain){myCookie += ';domain=' + sDomain;};
		if(bSecure){myCookie += ';secure';};
		document.cookie = myCookie;
	},
	getCookie:function(sName){
		var sRE = sName + '=([a-zA-z-_0-9]+);?';
		var oRE = new RegExp(sRE);
		if(oRE.test(document.cookie)){
			return decodeURIComponent(RegExp.$1);
		}else{
			return null;
		}
	},
	ajax:{
		init:function(){
			var xmlHttp = null;
			try{xmlHttp = new XMLHttpRequest();}catch(e){
				try{xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');}catch(e){
					try{xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');}catch(e){alert('您的浏览器不支持ajax');return false;}
				}
			}
			return xmlHttp;
		},
		post:function(sUrl,sArgs,bAsync,succFoo,failFoo){
			var xh = this.init();
			if(!xh){alert('xmlHttp未准备就绪');return;}
			xh.onreadystatechange = function(){
				if(xh.readyState == 4){
					if(xh.status == 200){
						if(succFoo&&succFoo.constructor==Function){succFoo(xh);}
					}else{
						if(failFoo&&failFoo.constructor==Function){failFoo(xh);}
						xh = null;
					}
				}
			};
			xh.open('POST',encodeURI(sUrl),bAsync);
			xh.setRequestHeader('Content-Length',sArgs.length);
			xh.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
			xh.send(sArgs);
		},
		get:function(sUrl,bAsync,succFoo,failFoo){
			var xh = this.init();
			if(!xh){alert('xmlHttp未准备就绪');return;}
			xh.onreadystatechange = function(){
				if(xh.readyState == 4){
					if(xh.status == 200){
						if(succFoo&&succFoo.constructor == Function){succFoo(xh);}
					}else{
						if(failFoo&&failFoo.constructor == Function){failFoo(xh);}
						xh = null;
					}
				}
			};
			xh.open('GET',encodeURI(sUrl),bAsync);
			xh.send(null);
		}
	},
	getElementsBy:function(att,svalue,stag,dmodule,bcollection,binverse){
		var rd = [],l = dmodule?dmodule.length:0;
		if(!stag){return rd;}
		if(l&&dmodule.tagName.toLowerCase()!=='form'){
			for(var n=0;n<l;n++){if(!dmodule[n]){continue;}rd = rd.concat(arguments.callee(att,svalue,stag,dmodule[n],bcollection,binverse));}
			return rd;
		}
		if(att){
			var latt = att.length-1,matt = att.charAt(latt),rxp = null;
			switch(matt){
			case '^':
				att = att.substr(0,latt);
				rxp = new RegExp("^"+svalue,"i");
				break;
			case '$':
				att = att.substr(0,latt);
				rxp = new RegExp(svalue+"$","i");
				break;
			case '*':
				att = att.substr(0,latt);
				rxp = new RegExp(svalue,"i");
				break;
			case '|':
				att = att.substr(0,latt);
				rxp = new RegExp("^"+svalue+"\\b","i");
				break;
			case '!':
				att = att.substr(0,latt);
				rxp = new RegExp("^(?!"+svalue+"$)","i");
				break;
			case '~':
				att = att.substr(0,latt);
			default:
				rxp = new RegExp("\\b"+svalue+"\\b","i");
				break;
			}
		}
		var atts = att,ctag = true,hasatt = false,satt = null,btrue = false;
		if(atts=='class'&&(/msie[67]/i).test(navigator.appVersion.replace(/\s/g,''))){atts='classname'}
		if(bcollection){
			if(!att){
				btrue = (stag=='*'||stag.toLowerCase()==dmodule.tagName.toLowerCase());
				if(!binverse&&btrue){rd.push(dmodule);return rd;}
				if(binverse&&!btrue){rd.push(dmodule);return rd;}
			}else{
				hasatt = dmodule.getAttributeNode(att),hasatt=(hasatt&&hasatt.value)?hasatt.value:hasatt,hasatt=(hasatt)?(/false/i.test(hasatt))?false:true:false;
				satt = dmodule.getAttribute(atts),ctag = (stag=='*')?true:(dmodule.tagName.toLowerCase()==stag.toLowerCase());
				btrue = svalue?(ctag&&hasatt&&satt&&rxp.test(satt)):(ctag&&hasatt);
				if(!binverse&&btrue){rd.push(dmodule);return rd;}
				if(binverse&&!btrue){rd.push(dmodule);return rd;}
			}
		}else{
			var tmpd = dmodule.getElementsByTagName(stag),tmpdl = tmpd.length,i = 0;
			if(!tmpdl){return rd;}
			if(!att){
				for(i=0;i<tmpdl;i++){
					btrue = (stag=='*'||stag.toLowerCase()==tmpd[i].tagName.toLowerCase());
					if(!binverse&&btrue){rd.push(tmpd[i]);}
					if(binverse&&!btrue){rd.push(tmpd[i]);}
				}
			}else{
				for(i=0;i<tmpdl;i++){
					hasatt = tmpd[i].getAttributeNode(att),hasatt=(hasatt&&hasatt.value)?hasatt.value:hasatt,hasatt=(hasatt)?(/false/i.test(hasatt))?false:true:false;
					satt = tmpd[i].getAttribute(atts);
					btrue = svalue?hasatt&&satt&&rxp.test(satt):hasatt;
					if(!binverse&&btrue){rd.push(tmpd[i]),rxp.lastIndex = -1;}
					if(binverse&&!btrue){rd.push(tmpd[i]),rxp.lastIndex = -1;}
				}
			}
		}
		return rd;
	}
};