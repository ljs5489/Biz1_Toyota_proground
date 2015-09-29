/**
 * toyotaUtil
 */


(function($, undefined)
{
	/**
	 * ToyotaUtil 클래스
	 * @class ToyotaUtil Class
	 * @name ToyotaUtil
	 */
	function ToyotaUtil(){};
	
	
	
	/**
	 * 서버의 응답(json 형식)에 대한 오류검사
	 * @memberOf ToyotaUtil#
	 * @param tr 서버의 응답(json 형식)
	 * @returns {Boolean} 오류가 아닌지 여부
	 */
	ToyotaUtil.prototype.checkResponseError = function(tr, noMsg)
	{
		if(!tr) 
		{
			if(noMsg == undefined || noMsg == false)
				bizMOB.Ui.alert("알림", "알 수 없는 오류입니다.");
			console.log("(warning)Util.checkTrError - tr is empty");
			return false;
		}
		if(!(tr.header))
		{
			if(noMsg == undefined || noMsg == false)
				bizMOB.Ui.alert("알림", "알 수 없는 오류입니다.");
			console.log("(warning)Util.checkTrError - tr header is empty");
			return false;
		}
		if(!(tr.header.result))
		{
			if(tr.header.error_code=="NE0001" || tr.header.error_code=="NE0002" || tr.header.error_code=="NE0003" ||
				tr.header.error_code=="ERR999" || tr.header.error_code=="HE0503"){
				if(noMsg == undefined || noMsg == false)
					bizMOB.Ui.alert("알림", "통신 상태가 좋지 않습니다. 다시 시도해 주십시오.("+tr.header.error_code+")");
				console.log("(warning)Util.checkTrError - tr.header.result is false");
				return false;
			} else {
				if(tr.header.error_code.substr(0,6)=="ERR000"){
					if(noMsg == undefined || noMsg == false)
						bizMOB.Ui.alert("알림", "장시간 미사용으로 연결이 종료되었습니다. 프로그램 종료 후 다시 실행해 주십시오.("+tr.header.error_code+")");
					console.log("(warning)Util.checkTrError - tr.header.result is false");
					return false;
				}else if(tr.header.error_code=="CE0001"){
					if(noMsg == undefined || noMsg == false)
						bizMOB.Ui.alert("알림", "요청 처리를 실패했습니다. 다시 시도해 주십시오.("+tr.header.error_code+")");
					console.log("(warning)Util.checkTrError - tr.header.result is false");
					return false;
				}else{
					if(noMsg == undefined || noMsg == false)
						bizMOB.Ui.alert("알림", tr.header.error_text+"("+tr.header.error_code+")");
					console.log("(warning)Util.checkTrError - tr.header.result is false");
					return false;
				}
			}
		}
		if(!(tr.body))
		{
			if(noMsg == undefined || noMsg == false)
				bizMOB.Ui.alert("알림", "알 수 없는 오류입니다.");
			console.log("(warning)Util.checkTrError - tr body is empty");
			return false;
		}
		else return true;
	};
	
	/**
	 * internal browser callback 함수
	 * @memberOf ToyotaUtil#
	 * @param json object
	 */
	ToyotaUtil.prototype.callbackInternalBrowser = function(json)
	{
		if(json.pageUrl != ""){
			bizMOB.Web.open(json.pageUrl);
		}
	};
	
	/**
	 * String 암호화
	 * @memberOf ToyotaUtil#
	 * @param str 암호화 할 string
	 * 		  key 암호화 키
	 * @returns {String} 암호화한 str
	 */
	ToyotaUtil.prototype.encrypt = function(str, key)
	{
		var output = new String;
		var TextSize = str.length;
		
		for(var i=0; i<TextSize; i++){
			output += String.fromCharCode(str.charCodeAt(i) + parseInt(key)+123+i);
		}

		return output;
	};
	
	/**
	 * String 복호화
	 * @memberOf ToyotaUtil#
	 * @param str 복호화 할 string
	 * 		  key 복호화 키
	 * @returns {String} 복호화한 str
	 */
	ToyotaUtil.prototype.decrypt = function(str, key)
	{
		var output = new String;
		var TextSize = str.length;
		
		for(var i=0; i<TextSize; i++ ){
			output += String.fromCharCode(str.charCodeAt(i) - (parseInt(key)+123+i));
		}
		
		return output;
	};
	
	/**
	 * 견적생성 internal browser open
	 * @memberOf ToyotaUtil#
	 * @param
	 * @returns
	 */
	ToyotaUtil.prototype.openInternalBrowser = function()
	{
		var TFS110 = bizMOB.Util.Resource.getTr("toyota", "TFS110",
		{
			header : { "trcode" : "TFS110" }
		});
		
		bizMOB.Web.post({
			message : TFS110,
			success : function(json) {
				if(toyotaUtil.checkResponseError(json)) {
					
					if(json.body.use_yn == "N"){
						alert("현재 새로운 프로모션 및 상품 업데이트 중이오니 잠시 기다려 주시기 바랍니다.");
						return;
					}else {
						var brandCode = bizMOB.Properties.get("brandCode")=="A272" ? "T" : "L";
						var isManager = bizMOB.Properties.get("userKubun")=="M" ? "Y" : "N";

						//운영용
						var url = "http://tfskr.com/bizmob/m/index?params={%22user_id%22:%22"+bizMOB.Properties.get("userId")+"%22,%22brand_cd%22:%22"+brandCode+"%22,%22dealer_id%22:%22"+bizMOB.Properties.get("dealerId")+"%22,%22is_SC%22:%22N%22,%22is_Manager%22:%22"+isManager+"%22}";
						//테스트용
						//var url = "http://10.1.209.134:8080/bizmob/m/index?params={%22user_id%22:%22"+bizMOB.Properties.get("userId")+"%22,%22brand_cd%22:%22"+brandCode+"%22,%22dealer_id%22:%22"+bizMOB.Properties.get("dealerId")+"%22,%22is_SC%22:%22N%22,%22is_Manager%22:%22"+isManager+"%22}";
						//var url = "http://218.55.79.230:8070/bizmob/m/index?params={%22user_id%22:%22"+bizMOB.Properties.get("userId")+"%22,%22brand_cd%22:%22"+brandCode+"%22,%22dealer_id%22:%22"+bizMOB.Properties.get("dealerId")+"%22,%22is_SC%22:%22N%22,%22is_Manager%22:%22"+isManager+"%22}";
						
						toyotaBizMOB.Native.openBrowser({
							target_page : url,
							title : ""
						}, function(json){
						});
					}
				}
			}
		});
	};
	
	/**
	 * 스키마 버전 및 정의
	 * @memberOf ToyotaUtil#
	 * *******스키마 변경될때마다 +0.1하여 하드코딩 필요
	 * *******table이 추가되면, ToyotaUtil의 deleteTable 함수에도 추가해줘야 함
	 */
	ToyotaUtil.prototype.schemaVersion = 1.0;
	ToyotaUtil.prototype.schemas = 
	{
		"TOYOTA" : 
		[
			/*"CREATE TABLE IF NOT EXISTS FAVORITE_STORE_TBL (" +
				"STORE_ID 			TEXT" +			//매장ID
				",STORE_TEL 		TEXT" +			//매장전화번호
			");"*/
		]
	};
	
	/**
	 * local DB 생성 및 연결
	 * @memberOf ToyotaUtil#
	 */
	ToyotaUtil.prototype.initDatabase = function()
	{
		var toyotaUtil = this;
		
		//DB 생성 및 연결
		var db = bizMOB.SQLite.openDatabase("TOYOTA");
		var schemaVersion = bizMOB.Properties.get("schemaVersion");
		
		if(!schemaVersion){
			//createTable
			toyotaUtil.createTable("TOYOTA", db, function(){
				if(bizMOB.detectAndroid()) db.close();
				bizMOB.Properties.set("schemaVersion", toyotaUtil.schemaVersion);
			});
		}else if(schemaVersion == toyotaUtil.schemaVersion){
			//deleteTable
			//toyotaUtil.deleteTable(db);
		}else if(schemaVersion < toyotaUtil.schemaVersion) {
			//dropTable, createTable
			toyotaUtil.resetDatabase("TOYOTA", db, function(){
				if(bizMOB.detectAndroid()) db.close();
				bizMOB.Properties.set("schemaVersion", toyotaUtil.schemaVersion);
			});
		}
	};
	
	/**
	 * create table
	 * @memberOf ToyotaUtil#
	 * @param dbName DB명(string)
	 * @param db DB
	 * @param callback callback함수
	 */
	ToyotaUtil.prototype.createTable = function(dbName, db, callback)
	{
		var schemaList = this.schemas[dbName];
		if(schemaList) {
			db.transaction(function(tx) {
				$(schemaList).each(function(index){
					tx.executeSql(schemaList[index], {},
							function(tx) {},
							function(error) { console.log("create table(or index) failed"); }
					);
				});
			}, function(error){
				bizMOB.Ui.alert("알림", "local db 초기화 실패");
			}, function(){
				callback();
			});
		} else {
			callback();
		}
		
	};
	
	/**
	 * local DB reset
	 * @memberOf ToyotaUtil#
	 * @param dbName DB명(string)
	 * @param db DB
	 * @param callback callback함수
	 */
	ToyotaUtil.prototype.resetDatabase = function(dbName, db, callback)
	{
		
		var toyotaUtil = this;
		
		var sql = "SELECT type, name, tbl_name" +
			" FROM SQLITE_MASTER" +
			" WHERE SQL IS NOT NULL " +
			" and tbl_name!='__WebKitDatabaseInfoTable__' and tbl_name!='android_metadata' " +
			" order by type asc";
		db.transaction(function(tx) {
			tx.executeSql(sql, {}, function(tx, rs){
				
				//table이 없는 경우 생성
				if(rs.rows.length==0) {
					toyotaUtil.createTable(dbName, db, callback);
				//table이 있는 경우 drop 후 생성	
				}else {
					
					$(rs.rows).each(function(index){
						var row = rs.rows.item(index);
						tx.executeSql("DROP " + row.type + " " + row.name, [], function(tx) {
						}, function(error) {
							console.log("drop table failed : " + tableName);
						});
					});
				}
			}, function(error) {});
		}, function(error) {
			bizMOB.Ui.alert("알림", "테이블 생성에 실패하였습니다. 프로그램 종료 후 다시 로그인해주십시오.");
			console.error("[" + error.code + "] " + error.message);
			return false;
		}, function(success){
			toyotaUtil.createTable(dbName, db, callback);
		});
		
	};
	
	/**
	 * delete table
	 * @memberOf ToyotaUtil#
	 * @param db DB
	 * @param callback callback함수
	 */
	ToyotaUtil.prototype.deleteTable = function(db)
	{
		db.transaction(function(tx) {
			tx.executeSql("DELETE FROM FAVORITE_STORE_TBL", []);
			tx.executeSql("DELETE FROM STORE_TBL", []);
		}, function(error) {
			if(bizMOB.detectAndroid()) db.close();
			bizMOB.Ui.alert("알림", error);
			console.error("[" + error.code + "] " + error.message);
			return false;
		}, function(success) {
			if(bizMOB.detectAndroid()) db.close();
		});
	};
	
	/**
	 * ToyotaUtil Class 인스턴스
	 * @static
	 * @name toyotaUtil
	 * @see ToyotaUtil
	 */
	window.toyotaUtil = new ToyotaUtil();
})(jQuery, undefined);