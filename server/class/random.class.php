<?php

defined( 'TM_01' ) or exit( 'something wrong happen' );

class random{
	private static $pdo;
	//单例对象
	private static $instance = null;
	private static $setting = array();

	private function __construct(){
		self::$setting[ 'pdo' ] = PdoMysql::instantiation();
	} 

	public static function getInstance()
	{
		if( self::$instance === null && !( self::$instance instanceof random ) )
		{
			self::$instance = new self();
		}
		return self::$instance;
	}

	/*
	 *	微信分享
	 */
	public static function weiXinShare( $jssdkPath, $AppID, $APPSECRET, $param )
	{
		include $jssdkPath;
		if( is_array( $_POST ) && count( $_POST ) > 0 )
		{
			$url = isset( $_POST[ $param ] )? $_POST[ $param ]: '';
		}
		$jssdk = new JSSDK( $AppID, $APPSECRET, $url );
		$signPackage = $jssdk -> GetSignPackage();
		echo json_encode( $signPackage );
	}

	/*
	 *	报名
	 *	$sign_table => 表名
	 *	$array  => $_POST数组
	 *	$selectFiled => select字段
	 *	$where => where条件
	 */
	public static function sign( $sign_table, $array, $selectFiled = '*', $where = false )
	{
		self::getInstance();
		if( is_array( $_POST ) && count( $_POST ) > 0 )
		{
			foreach( $array as $val )
			{
				$data[ $val ] = $_POST[ $val ];
			}
		}
		if( $where )
		{
			$arr = explode( ',', $where );
			foreach( $arr as $val )
			{
				$arrs[] = $val.'='."'".$data[ $val ]."'";
			}
			$where = join( ' and ', $arrs );
		}
		$time = $_SERVER[ 'REQUEST_TIME' ];
		$data[ 'time' ] = $time;
		$sql = "select ".$selectFiled." from ".$sign_table;
		$sql .= $where? " where $where": '';
		$count = self::$setting[ 'pdo' ] -> getRowCount( $sql );
		if( $count > 0 ) 
		{
			//报名已提交
			echo 2;
		}else{
			$count_1 = self::$setting[ 'pdo' ] -> add( $sign_table, $data );
			if( $count_1 > 0 ) {
				//报名成功
				echo 1;
			}
		}
	}

	/*
	 *	统计
	 */
	public static function count( $count_table, $friends, $circle, $where, $param )
	{
		self::getInstance();
		if( is_array( $_POST ) && count( $_POST ) > 0 )
		{
			$type = isset( $_POST[ $param ] )? $_POST[ $param ]: '';
		}
		if( $type == 1 ){
			//分享给朋友次数统计
			$sql = "update ".$count_table." set ".$friends." where ".$where;
			self::$setting[ 'pdo' ] -> execute( $sql );
		}else if( $type == 2 ){
			//分享给朋友圈次数统计
			$sql = "update ".$count_table." set ".$circle." where ".$where;
			self::$setting[ 'pdo' ] -> execute( $sql );
		}
	}
}







































?>