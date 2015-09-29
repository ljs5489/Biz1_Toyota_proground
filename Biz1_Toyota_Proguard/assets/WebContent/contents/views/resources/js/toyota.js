
/**
 * Form 태그에 input태그 자동 설정 및 submit
 * @param {HTMLFormElement} form
 * @param {JSON} json
 */
function setInputTag(form, json)	{
	form.empty();
	
	var list = new Array();
	
	for(var node in json)	{
		var json_node = { "name"	: "", "value"	: "" };
		json_node.name	= node;
		json_node.value	= json[node];
		
		list.push(json_node);
	}
	
	$.each(list, function()	{
		var input = $("<input type='hidden'>");
		input.attr({
			"name"	: this.name,
			"value"	: this.value
		});
		form.append(input);
	});
	form.submit();
}

/**
 * JSON 리스트에서 중복 노드 제거
 * @param {JSONArray} list				json노드 리스트
 * @param {String} primary_key	제거할 기준 키
 * @returns {JSONArray}			중복제거된 json노드 리스트
 */
function distinctRemove(list, primary_key)	{
	var pk_array = new Array();
	var temp = new Array();

	$.each(list, function()	{
		pk_array.push(this[primary_key]);
	});
	$.each($.unique(pk_array), function(idx_1, value)	{
		$.each(list, function(idx_2)	{
			if(this[primary_key] == value)	{
				temp.push(list[idx_2]);
				return false;
			}
		});
	});
	
	return temp;
};

/**
 * JSON노드 리스트에서 특정 키값을 가진 노드 삭제
 * @param {JSONArray} list :		JSON노드 리스트
 * @param {JSON} options :	{ key : value } -> 특정 키값을 가진 노드 설정
 * @returns {JSONArray}	특정 키값이 제거된 JSON노드 리스트
 */
function removeJSONNodes(list, options)	{
	var removing_list = list;
	var temp = new Array();
	
	$.each(removing_list, function()	{
		var isRemove = true;
		for(var node in options) {
			if(options[node] == this[node])	{
//				console.log("options[" + node + "] : " + options[node] + " --- " + "list[" + node + "] : " + this[node] + " >>> match");
				isRemove = true;
			}
			else	{
//				console.log("options[" + node + "] : " + options[node] + " --- " + "list[" + node + "] : " + this[node] + " >>> not match");
				isRemove = false;
				break;
			}
		}
		if(!isRemove)		{
			temp.push(this);
		}
	});
	
	return temp;
};

/**
 * JSON노드 리스트 정렬
 * @param list		JSON노드 리스트
 * @param key		정렬을 할 때 기준으로 잡을 key
 * @param orderBy	"desc" : 내림차순, "asc" : 오림차순(Default : asc)
 * @returns {Array}	정렬된 JSON노드 리스트
 */
function sortJSONNode(list, key, orderBy)	{
	var sorting_list = list;
	var temp = new Array();
	var sort_idx = new Array();
	
	$.each(sorting_list, function()	{	sort_idx.push(this[key]);	});
	
	sort_idx.sort(function(a, b)	{
		if(orderBy.toLowerCase() == "desc")	return (b - a);
		return (a - b);
	});
	
	$.each(sort_idx, function(idx_1, value)	{
		$.each(sorting_list, function(idx_2)	{
			if(value == this[key])	{
				temp.push(sorting_list[idx_2]);
				sorting_list.splice(idx_2, 1);
				return true;
			}
		});
	});
	
	return temp;
};

/**
 * JSON노드 리스트에서 특정 키값을 가진 노드 검색
 * @param list		JSON노드 리스트
 * @param options	{ key : value } -> 특정 키값을 가진 노드 설정
 * @returns {Array}	특정 키값을 기준으로 찾은 JSON노드 리스트
 */
function findJSONNode(list, options)	{
	var find_list = list;
	var temp = new Array();
	
	$.each(find_list, function()	{
		var isFind = true;
		for(var node in options) {
			if(options[node] == this[node])	{
//				console.log("node_name : " + node + " & value : " + options[node] + " >>> This value is finded");
			}
			else	{
//				console.log("node_name : " + node + " & value : " + options[node] + " >>> This value is not finded");
				isFind = false;
				break;
			}
		}
		if(isFind)		{
			temp.push(this);
		}
	});
	
	return temp;
};

function changeText(message) {
	
	if(message == undefined || message.length <= 0){
		return '';
	}
	
	var arr = new Array();
	for(var i=0; i < message.length; i++) {
		var ascii = message.charCodeAt(i);
		
		// 공백이나 줄바꿈
		if(ascii==10) {
			arr.push(i);
		}
	}
	
	var cnt = 0;
	var txt = '';
	$.each(arr, function(idx, val) {
		txt += message.substring(cnt, val) + "</br>";
		cnt = val;
	});
	
	if(arr.length <= 0) {
		txt = message;
	}else{
		txt += message.substring(cnt);
	}
	
	return txt;
};

/**
 * @param {String} url
 * @param {JSON } message
 * @param {Func} success
 */
function ajaxPost(url, message, success)	{
	$.ajax({
		"url" : url,
		"data" : { "message" : JSON.stringify(message) },
		"type" : "post",
		"async" : true,
		"cache" : true,
		"dataType" : "text",
		"success" : function(response) {
			var json = JSON.parse(decodeURIComponent(response).replace(/\+/gi, " "));
			
			if(json.header.result) {
				success(json);
			}else {
				success(json);
			}
		},
		"error" : function(jqXHR, textStatus, errorThrown)	{
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
};

/**
 * @param {String} url
 * @param {JSON } message
 * @param {Func} success
 */
function ajaxGet(url, message, success)	{
	$.ajax({
		"url" : url,
		"data" : { "message" : JSON.stringify(message) },
		"type" : "get",
		"async" : false,
		"cache" : false,
		"dataType" : "text",
		"success" : function(response) {
			var json = JSON.parse(decodeURIComponent(response).replace(/\+/gi, " "));
			
			if(json.header.result) {
				success(json);
			}else {
				success(json);
			}
		},
		"error" : function(jqXHR, textStatus, errorThrown)	{
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
};

/**
 * 
 * @param {jQueryObject} target
 * @param {String} message
 */
function showLayerPopup(target, message)	{
	$("#d_layer").show().css("display", "table");
	$("#backLayer").show().css("display", "table");
	$("#backLayer").find(target).show();
	$("body").css("overflow", "hidden");
	
	var isLoad = setInterval(function() {
		if(target.contents().find(".popWrap").length >= 1)		{
			clearInterval(isLoad);
			window.document.getElementById(target.attr("id")).contentWindow.page.init(JSON.parse(message));
		}
	}, 500);
	
	$("#backLayer").click(function()	{
		$("#d_layer").hide();
		$("#backLayer").hide();
		$("#backLayer").find(target).hide();
		$("body").css("overflow", "auto");
		target.height(0);
	});
}

function hideLayerPoup(target, func)	{
	$("#d_layer", parent.document).hide();
	$("#backLayer", parent.document).hide();
	$("#backLayer", parent.document).find(target).hide();
	$("body", parent.document).css("overflow", "auto");
	target.height(0);
	
	if(typeof(func) == "function")	{
		func();
	}
}
