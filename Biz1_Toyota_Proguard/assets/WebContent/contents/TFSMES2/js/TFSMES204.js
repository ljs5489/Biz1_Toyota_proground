/*var json = {
	"header" : "",
	"body" : 
	{
		"list" : 
			[{
				"name" : "홍길동",
				"email" : "gdhong@naver.com"},
			{
				"name" : "전지현",
				"email" : "jhjun@naver.com"},
			{
				"name" : "김태희",
				"email" : "thkim@hanmail.net"},
			{
				"name" : "이나영",
				"email" : "nylee@nate.com"},
			{
				"name" : "수지",
				"email" : "suzy@naver.com"}
			]
	}
};*/

var page = {
	init : function(json){
		page.initInterface();
		page.initData(json);
		page.initLayout();
	},
	
	initInterface : function(){
		$("#ok").click(function(){
			page.closeDialog();
		});
		
		$("#delete").click(function(){
			if($("input[type=radio]:checked").length>0){
				page.postTFS207();
			}
		});
		
		$("#close").click(function(){
			bizMOB.Ui.closeDialog();
		});
	},
	
	initData : function(json){
		var name = json.name;
		//TFS206 (이메일, 이름)
		
		page.postTFS206(name);
	},
	
	initLayout : function(){
		
	},
	
	postTFS206 : function(name){
		var TFS206 = bizMOB.Util.Resource.getTr("toyota", "TFS206");
		
		TFS206.body.user_id = bizMOB.Properties.get("userId");
		TFS206.body.customer_name = name;
		//bizMOB.Ui.alert(TFS206.body.user_id +", "+TFS206.body.customer_name);
		
		bizMOB.Web.post({
			message : TFS206,
			success : function(json) {
				//bizMOB.Ui.alert(JSON.stringify(json.body));
				//data가 없으면 inner_con 속성 중 border 0px로
				if(json.body.user_mail_list.length > 0){
					$(".temp_inner_con").addClass("inner_con");
					//렌더링
					page.renderingList(json.body);
				}
			}
		});
	},
	
	postTFS207 : function(){
		var TFS207 = bizMOB.Util.Resource.getTr("toyota", "TFS207");
		TFS207.body.user_id = bizMOB.Properties.get("userId");
		TFS207.body.cust_name = $("input[type=radio]:checked").parents("tr").find("td").children(".name").text();
		TFS207.body.cust_email = $("input[type=radio]:checked").parents("tr").find("td").children(".email").text();
		
		bizMOB.Web.post({
			message : TFS207,
			success : function(json) {
				//bizMOB.Ui.alert(JSON.stringify(json));
				//객체삭제
				if(json.body.result){
					page.deleteEmail();					
				}
			}
		});		
	},
	
	renderingList : function(list){
		// 데이터를 화면에 어떻게 적용할지 설정
		var dir = [ 
		  { "type" : "loop",	"target" : ".item",	"value" : "user_mail_list",
			"detail" :
			[
			    { type : "single", target : ".name", value : "user_name" },	//tr의 속성
			    { type : "single", target : ".email", value : "user_email" }
			]
		  }];
		$("#temp").bMRender(list, dir, { clone : true, newId : "mailList", replace : true });
		
		$(".item").click(function(){
			$(this).find("th").find("input[type=radio]").prop("checked",true);
		});
	},
	
	closeDialog : function(){
		var name = $("input[type=radio]:checked").parents("tr").find("td").children(".name").text();
		var email = $("input[type=radio]:checked").parents("tr").find("td").children(".email").text();
		
		if(name=="" || email==""){
			bizMOB.Ui.closeDialog();
		}
		else{
			var msg = {
					"name" : name,
					"email" : email
				};		
			var option = {
				message : msg,
				callback : "page.callbackTFSMES204"
			};
			bizMOB.Ui.closeDialog(option);			
		}
	},
	
	deleteEmail : function(){
		var target = $("input[type=radio]:checked").parents("tr");
		target.remove();
		if($("#mailList").find("tr").length==0){
			$(".temp_inner_con").removeClass("inner_con");
		}
	}
};