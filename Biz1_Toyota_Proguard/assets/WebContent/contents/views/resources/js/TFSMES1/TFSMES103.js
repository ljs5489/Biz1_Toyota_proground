/**
 * 견적결과
 */

var page = {
		isSC : undefined, //SC 여부
		isManager : undefined, //관리자 여부(Agent만 해당)
		userId : undefined, //사용자ID
		layoutID : undefined, //운용리스, 금융리스, 할부리스 layout ID
		carInfo : undefined, //차 정보
		financialInfo : undefined, //금융상품정보
		promotionData : undefined, //프로모션정보
		resultData : undefined, //견적결과정보
		init : function()
		{
			page.initData();
			page.initInterface();
		},
		
		initData : function()
		{
			//기본정보 저장
			page.isSC = $("#is_SC").val();
			page.isManager = $("#is_Manager").val();
			page.userId = $("#user_id").val();
			page.layoutID = $("#layout_id").val();
			page.carInfo = $.parseJSON(decodeURIComponent($("#car_info").val()).replace(/\+/gi, " "));
			page.promotionData = $.parseJSON(decodeURIComponent($("#promotion_data").val()).replace(/\+/gi, " "));
			page.resultData = $.parseJSON(decodeURIComponent($("#result_data").val()).replace(/\+/gi, " "));
			
			if(page.isSC == "Y"){
				$("#btn_menu").hide();
				$("#saveBtnText").attr("style", "font-size:12px");
				$("#saveBtnText").html("DMS저장");
			}
			
			//관리자인 경우 메뉴 통계버튼 show
			if(page.isManager == "Y"){
				$(".btn_menu[value=4]").show();
			}
			
			$(page.layoutID).show();
			page.renderData();
			
		},
		
		initInterface : function()
		{
			//메뉴 열기/닫기
			$("#btn_menu").bind("click", function(){
				$(".menu_pop").toggle();
			});
			
			//메뉴 연결
			$(".btn_menu", "#menuContent").bind("click", function(){
				var value = $(this).attr("value");
				switch(value){
				case "1" : {
					var params = "";
					if(page.isSC == "Y"){ //SC인 경우 메뉴연결 버튼이 보이지 않지만 우선 개발은 해놓음
						params = page.userId+":"+page.carInfo.brandCd+":"+page.carInfo.modelCd+":"+page.carInfo.variantCd+":"+page.carInfo.myCd+":"+page.carInfo.sfxCd+":"+page.carInfo.idntInfo+":"+page.carInfo.dispalcement+":"+page.carInfo.extColorCd+":"+page.carInfo.intColorCd+":"+page.carInfo.salesType+":"+page.carInfo.carAmt;
						$("#redirectParams").val(JSON.stringify(params));
						$("#isSC").val(page.isSC);
						window.sessionStorage["101htmlCode"] = "";
						$("#goCarPageScForm").submit();
					}else {
						params = {
								user_id : page.userId,
								brand_cd : page.carInfo.brandCd,
								dealer_id : page.carInfo.dealerId,
								is_SC : page.isSC,
								is_Manager : page.isManager
						};
						$("#redirectParams").val(JSON.stringify(params));
						$("#isSC").val(page.isSC);
						window.sessionStorage["101htmlCode"] = "";
						$("#goCarPageAgentForm").submit();
					}
					
					break;
				}
				case "2" : {
					location.href = "bizmob://toyota?param={callback:'toyotaUtil.callbackInternalBrowser', data:{pageUrl:'TFSMES2/html/TFSMES201.html'}}";
					break;
				}
				case "3" : {
					location.href = "bizmob://toyota?param={callback:'toyotaUtil.callbackInternalBrowser', data:{pageUrl:'TFSMES3/html/TFSMES301.html'}}";
					break;
				}
				case "4" : {
					location.href = "bizmob://toyota?param={callback:'toyotaUtil.callbackInternalBrowser', data:{pageUrl:'TFSMES4/html/TFSMES401.html'}}";
					break;
				}
				}
			});
			
			//이전 버튼
			$("#btn_before").bind("click", function(){
				if(page.isSC == "Y"){
					history.back();
				}else {
					bizMOB_Android.back();
				}
			});
			
			//저장 버튼
			$("#btn_save").bind("click", function(){
				
				$("#btn_save").hide();
				
				$.extend(true, page.resultData, {
					prod_kubun : "", //상품구분 - B02O(운용리스),B02F(금융리스),B02L(할부금융)
					com_kubun : "B0101", //지점구분 - B0101(하드코딩) 서울본사, B0102 분당지점
					user_id : page.userId,
					pro_bill_info : $(".billingText", page.layoutID).text() + " " + $(".billing", page.layoutID).text() //프로모션 청구면제 멘트
				});
				if(page.layoutID == "#B02OLayout"){
					page.resultData.prod_kubun = "B02O";
				}else if(page.layoutID == "#B02FLayout"){
					page.resultData.prod_kubun = "B02F";
				}else if(page.layoutID == "#B02LLayout"){
					page.resultData.prod_kubun = "B02L";
				}
				
				var TFS103 = {
					header : { trcode : "TFS103", result : "true" },
					body : page.resultData
				};
				ajaxPost("/bizmob/m/saveResult", TFS103, function(json) {
					if(json.header.result) {
						alert("견적이 저장되었습니다.");
					} else {
						$("#btn_save").show();
						alert(json.header.error_text);
					}
				});
			});
			
			//종료 버튼
			$("#btn_exit").bind("click", function(){
				
				if(confirm("종료하시겠습니까?")){
					//로그(종료) 처리
					var TFS502 = {
							header : { trcode : "TFS502", result : "true" },
							body : {
								user_id : page.userId, //사용자 아이디
								is_sc : page.isSC //Y = SC, N = agent
							}
					};
					ajaxPost("/bizmob/m/exitLog", TFS502, function(json) {
						if(json.header.result) {
							if(page.isSC == "Y"){
								$("#param2").val(page.resultData.sc_param);
								
								//운영용
								if(page.carInfo.brandCd == "T"){
									$("#scExitForm").attr("action", "http://192.168.3.10:12400/sfa/service/setTfskrEstimateInfo.do");
								}else if(page.carInfo.brandCd == "L"){
									$("#scExitForm").attr("action", "http://192.168.2.10:12400/sfa/service/setTfskrEstimateInfo.do");
								}
								//테스트용
								/*
								if(page.carInfo.brandCd == "T"){
									$("#scExitForm").attr("action", "http://192.168.2.53:12400/sfa/service/setTfskrEstimateInfo.do");
								}else if(page.carInfo.brandCd == "L"){
									$("#scExitForm").attr("action", "http://192.168.2.22:12400/sfa/service/setTfskrEstimateInfo.do");
								}
								*/
								$("#scExitForm").submit();
								//window.open('about:blank','_self').close();
							}else {
								location.href = "bizmob://toyota?param={callback:'toyotaUtil.callbackInternalBrowser', data:{pageUrl:''}}";
							}
						} else {
							alert(json.header.error_text);
						}
					});
				}else {}
				
			});
		},
		
		renderData : function()
		{
			$(".mdelName", page.layoutID).text(page.carInfo.modelNm); //차종
			$(".carAmt", page.layoutID).text((""+page.resultData.car_amt).bMToCommaNumber()+"원"); //차량가
			$(".regtaxAmt", page.layoutID).text((""+page.resultData.regtax_amt).bMToCommaNumber()+"원"); //등록세
			$(".acqtaxAmt", page.layoutID).text((""+page.resultData.acqtax_amt).bMToCommaNumber()+"원"); //취득세
			$(".pubbondAmt", page.layoutID).text((""+page.resultData.pubbond_amt).bMToCommaNumber()+"원"); //공채할인
			$(".extraChrgAmt", page.layoutID).text((""+page.resultData.extra_chrg_amt).bMToCommaNumber()+"원"); //부대비용
			$(".totalAmt", page.layoutID).text((""+page.carInfo.totalAmt).bMToCommaNumber()+"원"); //총비용
			$(".leasUtilAmt", page.layoutID).text((""+page.resultData.leas_util_amt).bMToCommaNumber()+"원"); //리스이용금액
			//선납금
			if(page.resultData.advs_paid_amt != 0){
				$(".advs_paid_amt_content", page.layoutID).show();
				$(".advsPaidAmt", page.layoutID).text((""+page.resultData.advs_paid_amt).bMToCommaNumber()+"원");
			}
			if(page.layoutID=="#B02OLayout") $(".sdAmt", page.layoutID).text(page.resultData.sd_rate+"% / " + (""+page.resultData.sd_amt).bMToCommaNumber()+"원"); //보증금
			$(".term", page.layoutID).text(page.resultData.term+"개월"); //기간
			$(".pospAmt", page.layoutID).text(page.resultData.posp_rate+"% / " + (""+page.resultData.posp_amt).bMToCommaNumber()+"원"); //잔존가치
			$(".prerelPayAmt", page.layoutID).text((""+page.resultData.prerel_pay_amt).bMToCommaNumber()+"원"); //초기납입금액
			//총월리스료
			var carTaxMonthDueAmt = $("#car_tax_month_due_amt").val();
			if(carTaxMonthDueAmt != ""){
				$(".car_tax_month_due_amt_content", page.layoutID).show();
				$(".carTaxMonthDueAmt", page.layoutID).text(carTaxMonthDueAmt.bMToCommaNumber()+"원");
			}
			//월리스료
			if(page.layoutID == "#B02OLayout"){ //운용리스
				$(".monthDueAmt", page.layoutID).text((""+page.resultData.month_due_amt).bMToCommaNumber()+"원");
			}else { //금융리스, 할부금융
				$(".monthDueAmt", page.layoutID).text(page.resultData.int_rate + "% / " + (""+page.resultData.month_due_amt).bMToCommaNumber()+"원");
			}
			
			//프로모션인 경우
			if(page.promotionData.pro_no != undefined){
				$(".promotion_content", page.layoutID).show();
				
				//프로모션 이름
				$(".proName", page.layoutID).text(page.promotionData.customer_pro_name);
				
				//청구감면금액
				if(page.promotionData.billing_deduct_way == "A951"){ //공제방법 초회부터
					$(".billingText", page.layoutID).text("청구면제금액");
					$(".billing", page.layoutID).text((""+page.promotionData.billing).bMToCommaNumber()+"원");
				}else if(page.promotionData.billing_deduct_way == "A952"){ //공제방법 일정기간
					$(".billingText", page.layoutID).text(page.promotionData.billing_start_month+"회~"+page.promotionData.billing_end_month+"회차 지원");
					$(".billing", page.layoutID).text("매월 "+(""+page.promotionData.billing).bMToCommaNumber()+"원");
				}else {
					$(".promotion_billing_content", page.layoutID).hide();
				}
			}
		}
};

//internal browser에서 새로고침 버튼을 클릭한 경우 호출되는 함수
function clickNativeReloadButton(){
	bizMOB_Android.reload("");
}