/**
 * 메뉴
 */


var page = 
{
		init : function()
		{
			page.initInterface();
			page.initData();
			page.initLayout();
		},

		initData : function()
		{
			//관리자인 경우 통계관리 버튼 보임 처리
			if(bizMOB.Properties.get("userKubun") == "M"){
				$(".btn_menu[value=4]").show();
			}
		},

		initInterface : function()
		{
			//메뉴연결 버튼
			$(".btn_menu").bind("click", function(){
				var value = $(this).attr("value");
				
				if(value == "1"){
					toyotaUtil.openInternalBrowser();
				} else if(value == "2"){
					bizMOB.Web.open("TFSMES2/html/TFSMES201.html", {
						modal : false,
						replace : false,
						message : {}
					});
				} else if(value == "3"){
					bizMOB.Web.open("TFSMES3/html/TFSMES301.html", {
						modal : false,
						replace : false,
						message : {}
					});
				} else if(value == "4"){
					bizMOB.Web.open("TFSMES4/html/TFSMES401.html", {
						modal : false,
						replace : false,
						message : {}
					});
				}
				
			});
		},
		
		initLayout : function()
		{
		}
};

function appcallOnLoad(json){
	page.init(json);
}
