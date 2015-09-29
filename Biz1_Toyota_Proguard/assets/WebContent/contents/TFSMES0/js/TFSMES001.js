/**
 * 로그인
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
			//처음 앱 실행인 경우 사용자 등록 화면 연결
			if(bizMOB.Properties.get("isUserSigned") == undefined){
				bizMOB.Web.open("TFSMES0/html/TFSMES004.html", {
					modal : true,
					replace : false,
					message : {}
				});
			}else {
				var brandCodeCount = bizMOB.Properties.get("brandCodeCount");
				if(brandCodeCount > 1){
					page.setLogoImg("A271");
					$("#btn_transLogo").show();
				}else if(brandCodeCount == 1){
					page.setLogoImg(bizMOB.Properties.get("brandCode"));
				}
			}
			
			page.getSaveUserId();
		},

		initInterface : function()
		{
			//validation
			$("#loginContent").bMValidate({
				"rules" : {
					"#inp_userId" : "required::아이디를 확인해주세요.",
					"#inp_userPwd" : "required::비밀번호를 확인해주세요."
				}
			});

			//사용자 아이디 클릭시 scroll up
			$("#inp_userId").bind("click", function(event){
				window.scrollTo(0,event.pageY - 50);
			});
			
			//로그인 버튼
			$("#btn_login").bind("click", function(){
				if($("#loginContent").bMValidate("check")){
					
					//하나의 deviceId에 두개의 계정이 있는 사용자인 경우, 화면 로고와 로그인하고자 하는 계정이 맞는지 validation
					if(bizMOB.Properties.get("userList") != undefined){
						var userList = $.parseJSON(bizMOB.Properties.get("userList"));
						var userId = $.trim($("#inp_userId").val());
						if(bizMOB.Properties.get("brandCodeCount") > 1){
							var logoBrandCode = "";
							if($("#img_logo_L").hasClass("show")){
								logoBrandCode = "A271";
							}else if($("#img_logo_T").hasClass("show")){
								logoBrandCode = "A272";
							}
							var exit = false;
							$.grep(userList, function(n){
								if(n.user_id == userId){
									if(n.brand_code != logoBrandCode){
										exit = true;
									}
								}
							});
							if(exit){
								alert("해당 아이디의 로고를 전환해주세요.");
								return false;
							}
						}
					}
					
					//테스트용
					/*var json = {
						body : {
							user_kubun : "M",	 	 
							dealer_id : "D000015",	 	 
							user_name : "테스터1",
							user_email : "test2@tfskr.co.kr",
							dealer_nm : "딜러1",
							brand_code : "A272",
							passwd_changed_date : "20120901"
						}
					};
					bizMOB.Properties.set("userKubun", json.body.user_kubun); //'M' : 관리자, 'U' : 사용자(Agent) -> 화면 제어용
					bizMOB.Properties.set("userId", "test2"); //사용자아이디
					bizMOB.Properties.set("userEmail", json.body.user_email); //사용자 메일
					bizMOB.Properties.set("dealerId", json.body.dealer_id); //딜러 아이디
					bizMOB.Properties.set("userName", json.body.user_name); //사용자 명
					bizMOB.Properties.set("dealerNm", json.body.dealer_nm); //딜러 명
					bizMOB.Properties.set("brandCode", json.body.brand_code); //브랜드 코드 ( A271:렉서스 , A272:토요타)
					var dateDiff = json.body.passwd_changed_date.bMDateDiff((new Date()).bMToFormatDate("yyyymmdd"));
					if(dateDiff >= 83){
						var btnOk = bizMOB.Ui.createTextButton("확인", function() {
							bizMOB.Web.open("TFSMES3/html/TFSMES301.html", {
								modal : false,
								replace : false,
								message : {
									isFromLogin : true
								}
							});
						});
						bizMOB.Ui.confirm("비밀번호 변경", "비밀번호를 변경하신지 "+dateDiff+"일이 경과했습니다.\n90일 경과 이전에 신규 비밀번호로 변경하셔야 정상적으로 사용하실 수 있습니다.", btnOk);
					}else {
						bizMOB.Web.open("TFSMES0/html/TFSMES002.html", {
							modal : false,
							replace : false,
							message : {}
						});
					}*/
					
					var TFS002 = bizMOB.Util.Resource.getTr("toyota", "TFS002");
					var userId = $("#inp_userId").val();
					var userPwd = $("#inp_userPwd").val();
					TFS002.body.user_passwd = userPwd; //사용자 비밀번호
					TFS002.body.user_id = userId; //사용자 아이디
					
					bizMOB.Security.authorize({
						userid : userId,
						password : userPwd,
						trcode : TFS002.header.trcode,
						message : TFS002,
						success : function(json){
							if(toyotaUtil.checkResponseError(json)) {
								
								bizMOB.Properties.set("userKubun", json.body.use_kubun); //'M' : 관리자, 'U' : 사용자(Agent) -> 화면 제어용
								bizMOB.Properties.set("userId", userId); //사용자아이디
								bizMOB.Properties.set("userEmail", json.body.user_email); //사용자 메일
								bizMOB.Properties.set("dealerId", json.body.dealer_id); //딜러 아이디
								bizMOB.Properties.set("userName", json.body.user_name); //사용자 명
								bizMOB.Properties.set("dealerNm", json.body.dealer_nm); //딜러 명
								bizMOB.Properties.set("brandCode", json.body.brand_code); //브랜드 코드 ( A271:렉서스 , A272:토요타)
								
								//비밀번호 변경일 체크
								var dateDiff = json.body.passwd_changed_date.bMDateDiff((new Date()).bMToFormatDate("yyyymmdd"));
								if(dateDiff >= 83){
									var btnOk = bizMOB.Ui.createTextButton("확인", function() {
										bizMOB.Web.open("TFSMES3/html/TFSMES301.html", {
											modal : false,
											replace : false,
											message : {
												isFromLogin : true
											}
										});
									});
									bizMOB.Ui.confirm("비밀번호 변경", "비밀번호를 변경하신지 "+dateDiff+"일이 경과했습니다.\n90일 경과 이전에 신규 비밀번호로 변경하셔야 정상적으로 사용하실 수 있습니다.", btnOk);
									/*bizMOB.Ui.openDialog("TFSMES0/html/TFSMES003.html", { 
										uiStyle : "default",
										width : "80%",
										height : "40%",
										base_size_orientation : "vertical",
										message : {
											alert_type : "2",
											alert_msg : "",
											date_diff : dateDiff
										}
									});*/
								}else {
									bizMOB.Web.open("TFSMES0/html/TFSMES002.html", {
										modal : false,
										replace : false,
										message : {}
									});
								}
								
								page.setSaveUserId();
							}
						}
					});
				}
			});
			
			//전화번호
			$("#phoneNo").bind("click", function(){
				bizMOB.Phone.tel($(this).text());
			});
			
			//로고전환 버튼
			$("#btn_transLogo").bind("click", function(){
				
				if($("#img_logo_L").hasClass("show")){
					page.setLogoImg("A272");
				}else if($("#img_logo_T").hasClass("show")){
					page.setLogoImg("A271");
				}
			});
		},
		
		//로고 이미지 표시
		setLogoImg : function(brandCode)
		{
			$("#img_logo_T, #img_logo_L").removeClass("show");
			
			if(brandCode == "A271"){ //렉서스
				$("#img_logo_T").hide();
				$("#img_logo_L").show();
				$("#img_logo_L").addClass("show");
			}else if(brandCode == "A272"){ //도요타
				$("#img_logo_T").show();
				$("#img_logo_L").hide();
				$("#img_logo_T").addClass("show");
			}
		},
		
		initLayout : function()
		{
		},
		
		/** Save id */
		setSaveUserId : function(){
			var checkUserId = $("#checkUserId").prop("checked");
			var userId = $("#inp_userId").val();
			if(checkUserId == true){
				bizMOB.Properties.set("userId", userId);
				bizMOB.Properties.set("checkUserId", true);
			}
			else{
				bizMOB.Properties.set("userId", userId);
				bizMOB.Properties.set("checkUserId", false);			
			}
		},
		
		getSaveUserId : function(){
			var checkUserId = bizMOB.Properties.get("checkUserId");
			if(checkUserId == true){
				$("#inp_userId").val(bizMOB.Properties.get("userId"));
				$("#checkUserId").prop("checked", true);
			}else{
				$("#inp_userId").val("");
				$("#checkUserId").prop("checked", true);
			}
		} 
};

//사용자 등록 화면 callback
function callback_TFSMES004(json){
	bizMOB.Properties.set("brandCodeCount", json.brand_code_count);
	bizMOB.Properties.set("userList", JSON.stringify(json.user_list));
	
	if(json.brand_code_count == 1){
		page.setLogoImg(json.user_list[0].brand_code);
	}else if(json.brand_code_count > 1){ //하나의 deviceId로 두개의 계정이 있는 사용자인 경우, default 렉서스 로고 이미지 표시
		page.setLogoImg("A271");
		$("#btn_transLogo").show();
	}
}