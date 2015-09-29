var RELATE_DEPTH = "";

(function(){

	var EXTEN_LIB = {
			"UTIL" : {
						"LOAD": true,
						"LIB" : "bizMOB/util/bizMOB-util-1.0.js"
					},
			"MULTILAYOUT" : {
								"LOAD": false,
								"LIB" : "bizMOB/multilayout/bizMOB-multilayout.js"
							},
			"WEBUI" : {
							"LOAD": true,
							"LIB" : "bizMOB/webui/bizMOB-ui.js"
						}
	};


	var CURRENT_PATH = location.pathname;
	var PATH_DEPTH = CURRENT_PATH.split("/");
	var PATHARR_IDX=PATH_DEPTH.length-2;
	
	
	for(var i=PATHARR_IDX; i > 0;i--){
		if(PATH_DEPTH[i] != "contents"){
			RELATE_DEPTH += "../"; 
		}else{
			break;
		}
		
	}
	
	/** TFSMES203.html은 jquery1.9버전을 사용해야 textarea의 css가 적용되므로 jquery버전을 바꿔줌 */
	var strUrl = window.location.href;
	var jqVersion = strUrl.match("/TFSMES2/html/TFSMES203.html")==null? "bizMOB/jscore/jquery-1.7.2.min.js" : "js/jquery-1.9.0.min.js";
	//alert(jqVersion);
	
	var jsUrls = 
	[ 
		jqVersion,
		"bizMOB/jscore/json2.js",
		"bizMOB/jscore/bizMOB-xross-1.0.js",
		"bizMOB/config/web/configuration.js",
		//"js/tr.js",
		//"js/jquery.mobile-1.4.0-alpha.1.min.js",
		"js/ui10.js",
		"js/lib/toyotaBizMOB.js",
		"js/lib/toyotaUtil.js",
		"js/lib/toyotaResource.js"
	];
	
	for ( var lib in EXTEN_LIB){
		if(EXTEN_LIB[lib].LOAD) {jsUrls.push(EXTEN_LIB[lib].LIB);}
	}
	


	if( !(navigator.userAgent.toLowerCase().search("mobile") > -1 || 
			navigator.userAgent.toLowerCase().search("android") > -1) ) 
	{
		jsUrls.push("../webemulator/js/bizMOB-emulator.js");
	} 


	var JsList = "";
	for(var i=0;i<jsUrls.length;i++) 
	{
		JsList +=	"<script type=\"text/javascript\" src=\""+ RELATE_DEPTH + jsUrls[i] + "\" charset=\"utf-8\"></script>";
		
	}
	document.write(JsList);
})();


