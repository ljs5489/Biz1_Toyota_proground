/**
 * 견적 목록
 */


//////////////  개발용(추후 제거)  //////////////
/*bizMOB.Web.post = function(options) {
	var response = "";
	if(options.message.header.trcode == "TFS201"){
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
					estimate_list_count : 5, //총 견적 리스트 갯수
					estimate_list : [
					                 {
					                	 est_seq_no : "130819", //견적 아이디
					                	 entry_date : "20130507150315", //견적 등록일 (yyyymmddhhmiss)
					                	 user_name : "홍길동", //사용자 명
					                	 idnt_info : "견적식별 정보입니다.", //견적식별 정보
					                	 mdel_name : "Camry", //차종명
					                	 prod_kubun : "B02O" //금융상품구분(금융/운용/할부)
					                 },
					                 {
					                	 est_seq_no : "130819", //견적 아이디
					                	 entry_date : "20130507150315", //견적 등록일 (yyyymmddhhmiss)
					                	 user_name : "홍길동", //사용자 명
					                	 idnt_info : "견적식별 정보입니다.", //견적식별 정보
					                	 mdel_name : "Camry", //차종명
					                	 prod_kubun : "B02F" //금융상품구분(금융/운용/할부)
					                 },
					                 {
					                	 est_seq_no : "130819", //견적 아이디
					                	 entry_date : "20130507150315", //견적 등록일 (yyyymmddhhmiss)
					                	 user_name : "홍길동", //사용자 명
					                	 idnt_info : "견적식별 정보입니다.", //견적식별 정보
					                	 mdel_name : "Camry", //차종명
					                	 prod_kubun : "B02L" //금융상품구분(금융/운용/할부)
					                 },
					                 {
					                	 est_seq_no : "130819", //견적 아이디
					                	 entry_date : "20130507150315", //견적 등록일 (yyyymmddhhmiss)
					                	 user_name : "홍길동", //사용자 명
					                	 idnt_info : "견적식별 정보입니다.", //견적식별 정보
					                	 mdel_name : "Camry", //차종명
					                	 prod_kubun : "B02F" //금융상품구분(금융/운용/할부)
					                 },
					                 {
					                	 est_seq_no : "130819", //견적 아이디
					                	 entry_date : "20130507150315", //견적 등록일 (yyyymmddhhmiss)
					                	 user_name : "홍길동", //사용자 명
					                	 idnt_info : "견적식별 정보입니다.", //견적식별 정보
					                	 mdel_name : "Camry", //차종명
					                	 prod_kubun : "B02F" //금융상품구분(금융/운용/할부)
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
		today : undefined, //오늘 날짜
		startIndex : 1,
		totalIndex : 0,
		init : function()
		{
			page.initInterface();
			page.initData();
			page.initLayout();
		},

		initData : function()
		{
			page.today = new Date();
			
			//datepicker
			$("#from").datepicker({
	            showOn: 'button',
	            buttonImage: '../../images/icon/cld_blue.gif',
	            buttonImageOnly: true,
	            dateFormat : "yy-mm-dd",
	            onSelect : function(dateText, inst){
	            	$(this).attr("selectedDate", dateText.bMToNumber());
	            }
	        });
	        $("#to").datepicker({
	            showOn: 'button',
	            buttonImage: '../../images/icon/cld_blue.gif',
	            buttonImageOnly: true,
	            dateFormat : "yy-mm-dd",
	            onSelect : function(dateText, inst){
	            	$(this).attr("selectedDate", dateText.bMToNumber());
	            }
	        });
	        $("img.ui-datepicker-trigger").attr("style", "margin-left:2px; vertical-align:middle; cursor: Pointer;position:absolute;right:0;top:1px;width:22px;height:22px;");
	        $('.ui-input-text:eq(0),.ui-input-text:eq(1)').css("width", "83%");
	        //datepicker default 셋팅
	        page.setDatepicker(page.today, page.today);
		},

		initInterface : function()
		{
			//어제 버튼
			$("#btn_yesterday").bind("click", function(){
				var yesterday = new Date(page.today.getFullYear(), page.today.getMonth(), page.today.getDate()-1);
				page.setDatepicker(yesterday, yesterday);
				page.search(true);
			});
			
			//최근1주일 버튼
			$("#btn_recentWeek").bind("click", function(){
				var recentWeek = new Date(page.today.getFullYear(), page.today.getMonth(), page.today.getDate()-7);
				page.setDatepicker(recentWeek, page.today);
				page.search(true);
			});
			
			//최근1개월 버튼
			$("#btn_recentMonth").bind("click", function(){
				var recentMonth = new Date(page.today.getFullYear(), page.today.getMonth()-1, page.today.getDate());
				page.setDatepicker(recentMonth, page.today);
				page.search(true);
			});
			
			//검색 버튼
			$("#btn_search").bind("click", function(){
				var fromDate = $("#from").attr("selectedDate");
				var toDate = $("#to").attr("selectedDate");
				
				if(fromDate.bMDateDiff(toDate) < 0){
					alert("기간 선택이 잘못되었습니다.");
					return false;
				}
				
				page.search(true);
			});
			
			//더보기 버튼
			$("#btn_more").bind("click", function(){
				page.search(false);
			});
			
			//목록 클릭
			$("#list").delegate(".record", "click", function(){
				var estimateData = $.parseJSON($(this).attr("estimateData"));
				
				bizMOB.Web.open("TFSMES2/html/TFSMES202.html", {
					modal : true,
					replace : false,
					message : {
						est_seq_no : estimateData.est_seq_no
					}
				});
			});
		},
		
		//datepicker 날짜 셋팅
		setDatepicker : function(from, to)
		{
			$("#from").datepicker("setDate", from);
			$("#from").attr("selectedDate", from.bMToFormatDate("yyyymmdd"));
			$("#to").datepicker("setDate", to);
			$("#to").attr("selectedDate", to.bMToFormatDate("yyyymmdd"));	
		},
		
		//조회
		search : function(replaceFlag)
		{
			//새로 조회하는 경우 startIndex 초기화
			if(replaceFlag){
				page.startIndex = 1;
			}
			
			var TFS201 = bizMOB.Util.Resource.getTr("toyota", "TFS201",
			{
				header : { "trcode" : "TFS201" }
			});
			TFS201.body.dealer_id = bizMOB.Properties.get("dealerId"); //딜러 아이디
			TFS201.body.user_id = bizMOB.Properties.get("userId"); //사용자 아이디
			TFS201.body.rowsPerPage = 10; //보여줄 페이지 갯수(ex)10,20)
			TFS201.body.beginIndex = page.startIndex; //페이징 수 ( ex) 1페이지,2페이지 )
			TFS201.body.sch_keyword = $("#inp_searchValue").val(); //고객 식별 or 상품
			TFS201.body.sch_end_date = $("#to").attr("selectedDate"); //조회 종료일 (yyyymmdd)
			TFS201.body.sch_start_date = $("#from").attr("selectedDate"); //조회 시작일 (yyyymmdd)
			TFS201.body.use_kubun = bizMOB.Properties.get("userKubun"); //'M' : 관리자, 'U' : 사용자(Agent) -> 화면 제어용
			
			bizMOB.Web.post({
				message : TFS201,
				success : function(json) {
					if(toyotaUtil.checkResponseError(json)) {
						page.totalIndex = json.body.estimate_list_count;
						
						//더보기 버튼 show/hide
						if((page.startIndex*10) >= page.totalIndex){
							$("#moreContent").hide();
						}else {
							$("#moreContent").show();
						}
						
						page.startIndex += 1;
						
						page.renderList(json, replaceFlag);
					}
				}
			});
		},
		
		renderList : function(json, replaceFlag)
		{
			if(json.body.estimate_list.length == 0){
				alert("조회된 정보가 없습니다.");
				$(".record", "#list").remove();
			}else {
				var dir = 
					[
					 { "type" : "loop", "target" : ".record", "value" : "estimate_list",
						 "detail" : 
							 [
							  { "type" : "single", "target" : ".@estimateData", "value" :
								  function(arg){
								  return JSON.stringify({
									  est_seq_no : arg.item.est_seq_no,
									  entry_date : arg.item.entry_date,
									  user_name : arg.item.user_name,
									  idnt_info : arg.item.idnt_info,
									  mdel_name : arg.item.mdel_name,
									  prod_kubun : arg.item.prod_kubun,
									  est_hhmiss : arg.item.est_hhmiss
								  });
							  }},
							  { "type" : "single", "target" : ".est_seq_no", "value" : function(arg){
								  var returnValue = "";
								  for(var i=0; i<(4-arg.item.est_seq_no.substring(8).length); i++){
									  returnValue += "0";
								  }
								  return "["+ arg.item.est_seq_no.substring(0,8) +"-"+ returnValue + arg.item.est_seq_no.substring(8) +"]";
							  }},
							  { "type" : "single", "target" : ".idnt_info", "value" : "idnt_info" },
							  { "type" : "single", "target" : ".mdel_name", "value" : "mdel_name" },
							  { "type" : "single", "target" : ".prod_kubun", "value" : function(arg){
								  if(arg.item.prod_kubun == "B02O") return "운용리스";
								  else if(arg.item.prod_kubun == "B02F") return "금융리스";
								  else if(arg.item.prod_kubun == "B02L") return "할부금융";
							  }},
							  { "type" : "single", "target" : ".user_name", "value" : "user_name" },
							  { "type" : "single", "target" : ".entry_time", "value" : function(arg){
								  return arg.item.est_hhmiss;
							  }}
							  ]
					 }
					 ];
				$("#listTemplate").bMRender(json.body, dir, { clone : true, newId : "list", replace : replaceFlag });
			}

		},
		
		initLayout : function()
		{
			//타이틀바
			var titlebar = toyotaResource.getCommonTitleBar("견적 조회");
			
			//툴바
			var toolbar = toyotaResource.getCommonToolBar();
			
			//화면 레이아웃
			var layout = new bizMOB.Ui.PageLayout();
			layout.setTitleBar(titlebar);
			layout.setToolbar(toolbar);
			bizMOB.Ui.displayView(layout);
		}
};

//견적상세에서 호출하는 callback 함수
function callback_TFSMES202(json){
	page.search(true);
}