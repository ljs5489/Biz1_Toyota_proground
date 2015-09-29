$(function() {
	//메뉴 버튼 누르면 토글
	$("#btn_menu").click(function() {
		$(".menu_pop").toggle();
	});

	// 포함/미포함 왔다갔다 기능
	$(".btn_on_off").click(function() {
		if ($(this).hasClass("tbtn_off")) {
			$(this).removeClass("tbtn_off");
		} else {
			$(this).addClass("tbtn_off");
		}
	});
});

function getDatas(){
	var commonData={
		slt_carModel:$("#slt_carModel").val(),
		carAmt:$("#carAmt").html(),
		regtax_amt:$("#regtax_amt").html(),
		acqtax_amt:$("#acqtax_amt").html(),
		pubbond_amt:$("#pubbond_amt").html(),
		inp_extraChrgAmt:$("#inp_extraChrgAmt").val(),
		total:0,
	};		
	var O_data={};
	var F_data={};
	var L_data={};
	
	
	commonData.total=(
			getNumber(commonData.slt_carModel)
			+getNumber(commonData.carAmt)
			+getNumber(commonData.regtax_amt)
			+getNumber(commonData.acqtax_amt)
			+getNumber(commonData.pubbond_amt)
			+getNumber(commonData.inp_extraChrgAmt)
	);
	$(".mdelName").html(commonData.slt_carModel);  //차종
	$(".carAmt").html(commonData.carAmt);          //차량가
	$(".regtaxAmt").html(commonData.regtax_amt);   //등록세
	$(".acqtaxAmt").html(commonData.acqtax_amt);   //취득세
	$(".pubbondAmt").html(commonData.pubbond_amt); //공채할인
	$(".extraChrgAmt").html(commonData.inp_extraChrgAmt+"원"); //부대비용
	$(".totalAmt").html(commonData.total+"원"); //부대비용
}


