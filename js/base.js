/**
 * auther:yefengbar.com
 * date:2016-10-9 11:05
 * version:0.1.0
 * */
;(function($,Dom){
	Hcq = window.Hcq || {};
	Hcq.default = {};
	/**
	 * conf
	 * @param options //配置参数
	 * */
	Hcq.conf = function(options){
		$.extend(true, Hcq.default, options);
		Hcq.init()
	}
	/**
	 * init
	 * @param init //初始化
	 * */
	Hcq.init = function(){
		switch (Hcq.default.pageType){
			case 'index':Hcq.pt_index();
				break;
			case 'findpass':Hcq.pt_fpass();
				break;
			case 'editPass':Hcq.pt_epass();
				break;
			case 'enableUser':Hcq.pt_euser();
				break;
			default:
				layer.msg('配置信息错误！')
				break;
		}
	}
	/**
	 * pt_index
	 * @param pt_index //首页功能
	 * */
	Hcq.pt_index = function(){
		Hcq.flash('slideshow','slidenum',4000);
		//login
		var isLog = Hcq.logFn.readCookie('haslog');
		isLog && logCallback();
		//logbtn
		function logCallback(){
			isLog = Hcq.logFn.readCookie('haslog'),isName = Hcq.logFn.readCookie('username'),n_from = Hcq.logFn.readCookie('logtype'),vemail = Hcq.logFn.readCookie('vemail');
			var uName =  isName || Hcq.logFn.userInfo.name;
			if(n_from == 'qq' || n_from == 'wx'){
				//var uName =  decodeURIComponent(Hcq.logFn.readCookie('nickname'));
			}else{
				if(vemail == 0){
					layer.alert('检测到您的账号还未激活，登录邮箱查看激活邮件，请尽快激活账号以保证账号安全和真实性！如已激活请忽略！',{title:'账号激活'})
				}
			}
			$('#header .log').html('<span class="user_top_name" style="cursor:pointer" title="进入个人中心">欢迎：'+uName+'</span> <a href="javascript:;">[退出]</a>');
			$('#user_name').html(uName);
			$('.warp').removeClass('blur');
			$('#header .log a').unbind('click');
			$('#header .log a').bind('click',function(){
				logouts();
				Hcq.logFn.logout()
			})
			$('#header .log .user_top_name').bind('click',function(){
				var params = 'width=1366' +
				',height=768' +
				',top=0' +
				',left=0' +
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
				window.open('http://www.yefengbar.com/mySite/userCenter.html', '', params);
			});
			
		}
		$('#header .log a').bind('click',function(){
			Hcq.logFn.open(logCallback);
			Hcq.logFn.toggleUi(0);
			blurPage();
		});
		//logouts
		function logouts(){
			$('#header .log').html('<a href="javascript:;">登录 | 注册</a>');
			$('#header .log a').bind('click',function(e){
				//alert(e.target);
				Hcq.logFn.open(logCallback);
				Hcq.logFn.toggleUi(0);
				blurPage();
			});
		}
		function cli_log(){
			Hcq.logFn.open(logCallback);
			Hcq.logFn.toggleUi(0);
			blurPage();
		}
		//wache login status
		function blurPage(){
			$('.warp').addClass('blur');
			var timer = setInterval(function(){
				var showLog = $('#union').is(':hidden');
				showLog && clearTimer()
			},500);
			function clearTimer(){
				$('.warp').removeClass('blur');
				clearInterval(timer)
			}
		}
	}
	/**
	 * logcallback
	 * @param uName //回调的用户名-此方法只用于第三方登录
	 ***/
	
	Hcq.logCallback = function (uName){
		$('#header .log').html('<span class="user_top_name" style="cursor:pointer" title="进入个人中心">欢迎：'+uName+'</span> <a href="javascript:;">[退出]</a>');
		$('#user_name').html(uName);
		$('.warp').removeClass('blur');
		$('#header .log a').unbind('click');
		$('#header .log a').bind('click',function(){
			Hcq.logFn.logout('1');
		})
			$('#header .log .user_top_name').bind('click',function(){
				var params = 'width=1366' +
				',height=768' +
				',top=0' +
				',left=0' +
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
				window.open('http://www.yefengbar.com/mySite/userCenter.html', '', params);
			});
	}
	/**
	 * pt_fpass
	 * @param pt_fpass //找回密码功能
	 * */
	Hcq.pt_fpass = function(){
		$('.fpass .un_btns_log').bind('click',function(){
			var name = $('#f_name').val(),
			email = $('#f_email').val();
			if(name && /^[a-zA-Z0-9][a-zA-Z0-9_.@]{3,32}$/.test(name)) {
				//if(email && /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
					layer.msg("正在验证，请稍后···");
					findMyPass(name)
				//} else {
				//	layer.msg("邮箱格式不正确！");
				//}
			} else {
				layer.msg("用户名不存在！");
			}
		});
		function findMyPass(name){
					$.ajax({
						type: "post",
						url: Hcq.logFn.doLogUrl,
						async: false,
						data: {
							"name": name,
							"type": "fpass"
						},
						dataType: "json",
						success: function(data) {
							if(data.status == 1) {
								sendEmail(name,data.info,data.sign)
							} else {
								layer.msg(data.info)
							}
						}
					});
				
		}
		function sendEmail(n,ee,sign){
				$.ajax({
					type: "post",
					url: 'http://www.yefengbar.com/sendemail/mail.php',
					async: false,
					data: {
						"name": n,
						"email": ee,
						"sign": sign,
						"type": "fpass",
						"rand":Math.random()
					},
					dataType: "json",
					success: function(data) {
						if(data.status == 1) {
							layer.alert('已经向<b style="color:#ef0000">'+ee+'</b>的邮箱发送验证消息，请注意查收，以完成密码找回！',{title:'密码找回'});
						} else {
							layer.msg(data.info)
						}
					}
				});
		}
	}
	/**
	 * pt_epass
	 * @param pt_epass //修改密码功能
	 * */
	Hcq.pt_epass = function(){
		var n = Hcq.util.getParam('name'),sign = Hcq.util.getParam('sign');
		$(function(){
			//setUsername
//			var timer = setInterval(checkName,1000);
//			function checkName(){
//				var names = $('#f_name').val(n);
//				if(names){
//					clearInterval(timer);
//				}else{
//					var n = Hcq.util.getParam('name'),sign = Hcq.util.getParam('sign');
//					$('#f_name').val(n);
//				}
//			}
			$('#f_name').val(n);
			setTimeout(function(){
				$('#f_name').val(n);
			},1000);
			//tijiao
			$('.fpass .un_btns_log').bind('click',function(){
				var p = $('#f_pass').val();
				if(p && /[\s|\S]{6,32}/.test(p)) {
					layer.msg("正在提交，请稍后···");
					sendEpass(n,p,sign)
				} else {
					layer.msg("密码不合法，请修改！");
				}
			});
		});
		function sendEpass(n,p,sign){
			$.ajax({
				type: "post",
				url:  Hcq.logFn.doLogUrl,
				async: false,
				data: {
					"name": n,
					"pass": p,
					"sign": sign,
					"type": "epass",
					"rand":Math.random()
				},
				dataType: "json",
				success: function(data) {
					if(data.status == 1){
						setTimeout(function(){
							location.href="http://www.yefengbar.com/mySite"
						},2000)
					}else if(data.status == 2){
						setTimeout(function(){
							location.href="http://www.yefengbar.com/mySite/findpass.html"
						},2000)
					}else{
						
					}
					layer.msg(data.info);
				}
			});
	}
	}
	/**
	 * pt_euser
	 * @param pt_euser //激活账号功能
	 * */
	Hcq.pt_euser = function(){
		var n = Hcq.util.getParam('name'),e = Hcq.util.getParam('email'),sign = Hcq.util.getParam('sign');
		setTimeout(function(){
			$('#f_name').val(n);
			$('#f_email').val(e);
			sendEuser(n,e,sign);
		},1000);
		function sendEuser(n,e,sign){
			$.ajax({
				type: "post",
				url:  Hcq.logFn.doLogUrl,
				//async: false,
				data: {
					"name": n,
					"email": e,
					"sign": sign,
					"type": "euser",
					"rand":Math.random()
				},
				dataType: "json",
				success: function(data) {
					if(data.status == 1){
						$('#article .enable_res').html('<p style="font-size: 28px;line-height: 200%;text-align:center;color:#009F95">恭喜！账号激活成功！</p>');
						
					}else{
						$('#article .enable_res').html('<p style="font-size: 28px;line-height: 200%;text-align:center;color:#ef0000">抱歉！账号激活失败！</p>')
					}
					layer.msg(data.info);
				}
			});
		}
	}
	/**
	 * 轮播效果
	 * @param dom //轮播id
	 * @param pdom //轮播圆点
	 * @param speed //速度
	 * */
	Hcq.flash = function(dom,Pdom,speed){
		var index =1;
        var star = true;
        var num = $('#'+dom+' li').size();
        var gun = setInterval(function(){
            if(star){
                $('#'+dom+' li').eq(index).css({"z-index":"2"}).fadeIn().siblings().css({"z-index":"1"}).fadeOut(); 
                $('#'+Pdom+' li').eq(index).addClass('cur').siblings().removeClass('cur');
                index++;  
            if(index === num) index = 0;  
            }
        },speed); 
        $(function(){
            $('#'+dom+' li').eq(0).css({"z-index":"2"});
            $('#'+dom+' li').hover(function(){
                star = false;
                index =$('#'+dom+' li').index(this);
                $(this).fadeIn().siblings().fadeOut();
            },function(){
                star = true;
            });
            for(var i=1;i<=num;i++){
                $('#'+Pdom).append('<li>'+i+'</li>');
            }
            $('#'+Pdom+' li').eq(0).addClass('cur');
            $('#'+Pdom+' li').hover(function(){
            star = false;
                var toshow = $(this).html();
                $(this).addClass('cur').siblings().removeClass('cur');
                $('#'+dom+' li').eq(toshow-1).fadeIn().siblings().fadeOut();
            },function(){
                star = true;
            });
        });
	}
})(jQuery,window)
