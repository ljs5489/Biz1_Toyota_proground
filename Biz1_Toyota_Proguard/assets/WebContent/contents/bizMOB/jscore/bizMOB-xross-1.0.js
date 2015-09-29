
/**
 * bizMOB client xross interface 
 * 
 * @class	bizMOB xross 인터페이스
 * @version 0.9
 * 
 * @author	hhlee@mcnc.co.kr
 */
var bizMOB = {};
/**
 * biZMOB Web class
 * 
 * @class	웹 인터페이스
 */
bizMOB.Web = function() {};
/**
 * biZMOB Native class
 * 
 * @class	웹 인터페이스
 */
bizMOB.Native = function() {};
/**
 * biZMOB Ui class
 * 
 * @class	Native Ui 인터페이스
 */
bizMOB.Ui = function() {};
/**
 * biZMOB Phone class
 * 
 * @class	전화 연동 인터페이스
 */
bizMOB.Phone = function() {};
/**
 * biZMOB Map class
 * 
 * @class	지도 연동 인터페이스
 */
bizMOB.Map = function() {};
/**
 * biZMOB Contacts class
 * 
 * @class	주소록 연동 인터페이스
 */
bizMOB.Contacts = function() {};
/**
 * biZMOB Network class
 * 
 * @class	통신(binary) 인터페이스
 */
bizMOB.Network = function() {};
/**
 * bizMOB Properties class
 * 
 * @class	설정 관리 인터페이스
 */
bizMOB.Properties = function() {};
/**
 * bizMOB Storage class
 * 
 * @class	로컬 저장소 인터페이스
 */
bizMOB.Storage = function() {};
bizMOB.WebStorage = function() {};

/**
 * bizMOB SQLite class <br/>
 * HTML5의 표준 API 적용
 * 
 * @class	로컬 데이터페이스 인터페이스
 */
bizMOB.SQLite = function() {};


/**
 * bizMOB File class <br/>
 *  * 
 * @class	디바이스 파일 시스템 인터페이스
 */
bizMOB.File = function() {};

/**
 * bizMOB Camera class <br/>
 * 
 * @class	디바이스의 카메라 인터페이스
 */
bizMOB.Camera = function() {};

/**
 * bizMOB Gallery <br/>
 * 
 * @class	디바이스의 사진 앨범 인터페이스
 */
bizMOB.Gallery = function() {};

/**
 * bizMOB Device
 * 
 * @class	디바이스의 기능 사용 인터페이스
 * 
 */
bizMOB.Device = function() {};

/**
 * bizMOB Security
 * 
 * @class bizMOB platform 보안 인터페이스
 */
bizMOB.Security = function() {};

/**
 * bizMOB Gps
 * 
 * @class bizMOB Gps 인터페이스
 */
bizMOB.Gps = function() {};

bizMOB.FStorage = {};
bizMOB.MStorage = {};

/* 전역변수 선언 */
bizMOB.cmdWatcher = false;
bizMOB.cmdPosition = 0;
bizMOB.callbackId = 0;
bizMOB.buttonId = 0;
bizMOB.callbacks = {};

(function() {
	
	var USER_AGENT = navigator.userAgent.toLowerCase();
	var ENGINE_WEBKIT = "webkit";
	
	
	bizMOB.replacer = function(key, value) {
	    if (typeof value === 'number' && !isFinite(	value)) {
	        return String(value);
	    }
	    return value;
	};
	
	bizMOB.pathParser = function(path) {
		var splitPathType = {};
		var regExp = new RegExp("\{(.*?)\}\/(.*)","g");
		var result = regExp.exec(path);
		if(result)
		{
			splitPathType.type = result[1] ? result[1] : "absolute";
			splitPathType.path = result[2];
		}
		else 
		{
			splitPathType.type = "absolute"; 
			splitPathType.path = path; 
		}
		return splitPathType;
	};
	
	bizMOB.sendCommnad = function() {
		
		if(bizMOB.cmdQueue.length > bizMOB.cmdPosition){
			console.log((bizMOB.cmdPosition+1)+"th COMMAND Request!! ");
			document.location.href=bizMOB.cmdQueue[bizMOB.cmdPosition];
			bizMOB.cmdQueue[bizMOB.cmdPosition] = null;
			bizMOB.cmdPosition++;
		}else{
			console.log("COMMAND Stopped!!" );
			bizMOB.cmdWatcher = false;
			clearInterval(ThreadCmd);
		}
	};
	
	bizMOB.onFireMessage = function(message) {
		
		if( ! bizMOB.cmdQueue ){bizMOB.cmdQueue = new Array();}
		console.log((bizMOB.cmdPosition+1)+"th COMMAND Reserved!! ---  ID : " +message.id+ "   Msg : "+JSON.stringify(message.param));
		message = JSON.stringify(message, bizMOB.replacer);
		
		
		var url = 'mcnc://' + encodeURIComponent(message);
		bizMOB.cmdQueue.push(url);
		
		if( !bizMOB.cmdWatcher ){
			console.log((bizMOB.cmdPosition+1)+"th COMMAND Request!! ");
			document.location.href=bizMOB.cmdQueue[bizMOB.cmdPosition];
			bizMOB.cmdPosition++;
			bizMOB.cmdWatcher = true;
			ThreadCmd = setInterval("bizMOB.sendCommnad()", 200);
		}
		
		
	};
	
	
	
	
	
	/**
	 * *** deprecated. detectiOS로 대체함 ***
	 */
	bizMOB.detectiPhone = function() {
		
		var DEVICE_IPHONE = "iphone";
		var DEVICE_IPAD = "ipad";
		
		if (USER_AGENT.search(ENGINE_WEBKIT) > -1 
				&&( USER_AGENT.search(DEVICE_IPHONE) > -1
				|| USER_AGENT.search(DEVICE_IPAD) > -1)) return true;
		else return false;
	};
	bizMOB.detectIOS = function() {
		
		var isOS = bizMOB.Device.Info.os_type.indexOf("iPhone") >-1 ?true:false;
		
		return isOS;
	};
	
	bizMOB.detectAndroid = function() {
		
		var isAndroid = bizMOB.Device.Info.os_type == "Android"?true:false;
		
		return isAndroid;
		
	};
	
	var DEVICE_PHONE_IOS = "iphone";
	var DEVICE_PHONE_ANDROID = "android 2.";
	
	bizMOB.detectPhone = function()
	{
		var isPhone = bizMOB.Device.Info.device_type == "Phone"?true:false;
		
		return isPhone; 
	};
	bizMOB.detectTablet = function()
	{
		var isTablet = bizMOB.Device.Info.device_type == "Tablet"?true:false;
		
		return isTablet; 
	};
	
	/* ********** Web ************************************** */
	bizMOB.Native.prototype = new Object();
	
	bizMOB.Native.exit = function(param){
		if(!param) param = {kill_type : "exit"};
		var v = {
				"call_type": "js2app",
				"id": "APPLICATION_EXIT",
				"param": param
			};
			bizMOB.onFireMessage(v);
			return;
	};
	
	bizMOB.Native.SignPad = new Object();
	
	bizMOB.Native.SignPad.open = function(callback) {
		var v = {
				call_type:"js2app",
				id:"GOTO_SIGNATURE",
				param:{
					file_path:"sign/2011.bmp",
					is_external:true,
					callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
				}
		};
		
		bizMOB.callbacks[bizMOB.callbackId++] = {success:callback};
		bizMOB.onFireMessage(v);
	};
	
	bizMOB.Native.ImageViewer = new Object();
		
	bizMOB.Native.ImageViewer.open = function(image_path, options) {
		
		var splitSourcePath = bizMOB.pathParser(image_path);
		
		var v = {
				call_type:"js2app",
				id:"SHOW_IMAGE_VIEW",
				param:{}
		};
		
		var p = $.extend(true, { 
			"source_path" : splitSourcePath.path,
			"source_path_type" : splitSourcePath.type,
			"orientation" : "auto"
		}, options);
		
		p.callback = "bizMOB.callbacks["+bizMOB.callbackId+"].success"
		v.param = p; 
				
		bizMOB.callbacks[bizMOB.callbackId++] = {success:options.callback};
		bizMOB.onFireMessage(v);
	};
	
	bizMOB.Native.Browser = new Object();
	bizMOB.Native.Browser.open = function(url) {
		var v = {
			call_type:"js2app",
			id:"SHOW_WEBSITE",
			param:{ "url":url }
		};
		
		bizMOB.onFireMessage(v);
	};
	
	/**
	 * QR, BAR CODE 확인
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Native
	 * 
	 * @param {function}	listener		QR,BAR CODE 확인한 결과를 처리하는 함수 
	 * 										파라미터 예) {"message":"결과확인"}
	 */
	
	bizMOB.Native.qrAndBarCode = new Object();
	bizMOB.Native.qrAndBarCode.open = function(callback) {
		var v = {
			call_type:"js2app",
			id:"QR_AND_BAR_CODE",
			param:{
				callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
			}
		};
		
		bizMOB.callbacks[bizMOB.callbackId++] = {success:callback};
		bizMOB.onFireMessage(v);
	};
	
	/* ********** Web ************************************** */
	bizMOB.Web.prototype = new Object();
	
	bizMOB.Web.setDefault = function(param){
		
	};
	
	bizMOB.Web.responseFilterOut = function (url){
		
		
	};
	
	bizMOB.Web.replaceChar = function (url){
		
//		var lastReplaceChar, lastReplaceSpecChar;
//		var result =  url.replace(regExp, function($1, $2)
//		{
//			lastReplaceChar = $1;
//			lastReplaceSpecChar = specChars[$2];
//			return lastReplaceSpecChar;  
//		}
//		if(url === lastReplaceChar) return lastReplaceSpecChar;
//		return result;
	};

	bizMOB.Web.replaceFilterChars = function(param)
	{
		var result;
		if(param)
		{
			switch(param.constructor)
			{
				case Object :
					result = {};
					for(key in param)
					{
						result[key] = replaceFilterChars(param[key]);
					}
					break;
				case Array :
					result = [];
					for(var i=0;i<param.length;i++)
					{
						result[i] = replaceFilterChars(param[i]);
					}
					break;
				case String :
					result = replaceChar(param);
					break;
				default :
					result = param;
					break;
			}
		}
		return result;
	};
	
	/**
	 * 새로운 웹 페이지를 연다.
	 * 
	 * @function
	 * @memberOf 	bizMOB.Web
	 * @param  {String}  html_page			web html file ex)"main/html/main.html"
	 * @param  {Object}  options			{ <br>
	 * 											modal: {boolean} 새롭게 여는 페이지가 Modal 여부,<br> 
	 * 											replace: {boolean} 현재페이지를 새로운 웹페이지로 교체 여부, <br> 
	 * 											message: {Object} 이전 페이지에서 새로운 페이지에 전달할 데이터 <br>
	 * 											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-> page.init 함수의 파라미터로 전달 <br>
	 * 											orientation:{String} 가로 또는 세로 고정 설정(가로고정:land, 세로고정:portrait)
	 * 										}
	 * @static
	 */
	bizMOB.Web.open = function(html, options) {
		var v = {
			call_type:"js2web",
			id:"",
			param:{}
		};
		
				
		var p = $.extend(true, {
			modal:false,
			trcode:'',
			replace:false,
			message:{},
			callback:'appcallOnLoad',
			orientation:'none',
			method : "get",
			target_page_param : {}
		}, options);
		
		if(!bizMOB.Emulator)p.modal = false;
		p.target_page = html;
		
		if(p.replace) {
			// replace web - target_page, trcode, message, callback
			v.id="REPLACE_WEB",
			v.param = p;
			bizMOB.onFireMessage(v);
			return;
		}
		
		if( p.modal ) {
			if(p.trcode == '') {
				// show web modal - target_page, message, callback
				v.id="SHOW_WEB_MODAL",
				v.param = p;
				bizMOB.onFireMessage(v);return;
			} else {
				// goto web modal - target_page, trcode, message, callback
				v.id="GOTO_WEB_MODAL",
				v.param = p;
				bizMOB.onFireMessage(v);return;
			}
		} else {
			if(p.trcode == '') {
				// show web - target_page, message, callback
				v.id="SHOW_WEB",
				v.param = p;
				bizMOB.onFireMessage(v);return;
			} else {
				// goto web - target_page, trcode, message, callback
				v.id="GOTO_WEB",
				v.param = p;
				bizMOB.onFireMessage(v);return;
			}
		}
	};
	
	/**
	 * 현재 열린 웹 페이지를 닫는다.
	 * 
	 * @function
	 * @memberOf	bizMOB.Web
	 * @param  {Object} options 			{<br>
	 * 											modal: {boolean} 닫을 웹페이지가 modal인지 여부, <br>
	 * 											callback: {String} 현재 페이지를 닫고 이전페이지로 이동하여 호출할 함수명,<br>
	 * 											message: {Object}	현재 페이지에서  이전페이지에 전달할 데이터 <br>
	 * 										}
	 * @static 
	 */
	bizMOB.Web.close = function(options) {
		var v = {
			call_type:"js2web",
			id:"",
			param:{}
		};
		
		var p = $.extend(true, {
			modal:true,
			message:{},
			callback:'appcallOnCloseWeb'					
		}, options);
		if(!bizMOB.Emulator)p.modal = false;
		if(p.modal) {
			// dismiss web modal
			v.id = "DISMISS_WEB_MODAL";
		} else {
			// pop view
			v.id = "POP_VIEW";
		}
		
		v.param = p;
		
		bizMOB.onFireMessage(v);
	};
	
	/**
	 * 서버에 데이터 전송(post방식)
	 * 
	 * @function
	 * @static
	 * @memberOf bizMOB.Web
	 * @param  {Object}  options		{<br>
	 * 										message: {object} 	bizMOB 서버에 전달할 전문 객체,<br>
	 * 										success: {function}		응답 처리 메소드<br>
	 * 									}	
	 * @static
	 */
	bizMOB.Web.post = function(options) {
		var v = {
			call_type:"js2web",
			id:"RELOAD_WEB",
			param:{}
		};
		
		var p = $.extend(true, {
			trcode:'',
			message:{},
			callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
		}, options);
		
		p.trcode = options.message.header.trcode;
		
		v.param = p;
		
		bizMOB.callbacks[bizMOB.callbackId++] = {success:options.success};
		bizMOB.onFireMessage(v);
	};
	
	/* ******************* Gps ***************************** */
	bizMOB.Gps.prototype = new Object();
	
	bizMOB.Gps.configuration = function(callback)
	{
		var v = {
				call_type:"js2app",
				id:"SETTINGS_ACTION",
				param:{
					action : "LOCATION_SOURCE_SETTINGS"
				}
		};
		if(callback) 
		{
			v.param.callback = 'bizMOB.callbacks['+bizMOB.callbackId+'].success';
			bizMOB.callbacks[bizMOB.callbackId++] = {success:callback};
		}
		bizMOB.onFireMessage(v);
	};
	
	
	bizMOB.Gps.get = function(callback)
	{
        var v = {
                call_type:"js2app",
                id:"GET_LOCATION",
                param:{
                	callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
                }
        };
        
        bizMOB.callbacks[bizMOB.callbackId++] = {success:callback};
        bizMOB.onFireMessage(v);
        /*
        callback({
                    "result" : true,
                    "provider" : "network",
                    lng: 127.015523,
                    lat : 37.537123
        });
        */
	};
	/* ********** Phone ************************************** */
	bizMOB.Phone.prototype = new Object();
	/**
	 * 전화 걸기
	 * @function
	 * @memberOf bizMOB.Phone
	 * @param {String}	number				통화할 상대방 전화번호 
	 * @static
	 */
	bizMOB.Phone.tel = function(number) {
		
		number = number.replace(/[^0-9]/gi,"");
		
		var v = {
			call_type:"js2app",
			id:"TEL",
			param:{number:number}
		};
		
		bizMOB.onFireMessage(v);
	};
	
	/**
	 * 문자(sms) 보내기
	 * @function
	 * @static
	 * @memberOf bizMOB.Phone
	 * @param {String}	number				문자(sms)를 보낼 상대방 전화번호
	 * @param {String}	message				문자(sms) 내용
	 */
	bizMOB.Phone.sms = function(number, message) {
		
		number = number.replace(/[^0-9]/gi,"");
		
		var v = {
			call_type:"js2app",
			id:"SMS",
			param:{number:number, message:message}
		};
		
		bizMOB.onFireMessage(v);
	};
	
	/* ********** Ui ************************************** */
	bizMOB.Ui.prototype = new Object();
	
	/**
	 *  경고/확인 창 띄우기
	 *  
	 *  @function
	 *  @static
	 *  @memberOf	bizMOB.Ui
	 *  @param {String} title 				타이틀
	 *  @param {String} msg					alert 메시지 	
	 */
	bizMOB.Ui.alert = function(title, msg, btn) {
		
		if(arguments.length == 1){
			msg = title;
			title = "";
		}
		if(!btn) btn = {text:"확인",callback:""};
		var v = {
			call_type:"js2app",
			id:"POPUP_MESSAGE_BOX",
			param:{
				title:title, 
				message:msg,
				buttons:[btn]
			}
		};
	
		bizMOB.onFireMessage(v);
	};
	
	/**
	 * 확민/취소 confirm 메시지 창 띄우기
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Ui
	 * @param {String}	title					타이틀
	 * @param {String}	msg						메시지
	 * @param {bizMOB.Ui.Button}	button1		버튼  (확인)
	 * @param {bizMOB.Ui.Button}	button2		버튼	 (취소)
	 */
	bizMOB.Ui.confirm = function(title, msg, button1, button2) {
		var b = new Array();
		b.push(button1);
		if( button2 ) b.push(button2);
		var v = {
			call_type:"js2app",
			id:"POPUP_MESSAGE_BOX",
			param:{
				title:title, 
				message:msg,
				buttons:b
			}
		};
	
		bizMOB.onFireMessage(v);
	};
	/**
	 * 알림 메시지 창 띄우기
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Ui
	 * @param {String}	msg						메시지
	 */
	bizMOB.Ui.toast = function(msg, duration) {
		var show_length = "long";
		if (duration) show_length = duration;
		var v = {
			call_type:"js2app",
			id:"SHOW_MESSAGE",
			param:{
				message:msg,
				duration : show_length
			}
		};
		bizMOB.onFireMessage(v);
	};
	/**
	 * Native App Button - 메시지 창
	 * @class	Native App Button
	 * @memberOf bizMOB.Ui
	 */
	bizMOB.Ui.TextButton = function(text, listener) {
		this.text = text;
		this.callback = 'bizMOB.callbacks['+bizMOB.callbackId+'].success';
		bizMOB.callbacks[bizMOB.callbackId++] = {success:listener};
	};
	
	/**
	 * Native App Button - 상단,하단 메뉴 버튼
	 * 
	 * @class	Native App Button	
	 * @memberOf bizMOB.Ui
	 */
	bizMOB.Ui.Button = function(options) {
		var p = $.extend(true,{
			control_id:"MHBarButton",
			item_id:0,
			button_text:"",
			image_name:"",
			action_type:"jscall",
			action:""
		},options);
		
		this.control_id = p.control_id;
		this.item_id = bizMOB.buttonId++;
		this.button_text = p.button_text;
		this.image_name = p.image_name;
		this.action_type = p.action_type;
		this.action = p.action;
	};
	
	/**
	 *  버튼 생성 (Native Button) - message box 버튼
	 *  
	 *  @function
	 *  @static
	 *  @memberOf	bizMOB.Ui
	 *  @param {String}	text					버튼텍스트
	 *  @param {function}	listener			event listener function
	 *  @returns {bizMOB.Ui.TextButton}				생성된 message box 버튼
	 */
	bizMOB.Ui.createTextButton = function(text,listener) {
		var b = new bizMOB.Ui.TextButton(text,listener);
		return b;
	};
	
	/**
	 *  버튼 생성(Native Button) - 상단 또는 하단의 메뉴 버튼
	 *  
	 *  @function
	 *  @static
	 *  @memberOf	bizMOB.Ui
	 *  @param {Object}	options					{<br>
	 *  											button_text:<<String>>	버튼 텍스트,<br>
	 *  											image_name:<<String>>	버튼 이미지(ex "app/android/images/top/btn_ok.png"),<br>
	 *  											action:<<function>>		버튼 클릭시 호출할 메소드<br>
	 *  										}
	 *  @returns	{bizMOB.Ui.Button}			생성된 Naive Button
	 */
	bizMOB.Ui.createButton = function(options) {
		var p = $.extend(true, {
			control_id:"MHBarButton",
			button_text:"",
			image_name:"",
			action_type:"",
			action:''
		}, options);
		
		if(typeof options.listener == 'function') {
			p.action_type = "jscall";
			p.action = 'bizMOB.callbacks['+bizMOB.callbackId+'].success';
			bizMOB.callbacks[bizMOB.callbackId++] = {success:options.listener};
		}
		
		var b = new bizMOB.Ui.Button(p);
		return b;
	};
	
	
	/**
	 * 메인(홈) 화면으로 이동하는 버튼(Native Button) 생성 - 상단 또는 하단의 메뉴 버튼
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Ui
	 * @param	{String}	image				
	 * @returns	{bizMOB.Ui.Button}				생성된 HOME 버튼	
	 */
	bizMOB.Ui.createHomeButton = function(image) {
		var b = new bizMOB.Ui.Button();
		b.button_text = "main";
		b.image_name = image;
		b.action_type = "appfunc";
		b.action = "APP_FUNC_GOTO_HOME";
		return b;
	};
		/**
	 * 뒤로 이동하는 버튼(Native Button) 생성 - 상단 또는 하단의 메뉴 버튼
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Ui
	 * @param	{String}	image				
	 * @returns	{bizMOB.Ui.Button}				생성된 BACK 버튼	
	 */
	bizMOB.Ui.createBackButton = function(image) {
		var b = new bizMOB.Ui.Button();
		b.button_text = "back";
		b.image_name = image;
		b.action_type = "appfunc";
		b.action = "APP_FUNC_GOTO_BACK";
		return b;
	};
	
	/**
	 * 프로그램 로그아웃 버튼(Native Button) 생성 - 상단 또는 하단의 메뉴 버튼
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Ui
	 * @param	{String}	image			로그아웃 버튼에 적용할 이미지(ex "app/android/images/toolbar/btn_logout.png")
	 * @returns {bizMOB.Ui.Button}			생성된 로그아웃 버튼
	 */
	bizMOB.Ui.createLogoutButton = function(image) {
		var b = new bizMOB.Ui.Button();
		b.button_text = "로그아웃";
		b.image_name = image;
		b.action_type = "appfunc";
		b.action = "APP_FUNC_LOG_OUT";
		return b;
	};
	
	/**
	 * UpDown 버튼 생성(Native Button) - 상단 또는 하단의 메뉴 버튼
	 * 
	 * @function
	 * @static
	 * @memberOf bizMOB.Ui
	 * @param	{Object}	options			{<br>
	 * 											listener:<<function>>	Up,Down 버튼 클릭시 호출할 메소드(Event Listener)<br>
	 * 											--> Up 인 경우 함수의 파라미터로 "UP"을 전달, <br>
	 * 											--> Down 인 경우 함수의 파라미터로 "Down"을 전달 <br>
	 * 										}
	 * @returns	{bizMOB.Ui.Button}			생성된 UpDown 버튼
	 */
	bizMOB.Ui.createUpDownButton = function(options) {
		var p = $.extend(true,{
			control_id:"MHUpDown",
			button_text:"",
			image_name:"",
			action_type:"jscall",
			action:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
		},options);
		var b = new bizMOB.Ui.Button(p);
		// add callback function
		bizMOB.callbacks[bizMOB.callbackId++] = {success:options.listener};
		
		return b;
	};
	
	/**
	 * 추가 메뉴를 포함하는 메뉴 버튼
	 * 
	 * @class		추가 메뉴를 포함하는 메뉴 버튼 객체
	 * @memberOf	bizMOB.Ui
	 */
	bizMOB.Ui.ContextMenu = function(options) {
		
		var p = $.extend(true,{
			control_id:"MHBarButton",
			button_text:"",
			image_name:"",
			action_type:"popup",
			action:""
		},options);
		
		this.item_id = bizMOB.buttonId++;
		this.button_text = p.button_text;
		this.image_name = p.image_name;
		this.action_type = p.action_type;
		this.action = p.action;
		this.colLength = p.colLength;
		this.context = new Array();
	};
	
	bizMOB.Ui.ContextMenu.prototype.addMenuButton = function(button) {
		this.setMenuButton(button);
	};
	
	bizMOB.Ui.ContextMenu.prototype.setMenuButton = function(button,row,col) {
		
		if(this.context.length == 0) {
			this.context[0] = new Array();
		}
		if(row != undefined) {
			if(this.context.length < row) {
				for(var i=0; i < row; i++){
					if(this.context[i] == null)
						this.context[i] = new Array();
				}
				//this.context[row] = new Array();
			}
		} else {
			row = this.context.length;
		}
		
		if(col != undefined) {
			if(this.context[row-1].length < col) {
				for(var i=0; i < col; i++) {
					if(this.context[row-1][i] == null)
						this.context[row-1][i] = bizMOB.Ui.createButton("", function(){});
				}
			}
			this.context[row-1][col-1] = button;
		} else {
			if(this.context[row-1].length+1 > this.colLength) 
			{
				row+=1; 
				this.context[row-1] = new Array();
			}
			this.context[row-1].push(button);
		}
		
	};
	
	/**
	 * 추가적인 메뉴를 포함하는 버튼 생성(Native App)
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Ui
	 * @param {String}	text		버튼 명
	 * @param {String}	image		버튼 이미지
	 * @returns	{bizMOB.Ui.ContextMenu}	생성된 메뉴 버튼	
	 */
	bizMOB.Ui.createContextMenuButton = function(text, image, options) {
		return new bizMOB.Ui.ContextMenu({
			button_text:text, 
			image_name:image,
			colLength : options ? options.colLength : undefined
		});
	};
	
	
	
	/**
	 * 화면 Layout Border
	 * 
	 * @class		화면 Layout
	 */
	bizMOB.Ui.PageLayout = function() {
		this.titlebar = new bizMOB.Ui.TitleBar("");
		this.bottom_toolbar;
		this.left_toolbar;
		this.right_toolbar;
	};
	

	/**
	 * *** deprecated. setBottomToolbar로 대체함 ***
	 * 
	 */
	bizMOB.Ui.PageLayout.prototype.setToolbar = function(toolbar) {
		this.setBottomToolbar(toolbar);
	};
	/**
	 * 하단 툴바를 설정
	 * @function
	 * @memberOf	bizMOB.Ui.PageLayout
	 * @param {bizMOB.Ui.Toolbar}	toolbar		툴바
	 */
	bizMOB.Ui.PageLayout.prototype.setBottomToolbar = function(toolbar) {
		this.bottom_toolbar = toolbar;
	};
	/**
	 * 왼쪽 툴바를 설정
	 * @function
	 * @memberOf	bizMOB.Ui.PageLayout
	 * @param {bizMOB.Ui.Toolbar}	toolbar		툴바
	 */
	bizMOB.Ui.PageLayout.prototype.setLeftToolbar = function(toolbar) {
		this.left_toolbar = toolbar;
	};
	/**
	 * 오른쪽 툴바를 설정
	 * @function
	 * @memberOf	bizMOB.Ui.PageLayout
	 * @param {bizMOB.Ui.Toolbar}	toolbar		툴바
	 */
	bizMOB.Ui.PageLayout.prototype.setRightToolbar = function(toolbar) {
		this.right_toolbar = toolbar;
	};
	
	bizMOB.Ui.PageLayout.prototype.setTitleBar = function(titlebar) {
		this.titlebar = titlebar;
	};
	
	/**
	 * 화면 Layout 을 생성한다.
	 * 
	 * @function
	 * @static
	 * @memberOf bizMOB.Ui
	 * @returns	{bizMOB.Ui.PageLayout}		
	 */
	bizMOB.Ui.createPageLayout = function() {
		var b = new bizMOB.Ui.PageLayout("");
		return b;
	};
	
	/**
	 * 화면 상단의 Native Title Bar <br>
	 * (화면 상단의 타이틀, 왼쪽,오른쪽 버튼 지정)
	 * 
	 * @class	Native Title Bar
	 * @memberOf bizMOB.Ui
	 */
	bizMOB.Ui.TitleBar = function(title) {
		this.image_name = "";
		this.visible = true;
		
		var defaultTitlebar = bizMOB.Ui.TitleBar.prototype.defaultTitlebar;
		for(key in defaultTitlebar)
		{
			if(defaultTitlebar.hasOwnProperty(key)) this[key] = defaultTitlebar[key];  
		}
		
		this.title = title;
	};
	bizMOB.Ui.prototype.defaultTitlebar = new bizMOB.Ui.TitleBar("");
	
	/**
	 *  타이틀바 생성 (Native Title Bar) 
	 *  
	 *  @function
	 *  @static
	 *  @memberOf	bizMOB.Ui
	 *  @param {String}	title			타이틀바 텍스트
	 */
	bizMOB.Ui.createTitleBar = function(title) {
		var t = new bizMOB.Ui.TitleBar(title);
		return t;
	};
	
	/**
	 * 화면 상단 Titlebar 의 배경 이미지 지정 <br>
	 * 이미지를 지정 안 할 경우 흰색 배경이 지정됨 <br>
	 * (Only Android)
	 * 
	 * @function
	 * @memberOf bizMOB.Ui.TitleBar
	 * @param	{String}	image					지정할 이미지
	 */
	bizMOB.Ui.TitleBar.prototype.setBackGroundImage = function(image) {
		this.image_name = image;
	};
	/**
	 * 화면 상단 Titlebar 의 배경 이미지경로를 반환 <br>
	 * 
	 * @function
	 * @memberOf bizMOB.Ui.TitleBar
	 * @return	{String}	image					이미지경로
	 */
	bizMOB.Ui.TitleBar.prototype.getBackGroundImage = function() {
		return this.image_name;
	};
	
	
	/**
	 * *** deprecated. setLeftButton으로 대체함. *** 
	 * 타이틀바의 화면 왼쪽 상단 버튼 지정
	 * 
	 * @function
	 * @memberOf bizMOB.Ui.TitleBar
	 * @param	{bizMOB.Ui.Button}	button			버튼(Native Button)											
	 */
	bizMOB.Ui.TitleBar.prototype.setTopLeft = function(button) {
		this.setLeftButton(button);
	};
	/**
	 * 타이틀바의 화면 왼쪽 상단 버튼 지정
	 * 
	 * @function
	 * @memberOf bizMOB.Ui.TitleBar
	 * @param	{bizMOB.Ui.Button}	button			버튼(Native Button)											
	 */
	bizMOB.Ui.TitleBar.prototype.setLeftButton = function(button) {
		this.left = [button];
	};
	/**
	 * 타이틀바의 화면 왼쪽 상단 버튼들을 지정
	 * 
	 * @function
	 * @memberOf bizMOB.Ui.TitleBar
	 * @param	{Array<bizMOB.Ui.Button>}	button			버튼(Native Button)											
	 */
	bizMOB.Ui.TitleBar.prototype.setLeftButtons = function(buttons) {
		this.left = buttons;
	};
	/**
	 * 타이틀바의 화면 왼쪽 상단 버튼들을 반환
	 * 
	 * @function
	 * @memberOf bizMOB.Ui.TitleBar
	 * @return	{Array<bizMOB.Ui.Button>}	buttons			버튼(Native Button)											
	 */
	bizMOB.Ui.TitleBar.prototype.getLeftButtons = function() {
		return this.left;
	};
	
	
	/**
	 * *** deprecated. setRightButton으로 대체함. *** 
	 * 타이틀바의 화면 오른쪽 상단 버튼 지정
	 * 
	 * @function
	 * @memberOf	bizMOB.Ui.TitleBar
	 * @param	{bizMOB.Ui.Button}	button			버튼(Native Button)
	 */
	bizMOB.Ui.TitleBar.prototype.setTopRight = function(button) {
		this.setRightButton(button);
	};
	/**
	 * 타이틀바의 화면 오른쪽 상단 버튼 지정
	 * 
	 * @function
	 * @memberOf	bizMOB.Ui.TitleBar
	 * @param	{bizMOB.Ui.Button}	button			버튼(Native Button)
	 */
	bizMOB.Ui.TitleBar.prototype.setRightButton = function(button) {
		this.right = [button];
	};
	/**
	 * 타이틀바의 화면 오른쪽 상단 버튼들을 지정
	 * 
	 * @function
	 * @memberOf	bizMOB.Ui.TitleBar
	 * @param	{Array<bizMOB.Ui.Button>}	buttons			버튼(Native Button)
	 */
	bizMOB.Ui.TitleBar.prototype.setRightButtons = function(buttons) {
		this.right = buttons;
	};
	/**
	 * 타이틀바의 화면 오른쪽 상단 버튼들을 지정
	 * 
	 * @function
	 * @memberOf	bizMOB.Ui.TitleBar
	 * @return	{Array<bizMOB.Ui.Button>}	buttons			버튼(Native Button)
	 */
	bizMOB.Ui.TitleBar.prototype.getRightButtons = function() {
		return this.right;
	};
	
	/**
	 * 화면에 TitleBar표시 유무를 설정
	 * @function
	 * @memberOf	bizMOB.Ui.TitleBar
	 * @param	{boolean}	visible					화면표시 유무
	 */
	bizMOB.Ui.TitleBar.prototype.setVisible = function(visible) {
		this.visible = visible;
	};
	/**
	 * 화면에 TitleBar표시 유무를 반환
	 * @function
	 * @memberOf	bizMOB.Ui.TitleBar
	 * @return	{boolean}	visible					화면표시 유무
	 */
	bizMOB.Ui.TitleBar.prototype.getVisible = function() {
		return this.visible;
	};
	
	/**
	 * 타이틀바의 기본값(default) 지정
	 * @function
	 * @memberOf	bizMOB.Ui.TitleBar
	 * @param	{bizMOB.Ui.TitleBar}	titlebar	기본값
	 */
	bizMOB.Ui.TitleBar.setDefaults = function(titlebar) {
		bizMOB.Ui.TitleBar.prototype.defaultTitlebar = titlebar;
	};
	/**
	 * 타이틀바의 기본값(default) 반환
	 * @function
	 * @memberOf	bizMOB.Ui.TitleBar
	 * @return	{bizMOB.Ui.TitleBar}	기본값
	 */
	bizMOB.Ui.TitleBar.getDefaults = function() {
		return bizMOB.Ui.TitleBar.prototype.defaultTitlebar;
	};
	
	
	
	/**
	 * 화면 하단의 Native Tool Bar 
	 * 
	 * @class	Native Tool Bar
	 * @memberOf bizMOB.Ui
	 */
	bizMOB.Ui.ToolBar = function() {
		this.visible = true;
		this.image_name = "";
		this.buttons = [];
		var defaultToolbar = bizMOB.Ui.ToolBar.prototype.defaultToolbar;
		for(key in defaultToolbar)
		{
			if(defaultToolbar.hasOwnProperty(key)) this[key] = defaultToolbar[key];  
		}
	};
	bizMOB.Ui.prototype.defaultToolbar = new bizMOB.Ui.ToolBar("");
	
	/**
	 *  툴바 생성 (Native Tool Bar) 
	 *  
	 *  @function
	 *  @static
	 *  @memberOf	bizMOB.Ui
	 */
	bizMOB.Ui.createToolBar = function() {
		var t = new bizMOB.Ui.ToolBar();
		return t;
	};
	
	/**
	 * 화면 하단 Toolbar의 배경 이미지 지정 <br>
	 * 이미지를 지정 안 할 경우 흰색 배경이 지정됨 <br>
	 * (Only Android)
	 * 
	 * @function
	 * @memberOf		bizMOB.Ui.ToolBar
	 * @param	{String}	image					지정할 이미지
	 */
	bizMOB.Ui.ToolBar.prototype.setBackGroundImage = function(image) {
		this.image_name = image;
	};
	/**
	 * 화면 하단 Toolbar의 배경 이미지경로 반환 <br>
	 * 
	 * @function
	 * @memberOf		bizMOB.Ui.ToolBar
	 * @return	{String}	image					이미지경로
	 */
	bizMOB.Ui.ToolBar.prototype.getBackGroundImage = function() {
		return this.image_name;
	};
	
	/**
	 * 화면 하단의 버튼들을 지정<br>
	 * 
	 * @function
	 * @memberOf	bizMOB.Ui.ToolBar
	 * @param {Array}	buttons						지정할 {bizMOB.Ui.Button} 배열 	
	 */
	bizMOB.Ui.ToolBar.prototype.setButtons = function(buttons) {
		this.buttons = buttons;
	};
	/**
	 * 화면 하단의 버튼들을 반환<br>
	 * 
	 * @function
	 * @memberOf	bizMOB.Ui.ToolBar
	 * @return {Array}	buttons						{bizMOB.Ui.Button} 배열 	
	 */
	bizMOB.Ui.ToolBar.prototype.getButtons = function() {
		return this.buttons;
	};
	
	/**
	 * 화면에 Toolbar표시 유무를 설정
	 * 
	 * @function
	 * @memberOf	bizMOB.Ui.TitleBar
	 * @param	{boolean}	visible					화면표시 유무
	 */
	bizMOB.Ui.ToolBar.prototype.setVisible = function(visible) {
		this.visible = visible;
	};
	/**
	 * 화면에 Toolbar표시 유무를 반환
	 * 
	 * @function
	 * @memberOf	bizMOB.Ui.TitleBar
	 * @return	{boolean}	visible					화면표시 유무
	 */
	bizMOB.Ui.ToolBar.prototype.getVisible = function() {
		return this.visible;
	};
	
	/**
	 * 툴바의 기본값(default) 지정
	 * @function
	 * @memberOf	bizMOB.Ui.ToolBar
	 * @param	{bizMOB.Ui.ToolBar}	toolbar	기본값
	 */
	bizMOB.Ui.ToolBar.setDefaults = function(toolbar) {
		bizMOB.Ui.ToolBar.prototype.defaultToolbar = toolbar;
	};
	/**
	 * 툴바의 기본값(default) 반환
	 * @function
	 * @memberOf	bizMOB.Ui.ToolBar
	 * @return	{bizMOB.Ui.ToolBar}	기본값
	 */
	bizMOB.Ui.ToolBar.getDefaults = function() {
		return bizMOB.Ui.ToolBar.prototype.defaultToolbar;
	};
	
	/**
	 * view 보이기 (SET_APP)
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Ui
	 * @param	{bizMOB.Ui.PageLayout}	layout 	페이지 레이아웃 값
	 * @param	{Object}	options
	 */
	bizMOB.Ui.displayView = function(layout, options) {
		
		var v = {
				call_type:"js2app",
				id:"SET_APP"
		};
	
		var p = $.extend(false, layout, {
			callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
		});
		
		v.param = p;
		
		var callback = options && options.callback ? options.callback : appcallOnSetApp;
		bizMOB.callbacks[bizMOB.callbackId++] = {success:callback};
		
		if(typeof onClickAndroidBackButton == 'function') {
			v.param.android_hardware_backbutton = "onClickAndroidBackButton";
		}
		bizMOB.onFireMessage(v);
	};
	
	/**
	 * HTML 컨텐츠로 구성된 Dialog
	 * 
	 * @class		HTML 컨텐츠로 구성된 Dialog
	 * @memberOf	bizMOB.Ui
	 */
	bizMOB.Ui.Dialog = function(){};
	/**
	 * POPUP Dialog 열기
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Ui
	 * @param	{String}	html_page			dialog의 웹컨텐츠 html page
	 * @param	{Object}	options				{ <br>
	 * 												message: {Object} Dialog에 전달할 데이터 <br>
	 * 												&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-> page.init 함수의 파라미터로 전달 <br>
	 * 												width:	{number} Dialog 의 넓이
	 * 												height:	{number} Dialog 의 높이
	 * 												callback: {function} Dialog 의 응답 처리
	 * 											}
	 */
	bizMOB.Ui.openDialog = function(html_page, options) {
		var v = {
				call_type:"js2web",
				id:"SHOW_POPUP_VIEW",
				param:{}
		};
		bizMOB.callbacks[bizMOB.callbackId] = {success:options.callback};
		options.callback = "appcallOnLoad";
		if(!options.message) options.message = {};
		options.message.callback = 'bizMOB.callbacks['+bizMOB.callbackId+'].success';
		bizMOB.callbackId++;
		
		if(options.height == undefined || options.height == "" ){
			options.height = 350;
		}
		
		if(options.width == undefined || options.width == ""){
			options.width = 200;
		}
		
		if(isNaN(options.height) && isNaN(options.width) ){
			options.base_on_size = "device";
			options.base_size_orientation = "auto";
			options.width_percent = options.width.replace(/\%/,"");
			options.height_percent = options.height.replace(/\%/,"");
			delete options.width;
			delete options.height;
		}
		
		var p = $.extend(true, {
			callback:"appcallOnLoad",
			message:{},
			target_page:""
		}, options);
		p.target_page = html_page;
		
		v.param = p;
		
		if(typeof onClickAndroidBackButton == 'function') {
			v.param.android_hardware_backbutton = "onClickAndroidBackButton";
		}
		
		bizMOB.onFireMessage(v);
	};
	
	/**
	 * POPUP Dialog 닫기
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Ui
	 * @param	{Object}	options				{ <br>
	 * 												message: {Object} Dialog에서 Dialog opner 페이지에 전달할 데이터 <br>
	 * 												&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-> callback 함수의 파라미터로 전달 <br>
	 * 												callback:	{String} Dialog opner 페이지의 호출함 함수명
	 * 											}
	 */
	bizMOB.Ui.closeDialog = function(options) {
		var v = {
				call_type:"js2web",
				id:"DISMISS_POPUP_VIEW",
				param:{}
		};
		
		var p = $.extend(true, {
			callback:"appcallOnDismissPopupView",
			message:{}
		}, options);
		
		v.param = p;
		
		bizMOB.onFireMessage(v);
	};
	/* ********** Map ************************************** */
	bizMOB.Map.prototype = new Object();
	
	/**
	 * 디바이스의 지도(Map)을 화면에 보여주기
	 * 
	 * @param {String}	location   			지도에 보여줄 위치
	 */
	bizMOB.Map.show = function(location) {
		var v = {
			call_type:"js2app",
			id:"SHOW_MAP",
			param:{
				location:location
			}
		};
		
		bizMOB.onFireMessage(v);
	};
	
	/* ********** Contacts 연락처 ************************************** */
	bizMOB.Contacts.prototype = new Object();
	
	/**
	 * 디바이스 내부의 연락처목록 검색
	 * 
	 * @param {Object}	options						{<br>
	 * 													search_type:{String} , <br>
	 *  												search_text:{String} 검색어	<br>
	 *  											}<br>
	 */
	bizMOB.Contacts.get = function(options) {
		var v = {
			call_type:"js2app",
			id:"GET_CONTACT",
			param:{}
		};
		
		var p = $.extend(true, {
			search_type:'',
			search_text:'',
			callback:'appcallOnContacts'
		}, options);
		
		v.param = p;
		
		bizMOB.onFireMessage(v);
	};
	
	/* ********** Network ***************************************** */
	bizMOB.Network.prototype = new Object();
	
	/**
	 * 세션 타임아웃 설정 <br/>
	 * App의 타임아웃 시간을 설정한다..
	 * 
	 * @function
	 * @memberOf	bizMOB.Network
	 * @param {Number}	msec				타임아웃 시간(milliseconds.)
	 */
	bizMOB.Network.setSessionTimeout = function(msec) {
		var v = {
			    "call_type": "js2app",
			    "id": "SET_SESSION_TIMEOUT",
			    "param": {
			        "callback":"",  
			        "session_timeout": msec         
			    }
			};

		
		bizMOB.onFireMessage(v);
	};
	
	/**
	 * 세션 타임아웃 값 반환 <br/>
	 * App의 타임아웃 시간을 반환한다..
	 * 
	 * @function
	 * @memberOf	bizMOB.Network
	 * @param {String}	callback			callback 함수명(return : {"session_timeout": 1200} )
	 */
	bizMOB.Network.getSessionTimeout = function(callback) {
		var v = {
			    "call_type": "js2app",
			    "id": "SET_SESSION_TIMEOUT",
			    "param": {
			        "callback":callback,  
			        "session_timeout": -1         
			    }
			};

		
		bizMOB.onFireMessage(v);
	};
	
	/**
	 * 파일 업로드 <br/>
	 * 파일 업로드 후에 지정된 콜백 함수를 실행한다.
	 * 
	 * @function
	 * @memberOf	bizMOB.Network
	 * @param {Array}	fileList			업로드할 파일 목록
	 * @param {function}	callback		파일 업로드후 호출될 콜백함수
	 */
	bizMOB.Network.fileUpload = function(fileList, callback)
	{
		if(fileList && fileList.length>0)
		{
			var ZZ0004 = 
			{
				"body": 
				{
					file_count : fileList.length
				},
				"header": {
				    "login_session_id": "",
				    "trcode": "ZZ0004",
				    "message_version": "",
				    "result": " ",
				    "error_code": " ",
				    "error_text": " ",
				    "info_text": ""		
				}
			};
			bizMOB.Web.post({
				message : ZZ0004, //bizMOB서버에 전송할 전문
				success : function(json)
				{
					if(json && json.header && json.header.result)
					{
						var streamData = [];
						fileList.forEach(function(value, index)
						{
							var record = $.extend(false, 
							{
				        	   "uid"   : undefined,
				               "file_name"  : "",
				               "file_id"  : "",
				               "resize_flag" : false,
				               "resize_width" : 0  
							}, value);
							record.uid = json.body.list[index].UID;
							streamData.push(record);
						});	
						
						var v = {
							"call_type" : "js2app",
							"id" : "UPLOAD_IMAGE_DATA",
							"param" : {
								"success_callback" : 'bizMOB.callbacks[' + bizMOB.callbackId
										+ '].success',
								"error_callback" : 'bizMOB.callbacks[' + bizMOB.callbackId
										+ '].error',
								"uri" : "",
								"data" : [],
								"stream_data" : streamData
							}
						};
						bizMOB.callbacks[bizMOB.callbackId++] = 
						{ 
							success : function(arg)
							{ 
								$.extend(arg, { uids : json.body.list  });
								if(callback) callback({ result : true, uids : json.body.list  }); 
							},
							error : function(arg)
							{
								if(callback) callback({ result : false  });
							}
						};
						
						bizMOB.onFireMessage(v);
					}
					else callback({result : false, error_code : json.error_code, error_text : json.error_text});
				}
			});
			
		}
		else callback({result : false, error_text : "파일이 없습니다."});
	};
	
	/**
	 * 파일 다운로드 <br/>
	 * 파일 다운로드 후에 디바이스에 설치된 파일뷰어를 통해서 파일을 연다.
	 * 
	 * @function
	 * @memberOf	bizMOB.Network
	 * @param {String}	method			파일 다운로드 방법(direct, manager)
	 * @param {String}	uri				파일 다운로드 uri
	 * @param {String}	display_name	보여지는 파일명
	 */
//	bizMOB.Network.fileDownload = function(method,uri,display_name) {
//		var v = {
//			call_type:"js2app",
//			id:"GOTO_DOWNLOAD",
//			param:{method:method,uri:uri,display_name:display_name,directory:""}
//		};
//		
//		bizMOB.onFireMessage(v);
//	};
	
	bizMOB.Network.fileDownload = function(file_list, method, options) {
		
		var progressbar = {
				provider : "native",//web
				type : "default" //each_list, full_list, ....
		};
		options.progressbar = $.extend(true, options.progressbar , progressbar);
		
		var list_len = file_list.length;
		for(var i=0;i< list_len; i++){
			var splitTargetPath = bizMOB.pathParser(file_list[i].directory);
			file_list[i].target_path = splitTargetPath.path + file_list[i].filename,
			file_list[i].target_path_type = splitTargetPath.type,
			file_list[i].file_id = i;
		}
		
		var v = {
			call_type:"js2app",
			id:"DOWNLOAD",
			param:{
				method:method,
				uri_list:file_list,
				progressbar : options.progressbar,
				callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
			}
		};
		
		bizMOB.callbacks[bizMOB.callbackId++] = {success:options.callback};
		bizMOB.onFireMessage(v);
	};
	
	/**
	 * 이미지 파일 다운로드 <br/>
	 * 이미지 파일 다운로드 후 callback function에 파라미터로 이미지 접근 경로 넣어 호출한다.
	 * 
	 * @function
	 * @memberOf	bizMOB.Network
	 * @param {String}	uri				이미지 파일 다운로드 uri
	 * @param {String}	display_name	이미지 파일 명
	 * @param {function}	callback	이미지 파일 다운로드 후 호출되는 함수
	 */
	bizMOB.Network.imageDownload = function(uri, display_name, callback){
		var v = {
				call_type:"js2web",
				id:"DOWNLOAD_IMAGE",
				param:{
					uri:uri,
					display_name:display_name,
					callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
				}
			};
		bizMOB.callbacks[bizMOB.callbackId++] = {success:callback};
		bizMOB.onFireMessage(v);
	};
	/* ********** File  ***************************************** */
	bizMOB.File.prototype = new Object();
	
	bizMOB.File.zip= function(sourcePath, targetPath, options)
	{
		var splitSourcePath = bizMOB.pathParser(sourcePath);
		var splitTargetPath = bizMOB.pathParser(targetPath);
		var v = 
		{
			call_type:"js2app",
			id:"ZIP_FILE",
			param:{
				source_path: splitSourcePath.path,
				source_path_type: splitSourcePath.type,
			    target_path: splitTargetPath.path,
			    target_path_type: splitTargetPath.type,
				callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
			}
		};
		bizMOB.callbacks[bizMOB.callbackId++] = {success:options.callback};
		bizMOB.onFireMessage(v);
	};
    
    bizMOB.File.unzip= function(sourcePath, targetDir, options)
	{
		var splitSourcePath = bizMOB.pathParser(sourcePath);
		var splitTargetDir = bizMOB.pathParser(targetDir);
		var v = 
		{
				call_type:"js2app",
				id:"UNZIP_FILE",
				param:{
					source_path: splitSourcePath.path,
					source_path_type: splitSourcePath.type,
					target_directory: splitTargetDir.path,
					target_directory_type: splitTargetDir.type,
					callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
				}
		};
		bizMOB.callbacks[bizMOB.callbackId++] = {success:options.callback};
		bizMOB.onFireMessage(v);
	};
	
	bizMOB.File.open = function(targetPath, options)
    {
        var splitTargetPath = bizMOB.pathParser(targetPath);
        var v = 
        {
               call_type:"js2app",
               id:"OPEN_FILE",
               param:{
                      target_path : splitTargetPath.path,
                      target_path_type : splitTargetPath.type,
                      callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
               }
        };
        bizMOB.callbacks[bizMOB.callbackId++] = {success:options.callback};
        bizMOB.onFireMessage(v);
    };
	
	bizMOB.File.move = function(sourcePath, targetPath, options)
	{
		var splitSourcePath = bizMOB.pathParser(sourcePath);
		var splitTargetPath = bizMOB.pathParser(targetPath);
		var v = 
		{
				call_type:"js2app",
				id:"MOVE_FILE",
				param:{
					source_path: splitSourcePath.path,
					source_path_type: splitSourcePath.type,
					target_path: splitTargetPath.path,
					target_path_type: splitTargetPath.type,
					callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
				}
		};
		bizMOB.callbacks[bizMOB.callbackId++] = {success:options.callback};
		bizMOB.onFireMessage(v);
	};
	
	bizMOB.File.copy = function(sourcePath, targetPath, options) {
		
		var splitSourcePath = bizMOB.pathParser(sourcePath);
		var splitTargetPath = bizMOB.pathParser(targetPath);
		
		var v = {
				"call_type": "js2app",
			    "id": "COPY_FILE",
			    "param": {
			        "callback":'bizMOB.callbacks['+bizMOB.callbackId+'].success',                              
			        "is_external_target": true,                            
			        "source_path": splitSourcePath.path,
					"source_path_type": splitSourcePath.type,
					"target_path": splitTargetPath.path,
					"target_path_type": splitTargetPath.type
			    }
			};
		
		bizMOB.callbacks[bizMOB.callbackId++] = {success:options.callback};
		bizMOB.onFireMessage(v);return;
	};
	
	bizMOB.File.remove = function(files, options) {
		
		for(var i=0;i<files.length;i++){
			
			var splitSourcePath = bizMOB.pathParser(files[i]);
			
			var file = {
					"source_path": splitSourcePath.path,
					"source_path_type": splitSourcePath.type,
			};
			
			
			files[i] = file;
		}
		
		var v = {
				"call_type": "js2app",
			    "id": "REMOVE_FILES",
			    "param": {
			    	list: files,
			    	callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
			    }
			};
		
		bizMOB.callbacks[bizMOB.callbackId++] = {success:options.callback};
		bizMOB.onFireMessage(v);return;
	};
	
	bizMOB.File.directory = function(dir, options)
	{
		var splitDir = bizMOB.pathParser(dir);
		var v = 
		{
				call_type:"js2app",
				id:"GET_DIRECTORY_INFO",
				param:{
					source_directory: splitDir.path,
					source_directory_type: splitDir.type,
					callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
				}
		};
		
		bizMOB.callbacks[bizMOB.callbackId++] = {success:options.callback};
		bizMOB.onFireMessage(v);
	};
	
	bizMOB.File.exist = function(sourcePath, options) {
		
		var splitSourcePath = bizMOB.pathParser(sourcePath);
		var v = 
		{
				call_type:"js2app",
				id:"EXISTS_FILE",
				param:{
					source_path: splitSourcePath.path,
					source_path_type: splitSourcePath.type,
					callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
				}
		};
		bizMOB.callbacks[bizMOB.callbackId++] = {success:options.callback};
		bizMOB.onFireMessage(v);
		
	};
	
	/*
	 * 
	bizMOB.File.read = function(sourcePath, readType, callback)
	{
		var splitSourcePath = bizMOB.pathParser(sourcePath);
		var v = 
		{
				call_type:"js2app",
				id:"READ_FILE",
				param:{
					source_path: splitSourcePath.path,
					source_path_type: splitSourcePath.type,
					type:readType,
					callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
				}
		};
				
		bizMOB.callbacks[bizMOB.callbackId++] = {success:callback};
		bizMOB.onFireMessage(v);
	};
	
	bizMOB.File.write = function(data, targetPath, writeType, callback)
    {
    	var splitTargetPath = bizMOB.pathParser(targetPath);
    	var v = 
    	{
    			call_type:"js2app",
    			id:"WRITE_FILE",
    			param:{
    				data : data,
    				target_path : splitTargetPath.path,
    				target_path_type : splitTargetPath.type,
    				type : writeType,
    				callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
    			}
    	};
    	bizMOB.callbacks[bizMOB.callbackId++] = {success:callback};
    	bizMOB.onFireMessage(v);
    };
	
	*/
	
	
	/* ********** Properties ***************************************** */
	bizMOB.Properties.prototype = new Object();
	
	/**
	 * 하나의 Property 설정
	 * 
	 * @function
	 * @memberOf		bizMOB.Properties
	 * @param {String}	key					property key
	 * @param {String}	value				property value
	 */
	bizMOB.Properties.set = function(key, value) {
		var v = {
			call_type:"js2stg",
			id:"SET_FSTORAGE",
			param:{data:[]}
		};
		var properties = new Array();
		var strValue =  value!=undefined ? JSON.stringify(value):"";
		
//		if(value.constructor == Object) strValue = JSON.stringify(value);
//		else strValue = value!=undefined && value!=null ? value : "";
		
		properties.push({key:key, value:strValue});
		bizMOB.FStorage[key] = strValue;
		
		v.param.data = properties;
		
		bizMOB.onFireMessage(v);
	};
	
	/**
	 * 여러개의 Property 설정
	 * 
	 * @function
	 * @memberOf		bizMOB.Properties
	 * @param {Array}	properties			지정할 프로퍼티 {key:value} 형식			
	 */
	bizMOB.Properties.sets = function(properties) {
		var v = {
			call_type:"js2stg",
			id:"SET_FSTORAGE",
			param:{data:[]}
		};
		for(var i=0,len = properties.length; i< len; i++){
			var value = properties[i]["value"];
//			if(value.constructor == Object) value = JSON.stringify(value);
//			properties[i]["value"] = value!=undefined && value!=null ? value : "";
			properties[i]["value"] = value!=undefined ? JSON.stringify(value):"";
		    bizMOB.FStorage[properties[i]["key"]] = properties[i]["value"];
		}
		v.param.data = properties;
		
		
		bizMOB.onFireMessage(v);
	};
	
	/**
	 * 설정된 Property 값 얻기
	 * 
	 * @param {String}	key					값을 얻을 Property의 키
	 * @returns		{String}				Property 값
	 */
	bizMOB.Properties.get = function(key) {
		
		var value = bizMOB.FStorage[key];
		var retValue;
		
		if ( value != undefined && value.slice(0, 1) != "0" && value != "" ) {
			retValue = JSON.parse(value);
		}
			
//		if(retValue.constructor == String)
//		{
//			return value;
//		}else{
//			return retValue;
//		}
		
		return retValue;
	};
	
	/**
	 * 설정되 Property 삭제
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Properties
	 * @param {String}	key					삭제할 Property의 키
	 * 
	 */
	bizMOB.Properties.remove = function(key) {
		var v = {
			call_type:"js2stg",
			id:"REMOVE_FSTORAGE",
			param:{data:[key]}
		};
		
		bizMOB.onFireMessage(v);
	};
	
	/**
	 * 설정된 모든 Properties 삭제
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Properties
	 */
	bizMOB.Properties.clear = function() {
		var v = {
			call_type:"js2stg",
			id:"CLEAR_FSTORAGE",
			param:{}
		};
		
		bizMOB.onFireMessage(v);
	};
	
	/* ********** Storage ***************************************** */
	bizMOB.Storage.prototype = new Object();
	
	/**
	 * 전역적으로 사용할 데이터를 로컬 저장소에 저장
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Storage
	 * @param {String}	key			
	 * @param {String}	value
	 */
	bizMOB.Storage.save = function(key, value) {
		
		var v = {
				call_type:"js2stg",
				id:"SET_MSTORAGE",
				param:{data:[]}
		};
		
		switch(arguments[0].constructor)
		{
			case Array :
				var datalist =  arguments[0];
				for(var i=0,len = datalist.length; i< len; i++){
					var value = datalist[i]["value"];
					datalist[i]["value"] = value!=undefined && value!=null ? JSON.stringify(value) : "";
				    bizMOB.MStorage[datalist[i]["key"]] = datalist[i]["value"];
				}
				v.param.data = datalist;
				
				break;
			case String :
				var datalist = new Array();

				var strValue = value!=undefined && value!=null ? JSON.stringify(value) : "";
				
//				if(value.constructor == Object) strValue = JSON.stringify(value);
//				else strValue = value!=undefined && value!=null ? value : "";
				
				datalist.push({key:key, value:strValue});
				v.param.data = datalist;
				
				bizMOB.MStorage[key] = strValue;
				break;
		}
				
		
		bizMOB.onFireMessage(v);
	};
	
	/**
	 * 로컬 저장소에 저장된 데이터 가져오기
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Storage
	 * @param {String}		key
	 * @returns	{String}	지정된 데이터 값
	 */
	bizMOB.Storage.get = function(key) {
		var value = bizMOB.MStorage[key];
		var retValue;
		
		if ( value != undefined && value.slice(0, 1) != "0" && value != "" ) {
			retValue = JSON.parse(value);
		}
		
//		if(retValue.constructor == String)
//		{
//			return value;
//		}else{
//			return retValue;
//		}
		return retValue;
	};
	
	/**
	 * 저장된 로컬 저장소 데이터 삭제
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Storage
	 * @param {String}	key					삭제할 데이터의 키
	 * 
	 */
	bizMOB.Storage.remove = function(key) {
		var v = {
			call_type:"js2stg",
			id:"REMOVE_MSTORAGE",
			param:{data:[key]}
		};
		delete bizMOB.MStorage[key];
		bizMOB.onFireMessage(v);
	};
	
	
	bizMOB.WebStorage.prototype = new Object();
	bizMOB.WebStorage.save = function(key, value) {
		
		
		if( key.constructor  === Array){
			for(var i=0;i < key.length ; i++){
				if ( key[i].value.constructor  === Object){
					key[i].value = JSON.stringify(key[i].value);
				}
				localStorage.setItem ( key[i].key , key[i].value );
			}
		}else{
			if ( value.constructor  === Object){
				value = JSON.stringify(value);
			}
			localStorage.setItem ( key , value );
		}
		
		
	};
	bizMOB.WebStorage.get = function(key) {
		return localStorage.getItem ( key );
	};
	bizMOB.WebStorage.remove = function(key) {
		localStorage.removeItem ( key );
	};
	
	/* ********** SQLite ***************************************** */
	bizMOB.SQLite.prototype = new Object();
	/**
	 * 내부 데이터베이스를 연결한다.
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.SQLite
	 * @returns		Database
	 */
	bizMOB.SQLite.openDatabase = function(dbname) {
		var db;
		if(bizMOB.detectAndroid()) {
			if(dbname == undefined) dbname = 'bizmob';
			AndroidSqlite.openDatabase(dbname);
			db = new bizMOB.SQLite.DB();
		} else if(bizMOB.detectiPhone() && dbname != undefined) {
			iOSSqlite.openDatabase(dbname);
			db = new bizMOB.SQLite.DB();
		} else {
			db = openDatabase(dbname,"1","bizMOB DB", 1024*1024);
			db.close = function(){};
		}
		return db;
	};
	
	/**
	 * SQLite 데이터베이스
	 * 
	 * @class	데이터베이스
	 * @memberOf	bizMOB.SQLite.DB
	 */
	bizMOB.SQLite.DB = function() {};
	
	bizMOB.SQLite.DB.prototype.close = function() {
		if(bizMOB.detectAndroid()) {
			AndroidSqlite.closeDatabase();
		} else if(bizMOB.detectiPhone()) {
			iOSSqlite.closeDatabase();
		} 
	};
	
	/**
	 * 트랜잭션을 실행한다.
	 * 
	 * @function
	 * @memberOf	bizMOB.SQLite.DB
	 * @param {function}	execute			트랜잭션 안에서 처리할 함수
	 * @param {function}	error			<B>Optional</B><br/>트랜잭션이 에러로 종료되었을때 호출할 함수
	 * @param {function}	success			<B>Optional</B><br/>트랜잭션이 정상 종료되었을때 호출할 함수
	 */
	bizMOB.SQLite.DB.prototype.transaction = function(execute, error, success) {
		
		var tx = new bizMOB.SQLite.Transaction(error, success);
		try {
			execute(tx);
			if(tx.result > 0) {
				if(tx.beginTransaction) {
					if(bizMOB.detectAndroid()) 
						AndroidSqlite.commitTransaction();
					else 
						iOSSqlite.commitTransaction();
				}
				if(typeof tx.success == 'function') {tx.success();}
			}
		} catch (err) {
			if(typeof tx.error == 'function') tx.error(err);
		}
		
	};
	
	/**
	 * 데이터베이스 트랜잭션을 관리
	 * 
	 * @class	데이터베이스 트랜잭션 클래스
	 * @memberOf	bizMOB.SQLite 
	 * @param {function}	error		트랜잭션이 에러로 종료되었을때 호출할 함수
	 * @param {function}	success		트랜잭션이 정상 종료되었을때 호출할 함수	
	 */
	bizMOB.SQLite.Transaction = function(error, success) {
		this.beginTransaction = false;
		this.error = error;
		this.success = success;
		this.result = 0;
	};
	
	/**
	 * SQL문 실행
	 * 
	 * @function
	 * @memberOf	bizMOB.SQLite.Transaction
	 * @param {String}	query			실행할 sql query 문
	 * @param {Array}	bindingValues	SQL문 안에 '?' 문자를 치환할 값<br/> 
	 * 									'?' 순서대로 나열된 배열
	 * @param {function}	success		<B>Optional</B><br/>SQL 실행시 성공했을때 호출할 함수 
	 * @param {function}	error		<B>Optional</B><br/>SQL 실행시 에러발생시 호출할 함수
	 */
	bizMOB.SQLite.Transaction.prototype.executeSql = function(query, bindingValues, success, error) {
		var q =  $.trim(query).slice(0,6);
		if(q.toLowerCase() == 'select') {
			var retVal;
			if(bindingValues != undefined && bindingValues.length > 0) {
				if(bizMOB.detectAndroid()) 
					retVal = AndroidSqlite.executeSelect(query,JSON.stringify(bindingValues) );
				else
					retVal = iOSSqlite.executeSelect(query,JSON.stringify(bindingValues) );
			} else {
				if(bizMOB.detectAndroid()) 
					retVal = AndroidSqlite.executeSelect(query);
				else
					retVal = iOSSqlite.executeSelect(query);
			}
			//this.result = 0;
			retVal = jQuery.parseJSON(retVal);
			if(retVal.success) {
				this.result = 1;
				var rs = new bizMOB.SQLite.ResultSet(retVal.rows);
				if(typeof success == 'function') {success(this,rs);}
			} else {
				this.result = 0;
				if(typeof error == 'function') {error(retVal.error);}
				throw retVal.error;
				//if(typeof this.error == 'function') {this.error(retVal.error);}
				//return false;
			}
		} else {
			if(!this.beginTransaction) {
				if(bizMOB.detectAndroid()) 
					AndroidSqlite.beginTransaction();
				else
					iOSSqlite.beginTransaction();
				
				this.beginTransaction = true;
			}
			var retVal;
			
			if(bindingValues != undefined && bindingValues.length > 0) {
				if(bizMOB.detectAndroid())
					retVal = AndroidSqlite.executeSql(query,JSON.stringify(bindingValues));
				else
					retVal = iOSSqlite.executeSql(query,JSON.stringify(bindingValues));
			}
			else {
				if(bizMOB.detectAndroid())
					retVal = AndroidSqlite.executeSql(query);
				else
					retVal = iOSSqlite.executeSql(query);
			}
			retVal = jQuery.parseJSON(retVal);
			if(! retVal.success) {
				//try {
					this.result = 0;
					if(bizMOB.detectAndroid())
						AndroidSqlite.rollbackTransaction();
					else
						iOSSqlite.rollbackTransaction();
					
					if(typeof error == 'function') {error(retVal.error);}
					throw retVal.error;
				//} catch (err) {
				//	alert(err);
				//	if(typeof error == 'function') {error(retVal.error);}
				//	else if(typeof this.error == 'function') {this.error(retVal.error);}
				//}
			} else {
				this.result = 1;
				if(typeof success == 'function') {success();}
			}
		}
		
	};
	
	/**
	 * 대량 SQL문 실행
	 * 
	 * @function
	 * @memberOf	bizMOB.SQLite.Transaction
	 * @param {String}	query			실행할 sql query 문
	 * @param {Array}	bindingValues	SQL문 안에 '?' 문자를 치환할 값<br/> 
	 * 									'?' 순서대로 나열된 배열(2중 배열, [[]])
	 * @param {function}	success		<B>Optional</B><br/>SQL 실행시 성공했을때 호출할 함수 
	 * @param {function}	error		<B>Optional</B><br/>SQL 실행시 에러발생시 호출할 함수
	 */
	bizMOB.SQLite.Transaction.prototype.executeBatchSql = function(query, bindingValues, success, error) {
		
		var q = query.slice(0,6);
		var retVal; 
		
		if(q.toLowerCase() == 'select') {
			
		} else {
			if(!this.beginTransaction) {
				if(bizMOB.detectAndroid())
					AndroidSqlite.beginTransaction();
				else
					iOSSqlite.beginTransaction();
				
				this.beginTransaction = true;
			}else 
			{
			}
			
			if(bizMOB.detectAndroid())
			{
				retVal = AndroidSqlite.executeBatchSql(query,JSON.stringify(bindingValues));
			
			}else{
				retVal = iOSSqlite.executeBatchSql(query,JSON.stringify(bindingValues));
			}
			
			retVal = jQuery.parseJSON(retVal);
			if(! retVal.success) {
				this.result = 0;
				if(bizMOB.detectAndroid())
					AndroidSqlite.rollbackTransaction();
				else
					iOSSqlite.rollbackTransaction();
				
				if(typeof error == 'function') {error(retVal.error);}
				else if(typeof this.error == 'function') {this.error(retVal.error);}
			} else {
				if(this.beginTransaction) {
					//alert("commit transaction "+query);
					if(bizMOB.detectAndroid())
						AndroidSqlite.commitTransaction();
					else
						iOSSqlite.commitTransaction();
				}else
				{
					bizMOB.Ui.alert("alreay commit transaction "+query);
				}
				if(typeof success == 'function') {success();}
			}
		}
		
	};
	
	/**
	 * SQL select 실행 결과 객체
	 * 
	 * @param rows
	 */
	bizMOB.SQLite.ResultSet = function(rows) {
		this.rows = new bizMOB.SQLite.ResultSet.Rows(rows);
	};
	
	/**
	 * SQL select 정상 실행시 결과 rows
	 * 
	 * @param rows
	 */
	bizMOB.SQLite.ResultSet.Rows  = function(rows) {
		this.rows = rows;
		this.length = rows.length;
	};
	
	/**
	 * 결과 레코드를 얻는다.
	 * 
	 * @param {number}	index			row의 인덱스
	 * @returns	{Object}				주어진 인덱스에 해당하는 row
	 */
	bizMOB.SQLite.ResultSet.Rows.prototype.item = function(index) {
		if(this.rows.length > 0) {
			return this.rows[index];
		} else {
			return {};
		}
	};
	
	/**
	 * 데이터베이스 생성 및 연결 <br>
	 * 동기방식 <br>
	 * only Android
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.SQLite
	 */
	bizMOB.SQLite.openDatabaseSync = function() {
		AndroidSqlite.openDatabase("bizmob");
		return new bizMOB.SQLite.AndroidDB();
	};
	
	/**
	 * Android Sqlite 데이터베이스 <br/>
	 * <b>iOS에서 사용 불가</b>
	 * 
	 * @class	Android Sqlite 데이터베이스
	 * @memberOf	bizMOB.SQLite
	 */
	bizMOB.SQLite.AndroidDB = function() {};
	/**
	 * 트랜잭션을 연다.
	 * 
	 * @function
	 * @memberOf	bizMOB.SQLite.AndroidDB
	 */
	bizMOB.SQLite.AndroidDB.prototype.beginTransaction = function() {
		AndroidSqlite.beginTransaction();
	};
	/**
	 * 트랜잭션을 커밋한다.
	 * 
	 * @function
	 * @memberOf	bizMOB.SQLite.AndroidDB
	 */
	bizMOB.SQLite.AndroidDB.prototype.commit = function() {
		AndroidSqlite.commitTransaction();
	};
	/**
	 * 트랜잭션을 롤백한다.
	 * 
	 * @function
	 * @memberOf	bizMOB.SQLite.AndroidDB
	 */
	bizMOB.SQLite.AndroidDB.prototype.rollback = function() {
		AndroidSqlite.rollbackTransaction();
	};
	/**
	 * SQL query 문을 실행한다
	 * 
	 * @function
	 * @memberOf	bizMOB.SQLite.AndroidDB
	 * @param {String}	query				실행할 쿼리문
	 * @param {Array}	bindingValues		SQL문 안에 '?' 문자를 치환할 값<br/> 
	 * 										'?' 순서대로 나열된 배열
	 * @returns		{Object}	실행결과
	 */
	bizMOB.SQLite.AndroidDB.prototype.executeSql = function(query, bindingValues) {
		var result;
		if(bindingValues != undefined && bindingValues.length > 0) {
			result = AndroidSqlite.executeSql(query,JSON.stringify(bindingValues));
		} else {
			result = AndroidSqlite.executeSql(query);
		}
		
		if(result < 1) throw {code:result, message:"Error"};
		return result;
	};
	/**
	 * SELECT SQL문을 실행한다.
	 * 
	 * @param {String}	query				실행할 SELECT 쿼리문	
	 * @param {Array}	bindingValues		SQL문 안에 '?' 문자를 치환할 값<br/> 
	 * 										'?' 순서대로 나열된 배열
	 * @returns {bizMOB.SQLite.ResultSet}
	 */
	bizMOB.SQLite.AndroidDB.prototype.selectSql = function(query, bindingValues) {
		var retVal;
		if(bindingValues != undefined && bindingValues.length > 0) {
			retVal = AndroidSqlite.executeSelect(query,JSON.stringify(bindingValues) );
		} else {
			retVal = AndroidSqlite.executeSelect(query);
		}
		this.result = 0;
		retVal = jQuery.parseJSON(retVal);
		var rs = new bizMOB.SQLite.ResultSet(retVal.rows);
		return rs;
	};
	
	
	/* ********** Camera ***************************************** */
	bizMOB.Camera.prototype = new Object();
	
	/**
	 * 디바이스의 카메라를 이용하여 사진 찍기
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Camera
	 * 
	 * @param {function}	listener		사진찍기 후 결과 처리 함수	
	 * @param {String}		directory		(Optional) 사진 파일을 저장할 디렉터리 경로 - 안드로이드 os에서만 사용 가능
	 * @param {String}		filename		(Optional) 사진 파일의 이름 - 안드로이드 os에서만 사용 가능
	 */
	bizMOB.Camera.capture = function(listener, directory, filename) {
		var splitTargetDir = bizMOB.pathParser(directory);
		var v = {
			call_type:"js2app",
			id:"CAMERA_CAPTURE",
			param:{
				target_directory: splitTargetDir.path,
				target_directory_type: splitTargetDir.type,
				picture_name:"",
				callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
			}
		};
		
		if(filename != undefined) v.param.picture_name = filename;
		
		bizMOB.callbacks[bizMOB.callbackId++] = {success:listener};
		bizMOB.onFireMessage(v);
	};
	
	/* ********** Gallery ***************************************** */
	bizMOB.Gallery.prototype = new Object();
	
	/**
	 * 디바이스의 사진앨범 보기(갤러리 보기)
	 * 
	 * @function
	 * @static
	 * @memberOf	bizMOB.Gallery
	 * 
	 * @param {function}	listener		갤러리 보기후 선택한 사진을 전달받아서 처리하는 함수 <br/>
	 * 										파라미터 예) { result : true, "images":[{"uri":"23","filename":"1.jpg","size":"10240"}]})
	 * @param {Object}	options					{<br>
	 * 												typeList : {Array} 보여지는 목록의 타입. video // image <br>
	 * 											}
	 */
	bizMOB.Gallery.show = function(listener, options) {
		options = $.extend(false, 
		{
			typeList : [ "image" ]
		}, options);
		var v = {
			call_type:"js2app",
			id:"GET_MEDIA_PICK",
			param:{
				type_list : options.typeList,
				callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
			}
		};
		
		bizMOB.callbacks[bizMOB.callbackId++] = {success:listener};
		bizMOB.onFireMessage(v);
	};
	
	/* ********** Device ***************************************** */
	bizMOB.Device.prototype = new Object();
	
	bizMOB.Device.Info = {};
	
	bizMOB.Device.getinfo = function(key){
		var rtVal;
		if(key){
			rtVal = bizMOB.Device.Info[key];
		}else{
			rtVal = bizMOB.Device.Info;
		}
		return rtVal; 
	};
	
	bizMOB.Device.group = new Array();
	
	bizMOB.Device._addgroup = function(list, property ){
		
		var listlen = list.length;
		
		var templist = "";
		for(i=0;i<listlen;i++){
			templist += list[i]+",";
		}
		
		bizMOB.Device.group.push({
			"model_list" : templist,
			"property" : property
		}); 
		
	};
	
	bizMOB.Device.addphonegroup = function(list, property ){
		if(arguments.length < 1 || list.length < 1) return;
		
		if(property) property.device_type = "Phone";
		else property = {device_type : "Phone"};
		
		this._addgroup(list, property);
	};
	
	bizMOB.Device.addtabletgroup = function(list, property ){
		if(arguments.length < 1 || list.length < 1) return;
		
		if(property) property.device_type = "Tablet";
		else property = {device_type : "Tablet"};
		
		this._addgroup(list, property);
	};
	
	bizMOB.Device._requestinfo = function(callback){
		
		var v = {
				call_type:"js2app",
				id:"GET_DEVICEINFO",
				param:{
					callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
				}
			};
		bizMOB.callbacks[bizMOB.callbackId++] = {success:callback};
		bizMOB.onFireMessage(v);
		
	
	};
	
	bizMOB.Device._setinfo = function(DeviceInfo){
		
		DeviceInfo.app_version = DeviceInfo.app_major_version+"."+DeviceInfo.app_minor_version+"."+DeviceInfo.app_build_version+ "_" + DeviceInfo.content_major_version + "." + DeviceInfo.content_minor_version;
		$.extend(true, bizMOB.Device.Info, DeviceInfo);
		
		if(bizMOB.Device.group.length > 0){
			$.each(bizMOB.Device.group,function(index,value){
				if(value.model_list.indexOf(DeviceInfo.model) > -1){
					
					$.extend(bizMOB.Device.Info, value.property);
					return false;
				}
			});
		}
		
	};
	
	
	/* ********** Security ***************************************** */
	bizMOB.Security.prototype = new Object();
	
	/**
	 * bizMOB platform 사용자 인증
	 * 
	 * @function
	 * @memberOf		bizMOB.Security
	 * @param {Object}	options					{<br>
	 * 												userid: {String} 인증 받을 사용자 아이디, <br>
	 * 												password: {String}	인증 받은 사용자 패스워드, <br>
	 * 												trcode: {String}	레거시 로그인 인증 전문 코드, <br>
	 * 												message: {Object}	레거시 로그인 전문, <br>
	 * 												success: {function}	사용자 인증 성공 후 처리 함수<br>
	 * 											}
	 */
	bizMOB.Security.authorize = function(options) {
		
		var v = {
			call_type:"js2app",
			id:"AUTH",
			param:{
				auth_info:{user_id:"",password:""},
				legacy_trcode:"",
				legacy_message:{},
				message:{},
				callback:""
			}
		};
		
		v.param.auth_info.user_id = options.userid;
		v.param.auth_info.password = options.password;
		v.param.legacy_trcode = options.trcode;
		v.param.legacy_message = options.message;
		v.param.callback = 'bizMOB.callbacks['+bizMOB.callbackId+'].success';
		
		bizMOB.callbacks[bizMOB.callbackId++] = {success:options.success};
		bizMOB.onFireMessage(v);
	};
	
}());

function executeBatchSql(tx, query, bindingValues, success, error) {
	
	if(bindingValues.constructor != Array) {
		if(typeof error == 'function')
			error({code:"0",message:"잘못된 값을 바인딩하였습니다."});
		else if(typeof tx.error == 'function') 
			tx.error({code:"0",message:"잘못된 값을 바인딩하였습니다."});
		return;
	}
	
	if(bizMOB.detectAndroid()) {
		tx.executeBatchSql(query, bindingValues, success, error);
	} else {
		
		$.each(bindingValues, function(index, values) {
			if(bindingValues.length-1 == index) {
				tx.executeSql(query, values, success, error);
			} else {
				tx.executeSql(query, values, function() {}, function(err) {
					if(typeof error == 'function') 
						error(err);
					return false;
				});
			}
			
		});
	}
} 

var page = {
		init:function(){}
};
var configuration = {
		init:function(){},
		devicegroup:{}
};
function appcallOnLoad(json) {
	
	
	var stgVal = bizMOB.Storage.get("DeviceInfo");
	
	if(stgVal == "" || stgVal == undefined){
		
		bizMOB.Device._requestinfo(function(device_info){
			
			bizMOB.Storage.save("DeviceInfo", device_info);
			bizMOB.Device._setinfo(device_info);
			if(bizMOB.MultiLayout) bizMOB.MultiLayout.init(json); 
			configuration.init();
			page.init(json);
			
		});
		
	}else{
		
		bizMOB.Device._setinfo(stgVal);
		if(bizMOB.MultiLayout) bizMOB.MultiLayout.init(json);
		configuration.init();
		page.init(json);
	
	}

	
}

function appcallOnFocus(){}
function appcallOnCloseWeb(){}
function appcallOnSetApp(){}
function appcallOnDismissPopupView(){}
