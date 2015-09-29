/**
 * 견적 불가
 */

var page = {
		init : function()
		{
			page.initData();
			page.initInterface();
		},
		
		initData : function()
		{
			var type = $("#type").val();
			var brandCd = $("#brand_cd").val();
			var scParam = $("#params").val();
			var msg = "";
			
			if(type == 1){
				msg = "알 수 없는 오류가 발생하였습니다.\n다시 시도해주세요.";
			}else if(type == 2){
				msg = "견적생성 불가한 계정입니다.";
			}else if(type == 3){
				msg = "현재 새로운 프로모션 및 상품 업데이트 중이오니 잠시 기다려 주시기 바랍니다.";
			}

			alert(msg);
			$("#param2").val(scParam);

			//운영용			
			if(brandCd == "T"){
				$("#scExitForm").attr("action", "http://192.168.3.10:12400/sfa/service/setTfskrEstimateInfo.do");
			}else if(brandCd == "L"){
				$("#scExitForm").attr("action", "http://192.168.2.10:12400/sfa/service/setTfskrEstimateInfo.do");
			}
			
			//테스트용
			/*
			if(brandCd == "T"){
				$("#scExitForm").attr("action", "http://192.168.2.53:12400/sfa/service/setTfskrEstimateInfo.do");
			}else if(brandCd == "L"){
				$("#scExitForm").attr("action", "http://192.168.2.22:12400/sfa/service/setTfskrEstimateInfo.do");
			}
			*/
			
			$("#scExitForm").submit();
			//window.open('about:blank','_self').close();			
		},
		
		initInterface : function()
		{
		}
};
