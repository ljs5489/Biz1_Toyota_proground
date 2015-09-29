/**
 * @author vertex210@mcnc.co.kr 김영호
 */
(function()
{
	var parentOpenDialogFunc = parent.bizMOB.Ui.openDialog; 
	bizMOB.Ui.openDialog = function(url, options)
	{
		if(isNaN(options.height) && isNaN(options.width) ){
			
			options = $.extend(true, {
				base_size_orientation : "vertical",
				base_on_size : "device"
			}, options);
			
			var iWidPer = parseInt(options.width.replace(/\%/,""));
			var iHeiPer = parseInt(options.height.replace(/\%/,""));
			
			if(options.base_on_size == "page" && window!=window.parent){
				var fname = bizMOB.MultiLayout.frameName;
				var this_height = parent.frames[fname].innerHeight;
				var this_width = parent.frames[fname].innerWidth;
				this_height = this_height*(iHeiPer/100);
				this_width = this_width*(iWidPer/100);
				
				options.height = Math.ceil(this_height);
				options.width = Math.ceil(this_width);
				
			}
			
		}
		
		if(!options) options = {}; 
		if(bizMOB.MultiLayout.frameName)
		{
			options.message = $.extend(options.message, 
			{
				bizMOBLayout : 
				{
					opener : bizMOB.MultiLayout.frameName
				}
			});
		}
		parentOpenDialogFunc(url, options);
	};
	var parentCloseDialogFunc = parent.bizMOB.Ui.closeDialog; 
	bizMOB.Ui.closeDialog = function(message) 
	{
		var opener = bizMOB.MultiLayout.opener; 
		if(opener && message && message.callback) message.callback = "document." + opener + "." + message.callback;
		parentCloseDialogFunc(message);
	};
	
	var parentOpenFunc = parent.bizMOB.Web.open; 
	bizMOB.Web.open = function(key, options)
	{
		if(!options || !options.multiLayout)
		{
			return parentOpenFunc(key, options); 
		}
		bizMOB.MultiLayout.open(key, options);
	};
	var parentCloseFunc = parent.bizMOB.Web.close; 
	bizMOB.Web.close = function(message) 
	{
		if(bizMOB.MultiLayout.interruptClose && bizMOB.MultiLayout.interruptClose.targetCallback===message.callback)
		{
			var frameName = bizMOB.MultiLayout.interruptClose.throwFrame;
			var frame = window.parent.document[frameName];
			if(frame)
			{
				var callbackFunc = frame[message.callback];
				if(callbackFunc) callbackFunc(message.message);
			}
			else bizMOB._throwError("MultiLayout - bizMOB.Web.close : can't find interrupt frame. frameName : " + frameName);
		}
		else
		{
			if( message && message.callback) {
				var opener = bizMOB.MultiLayout.opener; 
				if(opener) message.callback = "document." + opener + "." + message.callback;
			}
			parentCloseFunc(message);
			
		}	
	};
	
	bizMOB.MultiLayout = new (function()
	{
		this.frameName = "";
		this.parent = "";
		this.broadcastMsgList = new Array();
		
		this.isPhone;
		this.callbacks = []; //최종 displayView 를 실행된 후 불러질 callback 목록 
		this.commandStack = []; //최종 displayView 를 실행된 후 실행된 command 목록 
		this.replaceStrings = {};
	})();
	bizMOB.MultiLayout.open = function(key, options)
	{
		var layouts = bizMOB.MultiLayout._readLayoutFile();
		var layout = bizMOB.MultiLayout.getLayout(layouts, key);
		if(!layout) bizMOB._throwError("MultiLayout - can't find multilayout info. key : " + key);
		var inherits = layout.inherit;
		if(inherits)
		{
			if(inherits.constructor === String) inherits = [inherits];
			if(inherits.constructor !== Array) bizMOB._throwError("MultiLayout - type error. inherit type : " + inherits.constructor + "\nkey : " + key);
			var inheritLayout={};
			inherits.forEach(function(value)
			{
				var inherit = layouts[value];
				if(!inherit) bizMOB._throwError("MultiLayout - type error. can't find inherit. inherit : " + inherit + "\nkey : " + key);
				$.extend(inheritLayout, inherit);
			});
			layout = $.extend(false, inheritLayout, layout);
		}
		
		layout = this._replaceSpecChars(layout, /{=(.+)}/g, bizMOB.MultiLayout.replaceStrings);		
		
		var html = layout.url; 
		var callType = layout.callType;
		switch(callType)
		{
			case "openPage" :
				$.extend(layout, { opener : bizMOB.MultiLayout.frameName });
				
				var frameCount = 0;
				for(key in layout.frames) frameCount++;
				$.extend(layout, { frameCount : frameCount });
				var message = $.extend(options.message, layout.message, 
				{
					bizMOBLayout : layout
				});
				options.message = message;
				delete options.multiLayout;
				parentOpenFunc(html, options); 
				break;
			case "notifyFrame" :
				var target = layout.target;
				if(!target) bizMOB._throwError("MultiLayout - reference error. target : " + target + "\nkey : " + key);
				var frame = parent.frames[target].document;
				var evt = frame.createEvent("Event");
				evt.initEvent("bizMOB.MultiLayout.onNotifyFrame", false, true);
				evt.data = options.message;
				frame.dispatchEvent(evt);

				break;
			case "openFrame" :
				bizMOB.MultiLayout.openFrame(
						$.extend(options.message, 
						{
							bizMOBLayout : layout
						})
					);
				break;
			default:
				bizMOB._throwError("MultiLayout - unknown callType. callType : " + callType + "\nkey : " + key);
		}
	};
	
	bizMOB.MultiLayout.addReplaceString = function(key, string)
	{
		this.replaceStrings[key] = string;
	};
	bizMOB.MultiLayout.broadcast = function(data)
	{
		var frames = $("iframe", window.parent.document);
		var isLoadMultiLayout=true;
		$("iframe", window.parent.document).each(function()
		{
			if(!$(this).attr("isLoadMultiLayout")) isLoadMultiLayout = false;
		});
		if(isLoadMultiLayout)
		{
			frames.each(function()
			{
				var frame = $(this)[0].contentDocument;
				if(frame!=document)
				{
					var evt = frame.createEvent("Event");
					evt.initEvent("bizMOB.MultiLayout.onBroadcast", false, true);
					evt.data = data;
					try{ frame.dispatchEvent(evt); } 
					catch(e) { bizMOB._warring("MultiLayout - " + e);}
				}
			});
		}
		else parent.bizMOB.MultiLayout._reservBroadcast(data);
	};
	bizMOB.MultiLayout._readLayoutFile = function()
	{
		var dataUrl;
		var data = {};
		var CURRENT_PATH = location.pathname;
		var MULTI_ROOT_PATH = CURRENT_PATH.substring(0,CURRENT_PATH.indexOf("/contents"))+"/contents/bizMOB/multilayout/layout/";
		
		// IS_PHONE = true;
		if(bizMOB.MultiLayout.isPhone) dataUrl = MULTI_ROOT_PATH+"layout_phone.json";
		else dataUrl = MULTI_ROOT_PATH+"layout_pad.json";
		$.ajax({
            type : "get",
			url: dataUrl, 
            dataType: "json",
			async : false,
            success: function(json) 
			{
				data = json;
			},
            error: function(e) 
            {
            	bizMOB._throwError("MultiLayout - load layout failed.(" + dataUrl + ") // [" + e.status + "]" + e.statusText);
            }
        });
		return data;
	};
	
	bizMOB.MultiLayout.getLayout = function(data, key)
	{
		var layout;
		//키가 존재할 경우
		if(data[key]) layout=data[key];
		else
		{
			layout = this._getLayoutByPattern(data, key);
		}
		return layout;
	};
	bizMOB.MultiLayout._getLayoutByPattern = function(data, key)
	{
		var layout=undefined;
		for(var dataKey in data)
		{
			var specChars = {};
			var specCharIndexs = [];
			 
			strRegExp = dataKey.replace(/{(\d+)}/g, function($1, $2)
			{ 
			  specCharIndexs.push($2);
			  return "(.+)";
			});
			//패턴형식 인경우
			if(specCharIndexs.length>0)
			{
				layout = data[dataKey]; 
				var regExp = eval("/" + strRegExp + "/");
				
				//key가 패턴에 만족하는지 검사
				var result = regExp.exec(key);
				if(result)
				{
					result = result.slice(1);
					result.forEach(function(value, i)
					{
						specChars[specCharIndexs[i]] = value;
					});
					
					layout = this._replaceSpecChars(layout, /{(\d+)}/g, specChars);
					break;
				}
				else layout = undefined;
			}
		}
		return layout;
	};
	bizMOB.MultiLayout._replaceSpecChars = function(layout, regExp, specChars)
	{
		function replaceUrl(url)
		{
			var lastReplaceChar, lastReplaceSpecChar;
			var result =  url.replace(regExp, function($1, $2)
			{
				lastReplaceChar = $1;
				lastReplaceSpecChar = specChars[$2];
				return lastReplaceSpecChar;  
				
				//var str = specChars[$2];
				/*
				if(!str) 
				{
					bizMOB._warning("MultiLayout - can't find charactors. key : " + $1);
					str = "";
				}
				*/
				//return str;
			});
			//문자열 전체를 다른 타입의 객체로 바꿀때(이 처리를 하지 않으면 문자열로만 변환됨)
			if(url === lastReplaceChar) return lastReplaceSpecChar;
			return result;
		}
		
		/*
		if(layout.url) layout.url = replaceUrl(layout.url);
		if(layout.frames)
		{
			for(var key in layout.frames)
			{
				layout.frames[key].url = replaceUrl(layout.frames[key].url);
			}
		}*/
		//_replaceSpecChars 내부 함수. 대상을 특정문자열(specChars)로 치환함.
		function replaceSpecChars(param)
		{
			var result;
			if(param!==undefined)
			{
				switch(param.constructor)
				{
					case Object :
						result = {};
						for(key in param)
						{
							result[key] = replaceSpecChars(param[key]);
						}
						break;
					case Array :
						result = [];
						for(var i=0;i<param.length;i++)
						{
							result[i] = replaceSpecChars(param[i]);
						}
						break;
					case String :
						result = replaceUrl(param);
						break;
					default :
						result = param;
						break;
				}
			}
			return result;
		};
		
		return replaceSpecChars(layout);
	};
	
	bizMOB.MultiLayout._reservBroadcast = function(data)
	{
		this.broadcastMsgList.push(data);
	};
	bizMOB.MultiLayout._broadcastReservs = function(data)
	{
		var that = this;
		this.broadcastMsgList.forEach(function(value)
		{
			that.broadcast(value);
		});
		this.broadcastMsgList = new Array();
	};
	
	bizMOB.MultiLayout.isFrame = function()
	{
		return window!=window.parent; 
	};
	bizMOB.MultiLayout.initFrame = function(frame)
	{
		var parent = window.parent;
		Object.prototype.constructor = parent.Object;
		Object = parent.Object;
		Array.prototype.constructor = parent.Array;
		Array = parent.Array;
		String.prototype.constructor = parent.String;
		String = parent.String;
		Number.prototype.constructor = parent.Number;
		Number = parent.Number;
		Boolean.prototype.constructor = parent.Boolean;
		Boolean = parent.Boolean;
		
		this.frameName = frame.name;
		if(frame.opener) this.opener = frame.opener;
		this.interruptClose = frame.interruptClose; 
		
		
		var frameName = this.frameName;
		var parentOnFireMessageFunc = parent.bizMOB.onFireMessage; 
		bizMOB.onFireMessage = function(message) 
		{
			if(message.id==="POPUP_MESSAGE_BOX")
			{
				for(var key in message.param.buttons)
				{
					var button = message.param.buttons[key];
					if(button.callback) button.callback = "window.parent.document." + frameName + "." + button.callback;
				}
			} else if(message.id==="UPLOAD_IMAGE_DATA")
			{
				message.param.success_callback="window.parent.document." + frameName + "." + message.param.success_callback; 
				message.param.error_callback="window.parent.document." + frameName + "." + message.param.error_callback;
			}
			else
			{
				var callback = message.param.callback;
				if(message.param && callback)
				{
					switch(message.id)
					{
						case "SHOW_WEB" :
						case "GOTO_WEB" :
							break;
						default :
							message.param.callback = "window.parent.document." + frameName + "." + callback;
							break; 
					}
					
				}
			}
			if(parent.bizMOB.MultiLayout.isRunCallback) parent.bizMOB.MultiLayout.commandStack.push(message);
			else parentOnFireMessageFunc(message);
		};
		bizMOB.Ui.displayView = function(layout, options)
		{
			bizMOB.MultiLayout.layout = layout;
			if(options && options.callback)
			{
				window.parent.bizMOB.MultiLayout.callbacks.push(options.callback);
			}
			$("iframe[name=" + bizMOB.MultiLayout.frameName + "]", window.parent.document).attr("isCallDisplayView", true);
			var isCallDisplayView=true;
			$("iframe", window.parent.document).each(function()
			{
				if(!$(this).attr("isCallDisplayView")) isCallDisplayView = false;
			});
			if(isCallDisplayView)
			{
				window.parent.bizMOB.MultiLayout.displayView();
			}
		};
		bizMOB.Storage.save = function(key, value) {
			window.parent.bizMOB.Storage.save(key, value);
		};
		bizMOB.Storage.get = function(key) {
			return window.parent.bizMOB.Storage.get(key);
		};
		
		
		
		var that = this;
		// window.parent.addEventListener('onorientationchange' in window.parent ? 'orientationchange' : 'resize', function() { 
		    // console.log('HOLY ROTATING SCREENS BATMAN:' + window.parent.orientation + " // " + JSON.stringify(screen) + " // " + window.parent.innerHeight); 
		// }, false); 

		$(window.parent).bind('onorientationchange' in window.parent ? 'orientationchange' : 'resize', function(){ setTimeout(that.resetFrameHeight, 500); });
		that.resetFrameHeight();
	};
	bizMOB.MultiLayout.resetFrameHeight = function()
	{
		$(document.body).css("height", $(window.parent).height());
	};
	bizMOB.MultiLayout.openPage = function(json)
	{
		var opener = json.bizMOBLayout.opener;
		var views = json.bizMOBLayout.frames;
		bizMOB.MultiLayout.opener = opener;
		var message = {};
		for(key in json) 
		{
			if(key!="bizMOBLayout") message[key] = json[key];
		}
		for(name in views)
		{
			var url = views[name].url;
			var frame = document[name];
			if(!frame) bizMOB._throwError("MultiLayout - can't find frame. frame name: " + name);
			var param = views[name].message ? $.extend(views[name].message,message) : message;
			param.bizMOBFrame = { name : name, opener : opener, interruptClose : views[name].interruptClose};
			$("iframe[name=" + name +"]").attr("src","../../" + url +"?message=" + JSON.stringify(param));
		}
	};
	bizMOB.MultiLayout.openFrame = function(json)
	{
		var opener = json.bizMOBLayout.opener;
		var views = json.bizMOBLayout.frames;
		if(!views) bizMOB._throwError("MultiLayout - reference error. frame : " + views);
		var message = {};
		for(key in json) 
		{
			if(key!="bizMOBLayout") message[key] = json[key];
		}
		
		for(name in views)
		{
			var url = views[name].url;
			var frame = parent.frames[name];
			if(!frame) bizMOB._throwError("MultiLayout - can't find frame. frame name: " + name);
			var param = views[name].message ? $.extend(views[name].message,message) : message;
			param.bizMOBFrame = { name : name, opener : opener, interruptClose : views[name].interruptClose};
			var page = "../../" + url +"?message=" + JSON.stringify(param);
			frame.location.replace(page);
		}
	}; 
	var parentDisplayViewFunc = bizMOB.Ui.displayView;
	bizMOB.MultiLayout.displayView = function(json)
	{
		var pageLayout = new bizMOB.Ui.PageLayout();
		
		//bizMOB.MultiLayout.displayView 내부함수
		function rebuildBarInfo(bar, strTarget)
		{
			var result;
			if(bar)
			{
				result = {};
				
				if(bar.background) 
				{
					bar.image_name = bar.background;
					delete bar.background;
				}
				
				for(key in bar)
				{
					//replaceString 설정
					/*
					var replaceStrings = {};
					$("iframe", window.parent.document).each(function(value)
					{
						var frameName = this.name;
						var data = this.contentWindow.bizMOB.MultiLayout.layout[strTarget][key];
						if(data)
						{
							switch(data.constructor)
							{
								case Array :
									data.forEach(function(value, index)
									{
										replaceStrings[frameName + "." + index] = value;
									});
									break;
								case String :
									replaceStrings[frameName] = this.contentWindow.bizMOB.MultiLayout.layout[strTarget][key];
									break;
							}
							
						}
					});
					*/
					
					//치환
					//재귀를 위한 내부함수
					function replaceBarSpecChars(data ,key)
					{
						var replaceResult = undefined;
						switch(data.constructor)
						{
							case Array :
								replaceResult = [];
								data.forEach(function(value)
								{
									var result = replaceBarSpecChars(value, key);
									if(result) replaceResult.push(result);
								});
								break;
							case String :
								var lastReplaceString=undefined, lastReplaceSpecObj=undefined;
								
								var frameName, frame, index, targetLayout; 
								var replaceResult = data.replace(/\{(.*)\}/g, function($1, $2)
								{
									lastReplaceString = $1;
									var split = $2.split(".");
									if(split.length===2) index = split[1];
									frameName = split[0];
									frame = window.parent.document[frameName]; 
									if(frame) targetLayout = frame.bizMOB.MultiLayout.layout[strTarget]; 
									if(targetLayout && targetLayout[key])
									{
										if(index!=undefined)
										{
											lastReplaceSpecObj = targetLayout[key][index]; 
											return lastReplaceSpecObj;
										}
										else 
										{
											lastReplaceSpecObj = targetLayout[key]; 
											return lastReplaceSpecObj;
										}
									}
									else return;
									//lastReplaceSpecObj = replaceStrings[$2];
									//return lastReplaceSpecObj;
								});
								
								if(data === lastReplaceString) replaceResult = lastReplaceSpecObj;
								if(replaceResult!=undefined)
								{
									if(replaceResult.action_type=="jscall")
									{
										var btn = JSON.parse(JSON.stringify(replaceResult));
										btn.action = "document." + frameName + "." + btn.action;
										return btn;
										/*
										var button = frame.bizMOB.MultiLayout.layout[strTarget][key][index];
										if(button)
										{
											var btn = new bizMOB.Ui.Button();
											$.extend(btn, frameToolbar.buttons[index]);
											if(btn.action_type=="jscall") btn.action = "document." + frameName + "." + btn.action; 
											toolbar.buttons.push(btn);
										}
										 */
									}
									else if(replaceResult.action_type==="popup")
									{
										var btn = JSON.parse(JSON.stringify(replaceResult));
										for(var i=0;btn.context.length>i;i++)
										{
											for(var j=0;btn.context[i].length>j;j++)
											{
												
												btn.context[i][j].action = "document." + frameName + "." + btn.context[i][j].action;
											}
										}	
										return btn;
									}
								}
								return replaceResult;
								
								/*
								if(data === lastReplaceString) 
								{
									replaceResult = lastReplaceSpecObj;
								}
								
								if(lastReplaceSpecObj.constructor === bizMOB.Ui.Button)
								{
									var frameName = lastReplaceSpecObj;
									var frame = window.parent.document[lastReplaceSpecObj];
									if(frame)
									{
										var frameBar = frame.bizMOB.MultiLayout.layout[strTarget][key];
										if(frameBar.buttons[index])
										{
											var btn = new bizMOB.Ui.Button();
											$.extend(btn, frameToolbar.buttons[index]);
											if(btn.action_type=="jscall") btn.action = "document." + frameName + "." + btn.action; 
											toolbar.buttons.push(btn);
										}
									}
									
								}
								*/
								//result[key] = bizMOB.MultiLayout._replaceSpecChars(data, /\{(.*)\}/g, replaceStrings);
								break;
							default : 
								replaceResult = data;	
						}
						return replaceResult;
					}
					result[key] = replaceBarSpecChars(bar[key], key); 
				}
				
				/*
				result.forEach(function(value)
				{
					value = value.replace(/\{(.*)\}/g,function($1)
					{
						$1 = $1.substring(1, $1.length-1);
						
						var split = $1.split(".");
						if(split.length==2)
						{
							var frameName = split[0];
							var index = split[1];
							var frame = window.parent.document[frameName];
							if(frame)
							{
								var frameToolbar = frame.bizMOB.MultiLayout.layout.toolbar;
								if(frameToolbar.buttons[index])
								{
									var btn = new bizMOB.Ui.Button();
									$.extend(btn, frameToolbar.buttons[index]);
									if(btn.action_type=="jscall") btn.action = "document." + frameName + "." + btn.action; 
									toolbar.buttons.push(btn);
								}
							}
							
							return "";
						}
						else return "";
					});
				});
				toolbar.setBackGroundImage(bizMOB.MultiLayout.toolbar.background);
				toolbar.setVisible(bizMOB.MultiLayout.toolbar.visible);
				*/
				
				return result;
			}
		}
		var titlebar = rebuildBarInfo(bizMOB.MultiLayout.titlebar, "titlebar");
		var bottomToolbar = rebuildBarInfo(bizMOB.MultiLayout.bottom_toolbar, "bottom_toolbar");
		var leftToolbar = rebuildBarInfo(bizMOB.MultiLayout.left_toolbar, "bottom_toolbar");
		var rightToolbar = rebuildBarInfo(bizMOB.MultiLayout.right_toolbar, "bottom_toolbar");
		
		pageLayout.setTitleBar(titlebar);
		pageLayout.setBottomToolbar(bottomToolbar);
		pageLayout.setLeftToolbar(leftToolbar);
		pageLayout.setRightToolbar(rightToolbar);
		parentDisplayViewFunc(pageLayout, 
		{
			callback : function()
			{
				bizMOB.MultiLayout.isRunCallback = true;
				bizMOB.MultiLayout.callbacks.forEach(function(value)
				{
					eval(value)();
				});
				bizMOB.MultiLayout.callbacks = [];
				bizMOB.MultiLayout.isRunCallback = false;
				
				//커맨드처리를 위한 재귀함수
				function runCommand()
				{
					var cmd = undefined;
					
					if(bizMOB.MultiLayout.commandStack.length>0)
					{
						//쌓아둔 커맨드목록 중 첫번째 항목 선택
						cmd = bizMOB.MultiLayout.commandStack[0];
						bizMOB.MultiLayout.commandStack = bizMOB.MultiLayout.commandStack.splice(1);
						if(cmd.param && cmd.param.callback) // 콜백이 있는경우
						{
							var oriCallback = cmd.param.callback;
							var filterCallback = function()
							{
								bizMOB.MultiLayout.isRunCallback = true;
								var func = eval(oriCallback);
								func.apply(func, Array.prototype.slice.call(arguments, 0));
								bizMOB.MultiLayout.isRunCallback = false;
								runCommand();
							}
							cmd.param.callback = 'bizMOB.callbacks['+bizMOB.callbackId+'].success';
							bizMOB.callbacks[bizMOB.callbackId++] = {success:filterCallback};
							bizMOB.onFireMessage(cmd); // 실행
						}
						else bizMOB.onFireMessage(cmd);
					}
				};
				runCommand();
			}
		});
		
		/*
		//title 설정
		bizMOB.MultiLayout.titlebar.title.replace(/\{(.*)\}/g,function($1)
		{
			$1 = $1.substring(1, $1.length-1);
			var frameName = $1;
			var frame = window.parent.document[frameName];
			if(frame)
			{
				var frameTitleBar = frame.bizMOB.MultiLayout.layout.titlebar;
				titlebar.title = frameTitleBar.title;
			}
			return $1;
		});
		//titlebar의 left 설정
		if(bizMOB.MultiLayout.titlebar.left)
		{
			bizMOB.MultiLayout.titlebar.left.replace(/\{(.*)\}/g,function($1)
			{
				$1 = $1.substring(1, $1.length-1);
				var frameName = $1;
				var frame = window.parent.document[frameName];
				if(frame)
				{
					var frameTitleBar = frame.bizMOB.MultiLayout.layout.titlebar;
					if(frameTitleBar.left)
					{
						var btn = new bizMOB.Ui.Button();
						$.extend(btn, frameTitleBar.left);
						btn.action = "document." + frameName + "." + btn.action; 
						titlebar.setTopLeft(btn);
					}
				}
				return $1;
			});
		}
		//titlebar의 right 설정
		if(bizMOB.MultiLayout.titlebar.right)
		{
			bizMOB.MultiLayout.titlebar.right.replace(/\{(.*)\}/g,function($1)
			{
				$1 = $1.substring(1, $1.length-1);
				var frameName = $1;
				var frame = window.parent.document[frameName];
				if(frame)
				{
					var frameTitleBar = frame.bizMOB.MultiLayout.layout.titlebar;
					if(frameTitleBar.right)
					{
						var btn = new bizMOB.Ui.Button();
						$.extend(btn, frameTitleBar.right);
						if(btn.action_type=="jscall") btn.action = "document." + frameName + "." + btn.action; 
						titlebar.setTopRight(btn);
					}
				}
				
				return $1;
			});
		}
		titlebar.setBackGroundImage(bizMOB.MultiLayout.titlebar.background);
		titlebar.setVisible(bizMOB.MultiLayout.titlebar.visible);
		
		
		var toolbar = new bizMOB.Ui.ToolBar();
		//toolbar button 설정
		bizMOB.MultiLayout.toolbar.buttons.forEach(function(value)
		{
			value = value.replace(/\{(.*)\}/g,function($1)
			{
				$1 = $1.substring(1, $1.length-1);
				
				var split = $1.split(".");
				if(split.length==2)
				{
					var frameName = split[0];
					var index = split[1];
					var frame = window.parent.document[frameName];
					if(frame)
					{
						var frameToolbar = frame.bizMOB.MultiLayout.layout.toolbar;
						if(frameToolbar.buttons[index])
						{
							var btn = new bizMOB.Ui.Button();
							$.extend(btn, frameToolbar.buttons[index]);
							if(btn.action_type=="jscall") btn.action = "document." + frameName + "." + btn.action; 
							toolbar.buttons.push(btn);
						}
					}
					
					return "";
				}
				else return "";
			});
		});
		toolbar.setBackGroundImage(bizMOB.MultiLayout.toolbar.background);
		toolbar.setVisible(bizMOB.MultiLayout.toolbar.visible);
		
		
		
		
		toolbar.left = 
		[
            {
                "control_id": "MHBarButton",
                "item_id": 1,
                "button_text": "홈",
                "image_name": "app/images/android/toolbar/tbb_home.png",
                "action_type": "appfunc",
                "action": "APP_FUNC_GOTO_HOME"
            },
            {
                "control_id": "MHBarButton",
                "item_id": 3,
                "button_text": "",
                "image_name": "",
                "action_type": "",
                "action": ""
            },
            {
                "control_id": "MHBarButton",
                "item_id": 4,
                "button_text": "",
                "image_name": "",
                "action_type": "",
                "action": ""
            },
            {
                "control_id": "MHBarButton",
                "item_id": 5,
                "button_text": "",
                "image_name": "",
                "action_type": "",
                "action": ""
            }
		];
		toolbar.right = 
		[
            {
                "control_id": "MHBarButton",
                "item_id": 15,
                "button_text": "삭제",
                "image_name": "app/images/android/toolbar/tbb_del.png",
                "action_type": "jscall",
                "action": "document.contents.bizMOB.callbacks[7].success"
            },
            {
                "control_id": "MHBarButton",
                "item_id": 16,
                "button_text": "메일쓰기",
                "image_name": "app/images/android/toolbar/tbb_mail_write.png",
                "action_type": "jscall",
                "action": "document.contents.bizMOB.callbacks[8].success"
            },
            {
                "control_id": "MHBarButton",
                "item_id": 17,
                "button_text": "",
                "image_name": "",
                "action_type": "",
                "action": ""
            }
		];
		
		pageLayout.setTitleBar(titlebar);
		pageLayout.setToolbar(toolbar);
		parentDisplayViewFunc(pageLayout);
		*/
	};
	window.page = 
	{
		init : function(json)
		{
			
		}
	};
	
	bizMOB.MultiLayout.init = function(json)
	{
		var layout = json ? json.bizMOBLayout : undefined;
		bizMOB.MultiLayout.isPhone = bizMOB.detectPhone();
		//alert("page.init - location.href : " + location.href);
		//alert("page.init - layout : " + JSON.stringify(layout));
		if(layout)
		{
			//alert("page.init - callType : " + layout.callType);
			if(layout.opener) bizMOB.MultiLayout.opener = layout.opener;
			$.extend(bizMOB.MultiLayout, layout);
			if(layout.callType)	bizMOB.MultiLayout[layout.callType].call(bizMOB.MultiLayout, json);
			delete json.bizMOBLayout;
		}
	};
	$(document).ready(function()
	{
		//alert("document ready - isFrame : " + bizMOB.MultiLayout.isFrame());
		if(bizMOB.MultiLayout.isFrame()) 
		{
			var param = location.href.split("?message=");
			if(param.length>1)
			{
				param = param[1]; 
				param = jQuery.parseJSON(decodeURIComponent(param));
			}
			else param = {};
			//alert(location.href);
			bizMOB.MultiLayout.initFrame(param.bizMOBFrame);
			delete param.bizMOBFrame;
			appcallOnLoad(param);	
			
			
			$("iframe[name=" + bizMOB.MultiLayout.frameName + "]", window.parent.document).attr("isLoadMultiLayout", true);
			var isLoadMultiLayout=true;
			$("iframe", window.parent.document).each(function()
			{
				if(!$(this).attr("isLoadMultiLayout")) isLoadMultiLayout = false;
			});
			if(isLoadMultiLayout) window.parent.bizMOB.MultiLayout._broadcastReservs();
			
		} 
	});
})();
