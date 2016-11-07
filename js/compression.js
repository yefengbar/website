(function() {
	var $ = jQuery.noConflict();
	var isRunFlag = true,
		mod = true;
	var times, outTimes, loading, fileurl, code, infos, beforeNum, afterNum;

	//计算压缩比
	var rate = function(str, num, israte) {
		infos.eq(0).html("0");
		infos.eq(2).html("0%");
		str = str.replace(/[\u4e00-\u9fa5]/g, "**");
		str = str.replace(/\t/g, "****");
		var size = (str.length / 1024).toFixed(2) + "kb";
		infos.eq(num).html(size);
		var rateNum;

		if(israte) {
			beforeNum = infos.eq(1).html().replace("kb", "");
			afterNum = infos.eq(0).html().replace("kb", "");
			rateNum = ((beforeNum - afterNum) / beforeNum * 100).toFixed(2);
			infos.eq(2).html(rateNum + "%");

			if(rateNum <= 0) {
				var rateTip = $("#rateTip");
				rateTip.show(600);
				setTimeout(function() {
					rateTip.hide(600);
				}, 40000);
			}
		}
	};

	//压缩
	var codeFun = function() {
		//压缩内容判断
		var compcheck = function(title, msg, fn, isTime) {
			var codestr = code.val();
			if(codestr) {
				if(isRunFlag) {

					clearTimeout(times);
					isRunFlag = false;
					var ms = parseInt(Math.random() * (600 - 1000 + 1) + 600);
					loading.fadeIn();
					code.fadeOut();

					if(!isTime) {
						ms = 0;
					}

					times = setTimeout(
						function() {
							try {
								fn(codestr);
							} catch(e) {
								outTimes = setTimeout(
									function() {
										code.fadeIn();

										isRunFlag = true;
									}, parseInt(Math.random() * (2600 - 3000 + 1) + 2600)
								);
							}
						}, ms
					);
				}
			} else {
				showDialog(msg, "alert", title);
				isRunFlag = true;
				return false;
			}
			return codestr;
		};

		//获得文件
		var getFile = function() {
			$("#btgetfile").click(
				function() {
					var url = fileurl.val();
					if(url) {
						infos.eq(0).html("0");
						infos.eq(2).html("%0");
						loading.fadeIn();
						code.fadeOut();

						$.ajax({
							type: "POST",
							cache: false,
							url: "/tools.php",
							dataType: "json",
							data: {
								type: "getFile",
								param: encodeURIComponent(url)
							},
							success: function(data) {
								if(data.status == 1) {
									code.val(data.param);
									rate(data.param, 1);
								} else {
									showDialog("无法获得此文件，请检查文件URL是否正确！", "alert", "文件获取提示");
								}
								code.fadeIn();

								isRunFlag = true;
							},
							error: function() {
								isRunFlag = true;
							}
						});
					} else {
						showDialog("请输入JS或CSS代码的URL地址", "alert", "文件获取提示");
					}
				}
			);
		};

		//压缩
		var codeCompression = function() {
			$("#codeCompression").click(
				function() {
					compcheck(
						"压缩提示",
						"请填写您需要压缩的代码",
						function(codestr) {
							rate(codestr, 1);
							if(mod) {
								$.ajax({
									type: "POST",
									cache: false,
									url: "/tools.php",
									dataType: "json",
									data: {
										type: "minjs",
										param: encodeURIComponent(code.val())
									},
									success: function(data) {
										if(data.status == 1) {
											code.val(data.param);
											rate(data.param, 0, true);
										} else {
											showDialog("JS中可能有错误或不够规范，请查证后再试！", "alert", "压缩提示");
										}
										code.fadeIn();

										isRunFlag = true;
									},
									error: function() {
										isRunFlag = true;
									}
								});
							} else {
								codestr = codestr.replace(/\/\*(.|\n)*?\*\//g, ""); //删除注释
								codestr = codestr.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
								codestr = codestr.replace(/\,[\s\.\#\d]*\{/g, "{"); //容错处理
								codestr = codestr.replace(/;\s*;/g, ";"); //清除连续分号
								codestr = codestr.replace(/(\n\r)|(\n)/g, ""); //删除空行
								codestr = codestr.match(/^\s*(\S+(\s+\S+)*)\s*$/); //去掉首尾空白
								codestr = (codestr == null) ? "" : codestr[1];
								code.val(codestr);
								rate(codestr, 0, true);
								code.fadeIn();

								isRunFlag = true;
							}
						}, !mod
					);
				}
			);

			$("#codeBeautify").click(
				function() {
					compcheck
						(
							"美化提示",
							"请填写您需要压缩的代码",
							function(codestr) {
								rate(codestr, 1);
								if(mod) {
									codestr = js_beautify(codestr.replace(/^\s+/, ''), 1, "\t");
									rate(codestr, 0, true);
								} else {
									codestr = codestr.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
									codestr = codestr.replace(/;\s*;/g, ";"); //清除连续分号
									codestr = codestr.replace(/\,[\s\.\#\d]*{/g, "{");
									codestr = codestr.replace(/([^\s])\{([^\s])/g, "$1{\n\t$2");
									codestr = codestr.replace(/([^\s])\}([^\n]*)/g, "$1\n}\n\n$2");
									codestr = codestr.replace(/([^\s]);([^\s\}])/g, "$1;\n\t$2");
									rate(codestr, 0);
								}
								code.val(codestr);
								code.fadeIn();

								isRunFlag = true;
							}
						);
				}
			);

			$("#evalEncode").click(
				function() {
					compcheck
						(
							"压缩提示",
							"请填写您需要压缩的代码",
							function(codestr) {
								var ispacker = codestr.substring(0, 4);
								if(ispacker !== "eval") {
									eval_encode();
									code.fadeIn();
									rate(code.val(), 0, true);
									isRunFlag = true;
								} else {
									showDialog("代码已被混淆，无需再次混淆！", "alert", "压缩提示");
									isRunFlag = true;
								}
							}, false
						);
				}
			);

			$("#evalDecode").click(
				function() {
					compcheck(
						"解压提示",
						"请填写您需要解缩的代码",
						function(codestr) {
							var ispacker = codestr.substring(0, 4);
							if(ispacker === "eval") {
								code.val(eval(code.val().replace(/^eval/, "")));
								rate(code.val(), 0, true);
							} else {
								showDialog("代码没有被混淆", "alert", "解压提示");
							}
							code.fadeIn();
							isRunFlag = true;
						}
					);
				}
			);

			$("#copycode").click(
				function() {
					var codestr = code.val();
					if(codestr) {
						code.select();
						setCopy(codestr, "代码已复制，在需要的地方 CTRL + V 即可");
					} else {
						showDialog("没有代码可以复制哦", "alert", "复制提示");
						isRunFlag = true;
						return false;
					}
				}
			);
		};

		getFile();
		codeCompression();
	};

	$(function() {
		var defRateHtml, jsUrl, jsCode, cssUrl, cssCode, jsRateHtml, cssRateHtml;
		var tabs = $("#tabs li");
		var infobar = $("#infobar");
		var evalcode = $(".evalcode");
		loading = $("#loading");
		fileurl = $("#inpurl");
		code = $("#inpcode");
		infos = infobar.find("i");
		defRateHtml = infobar.html();

		tabs.click(
			function() {
				var _this = $(this);
				tabs.removeAttr("class");
				_this.addClass("active");
				if(tabs.index(_this) == 0) {
					cssRateHtml = infobar.html();
					jsUrl = fileurl.val();
					jsCode = code.val();
					fileurl.val(cssUrl);
					code.val(cssCode);
					evalcode.show();
					mod = true;
					infobar.html(jsRateHtml ? jsRateHtml : defRateHtml);
					infos = infobar.find("i")
				} else {
					jsRateHtml = infobar.html();
					cssUrl = fileurl.val();
					cssCode = code.val();
					fileurl.val(jsUrl);
					code.val(jsCode);
					evalcode.hide();
					mod = false;
					infobar.html(cssRateHtml ? cssRateHtml : defRateHtml);
					infos = infobar.find("i")
				}
			}
		);

		codeFun();
	});
})();

function showDialog(con, type, tit) {
	layer.alert(con, {
		"title": tit
	})
}
//js_eval
a = 62;

function eval_encode() {
	var code = document.getElementById('inpcode').value;
	code = code.replace(/[\r\n]+/g, '');
	code = code.replace(/'/g, "\\'");
	var tmp = code.match(/\b(\w+)\b/g);
	tmp.sort();
	var dict = [];
	var i, t = '';
	for(var i = 0; i < tmp.length; i++) {
		if(tmp[i] != t) dict.push(t = tmp[i]);
	}
	var len = dict.length;
	var ch;
	for(i = 0; i < len; i++) {
		ch = num(i);
		code = code.replace(new RegExp('\\b' + dict[i] + '\\b', 'g'), ch);
		if(ch == dict[i]) dict[i] = '';
	}
	document.getElementById('inpcode').value = "eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}(" +
		"'" + code + "'," + a + "," + len + ",'" + dict.join('|') + "'.split('|'),0,{}))";
}

function num(c) {
	return(c < a ? '' : num(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
}

function run() {
	eval(document.getElementById('inpcode').value);
}