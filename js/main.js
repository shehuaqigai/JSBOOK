$(function(){
    var contents,
        indexedDB,
        proto={},
        dbName = "objectTable", //database name
        dbVersion = 1.0, //database version
        tablename = "chromeJSWindowObjectList", //table name
        $nav=$("#leftNavLetter ul"),
        scroll="",
        scrollContent="",
        $head=$(".header"),
        navLetter=$("#leftNavLetter");
    //ajax请求处理
    proto.dataAjaxRequst=function(callback){
        $.ajax({
            url:"./js/contents.json",
            type:'get',
            timeout:5000,
            dataType:"json",
            cache:false,
            success:function(data){
                contents=data;
                callback(data);
            },
            error:function(error){
                console.log(error);
            }})
    }
    //本地存储探测
    proto.detect=function(){
        var self=this;
        indexedDB = window.indexedDB || window.webkitIndexedDB ||window.mozIndexedDB || window.msIndexedDB;
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
      //  if (!window.indexedDB) {
         //   if(localStorage && localStorage.contents){
              //  contents=JSON.parse(localStorage.getItem("contents"));
             //   self.bootstrap();
         //   }else{
                this.dataAjaxRequst(function(data){
                 //   localStorage.setItem("contents",JSON.stringify(data));
                    self.bootstrap();
                })
         //  }
        //}
     //   else{
          //  localStorage.hasIndexDb ?  this.initIndexDb() : this.dataAjaxRequst(this.initIndexDb.bind(this));
     //   }

    }
    //初始化indexDb
    proto.initIndexDb=function (data){
        var request,db,self=this;
        request=indexedDB.open(dbName,dbVersion);
        request.onerror=function(event){
            console.log("oh! It's too sad,fail to open IndexDB! reason:"+event.target.errorCode);
        }
        request.onsuccess=function(event){
            console.log("open the database success!");
            db=event.target.result;
            window.db=db;
            self.queryData(db);
        }
        request.onupgradeneeded = function(evt){
            var objectStore = evt.target.result.createObjectStore(tablename,{ keyPath: "id", autoIncrement: true });
            objectStore.createIndex("contents", "contents", { unique: true });
            objectStore.add(data);
            console.log("upgrade database success!");
            localStorage.setItem("hasIndexDb",'{"storing":true}');
        }

    }
    //indexdb查询
    proto.queryData=function (db) {
        var self=this;
        var transaction =db.transaction([tablename],"readonly").objectStore(tablename).openCursor();
        transaction.onerror=function(event){
        }
        transaction.onsuccess=function(event){
            contents=event.target.result.value;
            self.bootstrap();
        }
    }
    //应用开始引导
    proto.bootstrap=function(){
         this.init26Letter($nav);
         this.initHeadNavBar();
         this.initArticle();
         $head.on("click",this.headerEventHandler.bind(this));
        setTimeout(function(){
        scroll=new IScroll('#leftNavLetter',{mouseWheel: true, click: true });
        scrollContent=new IScroll('#contentContainer',{mouseWheel: true, click: true });
        },100);
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }
    //初始化A-Z字母
    proto.init26Letter=function($nav){
        var letters=[],ul_List="",ASCII,list;
        for(var i=65;i<91;i++){
            ASCII=String.fromCharCode(i);
            letters.push(ASCII);
            ul_List+='<li class="icon-book" state="close"><span>'+ASCII+"</span></li>";
        }
        $nav.html(ul_List);
        $nav.find("li").on("click",this.eventHandler.bind(this));

    }
    //初始化导航条
    proto.initHeadNavBar=function(){
        var menu=contents.layoutHeader;
        var navName=menu.navName;
        var ulList=menu.ulList;
        var menuContainer="<menu>";
        for(var key in navName){
           menuContainer+='<div class="navButton '+key+'"><div class="navStyle">'+navName[key]+'</div><ul>';
            for(var listKey in ulList[key]){
                menuContainer+="<li class="+listKey+">"+ulList[key][listKey]+"</li>";
            }
            menuContainer+='</ul></div>';
        }
        menuContainer+='</menu>';
        $head.append(menuContainer);
    }
    //初始化内容展示
    proto.initArticle=function(){
        $.get("resource/default.html",null,function(data){
            $(".jumpIsTitle").html("阅读指南");
            $(".scrollLayout").append(data);
        },"html");
    }
    //左边导航事件处理
    proto.eventHandler=function(e){
        var li= e.target.nodeName=="SPAN" ? e.target.parentNode : e.target;
        var $li=$(li);
        if(li.className == "icon-file3"){
          this.jumpToPresent($li);
        }else{
            var state=li.getAttribute("state");
            var findUl=$(li).find("ul");
            var span=li.firstChild.innerText;
        }
        if(state == "unroll"){
            findUl.slideUp(500,function(){
                $li.css({"height":"2.5rem"});
                findUl.remove();
                li.setAttribute("state","close");
                scroll.refresh();
            })

            return;
        }else if(state == "close"){
            li.setAttribute("state","unroll");
            if(contents[span].length>0){
                var letterList="<ul>";
                for(i=0;i<contents[span].length;i++){
                    letterList+="<li class='icon-file3'>    "+contents[span][i]+"</li>";
                }
                letterList+="</ul>";
                $li.css({"height":"auto"});
                $li.append(letterList);
                scroll.refresh();
            }

        }

      }
    //头部事件处理
    proto.headerEventHandler=function(e){
        var self=this,target= e.target;
        var className=target.className;
      if(target.parentElement.className.indexOf("window") !=-1){
          this.init26Letter($nav);
          this.effectTurn();
      }else if(className.indexOf("other") !=-1){
      }else if(className.indexOf("aboutMe") !=-1){
      }
        if(target.tagName != "LI"){return;};
        //取得导航按钮的类名
        var navName=target.parentNode.parentNode.className.substr(10);
        //点击之后导航列表隐藏
        $(target.parentNode).slideUp(260,function(){
            $(target.parentNode).css({"display":""});
        });
        self.liGeneration(navName,className);
    }
    //在左侧生成li列表
    proto.liGeneration=function (navName,className){
        var arrayName=contents.navList[navName][className];
        var li="";
        for(var i=0;i<arrayName.length;i++){
            li+="<li class='icon-file3' url='./resource/docs/"+className+"/"+arrayName[i]+".html'>"+arrayName[i]+"</li>";
        }
        $nav.html(li);
        $nav.find("li").on("click",this.eventHandler.bind(this));
        this.effectTurn();
    }
    //生成列表的时候动画效果
    proto.effectTurn=function (){
        navLetter.attr("class","objectList");
        setTimeout(function(){
            navLetter.attr("class","");
        },700);
        scroll.refresh();
    }
    //对列表选项进行内容展示
    proto.jumpToPresent=function($li){
        var url,title;
        var $liText=$.trim($li.html());
        if(! $li.attr("url")){
           var sortLetter= $li.parents(".icon-book").find("span").html();
           url= "resource/"+sortLetter+"/"+$liText+".html";
            title="window."+$liText;

       }else{
           url=$li.attr("url");
            title= title=url.substr(14).split("/")[0]+"."+$liText;
       }

        var $rightContent=$("#rightContent");
        var contentContainer= $rightContent.find(".scrollLayout");
        if(contentContainer.html().length > 30){
            contentContainer.empty();
        }
       var defer=$.ajax({type:'get',url:url,timeout:3000,dataType:"html",cache:false});
        defer.then(function(data){
            $rightContent.find(".jumpIsTitle").html(title);
            contentContainer.append(data);
            scrollContent.refresh();
        },function(error){console.log("请求文件失败!");});
        defer.always(function(){

        });
    }
    function main(){}
    main.prototype=proto;
    var app=new main();
    //启动应用
       app.detect();
});