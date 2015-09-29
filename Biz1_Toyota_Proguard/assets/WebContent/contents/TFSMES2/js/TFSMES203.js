/**
 * 메일 보내기
 */


//////////////  개발용(추후 제거)  //////////////
/*bizMOB.Web.post = function(options) {
	var response = "";
	if(options.message.header.trcode == "TFS203"){
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
	}else if(options.message.header.trcode == "TFS205"){
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
					mail_to_list : [
					                {
					                	user_email : "iljimae@tfskr.co.kr",
					                	mail_to_id : "ID1",
					                	user_name : "일지매"
					                },
					                {
					                	user_email : "hong@tfskr.co.kr",
					                	mail_to_id : "ID2",
					                	user_name : "홍길동"
					                },
					                {
					                	user_email : "hwang@tfskr.co.kr",
					                	mail_to_id : "ID3",
					                	user_name : "황진이"
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
	estSeqNo : undefined, //견적 아이디
	init : function(json)
	{
		page.estSeqNo = json.est_seq_no;
		
		page.initInterface();
		page.initData();
		page.initLayout();
	},

	initData : function()
	{
		//고객 메일 보내는사람 default 셋팅 & 고객TAB 전화번호 default 셋팅
		$(".sender_email", "#form2").val(bizMOB.Properties.get("userName") + " " + bizMOB.Properties.get("dealerNm"));
		
		//TFSKR 메일 보내는사람 selectbox 셋팅
		var TFS205 = bizMOB.Util.Resource.getTr("toyota", "TFS205",
		{
			header : { "trcode" : "TFS205" }
		});
		TFS205.body.use_kubun = bizMOB.Properties.get("userKubun"); //'U' : TFSKR 사용자, 'M' TFSKR 관리자, 'S' TMKR 사용자
		TFS205.body.user_id	= bizMOB.Properties.get("userId"); //사용자 아이디
		
		bizMOB.Web.post({
			message : TFS205,
			success : function(json) {
				if(toyotaUtil.checkResponseError(json)) {
					$(json.body.mail_to_list).each(function(){
						$("#slt_receiverName").append("<option user_email='"+this.user_email+"' mail_to_id='"+this.mail_to_id+"'>"+this.user_name+"</option>");
					});
				}
				
				//고객TAB 전화번호 default 셋팅
				var tel = page.strToPhone(json.body.from_user_phone, "-");
				$("#senderTel").val(tel);
			}
		});
	},

	initInterface : function()
	{
		//TFSKR 메일 validation
		$("#form1").bMValidate({
			"rules" : {
				".receiver_mail" : "email::받는사람메일을 확인해주세요.",
				"#customerName" : "required::고객명을 확인해주세요."
				//".receiver_name" : "required::받는사람을 확인해주세요."
			}
		});
		//고객 메일 validation
		$("#form2").bMValidate({
			"rules" : {
				".receiver_mail" : "email::받는사람메일을 확인해주세요.",
				".receiver_name" : "required::받는사람을 확인해주세요.",
				".sender_email" : "required::보내는사람을 확인해주세요."
			}
		});
		
		//고객 메일 전화번호
		$("#senderTel").focusout(function(){
			var phone = $("#senderTel").val().replace(/\D/g,"");
			$("#senderTel").val(page.strToPhone(phone, "-"));
		});	
		
		//고객 이름 필터링
		page.validation();
		$("#receiverName").keyup(function(){
			if(!$("#filterName").bMValidate("check")){
				$("#receiverName").val("");
			}
		});		
		
		//탭
		$(".tab").bind("click", function(){
			var value = $(this).attr("value");
			
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
		});
		
		//TFSKR 메일 받는사람 selectbox change
		$("#slt_receiverName").bind("change", function(){
			$(".receiver_mail", "#form1").val($("option:selected", this).attr("user_email"));
			$(".receiver_mail", "#form1").focus();
		});
		
		//TFSKR 보내기 버튼
		$("#btn_SendTFSKR").bind("click", function(){
			if($("option:selected", "#slt_receiverName").index() == 0){
				alert("받는사람을 선택해주세요.");
				return false;
			}
			
			if($("#form1").bMValidate("check")){
				var TFS203 = bizMOB.Util.Resource.getTr("toyota", "TFS203",
				{
					header : { "trcode" : "TFS203" }
				});
				TFS203.body.customer_name = $("#customerName").val(); //고객식별정보
				TFS203.body.user_id = bizMOB.Properties.get("userId"); //사용자 아이디
				TFS203.body.est_type = bizMOB.Properties.get("brandCode")=="A272" ? "T" : "L"; //L 렉서스 , T 토요타
				TFS203.body.from_user_email = bizMOB.Properties.get("userEmail"); //보내는 사람 이메일
				TFS203.body.est_seq_no = page.estSeqNo; //견적 아이디
				TFS203.body.from_user = bizMOB.Properties.get("userName"); //보내는 사람
				TFS203.body.to_mail_title = bizMOB.Properties.get("brandCode")=="A272" ? "토요타 금융상품 입니다." : "렉서스 금융상품 입니다."; //받을 메일제목
				TFS203.body.to_user = $("option:selected", "#slt_receiverName").text(); //받을 사용자
				TFS203.body.to_email = $(".receiver_mail", "#form1").val(); //받을 사용자 이메일
				TFS203.body.to_type = "T"; //받는이 구분 ( T:TFSKR , C:고객 )
				
				/** TFSKR 메모추가 */
				TFS203.body.to_user_memo = $("#tfskrMemo").val();
//					bizMOB.Ui.alert(JSON.stringify(TFS203.body));
				
				bizMOB.Web.post({
					message : TFS203,
					success : function(json) {
						if(toyotaUtil.checkResponseError(json)) {
							if(json.body.result){
								alert("발송 되었습니다.");
								
								bizMOB.Web.close({
									callback : "callback_TFSMES203"
								});
							}else {
								alert("발송 실패하였습니다.\n다시 시도해주세요.");
							}
						}
					}
				});
			}
		});
		
		//고객 보내기 버튼
		$("#btn_sendCust").bind("click", function(){
			if($("#form2").bMValidate("check")){
				
				var TFS203 = bizMOB.Util.Resource.getTr("toyota", "TFS203",
				{
					header : { "trcode" : "TFS203" }
				});
				/** cust 전화번호 추가 */
				TFS203.body.from_user_phone = $("#senderTel").val();
				/** cust 메모 추가 */
				TFS203.body.to_user_memo = $("#custMemo").val();
				TFS203.body.customer_name = ""; //고객식별정보
				TFS203.body.user_id = bizMOB.Properties.get("userId"); //사용자 아이디
				TFS203.body.est_type = bizMOB.Properties.get("brandCode")=="A272" ? "T" : "L"; //L 렉서스 , T 토요타
				TFS203.body.from_user_email = bizMOB.Properties.get("userEmail"); //보내는 사람 이메일
				TFS203.body.est_seq_no = page.estSeqNo; //견적 아이디
				TFS203.body.from_user = $(".sender_email", "#form2").val(); //보내는 사람
				TFS203.body.to_mail_title = bizMOB.Properties.get("brandCode")=="A272" ? "토요타 금융상품 입니다." : "렉서스 금융상품 입니다."; //받을 메일제목
				TFS203.body.to_user = $(".receiver_name", "#form2").val(); //받을 사용자
				TFS203.body.to_email = $(".receiver_mail", "#form2").val(); //받을 사용자 이메일
				TFS203.body.to_type = "C"; //받는이 구분 ( T:TFSKR , C:고객 )
				//bizMOB.Ui.alert(JSON.stringify(TFS203.body));
				
				bizMOB.Web.post({
					message : TFS203,
					success : function(json) {
						if(toyotaUtil.checkResponseError(json)) {
							if(json.body.result){
								alert("발송 되었습니다.");

								bizMOB.Web.close({
									callback : "callback_TFSMES203"
								});
							}else {
								alert("발송 실패하였습니다.\n다시 시도해주세요.");
							}
						}
					}
				});
			}
		});
		
		//취소 버튼
		$(".btn_cancel").bind("click", function(){
			bizMOB.Web.close({
				modal : true,
				replace : false
			});
		});
		
		
		/** 고객메뉴 > 고객TAB > 받는사람 > 조회 버튼 click */
		$("#receiverSearch").click(function(){
			page.openDialogPopup();
		});
	},
	
	initLayout : function()
	{
		//타이틀바
		var titlebar = toyotaResource.getCommonTitleBar("메일 보내기");
		
		//툴바
		var toolbar = toyotaResource.getCommonToolBar();
		
		//화면 레이아웃
		var layout = new bizMOB.Ui.PageLayout();
		layout.setTitleBar(titlebar);
		layout.setToolbar(toolbar);
		bizMOB.Ui.displayView(layout);
	},
	
	/** 전화번호 */
	strToPhone : function(phone, delim){
		var num = "0"+phone.bMRightSubstr(10);	
		return num.bMToFormatPhone(delim);
	},
	
	/** TFSMES204 */
	openDialogPopup : function(){
		var receiverName = $("#receiverName").val();

		var msg = {
			name   : receiverName
		};
		var option = {
			message : msg,
			width   : "90%",
			height  : "70%"
		};
		bizMOB.Ui.openDialog("TFSMES2/html/TFSMES204.html",option);		
	},
	/** TFSMES204 Callback */
	callbackTFSMES204 : function(json){
		var name = json.name;
		var email = json.email;
		
		$("#receiverName").val(name);
		$("#receiverMail").val(email);
		//bizMOB.Ui.alert(name+", "+email);
	},
	
	validation : function(){
		$("#filterName").bMValidate({
			"rules" : {
				"#receiverName" : function(target){
					var filter = target.val();
					return filter.search(/['"=><;:#&|]/g)<0? true:"\' \" = > < ; : # & | 는 입력하실 수 없습니다.";
				}
			}
		});
	}
};
