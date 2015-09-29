/**
 * @author vertex210@mcnc.co.kr 김영호
 * @version : 0.1
 * @dependent : jquery, bizMOB.Util
 * 
 * 추가작업할 기능 : 기념일, ui 자동 연계
 */

(function($, undefined)
{
	var bizMOBCalendarDefaults = 
	{
		calendarId : "bMCalendar",
		btnNextMonthClass : "btnNextMonth",
		btnPrevMonthClass : "btnPrevMonth",
		btnNextYearClass : "btnNextYear",
		btnPrevYearClass : "btnPrevYear",
		changeYear : false,
		changeMonth : false,
		yearClass : "year",
		selectYearClass : "sltYear",
		monthClass : "month",
		selectMonthClass : "sltMonth",
		dayClass : "day",
		todayClass : "today",
		selectDateClass : "select",
		otherMonthDateClass : "otherMonthDate",
		autoOpen : false,
		startChangeYear : new Date().getFullYear()-10,
		endChangeYear : new Date().getFullYear()+10,
		dayNamesMin : ["일", "월", "화", "수", "목", "금", "토"],
		dateFormat : "yyyy-mm-dd",
		defaultDate : "",
		onSelectDate:function(day){},
		onBeforeHide:function(){},
		onBeforeShow:function(){},
		createCalendarDiv:function()
		{
			return this._createCalendarDiv();
		},
		eachDayHTML:function(arg){ return this._eachDayHTML(arg);},
		renderCalendar:function(){ this._renderCalendar();},
		onBeforeRender:function(){},
		onAfterRender:function(){},
		onAfterCreateCalendar:function(div){}
	};
	function bizMOBCalendar()
	{
		this.options = $.extend({}, bizMOBCalendarDefaults);
		this.selectedDate = new Date();
		this.year = this.selectedDate.getFullYear();
		this.month = this.selectedDate.getMonth()+1;
		this.weeks = this._calculateWeeks(this.year, this.month);
		
		this.initialized;
		
		this.div;
		this.input;
	}
	bizMOBCalendar.instances = {};
	bizMOBCalendar.activeInstance = undefined;
	bizMOBCalendar._getInstance = function(key)
	{
		var inst = key.data("bizMOBCalendar");
		if(!inst) 
		{
			inst = new this();
			key.data("bizMOBCalendar", inst);
		}
		return inst;
	};
	$.extend(bizMOBCalendar.prototype, 
	{
		
		
		_bindingCalendarDivEvent:function()
		{
			var that = this;
			var div = that.div;
			
			
			this.input.click(function()
			{
				that._public_show();
			});
			
			div.on("click", "." + this.options.btnPrevMonthClass, function()
			{
				bizMOBCalendar.activeInstance._public_previousMonth();
				bizMOBCalendar.activeInstance._render();
				return false;
			});
			div.on("click", "." + this.options.btnNextMonthClass, function()
			{
				bizMOBCalendar.activeInstance._public_nextMonth();
				bizMOBCalendar.activeInstance._render();
				return false;
			});
			div.on("click", "." + this.options.btnPrevYearClass, function()
			{
				bizMOBCalendar.activeInstance._public_previousYear();
				bizMOBCalendar.activeInstance._render();
				return false;
			});
			div.on("click", "." + this.options.btnNextYearClass, function()
			{
				bizMOBCalendar.activeInstance._public_nextYear();
				bizMOBCalendar.activeInstance._render();
				return false;
			});
			div.on("change", "." + this.options.selectYearClass, function()
			{
				bizMOBCalendar.activeInstance._public_setYearMonth($(this).val().bMToNumber(), bizMOBCalendar.activeInstance.month);
				bizMOBCalendar.activeInstance._render();
				return false;
			});
			div.on("change", "." + this.options.selectMonthClass, function()
			{
				bizMOBCalendar.activeInstance._public_setYearMonth(bizMOBCalendar.activeInstance.year, $(this).val().bMToNumber());
				bizMOBCalendar.activeInstance._render();
				return false;
			});
			
			div.on("click", "." + this.options.dayClass, function()
			{
				var inst = bizMOBCalendar.activeInstance;
				var day = $(this).attr("day");
				inst.options.onSelectDate.call($(this), day);
				inst._public_select.call(inst, day);
				inst.input.val(new Date(inst.year, inst.month-1, day).bMToFormatDate(inst.options.dateFormat));
				if(!inst.options.autoOpen) inst._public_hide();
				inst._render();
				return false;
			});
		},
		/**
		 * 현 달력페이지 중 전달 날짜를 계산
		 * @param{number} year
		 * @param{number} month
		 * @return {array<number>} 현 달력페이지 중 전달 날짜 목록
		 */
		_calculateBeforeOtherDays:function(year, month)
		{
			var beforeDays = new Array();
			
			var beforeMonthDate = new Date(year, month-2, 1);
			var beforeMonthWeeks = this._calculateMonthWeeks(beforeMonthDate.getFullYear(), beforeMonthDate.getMonth()+1); 
			
			var beforeMonthLastWeek = beforeMonthWeeks[beforeMonthWeeks.length-1];
	        var beforeDaysCount = (beforeMonthLastWeek[beforeMonthLastWeek.length-1].dayOfWeek!=6) ? (beforeMonthLastWeek[beforeMonthLastWeek.length-1].dayOfWeek + 1) : 0; // 첫번째주의 첫번째날의 요일인덱스 +1
	        
	        for(var i=0;i<beforeDaysCount;i++)
	        {
	        	var index = (beforeMonthLastWeek.length) - beforeDaysCount + i;
	        	var dayInfo = beforeMonthLastWeek[index];
	        	beforeDays.push(
        		{
        			"day" : dayInfo.day,
					"dayOfWeek" : dayInfo.dayOfWeek,
					"isBeforeMonthDay" : true,
					"isNextMonthDay" : false
        		});
	        }
	        return beforeDays;
		},
		/**
		 * 현 달력페이지 중 다음달 날짜를 계산
		 * @param{number} year
		 * @param{number} month
		 * @return {array<number>} 현 달력페이지 중 다음달 날짜 목록
		 */
		_calculateNextOtherDays:function(year, month)
		{
			var nextDays = new Array();
			
			var afterMonthDate = new Date(year, month, 1);
			var nextMonthDays = this._calculateMonthWeeks(afterMonthDate.getFullYear(), afterMonthDate.getMonth()+1);
			
	        var nextMonthFirstWeek = nextMonthDays[0];
	        var nextDaysCount = (nextMonthFirstWeek[0].dayOfWeek!=0) ? 7-nextMonthFirstWeek[0].dayOfWeek : 0; // 7-마지막주의 마지막날의 요일인덱스 
	        for(var i=0;i<nextDaysCount;i++)
	        {
	        	var dayInfo = nextMonthFirstWeek[i];
	        	nextDays.push(
        		{
        			"day" : dayInfo.day,
					"dayOfWeek" : dayInfo.dayOfWeek,
					"isBeforeMonthDay" : false,
					"isNextMonthDay" : true
        		});
	        }
	        return nextDays;
		},
		/**
		 * 해당월의 마지막일을 반환함
		 * @param year
		 * @param month
		 * @returns {number} 월의 마지막 일
		 */
		_calculateLastDay:function(year, month)
		{
			if (year instanceof Date) return this._calculateLastDay(year.getFullYear(), year.getMonth()+1);
	        if (month == 2) 
	        {
	            var leapYear = (year % 4 == 0) && (!(year % 100 == 0) || (year % 400 == 0));
	            return leapYear ? 29 : 28;
	        } else if (month == 4 || month == 6 || month == 9 || month == 11) return 30;
	        else return 31;
		},
		/**
		 * 해당월의 전체 날짜정보를 반환함
		 * @param year
		 * @param month
		 * @returns {Array<Array<Object>>} 해당월의 전체 날짜정보
		 * 
		 * 		{
		 * 			{number} day,
					{number} dayOfWeek,
					{boolean} isBeforeMonthDay,
					{boolean} isNextMonthDay,
					{boolean} today	
		 * 		}	
		 * 
		 */
		
		_calculateMonthWeeks:function(year, month)
		{
			lastDay = this._calculateLastDay(year, month);
			
			var weeksInfo = [];
			var date = new Date(year, month-1, 1);
			var dayOfWeek = date.getDay();
			var weekInfo = new Array();
			var nowDay = -1;
			var now = new Date();
			if((now.getFullYear() == date.getFullYear()) && (now.getMonth() == date.getMonth())) nowDay = now.getDate();
			
			for(var i =1; i<=lastDay; i++) 
			{
				weekInfo.push(
				{
					"day" : i,
					"dayOfWeek" : dayOfWeek,
					"isBeforeMonthDay" : false,
					"isNextMonthDay" : false,
					"today" : i==nowDay
				});
				if(dayOfWeek < 6 && i!=lastDay) 
				{
					dayOfWeek++;
				}
				else 
				{
					weeksInfo.push(weekInfo);
					dayOfWeek = 0;
					weekInfo = new Array();
				} 
			}
			return weeksInfo;
		},
		_init:function()
		{
			var that = this;
			this.initialized = true;
			var div = $("#" + this.options.calendarId);
			if(div.size()==0) 
			{
				this.div = this.options.createCalendarDiv.apply(this);
				this._bindingCalendarDivEvent();
			}
			else this.div = div;
			this.input.click(function()
			{
				//bizMOBCalendar.activeInstance = that;
				that._public_show();
			});
			//기본날짜 있는 경우 날짜 설정
			if(this.options.defaultDate && this.options.defaultDate.length===8)
			{
				this._public_setDate(this.options.defaultDate);
			}
			
			this.options.onAfterCreateCalendar.apply(this, [this.div]); 
			if(this.options.autoOpen) 
			{
				bizMOBCalendar.activeInstance = that;
				this._public_show();
			}
		},
		/**
		 * 해당월의 전체 날짜정보를 반환함
		 * 첫째주와 마지막주에는 이전달의 날짜도 포함됨
		 * @param year
		 * @param month
		 * @returns {Array<Array<Object>>} 해당월의 전체 날짜정보
		 * 
		 * 		{
		 * 			{number} day,
					{number} dayOfWeek,
					{boolean} isBeforeMonthDay,
					{boolean} isNextMonthDay,
					{boolean} today	
		 * 		}	
		 * 
		 */
		_calculateWeeks:function(year, month)
		{
			var weeks = new Array();
			weeks = this._calculateMonthWeeks(year, month);
			
			var beforeOtherDays = this._calculateBeforeOtherDays(year, month);
			if(beforeOtherDays.length>0) weeks[0] = beforeOtherDays.concat(weeks[0]);
			
			var nextOtherDays = this._calculateNextOtherDays(year, month);
			if(nextOtherDays.length>0) weeks[weeks.length-1] = weeks[weeks.length-1].concat(nextOtherDays);
			
			return weeks;
		},
		/**
		 * 현재 월의 날짜목록을 반환함
		 * @returns {Array<number>} 현재 월의 날짜목록
		 */
		_public_getDays:function()
		{
			var days = new Array();
			for(var index in this.weeks)
			{
				var week = this.weeks[index];
				for(var dayIndex in week)
				{
					days.push(week[dayIndex]);
				}
			}
			return days;
		},
		/**
		 * 현재 월의 첫째 날짜정보를 반환함
		 * @returns {object} 현재 월의 첫째 날짜정보
		 */
		_public_getFirstDayInfo:function()
		{
			return this.weeks[0][0];
		},
		/**
		 * 현재 월의 마지막 날짜정보를 반환함
		 * @returns {object} 현재 월의 마지막 날짜정보
		 */
		_public_getLastDayInfo:function()
		{
			var lastWeek = this.weeks[this.weeks.length-1];
			return lastWeek[lastWeek.length-1];
		},
		/**
		 * 현재 월의 주목록을 반환함
		 * @returns {Array<Array<Object>>} 현재 월의 주목록
		 */
		_public_getWeeks:function()
		{
			return this.weeks;
		},
		/**
		 * 현재 월을 반환함
		 * @returns {number} 현재 월
		 */
		_public_getMonth:function()
		{
			return this.month;
		},
		/**
		 * 선택된 날짜를 반환함
		 * @param format
		 * @returns {string || Date} format을 지정한 경우 string. 그렇지 않으면 Date 객체
		 */
		_public_getSelectedDate:function(format)
		{
			if(format) return this.selectedDate.bMToFormatDate(format);
			else return this.selectedDate;
		},
		/**
		 * 현재 년을 반환함
		 * @returns {number} 현재 년
		 */
		_public_getYear:function()
		{
			return this.year;
		},
		execute:function($target, options)
		{
			this.input = $target;
			target = $target[0];
			var otherArgs = Array.prototype.slice.call(arguments, 2);
			if((!target.inst) || (!target.inst.initialized)) 
			{
				target.inst = this;
				if(typeof options == 'object') target.inst.extendOptions(options);
				target.inst._init();
			}
			else if(typeof options == 'object')
			{
				target.inst.extendOptions(options);
				target.inst._init();
			}
			
			if(typeof options == 'string') 
			{
				var result;
				var func = target.inst['_public_' + options];
				var that;
				if(!func) bizMOB._throwError("bizMOBCalendar - unknown method. method : " + options);
				else that = target.inst;
				return func.apply(that, otherArgs);
			}
			return target.inst;
		},
		extendOptions:function(options)
		{
			$.extend(this.options, options);
		},
		_public_hide:function()
		{
			this.options.onBeforeHide.apply(this);
			this.div.hide();
		},
		/**
		 * 다음 달로 이동
		 */
		_public_nextMonth:function() 
		{
			
			if(this.month>=12) 
			{
				//년도 직접 수정이 불가능한 모드인 경우 || 변경할 년도가, 변경가능한 마지막년도를 넘지 않는 경우
				if(!this.options.changeYear || this.year+1 <= this.options.endChangeYear)
				{
					this.year +=1;
					this.month = 1;
				}
				else return;
			}
			else this.month+=1;
			this.weeks = this._calculateWeeks(this.year, this.month);
		},
		/**
		 * 다음 년으로 이동
		 */
		_public_nextYear:function()
		{
			//년도 직접 수정이 불가능한 모드인 경우 || 변경할 년도가, 변경가능한 마지막년도를 넘지 않는 경우
			if(!this.options.changeYear || this.year+1 <= this.options.endChangeYear)
			{
				this.year +=1;
				this.weeks = this._calculateWeeks(this.year, this.month);
			}
		},
		/**
		 * 이전달로 이동
		 */
		_public_previousMonth:function()
		{
			if(this.month<=1) 
			{
				//년도 직접 수정이 불가능한 모드인 경우 || 변경할 년도가, 변경가능한 최초년도 이상인 경우
				if(!this.options.changeYear 	|| this.year-1 >= this.options.startChangeYear)
				{
					this.year -=1;
					this.month = 12;
				}
				else return;
			}
			else this.month-=1;
			this.weeks = this._calculateWeeks(this.year, this.month);
		},
		/**
		 * 이전년으로 이동
		 */
		_public_previousYear:function()
		{
			//년도 직접 수정이 불가능한 모드인 경우 || 변경할 년도가, 변경가능한 최초년도보다 작지 않은 경우
			if(!this.options.changeYear || this.year-1 >= this.options.startChangeYear)
			{
				this.year -=1;
				this.weeks = this._calculateWeeks(this.year, this.month);
			}
		},
		_public_select:function(day)
		{
			this.selectedDate.setFullYear(this.year);
			this.selectedDate.setMonth(this.month-1);
			this.selectedDate.setDate(day);
		},
		_public_show:function()
		{
			bizMOBCalendar.activeInstance = this;
			this.options.onBeforeShow.apply(this);
			this.div.show();
			this._render();
		},
		_public_setYearMonth:function(year, month)
		{
			this.year = year;
			this.month = month;
			this.weeks = this._calculateWeeks(year, month);
		},
		_public_setDate:function(date)
		{
			var year = undefined,
				month = undefined,
				day = undefined;
			
			switch(date.constructor)
			{
			case Date :
				year = date.getFullYear();
				month = date.getMonth();
				day = date.getDate();
				break;
			case String :
				if(date.length==8)
				{
					year = date.substring(0,4).bMToNumber();
					month = date.substring(4,6).bMToNumber();
					day = date.substr(6).bMToNumber();
				}
				break;
			}
			if(year && month && day) 
			{
				this._public_setYearMonth(year, month);
				this._public_select(day);
				this.input.val(new Date(year, month-1, day).bMToFormatDate(this.options.dateFormat));
			}
		},
		_createCalendarDiv:function()
		{
			var div = $("<div>").attr("id", this.options.calendarId).hide().appendTo("body");
			
			//-----헤더영역 생성 시작--------------------
			var header = $("<div>").addClass("bizMOBCalendar_header").appendTo(div);
			var title = $("<h1>").appendTo(header);
			var $txtYear = $("<span>").addClass(this.options.yearClass).appendTo(title);
			var $sltYear = $("<select>").addClass(this.options.selectYearClass).appendTo(title);
			for(var i=this.options.startChangeYear;i<=this.options.endChangeYear;i++)
			{
				$("<option>").val(i).text(i).appendTo($sltYear);
			}
			if(this.options.changeYear) $txtYear.hide();
			else $sltYear.hide();
			$("<span>").text("년").appendTo(title);
			var $txtMonth = $("<span>").addClass(this.options.monthClass).appendTo(title);
			var $sltMonth = $("<select>").addClass(this.options.selectMonthClass).appendTo(title);
			for(var i=1;i<=12;i++)
			{
				$("<option>").val(i).text(i).appendTo($sltMonth);
			}
			if(this.options.changeMonth) $txtMonth.hide();
			else $sltMonth.hide();
			$("<span>").text("월").appendTo(title);
			
			
			
			var beforeDiv = $("<div>").appendTo(header);
			$("<button type='button'>").addClass(this.options.btnPrevYearClass).text("이전년").appendTo(beforeDiv);
			$("<button type='button'>").addClass(this.options.btnPrevMonthClass).text("이전달").appendTo(beforeDiv);
			
			var afterDiv = $("<div>").appendTo(header);
			$("<button type='button'>").addClass(this.options.btnNextMonthClass).text("다음달").appendTo(afterDiv);
			$("<button type='button'>").addClass(this.options.btnNextYearClass).text("다음년").appendTo(afterDiv);
			//-----헤더영역 생성 끝--------------------
			
			//-----날짜영역 생성 시작--------------------
			var table = $("<table>").addClass("bizMOBCalendar_table").appendTo(div);
			$("<caption>").text("월간 달력").appendTo(table);
			
			var thead = $("<thead>").appendTo(table);
			for(var i=0;i<7;i++)
			{
				$("<th scope='col'>").text(this.options.dayNamesMin[i]).appendTo(thead);
			}
			//-----날짜영역 생성 끝--------------------
			return div;
		},
		_eachDayHTML:function(arg)
		{
			if((!arg.isBeforeMonthDay) && (!arg.isNextMonthDay)) return arg.day;
			else return "";
		},
		_render:function()
		{
			this.options.onBeforeRender.apply(this);
			this.options.renderCalendar.apply(this);
			this.options.onAfterRender.apply(this);
		},
		_renderCalendar:function()
		{
			var that = this;
			var div = this.div;
			div.find("." + this.options.yearClass).text(this.year);
			div.find("." + this.options.monthClass).text(this.month);
			div.find("." + this.options.selectYearClass).val(this.year);
			div.find("." + this.options.selectMonthClass).val(this.month);
			
			div.find(".bizMOBCalendar_tbody").remove();
			var table = div.find(".bizMOBCalendar_table");
			var tbody = $("<tbody>").addClass("bizMOBCalendar_tbody").appendTo(table);
			var week = $("<tr>").addClass("bizMOBCalendar_week").appendTo(tbody);
			var dayDiv = $("<td>").addClass("bizMOBCalendar_dayDiv").appendTo(week);
			$("<span>").addClass(this.options.dayClass).appendTo(dayDiv);
			var dir = 
			[
				//loop
				{
					"type" : "loop", "target" : ".bizMOBCalendar_week",	"value" : "weeks",
					"detail" : 
					[
						{
							"type" : "loop", "target" : ".bizMOBCalendar_dayDiv",	"value" : ".",
							"detail" : 
							[
								{ "type" : "single", "target" : "." + this.options.dayClass, "valueType" : "html",  
									"value" : function(arg)
									{
										return that.options.eachDayHTML.apply(that, [arg.item]);  
									} 
								},
								{ "type" : "single", "target" : "." + this.options.dayClass + "@day",  
									"value" : function(arg)
									{
										return that._eachDayHTML.apply(that, [arg.item]);  
									} 
								},
								{ "type" : "single", "target" : "@class+", 
									"value" : function(arg)
									{ 
										var addClass = "";
										var year = that.year,
											month = that.month,
											day = arg.item.day;
										if(arg.item.today) addClass += " today"; // 오늘날짜
										if(arg.item.isBeforeMonthDay || arg.item.isNextMonthDay) addClass += " other_m"; // 이번달이 아닌날짜
										else if(that.selectedDate.getFullYear()===year &&
											that.selectedDate.getMonth()+1===month &&
											that.selectedDate.getDate()===day) 
										{
											addClass += " choice"; //선택된 날짜 
										}
										return addClass; 
									} 
								}
							]
						}
					]
				}
			];
			table.bMRender({weeks : this.weeks}, dir);
		}
	});
	$.fn.bMCalendar = function()
	{
		var arg = Array.prototype.slice.call(arguments, 0);
		
		var methodResult = undefined;
		var result = $.each(this, function()
		{
			var inst = bizMOBCalendar._getInstance($(this));
			var tempResult = inst.execute.apply(inst, [$(this)].concat(arg));
			if(tempResult) methodResult = tempResult;
		});
		return methodResult ? methodResult : result;
	};
	
	$.fn.bMCalendar.prototype.a = function() 
	{
		console.log("a!");
	};
	$.bMCalendar = function(){};
	$.bMCalendar.setDefaults = function(options) 
	{
		$.extend(bizMOBCalendarDefaults, options); 
	}; 
})(jQuery);