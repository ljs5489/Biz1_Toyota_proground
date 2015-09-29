/**
 * 메인
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
			//로고 이미지 표시
			var brandCode = bizMOB.Properties.get("brandCode");
			if(brandCode == "A271"){ //렉서스
				$("#img_logo").attr("src", "../../images/logo_l.png");
			}else if(brandCode == "A272"){ //도요타
				$("#img_logo").attr("src", "../../images/logo_t.png");
			}
			
			//관리자인 경우 통계관리 버튼 보임 처리
			if(bizMOB.Properties.get("userKubun") == "M"){
				$("#btn_goStatistic").show();
			}
		},

		initInterface : function()
		{
			//견적생성 버튼
			$("#btn_goEstimate").bind("click", function(){
				toyotaUtil.openInternalBrowser();
			});
			
			//견적조회 버튼
			$("#btn_goEstimateList").bind("click", function(){
				bizMOB.Web.open("TFSMES2/html/TFSMES201.html", {
					modal : false,
					replace : false,
					message : {}
				});
			});
			
			//나의정보 버튼
			$("#btn_goMyInfo").bind("click", function(){
				bizMOB.Web.open("TFSMES3/html/TFSMES301.html", {
					modal : false,
					replace : false,
					message : {}
				});
			});
			
			//통계관리 버튼
			$("#btn_goStatistic").bind("click", function(){
				bizMOB.Web.open("TFSMES4/html/TFSMES401.html", {
					modal : false,
					replace : false,
					message : {}
				});
			});
			
		},
		
		initLayout : function()
		{
			//타이틀바
			var titlebar = toyotaResource.getCommonTitleBar("Home");
			titlebar.setVisible(false);
			
			//툴바
			var toolbar = toyotaResource.getCommonDefaultToolBar();
			
			//화면 레이아웃
			var layout = new bizMOB.Ui.PageLayout();
			layout.setTitleBar(titlebar);
			layout.setToolbar(toolbar);
			bizMOB.Ui.displayView(layout);
		}
};

function onClickAndroidBackButton(){
	var btnOk = bizMOB.Ui.createTextButton("확인", function() {
		bizMOB.Native.exit({ kill_type : "exit" });
	});
	var btnCancel = bizMOB.Ui.createTextButton("취소", function() {
		return;
	});
	
	bizMOB.Ui.confirm("종료", "종료 하시겠습니까?", btnOk, btnCancel);
}


