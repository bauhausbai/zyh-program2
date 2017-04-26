<?php
header( "content-type:text/html;charset=utf-8" );
require("class/pdo_mysql.class.php");

//单例模式
$pdo = PdoMysql::instantiation();

$openid = $_GET['openid'];
$url = $_GET['url'];
$openid=base64_decode($openid);
$url=base64_decode($url);
/*
$appid = "wxa5157ae965ef509a";
$appsecret = "a687c2d26e1856b9091b3325d2cf0ce4";


//非oauth2的方式获得全局access token
$new_access_token_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appid&secret=$appsecret";
$new_access_token_json = https_request($new_access_token_url);
$new_access_token_array = json_decode($new_access_token_json, true);
$new_access_token = $new_access_token_array['access_token'];

//全局access token获得用户基本信息
$userinfo_url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=$new_access_token&openid=$openid";
$userinfo_json = https_request($userinfo_url);
$userinfo_array = json_decode($userinfo_json, true);
var_dump($userinfo_array);

*/

	// 微信用户唯一openId
	//$openid = $userinfo_array['openid'];
if( $openid != NULL ) {
	//写入数据库
	$sql = "select id from Football_data where openid='{$openid}'";
	$count = $pdo -> getRowCount( $sql );
	if($count>0){
		setcookie( 'Football_luck_openId', $openid, time()+3600*24*10, '/');
	}else{
		$count_1 = $pdo -> add( 'Football_data', array( 'openid' => $openid ));
		setcookie( 'Football_luck_openId', $openid, time()+3600*24*10, '/' );
	}
	header( "Location:http://www.hylinkcd-ad.com/active/M2016/changhong_0601_football/index.html" );
}