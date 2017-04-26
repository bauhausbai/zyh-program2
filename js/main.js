//授权
 var openId = $.cookie( 'Football_luck_openId' );
 if( openId == null ) {window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa5157ae965ef509a&redirect_uri=http://ng.xiaoyoubbs.com/wap/oauth/userInfo?siteType=hylink&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect&backUrlParam=aHR0cHM6Ly93d3cuYmFpZHUuY29tLw=="; }

var gameControl = true;
var globalScore = 0;
var desc = '超哥领衔！球技比拼开始啦！快进游戏一起群殴吧！长虹空调大奖赢回家！';
$(function () {
	var act = 'care';
	var token = encryption( act, 'TM_01' );
	$.ajax({
		type: 'POST',
		url: './code/core.php?type=' + act +'&token=' + token +'&rand='+Math.random(),
		data: { 'openid': openId },
		dataType: 'json',
		success: function (data) {
			
		}
	});

	$('.music').bind('touchend', function(e){
		e.preventDefault();
		var audio = document.getElementById('audio')
		if(audio.paused){
			audio.play();
			$(this).removeClass('no').addClass('an-music-play');
		}else{
			audio.pause();
			$(this).removeClass('an-music-play').addClass('no');
		}
	});

	$("#home .begin").on('click', function () {

		if (gameControl) {
			var act = 'inquiry';
			var token = encryption( act, 'TM_01' );
			var t = new Date();
            var month = t.getMonth() + 1;
            var date;
            if (t.getDate() < 10) {
                date = "0" + t.getDate();
            } else {
                date = t.getDate().toString();
            }
            var datime = month.toString() + date;
			var last_times = $.cookie( "last_times" );

			if (last_times && last_times != 0) {
				gameControl = false;
				$("#game").show();
				game();

			} else {
				console.log(333);
				$.ajax({
					type: 'POST',
				    url: "./code/core.php?type=" + act +"&token=" + token +'&rand='+Math.random(),
				    data: { 'openid': openId, 'datime': datime },
				    async: false,
				    dataType: 'json',
				    success: function (data) {
				    	console.log(data);
				    	if (data != 0) {
				    		gameControl = false;
				    		$("#game").show();
				    		$('#gameShade').show();
							game();
				    	} else {
				    		$("#twmbtn").show();
				    	}
				    }
				})
			}
		}
		
	});

	$("#home .rule").on('click', function(){
		$("#rule").show();
	});

	//排行榜
	$("#home .rank").on('click', function(){

		rank();
	});

	//提交新信息
	$("#rank .yes").on('click', function(){
		var act = 'addr';
		var token = encryption( act, 'TM_01' );
		$.ajax({
			type: 'POST',
			url: "./code/core.php?type=" + act +"&token=" + token +'&rand='+Math.random(),
			data: { 'openid': openId },
			dataType: 'json',
			success: function (data) {
				$("#mess").show();
				$("#rank").hide();
				if(data == 0){
					$("#mess .update").hide();
					$("#mess .yes").show();
				}else{
					$("#mess .yes").hide();
					$("#mess .update").show();
					$("#mess .inp-name").val(data.name);
					$("#mess .inp-phone").val(data.phone);
					$("#mess .inp-addr").val(data.addr);
				}
			}
		})		
	});

	//信息栏关闭
	$("#mess .off").on('click', function(){
		$("#mess").hide();
		$("#rank").show();
	});

	//信息栏提交
	$("#mess .yes").on('click', function(){
		infoSubmit();
	});

	//信息栏修改
	$("#mess .update").on('click',function(){
		infoSubmit();
	});

	//游戏规则单
	$("#rule .off").on('click', function(){
		$("#rule").hide();
	});

	//2维码关闭按钮
	$("#twmbtn .off").on('click', function(){
		$("#twmbtn").hide();
	});

	$("#twm .off").on('click', function(){
		$("#twm").hide();
		$("#scoring").show();
	});

	//排行榜关闭
	$("#rank .off").on('click', function(){
		$("#rank").hide();
	});

	//分享
	$("#scoring .share").on('click', function(){
		$("#scoring").hide();
		$("#share").show();
	});

	//关闭分享界面
	$("#share").on('click',function(){
		$("#share").hide();
		$("#scoring").show();
	});

	//scoring界面下的排行榜
	$("#scoring .rank").on('click',function(){
		rank();
	});

	//scoring界面返回首页
	$("#scoring .back").on('click',function(){
		$("#scoring").hide();
		$("#game").hide();
		$("#home").show();
	});

	$("#scoring .tipsbtn").on('click',function(){
		$("#scoring").hide();
		$("#twm").show();
	});

	$("#scoring .link").on('click',function(){
		var a = Math.floor(100*Math.random());
		if (a < 5) {
			window.location.href = "http://mall.jd.com/qr/v.html?type=js&Id=135276&src=qr&resourceType=jdapp_share&resourceValue=CopyURL&utm_source=iosapp&utm_medium=appshare&utm_campaign=t_335139774&utm_term=CopyURL";
		} else if (a>=5 && a<15) {
			window.location.href = "http://prom.m.gome.com.cn/html/prodhtml/topics/201606/1/salevXoZZMFpfc0.html";
		} else if (a>=15 && a<45) {
			window.location.href = "http://shop.m.suning.com/30000009.html?from=singlemessage&isappinstalled=1";
		} else {
			window.location.href = "http://sale.jd.com/m/act/2ofgzUcBInu.html?t=1464666813652";
		}
	});
	


	function infoSubmit () {
		console.log(999);
		var name = $("#mess .inp-name").val(),
			phone = $("#mess .inp-phone").val(),
			addr = $("#mess .inp-addr").val(),
			tel = /^1\d{10}$/,
			act = 'addr2',
			token = encryption( act, 'TM_01' );

		if (name) {
			if (tel.test(phone)) {
				if (addr) {

					$.ajax({
						type: 'POST',
						url: './code/core.php?type=' + act +'&token=' + token +'&rand='+Math.random(),
						data: { 'openid': openId, 'name': name, 'phone': phone, 'addr': addr },
						dataType: 'json',
						success: function (data) {
							layer.msg('提交成功');
						}
					});

				} 
				else {
					layer.msg('请填写地址');
				}
			} 
			else {
				layer.msg("请填写正确的手机号码");
			}
		} 
		else {
			layer.msg("请填写姓名");
		}
		
	}

	function rank () {
		var act = 'top',
			token = encryption( act, 'TM_01' ),
			act1 = 'mytop',
			token1 = encryption( act1, 'TM_01' ),
			act2 = 'information',
			token2 = encryption( act2, 'TM_01' ),
			act3 = 'pop',
			token3 = encryption( act3, 'TM_01' );

		if (!$("#rank .myRank").html()) {
			$.ajax({
				type: 'POST',
				url: './code/core.php?type=' + act +'&token=' + token +'&rand='+Math.random(),
				data: { 'openid': openId },
				dataType: 'json',
				success: function (data) {
					var chunk = "",
					e;
					for (var i=0;i<data.length;i++) {
						e = i+1;
						chunk += '<li><span class="rank">' + e + '</span><span class="nickname">' + data[i].nickname + '</span><span class="score"><label>' + data[i].point + '</label>分</span></li>';
					}
					$("#rank .rank-con").append(chunk);
				}
			});

			$.ajax({
				type: 'POST',
				url: './code/core.php?type=' + act1 +'&token=' + token1 +'&rand='+Math.random(),
				data: { 'openid': openId },
				dataType: 'json',
				success: function (data) {
					$("#rank .myRank").text(data);
				}
			});

			$.ajax({
				type: 'POST',
				url: './code/core.php?type=' + act2 +'&token=' + token2 +'&rand='+Math.random(),
				data: { 'openid': openId },
				dataType: 'json',
				success: function (data) {
					$("#rank .myScore").text(data.point);
				}
			});

			$.ajax({
				type: 'POST',
				url: './code/core.php?type=' + act3 +'&token=' + token3 +'&rand='+Math.random(),
				data: { 'openid': openId },
				dataType: 'json',
				success:function(data){
					$("#rank .all").text(data);
				}
			})
		}


		
		$("#rank").show();
	}
});

function game () {
	var can = document.getElementById("gameCanvas"),
		ctx = can.getContext("2d"),
		shootBtn = document.getElementById("shoot"),
		w = 750,		//画布宽度
		h = 1218,		//画布高度
		imgs = [],		//储存所有图片
		loadCount = 0,  //已加载完成图片数量
		imgSize = [
			{w:750, h:89},
			{w:750, h: 234},
			{w:120, h:125},
			{w:93, h:225},
			{w:133, h:322},
			{w:133, h:322},
			{w:138, h:105},
			{w:85, h:220},
			{w:122, h:315},
			{w:122, h:315},
			{w:122, h:315},
			{w:122, h:315},
			{w:122, h:315},
			{w:122, h:315},
			{w:122, h:315},
			{w:122, h:315},
			{w:122, h:315},
			{w:122, h:315},
			{w:122, h:315},
			{w:111, h:244},
			{w:155, h:339},
			{w:155, h:339},
			{w:750, h:314},
			{w:120, h:125},
			{w:49, h:56},
			{w:56, h:55},
			{w:81, h:78},
			{w:81, h:78},
			{w:93, h:51},
			{w:18, h:63},
            {w:132, h:47}
		],				//顺序记录所有图片尺寸
		bgBaseline = [],//背景基线
		bgTop = 0,		//背景Y轴偏移像素
		over = false,	//游戏进行/结束
		speed = 5,      //背景移动速度
		playerCount = 0,//单体动画，每6帧切换一次
		ballCount = 0,  //足球动画
		starCount = 0,  //星星动画
		p = {px: 300, py: 850, sy: 1110, by: 980, startX: 0, newX: 0},  //邓超，足球，滑动块位置控制
		equals = [],	//抢球者位置信息
		equalNum = [],  //抢球者编号
		equalSize = [{w:imgSize[7].w, h:imgSize[7].h},{w:imgSize[7].w, h:imgSize[7].h},{w:imgSize[7].w, h:imgSize[7].h},{w:imgSize[7].w, h:imgSize[7].h}], //抢球者图片尺寸
		equalCeil = 20,  //抢球者产生的概率equalCeil/1000
		startTime = 0,   //游戏开始时间
		door = {w:imgSize[22].w, h:imgSize[22].h, sx: 0, sy: -300},  //球门
		keeper = {w:imgSize[19].w, h:imgSize[19].h, sx:300, sy:-180, v: -5},  //守门员
		shootScore = 0,  //射门得分，射中10分，未射中0分
		score = 0,       //游戏分数
		shoot = true,	 //控制射门按钮出现
		shooted = false, //是否已经点击射门
		angel = 0,	     //射门瞄准角度
		angelControl = 2,//角度增量
		ball = {},         //踢出的球
        add = [];        //加分动画

	for (var i=0;i<31;i++){
        imgs[i] = new Image();
    }

    for (var i = -imgSize[0].h; i < h; i += imgSize[0].h) {
    	bgBaseline.push(i);
    }

	function loadSource () {
		var l = imgs.length;

		imgs[0].src = "images/game_bg.jpg";
		imgs[1].src = "images/game_panel.png";
		imgs[2].src = "images/game_shoot1.png";
		imgs[3].src = "images/chao1.png";
        imgs[4].src = "images/chao2.png";
        imgs[5].src = "images/chao3.png";
		imgs[6].src = "images/player_slider.png";
		imgs[7].src = "images/martial1.png";
		imgs[8].src = "images/martial2.png";
		imgs[9].src = "images/martial3.png";
		imgs[10].src = "images/b1.png";
		imgs[11].src = "images/b2.png";
		imgs[12].src = "images/b3.png";
		imgs[13].src = "images/c1.png";
		imgs[14].src = "images/c2.png";
		imgs[15].src = "images/c3.png";
		imgs[16].src = "images/d1.png";
		imgs[17].src = "images/d2.png";
		imgs[18].src = "images/d3.png";
		imgs[19].src = "images/k1.png";
		imgs[20].src = "images/k2.png";
		imgs[21].src = "images/k3.png";
		imgs[22].src = "images/door.png";
		imgs[23].src = "images/game_shoot.png";
		imgs[24].src = "images/game_star.png";
		imgs[25].src = "images/ball1.png";
		imgs[26].src = "images/ball2.png";
		imgs[27].src = "images/ball3.png";
		imgs[28].src = "images/bow.png";
		imgs[29].src = "images/arrow.png";
        imgs[30].src = "images/score.png";

		for (i in imgs) {
			imgs[i].onload = function () {
				loadCount++;
				loadCount === l && addEvent(); 
			}
		}
	}

	function addEvent () {
		$("#gameShade").hide();

		can.addEventListener('touchstart', function(e){
            var touch = e.targetTouches[0];
            var x = Number(touch.pageX);  
            p.startX = x;   
        });

        can.addEventListener('touchmove', function(e){
            if (e.targetTouches.length == 1) {
                var touch = e.targetTouches[0];
                var right = w - imgSize[6].w;

                p.newX = touch.pageX;
                p.px = p.px + p.newX - p.startX;
                p.px > right && (p.px = right);
                p.px < 0 && (p.px = 0);
                p.startX = p.newX;         
            } 
        });

        shootBtn.addEventListener('touchend', function(e) {
        	if (shooted === false) {
        		shooted = true;
        		$("#shoot").hide();
        	}
        });

        $("#home .begin").on('touchend', function () {
        	var act = 'inquiry';
			var token = encryption( act, 'TM_01' );
			var t = new Date();
            var month = t.getMonth() + 1;
            var date;
            if (t.getDate() < 10) {
                date = "0" + t.getDate();
            } else {
                date = t.getDate().toString();
            }
            var datime = month.toString() + date;
			var last_times = $.cookie( "last_times" );

			if (last_times && last_times != 0) {

				$("#game").show();
				setting();

			} else {
				$.ajax({
					type: 'POST',
				    url: "./code/core.php?type=" + act +"&token=" + token +'&rand='+Math.random(),
				    data: { 'openid': openId, 'datime': datime },
				    async: false,
				    dataType: 'json',
				    success: function (data) {
				    	if (data != 0) {
				    		$("#game").show();
				    		setting();
				    	} else {
				    		$("#twmbtn").show();
				    	}
				    }
				})
			}
        });

        $("#scoring .start").on('click', function(){
			var act = 'inquiry';
			var token = encryption( act, 'TM_01' );
			var t = new Date();
            var month = t.getMonth() + 1;
            var date;
            if (t.getDate() < 10) {
                date = "0" + t.getDate();
            } else {
                date = t.getDate().toString();
            }
            var datime = month.toString() + date;
			var last_times = $.cookie( "last_times" );

			if (last_times && last_times != 0) {

				$("#scoring").hide();
				$("#game").show();
				setting();

			} else {
				$.ajax({
					type: 'POST',
				    url: "./code/core.php?type=" + act +"&token=" + token +'&rand='+Math.random(),
				    data: { 'openid': openId, 'datime': datime },
				    async: false,
				    dataType: 'json',
				    success: function (data) {
				    	if (data != 0) {
				    		$("#scoring").hide();
				    		$("#game").show();
				    		setting();
				    	} else {
				    		$("#scoring").hide();
				    		$("#twmbtn").show();
				    	}
				    }
				})
			}
		});

		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false); 

		setting();
	}

	function setting () {
		can.width = 750;
		can.height = 1218;
		over = false;
		speed = 5;
		p = {px: 300, py: 850, sy: 1110, by: 980, startX: 0, newX: 0};
		startTime = +new Date();
		equals.length = 0;
		equalNum.length = 0;
		door = {w:imgSize[22].w, h:imgSize[22].h, sx: 0, sy: -300};
		keeper = {w:imgSize[19].w, h:imgSize[19].h, sx:300, sy:-180, v: -5};
		shootScore = 0;
		score = 0;
		shoot = true;
		shooted = false;
		delete ball.x;
		delete ball.y;
		delete ball.r;
		delete ball.a;

		countDown();
	}

	function countDown (ctx) {

		loop();
	}

	function loop () {
		var time;
		ctx.clearRect(0, 0, w, h);
        
        time = +new Date();

        bgRender();
        if (time - startTime < 20000) {
        	equalsRender(true);
        } else {
        	equalsRender(false);
        	doorRender();
        }

        ctx.drawImage(imgs[30], 20, 20, imgSize[30].w, imgSize[30].h);
        scoreRender(ctx);
        addRender(ctx, add);
        panelRender();
        playerRender();
        colli();
        
        over === false && window.setTimeout(loop, 1e3/60);
	}

	function bgRender () {
		bgTop += speed;
		bgTop > 88 && (bgTop = 0);  //不加括号报错
		for (i in bgBaseline) {
			ctx.drawImage(imgs[0], 0, bgBaseline[i]+bgTop, imgSize[0].w, imgSize[0].h);
		}
	}

	function panelRender () {
		ctx.drawImage(imgs[1], 0, 998, imgSize[1].w, imgSize[1].h);
		ctx.drawImage(imgs[2], 630, 1020, imgSize[2].w, imgSize[2].h);
	}

	function playerRender () {
		var pic,
			ball;
        playerCount < 18 ? playerCount++ : playerCount = 0;
        playerCount < 12 ? (playerCount < 6 ? pic = imgs[3] : pic = imgs[4]) : pic = imgs[5];

        if (shooted === false) {
        	ballCount < 27 ? ballCount++ : ballCount = 0;
	        ballCount < 18 ? (ballCount < 9 ? ball = imgs[25] : ball = imgs[26]) : ball = imgs[27];
	        ctx.drawImage(ball, p.px+50, p.by, imgSize[25].w, imgSize[25].h);
        }
        
        ctx.drawImage(pic, p.px, p.py, imgSize[3].w, imgSize[3].h);
        
        ctx.drawImage(imgs[6], p.px-28, p.sy, imgSize[6].w, imgSize[6].h);

	}

	function equalsRender (judge) {
        var a = random(1000),
        c,
        d,
        e,
        b,
        f;

        if (a < equalCeil && judge) {
            b = random(4);
            for (i in equalNum) {
                if (b == equalNum[i]) {b = -1}
            }

            if (b != -1) {
                equalNum.push(b);
                createEqual(b);
            }
        }

        if (equals[0]) {
            for (i in equals) {
                c = equals[i];
                
                playerCount < 12 ? (playerCount < 6 ? d = 0 : d = 1) : d = 2;
                ctx.drawImage(imgs[c.i[d]], c.x, c.y, c.w, c.h);

                //(c.x < 0 || c.x > 750-c.w) && (c.vx = -c.vx);
                if (c.x>750-c.w || c.x<0) {
                    c.vx = -c.vx;
                }

                c.x += c.vx;
                c.y += c.vy;

                if (c.y > 1000) {
                    e = (c.i[0]-1)/3-2;
                    equalNum.splice(equalNum.indexOf(e), 1);
                    equals.splice(i, 1);
                    score++;
                    f = {x:p.px, y:p.by-100};
                    add.push(f);
                }
                
            }
        }
    }

	function doorRender () {
		var pic;
        playerCount < 12 ? (playerCount < 6 ? pic = imgs[19] : pic = imgs[20]) : pic = imgs[21];
        if (keeper.sx < 100 || keeper.sx > 500) {
        	keeper.v = -keeper.v;
        }
        keeper.sx += keeper.v;
        keeper.sy += speed;
		door.sy += speed;

		//door.sy > -1 && (speed = 0);
		if (door.sy > -1 && shooted === false) {
			speed = 0;
			if (!equals[0]) {shootRender();}
		} else if (shooted === true) {
			ballRender();
		}

		ctx.drawImage(imgs[22], door.sx, door.sy, door.w, door.h);
		ctx.drawImage(pic, keeper.sx, keeper.sy, keeper.w, keeper.h);
	}

	function shootRender () {
		var pic;

		//绘制星星
		starCount < 60 ? starCount++ : starCount = 0;
		starCount < 30 && ctx.drawImage(imgs[24], 690, 960, imgSize[24].w, imgSize[24].h);

		//射门按钮
		if (shoot === true) {
			$("#game .shoot").show();
			shoot = false;
		}

		//弓
		ctx.drawImage(imgs[28], p.px+38, p.py+106, imgSize[28].w, imgSize[28].h);

		//箭
		angel += angelControl;
		angel > 89 && (angelControl=-2);
		angel < -89 && (angelControl=2);
		ctx.save();
		ctx.translate(p.px+85, p.py+145);
		ctx.rotate(angel*Math.PI/180);
		ctx.drawImage(imgs[29], -imgSize[29].w/2, -imgSize[29].h);
		ctx.restore();
	}

	function ballRender () {
		var pic,
			a,
			x,
			y;
		if (ball.x) {

			ball.r += 15;
			a = Math.PI*ball.a/180;
			x = ball.x-ball.r*Math.cos(a);
			y = ball.y-ball.r*Math.sin(a);
			ballCount < 27 ? ballCount++ : ballCount = 0;
	        ballCount < 18 ? (ballCount < 9 ? pic = imgs[25] : pic = imgs[26]) : pic = imgs[27];
	        ctx.drawImage(pic, x, y, imgSize[25].w, imgSize[25].h);

	        shootColli(x, y);
		} else {
			ball.x = p.px + 50;
			ball.y = p.by;
			ball.r = 0;
			ball.a = angel+90;
		}
	}

    function scoreRender (ctx) {
        ctx.font = "22px Verdana",
        ctx.fillStyle = "#fff",
        ctx.fillText(score+"分", 85, 55);
    }

    function addRender (ctx, add) {
        for (i in add) {
            if (add[i].y<600) {
                add.splice(i, 1);
            } else {
                add[i].y -= 3;
                ctx.font = "32px Verdana",
                ctx.fillStyle = "#fffd5a",
                ctx.fillText("+1", add[i].x, add[i].y);
            }
        }
    }

	function colli () {
		var a,
		b = p,
		c,
		d,
		e,
		f = {x:b.px+50+imgSize[25].w, y:b.by},
		g = {x:b.px+50, y:b.by};

		for (i in equals) {
			a = equals[i];
			c = {x:a.x, y:a.y};
			d = {x:a.x, y:a.y+a.h};
			e = {x:a.x+a.w, y:a.y+a.h};
			if ((f.x>d.x&&f.x<g.x&&f.y>c.y&&f.y<d.y) || (g.x>d.x&&g.x<e.x&&g.y>c.y&&g.y<d.y)) {
				gameOver();
			}
		}
	}

	//keeper = {w:imgSize[19].w, h:imgSize[19].h, sx:300, sy:-180, v: -5},  //守门员
	function shootColli (x, y) {
		var k = keeper,
			m = x + imgSize[25].w;

		if (y<270 && x>66 && x<666) {
			shootScore = 10;
			gameOver();
		} else if (x<0 || x>750) {
			shootScore = 0;
			gameOver();
		} else if ((y>k.sy&&y<k.sy+k.h-33&&m>k.sx+40&&m<k.sx+k.w-40) || (y>k.sy&&y<k.sy+k.h-33&&x>k.sx+40&&x<k.sx+k.w-40)) {
			shootScore = 0;
			gameOver();
		}
	}

	function random (rand, base) {
		"undefined" == typeof base && (base = 0);
        return Math.floor(Math.random()*rand) + base;
	}

	function createEqual (num) {
        var b = [],
            c = Math.random()*2,
            d;
        c > 1 ? c = 1 : c = -1;
        switch (num)
        {
        case 0:
            b = [7, 8, 9];
            break;
        case 1:
            b = [10, 11, 12];
            break;
        case 2:
            b = [13, 14, 15];
            break;
        case 3:
            b = [16, 17, 18];
            break;
        }
        var a = {
            x: random(750-equalSize[num].w),
            y: random(200,-300),
            w: equalSize[num].w,
            h: equalSize[num].h,
            vy: random(2, 6),
            vx: c*random(3, 4),
            i: b
        };
        
        equals.push(a);
    }

	function gameOver () {
		over = true;
		var time = +new Date();
		var act = 'care';
		var token = encryption( act, 'TM_01' );
		var t = new Date();
        var month = t.getMonth() + 1;
        var date;
        if (t.getDate() < 10) {
            date = "0" + t.getDate();
        } else {
            date = t.getDate().toString();
        }
        var datime = month.toString() + date;

		score = score + shootScore;
		globalScore = score;
		if (globalScore == 0) {
	        desc = '超哥领衔！球技比拼开始啦！快进游戏一起群殴吧！长虹空调大奖赢回家！';
	    } else if (globalScore > 0) {
	        desc = '超哥秒杀，踢爆欧洲杯！够叼你也来试试，长虹空调大奖赢回家哦！';
	    } else {
	        desc = '超哥领衔！球技比拼开始啦！快进游戏一起群殴吧！长虹空调大奖赢回家！';
	    }


		$.ajax({
			type: 'POST',
			url: './code/core.php?type=' + act +'&token=' + token +'&rand='+Math.random(),
			data: { 'openid': openId },
			dataType: 'json',
			success: function (data) {
				var dat1 = data;
				var act2 = 'newpoint';
				var token2 = encryption( act2, 'TM_01' );
				$.ajax({
					type: 'POST',
				    url: "./code/core.php?type=" + act2 +"&token=" + token2 +'&rand='+Math.random(),
				    data: { 'openid': openId, 'datime': datime, 'np': score },
				    dataType: 'json',
				    success: function (data) {
				    	$.cookie( "last_times", data.hp, {expires: 7});
				    	console.log(data);
				    	$("#twm .score").text(data.point);
						$("#twm .tscore").text(score);
						$("#scoring .score").text(data.point);
						$("#scoring .tscore").text(score);
				    	if (dat1 == 0) {

							$("#twm").show();

						} else if (dat1 == 1) {

							$("#scoring").show();
							$("#scoring .tips").hide();
							$("#scoring .tipsbtn").hide();
							
						}
				    }
				});

			}
		});

		wxshare();
	}

	loadSource();
}

function wxshare () {
	var wxurl = location.href.split( '#' )[ 0 ];
    var title = '超哥单挑欧洲杯五侠！';
    //var desc;// = '球技再飒，超哥秒杀，阵容再叼，一脚撂倒! 劲爆欧洲杯球技比拼开始啦，快进游戏一起群殴吧！';
    var imgUrl = 'http://www.hylinkcd-ad.com/active/M2016/changhong_0601_football/images/share.jpg';
    var link = 'http://www.hylinkcd-ad.com/active/M2016/changhong_0601_football/';
    var act = 'weinxinjs';
    var token = encryption( act, 'TM_01');
    
    $.ajax({
        type: "POST",
        url: "./code/core.php?type="+act+"&token="+token+"&rand="+Math.random(),
        data: ( { "wxurl": wxurl } ),
        dataType: "json",
        success: function( data ) {
            wx.config({
                debug: false,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: [
                    // 所有要调用的 API 都要加到这个列表中
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline'
                ]
            });

            wx.error(function(res){
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                //alert(res);
            });

            //wx.ready(function () {
                // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareAppMessage({
                    title: title,
                    desc: desc,
                    link: link,
                    imgUrl: imgUrl,
                    trigger: function (res) {
                        // alert('用户点击发送给朋友');
                    },
                    success: function (res) {                                   
                        // alert('已分享');
                        //分享给朋友次数统计
                        var t = new Date();
                        var month = t.getMonth() + 1;
                        var date;
                        if (t.getDate() < 10) {
                            date = "0" + t.getDate();
                        } else {
                            date = t.getDate().toString();
                        }
                        var datime = month.toString() + date;
                        var act = 'extra';
                        var token = encryption( act, 'TM_01');
                        //$.post( './code/core.php?datime='+datime+'&type='+act+'&token='+token+'&rand='+Math.random(), { 'type': 1 } );
                        $.ajax({
                            type: 'POST',
                            url: './code/core.php?type='+act+'&token='+token+'&rand='+Math.random(),
                            data: { 'openid': openId, 'datime': datime },
                            dataType: 'json',
                            success: function (data) {
                            }
                        });
                    },
                    cancel: function (res) {
                        // alert('已取消');
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });

                // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
                wx.onMenuShareTimeline({
                    title: desc,
                    desc: desc,
                    link: link,
                    imgUrl: imgUrl,
                    trigger: function (res) {
                        // alert('用户点击分享到朋友圈');
                    },
                    success: function (res) {                                
                        // alert('已分享');
                        //分享给朋友圈次数统计
                        var t = new Date();
                        var month = t.getMonth() + 1;
                        var date;
                        if (t.getDate() < 10) {
                            date = "0" + t.getDate();
                        } else {
                            date = t.getDate().toString();
                        }
                        var datime = month.toString() + date;
                        var act = 'extra';
                        var token = encryption( act, 'TM_01');
                        //$.post( './code/core.php?datime='+datime+'&type='+act+'&token='+token+'&rand='+Math.random(), { 'type': 2 } );
                        $.ajax({
                            type: 'POST',
                            url: './code/core.php?type='+act+'&token='+token+'&rand='+Math.random(),
                            data: { 'openid': openId, 'datime': datime },
                            dataType: 'json',
                            success: function (data) {
                            }
                        });
                    },
                    cancel: function (res) {
                        // alert('已取消');
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            //});

            //判断当前客户端版本是否支持指定JS接口
            wx.checkJsApi({
                jsApiList: [
                'getNetworkType',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'previewImage'
                ],
                success: function (res) {
                    //alert(JSON.stringify(res));
                }
            });
        }
    });
}