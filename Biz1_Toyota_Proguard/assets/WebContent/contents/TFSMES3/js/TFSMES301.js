/**
 * 나의 정보
 */


//////////////  개발용(추후 제거)  //////////////
/*bizMOB.Web.post = function(options) {
	var response = "";
	if(options.message.header.trcode == "TFS301"){
		response = {
				header : {
					"result" : true,
					"error_code" : "",
					"error_text" : "",         
					"info_text" : "",         
					"message_version" : "",         
					"login_session_id" : "",         
					"trcode" : options.message.header.trcode
				},
				body : {
					user_birthday : "19800517", //생년월일
					deailer_nm : "홍길동 딜러", //소속딜러정보(딜러명)
					user_email : "jhkim@naver.com", //사용자 이메일
					user_name : "김지훈", //사용자 명
					user_passwd : "aKdf*^&nk7!!", //사용자 패스워드
					user_id : "jhkim" //사용자 아이디
				}
		};
	}else if(options.message.header.trcode == "TFS302"){
		response = {
				header : {
					"result" : true,
					"error_code" : "",
					"error_text" : "",         
					"info_text" : "",         
					"message_version" : "",         
					"login_session_id" : "",         
					"trcode" : options.message.header.trcode
				},
				body : {}
		};
	}else if(options.message.header.trcode == "TFS303"){
		response = {
				header : {
					"result" : true,
					"error_code" : "",
					"error_text" : "",         
					"info_text" : "",         
					"message_version" : "",         
					"login_session_id" : "",         
					"trcode" : options.message.header.trcode
				},
				body : {
					result : true
				}
		};
	}
	options.success(response);
};*/
//////////////  //개발용(추후 제거)  //////////////

var page = 
{
		isFromLogin : undefined, //로그인화면에서 왔는지 여부 저장
		init : function(json)
		{
			page.initInterface();
			page.initData(json);
			page.initLayout();
		},

		initData : function(json)
		{
			if(json.isFromLogin != undefined){
				page.isFromLogin = json.isFromLogin;
				
				$(".tab").removeClass("on").removeClass("off");
				$(".tab:eq(1)").addClass("on");
				$(".tab:eq(0)").addClass("off");
				$("#form1").hide();
				$("#form2").show();
			}
			
			//기본정보 조회
			page.getData();
			
		},

		initInterface : function()
		{
			//기본정보 validation
			$("#userEmailModifyContent").bMValidate({
				"rules" : {
					"#inp_email" : "required::이메일을 확인해주세요."
				}
			});
			//비밀번호변경 validation
			$("#pwdContent").bMValidate({
				"rules" : {
					"#inp_newPwd1" : "required&&rangeLength(8,15)::신규비밀번호를 확인해주세요.",
					"#inp_newPwd2" : "required&&rangeLength(8,15)::비밀번호확인을 확인해주세요."
				}
			});
			
			//탭
			$(".tab").bind("click", function(){
				var value = $(this).attr("value");
				
				if(page.isFromLogin){
					if(value == "1") alert("조회할 수 없습니다.");
				}else {
					$(".tab").removeClass("on").removeClass("off");
					$(this).addClass("on");
					$(".tab").not(this).addClass("off");
					
					if(value == "1"){
						$("#form2").hide();
						$("#form1").show();
					}else if(value == "2"){
						$("#form1").hide();
						$("#form2").show();
					}
				}
			});
			
			//기본정보 수정 버튼
			$("#btn_userModify").bind("click", function(){
				$("#userEmailContent").hide();
				$("#userEmailModifyContent").show();
				$("#btn_userModify").hide();
				$("#btn_userSave").show();
			});
			
			//기본정보 저장 버튼
			$("#btn_userSave").bind("click", function(){
				if($("#userEmailModifyContent").bMValidate("check")){
					
					var TFS302 = bizMOB.Util.Resource.getTr("toyota", "TFS302",
					{
						header : { "trcode" : "TFS302" }
					});
					TFS302.body.user_new_email = $("#inp_email").val(); //사용자 이메일
					TFS302.body.user_id = bizMOB.Properties.get("userId"); //사용자 아이디
					
					bizMOB.Web.post({
						message : TFS302,
						success : function(json) {
							if(toyotaUtil.checkResponseError(json)) {
								alert("정상 처리 되었습니다.");
								$("#userEmailModifyContent").hide();
								$("#userEmailContent").show();
								$("#btn_userSave").hide();
								$("#btn_userModify").show();
								
								$("#userEmail").text(TFS302.body.user_new_email);
							}
						}
					});
					
				}
			});
			
			//비밀번호 수정 버튼
			$("#btn_pwdModify").bind("click", function(){
				if($("#pwdContent").bMValidate("check")){
					
					var newPwd1 = $("#inp_newPwd1").val();
					var newPwd2 = $("#inp_newPwd2").val();
					
					var numReg = /[0-9]/gi;
					var engReg = /[a-zA-Z]/gi;
					var charReg = /[!,@,#,$,%,^,&,*,?,_,~]/gi;
					//var reg = /^(?!.*(.)\1{3})((?=.*[\d])(?=.*[A-Za-z])|(?=.*[^\w\d\s])(?=.*[A-Za-z])).{8,15}$/gi;
					
					if((engReg.test(newPwd1)&&numReg.test(newPwd1)) || (engReg.test(newPwd1)&&charReg.test(newPwd1))){
					}else {
						alert("최소 하나의 영문자 또는 숫자, 영문자 또는 특수 문자를 포함해야 합니다.");
						return false;
					}
					if(newPwd1 != newPwd2){
						alert("비밀번호확인을 확인해주세요.");
						return false;
					}
					
					var TFS303 = bizMOB.Util.Resource.getTr("toyota", "TFS303",
					{
						header : { "trcode" : "TFS303" }
					});
					TFS303.body.user_check_passwd = newPwd2; //사용자 확인 비밀번호
					TFS303.body.user_new_passwd = newPwd1; //사용자 신규 비밀번호
					TFS303.body.user_id = bizMOB.Properties.get("userId"); //사용자 아이디
					
					bizMOB.Web.post({
						message : TFS303,
						success : function(json) {
							if(toyotaUtil.checkResponseError(json)) {
								if(json.body.result){
									alert("정상 처리되었습니다.");
									
									if(page.isFromLogin){
										bizMOB.Web.open("TFSMES0/html/TFSMES002.html", {
											modal : false,
											replace : false,
											message : {}
										});	
									}
								}else {
									alert("실패하였습니다.\n재시도해 주시기 바랍니다.");
								}
							}
						}
					});
				}
			});
		},
		
		getData : function()
		{
			var TFS301 = bizMOB.Util.Resource.getTr("toyota", "TFS301",
			{
				header : { "trcode" : "TFS301" }
			});
			TFS301.body.user_id = bizMOB.Properties.get("userId"); //사용자 아이디
			
			bizMOB.Web.post({
				message : TFS301,
				success : function(json) {
					if(toyotaUtil.checkResponseError(json)) {
						page.renderData(json);
					}
				}
			});
		},
		
		renderData : function(json)
		{
			var dir = 
			[
				{ "type" : "single", "target" : "#userId", "value" : "user_id" },
				/*{ "type" : "single", "target" : "#userPwd", "value" : function(arg){
					var star = "";
					for(var i=0; i<arg.item.user_passwd.length; i++){ star += "*"; }
					return star;
				}},*/
				{ "type" : "single", "target" : "#userName", "value" : "user_name" },
				{ "type" : "single", "target" : "#userBirth", "value" : function(arg){
					return arg.item.user_birthday.bMToFormatDate("yyyy.mm.dd");
				}},
				{ "type" : "single", "target" : "#userEmail", "value" : "user_email" },
				{ "type" : "single", "target" : "#userDealer", "value" : "deailer_nm" }
			];
			$("#userContent").bMRender(json.body, dir);
		},
		
		initLayout : function()
		{
			//타이틀바
			var titlebar = toyotaResource.getCommonTitleBar("나의 정보");
			if(page.isFromLogin){
				titlebar.setTopLeft(bizMOB.Ui.createButton({
					button_text : "",
					image_name : "",
					listener : function() {}
				}));
			}
			
			//툴바
			var toolbar = toyotaResource.getCommonToolBar();
			if(page.isFromLogin) toolbar.setVisible(false);
			
			//화면 레이아웃
			var layout = new bizMOB.Ui.PageLayout();
			layout.setTitleBar(titlebar);
			layout.setToolbar(toolbar);
			bizMOB.Ui.displayView(layout);
		}
};
