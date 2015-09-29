/**
 * @author vertex210@mcnc.co.kr 김영호
 */
(function($, undefined)
{
	//override - string 일 경우 오동작 수정
	//          - 빈문자열일경우 오동작 수정
	//          - date가 undefined 일 경우 에러나는 것 수정
	bizMOB.Util.toFormatDate = function(date,format)
	{
		var that = this;
		var strDate="";
		if(date==undefined) return "";
		var d;
		if(date instanceof Date)
		{
			//strDate = date.getFullYear() + "" + (date.getMonth() + 1).zf(2) + "" + date.getDate().zf(2);
			d = date; 
		}
		//오류 수정. strDate -> date
		else if(date.constructor==String)
		{
			strDate = date;
			strDate=strDate.replace(/([^0-9])/g,"");
			if(date.length==8) d = new Date(Number(strDate.substring(0,4)),Number(strDate.substring(4,6))-1,Number(strDate.substring(6,8)));
			else if(date.length==14) 
			{
				d = new Date(
					Number(strDate.substring(0,4)),
					Number(strDate.substring(4,6))-1,
					Number(strDate.substring(6,8)), 
					Number(strDate.substring(8,10)),
					Number(strDate.substring(10,12)),
					Number(strDate.substring(12,14)));
			}
			else return "";
		}
		else return "";
		
		return format.replace(/(yyyy|yy|mmmm|mmm|mm|m|dddd|ddd|dd|www|w|hh|HH|nn|ss|a\/p)/gi, 
			function($1)
			{
				switch ($1)
				{    
					case 'yyyy': return d.getFullYear();
					case 'yy': return d.getFullYear().zf(2);
					case 'mm': 	return (d.getMonth() + 1).zf(2);            
					case 'm': 	return (d.getMonth() + 1);            
					case 'w': 	return that.weekNames[d.getDay()];            
					case 'www': return that.weekDetailNames[d.getDay()];            
					case 'dd':   return d.getDate().zf(2);            
					case 'd':   return d.getDate();            
					case 'hh':   return ((h = d.getHours() % 12) ? h : 12).zf(2);            
					case 'HH':   return d.getHours().zf(2);            
					case 'nn':   return d.getMinutes().zf(2);            
					case 'ss':   return d.getSeconds().zf(2);            
					case 'a/p':  return d.getHours() < 12 ? 'a' : 'p';            
				}       
			}
		);
	};

	
})(jQuery);