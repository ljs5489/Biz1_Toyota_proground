
/**
 * 유틸리티 메소드를 제공하는 클래스
 * 
 * @class 유틸리티 메소드 클래스
 */
var bizMOB = {};
bizMOB.Util= function() {};

(function() {
	
	
	bizMOB._throwError = function(e)
	{
		console.error("bizMOB error : " + e);
		console.trace();
		throw("throw - bizMOB error. stop process");
	};
	bizMOB._warning = function(e)
	{
		if(!window.emulator && bizMOB.detectIOS())
		{
			console.log("bizMOB warning: " + e);
		}
		else
		{
			console.warn("bizMOB warning: " + e);
			console.trace();
		}
	};
	
	
	function bizMOBRender()
	{ 
		this.options = {};
		this.template = undefined;
	};
	$.extend(bizMOBRender.prototype, 
	{
		defaultOptions : 
		{
			clone : false, // 대상을 복사한 후 render 
			newId : "renderList", // 복사한 대상의 새로운 ID. clone이 true 일 때만 동작함 
			replace : true // true=기존 요소 대체. false=기존 요소에 추가 
		},
		TYPE_SINGLE : "single",
		TYPE_LOOP : "loop",
		instances : {},
		_getInstance:function(key)
		{
			if(!this.instances[key]) this.instances[key] = new this.constructor();
			return this.instances[key];
		},
		execute:function(target, options)
		{
			if(options)
			{
				switch(options.constructor)
				{
					case Object :
					case Array :
						this.render.apply(this, arguments);
						break;
					case String :
						this[options].apply(this, arguments);
						break;
				}
			}
		},
		addLoopElement:function(parent, target, value, detail)
		{
			var that = this;
			var template = $(target, parent).size()>1 ? $(target, that.template) : $(target, parent);
			if(template.size()==0) bizMOB._warning("bizMOBRender - invalid taret selector. target selector : " + target);
			$.each(value, function(index, element)
			{
				var target = template.clone();
				that.parseDir(target, this, detail, {index : index}).appendTo(template.parent());
			});
			template.remove();
			return parent;
		},
		addSingleElement:function(parent, target, valueType, value)
		{
			var that=this, realValue;
			realValue = value;
		
			//target의 마지막 값 저장
			var method = target.length > 0 ? target.substr(target.length-1, 1) : "";
			if(method=="+")
			{
				target = target.substring(0, target.length-1);
			}
			else method = "";
			
			var targetSplit = target.split("@");
			if (targetSplit.length < 3) 
			{
				
				var element;
				try { element = targetSplit[0] && targetSplit[0] != "."? $(targetSplit[0], parent) : $(parent); }
				catch (e)
				{
					bizMOB._warning("bizMOBRender - invalid taret selector. target selector : " + target);
					return;
				}
				if(element.size()==0) bizMOB._warning("bizMOBRender - target is empty. target : " + targetSplit[0]);  
				if (targetSplit.length == 2) 
				{
					if(!targetSplit[1]) 
					{
						bizMOB._warning("bizMOBRender - attr is null. attr : " + targetSplit[1] + "\ntarget :" + target);
						return;
					}
					switch (method)
					{
						case "+":
							if(element.attr(targetSplit[1])) realValue = element.attr(targetSplit[1]) + realValue; 
							break;
					}
					if(realValue && (realValue.constructor == Object || realValue.constructor == Array) ) element.data(targetSplit[1], realValue);  
					else element.attr(targetSplit[1], realValue);
				}
				else 
				{
					switch (method)
					{
						case "+":
							element[valueType](element.text() + realValue);
							break;
						default:
							element[valueType](realValue);
							break;
					}
				}
			}
			else {bizMOB._warning("bizMOBRender - syntax error. target : " + target + "(value : " + value + ")"); }
			return parent;
		},
		parseDir:function(parent, data, paths,options)
		{
			var that = this;
			$.each(paths, function(index,element)
			{
				if(!this.target) {bizMOB._warning("bizMOBRender - reference error. target : " + this.target + "(value : " + this.value + ")");}
				else if(!this.value) {bizMOB._warning("bizMOBRender - reference error. value : " + this.value + "(target : " + this.target + ")");}
				var valueType = this.valueType ? this.valueType : "text";
				var realValue;
				if (this.value.constructor == Function) 
				{
					var param =
					{
						context : that.data,
						item : data
					};
					if(options) param.index = options.index;
					realValue = this.value.apply(that, [param]);
					if(realValue==undefined) realValue = "";
				}
				else if(this.value==".") realValue = data;
				else 
				{
					realValue = eval("data." + this.value);
					if(realValue==undefined) bizMOB._warning("bizMOBRender - invalid value. value : " + this.value);
				}
				
				switch(this.type)
				{
					case that.TYPE_SINGLE :
						if(this.value==undefined) {bizMOB._warning("bizMOBRender - reference error. value : " + this.value + "(target : " + this.target + ")");}
						that.addSingleElement(parent, this.target, valueType, realValue);
						break;
					case that.TYPE_LOOP :
						if(this.detail==undefined) {bizMOB._warning("bizMOBRender - reference error. detail : " + this.detail + "(value :" + this.value + ")");}
						that.addLoopElement(parent, this.target, realValue, this.detail);
						break;
					default :
						bizMOB._warning("bizMOBRender - unknown type. type : " + this.type);
				}
			});
			return parent;
		},
		render:function(root, data, dir, options)
		{
			if(data==undefined ) { bizMOB._throwError("bizMOBRender - reference error. data : " + data);}
			if(data.constructor != Object && data.constructor != Array) {bizMOB._throwError("bizMOBRender - type error. data type : " + data.constructor);}
			if(dir==undefined) { bizMOB._throwError("bizMOBRender - reference error. dir : " + dir); }
			if(dir.constructor != Array) {bizMOB._throwError("bizMOBRender - type error. dir type : " + dir.constructor);}
			
			var that = this;
			that.data = data;
			that.template = root;
			that.options = $.extend(false, that.defaultOptions, options);
			
			var target;
			if(that.options.clone) target = root.clone();
			else target = root;	
			that.parseDir(target, data, dir);
				
			if(that.options.clone)
			{
				var newId = that.options.newId;
				var newBox = $("#" + newId);
				if(that.options.replace)
				{
					if(newBox.size()!=0) { newBox.empty();} 
				}
				if(newBox.size()>0 && newBox.parent().size()>0) newBox.append(target.children()); 
				else newBox = target.attr("id", newId).insertAfter(root);
			}
			target.show();
		},
		setDefaults:function(options)
		{
			$.extend(this.defaultOptions, options);
		}
	});
	bizMOB.Util.Render = new bizMOBRender();
	
	
	function bizMOBNumber(){};
	$.extend(bizMOBNumber.prototype,
	{
		defaultOptions : 
		{
			"toNumber_digits" : undefined,
			"toNumber_default" : 0
		},
		/**
		 * 숫자로 변환
		 * 정수 및 소수 지원
		 * @param {String || Number} value 변환할 값
		 * @returns {String}
		 */
		toNumber:function(value, options)
		{
			
			var newOptions = {}; 
			for(key in options)
			{
				if(options.hasOwnProperty(key)) newOptions["toNumber_" + key] = options[key];
			}
			options = $.extend(false, this.defaultOptions, newOptions);
			var defaultNum = options["toNumber_default"];
		
			if(value == undefined || value == "") return defaultNum;
			if(value.constructor!=String && value.constructor!=Number) bizMOB._throwError("bizMOBNumber - type error. value type : " + value.constructor);
			
			switch(value.constructor)
			{
				case Number :
					return value;
				case String :
					break;
				default :
					return defaultNum;
			}
			
			var num;
			var sign="";
			var decimal="";
			var numSplit = value.split(".");
			if(numSplit.length == 2) 
			{
				num = numSplit[0];
				decimal = numSplit[1];
			}
			else num = value;
			
			if(num.length>1) 
			{
				sign = num.substring(0,1);
				if(sign!="-" && sign!="+") sign="";
				else num=num.substring(1,num.length);
			}  
			
			num = num.replace(/[^0-9]/gi, "");
			if(decimal == undefined) decimal = ""; 
			decimal = decimal.replace(/[^0-9]/gi, "");
			
			if(decimal!="") num = [num, decimal].join(".");
			num = Number(sign+num);
			
			for(key in options)
			{
				if(options.hasOwnProperty(key))
				{
					switch(key)
					{
					case "toNumber_digits" :
						var digits = options[key];
						
						if (digits >= 0) num = parseFloat(num.toFixed(digits)); // 소수부 반올림
						else
						{
							var fixdigits = Math.pow(10, Math.abs(digits));
							digits = Math.pow(10, digits); // 정수부 반올림
							num = Number(Math.round(num * digits).toFixed(0))*fixdigits;
						}
						break;
					}
				}
			}
			return num;
		},
		toKor:function(value)
		{
			if(value==undefined) return "";
			if(value.constructor!=String && value.constructor!=Number) bizMOB._throwError("bizMOBNumber - type error. value type : " + value.constructor);
			var str = value.bMToStr();
			unit1 = new Array("", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구");
			unit2 = new Array("십", "백", "천");
			unit3 = new Array("만", "억", "조");

			var length = str.length;
			var result = "";
			for (var i = 0; i < length; i++) 
			{
				var num = str.substring(i, i + 1);
				if(isNaN(num)) { console.log("(warning)bizMOBNumber - invaild value : " + value); return ""; }
				num = num.bMToNumber();
				result += unit1[num];// 숫자를 한글로 변환
				if (num != 0 && (length - 1) != i)  // 숫자가 0이면 한글로 변환하지 않음. 마지막 숫자에는 단위를 붙이지 않음
				{
					// 십,백,천 단위
					switch(str.substring(0, (length - i)).length % 4)
					{
					case 0 :
						result += unit2[2];
						break;
					case 3 :
						result += unit2[1];
						break;
					case 2 :
						result += unit2[0];
						break;
					}
				}

				// 만 ,억,조 단위
				switch(length-i)
				{
				case 5 : // 만
					result += unit3[0];
					break;
				case 9 : // 억
					result += unit3[1];
					break;
				case 13 : // 조
					result += unit3[2];
					break;
				}
			}
			return result;
		}
	});
	bizMOB.Util.Number = new bizMOBNumber();
	
	
	function bizMOBArray()
	{
	};
	$.extend(bizMOBArray.prototype,
	{
		RemoveAt:function(value, index)
		{
			if(value.length == 0) return value;
			if(index > value.length) bizMOB._throwError("bizMOBString - Array Index out of bounds. index : " + index);;
			
			var newArr = value.slice(0,index).concat(value.slice(index+1));
			
			return newArr; 
		}
	});
	bizMOB.Util.Array = new bizMOBArray();
	
	function bizMOBString()
	{
	};
	$.extend(bizMOBString.prototype,
	{
		REGION_FORMATS : 
		{
			"kr" : "{0} 원"
		},
		defaultOptions : 
		{
			"toStr_default" : "",
			"toFixLength_fillChar" : " ",
			"toFixLength_fillDirection" : "right",
			"toFormatPhone_delim" : "-"
		},
		/**
		 * 스트링으로 변환
		 * @param {String||Number||Array||Object} value 변환할 값
		 * @returns {String}
		 */
		toStr:function(value, options)
		{
			var newOptions = {}; 
			for(key in options)
			{
				if(options.hasOwnProperty(key)) newOptions["toStr_" + key] = options[key];
			}
			options = $.extend(false, this.defaultOptions, newOptions);
			var defaultStr = options["toStr_default"];
			if(!value) return defaultStr;
			switch(value.constructor)
			{
				case String :
					return value;
				case Object :
				case Array :
					return JSON.stringify(value);
				default :
					return String(value);
			}
		},
		leftSubstr:function(value, length){
			if(!length) bizMOB._throwError("bizMOBString - reference error. length : " + length);
			value = this.toStr(value);
			if(length <= 0){
				return "";
			}else if(length > value.length){
				return str;
			}else{
				return value.substring(0,length);
			}
		},
		rightSubstr:function(value,length){
			if(!length) bizMOB._throwError("bizMOBString - reference error. length : " + length);
			value = this.toStr(value);
			if(length <= 0){
				return "";
			}else if(length > value.length){
				return str;
			}else{
				return value.substring(value.length,value.length-length);
			}
		},
		toFixLength:function(value, length, options) {
			if(!length) bizMOB._throwError("bizMOBString - reference error. length : " + length);
			var newOptions = {}; 
			for(key in options)
			{
				if(options.hasOwnProperty(key))	newOptions["toFixLength_" + key] = options[key];
			}
			newOptions = $.extend(false, this.defaultOptions, newOptions);
			
			var fill = newOptions.toFixLength_fillChar;
			var str = this.toStr(value);
			var padding = length - str.length;
			if(padding < 0) {
				str = str.substr(0,-padding);
			} else {
				for(var n=0; n<padding; n++) str = newOptions.toFixLength_fillDirection=="right" ? str + fill : fill + str;
			}
			return str;
		},
		
		toFormatString:function(format, values)
		{
			var str = format;
			switch(values.constructor)
            {
               case String :
            	   values = [values];
                   break;
            }

	    	var count = values.length;
	    	var strPattern = "";
			for(var i=0; i<count; i++) {
				
				if (values[i] == null || values[i] == undefined ) continue;
				
				strPattern = "\\{"+ i + "\\}";
				strPattern = new RegExp(strPattern,"g");
				str = str.replace(strPattern, values[i]);
			}
			return str;
		},
		
		/**
		 * 문자열이나 숫자를 통화타입으로 변환(세자리마다 ',' 표현)
		 * 
		 * @function
		 * @static
		 * @memberOf bizMOB.Util
		 * @param	{any}	num			통화타입으로 변환할 문자열					
		 * @returns {String}	통화타입으로 변환된 문자열
		 */
		toCommaNumber:function(value)
		{
			var strNum = this.toStr(value).replace(/[^0-9.-]/gi, "") + "";
			var sign="";
			var decimal="";
			
			var numSplit = strNum.split(".");
			
			if(numSplit.length == 2) 
			{
				strNum = numSplit[0];
				decimal = numSplit[1];
			}
			if(strNum.length>1 && (strNum.substring(0,1))) 
			{
				sign = strNum.substring(0,1);
				if(sign!="-" && sign!="+") sign="";
				else strNum=strNum.substring(1,strNum.length);
			}  
			
			var splitPoint = strNum.length%3 != 0 ? strNum.length%3 : 3;
			var firstNum = strNum.substring(0, splitPoint);
			var elseNum =  strNum.substring(splitPoint);
			var won = firstNum + elseNum.replace(/([0-9]{3})/g,",$1");
			if(decimal!="") decimal= "." + decimal;
			
			return sign + won + decimal;		
		},
		toFormatPhone:function(value, delim)
		{
			if(!delim) delim = this.defaultOptions.toFormatPhone_delim; 
			var str = this.toStr(value);
			var pt = /^(01\d{1}|02|0505|0506|0502|0\d{1,2})-?(\d{3,4})-?(\d{4})$/g;
			return str.replace(/^\s+|\s+$/g, "").replace(pt, "$1" +delim+ "$2" +delim+ "$3");
		},
		toChoSung:function(value) 
		{ 
			var str = this.toStr(value);
			var ChoSung   = [ 0x3131, 0x3132, 0x3134, 0x3137, 0x3138, 0x3139, 0x3141, 0x3142, 0x3143, 0x3145, 0x3146, 0x3147, 0x3148, 0x3149, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e ];
	    						// ㅏ      ㅐ      ㅑ      ㅒ      ㅓ      ㅔ      ㅕ      ㅖ      ㅗ      ㅘ      ㅙ      ㅚ      ㅛ      ㅜ      ㅝ      ㅞ      ㅟ      ㅠ      ㅡ      ㅢ      ㅣ
	    	var JwungSung = [ 0x314f, 0x3150, 0x3151, 0x3152, 0x3153, 0x3154, 0x3155, 0x3156, 0x3157, 0x3158, 0x3159, 0x315a, 0x315b, 0x315c, 0x315d, 0x315e, 0x315f, 0x3160, 0x3161, 0x3162, 0x3163 ];
	    						//         ㄱ      ㄲ      ㄳ      ㄴ      ㄵ      ㄶ      ㄷ      ㄹ      ㄺ      ㄻ      ㄼ      ㄽ      ㄾ      ㄿ      ㅀ      ㅁ      ㅂ      ㅄ      ㅅ      ㅆ      ㅇ      ㅈ      ㅊ      ㅋ      ㅌ      ㅍ      ㅎ
	    	var JongSung  = [ 0,      0x3131, 0x3132, 0x3133, 0x3134, 0x3135, 0x3136, 0x3137, 0x3139, 0x313a, 0x313b, 0x313c, 0x313d, 0x313e, 0x313f, 0x3140, 0x3141, 0x3142, 0x3144, 0x3145, 0x3146, 0x3147, 0x3148, 0x314a, 0x314b, 0x314c, 0x314d, 0x314e ];

			//var choSung = ["ㄱ","ㄴ","ㄷ","ㄹ","ㅁ","ㅂ","ㅅ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ",]		
			
	    	var a, b, c; // 자소 버퍼: 초성/중성/종성 순
	    	var ch;
	    	var result = "";
	        for (var i = 0; i < str.length; i++) {
	        	ch = str.charCodeAt(i);
	        	if (ch >= 0xAC00 && ch <= 0xD7A3) { // "AC00:가" ~ "D7A3:힣" 에 속한 글자면 분해
	        		c = ch - 0xAC00;
	        		a = parseInt(c / (21 * 28));
	        		c = parseInt(c % (21 * 28));
	        		b = parseInt(c / 28);
	        		c = parseInt(c % 28);
	        		//result = result + ChoSung[a] + JwungSung[b];
	        		//if (c != 0) result = result + JongSung[c] ; // c가 0이 아니면, 즉 받침이 있으면
	        		result = result + String.fromCharCode(ChoSung[a]);
	        	} else {
	        		result = result + String.fromCharCode(ch);
	          }
	        }
	        return result;
	    },
	    toRegionMoney:function(value, code, type)
	    {
	    	if(!code) bizMOB._throwError("bizMOBString - reference error. code : " + code);
	    	value = this.toStr(value);
	    	
	    	var format = this.REGION_FORMATS[code];
	    	if(type == "code") {format = "\\ {0}";}
	    	
	    	
	    	if(!format) bizMOB._throwError("bizMOBString - unknown code");
	    	return this.toFormatString(format, value);
	    },
	    toFileSizeUnit : function(bytes, fUnit) {
	 		bytes = parseInt(bytes);
	        var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
	        var e = $.inArray(fUnit, s);
	        
	        if(e < 0){
	        	e =Math.floor(Math.log(bytes)/Math.log(1024));
	        }
	        
	        if(e == "-Infinity") return "0 "+s[0];
	        else return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
	        
	    } ,
	    setDefaults:function(options)
		{
	    	$.extend(this.defaultOptions, options);
		},
		startsWith : function (value, str){
		    return value.slice(0, str.length) == str;
		},
		endsWith : function (value, str){
		    return value.slice(-str.length) == str;
		}
	});
	bizMOB.Util.String = new bizMOBString();
	
	function bizMOBDate(){};
	$.extend(bizMOBDate.prototype,
	{
		WEEK_NAMES : ["일","월","화","수","목","금","토"],
		WEEK_DETAIL_NAMES : ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
		defaultOptions:
		{
			"toFormatDate_format" : "yyyy-mm-dd"
		},
		toDate:function(value)
		{
			if(!value) bizMOB._throwError("bizMOBDate - reference error. value : " + value);
			if(value.constructor!=Date&&value.constructor!=String) bizMOB._throwError("bizMOBDate - type error. value type: " + value.constructor);
			
			if(value instanceof Date) date = value; 
			else if(value.constructor==String)
			{
				var strDate = value;
				strDate=strDate.replace(/([^0-9])/g,"");
				if(strDate.length==8) date = new Date(Number(strDate.substring(0,4)),Number(strDate.substring(4,6))-1,Number(strDate.substring(6,8)));
				else if(strDate.length==14) date = new Date(Number(strDate.substring(0,4)),Number(strDate.substring(4,6))-1,Number(strDate.substring(6,8)), Number(strDate.substring(8,10)), Number(strDate.substring(10,12)), Number(strDate.substring(12,14)));
				else date = new Date();
			}
			return date;
		},
		/**
		 * 날짜간격구하기
		 * ex) dateDiff("20110101","20111231");
		 * @returns int
		 */
		diff:function(startdate, enddate) { 
			if(!startdate || !enddate) bizMOB._throwError("bizMOBDate - reference error. startdate : " + startdate + ", enddate : " + enddate);
			if(startdate.constructor!=String&&startdate.constructor!=Date ) bizMOB._throwError("bizMOBDate - type error. startdate type: " + value.constructor);
			if(startdate.constructor!=enddate.constructor) bizMOB._throwError("bizMOBDate - different type. startdate type : " + startdate.constructor + ", enddate type : " + enddate.constructor);
			
			var start,end;
			if(startdate.constructor==String)
			{
				try
				{
					var start = this.toDate(startdate);
					var end = this.toDate(enddate);
				}
				catch(e)
				{
					bizMOB._throwError("bizMOBDate - invalid date format. startdate : " + startdate + ", enddate : " + enddate);
				}
			}
			else if(startdate.constructor==Date)
			{
				start = startdate; 
				end = enddate;
			}
			var diff = end.getTime() - start.getTime();
			diff = diff/(1000 * 60 * 60 * 24);
			return diff;
		},
		addYear:function(value, year)
		{
			if(!year) bizMOB._throwError("bizMOBDate - reference error. year : " + year);
			if(year.constructor!=Number) bizMOB._throwError("bizMOBDate - type error. year type : " + year.constructor);
			value.setYear(value.getFullYear()+year);
			return value;
		},
		addMonth:function(value, month)
		{
			if(!month) bizMOB._throwError("bizMOBDate - reference error. month : " + month);
			if(month.constructor!=Number) bizMOB._throwError("bizMOBDate - type error. month type : " + month.constructor);
			value.setMonth(value.getMonth()+month);
			return value;
		},
		addDay:function(value, day)
		{
			if(!day) bizMOB._throwError("bizMOBDate - reference error. date : " + day);
			if(day.constructor!=Number) bizMOB._throwError("bizMOBDate - type error. date type : " + day.constructor);
			value.setDate(value.getDate()+day);
			return value;
		},
		nextDay:function(value)
		{
			value.setDate(value.getDate()+1);
			return value;
		},
		nextMonth:function(value)
		{
			var thisMonth = value.getMonth();
			value.setMonth(thisMonth+1);
			
			if(value.getMonth() != thisMonth+1 && value.getMonth() != 0)
			value.setDate(0);
			
			return value;
		},
		nextYear:function(value)
		{
			value.setYear(value.getFullYear()+1);
			return value;
		},
		previousDay:function(value)
		{
			value.setDate(value.getDate()-1);
			return value;
		},
		previousMonth:function(value)
		{
			var thisMonth = value.getMonth();
			value.setMonth(thisMonth-1);
			
			if(value.getMonth() != thisMonth-1 && (value.getMonth() != 11 || (thisMonth == 11 && value.getDate() == 1)))
			value.setDate(0);
			
			return value;
		},
		previousYear:function(value)
		{
			value.setYear(value.getFullYear()-1);
			return value;
		},
		
		lastDay:function(value)
		{
			var date = new Date(value);
			date.setMonth(date.getMonth()+1);
			date.setDate(0);
			return date.getDate();
		},
		
		toFormatDate:function(value,format)
		{
			if(!format) format = this.defaultOptions.toFormatDate_format;
			var that = this;
			if(!value) {bizMOB._warning("bizMOBDate - reference error. value : " + value);  return "";}
			else if(!(value instanceof Date))
			{
				if(value.constructor!=String) { bizMOB._warning("bizMOBDate - type error. value type : " + value.constructor); return ""; }
				if(!(value.length==8 || value.length==14)) { bizMOB._warning("bizMOBDate - invalid value. value : " + value); return ""; }
			}
			
			var d = this.toDate(value);
			
			return format.replace(/(yyyy|yy|mm|m|dd|d|www|w|hh|h|HH|H|nn|n|ss|s|a\/p)/gi, 
				function($1)
				{
					switch ($1)
					{    
						case 'yyyy': return d.getFullYear();
						case 'yy': return d.getFullYear().bMToFixLength(2,{"fillChar" : "0", "fillDirection" : "left"});
						case 'mm': 	return (d.getMonth() + 1).bMToFixLength(2,{"fillChar" : "0", "fillDirection" : "left"});            
						case 'm': 	return (d.getMonth() + 1);            
						case 'w': 	return that.WEEK_NAMES[d.getDay()];            
						case 'www': return that.WEEK_DETAIL_NAMES[d.getDay()];            
						case 'dd':   return d.getDate().bMToFixLength(2,{"fillChar" : "0", "fillDirection" : "left"});            
						case 'd':   return d.getDate();            
						case 'hh':   return ((h = d.getHours() % 12) ? h : 12).bMToFixLength(2,{"fillChar" : "0", "fillDirection" : "left"});            
						case 'h':   return ((h = d.getHours() % 12) ? h : 12);            
						case 'HH':   return d.getHours().bMToFixLength(2,{"fillChar" : "0", "fillDirection" : "left"});            
						case 'H':   return d.getHours();            
						case 'nn':   return d.getMinutes().bMToFixLength(2,{"fillChar" : "0", "fillDirection" : "left"});            
						case 'n':   return d.getMinutes();            
						case 'ss':   return d.getSeconds().bMToFixLength(2,{"fillChar" : "0", "fillDirection" : "left"});            
						case 's':   return d.getSeconds();            
						case 'a/p':  return d.getHours() < 12 ? 'a' : 'p';            
					}       
				}
			);
		},
		setDefaults:function(options)
		{
			$.extend(this.defaultOptions, options);
		}
	});
	bizMOB.Util.Date = new bizMOBDate();
	
	/*
	function bizMOBArray(){};
	$.extend(bizMOBArray.prototype,
	{
		
	});
	bizMOB.Util.Array = new bizMOBArray();
	function bizMOBObject(){};
	$.extend(bizMOBObject.prototype,
	{
		
	});
	bizMOB.Util.Object = new bizMOBObject();
	*/
	

	
	function bizMOBResource(){}
	bizMOBResource.prototype.getString = function(key, locale){};
	bizMOBResource.prototype.getAllString = function(){};
	bizMOBResource.prototype.getTr = function(group, trcode, extendValue){};
	bizMOBResource.prototype.getHeader = function(name){};
	
	/*$.extend(bizMOBResource.prototype, 
	{
		STRING_PATH : RELATE_DEPTH+"bizMOB/message/res/",
		TR_PATH : RELATE_DEPTH+"bizMOB/message/",
		TR_HEADER_PATH : "header/",
		SPEC_CHARS : 
		{
			"INCLUDE_HEADER" : "@",
			"REPLACE_STRING" : "="
		},
		getString:function(key, locale)
		{
			if(!key) bizMOB._throwError("bizMOBResource - reference error. key : " + key);
			if(key.constructor!=String) bizMOB._throwError("bizMOBResource - type error. key type : " + key.constructor);
			var str = "";
			var result = this.getAllString(locale);
			console.log(JSON.stringify(result));
			var keySplit = key.split(".");
			keySplit.forEach(function(value)
			{
				result = result[value];
			});
			
			if (result) 
			{
				if (result.constructor == String) 
				{
					var otherArgs = Array.prototype.slice.call(arguments, 1);
					if(otherArgs.length>0) str = bizMOB.Util.String.toFormatString.apply(bizMOB.Util.String, [result].concat(otherArgs));
					else str = result;
				} else bizMOB._throwError("bizMOBResource - type error. Result is not String : " + result.constructor);
			} else bizMOB._throwError("bizMOBResource - invalid key. key : " + key);
			return str;
		},
		getAllString:function(reqlocale)
		{
			var Locale = "";
			var filename = "string";
			
			if(reqlocale) Locale = reqlocale;
			else Locale = bizMOB.Device.Info.locale;
			
			switch(Locale)
			{
				case "ko" :
					filename = filename+".json";
					break;
				case undefined :
					filename = filename+".json";
					break;
				default : 
					filename = filename + "_" + Locale.bMLeftSubstr(2) + ".json";
			}
			
			var path = this.STRING_PATH+filename;
			
			var result=this._readJson(path);
			return result;
		},
		getTr:function(group, trcode, extendValue)
		{
			if(!group) bizMOB._throwError("bizMOBResource - reference error. group : " + group);
			if(group.constructor!=String) bizMOB._throwError("bizMOBResource - type error. group type : " + group.constructor);
			if(!trcode) bizMOB._throwError("bizMOBResource - reference error. trcode : " + trcode);
			if(trcode.constructor!=String) bizMOB._throwError("bizMOBResource - type error. trcode type : " + trcode.constructor);
			
			var result = undefined;
			var that = this;
			if(group) this.groupPath = group + "/";
			var path = this.TR_PATH + this.groupPath + trcode + ".json";
			
			var data = this._readJson(path);
			
			var header;
			if(data && data.header) 
			{
				header =data.header;
				try{var header = $.extend(that._replaceSpecStr(header), {"trcode" : trcode}); }
				catch(e)
				{
					bizMOB._throwError("bizMOBResource - JSON syntax error. header : " + header);
				}
				result = $.extend(data, {"header" : header});
			}
			else result=data;
        				
			$.extend(true, result, extendValue);
			if(result && result.header) 
			{
				var now = new Date();
				result.header.trId = result.header.trcode + "_" +
					bizMOB.Util.Date.toFormatDate(now,"yyyymmddhhnnss") + (now.getMilliseconds().bMToFixLength(3,{"fillChar" : "0", "fillDirection" : "left"})) + "_" + 
					Math.floor(Math.random()*1000).bMToFixLength(3,{"fillChar" : "0"});
			}
			return result;
		},
		getHeader:function(name)
		{
			var result;
			var that = this;
			var path = this.TR_PATH + this.groupPath + this.TR_HEADER_PATH  + name + ".json";
			var data = this._readJson(path);
			
			for(key in data)
			{
				if(data.hasOwnProperty(key)) data[key] = that._replaceSpecStr(data[key]);
			}
			result = data;
			
			return result;
		},
		_replaceSpecStr:function(data)
		{
			var result;
			var that = this;
			var specChar;
			if(data && typeof data == "string" && data.length > 0) specChar = data.substring(0, 1);
			switch (specChar) 
			{
				case that.SPEC_CHARS["INCLUDE_HEADER"] :
					var headerName = data.substr(1);
					result = that.getHeader(headerName);
					break;
				case that.SPEC_CHARS["REPLACE_STRING"] :
					var key = data.substr(1);
					result = sessionStorage.getItem(key);
					break;
				default :
					result = data;
					break;
			}
			return result;
		},
		_readJson: function(path){
			console.log("JSON file read : "+path);
			var result;
			$.ajax({
                url: path, 
                dataType: "json",
 				async : false,
                success: function(data) {
                	console.log("JSON file read sucess : "+JSON.stringify(data));
                	if(data==null) {
                		bizMOB._throwError("bizMOBResource - Resource is empty." );
                		return;
                	}
                	result=data;
                },
                error: function(error) {  
                	var readType = "text";
                	if(error.status == "404"){
                		console.log("bizMOBResource - Requested Resource not found. Default Resource Read." );
                		path = path.substring(0,path.indexOf("string_")+6)+path.substring(path.indexOf(".json"));
                		readType = "json";
                	}
                	console.log("JSON file read : "+path);
                	$.ajax({
                        url: path, 
                        dataType: readType,
         				async : false,
                        success: function(data) {
                        	console.log("JSON file read sucess : "+JSON.stringify(data));
                        	if(data=="") {
                        		bizMOB._throwError("bizMOBResource - Resource is empty." );
                        		return;
                        	}
                        	try{
                        		if(readType == "text") {
                        			JSON.parse(data);
                        		}
                        		else{
                        			result = data;
                        		}
                        	}catch(e){
                        		bizMOB._throwError("bizMOBResource - Resource cannot convert to JSON " + e);
                        	}
                        },
                        error: function(e) {  
                        	bizMOB._throwError("bizMOBResource - load resource failed : " + path+ "[" + e.status + "] " + e.statusText);
                        }
                    });
                }
            });
			return result;
		}
	});*/
	bizMOB.Util.Resource = new bizMOBResource();
	
	
	function bizMOBSort()
	{
		this.options = {};
	}
	$.extend(bizMOBSort.prototype, 
	{
		ORDER_BY_ASC : "asc", 
		ORDER_BY_DESC : "desc",
		KEY_TYPE_STRING : "string",
		KEY_TYPE_NUMBER : "number",
		defaultOptions : 
		{
		},
		keyDefaultOptions : 
		{
			"orderby" : "asc",
			"field" : "",
			"fieldType" : "string"
		},
		execute:function(target, options)
		{
			if(!options) this.sortElement.apply(this, arguments);
			else
			{
				switch(options.constructor)
				{
					case Object :
						this.sortElement.apply(this, arguments);
						break;
					case String :
						this[options].apply(this, arguments);
						break;
				}
			}
		},
		_orderByAscElement:function(a,b, key, keyType)
		{
			var retVal = null;
			
			var target1 = $(a),
				target2 = $(b);
			if(key)
			{
				target1 = target1.find(key);
				target2 = target2.find(key);
			}
			if (target1.text() == target2.text()){
		        return 0;
		    }
			if(keyType == "number")
			{
				retVal = parseInt(target1.text()) > parseInt(target2.text()) ? 1 : -1;
			} else
			{
				retVal = target1.text() > target2.text() ? 1 : -1;
			}
			return retVal;  
		},
		_orderByDescElement:function(a,b, key, keyType){  
		    return this._orderByAscElement(a,b, key, keyType) * -1;  
		},
		_orderByAscJson:function(a,b, key, keyType)
		{
			var retVal = null;
			
			var value1,value2;
			
			if(key)
			{
				value1 = a[key];
				value2 = b[key];
			}
			else
			{
				value1 = a;
				value2 = b;
			}
			if (value1==value2){
		        return 0;
		    }
			
			if(keyType == "number"){
				retVal = parseInt(value1) > parseInt(value2) ? 1 : -1;
			}else{
				retVal = value1 > value2 ? 1 : -1;
			}
		    return retVal;  
		},
		_orderByDescJson:function(a,b, key, keyType)
		{
			return this._orderByAscJson(a,b, key, keyType) * -1;  
		},
		sortElement:function(root, options)
		{
			if(root.size()==0) bizMOB._throwError("bizMOBSort - target is empty. selector : " + root.selector);
			var that = this;
			that.options = $.extend(false, that.defaultOptions);
			that.options.keys = new Array();
			that.options.keys.push(options || {});
			var tempBox = $("<div style='background-color:red;'>").insertAfter(root.eq(-1));
			root.pushStack([].sort.apply( root, 
			[
			 	function(a,b)
			 	{ 
			 		var retVal = 0;
			 		for(var i=0;i<that.options.keys.length;i++)
					{
			 			var record = that.options.keys[i];
			 			if(retVal==0) 
						{
							var data = $.extend(false, that.keyDefaultOptions);
							if(record.constructor === String) data.field = record;
							else if(record.constructor === Object)
							{
								$.extend(data, record);
							}
							var sortFunc = data.orderby === that.ORDER_BY_DESC ? that._orderByDescElement : that._orderByAscElement;
							retVal = sortFunc.apply(that, [a,b, data.field, data.fieldType]);
						}
					}
			 		return retVal;
			 	}
			 ] ), [] );
			tempBox.append(root);
			root.insertAfter(tempBox);
			tempBox.remove();
		},
		sortArray:function(arr, options)
		{
			if(!arr) bizMOB._throwError("bizMOBSort - array is empty.");
			if(arr.length==0) bizMOB._throwError("bizMOBSort - array is empty.");
			var that = this;
			//that.options = $.extend(false, that.defaultOptions, options);
			that.options = $.extend(false, that.defaultOptions);
			that.options.keys = new Array();
			that.options.keys.push(options || {});
			var sortFunc = that.options.orderby === that.ORDER_BY_DESC ? that._orderByDescJson : that._orderByAscJson;
			return [].sort.call( arr, 
				function(a,b)
			 	{ 
					var retVal = 0;
			 		for(var i=0;i<that.options.keys.length;i++)
					{
			 			var record = that.options.keys[i];
						if(retVal==0) 
						{
							var data = $.extend(false, that.keyDefaultOptions);
							if(record.constructor === String) data.field = record;
							else if(record.constructor === Object)
							{
								$.extend(data, record);
							}
							var sortFunc = data.orderby === that.ORDER_BY_DESC ? that._orderByDescJson : that._orderByAscJson;
							retVal = sortFunc.apply(that, [a,b, data.field, data.fieldType]);
						}
					}
			 		return retVal;
			 	}
			);
		}
		
	});
	bizMOB.Util.Sort = new bizMOBSort();
	
	
	//////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	
	function bizMOBValidate()
	{
		this.options = {};
		this.initialized = false;
	}
	$.extend(bizMOBValidate.prototype, 
	{
		instances : {},
		defaultOptions : 
		{
			rules : {},
			onError : function(errors)
			{
				var message = "";
				for(key in errors)
				{
					if(errors.hasOwnProperty(key))
					{
						var errorInfo = errors[key];
						if(message) message+="\n";
						message += errorInfo.message;
					}
				}
				bizMOB.Ui.alert("확인", message);
			},
			checkAll : false
		},
		_createError:function(target, message)
		{
			var error = 
			{
				"target" : target, 
				"message" : message 
			};
			return error; 
		},
		_testElement:function(target, ruleName, param)
		{
			var testFunc, testParam;
			if(ruleName && ruleName.constructor == Function)
			{
				var that = this;
				testFunc = ruleName;
				testParam = [target, bizMOB.Util.Validate.Rules];
			}
			else
			{
				testFunc = bizMOB.Util.Validate.Rules[ruleName];
				testParam = [target].concat(param);
			}
			if(testFunc && testFunc.constructor == Function) 
			{
				return testFunc.apply(bizMOB.Util.Validate.Rules, testParam);
			}
			else bizMOB._throwError("bizMOBValidate - can't find rule. ruleName -" + ruleName);
		},
		_parseRule:function(rule)
		{
			var result = new Array();
			if(rule.constructor==String)
			{
				var ruleSplit = rule.split("//");
				ruleSplit.forEach(function(value)
				{
					var msgSplit = value.split("::");
					if(msgSplit.length!=2) bizMOB._throwError("bizMOBValidate - parse rule failed. rule string : " + rule);
					var msg = msgSplit[1];
					var funcStructNames = msgSplit[0].split("&&");
					
					var checks = [];
					var regExp = /([0-9|A-z]+)\((.*?)\)/g;
					funcStructNames.forEach(function(funcStructName)
					{
						var expResult=regExp.exec(funcStructName);
						var funcName = undefined,
							param = [];
						if(expResult)
						{
							var funcName = expResult[1];
							param = expResult[2].split(",");
							/*
							for(var i=0;i<param.length;i++)
							{
								param[i] = eval(param[i]);
							}
							*/
						}
						else funcName = funcStructName;
						checks.push({name : funcName, param : param});
					});

					result.push(
					{
						"checks" : checks,
						"message" : msg
					});
				});
			}
			else if(rule.constructor==Function)
			{
				result.push(
				{
					"checks" : rule
				});
			}
			else bizMOB._throwError("bizMOBValidate - parse rule failed. unknown type.  rule.type : " + rule.constructor);
			return result;
		},
		_parseRules:function(rules)
		{
			var newRules = new Object();
			for(key in rules)
			{
				if(rules.hasOwnProperty(key))
				{
					var rule = this._parseRule(rules[key]);
					newRules[key] = rule;
				}
			};
			return newRules;
		},
		_public_check:function(target)
		{
			var check = this.check(this.options.rules, this.options,target);
			return check;
		},
		_public_addRule:function(root, targetSelector, str)
		{
			if(!targetSelector) bizMOB._throwError("bizMOBValidate - reference error. targetSelector : " + targetSelector);
			if(!str)bizMOB._throwError("bizMOBValidate - reference error. rule string : " + str);
			this.options.rules[targetSelector] = this._parseRule(str); 
		},
		_public_removeRule:function(root, targetSelector)
		{
			if(!targetSelector) bizMOB._throwError("bizMOBValidate - reference error. targetSelector : " + targetSelector);
			if(this.options.rules[targetSelector]) delete this.options.rules[targetSelector];
		},
		execute:function($target, options)
		{
			
			target = $target[0];
			var otherArgs = Array.prototype.slice.call(arguments, 2);
			if((!target.bizMOBValidateInst) || (!target.bizMOBValidateInst.initialized))
			{
				//Initialise
				target.bizMOBValidateInst = bizMOB.Util.Validate._getInstance($target.selector);
				target.bizMOBValidateInst.extendOptions(bizMOB.Util.Validate.defaultOptions);
				target.bizMOBValidateInst.initialized=true;
			}
			if(typeof options == 'object')
			{
				target.bizMOBValidateInst.extendOptions(options);
			}
			else if(typeof options == 'string') 
			{
				var result;
				var func = target.bizMOBValidateInst['_public_' + options];
				var that;
				if(!func)
				{
					that = bizMOB.Util.Validate.Rules;
					func = that[options];
					if(!func) bizMOB._throwError("bizMOBValidate - unknown method. method : " + options);
				}
				else that = target.bizMOBValidateInst;
				return func.apply(that, [$target].concat(otherArgs));
			}
			return target.bizMOBValidateInst;
		},
		
		extendOptions:function(options)
		{
			if(!options) return;
			
			var rules = {};
			if(options.rules) 
			{
				var rules = this._parseRules(options.rules);
			}
			this.options = $.extend(false, this.options, options, {"rules" : rules});
		},
		_getInstance:function(key)
		{
			if(!this.instances[key]) this.instances[key] = new this.constructor();
			return this.instances[key];
		},
		getOptions:function()
		{
			return this.options;
		},
		check:function(rules, options,parent)
		{
			var checkAll = options && options.checkAll!=undefined ? options.checkAll : this.defaultOptions.checkAll;
			var that = this;
			var errors = new Array();
			for(var targetSelector in rules)
			{
				if(!(rules.hasOwnProperty(targetSelector))) continue;
				var target = $(targetSelector, parent);
				if(target.size()==0) 
				{
					bizMOB._warning("bizMOBValidate - target is null. target selector : " + targetSelector);
					continue;
				}
				rules[targetSelector].forEach(function(value)
				{
					if(errors.length!=0 && (!checkAll)) return;
					var record = value;
					var message = record.message;
					var checks = record.checks;
					if(checks.constructor==Function)
					{
						var testResult = that._testElement(target, checks); 
						if(!(testResult===true))
						{
							var message = testResult;
							errors.push(that._createError(target, message));
						}
					}
					else
					{
						for(var i=0;i<checks.length;i++)
						{
							var name = checks[i].name;
							var param = checks[i].param;
							var testResult = that._testElement(target, name, param); 
							if(testResult==false)
							{
								errors.push(that._createError(target, message));
								break; 
							}
						}
					}
				});
				if(errors.length!=0 && (!checkAll)) break;
			}
			if(errors.length!=0) 
			{
				if(options && options.onError) options.onError(errors);
				return false;
			}
			else return true;
		},
		setDefaults : function(options)
		{
			$.extend(this.defaultOptions, options);
		}
	});
	
	function bizMOBRules()
	{
	}
	bizMOBRules.prototype = 
	{
		_getValue:function(element)
		{
			var value;
			if(element.jquery)
			{
				var nodeName = element[0].nodeName.toLowerCase();
				if(nodeName == "input" || nodeName == "select" || nodeName == "textarea") value = element.val();
				else value = element.text();
			}
			else value = element;
			return value;
		},
		_test:function(element, testFunc)
		{
			var that = this;
			var result = true;
			element.each(function(value)
			{
				if(value == undefined) return false;
				var testValue = that._getValue($(this));
				if(!testFunc.call(that, testValue)) result = false;
			});
			return result;
		},
		required:function(element)
		{
			return this._test(element, function(value){ return !!value; });
		},
		email:function(element)
		{
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				var regExp = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
				return regExp.test(value); 
			});
		},
		phone:function(element)
		{
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				var regExp = /^(01[016789]|02|0[3-9]{1}[0-9]{1})[-.]{0,1}[0-9]{3,4}[-.]{0,1}[0-9]{4}$/g;
				return regExp.test(value); 
			});
		},
		date:function(element) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				return /^\d{4}[\/.-]\d{1,2}[\/.-]\d{1,2}$/.test(value);
			});
		},
		minLength:function(element,length) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				return $.trim(this._getValue(value)).length >= length;
			});
		},
		maxLength : function(element,length) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				return $.trim(value).length <= length;
			});
		},
		rangeLength : function(element, minLength, maxLength) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				var length = $.trim(value).length;
				return (length >= minLength && length <= maxLength);
			});
		},
		minNumber : function(element, min) {
			return this.number(element) && this._test(element, function(value)
			{
				if(value == undefined) return false;
				return (bizMOB.Util.Number.toNumber(value) >= min);
			});
		},
		maxNumber : function(element, max) {
			return this.number(element) && this._test(element, function(value)
			{
				if(value == undefined) return false;
				return (bizMOB.Util.Number.toNumber(value) <= max);
			});
		},
		rangeNumber : function(element, min, max) {
			return this.number(element) && this._test(element, function(value)
			{
				if(value == undefined) return false;
				var num = bizMOB.Util.Number.toNumber(value);
				return (num >= min && num <= max);
			});
		},
		
		digits : function(element) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				return /^\+*\d+$/.test(value);
			});
		},
		number : function(element) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				return /^[+-]*[0-9]+$/.test(value);
			});
		},
		equalTo : function(element, to) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				if(to)
				{
					if(to.constructor==String) to =$(to);
				}
				return value === this._getValue(to);
			});
		},
		"in":function(element)
		{
			var list = Array.prototype.slice.call(arguments, 1);
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				var result = false;
				list.forEach(function(loopValue)
				{
					if(value===loopValue) result=true;
				});
				return result;
			});
		},
		chars:function(element)
		{
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				return /^[ㄱ-ㅣ가-�R|a-z|A-Z]+$/.test(value);
			});
		},
		korChars:function(element) {
			return this._test(element, function(value)
			{
				if(value == undefined) return false;
				return /^[가-힣]+$/.test(value);
			});
		}
	};
	bizMOB.Util.Validate = new bizMOBValidate();
	bizMOB.Util.Validate.Rules = new bizMOBRules();
	
	bizMOB.Util.Validate.addDefaultRule = function(ruleName, testFunc)
	{
		if(!ruleName) bizMOB._throwError("bizMOBValidate - reference error. rule name : " + ruleName);
		if(!testFunc) bizMOB._throwError("bizMOBValidate - reference error. function : " + testFunc);
		if(testFunc.constructor != Function) bizMOB._throwError("bizMOBValidate - invaild type. function type : " + testFunc.constructor);
		bizMOB.Util.Validate.Rules[ruleName] = testFunc;
	};
	
	function bizMOBHtml(){};
	$.extend(bizMOBHtml.prototype,
	{
		ID_NO_DATA : "bizMOBHtmlTagNoData",
		CLASS_NO_DATA : "nodata no_data",
		ID_BACK_LAYER : "bizMOBHtmlBackLayer",
		createNoDataTag:function(target, inputTxt)
		{
			if(!target || target.size()==0) 
			{
				bizMOB._throwError("bizMOBHtml - reference error. target : " + target);
				return;
			}
			this.removeNoDataTag();
			var tagType;
			var nodeName = target[0].nodeName.toLowerCase();
			switch(nodeName)
			{
				case "table" : tagType = "tr"; break;
				case "tr" : tagType = "td"; break;
				case "ul" : tagType = "li"; break;
				case "dl" : tagType = "dt"; break;
				default :
					tagType = "p"; 
					break;
			}
			var tag = $("<" + tagType + ">").addClass(this.CLASS_NO_DATA);
			if(tagType=="tr")
			{
				var child = $("<td>").attr("colspan",10).text(inputTxt);
				tag.append(child);
			}
			else
			{
				if(tagType=="td") tag.attr("colspan",10);
				tag.text(inputTxt);
			}
			
			var parent = target.clone();
			target.addClass(this.ID_NO_DATA + "Target");
			parent.children().remove().end()
				.attr("id", this.ID_NO_DATA)
				.insertAfter(target)
				.append(tag).show();
		},
		removeNoDataTag:function()
		{
			$("#" + this.ID_NO_DATA).remove();
			$("." + this.ID_NO_DATA + "Target").removeClass(this.ID_NO_DATA + "Target");
		},
		createBackLayer:function(target)
		{
			if(!target || target.size()==0) 
			{
				bizMOB._throwError("bizMOBHtml - reference error. target : " + target);
				return;
			}
			this.removeBackLayer();
			var backLayer = $("<div id='" + this.ID_BACK_LAYER + "' style='position:absolute; left:0; top:0; width:100%; height:100%; background:#000; opacity:0.7;'>");
			target.append(backLayer);
		},
		removeBackLayer:function()
		{
			$("#" + this.ID_BACK_LAYER).remove();
		}
	});
	bizMOB.Util.Html = new bizMOBHtml();
	
	///////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////
	 
	function bizMOBFilter()
	{
		this.originalMethods = {};
	}
	$.extend(bizMOBFilter.prototype, 
	{
		instances : {},
		NEW_FILTER_CHARS :"",
		TARGET_ELEMENT :"input:not(:reset:checkbox:radio:button:submit:file),textarea",
		DATE : "\.\-",
		PHONE : "\-",
		EMAIL : "\@\_\-\.",
		FILTER_CHARS : "\!\"\#\$\%\&\\\(\)\*\+\,\/\:\;\<\=\>\?\[\\\\]\^\_\{\|\}\~\@",
//		FILTER_CHARS : {'!':'!','"':'"','#':'#','$':'$','%':'%','&':'&','\'':'\'','(':'(',')':')','*':'*','+':'+',',':',','/':'/',':':':',';':';','<':'<','=':'=','>':'>','?':'?','[':'[','\\':'\\',']':']','^':'^','_':'_','{':'{','|':'|','}':'}','~':'~','@':'@'//		},
		defaultOptions : 
		{
			TARGET_ELEMENT : [],
			FILTER_CHARS : {},
			onError : function(errors)
			{
				console.log("[Filter]"+$(errors.Object).attr("id")+" value have illegal chars");
				alert("사용할 수 없는 문자가 있습니다.");
			},
			solveType : "replace" //break
		},
		setDefaults : function(options)
		{
			$.extend(this.defaultOptions, options);
			
			var new_filter = "";
			$.each(this.defaultOptions.FILTER_CHARS,function(index,value){
				new_filter += "\\"+value;
			});
			
//			var new_filter = {};
//			$.each(this.defaultOptions.FILTER_CHARS,function(index,value){
//				new_filter[value] = value;
//			});
			
			this.FILTER_CHARS = new_filter;
		},
		_getInstance:function(key)
		{
			if(!this.instances[key]) this.instances[key] = new this.constructor();
			return this.instances[key];
		},
		addTrigger:function(key,options)
		{
			
			var originalMethod = eval(key); 
			if(this.originalMethods[key]){
				console.log("[WARN]<\""+key+"\"> method already exist. It will be overriding!!!");
				if(eval(key+".FilterCreated")){
					console.log("the option of <\""+key+"\"> method changed!!!");
					console.log("option == "+JSON.stringify(options));
					eval(key+" = function(){" +
							"var otherArgs = Array.prototype.slice.call(arguments, 0);" +
							"if( bizMOB.Util.Filter._excute("+JSON.stringify(options)+") ){" +
							" 	bizMOB.Util.Filter.originalMethods[key](otherArgs);" +
							"}" +
						"}"
					);
					eval(key+".FilterCreated = true;");
				}else{
					console.log("<\""+key+"\"> method was changed!!!");
					console.log("option == "+JSON.stringify(options));
					delete this.originalMethods[key];
					
					this.originalMethods[key] = originalMethod;
					
					eval(key+" = function(){" +
									"var otherArgs = Array.prototype.slice.call(arguments, 0);" +
									"if( bizMOB.Util.Filter._excute("+JSON.stringify(options)+") ){" +
									" 	bizMOB.Util.Filter.originalMethods[key](otherArgs);" +
									"}" +
								"}"
						);
					eval(key+".FilterCreated = true;");
					
				}
				
			}else{
				
				this.originalMethods[key] = originalMethod;
				
				eval(key+" = function(){" +
								"var otherArgs = Array.prototype.slice.call(arguments, 0);" +
								"if( bizMOB.Util.Filter._excute("+JSON.stringify(options)+") ){" +
								" 	bizMOB.Util.Filter.originalMethods[key](otherArgs);" +
								"}" +
							"}"
					);
				eval(key+".FilterCreated = true;");
				
				console.log("<\""+key+"\"> method Filter Created!!!");
				
			};
			
			
		},
		removeTrigger:function(key)
		{
			eval(key +"="+ this.originalMethod[key]);
		},
		_excute:function(rules)
		{
			var $targetlist = $(this.TARGET_ELEMENT);
			//var strCharList = JSON.stringify(this.FILTER_CHARS); 
			
			var result = true;

			$.each($targetlist,function(index,value){
				var $target = $(value);
				//var charList = JSON.parse(strCharList);
				
			//	console.log("before"+JSON.stringify(charList));
				
				var checkTarget;
				var permissionchar;
				$.each(rules.permission, function(key,value){
					if($target.is(key)){
						checkTarget = $target;
						permissionchar = value;
					}
				});
				
				if(!bizMOB.Util.Filter._public_check(checkTarget, permissionchar)){
					console.log("checkTarget"+$(checkTarget).attr("id"));
					result = false; 
					return false;
				}
				
			});
			
			return result;
		},
		_getRegExStr : function(str){
			var charRegEx = "";
			switch (str)
			{
				case "[date]" : charRegEx += this.DATE;break;
				case "[phone]" : charRegEx += this.PHONE;break;
				case "[email]" : charRegEx += this.EMAIL;break;
				default : charRegEx += "("+str+")";
			}
			return charRegEx;
		},
		_public_check:function(selector, charArr ){
			
			var result = true;
			var charRegEx = "";
			
			console.log("default:"+this.FILTER_CHARS);
			for(var i=0;i<charArr.length;i++){
				//delete charList[value[i]];
				if(charArr[i].length<2){
					charRegEx += "\\"+charArr[i];
				}else{
					console.log("Exception:"+charArr[i]);
					charRegEx += this._getRegExStr(charArr[i]);
				}
				
			}
			
			var prohibitRegEx = new RegExp("["+this.FILTER_CHARS+"]","gi");
			var permitRegEx = new RegExp("[^"+charRegEx+"]","gi");
			var resultArr = $(selector).val().match(prohibitRegEx);
			
		
				
			if( resultArr != null  ){
				var resultStr = resultArr.join();
				//console.log("1st:"+resultStr);
				if(resultStr.match(permitRegEx) != null){
					console.log("1st:"+resultStr);
					this.defaultOptions.onError({
						"Object":selector,
						"IllegalChar" : resultStr
					});
					
					result = false;
				}
				
			}
			
			return result;
		}
	});
	
	bizMOB.Util.Filter = new bizMOBFilter();
	///////////////////////////////////////////////////////////
	// Jquery Plugin Extends 
	///////////////////////////////////////////////////////////
	$.fn.bMFilter = function()
	{
		var inst = bizMOB.Util.Filter._getInstance(this);
		return inst._public_check.apply(inst, [this].concat(Array.prototype.slice.call(arguments, 1)));
	};
	$.fn.bMRender = function()
	{
		var inst = bizMOB.Util.Render._getInstance(this);
		inst.execute.apply(inst, [this].concat(Array.prototype.slice.call(arguments, 0)));
	};
	
	$.fn.bMNoDataTag = function()
	{
		var inst = bizMOB.Util.Html;
		bizMOB.Util.Html.createNoDataTag.apply(inst, [this].concat(Array.prototype.slice.call(arguments, 0)));
	};
	
	$.fn.bMRemoveDataTag = function()
	{
		var inst = bizMOB.Util.Html;
		bizMOB.Util.Html.removeNoDataTag.apply(inst, [this].concat(Array.prototype.slice.call(arguments, 0)));
	};
	
	$.fn.bMSort = function() 
	{
		var inst = bizMOB.Util.Sort;
		inst.execute.apply(inst, [this].concat(Array.prototype.slice.call(arguments, 0)));
	};

	$.fn.bMValidate = function() 
	{
		if(this.size()==0) bizMOB._throwError("bizMOBValidate - reference error. selector : " + this.selector);
		var inst = bizMOB.Util.Validate._getInstance(this);
		return inst.execute.apply(inst, [this].concat(Array.prototype.slice.call(arguments, 0)));
	};
	
	$.fn.bMExist = function () 
	{
	    return this.length !== 0;
	};

	
	///////////////////////////////////////////////////////////
	// DataType Method Extends 
	///////////////////////////////////////////////////////////
	Number.prototype.bMToFileSizeUnit=function(unit){ return bizMOB.Util.String.toFileSizeUnit(this, unit);};
	Number.prototype.bMToStr=function(options) { return bizMOB.Util.String.toStr(this, options);};
	Number.prototype.bMToNumber=function(options) { return bizMOB.Util.Number.toNumber(this.valueOf(), options);};
	Number.prototype.bMToFixLength=function(length, options) { return bizMOB.Util.String.toFixLength(this, length, options);};
	Number.prototype.bMToKorNumber=function() { return bizMOB.Util.Number.toKor(this);};
	Number.prototype.bMToRegionMoney=function(countryCode,unitType) { return bizMOB.Util.String.toRegionMoney(this,countryCode,unitType);};
	
	String.prototype.bMToFileSizeUnit = function(unit){ return bizMOB.Util.String.toFileSizeUnit(this, unit);};
	String.prototype.bMToDate=function(){ return bizMOB.Util.Date.toDate(this);};
	String.prototype.bMToStr=function(options) { return bizMOB.Util.String.toStr(this, options);};
	String.prototype.bMToNumber=function(options) { return bizMOB.Util.Number.toNumber(this, options);};
	String.prototype.bMLeftSubstr=function(length) { return bizMOB.Util.String.leftSubstr(this, length);};
	String.prototype.bMRightSubstr=function(length) { return bizMOB.Util.String.rightSubstr(this, length);};
	String.prototype.bMToFixLength=function(length, options) { return bizMOB.Util.String.toFixLength(this, length, options);};
	String.prototype.bMToFormatString=function(values) { return bizMOB.Util.String.toFormatString(this , values);};
	String.prototype.bMToCommaNumber=function() { return bizMOB.Util.String.toCommaNumber(this);};
	String.prototype.bMToFormatPhone=function(delim) { return bizMOB.Util.String.toFormatPhone(this, delim);};
	String.prototype.bMToFormatDate=function(format) { return bizMOB.Util.Date.toFormatDate(this, format);};
	String.prototype.bMToChoSung=function() { return bizMOB.Util.String.toChoSung(this);};
	String.prototype.bMDateDiff=function(strDate) { return bizMOB.Util.Date.diff(this,strDate);};
	String.prototype.bMToRegionMoney=function(countryCode,unitType) { return bizMOB.Util.String.toRegionMoney(this,countryCode,unitType);};
	String.prototype.bMToKorNumber=function() { return bizMOB.Util.Number.toKor(this);};
	String.prototype.bMStartsWith=function(str) { return bizMOB.Util.String.startsWith(this,str);};
	String.prototype.bMEndsWith=function(str) { return bizMOB.Util.String.endsWith(this,str);};
	

	Array.prototype.bMSort = function(options) { return bizMOB.Util.Sort.sortArray(this, options);};
	Array.prototype.bMRemoveAt= function(index) { return bizMOB.Util.Array.RemoveAt(this, index);};
	
	Date.prototype.bMToDate=function(){ return bizMOB.Util.Date.toDate(this);};
	Date.prototype.bMDiff=function(diffDate){ return bizMOB.Util.Date.diff(this, diffDate);};
	Date.prototype.bMAddYear=function(year){ return bizMOB.Util.Date.addYear(this, year);};
	Date.prototype.bMAddMonth=function(month){ return bizMOB.Util.Date.addMonth(this, month);};
	Date.prototype.bMAddDay=function(day){ return bizMOB.Util.Date.addDay(this,day);};
	Date.prototype.bMNextDay=function(){ return bizMOB.Util.Date.nextDay(this);};
	Date.prototype.bMNextMonth=function(){ return bizMOB.Util.Date.nextMonth(this);};
	Date.prototype.bMNextYear=function(){ return bizMOB.Util.Date.nextYear(this);};
	Date.prototype.bMPreviousDay=function(){ return bizMOB.Util.Date.previousDay(this);};
	Date.prototype.bMPreviousMonth=function(){ return bizMOB.Util.Date.previousMonth(this);};
	Date.prototype.bMPreviousYear=function(){ return bizMOB.Util.Date.previousYear(this);};
	Date.prototype.bMLastDay=function(){ return bizMOB.Util.Date.lastDay(this);};
	Date.prototype.bMToFormatDate=function(format) { return bizMOB.Util.Date.toFormatDate(this, format);};
	
	Storage.prototype.setObject = function(key, value){ return this.setItem.call(this, key, JSON.stringify(value));};
	Storage.prototype.getObject = function(key){ var value = this.getItem.call(this, key); return value && jQuery.parseJSON(value);};
	
	
}());