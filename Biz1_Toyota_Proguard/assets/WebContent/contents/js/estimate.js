/**
 * 차량정보
 */
function myAlert(text){
	console.log(text);
}
var page = {
		isSC : undefined, //SC 여부
		isManager : undefined, //관리자 여부(Agent만 해당)
		userId : undefined, //사용자ID
		carInfo : {}, //차량정보
		scCarInfo : {}, //초기에 SC로부터 받은 차량정보
		purRateAmt : 0, //매입률(공채 default)
		scParam : undefined, //SC 파라미터(SC만 해당)
		init : function()
		{
			page.initData();
			page.initInterface();
		},
		
		initData : function()
		{
			//SC인 경우 차량정보화면에 재진입을 한 경우에 이전의 sessionStorage가 삭제되지 않는 현상을 처리하기 위해, 
			//금융상품정보 화면에서 온경우 인지 아닌지 여부로 차량정보화면 html code 초기화 및 가져오기 처리
			if(window.sessionStorage["isHistoryBack"] != "Y"){
				window.sessionStorage["101htmlCode"] = "";
			}else {
				window.sessionStorage["isHistoryBack"] = "";
			}
			
			//back으로 온 경우 해당 화면 html code 표시 및 page변수 data 저장
			var htmlCode = window.sessionStorage["101htmlCode"];
			if(htmlCode != undefined && htmlCode != ""){
				$("#sub_content").html(htmlCode);
				var pageData = $.parseJSON($("#pageData").val());
				page.carInfo = pageData.carInfo;
				page.scCarInfo = pageData.scCarInfo;
				page.purRateAmt = pageData.purRateAmt;
				page.scParam = pageData.scParam;
			}else {
				page.carInfo.brandCd = $("#brand_cd").val();
				page.carInfo.dealerId = $("#dealer_id").val();
				page.carInfo.modelCd = $("#model_cd").val();
				page.carInfo.variantCd = $("#variant_cd").val();
				page.carInfo.myCd = $("#my_cd").val();
				page.carInfo.sfxCd = $("#sfx_cd").val();
				page.carInfo.idntInfo = $("#idnt_info").val();
				page.carInfo.dispalcement = $("#dispalcement").val();
				page.carInfo.extColorCd = $("#ext_color_cd").val();
				page.carInfo.intColorCd = $("#int_color_cd").val();
				page.carInfo.salesType = $("#sales_type").val();
				page.carInfo.carAmt = $("#car_amt").val();
				page.scParam = $("#sc_param").val();
			}
			
			//기본정보 저장
			page.isSC = $("#is_SC").val();
			page.isManager = $("#is_Manager").val();
			page.userId = $("#user_id").val();
			/*page.carInfo.brandCd = $("#brand_cd").val();
			page.carInfo.dealerId = $("#dealer_id").val();
			page.carInfo.modelCd = $("#model_cd").val();
			page.carInfo.variantCd = $("#variant_cd").val();
			page.carInfo.myCd = $("#my_cd").val();
			page.carInfo.sfxCd = $("#sfx_cd").val();
			page.carInfo.idntInfo = $("#idnt_info").val();
			page.carInfo.dispalcement = $("#dispalcement").val();
			page.carInfo.extColorCd = $("#ext_color_cd").val();
			page.carInfo.intColorCd = $("#int_color_cd").val();
			page.carInfo.salesType = $("#sales_type").val();
			page.carInfo.carAmt = $("#car_amt").val();
			page.scParam = $("#sc_param").val();*/
			
			if(page.isSC == "Y"){
				$("#btn_menu").hide();
				page.scCarInfo = page.carInfo;
				$("#inp_idntInfo").val(page.scCarInfo.idntInfo);
			}
			
			//관리자인 경우 메뉴 통계버튼 show
			if(page.isManager == "Y"){
				$(".btn_menu[value=4]").show();
			}

			if(htmlCode == undefined || htmlCode == ""){
				page.getCarList();
			}
		},
		
		initInterface : function()
		{
			
			//부대비용 엔터시 다음 화면으로
			/*$("#inp_extraChrgAmt").bind("keyup", function(event){
				if(event.keyCode == "13"){
					$("#btn_next").trigger("click");
				}
			});*/
			
			//메뉴 열기/닫기
			$("#btn_menu").bind("click", function(){
				$(".menu_pop").toggle();
			});
			
			//메뉴 연결
			$(".btn_menu", "#menuContent").bind("click", function(){
				myAlert("메뉴연결");
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
			
			//초기화 버튼
			$("#btn_reset").bind("click", function(){
				$("input[type=text]").val("");
				$("input[type=tel]").val("");
				$(".btn_on_off").addClass("tbtn_off");
				$("#regtax_amt, #acqtax_amt, #pubbond_amt").text("0원");
				$("option:eq(0)", "#slt_disHybrid").attr("selected", "selected");
				$("option[value='0.0500']", "#slt_publDebtPurcRate").attr("selected", "selected");
				$("option[value='0.0800']", "#slt_publDebtDiscRate").attr("selected", "selected");
				$("#totalAmt").text((""+page.carInfo.carAmt).bMToCommaNumber()+"원");
			});
			
			//차종 selectbox change
			$("#slt_carModel").bind("change", function(){
				
				$(".selectDefault").text($("option:selected", this).text());
				
				//연식 리스트 조회
				page.getCarYearList();
				
			});
			
			//연식 selectbox change
			$("#slt_carModelYear").bind("change", function(){
				$(".selectDefault2").text($("option:selected", this).text());
				
				page.getCarData();
			});
			
			//차량가할인금액 keyup
			$("#inp_disCarAmt").bind("keyup", function(){
				var value = $(this).val().bMToNumber();
				//차량가 표시변경
				$("#carAmt").text((""+(page.carInfo.carAmt-value)).bMToCommaNumber()+"원");
			
				//등록세/취득세/공채 재계산
				$(".btn_on_off").each(function(){
					if(!$(this).hasClass("tbtn_off")){
						if($(this).attr("value") == "regtax"){ //등록세
							$("#regtax_amt").text((""+page.calc("regtax")).bMToCommaNumber()+"원");
						}else if($(this).attr("value") == "acqtax"){ //취득세
							$("#acqtax_amt").text((""+page.calc("acqtax")).bMToCommaNumber()+"원");
						}else if($(this).attr("value") == "pubbond"){ //공채
							$("#pubbond_amt").text((""+page.calc("pubbond")).bMToCommaNumber()+"원");
						}						
					}
				});
				
				page.calcTotalAmt();
			});
			
			//등록세/취득세/공채 포함/미포함
			$(".btn_on_off").bind("click", function(){
				$(this).toggleClass("tbtn_off");
				
				if($(this).hasClass("tbtn_off")){ //미포함
					
					if($(this).attr("value") == "regtax"){ //등록세
						$("#regtax_amt").text("0원");
					}else if($(this).attr("value") == "acqtax"){ //취득세
						$("#acqtax_amt").text("0원");
					}else if($(this).attr("value") == "pubbond"){ //공채
						$("#pubbond_amt").text("0원");
					}
					
				}else { //포함
					
					if($(this).attr("value") == "regtax"){ //등록세
						$("#regtax_amt").text((""+page.calc("regtax")).bMToCommaNumber()+"원");
					}else if($(this).attr("value") == "acqtax"){ //취득세
						$("#acqtax_amt").text((""+page.calc("acqtax")).bMToCommaNumber()+"원");
					}else if($(this).attr("value") == "pubbond"){ //공채
						$("#pubbond_amt").text((""+page.calc("pubbond")).bMToCommaNumber()+"원");
					}
	
				}
				
				page.calcTotalAmt();
			});
			
			//하이브리드 감면 change
			$("#slt_disHybrid").bind("change", function(){
				//공채 재계산
				if(!$(".btn_on_off[value=pubbond]").hasClass("tbtn_off")){
					var returnValue = page.calc("pubbond");
					$("#pubbond_amt").text((""+returnValue).bMToCommaNumber()+"원");
					page.calcTotalAmt();
				}
			});
			
			//공채매입율 change
			$("#slt_publDebtPurcRate").bind("change", function(){
				
				//공채 재계산
				if(!$(".btn_on_off[value=pubbond]").hasClass("tbtn_off")){
					var returnValue = page.calc("pubbond");
					$("#pubbond_amt").text((""+returnValue).bMToCommaNumber()+"원");
					page.calcTotalAmt();
				}
				
			});
			
			//공채할인율 change
			$("#slt_publDebtDiscRate").bind("change", function(){
				
				//공채 재계산
				if(!$(".btn_on_off[value=pubbond]").hasClass("tbtn_off")){
					var returnValue = page.calc("pubbond");
					$("#pubbond_amt").text((""+returnValue).bMToCommaNumber()+"원");
					page.calcTotalAmt();
				}
			});
			
			//부대비용 keyup
			$("#inp_extraChrgAmt").bind("keyup", function(){
				page.calcTotalAmt();
			});
			
			//다음 버튼
			$("#btn_next").bind("click", function(){				
				//견적식별정보 validation
				if($.trim($("#inp_idntInfo").val()) == ""){
					myAlert("견적식별정보를 입력해주세요.");
					
					
					return false;
				}
				
				//차량할인금액 validation
				var disCarAmt = $("#inp_disCarAmt").val().bMToNumber();
				var carAmt = page.carInfo.carAmt.bMToNumber();
				if(disCarAmt<0 || disCarAmt>carAmt){
					myAlert("차량할인금액이 0보다 작거나 차량금액보다 클 수 없습니다.");
					return false;
				}
				
				//부대비용 금액 validation
				var extraChrgAmt = $("#inp_extraChrgAmt").val().bMToNumber();
				if(extraChrgAmt<0 || extraChrgAmt>200000){
					myAlert("부대비용이 0보다 작거나 200,000만원을 넘을 수 없습니다.");
					return false;
				}
				
				//back으로 온 경우 화면 표시를 위해 해당 화면 html code 및 page변수 저장
				$("input").each(function(){ //해당 코드가 없으면 저장한 html code를 화면에 보일 때 input의 value값이 보여지지 않음
					$(this).attr("value", $(this).val());
				});
				$("select").each(function(){ //해당 코드가 없으면 저장한 html code를 화면에 보일 때 선택한 select가 보여지지 않음
					var value = $(this).val();
					$("option[value='"+value+"']", this).attr("selected", "selected");
					$("option:not([value='"+value+"'])", this).removeAttr("selected");
				});
				var pageData = {
						carInfo : page.carInfo,
						scCarInfo : page.scCarInfo,
						purRateAmt : page.purRateAmt,
						scParam : page.scParam
				};
				$("#pageData").val(JSON.stringify(pageData));
				window.sessionStorage["101htmlCode"] = $("#sub_content").html();
				window.sessionStorage["102htmlCode"] = "";
				
				var params = {//보내는 데이터들
						is_SC : page.isSC,
						is_Manager : page.isManager,
						user_id : page.userId,
						car_kubun : page.carInfo.brandCd=="T" ? "A272" : "A271", //A271:렉서스 , A272:토요타
						dealer_id : page.carInfo.dealerId, //딜러 아이디 
						brand_cd : page.carInfo.brandCd,
						model_cd : $("#slt_carModel").val(),
						model_nm : $("option[selected=selected]", "#slt_carModel").text(),
						//car_tax : page.carInfo.carTax+"",
						car_tax_m : page.carInfo.carTaxM+"",
						car_amt : page.carInfo.carAmt+"",
						total_amt : $("#totalAmt").text().bMToNumber()+"",
						dis_car_amt : $("#inp_disCarAmt").val(), //할인금액
						regtax_amt : $("#regtax_amt").text().bMToNumber()+"", //등록세
						acqtax_amt : $("#acqtax_amt").text().bMToNumber()+"", //취득세
						pubbond_amt : $("#pubbond_amt").text().bMToNumber()+"", //공채
						dis_hybrid : $("#slt_disHybrid").val(), //하이브리드 감면
						publ_debt_purc_rate : $("#slt_publDebtPurcRate").val(), //공채매입율
						publ_debt_disc_rate : $("#slt_publDebtDiscRate").val(), //공채할인율
						extra_chrg_amt : $("#inp_extraChrgAmt").val(), //부대비용
						hyb_rdct_yn : page.carInfo.hybRdctYn, //하이브리드 여부
						sc_car_info : JSON.stringify({}),
						sc_param : page.scParam,
						rv_yn : page.carInfo.rvYn, //잔가및유예여부
						idnt_info : $("#inp_idntInfo").val(), //견적식별정보
						mdel_year : $("option", "#slt_carModelYear").size()>0 ? $("option:selected", "#slt_carModelYear").text() : "" //연식
				};
				if(page.isSC == "Y"){
					$.extend(true, params, {
						sc_car_info : JSON.stringify(page.scCarInfo)
					});
				}
				$("#params").val(JSON.stringify(params));
				console.log($("#params").val());
				$("#nextForm").submit();
			});
		},
		
		//차종 리스트 조회
		getCarList : function()
		{
			var TFS111 = {
				header : { trcode : "TFS111", result : "true" },
				body : {
					is_sc : page.isSC=="Y" ? "Y" : "N", //'Y' = SC , 'N' = Agent
					brand_code : page.carInfo.brandCd=="T" ? "A272" : "A271", //'A271' 렉서스 , 'A272' 토요타 
					car_amt : page.carInfo.carAmt, //차량금액
					sales_type : page.carInfo.salesType, //판매유형
					int_color_cd : page.carInfo.intColorCd, //내장 색상
					ext_color_cd : page.carInfo.extColorCd, //외장 색상
					sfx_cd : page.carInfo.sfxCd, //Suffix 정보
					displacement : page.carInfo.dispalcement, //배기량
					my_cd : page.carInfo.myCd, //연식
					model_cd : page.carInfo.modelCd, //모델코드
					variant_cd : page.carInfo.variantCd, //차종코드
					idnt_info : page.carInfo.idntInfo, //견적 식별자(고객등)
					user_id : page.userId //사용자 아이디
				}
			};
			if(page.isSC == "Y"){ //SC인 경우는 "L" 또는 "T"로 전송
				TFS111.body.brand_code = page.carInfo.brandCd;
			}
			ajaxPost("/bizmob/m/getCarList", TFS111, function(json) {
				if(json.header.result) {
					//SC인 경우 딜러아이디 저장
					if(page.isSC == "Y"){
						page.carInfo.dealerId = json.body.dealer_id;
					}
					
					//차종 selectbox append
					$(json.body.car_list).each(function(i){
						if(this.year_yn_count=="2" && this.year_showyn=="N"){} //여러개의 연식이 있는 차종의 연식 중 일부 year_showyn이 "N"인 경우의 차종은 화면에 표시하지 않음
						else {
							$("#slt_carModel").append("<option value='"+this.mdel_cd+"'"+" maker='"+this.maker+"' car_cd='"+this.car_cd+"' year_showyn='"+this.year_showyn+"' year_yn_count='"+this.year_yn_count+"'>"+this.mdel_name+"</option>");
						}
					});
					if(page.isSC == "N"){ //Agent인 경우 Camry가 default 선택되도록
						$("option[value='I02042']", "#slt_carModel").attr("selected", "selected");
						$(".selectDefault").text($("option:selected", "#slt_carModel").text());
					}else {
						$(".selectDefault").text($("option:eq(0)", "#slt_carModel").text());
					}
					
					//SC인 경우 차종 disabled 처리
					if(page.isSC == "Y"){
						$("#slt_carModel").attr("disabled", "disabled");
						/*if($("option[value="+page.scCarInfo.modelCd+"]", "#slt_carModel").size() == 0){
							myAlert("차량 정보가 없습니다.");
							return false;
						}else {
							$("option[value="+page.scCarInfo.modelCd+"]", "#slt_carModel").attr("selected", "selected");
							$("#slt_carModel").attr("disabled", "disabled");
						}*/
					}
					
					//차량 연식 리스트 조회
					page.getCarYearList();
					
				} else {
					myAlert(json.header.error_text);
				}
			});
		},
		
		//연식 리스트 조회
		getCarYearList : function()
		{
			var car = $("option:selected", "#slt_carModel");
			
			var TFS117 = {
				header : { trcode : "TFS117", result : "true" },
				body : {
					year_showyn : $(car).attr("year_showyn"), //Y일 경우 연식 리스트, N {}
					car_cd : $(car).attr("car_cd"), //차량 코드(PK)
					model_cd : $(car).val() //모델코드
				}
			};
			
			ajaxPost("/bizmob/m/getCarYearList", TFS117, function(json) {
				if(json.header.result) {
					
					//연식 selectbox append
					var mdel_year_list = json.body.mdel_year_list;
					
					if(mdel_year_list.length > 0){
						$(".year_content").show();
						$("#slt_carModelYear").empty();
						$(mdel_year_list).each(function(){
							$("#slt_carModelYear").append("<option value='"+this.mdel_year+"' amt_date='"+this.amt_date+"'>"+this.mdel_year+"</option>");
						});
						$(".selectDefault2").text($("option:eq(0)", "#slt_carModelYear").text());
					}else {
						$(".year_content").hide();
						$("#slt_carModelYear").empty();
					}
					
					if($(car).attr("year_showyn")=="N"){
						$(".year_content").hide();
					}
					
					//기본정보 조회
					page.getCarData();
					
				} else {
					myAlert(json.header.error_text);
				}
			});
			
		},
		
		//차량정보 조회
		getCarData : function()
		{
			var yearShowYn = $("option:selected", "#slt_carModel").attr("year_showyn");
			var TFS112 = {
				header : { trcode : "TFS112", result : "true" },
				body : {
					tmkr_car_amt : page.isSC=="Y" ? page.scCarInfo.carAmt : "", //TMKR(SC)만 차량가 존재시 사용 - 더 정확함
					car_cd : $("option:selected", "#slt_carModel").attr("car_cd"), //차량 코드(PK)
					amt_date : yearShowYn=="Y" ? $("option:selected", "#slt_carModelYear").attr("amt_date") : $("option", "#slt_carModelYear").eq(0).attr("amt_date"), //AMT_DATE(PK)
					maker : $("option:selected", "#slt_carModel").attr("maker"), //MAKER(PK)
					mdel_year : $("option", "#slt_carModelYear").size()>0 ? $("option:selected", "#slt_carModelYear").text() : "", //연식
					mdel_cd : $("option:selected", "#slt_carModel").val(), //모델코드
				}
			};
			
			ajaxPost("/bizmob/m/getCarData", TFS112, function(json) {
				if(json.header.result) {
					//초기화(견적식별정보 제외)
					$("input[type=tel]").val("");
					$(".btn_on_off").addClass("tbtn_off");
					$("#regtax_amt, #acqtax_amt, #pubbond_amt").text("0원");
					$("option:eq(0)", "#slt_disHybrid").attr("selected", "selected");
					$("option[value='0.0500']", "#slt_publDebtPurcRate").attr("selected", "selected");
					$("option[value='0.0800']", "#slt_publDebtDiscRate").attr("selected", "selected");
					$("#totalAmt").text((""+page.carInfo.carAmt).bMToCommaNumber()+"원");
					//$("#btn_reset").trigger("click");
					
					//차량정보 확장 저장
					$.extend(true, page.carInfo, {
						rvYn : json.body.rv_yn, //잔가 및 유해여부
						engineType : json.body.engine_type, //엔진유형
						carWheel : json.body.car_wheel, //구동방식
						//carTax : json.body.car_tax, //차량세
						carTaxM : json.body.car_tax_m, //차량세(월)
						variantCd : json.body.car_cd, //차종코드
						seater : json.body.seater, //차량인승
						carKubun : json.body.car_kubun, //차종유형
						pubAmt : json.body.pub_amt, //공채매입할인금액
						hybRdctYn : json.body.hyb_rdct_amt_list.length>0 ? "Y" : "N" //하이브리드 여부
					});
					if(page.isSC == "N"){
						$.extend(true, page.carInfo, {
							carAmt : json.body.car_amt //차량가
						});	
					}
					
					page.scCarInfo = page.carInfo;
					
					//7인승 이상인 경우 공채매입률 hide
					if(page.carInfo.seater >= 7){
						$("#purcRateContent").hide();
					}else {
						$("#purcRateContent").show();
					}
					
					//하이브리드 감면 리스트가 있으면 selectbox append
					$("#slt_disHybrid").empty();
					if(json.body.hyb_rdct_amt_list.length > 0){
						$("#hybridContent").show();
						$(json.body.hyb_rdct_amt_list).each(function(){
							$("#slt_disHybrid").append("<option value='"+this.code+"'>"+this.code_name+"</option>");
						});
					}else {
						$("#hybridContent").hide();
					}
					
					//공채매입율 selectbox append
					$("#slt_publDebtPurcRate").empty();
					$(json.body.purc_rate_list).each(function(){
						$("#slt_publDebtPurcRate").append("<option value='"+this.code+"'>"+this.code_name+"</option>");
					});
					//공채매입률 default "5%"
					$("option[value='0.0500']", "#slt_publDebtPurcRate").attr("selected", "selected");
					
					//공채할인율 selectbox append
					$("#slt_publDebtDiscRate").empty();
					$(json.body.disc_rate_list).each(function(){
						$("#slt_publDebtDiscRate").append("<option value='"+this.code+"'>"+this.code_name+"</option>");
					});
					//공채할인률 default "8%"
					$("option[value='0.0800']", "#slt_publDebtDiscRate").attr("selected", "selected");
					
					//매입률 계산하여 저장
					page.purRateAmt = page.carInfo.carAmt/1.1*$("option:selected", "#slt_publDebtPurcRate").val();
					
					//차량가, 총금액
					if(page.isSC == "Y"){
						$("#carAmt").text(page.carInfo.carAmt.bMToCommaNumber()+"원");
						$("#totalAmt").text(page.carInfo.carAmt.bMToCommaNumber()+"원");
					}else {
						$("#carAmt").text(json.body.car_amt.bMToCommaNumber()+"원");
						$("#totalAmt").text(json.body.car_amt.bMToCommaNumber()+"원");
					}
					
					/*$("#inp_disCarAmt").val(0);
					$("#inp_extraChrgAmt").val(0);*/
					
					//등록세, 취득세, 공채 default 포함으로
					$(".btn_on_off").removeClass("tbtn_off");
					$("#regtax_amt").text((""+page.calc("regtax")).bMToCommaNumber()+"원");
					$("#acqtax_amt").text((""+page.calc("acqtax")).bMToCommaNumber()+"원");
					$("#pubbond_amt").text((""+page.calc("pubbond")).bMToCommaNumber()+"원");
					page.calcTotalAmt();
					
				} else {
					myAlert(json.header.error_text);
				}
			});
		},
		
		//등록세/취득세/공채 계산
		calc : function(type)
		{
			var carAmt = $("#carAmt").text().bMToNumber(); //화면의 차량가
			page.purRateAmt = carAmt/1.1*$("option:selected", "#slt_publDebtPurcRate").val();
			var returnValue = 0;
			
			if(type == "regtax"){ //등록세
				var result = Math.round(((carAmt/1.1)*0.05)*10000)/10000;
				returnValue = Math.floor(result/10)*10;
				
				//하이브리드인 경우
				if($("option", "#slt_disHybrid").size() > 0){
					returnValue = returnValue-1000000;
				}
				
			}else if(type == "acqtax"){ //취득세
				var result = Math.round(((carAmt/1.1)*0.02)*10000)/10000;
				returnValue = Math.floor(result/10)*10;
				
				//하이브리드인 경우
				if($("option", "#slt_disHybrid").size() > 0){
					returnValue = returnValue-400000;
				}
				
			}else if(type == "pubbond"){ //공채
				
				//일반차량인 경우
				returnValue = Math.floor(page.purRateAmt*$("option:selected", "#slt_publDebtDiscRate").val()/1000)*1000;
				
				//하이브리드인 경우
				if($("option", "#slt_disHybrid").size() > 0){
					returnValue = Math.floor((page.purRateAmt-$("option:selected", "#slt_disHybrid").val())*$("option:selected", "#slt_publDebtDiscRate").val()/1000)*1000;
				}
				
				//7인승이상인 경우
				if(page.carInfo.seater >= 7){
					returnValue = Math.floor(((page.carInfo.pubAmt.bMToNumber()*$("option:selected", "#slt_publDebtDiscRate").val()))/1000)*1000;
				}
				
				if(returnValue < 0) returnValue = 0;
			}
			
			return returnValue;
		},
		
		//총금액 계산
		calcTotalAmt : function()
		{
			var totalAmt = $("#carAmt").text().bMToNumber() + $("#regtax_amt").text().bMToNumber()
				+ $("#acqtax_amt").text().bMToNumber() + $("#pubbond_amt").text().bMToNumber() + $("#inp_extraChrgAmt").val().bMToNumber();
			
			$("#totalAmt").text((""+totalAmt).bMToCommaNumber()+"원");
		}
};

//internal browser에서 새로고침 버튼을 클릭한 경우 호출되는 함수
function clickNativeReloadButton(){
	bizMOB_Android.reload("101htmlCode");
}
