/**
 * 견적 상세
 */


//////////////  개발용(추후 제거)  //////////////
/*bizMOB.Web.post = function(options) {
	var response = "";
	if(options.message.header.trcode == "TFS202"){
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
					total_cost : "55000000", //총비용(생성해야함)
					car_amt : "53000000", //차량가(생성해야함)
					mail_yn : "N", //메일 발송여부 Y:발송 , N:미발송 , 발송일 경우 견적 삭제 불가능
					month_due_amt : 28700000, //월 불입금
					prerel_pay_amt : 5870000, //출고전납입금액
					posp_amt : 10000, //잔가_금액(유예)
					posp_rate : 30, //잔가_비율 (유예)
					term : "12", //기간(운용리스)
					sd_amt : 710000, //보증금(운용리스)
					advs_paid_amt : 10000000, //차량가 선납금
					leas_util_amt : 47000000, //리스 이용 금액
					extra_chrg_amt : 700000, //부대비용
					publ_debt_disc_rate : 151200, //공채할인율
					acqtax_amt : 210000, //취득세
					regtax_amt : 150000, //등록세
					car_cd : "Camry", //차종
					prod_kubun : "B02L", //금융상품구분
					idnt_info : "견적식별정보 입니다.", //견적식별정보
				}
		};
	}else if(options.message.header.trcode == "TFS204"){
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
		estSeqNo : undefined, //견적 아이디
		detailInfo : undefined, //상세정보
		init : function(json)
		{
			page.initInterface();
			page.initData(json);
			page.initLayout();
		},

		initData : function(json)
		{
			page.estSeqNo = json.est_seq_no;
			
			//조회
			var TFS202 = bizMOB.Util.Resource.getTr("toyota", "TFS202",
			{
				header : { "trcode" : "TFS202" }
			});
			TFS202.body.dealer_id = bizMOB.Properties.get("dealerId"); //딜러 아이디
			TFS202.body.est_seq_no = page.estSeqNo; //견적 아이디
			
			bizMOB.Web.post({
				message : TFS202,
				success : function(json) {
					if(toyotaUtil.checkResponseError(json)) {
						page.detailInfo = json.body;
						page.renderData(json);
					}
				}
			});
		},

		initInterface : function()
		{
			//견적삭제 버튼
			$("#btn_delete").bind("click", function(){
				if(page.detailInfo.mail_yn == "Y"){
					alert("이미 메일 발송된 견적은 삭제할 수 없습니다.");
					return false;
				}
				
				var TFS204 = bizMOB.Util.Resource.getTr("toyota", "TFS204",
				{
					header : { "trcode" : "TFS204" }
				});
				TFS204.body.est_seq_no = page.estSeqNo; //견적 아이디
				
				bizMOB.Web.post({
					message : TFS204,
					success : function(json) {
						if(toyotaUtil.checkResponseError(json)) {
							if(json.body.result){
								alert("삭제 되었습니다.");
								bizMOB.Web.close({
									callback : "callback_TFSMES202"
								});
							}else {
								alert("실패하였습니다.\n다시 시도해주세요.");
							}
						}
					}
				});
			});
		},
		
		renderData : function(json)
		{
			//금융상품별로 항목 재정의
			if(json.body.prod_kubun == "B02O"){ //운용리스
				
				$("#sdAmtContent").show();
				
				$("#leasUtilAmtText").text("리스이용금액");
				$("#advsPaidAmtText").text("선납금");
				$("#pospAmtText").text("잔존가치");
				$("#prerelPayAmtText").html("초기납입금액<br/>(인지대 포함)");
				
			}else if(json.body.prod_kubun == "B02L"){ //할부금융
				$("#monthDueAmtText").text("월할부금");
			}
			
			//프로모션 항목 show/hide
			if($.trim(json.body.pro_name) != ""){
				$("#proName").show();	
			}
			if($.trim(json.body.pro_bill_info) != ""){
				$("#billingProContent").show();
			}
			
			//보조금 show/hide
			if(json.body.at_subsidy.bMToNumber() > 0){
				$("#atSubsidyContent").show();
			}
			//추가보조금 show/hide
			if(json.body.at_subsidy_add.bMToNumber() > 0){
				$("#atSubsidyAddContent").show();
			}
			
			var returnValue = "";
			for(var i=0; i<(4-page.estSeqNo.substring(8).length); i++){
				returnValue += "0";
			}
			$("#estSeqNo").text("["+ page.estSeqNo.substring(0,8) +"-"+ returnValue + page.estSeqNo.substring(8) +"]");
			
			//월리스료(차세포함)
			if(json.body.car_tax_yn == "Y"){
				$("#carTaxMonthDueAmtContent").show();
			}
			
			var dir = 
			[
				{ "type" : "single", "target" : "#proName", "value" : "customer_pro_name" },
				{ "type" : "single", "target" : "#idntInfo", "value" : "idnt_info" },
				{ "type" : "single", "target" : "#prodKubunName", "value" : function(arg){
					if(arg.item.prod_kubun == "B02O") return "운용리스";
					else if(arg.item.prod_kubun == "B02F") return "금융리스";
					else if(arg.item.prod_kubun == "B02L") return "할부금융";
				}},
				{ "type" : "single", "target" : "#carName", "value" : "mdel_name" },
				{ "type" : "single", "target" : "#carAmt", "value" : function(arg){
					return (""+arg.item.car_amt).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#regtaxAmt", "value" : function(arg){
					return (""+arg.item.regtax_amt).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#acqtaxAmt", "value" : function(arg){
					return (""+arg.item.acqtax_amt).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#publDebtDiscRate", "value" : function(arg){
					return (""+arg.item.pubbond_amt).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#extraChrgAmt", "value" : function(arg){
					return (""+arg.item.extra_chrg_amt).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#totalAmt", "value" : function(arg){
					return (""+arg.item.total_cost).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#leasUtilAmt", "value" : function(arg){
					return (""+arg.item.leas_util_amt).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#advsPaidAmt", "value" : function(arg){
					return (""+arg.item.advs_paid_amt).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#sdRate", "value" : function(arg){
					return arg.item.sd_rate+"%";
				}},
				{ "type" : "single", "target" : "#sdAmt", "value" : function(arg){
					return (""+arg.item.sd_amt).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#term", "value" : function(arg){
					return arg.item.term+"개월";
				}},
				{ "type" : "single", "target" : "#pospRate", "value" : function(arg){
					return arg.item.posp_rate+"%";
				}},
				{ "type" : "single", "target" : "#pospAmt", "value" : function(arg){
					return (""+arg.item.posp_amt).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#prerelPayAmt", "value" : function(arg){
					return (""+arg.item.prerel_pay_amt).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#carTaxMonthDueAmt", "value" : function(arg){
					return (""+arg.item.month_due_car_amt).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#monthDueAmt", "value" : function(arg){
					if(arg.item.prod_kubun == "B02O") return (""+arg.item.month_due_amt).bMToCommaNumber()+"원";
					else return arg.item.int_rate.bMToNumber() + "% / " + (""+arg.item.month_due_amt).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#atSubsidy", "value" : function(arg){
					return (""+arg.item.at_subsidy).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#atSubsidyAdd", "value" : function(arg){
					return (""+arg.item.at_subsidy_add).bMToCommaNumber()+"원";
				}},
				{ "type" : "single", "target" : "#billing", "value" : "pro_bill_info" },
				{ "type" : "single", "target" : "#mailYn", "value" : "mail_yn" }
			];
			$("#sub_content").bMRender(json.body, dir);
		},
		
		initLayout : function()
		{
			//타이틀바
			var titlebar = toyotaResource.getCommonTitleBar("견적 상세");
			titlebar.setTopRight(bizMOB.Ui.createButton({
				button_text : "메일",
				image_name : "images/icon/email.png",
				listener : function() {
					bizMOB.Web.open("TFSMES2/html/TFSMES203.html", {
						modal : true,
						replace : false,
						message : {
							est_seq_no : page.estSeqNo
						}
					});
				}
			}));
			
			//툴바
			var toolbar = toyotaResource.getCommonToolBar();
			
			//화면 레이아웃
			var layout = new bizMOB.Ui.PageLayout();
			layout.setTitleBar(titlebar);
			layout.setToolbar(toolbar);
			bizMOB.Ui.displayView(layout);
		}
};

//메일 화면에서 호출하는 callback 함수
function callback_TFSMES203(json){
	page.detailInfo.mail_yn = "Y";
	$("#mailYn").text("Y");
}
