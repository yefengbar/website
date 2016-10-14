/**
 * auther:yefengbar.com
 * date:2016-10-9 11:05
 * version:0.1.0
 * */
;(function($, Dom) {
	Hcq = window.Hcq || {};
	Hcq.logFn = {
		getPassUrl: 'http://www.yefengbar.com/post.php',
		getkkUrl: 'http://zc.7k7k.com/get_pre_kk?callback=',
		chkNameUrl: 'http://www.yefengbar.com/post.php',
		doLogUrl: 'http://www.yefengbar.com/post.php',
		cssUrl: './css/log.css',
		logDomId: '#union',
		doMain: 'yefengbar.com',
		remName: 0,
		isCheck: 0,
		callBacks: '',
		msg: [
			'这是系统自动分配给你的帐号',
			'4-32位数字、字母、或组合',
			'6-32位数字、字母、_或组合',
			'邮箱格式不正确',
			'用户名已被注册',
			'用户名可以使用',
			'上次使用QQ登陆',
			'上次使用微信登陆',
			'上次使用账号登陆',
			'输入常用的邮箱'
		],
		userInfo: {
			name: "",
			pass: "",
			status: 0
		},
		defaults: {
			autokk: 0, //是否自动分配账号0：不分配，1分配
			qqlogCallback: encodeURIComponent(location.href), //qq登录回调地址
			logAction: 2, //0刷新，1跳转，2回调
			logedCallUrl: location.href, //登录成功后跳转地址
			regAction: 2, //0刷新，1跳转，2回调
			showSave: 1, //是否显示保存账号面板
			saveInfo: 'http://www.yefengbar.com/saveUser.php?', //保存账号请求地址
			refer: 3841 //注册的参数
		},
		toggleUi: function(index) {
			var _this = $(this.logDomId + ' .un_tabs a');
			var _index = $(this.logDomId + ' .un_tabs a.cur').index();
			_this.removeClass('cur');
			_this.eq(index).addClass('cur');
			$('.un_mod_log .un_tips,.un_mod_reg .un_tips').html("").removeClass('no yes');
			$('.un_msg .logs').show();
			$('.un_msg .saves').hide();
			$('.un_mod_save').hide();
			Hcq.logFn.resetHack();
			if(index == 0) {
				$('.un_mod_log').show();
				$('.un_mod_reg').hide();
				$('.un_tabs span').animate({
					"left": "168px"
				}, 150);
			} else {
				if(Hcq.logFn.defaults.autokk) {
					Hcq.logFn.autoKk();
				}
				$('.un_mod_log').hide();
				$('.un_mod_reg').show();
				$('.un_tabs span').animate({
					"left": "277px"
				}, 150);
				$(Hcq.logFn.logDomId + ' #un_rname').bind('blur', function() {
					if(this.value) {
						Hcq.logFn.checkName(this.value);
					} else {
						$('.un_mod_reg .un_tips.rname').html(Hcq.logFn.msg[1]).addClass('no');
					}
				});
			}
			var unHeight = $(this.logDomId).height() / 2;
			$(this.logDomId).animate({
				"margin-top": "-" + unHeight + "px"
			}, 150)
		},
		config: function(options) {
			$.extend(Hcq.logFn.defaults, options);
		},
		init: function() {
			if(location.host != this.doMain) {
				this.addCSS(Hcq.logFn.cssUrl);
				logHtml = '<IFRAME id=union_mask src="about:blank" frameBorder=no style="display:none"></IFRAME>' +
					'		<div class="union_warp" id="union" style="display:none">' +
					'			<div class="un_con">' +
					'				<div class="un_tit">' +
					'					<a href="http://web.7k7k.com" target="_blank" class="un_logo"></a>' +
					'					<div class="un_tabs">' +
					'						<a href="javascript:;" class="cur">用户登录</a>' +
					'						<a href="javascript:;">用户注册</a>' +
					'						<span></span>' +
					'					</div>' +
					'					<a href="javascript:;" class="un_close"></a>' +
					'				</div>' +
					'				<div class="un_login">' +
					'					<div class="un_inps un_mod_log">' +
					'						<div class="un_inp name">' +
					'							<span>用户名&nbsp;:</span>' +
					'							<input type="text" id="un_name" value="用户名/邮箱/手机号" placeholder="用户名/邮箱/手机号" />' +
					'						</div>' +
					'						<div class="un_tips name"></div>' +
					'						<div class="un_inp pass">' +
					'							<span>密　码&nbsp;:</span>' +
					'							<input type="password" id="un_pass" value="" />' +
					'						</div>' +
					'						<div class="un_tips pass"></div>' +
					'						<div class="un_rem">' +
					'							<span class="un_check"></span>' +
					'							<span class="un_lable">记住登录账号</span>' +
					'							<a href="http://www.yefengbar.com/mySite/findpass.html" target="_blank" class="un_lose_pass">忘记密码?</a>' +
					'							<div class="clear"></div>' +
					'						</div>' +
					'						<div class="un_btns">' +
					'							<a href="javascript:;" class="un_btns_log">登录</a>' +
					'							<a href="javascript:;" class="un_btns_reg">注册</a>' +
					'							<div class="clear"></div>' +
					'						</div>' +
					'					</div>' +
					'					<div class="un_inps un_mod_reg">' +
					'						<div class="un_inp rname">' +
					'							<span>用户名&nbsp;:</span>' +
					'							<input type="text" id="un_rname" value="" placeholder="' + Hcq.logFn.msg[1] + '" />' +
					'						</div>' +
					'						<div class="un_tips rname"></div>' +
					'						<div class="un_inp rpass">' +
					'							<span>密　码&nbsp;:</span>' +
					'							<input type="password" id="un_rpass" value="" placeholder="' + Hcq.logFn.msg[2] + '" />' +
					'						</div>' +
					'						<div class="un_tips rpass"></div>' +
					'						<div class="un_inp surePass rpass">' +
					'							<span>Email&nbsp;:</span>' +
					'							<input type="text" id="un_email" value="" placeholder="' + Hcq.logFn.msg[9] + '"/>' +
					'						</div>' +
					'						<div class="un_tips repass"></div>' +
					'						<div class="un_rem">' +
					'							<span class="un_check"></span>' +
					'							<a href="http://www.yefengbar.com/user.html" target="_blank" class="un_lose_pass">已阅读《用户服务协议》</a>' +
					'							<div class="clear"></div>' +
					'						</div>' +
					'						<div class="un_btns">' +
					'							<a href="javascript:;" class="un_btns_regl">注册</a>' +
					'							<div class="clear"></div>' +
					'						</div>' +
					'					</div>' +
					'					<div class="un_inps un_mod_save">' +
					'						<p class="save_tit">注册成功！</p>' +
					'						<div class="save_info">' +
					'							<div class="savediv save_name">' +
					'								<span class="sdtit">用户名:</span>' +
					'								<span class="nameTxt"></span>' +
					'							</div>' +
					'							<div class="savediv save_pass">' +
					'								<span class="sdtit">密码:</span>' +
					'								<span class="passTxt"></span>' +
					'							</div>' +
					'						</div>' +
					'						<p class="saveTxt">赶紧拿笔记下，或<a href="">保存至桌面</a></p>' +
					'						<div class="un_btns">' +
					'							<a href="javascript:;" class="un_btns_done">完成</a>' +
					'							<div class="clear"></div>' +
					'						</div>' +
					'					</div>' +
					'					<div class="un_msg">' +
					'						<div class="logs">' +
					'							<a href="javascript:;" class="un_log_qq"></a>' +
					'							<p class="un_logName"></p>' +
					'							<p class="un_logInfo"></p>' +
					'						</div>' +
					'						<div class="saves">' +
					'							<p class="tipst">温馨提示</p>' +
					'							<p class="tipTxt">请登录邮箱激活账号！<br>默认登录或者注册成功之后一周内自动登录！</p>' +
					'						</div>' +
					'					</div>' +
					'					<div class="clear"></div>' +
					'				</div>' +
					'			</div>' +
					'			<div class="un_bot"></div>' +
					'		</div>';
				$('body').append(logHtml);
				Hcq.logFn.showName();
				$('.un_mod_log .un_inp input').bind('keypress', function(e) {
					var e = e || event;
					if(e.keyCode == 13) {
						Hcq.logFn.doLog()
					}
				});
				$('.un_mod_reg .un_inp input').bind('keypress', function(e) {
					var e = e || event;
					if(e.keyCode == 13) {
						Hcq.logFn.doReg()
					}
				})
			} else {
				window.document.domain = Hcq.logFn.doMain
			}
		},
		open: function(callback) {
			var unHeight = $(this.logDomId).height() / 2;
			$('.un_mod_log .un_tips,.un_mod_reg .un_tips').html("").removeClass('no yes');
			$(this.logDomId + '_mask').fadeIn().css({
				"display": "block"
			});
			$(this.logDomId).show().animate({
				"top": "50%",
				"opacity": "1",
				"margin-top": "-" + unHeight + "px"
			}, 150);
			if(typeof callback === "function") {
				Hcq.logFn.callBacks = callback;
			}
		},
		close: function() {
			$(this.logDomId).animate({
				"top": "-100%",
				"opacity": "0"
			}, 150, function() {
				$(this).hide();
				$(Hcq.logFn.logDomId + '_mask').fadeOut()
			})
		},
		addCSS: function(url) {
			var link = document.createElement('link');
			link.type = 'text/css';
			link.rel = 'stylesheet';
			link.href = url;
			document.getElementsByTagName("head")[0].appendChild(link);
		},
		doLog: function() {
			var name = $('#un_name').val(),
				pass = $('#un_pass').val(),
				ch = Hcq.logFn.remName;
			Hcq.logFn.resetHack();
			$('.un_mod_log .un_tips').html('').removeClass('yes no');
			if(name && /^[a-zA-Z0-9][a-zA-Z0-9_.@]{3,32}$/.test(name)) {
				$('.un_mod_log .un_tips.name').html("").removeClass('no yes');
				if(pass && /[\s|\S]{6,32}/.test(pass)) {
					Hcq.logFn.ieHack();
					$('.un_mod_log .un_tips.pass').html("正在登录···").removeClass('no yes').addClass('yes');
					$.ajax({
						type: "post",
						url: Hcq.logFn.doLogUrl,
						//async: false,
						data: {
							"username": name,
							"password": pass,
							"auto": ch,
							"type": "log"
						},
						dataType: "json",
						success: function(data) {
							if(data.status == 1) {
								switch(Hcq.logFn.defaults.logAction) {
									case 0:
										location.reload();
										break;
									case 1:
										location.href = Hcq.logFn.defaults.logedCallUrl;
										break;
									case 2:
										Hcq.logFn.getUserInfo({
											"name": name,
											"pass": pass,
											"status": 1
										});
										if(typeof Hcq.logFn.callBacks === "function") {
											Hcq.logFn.callBacks();
										}
										Hcq.logFn.close()
										break;
								}
								Hcq.logFn.showName();
							} else {
								$('.un_mod_log .un_tips.pass').html(data.info).addClass('no');
								Hcq.logFn.ieHack()
							}
						}
					});
				} else {
					$('.un_mod_log .un_tips.pass').html(Hcq.logFn.msg[2]).addClass('no');
					Hcq.logFn.ieHack()
				}
			} else {
				$('.un_mod_log .un_tips.name').html(Hcq.logFn.msg[1]).addClass('no');
				Hcq.logFn.ieHack()
			}
		},
		doLog_q: function(name,pass) {
			
			if(name) {
				if(pass && /[\s|\S]{6,32}/.test(pass)) {
					$.ajax({
						type: "post",
						url: Hcq.logFn.doLogUrl,
						//async: false,
						data: {
							"username": name,
							"password": pass,
							"type": "qlog"
						},
						dataType: "json",
						success: function(data) {
							if(data.status == 1) {
								Hcq.logFn.getUserInfo({
									"name": name,
									"pass": pass,
									"status": 1
								});
								Hcq.logFn.callBacks();
								Hcq.logFn.close();
								Hcq.logFn.showName();
							} else {
								layer.msg(data.info)
							}
						}
					});
				} else {
					layer.msg('O! NO!,openId丢失了！')
				}
			} else {
				layer.msg('O! NO!,用户名丢失了！')
			}
		},
		doReg: function() {
			var name = $('#un_rname').val(),
				pass = $('#un_rpass').val(),
				//rpass = $('#un_repass').val(),
				email = $('#un_email').val();
			$('.un_mod_reg .un_tips').removeClass('yes no');
			if(name && /^[a-zA-Z0-9][a-zA-Z0-9_]{4,32}$/.test(name)) {
				//if(!Hcq.logFn.defaults.autokk){
				Hcq.logFn.checkName(name);
				//}
				if(Hcq.logFn.isCheck) {
					if(pass && /[\s|\S]{6,32}/.test(pass)) {
						$('.un_mod_reg .un_tips.rpass').html("").removeClass('no yes');
						if(email  && /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
							$('.un_mod_reg .un_tips').html("").removeClass('no yes');
							$('.un_mod_reg .un_tips.repass').html("正在注册···");
							$.ajax({
								type: "post",
								url: Hcq.logFn.doLogUrl,
								//async: false,
								data: {
									"username": name,
									"password": pass,
									//"repassword": rpass,
									"email":email,
									"type": "reg"
								},
								dataType: "json",
								success: function(data) {
									if(data.status == 1) {
										if(Hcq.logFn.defaults.showSave == 1) {
											$('.un_mod_reg,.un_mod_save').toggle();
											$('.un_msg .logs,.un_msg .saves').toggle();
											$('.un_mod_save .nameTxt').html(name);
											$('.un_mod_save .passTxt').html(pass);
											$('.un_mod_save .saveTxt a').attr({
												"href": Hcq.logFn.defaults.saveInfo + "u=" + name + "&p=" + pass
											});
											$('.un_btns_done').bind('click', function() {
												switch(Hcq.logFn.defaults.regAction) {
													case 0:
														location.reload();
														break;
													case 1:
														location.href = Hcq.logFn.defaults.logedCallUrl;
														break;
													case 2:
														$.extend(Hcq.logFn.userInfo, {
															"name": name,
															"pass": pass,
															"status": 1
														});
														if(typeof Hcq.logFn.callBacks === "function") {
															Hcq.logFn.callBacks();
														}
														Hcq.logFn.close();
														break;
												}
											})
										} else {
											switch(Hcq.logFn.defaults.regAction) {
												case 0:
													location.reload();
													break;
												case 1:
													location.href = Hcq.logFn.defaults.logedCallUrl;
													break;
												case 2:
													$.extend(Hcq.logFn.userInfo, {
														"name": name,
														"pass": pass,
														"status": 1
													});
													if(typeof Hcq.logFn.callBacks === "function") {
														Hcq.logFn.callBacks();
													}
													Hcq.logFn.close();
													break;
											}
										}
										Hcq.logFn.sendEmail(name,pass,email,data.sign)
									} else {
										$('.un_mod_reg .un_tips.repass').html(data.info).addClass('no');
									}
								}
							});
						} else {
							$('.un_mod_reg .un_tips.repass').html(Hcq.logFn.msg[3]).addClass('no');
						}
					} else {
						$('.un_mod_reg .un_tips.rpass').html(Hcq.logFn.msg[2]).addClass('no');
					}
				}
			} else {
				$('.un_mod_reg .un_tips.rname').html(Hcq.logFn.msg[1]).addClass('no');
			}
		},
		showName: function() {
			var name = this.readCookie('username') ? this.readCookie('username') : this.readCookie('nickname');
			var udom = $('.logs .un_logName'),
				tdom = $('.logs .un_logInfo');
			$('#un_name').val('');
			$('#un_pass').val('');
			if(this.readCookie('logtype') == 'qq') {
				udom.html(name);
				tdom.html(Hcq.logFn.msg[6])
			} else if(this.readCookie('logtype') == 'wx') {
				udom.html(name);
				tdom.html(Hcq.logFn.msg[7])
			} else {
				udom.html(name);
				$('#un_name').val(name);
				tdom.html(Hcq.logFn.msg[8])
			}
		},
		autoKk: function() {
			$.ajax({
				url: this.getkkUrl,
				type: "GET",
				dataType: 'jsonp',
				success: function(json) {
					if(eval(json).kk) {
						$(".un_mod_reg #un_rname").val(eval(json).kk);
						$('.un_mod_reg .un_tips.rname').html(Hcq.logFn.msg[0]).removeClass('no').addClass('yes');
					}
				}
			});
		},
		checkName: function(name) {
			$.ajax({
				type: "post",
				url: Hcq.logFn.chkNameUrl,
				data: {
					"name": name,
					"type":"vaildname"
				},
				dataType: "json",
				//async: "false",
				success: function(data) {
					if(data.status == 1) {
						$('.un_mod_reg .un_tips.rname').html(Hcq.logFn.msg[5]).removeClass('no').addClass('yes');
						Hcq.logFn.isCheck = 1;
					} else {
						$('.un_mod_reg .un_tips.rname').html(Hcq.logFn.msg[4]).removeClass('yes').addClass('no');
						Hcq.logFn.isCheck = 0;
					}
				}
			});
		},
		rember: function() {
			//$(Hcq.logFn.logDomId+' .un_mod_log .un_rem .un_check').toggleClass('no');
			var isRem = $(Hcq.logFn.logDomId + ' .un_mod_log .un_rem .un_check').hasClass('no');
			var _this = $(Hcq.logFn.logDomId + ' .un_mod_log .un_rem .un_check');
			if(!isRem) {
				_this.addClass('no');
				_this.attr({
					"style": "background:url(http://www.yefengbar.com/mySite/img/chk_0.png) no-repeat;"
				})
			} else {
				_this.removeClass('no');
				_this.attr({
					"style": "background:url(http://www.yefengbar.com/mySite/img/chk_1.png) no-repeat;"
				})
			}
		},
		getUserInfo: function(options) {
			$.extend(Hcq.logFn.userInfo, options);
			return Hcq.logFn.userInfo;
		},
		saveInfo: function(options) {
			$('.un_mod_reg,.un_mod_save').toggle();
			$('.un_msg .logs,.un_msg .saves').toggle();
			$('.un_mod_save .nameTxt').html(options.name);
			$('.un_mod_save .passTxt').html(options.pass);
			$('.un_mod_save .saveTxt a').attr({
				"href": Hcq.logFn.defaults.saveInfo + "u=" + options.name + "&p=" + options.pass
			});
			$('.un_btns_done').bind('click', function() {
				Hcq.logFn.close()
			})
		},
		logout:function (res){
			$.ajax({
				type: "get",
				url: "http://www.yefengbar.com/post.php",
				data: {"t":"logout"},
				dataType: 'json',
				success: function(result) {
					if(result.status==1){
						if(res == 1){
							window.location.reload();
						}
	                }
				}
			});	
		},
		sendEmail:function(n,p,ee,sign){
			$.ajax({
				type: "post",
				url: 'http://www.yefengbar.com/sendemail/mail.php',
				async: false,
				data: {
					"name": n,
					"pass":p,
					"email": ee,
					"sign": sign,
					"type": "enableUser",
					"rand":Math.random()
				},
				dataType: "json",
				success: function(data) {
					if(data.status == 1) {
						layer.alert('已经向<b style="color:#ef0000">'+ee+'</b>的邮箱发送验证消息，请注意查收，以完成账号激活！',{title:'账号激活'});
					} else {
						layer.msg(data.info)
					}
				}
			});
		},
		qqLog: function() {
			var sign = new Date().getTime();
			this.thirdLogin({
				url: 'http://www.yefengbar.com/qqlogin/oauth/qq_login.php?sign='+sign,
				w: 454,
				h: 320
			});
			Hcq.util.addjs('https://cdn.wilddog.com/sdk/js/2.1.0/wilddog-sync.js');
			setTimeout(function(){
				var config = {
					syncURL: "https://yefengbar.wilddogio.com" //输入节点 URL
				};
				wilddog.initializeApp(config);
				var ref = wilddog.sync().ref('qqlogin');
				ref.limitToLast(1).on("value",function(snapshot){
					//console.log(snapshot.val());
				    $.each(snapshot.val(), function(k,v) {
				    	if(v['sign'] == sign){
					    	Hcq.logFn.userInfo.name= v['name'];
							Hcq.logFn.userInfo.status= 1;
					    	Hcq.logCallback(v['name']);
					    	Hcq.logFn.doLog_q(v['name'],v['openid']);
					    	//console.log(v)
					    	//Hcq.logFn.setCookie('nickname',encodeURIComponent(v['name']),30);
					    	//Hcq.logFn.setCookie('haslog',1,7);
					    	Hcq.logFn.setCookie('logtype','qq',7);
					    	
					    }
				    });
				});
			},1000);
		},
		thirdLogin: function(opt) {
			
			var defaultOpt = {
				w: 454,
				h: 320
			};
			defaultOpt.t = (window.screen.availHeight - 30 - defaultOpt.h) / 2;
			defaultOpt.l = (window.screen.availWidth - 10 - defaultOpt.w) / 2;
			
			var params = 'width=' + defaultOpt.w +
				',height=' + defaultOpt.h +
				',top=' + defaultOpt.t +
				',left=' + defaultOpt.l  + 
				',location=0' //是否显示地址字段。默认是 1
				+
				',menubar=0' //是否显示菜单栏。默认是 1
				+
				',resizable=0' //窗口是否可调节尺寸。默认是 1
				+
				',scrollbars=1' //是否显示滚动条。默认是 1
				+
				',status=1' //是否添加状态栏。默认是 1
				+
				',titlebar=1' //默认是 1
				+
				',toolbar=0';
			window.open(opt.url, '', params);
		},
		ieVersion: function() {
			var _IE = (function() {
				var v = 3,
					div = document.createElement('div'),
					all = div.getElementsByTagName('i');
				while(
					div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
					all[0]
				);
				return v > 4 ? v : false;
			}());
			return _IE;
		},
		readCookie: function(name) {
			var ret = '',
				m;
			if(typeof name === 'string' && name !== '') {
				if((m = String(document.cookie).match(
						new RegExp('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)')))) {
					ret = m[1] ? decodeURIComponent(m[1]) : '';
				}
			}
			return ret;
		},
		setCookie: function(c_name, value, expiredays) {
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + expiredays);
			document.cookie = c_name + "=" + escape(value) + ";path=/;domain=yefengbar.com" + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
		},
		myDate: function(timestamp) {
			d = new Date(timestamp);
			var jstimestamp = (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" + (d.getDate()) + " " + (d.getHours()) + ":" + (d.getMinutes()) + ":" + (d.getSeconds());
			return jstimestamp;
		},
		ieHack: function() {
			$('.un_mod_log').css({
				"height": "205px"
			})
		},
		resetHack: function() {
			$('.un_mod_log').css({
				"height": "195px"
			})
		}
	};
	(function(window, $) {
		Hcq.logFn.init();
		if(Hcq.logFn.ieVersion() <= 8) {
			var sw = $(window).width(),
				sh = $(window).height();
			$('#Hcq.logFn_mask').attr('style', 'width:100%;height:' + sh + 'px;filter:alpha(opacity=50);zoom:1');
			$(Hcq.logFn.logDomId + ' #un_name').bind('click', function() {
				if($(this).val() == '用户名/邮箱/KK号') {
					$(this).val('');
				}
			});
			$(Hcq.logFn.logDomId + ' #un_name').bind('blur', function() {
				if($(this).val() == '') {
					$(this).val('用户名/邮箱/KK号');
				}
			});
		}
		$(Hcq.logFn.logDomId + ' .un_tabs a').bind('click', function() {
			var index = $(this).index();
			Hcq.logFn.toggleUi(index)
		});
		$(Hcq.logFn.logDomId + ' .un_btns_reg').bind('click', function() {
			Hcq.logFn.toggleUi(1)
		});
		$(Hcq.logFn.logDomId + ' .un_btns_log').bind('click', function() {
			Hcq.logFn.doLog();
		});
		$(Hcq.logFn.logDomId + ' .un_btns_regl').bind('click', function() {
			Hcq.logFn.doReg();
		});
		$(Hcq.logFn.logDomId + ' .un_close').bind('click', function() {
			Hcq.logFn.close();
		});
		$(Hcq.logFn.logDomId + ' .un_log_qq').bind('click', function() {
			Hcq.logFn.qqLog();
		});
		$(Hcq.logFn.logDomId + ' .un_mod_log .un_rem span').bind('click', function() {
			Hcq.logFn.rember();
			this.onselectstart = document.body.ondrag = function() {
				return false;
			}
		});
	}(window, jQuery));
})(jQuery, window)