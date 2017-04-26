<?php
//自定义getUserInfo函数
function getUserInfo( $code ) {
	//应用ID
	$appid = "wxa5157ae965ef509a";
	//应用密匙
	$appsecret = "a687c2d26e1856b9091b3325d2cf0ce4";
	$access_token = "";

	//根据code获取Access_Token
	$access_token_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$appid."&secret=".$appsecret."&code=".$code."&grant_type=authorization_code";
	$access_token_json = https_request( $access_token_url );
	//将json格式转换成array
	$access_token_array = json_decode( $access_token_json, true);
	//获取access_token
	$access_token = $access_token_array[ 'access_token' ];
	//获取openid
	$openid = $access_token_array[ 'openid' ];
	//获取用户基本信息
	$userinfo_url = "https://api.weixin.qq.com/sns/userinfo?access_token=".$access_token."&openid=".$openid."&lang=zh_CN";
	$userinfo_json = https_request( $userinfo_url );
	$userinfo_array = json_decode( $userinfo_json, true );
	return $userinfo_array;
}

//获取用户细节信息
function getUserDetail($code)
{
	$appid = "wxa5157ae965ef509a";
	$appsecret = "a687c2d26e1856b9091b3325d2cf0ce4";

    //oauth2的方式获得openid
	$access_token_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=$appid&secret=$appsecret&code=$code&grant_type=authorization_code";
	$access_token_json = https_request($access_token_url);
	$access_token_array = json_decode($access_token_json, true);
	$openid = $access_token_array['openid'];

    //非oauth2的方式获得全局access token
    $new_access_token_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appid&secret=$appsecret";
    $new_access_token_json = https_request($new_access_token_url);
	$new_access_token_array = json_decode($new_access_token_json, true);
	$new_access_token = $new_access_token_array['access_token'];
    
    //全局access token获得用户基本信息
    $userinfo_url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=$new_access_token&openid=$openid";
	$userinfo_json = https_request($userinfo_url);
	$userinfo_array = json_decode($userinfo_json, true);
	return $userinfo_array;
}
//自定义https_request
function https_request( $url, $data = null ) {
    $curl = curl_init();
    curl_setopt( $curl, CURLOPT_URL, $url );
    curl_setopt( $curl, CURLOPT_SSL_VERIFYPEER, FALSE );
    curl_setopt( $curl, CURLOPT_SSL_VERIFYHOST, FALSE );
    if ( !empty( $data ) ) {
        curl_setopt( $curl, CURLOPT_POST, 1 );
        curl_setopt( $curl, CURLOPT_POSTFIELDS, $data );
    }
    curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
    $output = curl_exec( $curl );
    curl_close( $curl );
    return $output;
}

/*
 *	对请求数据进行过滤
 */
function check_input( $value ) {
	//去除斜杠(PHP6以下)
	$value = trim( strip_tags( $value ) );
	if( !is_numeric( $value ) ) {
		//正则表达式替换掉所有的特殊字符
		$regex = "/\/|\~|\!|\@|\#|\\$|\%|\^|\&|\*|\(|\)|\_|\+|\{|\}|\:|\<|\>|\?|\[|\]|\,|\.|\/|\;|\'|\`|\-|\=|\\\|\|/";
		$value = preg_replace( $regex, '', $value ); 
	}
	return $value;
}

//防止sql注入攻击
function daddslashes ( $string, $force = 0 ) {
	if ( !get_magic_quotes_gpc() || $force ) {
		if ( is_array( $string ) ) {
			foreach ( $string as $_k => $_v ) {
				$string[ $_k ] = daddslashes( $_v, $force );
			}
		} else {
			$string = addslashes( $string );
		}
	}
	return $string;
}


function qmy($openid){
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
	return $userinfo_array;
}
