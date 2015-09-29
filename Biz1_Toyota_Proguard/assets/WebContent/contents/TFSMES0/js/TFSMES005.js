/**
 * 환경설정
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
			var deviceInfo = bizMOB.Device.getinfo();
			
			//어플리케이션 버전
			$("#apkVer").text(deviceInfo.app_version);
			
			//콘텐츠 버전
			$("#contentsVer").text(deviceInfo.content_major_version);
		},

		initInterface : function()
		{
		},
		
		initLayout : function()
		{
			//타이틀바
			var titlebar = toyotaResource.getCommonTitleBar("환경 설정");
			
			//툴바
			var toolbar = toyotaResource.getCommonToolBar();
			
			//화면 레이아웃
			var layout = new bizMOB.Ui.PageLayout();
			layout.setTitleBar(titlebar);
			layout.setToolbar(toolbar);
			bizMOB.Ui.displayView(layout);
		}
};


