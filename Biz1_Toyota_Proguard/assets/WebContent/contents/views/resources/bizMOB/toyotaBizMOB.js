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
	 * biZMOB Native class
	 * 
	 * @class	웹 인터페이스
	 */
	bizMOB.Native = function() {};
	
	/**
	 * ToyotaBizMOBNative 클래스
	 * @class ToyotaBizMOBNative Class
	 * @extends bizMOB.Native
	 * @name ToyotaBizMOBNative
	 */
	function ToyotaBizMOBNative(){};
	ToyotaBizMOBNative.prototype = new bizMOB.Native();
	
	
	/**
	 * TODO : internal browser close
	 * @param {String} options(target_page, title)
	 */
	ToyotaBizMOBNative.prototype.closeInternalBrowser = function(callback)
	{
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
	
	/**
	 * ToyotaBizMOBNative Class 인스턴스
	 * @static
	 * @name toyotaBizMOB.Native
	 * @see ToyotaBizMOBNative
	 */
	window.toyotaBizMOB.Native = new ToyotaBizMOBNative();
	
})(jQuery, undefined);

bizMOB.cmdWatcher = false;
bizMOB.cmdPosition = 0;
bizMOB.callbackId = 0;
bizMOB.buttonId = 0;
bizMOB.callbacks = {};

bizMOB.replacer = function(key, value) {
    if (typeof value === 'number' && !isFinite(	value)) {
        return String(value);
    }
    return value;
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
