(function(){
	var aHtml5 = ['article','aside','audio','canvas','command','datagrid','datalist','datatemplate','details','dialog','eventsource','figure','figcaption','footer','header','mark','meter','nav','nest','output','progress','rule','section','source','time','vedio','hgroup'];
    var iHtml5 = aHtml5.length;
    for(var i=0;i<iHtml5;i++){
		document.createElement(aHtml5[i]);
	}
})();