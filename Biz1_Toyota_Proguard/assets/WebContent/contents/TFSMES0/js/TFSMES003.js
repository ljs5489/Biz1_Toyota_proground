/**
 * 알림 팝업
 */


var page = 
{
		init : function(json)
		{
			page.initInterface();
			page.initData(json);
			page.initLayout();
		},

		initData : function(json)
		{
			if(json.alert_type == "1"){
				$("#alertForm1").show();
				$("#alertMsg").text(json.alert_msg);
			}else if(json.alert_type == "2"){
				$("#alertForm2").show();
				$("#dateDiff").text(json.date_diff+"일");
			}
			
		},

		initInterface : function()
		{
			//닫기 버튼
			$(".btn_close, #btn_OK").bind("click", function(){
				bizMOB.Ui.closeDialog({});
			});
			
			//비밀번호 변경하기 버튼
			$("#btn_goPwdChg").bind("click", function(){
				bizMOB.Web.open("TFSMES3/html/TFSMES301.html", {
					modal : false,
					replace : false,
					message : {
						isFromLogin : true
					}
				});
			});
		},
		
		initLayout : function()
		{
		}
};
