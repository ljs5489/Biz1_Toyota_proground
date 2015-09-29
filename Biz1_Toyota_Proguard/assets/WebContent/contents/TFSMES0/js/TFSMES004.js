/**
 * 사용자 등록
 */

//////////////  개발용(추후 제거)  //////////////
/*bizMOB.Web.post = function(options) {
	var response = "";
	if(options.message.header.trcode == "TFS001"){
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
			        "brand_code_count": 2,
			        "user_list": [
			            {
			                "user_id": "L047",
			                "brand_code": "A271"
			            },
			            {
			                "user_id": "T047",
			                "brand_code": "A272"
			            }
			        ]
			    }
		};
	}
	options.success(response);
};*/
//////////////  //개발용(추후 제거)  //////////////

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
		},

		initInterface : function()
		{
			//비밀번호 정책 안내 팝업 닫기
			$("#btn_closeGuide").bind("click", function(){
				$("#signLayout").removeClass("pos_r");
				$("#guideContent").hide();
			});
			
			//validation
			$("#signContent").bMValidate({
				"rules" : {
					"#inp_userId" : "required::아이디를 확인해주세요.",
					"#inp_userTempPwd" : "required::임시 비밀번호를 확인해주세요.",
					"#inp_userNewPwd" : "required&&rangeLength(8,15)::변경 비밀번호를 확인해주세요."
				}
			});
			
			//저장 버튼
			$("#btn_sign").bind("click", function(){
				if($("#signContent").bMValidate("check")){
					
					var newPwd = $("#inp_userNewPwd").val();
					
					var numReg = /[0-9]/gi;
					var engReg = /[a-zA-Z]/gi;
					var charReg = /[!,@,#,$,%,^,&,*,?,_,~]/gi;
					//var reg = /^(?!.*(.)\1{3})((?=.*[\d])(?=.*[A-Za-z])|(?=.*[^\w\d\s])(?=.*[A-Za-z])).{8,15}$/gi;
					
					if((engReg.test(newPwd)&&numReg.test(newPwd)) || (engReg.test(newPwd)&&charReg.test(newPwd))){
					}else {
						alert("최소 하나의 영문자 또는 숫자, 영문자 또는 특수 문자를 포함해야 합니다.");
						return false;
					}
					
					var TFS001 = bizMOB.Util.Resource.getTr("toyota", "TFS001",
					{
						header : { "trcode" : "TFS001" }
					});
					TFS001.body.device_id = bizMOB.Device.getinfo().device_id; //디바이스 아이디
					TFS001.body.user_temp_passwd = $("#inp_userTempPwd").val(); //사용자 임시 비밀번호(변경전)
					TFS001.body.user_changed_passwd = newPwd; //사용자 변경 패스워드(변경후)
					TFS001.body.user_id = $("#inp_userId").val(); //사용자 아이디
					
					bizMOB.Web.post({
						message : TFS001,
						success : function(json) {
							if(toyotaUtil.checkResponseError(json)) {
								
								//사용자 등록 여부 property에 저장
								bizMOB.Properties.set("isUserSigned", "Y");
								
								if(json.body.brand_code_count == 1){
									bizMOB.Properties.set("brandCode", json.body.user_list[0].brand_code);
								}
								
								alert("등록되었습니다.");
								bizMOB.Web.close({
									modal : true,
									replace : false,
									callback : "callback_TFSMES004",
									message : {
										brand_code_count : json.body.brand_code_count,
										user_list : json.body.user_list
									}
								});
								
							}
						}
					});
				}
			});
			
			//전화번호
			$("#phoneNo").bind("click", function(){
				bizMOB.Phone.tel($(this).text());
			});
		},
		
		initLayout : function()
		{
			//타이틀바
			var titlebar = toyotaResource.getCommonTitleBar("사용자 등록");
			titlebar.setVisible(false);
			
			//툴바
			var toolbar = toyotaResource.getCommonDefaultToolBar();
			toolbar.setVisible(false);
			
			//화면 레이아웃
			var layout = new bizMOB.Ui.PageLayout();
			layout.setTitleBar(titlebar);
			layout.setToolbar(toolbar);
			bizMOB.Ui.displayView(layout);
		}
};

function onClickAndroidBackButton(){
	bizMOB.Native.exit({ kill_type : "exit" });
}