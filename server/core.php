<?php
require("class/config.php");
require("class/function.php");
require("class/pdo_mysql.class.php");
require("class/random.class.php");
require("class/encrypt.php");

if( is_array( $_POST ) && count( $_POST ) > 0 )
{
	$type = isset( $_GET[ 'type' ] )? $_GET[ 'type' ]: '';
	$token = isset( $_GET[ 'token' ] )? $_GET[ 'token' ]: '';
	$rand = isset( $_GET[ 'rand' ] )? $_GET[ 'rand' ]: '';
	if( $type != deCode( $token, 'TM_01') )
	{
		exit( '123' );
	}
}else{
	exit('wrong');
}

$type = $_GET[ 'type' ];


switch( $type ) {

		//微信分享SDK接口
	case 'weinxinjs':

		random::weiXinShare( "jssdk.php", "wx276189b7d7f1be8e", "5b0f51b4061f76bb3d6cc47742b0cbb7", "wxurl" );
		break;



		//分享成功增加积分与次数
			//时间格式为月份开头.日期，例如5月的25日，传值525，12月31日传值1231，时间写入数据库为int标量类型。
	case 'extra':	

		$pdo = PdoMysql::instantiation();
		//获取核心数据
		$datime = $_POST[ 'datime' ];
		$openid = $_POST[ 'openid' ];
		//奖励积分与次数
		
		$sql = "select share from football_data where openid='$openid'";
		$data = $pdo -> getOne( $sql );
		$share = $data['share'];
		if( $share ==0 ){
			$sql = "update football_data set hp= hp+1, share= share+1, point= point+3 where openid='$openid'";
			$data = $pdo -> execute( $sql );
			echo json_encode(1);
		}elseif($share >0){
			$sql = "select uptime from football_data where openid='$openid'";
			$data = $pdo -> getOne( $sql );
			if($datime > $data['uptime']){
				$sql = "update football_data set hp= hp+1, share= 1, uptime=$datime, point= point+3 where openid='$openid'";
				$data = $pdo -> execute( $sql );
				echo json_encode(2);
			}else{
				if($share<20){
					$sql = "update football_data set point= point+3, share= share+1 where openid='$openid'";
					$data = $pdo -> execute( $sql );
					echo json_encode(3);
				}else{
					if($share >=20){
						echo json_encode(4);
					}	
				}		
			}			
		}
		break;



		//查询相关次数
	case 'inquiry':
		$pdo = PdoMysql::instantiation();
		$openid = $_POST['openid'];
		$datime = $_POST['datime'];
		$sql = "select uptime from football_data where openid='$openid'";
		$data = $pdo -> getOne( $sql );
		if($datime > $data['uptime'] || $datime=NULL){
			$sql = "update football_data set hp= 10, uptime= $datime where openid='$openid'";
			$data = $pdo -> execute( $sql );
			echo json_encode("10");
		}else{
			$sql ="select hp from football_data where openid='$openid'";
			$data = $pdo -> getOne( $sql );
			echo json_encode($data['hp']);
		}
		break;

		//更新积分
			//时间格式为月份开头.日期，例如5月的25日，传值525，12月31日传值1231，时间写入数据库为int标量类型,积分写入数据库为int标量类型。
	case 'newpoint':

		$pdo = PdoMysql::instantiation();
		//获取核心数据
		$openid = $_POST[ 'openid' ];
		$datime = $_POST[ 'datime' ];
		$np = $_POST['np'];
		//写入开始
		//1.首先判断时间更新hp次数
		$sql = "select uptime from football_data where openid='$openid'";
		$data = $pdo -> getOne( $sql );
		if( $datime > $data['uptime'] ){
			$sql = "update football_data set hp= 10 where openid='$openid'";
			$data = $pdo -> execute( $sql );
			//正常写入
			$sql = "update football_data set point= point+$np where openid='$openid'";
			$data = $pdo -> execute( $sql );
			$sql = "update football_data set hp= hp-1 where openid='$openid'";
			$data = $pdo -> execute( $sql );
			$sql = "update football_data set uptime= $datime where openid='$openid'";
			$data = $pdo -> execute( $sql );
			$sql = "select hp, point from football_data where openid='$openid'";
			$data = $pdo -> getOne( $sql );
			//返回剩余次数
			echo json_encode($data);
		}else{
			//2.这是时间相同或时间异常的情况,需要查询剩余次数
			$sql = "select hp from football_data where openid='$openid'";
			$data = $pdo -> getOne( $sql );
			if( $data['hp'] > 0 ){
				//正常写入
				$sql = "update football_data set point= point+$np where openid='$openid'";
				$data = $pdo -> execute( $sql );
				$sql = "update football_data set hp= hp-1 where openid='$openid'";
				$data = $pdo -> execute( $sql );
				$sql = "update football_data set uptime= $datime where openid='$openid'";
				$data = $pdo -> execute( $sql );
				$sql = "select hp, point from football_data where openid='$openid'";
				$data = $pdo -> getOne( $sql );
				//返回剩余次数
				echo json_encode($data);
			}else{
				//剩余次数耗尽的情况
				$hp = $data['hp'];
				echo json_encode($hp);
			}
		}
		break;



		//基本信息查询
	case 'information':
		$pdo = PdoMysql::instantiation();
		$openid = $_POST[ 'openid' ];
		$message = array();
		$sql = "select nickname, point from football_data where openid= '$openid'";
		$data = $pdo -> getOne( $sql );
		$message['nickname'] = $data['nickname'];
		$message['point'] = $data['point'];
		echo json_encode($message);
		break;

	//判断关注
	case 'care':
		$openid= $_POST['openid'];
		$qmy = qmy($openid);
		$nickname= $qmy['nickname'];
		$sub = $qmy['subscribe'];
		if($sub==0 || $sub ==NULL){
			echo json_encode(0);
		}else{
			$pdo = PdoMysql::instantiation();
			$sql = "update football_data set nickname= '$nickname' where openid= '$openid' ";
			$data = $pdo -> execute( $sql );
			//判断是否已加hp次数，没有就增加一次		
			$sql = "select care from football_data where openid= '$openid'";
			$data = $pdo -> getOne( $sql );
			if($data['care']==0){
				$sql = "update football_data set care= 1, hp= hp+1, point= point+10 where openid='$openid'";
				$data = $pdo -> execute( $sql );
			}
			echo json_encode(1);
		}
		break;

	//排行榜
	case 'top':
		$pdo = PdoMysql::instantiation();
		$arr = array();
		$sql = "select nickname, point from football_data where care=1 order by point desc limit 10";
		$arr =$pdo -> getAll( $sql );
		//转换中文并打包
    	/*foreach ( $arr as $key => $value ) {  
        	$arr[$key] = urlencode ( $value );  
    	}	  
    	echo urldecode ( json_encode ( $arr ) ); */
    	echo json_encode($arr);
		break;


	//领奖地址信息查询
	case 'addr':
		$pdo = PdoMysql::instantiation();
		$arr = array();
		$openid = $_POST['openid'];
		$sql = "select name, phone, addr from football_data where openid= '$openid'";
		$arr = $pdo -> getOne( $sql );
		if($arr['name']=='123' || $arr['phone']=='123' || $arr['addr']=='123'){
			$arr = 0;
		}  
    	echo  json_encode ( $arr );    
		break;

	//领奖信息写入与修改
	case 'addr2':
		$pdo = PdoMysql::instantiation();
		$openid = $_POST['openid'];
		if(!get_magic_quotes_gpc()){
		$name = addslashes($_POST['name']);
		$phone = addslashes($_POST['phone']);
		$addr = addslashes($_POST['addr']);
		}

		$sql = "update football_data set name= '$name', phone= '$phone', addr= '$addr' where openid= '$openid'";
		$data = $pdo -> execute( $sql );  
    	echo urldecode ( json_encode ($data) );    
		break;
		
		//参与人数查询
	case 'evtop':
		$pdo = PdoMysql::instantiation();
		$sql = "select id from football_data";
		$data = $pdo -> getRowCount($sql);
		echo json_encode($data);
		break;

		//我的排名查询
	case 'mytop':
		$pdo = PdoMysql::instantiation();
		$openid = $_POST['openid'];
		$sql = "select point from football_data where openid='$openid'";
		$data = $pdo ->getOne($sql);
		$mypoint = $data['point'];
		$sql = "select id from football_data where point> $mypoint";
		$data = $pdo -> getRowCount($sql);
		$mytop = $data+1;
		echo json_encode($mytop);
		break;

	case 'pop':
		$q= time();
		$w= $q - 1465186257 ;
		$e =$w/60;
		$r = floor($e) -55;
		echo json_encode(21476);
		break;
}