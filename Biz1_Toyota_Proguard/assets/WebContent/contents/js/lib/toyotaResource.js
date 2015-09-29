/**
 * toyotaResource
 * (Titlebar, Toolbar 등)
 */


(function($, undefined)
{
	/**
	 * ToyotaResource 클래스
	 * @class ToyotaResource Class
	 * @name ToyotaResource
	 */
	function ToyotaResource(){};
	
	ToyotaResource.prototype = {
			
			/**
			 * 공통 titlebar 가져오기
			 * parameter : title text(string)
			 * return 	 : bizMOB.Ui.TitleBar
			 */
			getCommonTitleBar : function(title) {
				
				var deviceInfo = bizMOB.Device.getinfo();
				var menuBoxWidth = (deviceInfo.screen_width)+"";
				var menuBoxHeight = (deviceInfo.screen_height*0.2)+"";
				
				var titlebar = new bizMOB.Ui.TitleBar(title);
				titlebar.setBackGroundImage("images/app/titlebar/bg_titlebar.png");
				var menuBtn = new toyotaBizMOB.Ui.balloonMenuButton({
			        button_text : "메뉴", 
			        image_name : "images/app/titlebar/btn_menu.png", 
			        listener : function(){},
			        target_page : "TFSMES0/html/TFSMES006.html",
			        width : menuBoxWidth, //600
			        height : menuBoxHeight //200
				});
				titlebar.setTopLeft(menuBtn);
				//titlebar.setTopRight(bizMOB.Ui.createHomeButton(""));
				
				return titlebar;
			},
			
			/**
			 * 공통 toolbar 가져오기(이전 버튼 미포함)
			 * parameter : 
			 * return 	 : bizMOB.Ui.ToolBar
			 */
			getCommonDefaultToolBar : function() {
				
				var toolbar = new bizMOB.Ui.ToolBar();
				toolbar.setBackGroundImage("images/app/toolbar/bg_toolbar.png");
				var toolbarBtns = new Array();
				var btnBottom1 = bizMOB.Ui.createHomeButton("images/app/toolbar/btn_menu1.png");

				var btnBottom2 = bizMOB.Ui.createButton({
					button_text : "",
					image_name : "",
					listener : function() {}
				});

				var btnBottom3 = bizMOB.Ui.createButton({
					button_text : "",
					image_name : "",
					listener : function() {}
				});
				
				var btnBottom4 = bizMOB.Ui.createButton({
					button_text : "",
					image_name : "",
					listener : function() {}
				});
				
				var btnBottom5 = bizMOB.Ui.createButton({
					button_text : "설정", 
					image_name : "images/app/toolbar/btn_menu4.png",
					listener : function() {
						bizMOB.Web.open("TFSMES0/html/TFSMES005.html", {
							modal : false,
							replace : false,
							message : {}
						});
					}
				});
				toolbarBtns.push(btnBottom1);
				toolbarBtns.push(btnBottom2);
				toolbarBtns.push(btnBottom3);
				toolbarBtns.push(btnBottom4);
				toolbarBtns.push(btnBottom5);
				toolbar.setButtons(toolbarBtns);
				
				return toolbar;
			},
			
			/**
			 * 공통 toolbar 가져오기(이전 버튼 포함)
			 * parameter : 
			 * return 	 : bizMOB.Ui.ToolBar
			 */
			getCommonToolBar : function() {
				
				var toolbar = new bizMOB.Ui.ToolBar();
				toolbar.setBackGroundImage("images/app/toolbar/bg_toolbar.png");
				var toolbarBtns = new Array();
				var btnBottom1 = bizMOB.Ui.createHomeButton("images/app/toolbar/btn_menu1.png");

				var btnBottom2 = bizMOB.Ui.createButton({
					button_text : "이전", 
					image_name : "images/app/toolbar/btn_menu2.png",
					listener : function() {
						bizMOB.Web.close({});
					}
				});

				var btnBottom3 = bizMOB.Ui.createButton({
					button_text : "",
					image_name : "",
					listener : function() {}
				});
				
				var btnBottom4 = bizMOB.Ui.createButton({
					button_text : "",
					image_name : "",
					listener : function() {}
				});
				
				var btnBottom5 = bizMOB.Ui.createButton({
					button_text : "설정", 
					image_name : "images/app/toolbar/btn_menu4.png",
					listener : function() {
						bizMOB.Web.open("TFSMES0/html/TFSMES005.html", {
							modal : false,
							replace : false,
							message : {}
						});
					}
				});
				toolbarBtns.push(btnBottom1);
				toolbarBtns.push(btnBottom2);
				toolbarBtns.push(btnBottom3);
				toolbarBtns.push(btnBottom4);
				toolbarBtns.push(btnBottom5);
				toolbar.setButtons(toolbarBtns);
				
				return toolbar;
			}
			
	};
	
	
	/**
	 * ToyotaResource Class 인스턴스
	 * @static
	 * @name toyotaResource
	 * @see ToyotaResource
	 */
	window.toyotaResource = new ToyotaResource();
})(jQuery, undefined);

