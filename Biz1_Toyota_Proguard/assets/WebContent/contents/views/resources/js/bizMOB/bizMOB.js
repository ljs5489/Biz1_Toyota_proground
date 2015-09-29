var urlPath="../resources/bizMOB/";

var jsUrls = 
[
	"lib/jquery-1.9.0.min.js",
	"jquery.cookie.js",
	"jquery-ui-1.8.18.custom.min.js",
	"json2.js",
	"iscroll.js",
	"toyotaUtil.js",
	"toyotaBizMOB.js",
	"../js/toyota.js",
	"configuration.js"
];
if(navigator.userAgent.toLowerCase().search("mobile") > -1) 
{
} 
else 
{
}

for(var i=0;i<jsUrls.length;i++) 
{
	
	document.write("<script type=\"text/javascript\" src=\"" + jsUrls[i] + "\" charset=\"utf-8\"></script>");
}
