/**
 * 통계 관리
 */


//////////////  개발용(추후 제거)  //////////////
/*bizMOB.Web.post = function(options) {
	var response = "";
	if(options.message.header.trcode == "TFS401"){
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
					statistics_list : [
					                 {
					                	 total_rank : "1", //총 순위
					                	 dealer_nm : "홍길동 딜러", //딜러 명
					                	 user_name : "홍길동", //사용자 이름
					                	 total_count : "100" //총 건수
					                 },
					                 {
					                	 total_rank : "2", //총 순위
					                	 dealer_nm : "홍길동 딜러", //딜러 명
					                	 user_name : "홍길동", //사용자 이름
					                	 total_count : "150" //총 건수
					                 },
					                 {
					                	 total_rank : "3", //총 순위
					                	 dealer_nm : "홍길동 딜러", //딜러 명
					                	 user_name : "홍길동", //사용자 이름
					                	 total_count : "200" //총 건수
					                 },
					                 {
					                	 total_rank : "4", //총 순위
					                	 dealer_nm : "홍길동 딜러", //딜러 명
					                	 user_name : "홍길동", //사용자 이름
					                	 total_count : "250" //총 건수
					                 },
					                 {
					                	 total_rank : "5", //총 순위
					                	 dealer_nm : "홍길동 딜러", //딜러 명
					                	 user_name : "홍길동", //사용자 이름
					                	 total_count : "300" //총 건수
					                 },
					                 {
					                	 total_rank : "6", //총 순위
					                	 dealer_nm : "홍길동 딜러", //딜러 명
					                	 user_name : "홍길동", //사용자 이름
					                	 total_count : "350" //총 건수
					                 },
					                 {
					                	 total_rank : "7", //총 순위
					                	 dealer_nm : "홍길동 딜러", //딜러 명
					                	 user_name : "홍길동", //사용자 이름
					                	 total_count : "400" //총 건수
					                 },
					                 {
					                	 total_rank : "8", //총 순위
					                	 dealer_nm : "홍길동 딜러", //딜러 명
					                	 user_name : "홍길동", //사용자 이름
					                	 total_count : "450" //총 건수
					                 },
					                 {
					                	 total_rank : "9", //총 순위
					                	 dealer_nm : "홍길동 딜러", //딜러 명
					                	 user_name : "홍길동", //사용자 이름
					                	 total_count : "500" //총 건수
					                 },
					                 {
					                	 total_rank : "10", //총 순위
					                	 dealer_nm : "홍길동 딜러", //딜러 명
					                	 user_name : "홍길동", //사용자 이름
					                	 total_count : "550" //총 건수
					                 }
					                 ]
				}
		};
	}else if(options.message.header.trcode == "TFS402"){
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
					statistics_list : [
					                 {
					                	 total_count : 200, //총 건수
					                	 total_rank : 1, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 200, //총 건수
					                	 total_rank : 2, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 200, //총 건수
					                	 total_rank : 3, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 200, //총 건수
					                	 total_rank : 4, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 200, //총 건수
					                	 total_rank : 5, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 200, //총 건수
					                	 total_rank : 6, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 200, //총 건수
					                	 total_rank : 7, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 200, //총 건수
					                	 total_rank : 8, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 200, //총 건수
					                	 total_rank : 9, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 200, //총 건수
					                	 total_rank : 10, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 }
					                 ]
				}
		};
	}else if(options.message.header.trcode == "TFS403"){
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
					statistics_list : [
					                 {
					                	 total_count : 300, //총 건수
					                	 total_rank : 1, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 300, //총 건수
					                	 total_rank : 2, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 300, //총 건수
					                	 total_rank : 3, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 300, //총 건수
					                	 total_rank : 4, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 300, //총 건수
					                	 total_rank : 5, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 300, //총 건수
					                	 total_rank : 6, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 300, //총 건수
					                	 total_rank : 7, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 300, //총 건수
					                	 total_rank : 8, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 300, //총 건수
					                	 total_rank : 9, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
					                 },
					                 {
					                	 total_count : 300, //총 건수
					                	 total_rank : 10, //총 순위
					                	 idnt_info : "견적식별 정보" //견적식별 정보
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
	        var today = new Date();
	        var fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
	        $("#from").datepicker("setDate", fromDate);
			$("#from").attr("selectedDate", fromDate.bMToFormatDate("yyyymmdd"));
			$("#to").datepicker("setDate", today);
			$("#to").attr("selectedDate", today.bMToFormatDate("yyyymmdd"));
			
			page.search();
		},

		initInterface : function()
		{
			//탭
			$(".btn_tab").bind("click", function(){
				$(".btn_tab").removeClass("on");
				$(this).addClass("on");
				
				//순위 초기화
				$("#startRank").text("1");
				$("#endRank").text("10");
				
				page.search();
			});
			
			//검색 버튼
			$("#btn_search").bind("click", function(){
				var fromDate = $("#from").attr("selectedDate");
				var toDate = $("#to").attr("selectedDate");
				
				if(fromDate.bMDateDiff(toDate) > 92){
					alert("3개월 이상 조회할 수 없습니다.");
					return false;
				}
				
				page.search();
			});
			
			//이전순위 버튼
			$("#btn_left").bind("click", function(){
				var start_rank = $("#startRank").text().bMToNumber();
				var end_rank = $("#endRank").text().bMToNumber();
				
				if(start_rank == 1){
					alert("가장 첫번째 순위 입니다.");
					return false;
				}else {
					$("#startRank").text(start_rank-10);
					$("#endRank").text(end_rank-10);
				}
				
				page.search();
			});
			
			//다음순위 버튼
			$("#btn_right").bind("click", function(){
				var start_rank = $("#startRank").text().bMToNumber();
				var end_rank = $("#endRank").text().bMToNumber();

				$("#startRank").text(start_rank+10);
				$("#endRank").text(end_rank+10);
				
				page.search();
			});
			
		},
		
		search : function()
		{
			var type = $(".btn_tab").filter(".on").attr("value");
			var MsgID = "";
			
			if(type == "1"){ //사용자별
				
				MsgID = bizMOB.Util.Resource.getTr("toyota", "TFS401",
				{
					header : { "trcode" : "TFS401" }
				});
			}else if(type == "2"){ //딜러별
				
				MsgID = bizMOB.Util.Resource.getTr("toyota", "TFS402",
				{
					header : { "trcode" : "TFS402" }
				});
			}else if(type == "3"){ //차량별
				
				MsgID = bizMOB.Util.Resource.getTr("toyota", "TFS403",
				{
					header : { "trcode" : "TFS403" }
				});
			}
			
			MsgID.body.brand_code = bizMOB.Properties.get("brandCode"); //브랜드 코드 ( A271:렉서스 , A272:토요타)
			MsgID.body.sch_end_rank = $("#endRank").text(); //종료 순위
			MsgID.body.sch_start_rank = $("#startRank").text(); //시작 순위
			MsgID.body.user_id = bizMOB.Properties.get("userId"); //사용자 아이디
			MsgID.body.sch_end_date = $("#to").attr("selectedDate"); //조회 종료일 (yyyymmdd)
			MsgID.body.sch_start_date = $("#from").attr("selectedDate"); //조회 시작일 (yyyymmdd)
			
			bizMOB.Web.post({
				message : MsgID,
				success : function(json) {
					if(toyotaUtil.checkResponseError(json)) {
						page.renderList(type, json);
					}
				}
			});
		},
		
		renderList : function(type, json){
			
			//그래프
			$(".rankGraph", "#graphContent").attr("style", "height:0%");
			$(".rankGraphNum", "#graphContent").text("");
			var height = 0;
			$(".rankGraph", "#graphContent").attr("style", "height:0%");
			$(json.body.statistics_list).each(function(index){
				height = Math.round((this.total_count.bMToNumber()/1000)*100);
				$(".rankGraph", "#graphContent").eq(index).attr("style", "height:"+height+"%");
				
				if(this.total_count.length == 1){
					$(".rankGraphNum", "#graphContent").eq(index).attr("style", "position:absolute; top:-15px; left:4px;");
				}else if(this.total_count.length == 2){
					$(".rankGraphNum", "#graphContent").eq(index).attr("style", "position:absolute; top:-15px; left:-1px;");
				}else {
					$(".rankGraphNum", "#graphContent").eq(index).attr("style", "position:absolute; top:-15px; left:-5px;");	
				}
				$(".rankGraphNum", "#graphContent").eq(index).text(this.total_count);
			});
			
			//리스트
			var dir = [];
			if(json.body.statistics_list.length == 0){
				$("#list").remove();
				bizMOB.Util.Html.createNoDataTag($("#listTemplate"), "조회된 정보가 없습니다.");
			}else {
				if(type == "1"){ //사용자별
					dir = 
						[
						 { "type" : "loop", "target" : ".record", "value" : "statistics_list",
							 "detail" : 
								 [
								  { "type" : "single", "target" : ".rank", "value" : function(arg){
									  return arg.item.total_rank+"위";
								  }},
								  { "type" : "single", "target" : ".text1", "value" : "user_name" },
								  { "type" : "single", "target" : ".text2", "value" : "dealer_nm" },
								  { "type" : "single", "target" : ".count", "value" : function(arg){
									  return arg.item.total_count+"건";
								  }}
								  ]
						 }
						 ];
				}else if(type == "2"){ //딜러별
					dir = 
						[
						 { "type" : "loop", "target" : ".record", "value" : "statistics_list",
							 "detail" : 
								 [
								  { "type" : "single", "target" : ".rank", "value" : function(arg){
									  return arg.item.total_rank+"위";
								  }},
								  { "type" : "single", "target" : ".text1", "value" : "dealer_nm" },
								  { "type" : "single", "target" : ".count", "value" : function(arg){
									  return arg.item.total_count+"건";
								  }}
								  ]
						 }
						 ];
				}else if(type == "3"){ //차량별
					dir = 
						[
						 { "type" : "loop", "target" : ".record", "value" : "statistics_list",
							 "detail" : 
								 [
								  { "type" : "single", "target" : ".rank", "value" : function(arg){
									  return arg.item.total_rank+"위";
								  }},
								  { "type" : "single", "target" : ".text1", "value" : "mdel_name" },
								  { "type" : "single", "target" : ".count", "value" : function(arg){
									  return arg.item.total_count+"건";
								  }}
								  ]
						 }
						 ];
				}
				bizMOB.Util.Html.removeNoDataTag();
				$("#listTemplate").bMRender(json.body, dir, { clone : true, newId : "list", replace : true });
			}
		},
		
		initLayout : function()
		{
			//타이틀바
			var titlebar = toyotaResource.getCommonTitleBar("통계 관리");
			
			//툴바
			var toolbar = toyotaResource.getCommonToolBar();
			
			//화면 레이아웃
			var layout = new bizMOB.Ui.PageLayout();
			layout.setTitleBar(titlebar);
			layout.setToolbar(toolbar);
			bizMOB.Ui.displayView(layout);
		}
};
