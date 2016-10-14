/**
 * auther:yefengbar.com
 * date:2016-10-9 11:05
 * version:0.1.0
 * */
;(function($,Dom){
	Hcq = window.Hcq || {};
	Hcq.util = window.Hcq.util || {};
	/**
	 * getParam 获取url参数值
	 * @param name 要获取的参数名
	 * 
	 * **/
	Hcq.util.getParam = function(name){
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) {
	        return unescape(r[2]);
	    }
	    return null;
	}
	Hcq.util.addcss = function(path){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
	}
    Hcq.util.addjs = function(path){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
})(jQuery,window)
