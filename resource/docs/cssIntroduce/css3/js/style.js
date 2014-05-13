var Doyoe = Doyoe||{};
Doyoe.classes = Doyoe.classes||{};
Doyoe.modules = Doyoe.modules||{};

//树dyTree
Doyoe.classes.dyTree = function(dModule){
	if(!dModule){return;}
	this.dModule = dModule;
	this.nowOn = null;          //当前拥有焦点的元素
	this.oTarget = null;        //当前触发事件的元素
	this.oFather = null;        //当前触发事件的元素的父节点
	this.oGrandfather = null;   //当前触发事件的元素的祖父节点
	this.init();
};
Doyoe.classes.dyTree.prototype = {
	isActive:function(e){
		e = e||window.event;
		//Doyoe.util.stopEvent(e);
		this.oTarget = e.target||e.srcElement;
		this.oFather = this.oTarget.parentNode;
		this.oGrandfather = this.oFather.parentNode;
		if(this.oFather.tagName.toLowerCase() == 'div'&&this.oFather.className == 'haschild'){
			if(this.oGrandfather.className != 'open'){
				this.oGrandfather.className = 'open';
			}else{
				this.oGrandfather.className = 'close';
			}
		};
		if(this.oTarget.tagName.toLowerCase() == 'a'||this.oTarget.tagName.toLowerCase() == 'dfn'){
			if(this.nowOn){this.nowOn.className = '';};
			this.oTarget.className = 'on';
			this.nowOn = this.oTarget;
		}
	},
	init:function(){
		Doyoe.util.addEvent(this.dModule,'click',Doyoe.util.bind(this.isActive,this));
	}
};
Doyoe.modules.dyTree = function(dModule){
	var dyTreeInstance = new Doyoe.classes.dyTree(dModule);
};
Doyoe.util.doWhileExists('dytree',Doyoe.modules.dyTree);

//拖拽dyDragDrop
Doyoe.classes.dyDragDrop = function(dModule,dragArea,dragDir){//要拖拽的模块, 拖拽区, 拖拽方向
	this.dModule = dModule;
	this.dragArea = Doyoe.util.getElementsBy('class',dragArea,'*',this.dModule)[0];
	this.dragDir = dragDir;
	this.isDrag = false;
	this.clickX = 0;
	this.clickY = 0;
	this.posX = 0;
	this.posY = 0;
	this.init();
};
Doyoe.classes.dyDragDrop.prototype = {
	mDown:function(e){
		e = e||window.event;
		this.isDrag = true;
		this.dModule.style.zIndex = 100;
		this.dragArea.onselectstart = function(){return false;};
		this.dragArea.style.cursor = 'move';
		this.clickX = e.clientX;
		this.clickY = e.clientY;
		if(this.dModule.currentStyle){
			this.posX = this.dModule.currentStyle.left;
			this.posY = this.dModule.currentStyle.top;
		}else{
			this.posX = document.defaultView.getComputedStyle(this.dModule,null).left;
			this.posY = document.defaultView.getComputedStyle(this.dModule,null).top;
		};
		if(this.dModule.setCapture){this.dModule.setCapture();}else{document.captureEvents(Event.mousemove|Event.mouseup);};
		Doyoe.util.addEvent(document,'mousemove',Doyoe.util.bind(this.mMove,this));
		Doyoe.util.addEvent(document,'mouseup',Doyoe.util.bind(this.mUp,this));
	},
	mMove:function(e){
		e = e||window.event;
		if(this.isDrag){
			if(this.dragDir != 'x'){this.dModule.style.top = parseInt(e.clientY) - parseInt(this.clickY) + parseInt(this.posY) + 'px';};
			if(this.dragDir != 'y'){this.dModule.style.left = parseInt(e.clientX) - parseInt(this.clickX) + parseInt(this.posX) + 'px';};
		}
	},
	mUp:function(){
		if(this.dModule.releaseCapture){this.dModule.releaseCapture();}else{document.captureEvents(Event.mousemove|Event.mouseup);};
		this.isDrag = false;
		this.dModule.style.zIndex = '';
		this.dragArea.style.cursor = '';
	},
	init:function(){
		this.dragArea.onmousedown = Doyoe.util.bind(this.mDown,this);
	}
};
Doyoe.modules.dyDragDrop = {
	normal:function(dModule){var dyDragDropInstance = new Doyoe.classes.dyDragDrop(dModule,'pophd');}
};
Doyoe.util.doWhileExists('contribute',Doyoe.modules.dyDragDrop.normal);

//下拉菜单类
Doyoe.classes.dyDropMenu = function(dModule,dItem,dPanel,sType,iIndex){
	this.oMod = dModule;
	this.oItem = Doyoe.util.getElementsBy('class',dItem,'*',this.oMod);
	this.oPanel = Doyoe.util.getElementsBy('class',dPanel,'*',this.oMod);
	if(!this.oItem[0]||!this.oPanel[0]){return;};
	this.iLn = this.oPanel.length;
	this.sItemCurrentClassName = dItem;
	this.sPanelCurrentClassName = dPanel;
	this.sType = sType||'mouseover';
	this.iNow = (isNaN(iIndex)||parseInt(iIndex)>=this.iLn||parseInt(iIndex)<0)?null:iIndex;
	this.oPreItem = null;
	this.oPrePanel = null;
	this.init();
};
Doyoe.classes.dyDropMenu.prototype = {
	switchHandler:function(){
		var _self = this;
		for(var i=0;i<this.iLn;i++){
			(function(nowIndex){
				_self.oItem[i].parentNode['on'+_self.sType] = function(e){
					e = e||window.event;
					Doyoe.util.stopEvent(e);
					_self.oItem[nowIndex].className = _self.sItemCurrentClassName + ' on';
					_self.oPanel[nowIndex].className = _self.sPanelCurrentClassName + ' gvisible';
				};
				if(_self.oMod = 'topages'){
					_self.oItem[i].onclick = function(e){
						e = e||window.event;
						Doyoe.util.stopEvent(e);
					};
				};
				_self.oItem[i].parentNode.onmouseout = function(e){
					_self.oItem[nowIndex].className = _self.sItemCurrentClassName;
					_self.oPanel[nowIndex].className = _self.sPanelCurrentClassName + ' ghide';
				};
			})(i)
		};
	},
	init:function(){
		this.switchHandler();
	}
};
Doyoe.modules.dyDropMenu = {
	normal:function(dModule){var switcherOfInstance = new Doyoe.classes.dyDropMenu(dModule,'item','panel');},
	combobox:function(dModule){var switcherOfInstance = new Doyoe.classes.dyDropMenu(dModule,'target','list');}
};
Doyoe.util.doWhileExists('mashead',Doyoe.modules.dyDropMenu.normal);
Doyoe.util.doWhileExists('topages',Doyoe.modules.dyDropMenu.combobox);

//切换类
Doyoe.classes.switcher = function(dModule,dItem,dPanel,sType,iIndex){
	this.oMod = dModule;
	this.oItem = Doyoe.util.getElementsBy('class',dItem,'*',this.oMod);
	this.oPanel = Doyoe.util.getElementsBy('class',dPanel,'*',this.oMod);
	if(!this.oItem[0]||!this.oPanel[0]){return;};
	this.iLn = this.oPanel.length;
	this.sItemCurrentClassName = dItem;
	this.sPanelCurrentClassName = dPanel;
	this.sType = sType||'mouseover';
	this.iNow = (isNaN(iIndex)||parseInt(iIndex)>=this.iLn||parseInt(iIndex)<0)?0:iIndex;
	this.oPreItem = null;
	this.oPrePanel = null;
	this.init();
};
Doyoe.classes.switcher.prototype = {
	switchHandler:function(){
		var _self = this;
		for(var i=0;i<this.iLn;i++){
			(function(nowIndex){
				_self.oItem[i]['on'+_self.sType] = function(e){
					Doyoe.util.stopEvent(e);
					if(_self.iNow != null){
						_self.oItem[_self.iNow].className = _self.sItemCurrentClassName;
						_self.oPanel[_self.iNow].className = _self.sPanelCurrentClassName + ' ghide';
						_self.iNow = null;
					};
					if(_self.oPreItem&&_self.oPrePanel){
						_self.oPreItem.className = _self.sItemCurrentClassName;
						_self.oPrePanel.className = _self.sPanelCurrentClassName + ' ghide';
					};
					_self.oItem[nowIndex].className = _self.sItemCurrentClassName + ' on';
					_self.oPanel[nowIndex].className = _self.sPanelCurrentClassName + ' gvisible';
					_self.oPreItem = _self.oItem[nowIndex];
					_self.oPrePanel = _self.oPanel[nowIndex];
				};
			})(i)
		};
		if(this.iNow != null){
			this.oItem[this.iNow].className = this.sItemCurrentClassName + ' on';
			this.oPanel[this.iNow].className = this.sPanelCurrentClassName + ' gvisible';
		};
	},
	init:function(){
		this.switchHandler();
	}
};
Doyoe.modules.switcher = {
	normal:function(dModule){var switcherOfInstance = new Doyoe.classes.switcher(dModule,'item','panel');}
};
Doyoe.util.doWhileExists('test',Doyoe.modules.switcher.normal);

//弹窗类dyChildWindow
Doyoe.classes.dyChildWindow = function(dModule,dPopup){
	this.oMod = dModule;
	this.oPopup = document.getElementById(dPopup);
	this.oMask = document.getElementById('mask');
	this.oBtnClose = Doyoe.util.getElementsBy('class','btn-close','*',this.oPopup)[0];
	this.init();
};
Doyoe.classes.dyChildWindow.prototype = {
	findPosition:function(e){
		if(this.oPopup&&this.oPopup.style.display == 'block'){
			var oDoc = document.documentElement;
			var iPageWidth = oDoc.clientWidth;
			var iPageHeight = oDoc.clientHeight;
			var iPopWidth = this.oPopup.offsetWidth;
			var iPopHeight = this.oPopup.offsetHeight;
			var iLeft = parseInt((iPageWidth/2) - (iPopWidth/2)) + 'px';
			var iTop = parseInt((iPageHeight/2) - (iPopHeight/2)) + 'px';
			this.oPopup.style.cssText = 'display:block;opacity:1;top:'+iTop+';left:'+iLeft;
			this.oMask.style.cssText = 'display:block;height:'+iPageHeight+'px;';
		}
	},
	showPopup:function(e){
		e = e||window.event;
		Doyoe.util.stopEvent(e);
		if(this.oMask&&this.oPopup&&this.oPopup.style.display != 'block'){
			this.oPopup.style.display = 'block';
			this.oPopup.style.opacity = '0';
			this.findPosition();
		}
	},
	hidePopup:function(e){
		e = e||window.event;
		Doyoe.util.stopEvent(e);
		if(this.oBtnClose&&this.oMask&&this.oPopup){
			this.oMask.style.display = 'none';
			this.oPopup.style.display = 'none';
			this.oPopup.style.opacity = '';
		}
	},
	init:function(){
		Doyoe.util.addEvent(this.oMod,'click',Doyoe.util.bind(this.showPopup,this));
		Doyoe.util.addEvent(this.oBtnClose,'click',Doyoe.util.bind(this.hidePopup,this));
		Doyoe.util.addEvent(window,'resize',Doyoe.util.bind(this.findPosition,this));
	}
};
Doyoe.modules.dyChildWindow = {
	showOffer:function(dModule){var showPopupofinstance = new Doyoe.classes.dyChildWindow(dModule,'contribute');}
};
Doyoe.util.doWhileExists('offer',Doyoe.modules.dyChildWindow.showOffer);
Doyoe.util.doWhileExists('offer2',Doyoe.modules.dyChildWindow.showOffer);

//导航到对应文章
Doyoe.classes.goArticle = function(dModule){
	var isActive = function(e){
		e = e||window.event;
		Doyoe.util.stopEvent(e);
		var oTarget = e.target||e.srcElement;
		if(oTarget.tagName.toLowerCase() == 'a'){
			var sUrl = oTarget.href;
			var dArchives = document.getElementById('archives');
			dArchives.src = sUrl;
		}
	};
	Doyoe.util.addEvent(dModule,'click',isActive);
};
Doyoe.util.doWhileExists('dytree',Doyoe.classes.goArticle);
Doyoe.util.doWhileExists('about-me',Doyoe.classes.goArticle);

//运行示例
Doyoe.classes.runExample = function(dModule){
	var openExample = function(){
		var oCode = dModule.getElementsByTagName('textarea')[0].value;
		var winExample = window.open();
		winExample.document.write(oCode);
		//alert(winExample);
	};
	var oRunBtn = dModule.getElementsByTagName('input')[0];
	if(oRunBtn){Doyoe.util.addEvent(oRunBtn,'click',openExample);};
};
Doyoe.util.doWhileExists('example',Doyoe.classes.runExample);

//动态取得测试浏览器列表区域的iframe高度
Doyoe.classes.autoIframeSize = function(dModule){
	var dMod = dModule;
	var dIframeDoc = Doyoe.util.visitIframe(dMod);
	var iframeSize = function(){
		var x = function(){
			dMod.style.height = dIframeDoc.body.offsetHeight + 'px';
		};
		x();
		Doyoe.util.addEvent(window,'resize',x);
	};
	Doyoe.util.addEvent(window,'load',iframeSize);
};
Doyoe.util.doWhileExists('top-browser',Doyoe.classes.autoIframeSize);
Doyoe.util.doWhileExists('bot-browser',Doyoe.classes.autoIframeSize);

/* Google Analytics */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-3500471-4']);
_gaq.push(['_trackPageview']);
(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();