/**
 * 금융상품정보
 */

var page = {
		layoutID : "#B02OLayout",
		isSC : undefined, //SC 여부
		isManager : undefined, //관리자 여부(Agent만 해당)
		userId : undefined, //사용자ID
		carInfo : {}, //차량정보
		scCarInfo : {}, //초기에 SC로부터 받은 차량정보
		B02OFinancialInfo : {}, //운용리스 금융상품정보
		B02FFinancialInfo : {}, //금융리스 금융상품정보
		B02LFinancialInfo : {}, //할부금융 금융상품정보
		billing : 0, //계산된 프로모션 청구면제금액
		scParam : undefined, //SC 파라미터(SC만 해당)
		carAmt : undefined, //차량가(전역으로 저장)
		init : function()
		{
			page.initData();
			page.initInterface();
		},
		
		initData : function()
		{
			//back으로 온 경우 해당 화면 html code 표시 및 page변수 data 저장
			var htmlCode = window.sessionStorage["102htmlCode"];
			if(htmlCode != undefined && htmlCode != ""){
				$("#sub_content").html(htmlCode);
				var pageData = $.parseJSON($("#pageData").val());
				page.layoutID = pageData.layoutID;
				page.carInfo = pageData.carInfo;
				page.scCarInfo = pageData.scCarInfo;
				page.B02OFinancialInfo = pageData.B02OFinancialInfo;
				page.B02FFinancialInfo = pageData.B02FFinancialInfo;
				page.B02LFinancialInfo = pageData.B02LFinancialInfo;
				page.billing = pageData.billing;
				page.scParam = pageData.scParam;
				page.carAmt = pageData.carAmt;
			}
			
			//기본정보 저장
			page.isSC = $("#is_SC").val();
			page.isManager = $("#is_Manager").val();
			page.userId = $("#user_id").val();
			page.carInfo.carKubun = $("#car_kubun").val(); //자동차 구분
			page.carInfo.brandCd = $("#brand_cd").val();
			page.carInfo.dealerId = $("#dealer_id").val(); //딜러 ID
			page.carInfo.modelCd = $("#model_cd").val(); //차량모델 코드
			page.carInfo.modelNm = $("#model_nm").val(); //차량모델명
			page.carInfo.carTaxM = $("#car_tax_m").val().bMToNumber(); //차량세(월)
			page.carInfo.carAmt = $("#car_amt").val().bMToNumber(); //차량가
			page.carInfo.totalAmt = $("#total_amt").val().bMToNumber(); //총금액
			page.carInfo.disCarAmt = $("#dis_car_amt").val().bMToNumber(); //할인금액
			page.carInfo.regtaxAmt = $("#regtax_amt").val().bMToNumber(); //등록세
			page.carInfo.acqtaxAmt = $("#acqtax_amt").val().bMToNumber(); //취득세
			page.carInfo.pubbondAmt = $("#pubbond_amt").val().bMToNumber(); //공채
			page.carInfo.disHybrid = $("#dis_hybrid").val().bMToNumber(); //하이브리드 감면
			page.carInfo.publDebtPurcRate = $("#publ_debt_purc_rate").val().bMToNumber(); //공채매입율
			page.carInfo.publDebtDiscRate = $("#publ_debt_disc_rate").val().bMToNumber(); //공채할인율
			page.carInfo.extraChrgAmt = $("#extra_chrg_amt").val().bMToNumber(); //부대비용
			page.carInfo.hybRdctYn = $("#hyb_rdct_yn").val(); //하이브리드 여부
			page.carInfo.rvYn = $("#rv_yn").val(); //잔가및유예여부
			page.carInfo.idntInfo = $("#idnt_info").val(); //견적식별정보
			page.carInfo.mdelYear = $("#mdel_year").val(); //연식
			page.scParam = $("#sc_param").val();
			page.carAmt = $("#car_amt").val().bMToNumber();
			
			//차량모델명, 견적식별정보 표시
			$("#carName").text(page.carInfo.modelNm);
			$("#idntInfo").text(page.carInfo.idntInfo);
			
			if(page.isSC == "Y"){
				$("#btn_menu").hide();
				page.scCarInfo = $.parseJSON(decodeURIComponent($("#sc_car_info").val()).replace(/\+/gi, " "));
			}
			
			//관리자인 경우 메뉴 통계버튼 show
			if(page.isManager == "Y"){
				$(".btn_menu[value=4]").show();
			}
			
			if(htmlCode == undefined || htmlCode == ""){
				//이용금액 표시
				$(".inp_leasUtilAmt", "#B02OLayout").val((""+page.carInfo.totalAmt).bMToCommaNumber());
				$(".inp_leasUtilAmtView", "#B02OLayout").val((""+page.carInfo.totalAmt).bMToCommaNumber()); //단순 표시 목적(운용리스)
				$(".inp_leasUtilAmt", "#B02FLayout").val((""+page.carInfo.carAmt).bMToCommaNumber());
				$(".inp_leasUtilAmt", "#B02LLayout").val((""+page.carInfo.carAmt).bMToCommaNumber());
				
				//금융리스, 할부금융 선수율 30%로 초기화
				$(".inp_advsPaidAmtPer", "#B02LLayout, #B02FLayout").val("30");
				var car_amt = page.carInfo.carAmt.bMToNumber() - page.carInfo.disCarAmt.bMToNumber();
				var result = Math.floor(car_amt*0.3);
				$(".inp_advsPaidAmt", "#B02LLayout, #B02FLayout").val((""+result).bMToCommaNumber());
				$(".inp_leasUtilAmt", "#B02LLayout, #B02FLayout").val((""+(car_amt-result)).bMToCommaNumber());
				
				page.getTermList();
			}
			
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
			
			//숫자 입력시 "," 처리
			$("input").bind("keyup", function(){
				var value = $(this).val();
				if($(this).attr("type") == "tel"){
					$(this).val(value.bMToCommaNumber());
				}
			});
			
			//SC 커미션, 이자율 focus시 전체선택
			$(".inp_jiScPerRate, .inp_intRate").bind("focus", function(){
			    var save_this = $(this);
			    window.setTimeout(function(){ 
			       save_this.select(); 
			    },100);
			});
			
			//초기화 버튼
			$("#btn_reset").bind("click", function(){
				$("input[type=text]", page.layoutID).val("");
				$("input[type=tel]").val("");
				if(page.layoutID == "#B02OLayout"){ //운용리스인 경우
					$(".inp_leasUtilAmt", page.layoutID).val(page.carInfo.totalAmt);
				}else{ //금융리스, 할부금융인 경우
					$(".inp_leasUtilAmt", page.layoutID).val(page.carInfo.carAmt);
				}
				$(".slt_term option:eq(0)", page.layoutID).attr("selected", "selected");
				$(".slt_sdRate option", page.layoutID).empty();
				$(".slt_remainingVal option", page.layoutID).empty();
				
				$(".slt_promotion option:eq(0)", page.layoutID).attr("selected", "selected");
				$(".atSubsidy", page.layoutID).text("0원");
				
				$(".prerelPayAmt", page.layoutID).text("0원");
				$(".monthDueAmt", page.layoutID).text("0원");
				
				page.initData();
				$(".slt_promotion", page.layoutID).trigger("change");
			});
			
			//금융상품 change
			$(".slt_financial").bind("change", function(){
				var financialVal = $(this).val();
				
				//단말기에서 selectbox selected attr script 적용시 원활히 되지 않는 부분 처리 위함
				$("option", ".slt_financial").remove();
				$(".slt_financial").append("<option value='B02O'>운용리스</option>");
				$(".slt_financial").append("<option value='B02F'>금융리스</option>");
				$(".slt_financial").append("<option value='B02L'>할부금융</option>");
				$("option[value="+financialVal+"]", ".slt_financial").attr("selected", "selected");
				
				page.carInfo.carAmt = page.carAmt; //차량가 초기화
				
				if(financialVal == "B02O"){ //운용리스
					page.layoutID = "#B02OLayout";
					$("#B02FLayout").hide();
					$("#B02LLayout").hide();
					$("#B02OLayout").show();
					
					if(page.B02OFinancialInfo.prod_type == undefined) page.getTermList();
				}else if(financialVal == "B02F"){ //금융리스
					page.layoutID = "#B02FLayout";
					$("#B02OLayout").hide();
					$("#B02LLayout").hide();
					$("#B02FLayout").show();
					
					//차량가가 기본차량가-차량할인금액이 되도록
					page.carInfo.carAmt = page.carAmt.bMToNumber() - page.carInfo.disCarAmt.bMToNumber();
					
					if(page.B02FFinancialInfo.prod_type == undefined) page.getTermList();
				}else if(financialVal == "B02L"){ //할부금융
					page.layoutID = "#B02LLayout";
					$("#B02OLayout").hide();
					$("#B02FLayout").hide();
					$("#B02LLayout").show();
					
					//차량가가 기본차량가-차량할인금액이 되도록
					page.carInfo.carAmt = page.carAmt.bMToNumber() - page.carInfo.disCarAmt.bMToNumber();
					
					if(page.B02LFinancialInfo.prod_type == undefined) page.getTermList();
				}
			});
			
			//리스이용금액(이용금액), 선납금(선수금) keyup
			$(".inp_leasUtilAmt, .inp_advsPaidAmt").bind("keyup", function(){
				page.resetMonthDueAmt();
				
				var financialVal = $(".slt_financial", page.layoutID).val();
				var result = 0;
				var advsPaidAmtPer = 0; //선납금(선수금) 요율
				
				if($(this).hasClass("inp_leasUtilAmt")){ //리스이용금액(이용금액) keyup일시
					if(financialVal == "B02O"){ //운용리스
						result = page.carInfo.totalAmt-$(this).val().bMToNumber();
						$(".inp_advsPaidAmt", page.layoutID).val((""+result).bMToCommaNumber());
						
						advsPaidAmtPer = Math.round($(".inp_advsPaidAmt", page.layoutID).val().bMToNumber()/page.carInfo.totalAmt*100);
					} else{ //금융리스, 할부금융
						result = page.carInfo.carAmt-$(this).val().bMToNumber();
						$(".inp_advsPaidAmt", page.layoutID).val((""+result).bMToCommaNumber());
						
						advsPaidAmtPer = Math.round($(".inp_advsPaidAmt", page.layoutID).val().bMToNumber()/page.carInfo.carAmt*100);
					}
					$(".inp_advsPaidAmtPer", page.layoutID).val(advsPaidAmtPer);
					
				}else if($(this).hasClass("inp_advsPaidAmt")){ //선납금(선수금) keyup일시
					if(financialVal == "B02O"){ //운용리스
						result = page.carInfo.totalAmt-$(this).val().bMToNumber();
						advsPaidAmtPer = Math.round($(".inp_advsPaidAmt", page.layoutID).val().bMToNumber()/page.carInfo.totalAmt*100);
						
					} else{ //금융리스, 할부금융
						result = page.carInfo.carAmt-$(this).val().bMToNumber();
						advsPaidAmtPer = Math.round($(".inp_advsPaidAmt", page.layoutID).val().bMToNumber()/page.carInfo.carAmt*100);
					}
					$(".inp_leasUtilAmt", page.layoutID).val((""+result).bMToCommaNumber());
					$(".inp_advsPaidAmtPer", page.layoutID).val(advsPaidAmtPer);
				}
				
				//보증금, 잔가, SC커미션, 출고전(초기) 납입금액 재계산 표시(리스이용금액으로 영향받는 항목들)
				$(".inp_sdAmt", page.layoutID).val((""+page.calc("sdRate")).bMToCommaNumber());
				$(".inp_remainingVal", page.layoutID).val((""+page.calc("remainingVal")).bMToCommaNumber());
				$(".inp_jiScPer", page.layoutID).val((""+page.calc("jiScPerRate")).bMToCommaNumber());
				$(".prerelPayAmt", page.layoutID).text((""+page.calc("prerelPayAmt")).bMToCommaNumber()+"원");
				
			});
			
			//선납금(선수금) 요율 keyup
			$(".inp_advsPaidAmtPer").bind("keyup", function(){
				var value = $(this).val().bMToNumber()/100;
				
				if(value > 1){
					alert("선납금(선수금)요율은 100%보다 클 수 없습니다.");
					$(this).val("");
					value = 0;
				}
				
				var financialVal = $(".slt_financial", page.layoutID).val();
				var result = 0;
				
				//선수금 변경
				if(financialVal == "B02O"){ //운용리스
					result = Math.floor(page.carInfo.totalAmt*value);
				} else{ //금융리스, 할부금융
					result = Math.floor(page.carInfo.carAmt*value);
				}
				$(".inp_advsPaidAmt", page.layoutID).val((""+result).bMToCommaNumber());
				
				//리스이용금액 변경
				if(financialVal == "B02O"){ //운용리스
					result = page.carInfo.totalAmt-$(".inp_advsPaidAmt", page.layoutID).val().bMToNumber();
				} else{ //금융리스, 할부금융
					result = page.carInfo.carAmt-$(".inp_advsPaidAmt", page.layoutID).val().bMToNumber();
				}
				$(".inp_leasUtilAmt", page.layoutID).val((""+result).bMToCommaNumber());
				
				//보증금, 잔가, SC커미션, 출고전(초기) 납입금액 재계산 표시(리스이용금액으로 영향받는 항목들)
				$(".inp_sdAmt", page.layoutID).val((""+page.calc("sdRate")).bMToCommaNumber());
				$(".inp_remainingVal", page.layoutID).val((""+page.calc("remainingVal")).bMToCommaNumber());
				$(".inp_jiScPer", page.layoutID).val((""+page.calc("jiScPerRate")).bMToCommaNumber());
				$(".prerelPayAmt", page.layoutID).text((""+page.calc("prerelPayAmt")).bMToCommaNumber()+"원");
				
				//월불입금, 총월불입금 초기화
				page.resetMonthDueAmt();
			});
			
			//리스이용금액, 선수율, 선수금 focusout
			$(".inp_leasUtilAmt, .inp_advsPaidAmtPer, .inp_advsPaidAmt").bind("focusout", function(){
				//금융리스, 할부금융인 경우 리스이용금액 만단위 표시
				if(page.layoutID != "#B02OLayout"){ //금융리스, 할부금융
					var leasUtilAmt = $(".inp_leasUtilAmt", page.layoutID).val().bMToNumber()+"";
					var value = leasUtilAmt.substring(leasUtilAmt.length-4).bMToNumber();
					var advsPaidAmt = $(".inp_advsPaidAmt", page.layoutID).val().bMToNumber();
					
					$(".inp_leasUtilAmt", page.layoutID).val((""+(leasUtilAmt-value)).bMToCommaNumber());
					$(".inp_advsPaidAmt", page.layoutID).val((""+(advsPaidAmt+value)).bMToCommaNumber());
				}
			});
			
			//기간 selectbox change
			$(".slt_term").bind("change", function(){
				if(page.layoutID == "#B02OLayout"){ //운용리스
					page.getSdRateList();
				}else { //금융리스, 할부금융
					page.getRvRateList();
				}
			});
			
			//보증금 selectbox change
			$(".slt_sdRate").bind("change", function(){
				$(".inp_sdAmt", page.layoutID).val((""+page.calc("sdRate")).bMToCommaNumber());
				page.getRvRateList();
				//운용리스인 경우에만 출고전(초기) 납입금액 재계산 표시
				if(page.layoutID == "#B02OLayout") $(".prerelPayAmt", page.layoutID).text((""+page.calc("prerelPayAmt")).bMToCommaNumber()+"원");
			});
			
			//잔가 selectbox change
			$(".slt_remainingVal").bind("change", function(){
				$(".inp_remainingVal", page.layoutID).val((""+page.calc("remainingVal")).bMToCommaNumber());
				page.getFinancialData();
			});
			
			//SC커미션 focusout
			$(".inp_jiScPerRate").bind("focusout", function(){
				page.resetMonthDueAmt();
				
				var value = $(this).val().bMToNumber();
				var scFee = $(this).attr("sc_fee");
				
				//0보다 커야함
				if(value < 0){
					alert("SCP는 0보다 커야 합니다.");
					$(this).val(scFee);
					return false;
				}
				
				//소수점 첫번째자리까지만 허용
				if((""+(value*10)).indexOf(".") != -1){
					alert("소수점 첫째자리까지만 입력이 가능합니다.");
					$(this).val(scFee);
					return false;
				}
				
				//기본 SC커미션 값보다 작은 값만 입력 가능하도록
				if(value > scFee){
					alert("기존 SCP보다 큰 값을 입력할 수 없습니다.\n기존 SCP : " + scFee);
					$(this).val(scFee);
					$(".inp_jiScPer", page.layoutID).val((""+page.calc("jiScPerRate")).bMToCommaNumber());
				}else {
					$(".inp_jiScPer", page.layoutID).val((""+page.calc("jiScPerRate")).bMToCommaNumber());
				}
			});
			
			//이자율 keyup
			$(".inp_intRate").bind("keyup", function(){
				page.resetMonthDueAmt();
				
				var value = $(this).val();
				
				//소수점 두번째자리까지만 허용
				var arr = value.split(".");
				if((arr[1]!=undefined) && (arr[1].length>2)){
					alert("소수점 두번째자리까지만 입력이 가능합니다.");
					$(this).val("");
					return false;
				}
			});
			
			//추가보조금 keyup
			$(".inp_atSubsidyAdd").bind("keyup", function(){
				page.resetMonthDueAmt();
				
				var value = $(this).val().bMToNumber();
				
				//0보다 크고 20000000보다 작아야 함
				if(value<0 || value>20000000){
					alert("추가보조금은 0보다 크고 20,000,000보다 작아야 합니다.");
					$(".totAtSubsidy", page.layoutID).text($(".atSubsidy", page.layoutID).text());
					$(this).val("");
					return false;
				}
				
				var atSubsidy = $(".atSubsidy", page.layoutID).text().bMToNumber();
				$(".totAtSubsidy", page.layoutID).text((""+(value+atSubsidy)).bMToCommaNumber()+"원");
			});
			
			//프로모션 selectbox change
			$(".slt_promotion").bind("change", function(){
				page.resetMonthDueAmt();

				var financialInfo = {};
				if(page.layoutID == "#B02OLayout"){
					financialInfo = page.B02OFinancialInfo;
				}else if(page.layoutID == "#B02FLayout"){
					financialInfo = page.B02FFinancialInfo;
				}else if(page.layoutID == "#B02LLayout"){
					financialInfo = page.B02LFinancialInfo;
				}
				var promotionData = undefined;
				
				//운용리스인 경우, 리스이용금액 재표시, 보증금/잔가 재계산
				if(page.layoutID == "#B02OLayout"){
					var advsPaidAmt = $(".inp_advsPaidAmt", page.layoutID).val().bMToNumber();
					$(".inp_leasUtilAmt", page.layoutID).val((""+(page.carInfo.totalAmt.bMToNumber()-advsPaidAmt)).bMToCommaNumber());
					$(".inp_leasUtilAmtView", page.layoutID).val((""+page.carInfo.totalAmt).bMToCommaNumber());
					$(".inp_sdAmt", page.layoutID).val((""+page.calc("sdRate")).bMToCommaNumber());
					$(".inp_remainingVal", page.layoutID).val((""+page.calc("remainingVal")).bMToCommaNumber());
				}
				
				//전체보조금, 추가보조금, 보조금 초기화
				$(".totAtSubsidy", page.layoutID).text("0원");
				$(".atSubsidy", page.layoutID).text("0원");
				$(".inp_atSubsidyAdd", page.layoutID).val("");
				
				if($("option:selected", this).index() == 0){ //일반상품
					$(".promotion_sub_content", page.layoutID).hide();
					$(".btn_calcMonthDueAmt", page.layoutID).show();
					
					//SC 커미션 표시, 재계산
					$(".inp_jiScPerRate", page.layoutID).attr("sc_fee", financialInfo.sc_fee.bMToNumber());
					$(".inp_jiScPerRate", page.layoutID).val(financialInfo.sc_fee.bMToNumber());
					$(".inp_jiScPer", page.layoutID).val((""+page.calc("jiScPerRate")).bMToCommaNumber());
					
					//이자율 표시
					$(".inp_intRate", page.layoutID).val(financialInfo.int_rate.bMToNumber());
					//이자율, 추가보조금 inputbox 비활성화
					$(".inp_intRate", page.layoutID).attr("disabled", "disabled");
					$(".inp_atSubsidyAdd", page.layoutID).attr("disabled", "disabled");
				}else { //프로모션상품
					promotionData = $.parseJSON($("option:selected", this).attr("promotionData"));
					
					//초기(출고전)납입금액
					$(".prerelPayAmt", page.layoutID).text((""+page.calc("prerelPayAmt")).bMToCommaNumber()+"원");
					
					//SC 커미션 표시, 재계산
					$(".inp_jiScPerRate", page.layoutID).attr("sc_fee", promotionData.pro_ji_sc_per.bMToNumber());
					$(".inp_jiScPerRate", page.layoutID).val(promotionData.pro_ji_sc_per.bMToNumber());
					$(".inp_jiScPer", page.layoutID).val((""+page.calc("jiScPerRate")).bMToCommaNumber());
					
					if(promotionData.dealer_pro_yn == "Y"){ //보조금 항목, 월불입금 계산 버튼 show/hide, 월불입금 계산 표시
						$(".promotion_sub_content", page.layoutID).show();
						$(".totAtSubsidy", page.layoutID).text((""+(promotionData.at_subsidy_tmkr.bMToNumber()+promotionData.at_subsidy_dealer.bMToNumber())).bMToCommaNumber()+"원");
						$(".atSubsidy", page.layoutID).text((""+(promotionData.at_subsidy_tmkr.bMToNumber()+promotionData.at_subsidy_dealer.bMToNumber())).bMToCommaNumber()+"원");
						//이자율 계산 효과
						if(page.checkBeforeCalcMonthDueAmt()){
							var dealerProCalcType = page.checkDealerProCalc();
							var data = "";
							if(dealerProCalcType == "PMT"){
								data = page.calc("dealerProMonthDueAmt");
								$(".inp_intRate", page.layoutID).val(data.intRate);
								$(".monthDueAmt", page.layoutID).text((""+data.monthDueAmt).bMToCommaNumber()+"원");
							}else if(dealerProCalcType == "IRR"){
								data = page.calc("intRate");
								$(".inp_intRate", page.layoutID).val(data.intRate);
								$(".monthDueAmt", page.layoutID).text((""+data.monthDueAmt).bMToCommaNumber()+"원");
							}
						}
						
						page.setCarTaxMonthDueAmt();
						
						$(".btn_calcMonthDueAmt", page.layoutID).hide();
						
						//이자율, 추가보조금 inputbox 활성화
						$(".inp_intRate", page.layoutID).removeAttr("disabled");
						$(".inp_atSubsidyAdd", page.layoutID).removeAttr("disabled");
					}else {
						$(".promotion_sub_content", page.layoutID).hide();
						$(".btn_calcMonthDueAmt", page.layoutID).show();
						
						//이자율, 추가보조금 inputbox 비활성화
						$(".inp_intRate", page.layoutID).attr("disabled", "disabled");
						$(".inp_atSubsidyAdd", page.layoutID).attr("disabled", "disabled");
					}
					if(promotionData.at_cost_tfskr == "" || promotionData.at_cost_tfskr == "0"){ //물품지급금액 항목 show/hide
						$(".promotion_sub_pay_content", page.layoutID).hide();
					}else {
						$(".promotion_sub_pay_content", page.layoutID).show();
						$(".inp_paymentAmt", page.layoutID).val((""+promotionData.at_cost_tfskr).bMToCommaNumber());
						$(".paymentAmtDetail", page.layoutID).text(promotionData.at_cost_detail);
					}
					//등/취/공 감면 프로모션인 경우 화면 data 재계산하여 표시
					if(promotionData.regtax_reduc_yn=="Y" || promotionData.acqtax_reduc_yn=="Y" || promotionData.pubbond_reduc_yn=="Y"){
						var regtax_deduct_amt = promotionData.regtax_reduc_yn=="Y" ? getDeductAmt("regtax", promotionData.regtax_calcul_way, promotionData.regtax_deduct_amt, promotionData.regtax_target_amt, promotionData.regtax_deduct_rate) : 0; //등록세 차감금액
						var acqtax_deduct_amt = promotionData.acqtax_reduc_yn=="Y" ? getDeductAmt("acqtax", promotionData.acqtax_calcul_way, promotionData.acqtax_deduct_amt, promotionData.acqtax_target_amt, promotionData.acqtax_deduct_rate) : 0; //취득세 차감금액
						var pubbond_deduct_amt = promotionData.pubbond_reduc_yn=="Y" ? getDeductAmt("pubbond", promotionData.pubbond_calcul_way, promotionData.pubbond_deduct_amt, promotionData.pubbond_target_amt, promotionData.pubbond_deduct_rate) : 0; //공채 차감금액
						//리스이용금액(운용리스 경우만)
						if(page.layoutID == "#B02OLayout"){
							var advsPaidAmt = $(".inp_advsPaidAmt", page.layoutID).val().bMToNumber(); //선수금
							var leasUtilAmt = page.carInfo.totalAmt - regtax_deduct_amt - acqtax_deduct_amt - pubbond_deduct_amt; //등취공 감면된 리스이용금액
							$(".inp_leasUtilAmt", page.layoutID).val((""+(leasUtilAmt-advsPaidAmt)).bMToCommaNumber());
							$(".inp_leasUtilAmtView", page.layoutID).val((""+leasUtilAmt).bMToCommaNumber());
						}
						//보증금
						$(".inp_sdAmt", page.layoutID).val((""+page.calc("sdRate")).bMToCommaNumber());
						//잔가(유예)
						$(".inp_remainingVal", page.layoutID).val((""+page.calc("remainingVal")).bMToCommaNumber());
						//SC커미션
						$(".inp_jiScPer", page.layoutID).val((""+page.calc("jiScPerRate")).bMToCommaNumber());						
						//초기(출고전)납입금액
						$(".prerelPayAmt", page.layoutID).text((""+page.calc("prerelPayAmt")).bMToCommaNumber()+"원");
						//월불입금
						$(".btn_calcMonthDueAmt", page.layoutID).trigger("click");
					}
				}
			});
			
			//이자율 계산 버튼
			$(".btn_calcIntRate").bind("click", function(){
				
				if(page.checkBeforeCalcMonthDueAmt()){
					var totAtSubsidy = $(".totAtSubsidy", page.layoutID).text().bMToNumber();
					var atSubsidy = $(".atSubsidy", page.layoutID).text().bMToNumber();
					var atSubsidyAdd = $(".inp_atSubsidyAdd", page.layoutID).val().bMToNumber();
					if(totAtSubsidy < atSubsidy){
						alert("전체보조금은 보조금보다 커야 합니다.");
						$(".totAtSubsidy", page.layoutID).text("0원");
						$(".inp_atSubsidyAdd", page.layoutID).val("");
						return false;
					}
					if(atSubsidyAdd!=0 && atSubsidyAdd<50000){
						alert("추가보조금은 50,000원 이상이어야 합니다.");
						return false;
					}
					
					//이자율, 월불입금, 월불입금(차세포함) 표시
					var dealerProCalcType = page.checkDealerProCalc();
					var data = "";
					if(dealerProCalcType == "PMT"){
						data = page.calc("dealerProMonthDueAmt");
						$(".inp_intRate", page.layoutID).val(data.intRate);
						$(".monthDueAmt", page.layoutID).text((""+data.monthDueAmt).bMToCommaNumber()+"원");
					}else if(dealerProCalcType == "IRR"){
						data = page.calc("intRate");
						$(".inp_intRate", page.layoutID).val(data.intRate);
						$(".monthDueAmt", page.layoutID).text((""+data.monthDueAmt).bMToCommaNumber()+"원");
					}
					
					//이자율이 0으로 나온 경우 전체보조금 계산
					if(data.intRate == 0){
						$(".btn_calcTotAtSubsidy", page.layoutID).trigger("click");
					}
					
					page.setCarTaxMonthDueAmt();
				}
				
			});
			
			//전체보조금 계산 버튼
			$(".btn_calcTotAtSubsidy").bind("click", function(){
				
				if(page.checkBeforeCalcMonthDueAmt()){
					var resultData = page.calc("totAtSubsidy");
					
					//추가보조금
					$(".inp_atSubsidyAdd", page.layoutID).val((""+resultData.atSubsidy).bMToCommaNumber());
					//전체보조금
					var totAtSubsidy = $(".atSubsidy", page.layoutID).text().bMToNumber()+resultData.atSubsidy;
					$(".totAtSubsidy", page.layoutID).text((""+totAtSubsidy).bMToCommaNumber()+"원");
					//월불입금, 월불입금(차세포함)
					$(".monthDueAmt", page.layoutID).text((""+resultData.monthDueAmt).bMToCommaNumber()+"원");
					page.setCarTaxMonthDueAmt();
				}
			});
			
			//월불입금 계산 버튼
			$(".btn_calcMonthDueAmt").bind("click", function(){
				
				if(page.checkBeforeCalcMonthDueAmt()){
					//프로모션 상품 구분에 따라 월불입금 계산 막기
					var financialInfo = {};
					if(page.layoutID == "#B02OLayout"){
						financialInfo = page.B02OFinancialInfo;
					}else if(page.layoutID == "#B02FLayout"){
						financialInfo = page.B02FFinancialInfo;
					}else if(page.layoutID == "#B02LLayout"){
						financialInfo = page.B02LFinancialInfo;
					}
					if($(".slt_promotion option:selected", page.layoutID).index() == 0){
						if(financialInfo.promotion_yn == "Y"){
							alert("선택한 유예율은 일반상품에는 적용되지 않습니다.");
							return false;
						}
					}
					
					if(page.layoutID == "#B02OLayout"){ //운용리스
						//선납금+보증금이 리스이용금액의 60%가 넘으면 안됨
						var standardLeasUtilAmt = Math.round(page.carInfo.totalAmt.bMToNumber()*0.6);
						var value = $(".inp_advsPaidAmt", page.layoutID).val().bMToNumber() + $(".inp_sdAmt", page.layoutID).val().bMToNumber();
						if(value > standardLeasUtilAmt){
							page.resetMonthDueAmt();
							alert("선납금과 보증금 합계가 리스이용금액의 60%를 넘을 수 없습니다.");
							return false;
						}
					}else { //금융리스, 할부금융
						//이용금액이 10,000,000만원 미만이면 안됨
						if($(".inp_leasUtilAmt", page.layoutID).val().bMToNumber() < 10000000){
							page.resetMonthDueAmt();
							alert("이용금액은 10,000,000만원 이상이어야 합니다.");
							return false;
						}
						
						//유예금이 화면의 이용금액보다 크면 안됨
						var remainingVal = $(".inp_remainingVal", page.layoutID).val().bMToNumber();
						var leasUtilAmt = $(".inp_leasUtilAmt", page.layoutID).val().bMToNumber();
						if(remainingVal >= leasUtilAmt){
							page.resetMonthDueAmt();
							alert("유예금이 이용금액보다 크거나 같을 수 없습니다.");
							return false;
						}
						
						//할부금융, 렉서스(L), 유예율 60/65, 일반상품인 경우 계산 막음
						if(page.layoutID == "#B02LLayout"){ //할부금융
							if(page.carInfo.brandCd == "L"){
								if($(".slt_remainingVal", page.layoutID).val()=="0.6" || $(".slt_remainingVal", page.layoutID).val()=="0.65"){
									if($(".slt_promotion option:selected", page.layoutID).index() == 0){
										page.resetMonthDueAmt();
										alert("해당상품은 일반상품에서 지원되지 않는 유예율입니다.");
										return false;
									}
								}
							}
						}
						
					}
					
					//월불입금, 총월불입금, 출고전 납입금액 표시
					$(".monthDueAmt", page.layoutID).text((""+page.calc("monthDueAmt")).bMToCommaNumber()+"원");
					page.setCarTaxMonthDueAmt();
					$(".prerelPayAmt", page.layoutID).text((""+page.calc("prerelPayAmt")).bMToCommaNumber()+"원");
				}
				
			});
			
			//차세 포함/미포함 버튼
			$(".btn_on_off").bind("click", function(){
				$(this).toggleClass("tbtn_off");
				
				//총월불입금 계산 표시
				if($(this).hasClass("tbtn_off")){
					$(".carTaxMonthDueAmt", page.layoutID).text($(".monthDueAmt", page.layoutID).text());
				}else {
					if($(".monthDueAmt", page.layoutID).text() == "0원"){
						alert("월불입금을 먼저 계산해주세요.");
						$(this).toggleClass("tbtn_off");
					}else {
						$(".carTaxMonthDueAmt", page.layoutID).text((""+page.calc("carTaxMonthDueAmt")).bMToCommaNumber()+"원");
					}
				}
				
			});
			
			//이전 버튼
			$("#btn_before").bind("click", function(){
				if(confirm("입력하신 정보는 초기화됩니다.\n진행하시겠습니까?")){
					
					window.sessionStorage["isHistoryBack"] = "Y";
					
					if(page.isSC == "Y"){
						history.back();
					}else {
						bizMOB_Android.back();
					}
				}else {}
			});
			
			//다음 버튼
			$("#btn_next").bind("click", function(){
				
				//리스이용금액 0보다 크고 리스이용금액보다 작아야 함, 선수율/선납금 0보다 커야함
				if($(".inp_leasUtilAmt", page.layoutID).val().bMToNumber() < 0){
					alert("리스이용금액(이용금액)이 0보다 작을 수 없습니다.");
					return false;
				}
				if($(".inp_advsPaidAmt", page.layoutID).val().bMToNumber() < 0){
					alert("선수금(선납금)이 0보다 작을 수 없습니다.");
					return false;
				}
				if($(".inp_advsPaidAmtPer", page.layoutID).val().bMToNumber() < 0){
					alert("선수율이 0보다 작을 수 없습니다.");
					return false;
				}
				
				var financialInfo = {};
				if(page.layoutID == "#B02OLayout"){
					financialInfo = page.B02OFinancialInfo;
				}else if(page.layoutID == "#B02FLayout"){
					financialInfo = page.B02FFinancialInfo;
				}else if(page.layoutID == "#B02LLayout"){
					financialInfo = page.B02LFinancialInfo;
				}
				
				var promotionData = undefined;
				if($(".slt_promotion option:selected", page.layoutID).attr("promotionData") != undefined){
					promotionData = $.parseJSON($(".slt_promotion option:selected", page.layoutID).attr("promotionData"));
					$.extend(true, promotionData, { billing : page.billing });
				}
				
				//back으로 온 경우 화면 표시를 위해 해당 화면 html code 및 page변수 저장
				$("input").each(function(){ //해당 코드가 없으면 저장한 html code를 화면에 보일 때 input의 value값이 보여지지 않음
					$(this).attr("value", $(this).val());
				});
				$("select").each(function(){ //해당 코드가 없으면 저장한 html code를 화면에 보일 때 선택한 select가 보여지지 않음
					var index = $("option:selected", this).index();
					$("option:eq("+index+")", this).attr("selected", "selected");
					$("option", this).not(":eq("+index+")").removeAttr("selected");
				});
				var pageData = {
						layoutID : page.layoutID,
						carInfo : page.carInfo,
						scCarInfo : page.scCarInfo,
						B02OFinancialInfo : page.B02OFinancialInfo,
						B02FFinancialInfo : page.B02FFinancialInfo,
						B02LFinancialInfo : page.B02LFinancialInfo,
						billing : page.billing,
						scParam : page.scParam,
						carAmt : page.carAmt
				};
				$("#pageData").val(JSON.stringify(pageData));
				window.sessionStorage["102htmlCode"] = $("#sub_content").html();
				
				if($(".monthDueAmt", page.layoutID).text() == "0원"){
					alert("월불입금을 계산해주세요.");
					return false;
				}
				
				var carTaxYn = "N";
				if(page.layoutID=="#B02OLayout" || page.layoutID=="#B02FLayout"){
					carTaxYn = $(".btn_on_off", page.layoutID).hasClass("tbtn_off") ? "N" : "Y";
				}
				
				var params = {
						is_SC : $("#is_SC").val(),
						is_Manager : $("#is_Manager").val(),
						user_id : page.userId,
						layout_id : page.layoutID,
						car_info : JSON.stringify(page.carInfo),
						promotion_data : promotionData==undefined ? "{}" : JSON.stringify(promotionData),
						car_tax_month_due_amt : $(".btn_on_off", page.layoutID).hasClass("tbtn_off") ? "" : $(".carTaxMonthDueAmt", page.layoutID).text(), //총월불입금(차세)
						customer_pro_name : promotionData==undefined ? "" : promotionData.customer_pro_name, //프로모션 명(고객)
						result_data : JSON.stringify({
							is_sc : page.isSC,
							sc_param : page.scParam,
							month_due_amt : $(".monthDueAmt", page.layoutID).text().bMToNumber(), //월 불입금
							prerel_pay_amt : $(".prerelPayAmt", page.layoutID).text().bMToNumber(), //출고 전 납입금액
							payment_amt : $(".paymentAmtDetail", page.layoutID).text().bMToNumber(), //물품 지급금액
							pro_no : promotionData==undefined ? "" : promotionData.pro_no, //프로모션 번호
							irr : promotionData==undefined ? financialInfo.irr.bMToNumber() : promotionData.pro_irr.bMToNumber(), //IRR
							sd_amt : page.layoutID=="#B02OLayout" ? $(".inp_sdAmt", page.layoutID).val().bMToNumber() : 0, //보증금(운용리스)
							sd_rate : $(".slt_sdRate option[selected=selected]", page.layoutID).text().bMToNumber(), //보증금 율
							term : $(".slt_term option[selected=selected]", page.layoutID).text().bMToNumber(), //기간(운용리스)
							advs_paid_amt : $(".inp_advsPaidAmt", page.layoutID).val().bMToNumber(), //선납금
							leas_util_amt : page.layoutID=="#B02OLayout" ? $(".inp_leasUtilAmtView", page.layoutID).val().bMToNumber() : $(".inp_leasUtilAmt", page.layoutID).val().bMToNumber(), //리스 이용 금액
							extra_chrg_amt : page.carInfo.extraChrgAmt.bMToNumber(), //부대 비용
							publ_debt_disc_rate : page.carInfo.publDebtDiscRate.bMToNumber(), //공채 할인율
							publ_debt_pure_rate : page.carInfo.publDebtPurcRate.bMToNumber(), //공채 매입율
							hyb_rdct_amt : page.carInfo.disHybrid, //하이브리드 감면액
							pubbond_amt : page.carInfo.pubbondAmt.bMToNumber(), //공채 금액
							acqtax_amt : page.carInfo.acqtaxAmt.bMToNumber(), //취득세
							regtax_amt : page.carInfo.regtaxAmt.bMToNumber(), //등록세
							disc_car_amt : page.carInfo.disCarAmt.bMToNumber(), //할인 차량 금액
							car_cd : page.carInfo.brandCd=="T" ? "A272" : "A271", //차량 코드 A271 렉서스, A272 토요타
							tmkr_car_amt : page.isSC=="Y" ? page.scCarInfo.carAmt : 0, //TMKR 차량 금액
							tmkr_sales_type : page.isSC=="Y" ? page.scCarInfo.salesType : "", //TMKR 판매 유형
							tmkr_int_color : page.isSC=="Y" ? page.scCarInfo.intColorCd : "", //TMKR 내장 색상
							tmkr_ext_color : page.isSC=="Y" ? page.scCarInfo.extColorCd : "", //TMKR 외장색상
							tmkr_sfx_cd : page.isSC=="Y" ? page.scCarInfo.sfxCd : "", //TMKR Suffix 정보
							tmkr_displacement : page.isSC=="Y" ? page.scCarInfo.dispalcement : "", //TMKR 배기량
							tmkr_my_cd : page.isSC=="Y" ? page.scCarInfo.myCd : "", //TMKR 연식
							tmkr_model_cd : page.isSC=="Y" ? page.scCarInfo.modelCd : "", //TMKR 모델 코드
							tmkr_variant_cd : page.isSC=="Y" ? page.scCarInfo.variantCd : "", //TMKR 차종 코드
							idnt_info : page.isSC=="Y" ? page.scCarInfo.idntInfo : page.carInfo.idntInfo, //견적 식별 정보 - SC일 경우 고객 ID
							posp_rate: $(".slt_remainingVal option[selected=selected]", page.layoutID).text().bMToNumber(), //유예율
							posp_amt : $(".inp_remainingVal", page.layoutID).val().bMToNumber(), //유예 금액
							ji_sc_per_rate : $(".inp_jiScPerRate", page.layoutID).val().bMToNumber(), //SC 커미션 율
							ji_sc_per : $(".inp_jiScPer", page.layoutID).val().bMToNumber(), //SC 커미션 금액
							at_subsidy : promotionData==undefined ? "" : (promotionData.dealer_pro_yn=="Y" ? $(".atSubsidy", page.layoutID).text().bMToNumber() : 0), //보조금
							at_subsidy_add : promotionData==undefined ? "" : (promotionData.dealer_pro_yn=="Y" ? $(".inp_atSubsidyAdd", page.layoutID).val().bMToNumber() : 0), //추가 보조금
							int_rate : $(".inp_intRate", page.layoutID).val().bMToNumber(), //이자율
							mdel_cd : page.carInfo.modelCd, //차량모델 코드
							prod_type : financialInfo.prod_type, //상품구분
							car_tax_yn : carTaxYn, //차세 포함/불포함 여부
							pro_name : promotionData==undefined ? "" : promotionData.pro_name, //프로모션명
							hyb_rdct_yn : page.carInfo.hybRdctYn, //하이브리드 여부
							car_tax_m : page.carInfo.carTaxM.bMToNumber(), //월차세
							agent_fee : promotionData==undefined ? financialInfo.agent_fee.bMToNumber() : promotionData.agent_fee.bMToNumber(), //Agent 수수료
							dealer_fee : promotionData==undefined ? financialInfo.dealer_fee.bMToNumber() : promotionData.dealer_fee.bMToNumber(), //Dealer 수수료
							mdel_name : page.carInfo.modelNm, //모델명
							sun_su_gum : $(".inp_advsPaidAmt", page.layoutID).val().bMToNumber(), //선수금
							in_ji_dae : page.layoutID=="#B02LLayout" ? page.calcInjidae($(".inp_leasUtilAmt", page.layoutID).val().bMToNumber()) : 10000, //인지대
							dealer_pro_amt : $(".inp_atSubsidyAdd", page.layoutID).val().bMToNumber(), //프로모션 이손금 금액
							car_amt : page.carAmt.bMToNumber()-page.carInfo.disCarAmt.bMToNumber(), //차량가(금액)
							total_cost : page.carInfo.totalAmt.bMToNumber(), //총비용
							month_due_car_amt : $(".carTaxMonthDueAmt", page.layoutID).text().bMToNumber(), //월 불입금(차세포함)
							prod_name : financialInfo.prod_name //상품명
						})
				};
				$("#params").val(JSON.stringify(params));
				$("#nextForm").submit();
			});
		},
		
		//기간 리스트 조회
		getTermList : function()
		{
			var TFS113 = {
				header : { trcode : "TFS113", result : "true" },
				body : {
					com_kubun : "B0101", //지점구분 - B0101(하드코딩) 서울본사, B0102 분당지점
					car_kubun : page.carInfo.carKubun, //A271:렉서스 , A272:토요타
					prod_kubun : $(".slt_financial", page.layoutID).val() //상품구분 -  B02O(운용리스),B02F(금융리스),B02L(할부금융)
				}
			};
			ajaxPost("/bizmob/m/getTermList", TFS113, function(json) {
				if(json.header.result) {
					
					//기간 표시
					$(".slt_term", page.layoutID).empty();
					$(json.body.term_list).each(function(){
						$(".slt_term", page.layoutID).append("<option value='"+this.term_code+"'>"+this.term_code+"</option>");
					});
					
					//기간 default 36개월 표시
					$(".slt_term option[value=36]", page.layoutID).attr("selected", "selected");
					
					//보증금 표시
					page.getSdRateList();
				} else {
					alert(json.header.error_text);
				}
			});
		},
		
		//보증금 리스트 조회
		getSdRateList : function()
		{
			var TFS114 = {
				header : { trcode : "TFS114", result : "true" },
				body : {
					com_kubun : "B0101", //지점구분 - B0101(하드코딩) 서울본사, B0102 분당지점
					car_kubun : page.carInfo.carKubun, //A271:렉서스 , A272:토요타
					term_code : $(".slt_term", page.layoutID).val(), //기간
					prod_kubun : $(".slt_financial", page.layoutID).val() //상품구분 -  B02O(운용리스),B02F(금융리스),B02L(할부금융)
				}
			};
			ajaxPost("/bizmob/m/getSdRateList", TFS114, function(json) {
				if(json.header.result) {
					$(".slt_sdRate", page.layoutID).empty();
					$(json.body.sd_rate_list).each(function(){
						$(".slt_sdRate", page.layoutID).append("<option value='"+(this.sd_rate_code/100)+"'>"+this.sd_rate_code.bMToNumber()+"</option>");
					});
					
					//운용리스인 경우 보증금 default 표시
					if(page.layoutID == "#B02OLayout"){
						$(".slt_sdRate option[value='0.3']", page.layoutID).attr("selected", "selected");
					}
					
					//보증금 계산하여 표시
					$(".inp_sdAmt", page.layoutID).val((""+page.calc("sdRate")).bMToCommaNumber());
					
					console.log("getSdRateList ---> ");
					
					//잔가 표시
					page.getRvRateList();
				} else {
					alert(json.header.error_text);
				}
			});
		},
		
		//잔가(유예) 리스트 조회
		getRvRateList : function()
		{
			var TFS115 = {
					header : { trcode : "TFS115", result : "true" },
					body : {
						com_kubun : "B0101", //지점구분 - B0101(하드코딩) 서울본사, B0102 분당지점
						car_kubun : page.carInfo.carKubun, //A271:렉서스 , A272:토요타
						sd_rate_code : page.layoutID=="#B02OLayout" ? $(".slt_sdRate option:selected", page.layoutID).text() : "0", //보증금
						term_code : $(".slt_term", page.layoutID).val(), //기간
						prod_kubun : $(".slt_financial", page.layoutID).val() //상품구분 -  B02O(운용리스),B02F(금융리스),B02L(할부금융)
					}
			};
			ajaxPost("/bizmob/m/getRvRateList", TFS115, function(json) {
				if(json.header.result) {
					$(".slt_remainingVal", page.layoutID).empty();
					$(json.body.rv_rate_list).each(function(){
						$(".slt_remainingVal", page.layoutID).append("<option value='"+(this.rv_rate_code/100)+"'>"+this.rv_rate_code.bMToNumber()+"</option>");
					});
					
					if(page.layoutID == "#B02LLayout"){ //할부금융
						//잔가및유예여부(rv_yn)가 "Y"인 경우 유예금 "0"으로 셋팅, disabled 처리
						if(page.carInfo.rvYn == "Y"){
							$(".slt_remainingVal", page.layoutID).empty();
							$(".slt_remainingVal", page.layoutID).append("<option value='0.0'>0</option>");
							$(".slt_remainingVal", page.layoutID).attr("disabled", "disabled");
						}
					}else { //운용리스, 금융리스
						if(page.layoutID == "#B02OLayout"){ //운용리스
							
							var term = $(".slt_term", page.layoutID).val(); //현재 선택된 기간
							var car = page.carInfo.modelNm.substring(0,2); //차종명 앞자리							
							var model_cd = page.carInfo.modelCd;	// 차종코드
							
							console.log("model_cd ---> " + model_cd);
							
							if(term == "48"){ //선택한 기간이 48개월인 경우
								$(".slt_remainingVal", page.layoutID).empty();
								
								//차종이 LS, GS, FJ인 경우 잔가 20% 고정, 그 외 차종은 25%로 고정
								if(car==code.CODE_CAR_LS || car==code.CODE_CAR_GS || car==code.CODE_CAR_FJ){
									$(".slt_remainingVal", page.layoutID).append("<option value='0.2'>20</option>");
								}else if(model_cd == "I02105" || model_cd == "I02017"){	// IS250IB, ES350EB
									$(".slt_remainingVal", page.layoutID).append("<option value='0.30'>30</option>");
								}else {
									$(".slt_remainingVal", page.layoutID).append("<option value='0.25'>25</option>");
								}
							}else if(term == "60"){ //선택한 기간이 60개월인 경우
								$(".slt_remainingVal", page.layoutID).empty();
								
								//차종이 LS, GS, FJ인 경우 잔가 15% 고정, 그 외 차종은 20%로 고정
								if(car==code.CODE_CAR_LS || car==code.CODE_CAR_GS || car==code.CODE_CAR_FJ){
									$(".slt_remainingVal", page.layoutID).append("<option value='0.15'>15</option>");
								}else if(model_cd == "I02105" || model_cd == "I02017"){	// IS250IB, ES350EB
									$(".slt_remainingVal", page.layoutID).append("<option value='0.25'>25</option>");
								}else {
									$(".slt_remainingVal", page.layoutID).append("<option value='0.2'>20</option>");
								}
							}
						}
					}
					
					//잔가 계산하여 표시
					$(".inp_remainingVal", page.layoutID).val((""+page.calc("remainingVal")).bMToCommaNumber());
					//금융상품정보 조회
					page.getFinancialData();
				} else {
					alert(json.header.error_text);
				}
			});
		},
		
		//금융상품정보 조회
		getFinancialData : function()
		{
			//출고(초기)납입금액, 월불입금 초기화
			$(".prerelPayAmt", page.layoutID).text("0원");
			$(".monthDueAmt", page.layoutID).text("0원");
			
			var TFS116 = {
				header : { trcode : "TFS116", result : "true" },
				body : {
					com_kubun : "B0101", //지점구분 - B0101(하드코딩) 서울본사, B0102 분당지점
					car_kubun : page.carInfo.carKubun, //A271:렉서스 , A272:토요타
					rv_rate_code : $(".slt_remainingVal option:selected", page.layoutID).text(), //잔가
					sd_rate_code : page.layoutID=="#B02OLayout" ? $(".slt_sdRate option:selected", page.layoutID).text() : "0", //보증금-금융리스,할부금융은 보증금 0
					term_code : $(".slt_term", page.layoutID).val(), //기간
					dealer_id : page.carInfo.dealerId, //딜러 ID
					mdel_cd : page.carInfo.modelCd, //차량모델 코드 ( 프로모션 상품 찾기 위해 필요)
					prod_kubun : $(".slt_financial", page.layoutID).val(), //상품구분 -  B02O(운용리스),B02F(금융리스),B02L(할부금융)
					user_id : page.userId, //사용자 아이디
					mdel_year : page.carInfo.mdelYear //차량연식
				}
			};
			ajaxPost("/bizmob/m/getFinancialData", TFS116, function(json) {
				if(json.header.result) {
					
					//금융상품정보 저장
					if(page.layoutID == "#B02OLayout"){
						$.extend(true, page.B02OFinancialInfo, json.body);
					}else if(page.layoutID == "#B02FLayout"){
						$.extend(true, page.B02FFinancialInfo, json.body);
					}else if(page.layoutID == "#B02LLayout"){
						$.extend(true, page.B02LFinancialInfo, json.body);
					}
					
					//이자율 표시
					$(".inp_intRate", page.layoutID).val(json.body.int_rate.bMToNumber());
					//SC 커미션 표시, 계산
					$(".inp_jiScPerRate", page.layoutID).attr("sc_fee", json.body.sc_fee.bMToNumber());
					$(".inp_jiScPerRate", page.layoutID).val(json.body.sc_fee.bMToNumber());
					$(".inp_jiScPer", page.layoutID).val((""+page.calc("jiScPerRate")).bMToCommaNumber()); 
					//프로모션 표시
					if(json.body.pro_list.length > 0){
						$(".promotion_content", page.layoutID).show();
						$(".slt_promotion option", page.layoutID).not(":eq(0)").remove();
						$(json.body.pro_list).each(function(){
							$(".slt_promotion", page.layoutID).append("<option promotionData='"+JSON.stringify(this)+"'>"+this.pro_name+"</option>");
						});
						
						$(".slt_promotion", page.layoutID).trigger("change");
						
					}else {
						$(".promotion_content", page.layoutID).hide();
					}
					
					//운용리스인 경우, 리스이용금액 재표시, 보증금/잔가 재계산
					if(page.layoutID == "#B02OLayout"){
						var advsPaidAmt = $(".inp_advsPaidAmt", page.layoutID).val().bMToNumber();
						$(".inp_leasUtilAmt", page.layoutID).val(page.carInfo.totalAmt.bMToNumber()-advsPaidAmt);
						$(".inp_leasUtilAmtView", page.layoutID).val((""+page.carInfo.totalAmt).bMToCommaNumber());
						$(".inp_sdAmt", page.layoutID).val((""+page.calc("sdRate")).bMToCommaNumber()); //보증금
						$(".inp_remainingVal", page.layoutID).val((""+page.calc("remainingVal")).bMToCommaNumber()); //잔가
					}
					
					//테스트용
					/*var financialInfo = {};
					if(page.layoutID == "#B02OLayout"){
						financialInfo = page.B02OFinancialInfo;
					}else if(page.layoutID == "#B02FLayout"){
						financialInfo = page.B02FFinancialInfo;
					}else if(page.layoutID == "#B02LLayout"){
						financialInfo = page.B02LFinancialInfo;
					}
					console.log("차량정보 ---> " + JSON.stringify(page.carInfo));
					console.log("금융상품정보 ---> " + JSON.stringify(financialInfo));*/
					
				} else {
					alert(json.header.error_text);
				}
			});
		},
		
		//계산
		calc : function(type, defaultFlag)
		{
			var returnValue = 0;
			var financialInfo = {};
			if(page.layoutID == "#B02OLayout"){
				financialInfo = page.B02OFinancialInfo;
			}else if(page.layoutID == "#B02FLayout"){
				financialInfo = page.B02FFinancialInfo;
			}else if(page.layoutID == "#B02LLayout"){
				financialInfo = page.B02LFinancialInfo;
			}
			var promotionData = $(".slt_promotion option:selected", page.layoutID).attr("promotionData");
			if(promotionData != undefined){
				promotionData = $.parseJSON(promotionData);
			}else {
				promotionData = "";
			}
			
			if(type == "sdRate"){ //보증금
				//차량가 기준으로 보증금 계산
				//returnValue = Math.floor(page.carInfo.carAmt.bMToNumber()*$(".slt_sdRate", page.layoutID).val());
				returnValue = Math.floor((page.carInfo.carAmt.bMToNumber()-page.carInfo.disCarAmt.bMToNumber())*$(".slt_sdRate", page.layoutID).val());


				
				if(page.layoutID == "#B02OLayout"){ //운용리스
					
					if(financialInfo.target_amt == code.CODE_TARGET_AMT_LEAS){
						returnValue = Math.floor(page.carInfo.totalAmt.bMToNumber()*$(".slt_sdRate", page.layoutID).val());
					}
					
					if(promotionData != ""){
						//등록세/취득세/공채 감면인 경우
						if(promotionData.regtax_reduc_yn=="Y" || promotionData.acqtax_reduc_yn=="Y" || promotionData.pubbond_reduc_yn=="Y"){
							if(financialInfo.target_amt == code.CODE_TARGET_AMT_LEAS){
								returnValue = Math.floor($(".inp_leasUtilAmtView", page.layoutID).val().bMToNumber()*$(".slt_sdRate", page.layoutID).val());
							}
						}
					}
				}else { //금융리스, 할부금융
					if(financialInfo.target_amt == code.CODE_TARGET_AMT_LEAS){
						returnValue = Math.floor($(".inp_leasUtilAmt", page.layoutID).val().bMToNumber()*$(".slt_sdRate", page.layoutID).val());
					}
				}
			}else if(type == "remainingVal"){ //잔가(유예)
				//차량가 기준으로 잔가 계산
				//returnValue = Math.floor(page.carInfo.carAmt.bMToNumber()*$(".slt_remainingVal", page.layoutID).val());
				//returnValue = Math.floor((page.carInfo.carAmt.bMToNumber()-page.carInfo.disCarAmt.bMToNumber())*$(".slt_remainingVal", page.layoutID).val());

				
				if(page.layoutID == "#B02OLayout"){ //운용리스
					returnValue = Math.floor((page.carInfo.carAmt.bMToNumber()-page.carInfo.disCarAmt.bMToNumber())*$(".slt_remainingVal", page.layoutID).val());
					if(financialInfo.target_amt == code.CODE_TARGET_AMT_LEAS){
						returnValue = Math.floor(page.carInfo.totalAmt.bMToNumber()*$(".slt_remainingVal", page.layoutID).val());
					}
					
					if(promotionData != ""){
						//등록세/취득세/공채 감면인 경우
						if(promotionData.regtax_reduc_yn=="Y" || promotionData.acqtax_reduc_yn=="Y" || promotionData.pubbond_reduc_yn=="Y"){
							if(financialInfo.target_amt == code.CODE_TARGET_AMT_LEAS){
								returnValue = Math.floor($(".inp_leasUtilAmtView", page.layoutID).val().bMToNumber()*$(".slt_remainingVal", page.layoutID).val());
							}
						}
					}
				}else { //금융리스, 할부금융
					returnValue = Math.floor(page.carInfo.carAmt.bMToNumber()*$(".slt_remainingVal", page.layoutID).val());
					if(financialInfo.target_amt == code.CODE_TARGET_AMT_LEAS){
						returnValue = Math.floor($(".inp_leasUtilAmt", page.layoutID).val().bMToNumber()*$(".slt_remainingVal", page.layoutID).val());
					}
				}
			}else if(type == "jiScPerRate"){ //SC커미션
				returnValue = parseInt(($(".inp_leasUtilAmt", page.layoutID).val().bMToNumber()*$(".inp_jiScPerRate", page.layoutID).val())/100);
			}else if(type == "monthDueAmt"){ //월불입금
				
				var calMethod = financialInfo.cal_method;
				if(promotionData != ""){
					calMethod = promotionData.pro_cal_method;
				}
				
				if(calMethod == "A941" || defaultFlag == true){ //이자율 계산방식
					returnValue = parseInt(PMT($(".inp_intRate", page.layoutID).val(), $(".slt_term", page.layoutID).val(), $(".inp_leasUtilAmt", page.layoutID).val().bMToNumber(), $(".inp_remainingVal", page.layoutID).val().bMToNumber()));
				}else if(calMethod == "A942"){ //IRR 계산방식
					
					var term = $(".slt_term", page.layoutID).val(); //기간
					var leasUtilAmt = $(".inp_leasUtilAmt", page.layoutID).val().bMToNumber(); //이용금액
					var standard_irr = financialInfo.irr; //기준 irr
					if(promotionData != ""){
						standard_irr = promotionData.pro_irr;
					}
					var intRate = page.calcIntRateByIrr(financialInfo, promotionData, term, leasUtilAmt, standard_irr).intRate;
					$(".inp_intRate", page.layoutID).val(intRate);
					returnValue = parseInt(PMT(intRate, term, leasUtilAmt, $(".inp_remainingVal", page.layoutID).val().bMToNumber()));
					
				}else if(calMethod == "A943"){ //이자율 IRR 계산방식
					if($(".inp_jiScPerRate", page.layoutID).val().bMToNumber() != $(".inp_jiScPerRate", page.layoutID).attr("sc_fee").bMToNumber()){ //SC커미션 수정한 경우
						
						var term = $(".slt_term", page.layoutID).val(); //기간
						var leasUtilAmt = $(".inp_leasUtilAmt", page.layoutID).val().bMToNumber(); //이용금액
						var standard_irr = financialInfo.irr; //기준 irr
						if(promotionData != ""){
							standard_irr = promotionData.pro_irr;
						}
						var intRate = page.calcIntRateByIrr(financialInfo, promotionData, term, leasUtilAmt, standard_irr).intRate;
						$(".inp_intRate", page.layoutID).val(intRate);
						returnValue = parseInt(PMT(intRate, term, leasUtilAmt, $(".inp_remainingVal", page.layoutID).val().bMToNumber()));
						
					}else { //SC커미션 수정하지 않은 경우
						var intRate = financialInfo.int_rate.bMToNumber();
						if(promotionData != ""){
							intRate = promotionData.pro_int_rate.bMToNumber();
						}
						$(".inp_intRate", page.layoutID).val(intRate); //이자율 다시 표시
						returnValue = parseInt(PMT($(".inp_intRate", page.layoutID).val(), $(".slt_term", page.layoutID).val(), $(".inp_leasUtilAmt", page.layoutID).val().bMToNumber(), $(".inp_remainingVal", page.layoutID).val().bMToNumber()));
						
						//운용리스인 경우 선수금이 0이 아니면 IRR계산으로
						if(page.layoutID == "#B02OLayout"){
							if($(".inp_advsPaidAmt", page.layoutID).val().bMToNumber() != 0){
								var term = $(".slt_term", page.layoutID).val(); //기간
								var leasUtilAmt = $(".inp_leasUtilAmt", page.layoutID).val().bMToNumber(); //이용금액
								var standard_irr = financialInfo.irr; //기준 irr
								if(promotionData != ""){
									standard_irr = promotionData.pro_irr;
								}
								var intRate = page.calcIntRateByIrr(financialInfo, promotionData, term, leasUtilAmt, standard_irr).intRate;
								$(".inp_intRate", page.layoutID).val(intRate);
								returnValue = parseInt(PMT(intRate, term, leasUtilAmt, $(".inp_remainingVal", page.layoutID).val().bMToNumber()));
							}
						}
					}
				}
				
			}else if(type == "prerelPayAmt"){ //출고전(초기) 납입금액
				if(page.layoutID == "#B02OLayout"){ //운용리스
					returnValue = $(".inp_sdAmt", page.layoutID).val().bMToNumber() + $(".inp_advsPaidAmt", page.layoutID).val().bMToNumber() + 10000;
				}else if(page.layoutID == "#B02FLayout"){ //금융리스
					returnValue = page.carInfo.totalAmt.bMToNumber() - $(".inp_leasUtilAmt", page.layoutID).val().bMToNumber() + 10000;
				}else if(page.layoutID == "#B02LLayout"){ //할부금융
					var leasUtilAmt = $(".inp_leasUtilAmt", page.layoutID).val().bMToNumber(); //이용금액
					var add = page.calcInjidae(leasUtilAmt); //인지대
					
					returnValue = page.carInfo.totalAmt - leasUtilAmt + add;
				}
			}else if(type == "totAtSubsidy"){ //전체보조금
				
				var atSubsidy = 0; //보조금
				var intRate = $(".inp_intRate", page.layoutID).val(); //이자율
				var term = $(".slt_term", page.layoutID).val(); //기간
				var leasUtilAmt = $(".inp_leasUtilAmt", page.layoutID).val().bMToNumber(); //이용금액
				var monthDueAmt = 0; //월불입금
				var cashFlowArr = []; //현금흐름
				var irr = 0; //기준 irr을 처음 넘는 irr
				
				//alert("전체보조금계산 기준irr ---> " + promotionData.pro_irr); //테스트용
				
				while(irr*12*100 < promotionData.pro_irr)
			    {
					monthDueAmt = parseInt(PMT(intRate, term, leasUtilAmt, $(".inp_remainingVal", page.layoutID).val().bMToNumber()));
					cashFlowArr = makeCashFlow(financialInfo, promotionData, atSubsidy, monthDueAmt);
					irr = IRR(cashFlowArr, 0.1);
					atSubsidy += 5000;
			    }
				atSubsidy -= 5000;
				
				//테스트용
				/*alert(JSON.stringify(cashFlowArr));
				alert("irr*12*100 ---> " + irr*12*100);*/
				
		    	returnValue = {
			    		atSubsidy : atSubsidy,
			    		monthDueAmt : monthDueAmt
			    };
				
			}else if(type == "intRate"){ //이자율
				var term = $(".slt_term", page.layoutID).val(); //기간
				var leasUtilAmt = $(".inp_leasUtilAmt", page.layoutID).val().bMToNumber(); //이용금액
				var data = page.calcIntRateByIrr(financialInfo, promotionData, term, leasUtilAmt, promotionData.pro_irr);
				
				returnValue = {
						intRate : data.intRate,
						monthDueAmt : data.monthDueAmt
				};
			}else if(type == "carTaxMonthDueAmt"){ //총월불입금
				var monthDueAmt = $(".monthDueAmt", page.layoutID).text().bMToNumber();
				returnValue = parseInt(monthDueAmt + page.carInfo.carTaxM.bMToNumber());
			}else if(type == "dealerProMonthDueAmt"){ //딜러 프로모션 월불입금
				var monthDueAmt = parseInt(PMT(promotionData.pro_int_rate.bMToNumber(), $(".slt_term", page.layoutID).val(), $(".inp_leasUtilAmt", page.layoutID).val().bMToNumber(), $(".inp_remainingVal", page.layoutID).val().bMToNumber()));
				returnValue = {
						intRate : promotionData.pro_int_rate.bMToNumber(),
						monthDueAmt : monthDueAmt
				};
			}
			
			return returnValue;
		},
		
		//딜러 프로모션의 월불입금 계산 방법 결정
		checkDealerProCalc : function()
		{
			var returnValue = "IRR";
			var promotionData = $(".slt_promotion option:selected", page.layoutID).attr("promotionData");
			if(promotionData != undefined){
				promotionData = $.parseJSON(promotionData);
			}else {
				promotionData = "";
			}
			
			if(promotionData.pro_cal_method == "A943"){ //이자율 IRR 계산방식
				if($(".inp_jiScPerRate", page.layoutID).val().bMToNumber() == $(".inp_jiScPerRate", page.layoutID).attr("sc_fee").bMToNumber()){ //SC커미션 수정하지 않은 경우
					if($(".inp_atSubsidyAdd", page.layoutID).val().bMToNumber() == 0){ //추가보조금이 0인 경우
						if($(".inp_advsPaidAmt", page.layoutID).val().bMToNumber() == 0){ //선수금이 0인 경우							
							returnValue = "PMT";
						}
					}
				}
			}
			
			return returnValue;
		},
		
		//월불입금 계산 전 유예율 check
		checkBeforeCalcMonthDueAmt : function()
		{
			var result = true;
			var remaining = $(".slt_remainingVal", page.layoutID).val();
			var promotionData = $(".slt_promotion option:selected", page.layoutID).attr("promotionData");
			if(promotionData != undefined){
				promotionData = $.parseJSON(promotionData);
			}else {
				promotionData = "";
			}
			
			if(promotionData!=""){
				if(promotionData.pro_no!="P13100007" && promotionData.pro_no!="P13100008" && promotionData.pro_no!="P13100009"
					&& promotionData.pro_no!="P13100017" && promotionData.pro_no!="P14030001"){
						if(remaining=="0.6" || remaining=="0.65"){
							alert("해당 프로모션 상품에서 지원되지 않는 유예율입니다.");
							result = false;
						}
				}
			}
			
			return result;
		},
		
		//기준 irr을 처음 넘는 이자율 구하기
		calcIntRateByIrr : function(financialInfo, promotionData, term, leasUtilAmt, standard_irr)
		{
			//alert("이자율계산 기준irr ---> " + standard_irr); //테스트용
			
			var intRate = 0; //이자율
			var resultIntRate = 0; //return할 이자율
			var monthDueAmt = 0; //월불입금
			var cashFlowArr = []; //현금흐름
			var irr = 0; //기준 irr을 처음 넘는 irr
			while(irr*12*100 < standard_irr)
			{
				monthDueAmt = parseInt(PMT(intRate, term, leasUtilAmt, $(".inp_remainingVal", page.layoutID).val().bMToNumber()));
				cashFlowArr = makeCashFlow(financialInfo, promotionData, "", monthDueAmt);
				irr = IRR(cashFlowArr, 0.1);
				resultIntRate = intRate;
				intRate += 0.05;
				intRate = parseFloat(intRate).toFixed(2).bMToNumber();
			}
			
			//테스트용
			/*alert(JSON.stringify(cashFlowArr));
			alert("irr*12*100 ---> " + irr*12*100);*/
			
			return {
				intRate : resultIntRate,
				monthDueAmt : monthDueAmt
			};
		},
		
		//인지대 구하기
		calcInjidae : function(leasUtilAmt)
		{
			var add = 0;
			if(leasUtilAmt <= 40000000) add = 0;
			else if(leasUtilAmt>40000000 && leasUtilAmt<=50000000) add = 20000;
			else if(leasUtilAmt>50000000 && leasUtilAmt<=100000000) add = 35000;
			else if(leasUtilAmt>100000000) add = 75000;
			
			return add;
		},
		
		//월불입금, 총월불입금 초기화
		resetMonthDueAmt : function()
		{
			$(".monthDueAmt", page.layoutID).text("0원");
			$(".carTaxMonthDueAmt", page.layoutID).text("0원");
			$(".btn_on_off").addClass("tbtn_off");
		},
		
		//월불입금(차세포함) 표시
		setCarTaxMonthDueAmt : function()
		{
			if($(".btn_on_off", page.layoutID).hasClass("tbtn_off")){
				$(".carTaxMonthDueAmt", page.layoutID).text($(".monthDueAmt", page.layoutID).text());
			}else {
				$(".carTaxMonthDueAmt", page.layoutID).text((""+page.calc("carTaxMonthDueAmt")).bMToCommaNumber()+"원");
			}
		}
};

/*
 * PMT 공식
 * parameter : rate_per_period-이자율, number_of_payments-개월수, present_value-리스이용금액, future_value-잔가
 */
function PMT(rate_per_period, number_of_payments, present_value, future_value){
	present_value = 0-present_value;
	rate_per_period = (rate_per_period/100)/12;
	
	if(rate_per_period != 0.0){
		// Interest rate exists
		var q = Math.pow(1 + rate_per_period, number_of_payments);
		return -(rate_per_period * (future_value + (q * present_value))) / ((-1 + q) * (1 + rate_per_period * (0)));
	} else if(number_of_payments != 0.0){
		// No interest rate, but number of payments exists
		return -(future_value + present_value) / number_of_payments;
	}
	
	return 0;
}

/*
 * IRR 공식
 * parameter : cashFlows-현금흐름, guess-근사값
 */
function IRR(cashFlows, guess){
	var list = cashFlows;
	var MINDIF = 0.0000001;
	var irr = 0;
	
	if (list[0] == 0) return 0.0;
	var ineg = 0;
	var ipos = 0;
	var i;
	for(i=0; i<list.length; i++){
		irr += list[ i ];
		if(list[ i ] > 0) ipos++;
		else if(list[ i ] < 0) ineg++;
	}
	if (ineg==0 || ipos==0) return 0.0;
	
	var a1 = list[0];
	if (guess <= 0) guess = 0.5;
	if (irr < 0) irr=-guess; else irr = guess;
	var was_hi = false;
	var a3;
	for(var iter=0; iter<=50; iter++){
		a3 = a1;
		var j = 1;
		for(i=1; i<list.length; i++){
			a3 += list[ i ]/Math.pow(1.0+irr,j);
			j++;
		}
		if(Math.abs(a3)<0.01) return irr;
		if(a3 > 0){
			if(was_hi) guess/=2;
			irr += guess;
			if(was_hi){
				guess -= MINDIF;
				was_hi = false;
			}
		} else {
			guess/=2;
			irr -= guess;
			was_hi = true;
		}
		if (guess <= MINDIF) return irr;
	}
	return 0.0;
}

//현금흐름 생성
function makeCashFlow(financialInfo, promotionData, paramAtSubsidy, paramMonthDueAmt) { //금융정보, 프로모션 정보, 보조금, 월불입금
	var cashFlowArr = [];
	var pushAmt = 0;
	var term = $(".slt_term", page.layoutID).val().bMToNumber(); //기간
	var leasUtilAmt = $(".inp_leasUtilAmt", page.layoutID).val().bMToNumber(); //(리스)이용금액
	var monthDueAmt = paramMonthDueAmt!="" ? paramMonthDueAmt : $(".monthDueAmt", page.layoutID).text().bMToNumber(); //월불입금
	var atSubsidy = 0; //보조금(TMKR 보조금+Dealer 보조금)
	if(promotionData != ""){
		atSubsidy = promotionData.at_subsidy_tmkr.bMToNumber()+promotionData.at_subsidy_dealer.bMToNumber();
	}
	
	//청구프로모션 차감될 금액 계산
	var billing_start_month = undefined; //청구프로모션 시작회차
	var billing_end_month = undefined; //청구프로모션 종료회차
	var billing = 0; //청구프로모션에서 실제 차감될 금액
	if(promotionData != ""){
		if(promotionData.billing_pro_yn == "Y"){
			if(promotionData.billing_deduct_way == "A951"){ //공제방법 초회부터
				billing_start_month = 1;
				billing_end_month = term;
				billing = getDeductAmt("billing", promotionData.billing_cacul_way, promotionData.billing_deduct_amt, promotionData.billing_target_amt, promotionData.billing_deduct_rate);
				page.billing = billing;
				
			}else if(promotionData.billing_deduct_way == "A952"){ //공제방법 일정기간
				billing_start_month = promotionData.billing_start_month;
				billing_end_month = promotionData.billing_end_month;
				billing = getDeductAmt("billing", promotionData.billing_cacul_way, promotionData.billing_deduct_amt, promotionData.billing_target_amt, promotionData.billing_deduct_rate);
				page.billing = billing;
			}
		}
	}
	
	//등록세/취득세/공채 차감될 금액 계산
	var regtax = 0; //등록세 실제 차감될 금액
	var acqtax = 0; //취득세 실제 차감될 금액
	var pubbond = 0; //공채 실제 차감될 금액
	if(promotionData != ""){
		if(promotionData.regtax_reduc_yn=="Y"){
			regtax = getDeductAmt("regtax", promotionData.regtax_calcul_way, promotionData.regtax_deduct_amt, promotionData.regtax_target_amt, promotionData.regtax_deduct_rate);	
		}
		if(promotionData.acqtax_reduc_yn=="Y"){
			acqtax = getDeductAmt("acqtax", promotionData.acqtax_calcul_way, promotionData.acqtax_deduct_amt, promotionData.acqtax_target_amt, promotionData.acqtax_deduct_rate);
		}
		if(promotionData.pubbond_reduc_yn=="Y"){
			pubbond = getDeductAmt("pubbond", promotionData.pubbond_calcul_way, promotionData.pubbond_deduct_amt, promotionData.pubbond_target_amt, promotionData.pubbond_deduct_rate);
		}
	}
	
	for(var i=0; i<=term; i++){
		pushAmt = 0;
		if(i > 0){
			pushAmt += monthDueAmt; //월불입금
		}
		
		//청구감면
		if(billing_start_month!=undefined && billing_end_month!=undefined){
			if(i>=billing_start_month && i<=billing_end_month){
				if(promotionData.billing_deduct_way == "A951"){ //공제방법 초회부터
					
					if(promotionData.billing_cacul_way == "A963"){ //금액계산방법 전체금액
						if(i == 1) pushAmt -= billing;
					}else {
						if(billing > 0){
							if(monthDueAmt < billing){
								pushAmt -= monthDueAmt;
								billing = billing-monthDueAmt;
							}else if(monthDueAmt >= billing){
								pushAmt -= billing;
								billing = 0;
							}
						}
					}
					
				}else if(promotionData.billing_deduct_way == "A952"){ //공제방법 일정기간
					pushAmt -= billing;
				}
			}
		}
		
		if(i == 0){ //0회차
			pushAmt -= leasUtilAmt; //리스이용금액
			pushAmt += page.layoutID=="#B02OLayout" ? $(".inp_sdAmt", page.layoutID).val().bMToNumber() : 0; //보증금
			//SC커미션, 추가커미션
			if(promotionData == ""){
				pushAmt -= parseInt((leasUtilAmt*($(".inp_jiScPerRate", page.layoutID).val()/100).bMToNumber())+(leasUtilAmt*(financialInfo.sc_add_fee/100).bMToNumber()));
			}else {
				pushAmt -= parseInt((leasUtilAmt*($(".inp_jiScPerRate", page.layoutID).val()/100).bMToNumber())+(leasUtilAmt*(promotionData.pro_ji_sc_add/100).bMToNumber()));
			}
			//Agent커미션, 추가커미션
			if(promotionData == ""){
				if(page.layoutID == "#B02OLayout"){ //운용리스
					pushAmt -= parseInt((leasUtilAmt*(financialInfo.agent_fee/100).bMToNumber())+(leasUtilAmt*(financialInfo.agent_add_fee/100).bMToNumber()));
				}else { //금융리스, 할부금융
					pushAmt -= parseInt((leasUtilAmt*((financialInfo.agent_fee.bMToNumber()+0.06)/100).bMToNumber())+(leasUtilAmt*(financialInfo.agent_add_fee/100).bMToNumber()));
				}
			}else {
				if(page.layoutID == "#B02OLayout"){ //운용리스
					pushAmt -= parseInt((leasUtilAmt*(promotionData.agent_fee/100).bMToNumber())+(leasUtilAmt*(promotionData.agent_add_fee/100).bMToNumber()));
				}else { //금융리스, 할부금융
					pushAmt -= parseInt((leasUtilAmt*((promotionData.agent_fee.bMToNumber()+0.06)/100).bMToNumber())+(leasUtilAmt*(promotionData.agent_add_fee/100).bMToNumber()));
				}
			}
			//Dealer 커미션, 추가커미션
			if(promotionData == ""){
				pushAmt -= parseInt((leasUtilAmt*(financialInfo.dealer_fee/100).bMToNumber())+(leasUtilAmt*(financialInfo.dealer_add_fee/100).bMToNumber()));
			}else {
				pushAmt -= parseInt((leasUtilAmt*(promotionData.dealer_fee/100).bMToNumber())+(leasUtilAmt*(promotionData.dealer_add_fee/100).bMToNumber()));
			}
			if(promotionData != ""){
				pushAmt -= promotionData.at_cost_tfskr.bMToNumber(); //TFSKR 물품지원비
				pushAmt -= promotionData.dfmc_amt.bMToNumber(); //TFSKR DFMC 금액
				pushAmt -= promotionData.at_kita_tfskr.bMToNumber(); //TFSKR 기타비용
				if(promotionData.regtax_reduc_yn == "Y") pushAmt -= regtax; //등록세감면
				if(promotionData.acqtax_reduc_yn == "Y") pushAmt -= acqtax; //취득세감면
				if(promotionData.pubbond_reduc_yn == "Y") pushAmt -= pubbond; //공채감면
				if(promotionData.etc_reduc_yn == "Y") pushAmt -= getDeductAmt("etc", promotionData.etc_calcul_way, promotionData.etc_deduct_amt, promotionData.etc_target_amt, promotionData.etc_deduct_rate); //기타감면
			}
		}else if(i == 1){ //1회차
			
			if(promotionData != ""){
				pushAmt += atSubsidy; //+TMKR 보조금, +Dealer 보조금
				if(promotionData.dealer_pro_yn == "Y"){
					//전체보조금
					if(typeof(paramAtSubsidy) == "number"){ //전체보조금 계산인 경우
						pushAmt += paramAtSubsidy;
					}else {
						pushAmt += $(".inp_atSubsidyAdd", page.layoutID).val().bMToNumber();
					}
				}else {
					pushAmt += $(".inp_atSubsidyAdd", page.layoutID).val().bMToNumber(); //딜러사 자율 보조금
				}
			}
		}else if(i == term){ //마지막회차
			pushAmt -= page.layoutID=="#B02OLayout" ? $(".inp_sdAmt", page.layoutID).val().bMToNumber() : 0; //보증금
			pushAmt += $(".inp_remainingVal", page.layoutID).val().bMToNumber(); //잔가(유예)
		}
		
		cashFlowArr.push(pushAmt);
	}
	
	return cashFlowArr;
}

//청구감면, 등록세/취득세/공채감면, 기타감면 금액 계산
function getDeductAmt(type, calcul_way, deduct_amt, target_amt, deduct_rate){
	var returnValue = 0;
	
	if(calcul_way == "A961"){ //금액계산방법 금액기준
		returnValue = deduct_amt.bMToNumber();
	}else if(calcul_way == "A962"){ //금액계산방법 비율기준
		
		if(target_amt == "A971"){ //계산대상금액 금융이용금액
			returnValue = parseInt($(".inp_leasUtilAmt", page.layoutID).val().bMToNumber()*deduct_rate);
		}else if(target_amt == "A972"){ //계산대상금액 차량가격
			returnValue = parseInt(page.carInfo.carAmt.bMToNumber()*deduct_rate);
		}
		
	}else if(calcul_way == "A963"){ //금액계산방법 전체금액
		if(type == "billing"){ //청구감면
			returnValue = $(".monthDueAmt", page.layoutID).text().bMToNumber();
		}else if(type == "regtax"){ //등록세 감면
			returnValue = page.carInfo.regtaxAmt.bMToNumber();
		}else if(type == "acqtax"){ //취득세 감면
			returnValue = page.carInfo.acqtaxAmt.bMToNumber();
		}else if(type == "pubbond"){ //공채 감면
			returnValue = page.carInfo.pubbondAmt.bMToNumber();
		}else if(type == "etc"){ //기타 감면
			returnValue = page.carInfo.extraChrgAmt.bMToNumber();
		}
	}
	
	return returnValue;
}

//internal browser에서 새로고침 버튼을 클릭한 경우 호출되는 함수
function clickNativeReloadButton(){
	bizMOB_Android.reload("102htmlCode");
}
