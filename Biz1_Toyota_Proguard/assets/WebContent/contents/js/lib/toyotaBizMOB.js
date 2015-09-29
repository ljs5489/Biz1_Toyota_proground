/**
 * toyotaBizMOB
 */

(function($, undefined)
{
	/**
	 * @static
	 * @class toyota 전용 bizMOB 확장 class(public) 
	 * @name toyotaBizMOB
	 */
	window.toyotaBizMOB = {};
	
	/**
	 * ToyotaBizMOBUi 클래스
	 * @class ToyotaBizMOBUi Class
	 * @extends bizMOB.Ui
	 * @name ToyotaBizMOBUi
	 */
	function ToyotaBizMOBUi(){};
	ToyotaBizMOBUi.prototype = new bizMOB.Ui();
	
	/**
	 * ToyotaBizMOBNative 클래스
	 * @class ToyotaBizMOBNative Class
	 * @extends bizMOB.Native
	 * @name ToyotaBizMOBNative
	 */
	function ToyotaBizMOBNative(){};
	ToyotaBizMOBNative.prototype = new bizMOB.Native();
	
	
	ToyotaBizMOBUi.prototype.balloonMenuButton = function(options) {
        var p = $.extend(true, {
            control_id:"PopupMenuButton",
            button_text:"",
            image_name:"",
            action_type:"",
            action:'',
            target_page : "",
            width : "",
            height : ""
        }, options);

        if(typeof options.listener == 'function') {
           p.action_type = "jscall";
           p.action = 'bizMOB.callbacks['+bizMOB.callbackId+'].success';

           bizMOB.callbacks[bizMOB.callbackId++] = {success:options.listener};
        }
        
        var b = new toyotaBizMOB.Ui.MenuButton(p);

        return b;
	};
	
	ToyotaBizMOBUi.prototype.MenuButton = function(options) {
		
        var p = $.extend(true,{
           control_id:"MHBarButton",
           item_id:0,
           button_text:"",
           image_name:"",
           action_type:"jscall",
           action:"",
           target_page : "",
           height : "",
           width : ""
        },options);

        this.control_id = p.control_id;
        this.item_id = bizMOB.buttonId++;
        this.button_text = p.button_text;
        this.image_name = p.image_name;
        this.action_type = p.action_type;
        this.action = p.action;
        this.target_page = p.target_page;
        this.height = p.height;
        this.width = p.width;
	};
	
	/**
	 * ToyotaBizMOBUi Class 인스턴스
	 * @static
	 * @name toyotaBizMOB.Ui
	 * @see ToyotaBizMOBUi
	 */
	window.toyotaBizMOB.Ui = new ToyotaBizMOBUi();
	
	/**
	 * 외부브라우저 연동
	 * @param {String} options(target_page, title)
	 */
	ToyotaBizMOBNative.prototype.openBrowser = function(options, callback)
	{
		var v = {
		        call_type:"js2app",
		        id:"SHOW_INTERNAL_BROWSER",
		        param:{
		             target_page : options.target_page,
		             title : options.title,
		             callback:'bizMOB.callbacks['+bizMOB.callbackId+'].success'
		        }
		};

		bizMOB.callbacks[bizMOB.callbackId++] = {success:callback};
		bizMOB.onFireMessage(v);
	};
	
	/**
	 * ToyotaBizMOBNative Class 인스턴스
	 * @static
	 * @name toyotaBizMOB.Native
	 * @see ToyotaBizMOBNative
	 */
	window.toyotaBizMOB.Native = new ToyotaBizMOBNative();
	
})(jQuery, undefined);

//Android Widget에서 app을 실행했을 경우 호출되는 함수
function callback_web(json) {
	
	//var isLogin = bizMOB.Storage.get("isLogin");
	//bizMOB.Storage.save("isLoginedFirstTimeFromWidget", isLogin);
	
	if(json.page_id == "TFSMES201"){
		bizMOB.Web.open("TFSMES2/html/TFSMES201.html", {
			modal : true,
			replace : false,
			message : {
				//fromWidget : true
			}
		});
	}
	/*if(json.type == "1"){
		
		if(isLogin){
			if(json.page_id == "point"){
				bizMOB.Web.open("Account/html/Points.html", {
					modal : true,
					replace : false,
					message : {
						fromWidget : true
					}
				});
			}else if(json.page_id == "purchase"){
				bizMOB.Web.open("Account/html/PurchaseList.html", {
					modal : true,
					replace : false,
					message : {
						fromWidget : true
					}
				});
			}
		}else {
			if(json.page_id == "point"){
				toyotaBizMOB.Widget.targetPageUrl = "Account/html/Points.html";
			}else if(json.page_id == "purchase"){
				toyotaBizMOB.Widget.targetPageUrl = "Account/html/PurchaseList.html";
			}
		}
		
	}*/
}
