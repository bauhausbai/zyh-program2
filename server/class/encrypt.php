<?php
/*
 *	base64_encode加密
 */

defined( 'TM_01' ) or exit( 'something wrong happen' );

function enCode( $string, $skey ) 
{  
    $skey = array_reverse( str_split( $skey ) );  
    $strArr = str_split( base64_encode( $string ) ); 
    $strCount = count( $strArr );  
    foreach ( $skey as $key => $value ) 
	{  
        $key < $strCount && $strArr[ $key ] .= $value;  
    }
	
    return join( '', $strArr );  
} 

/*
 *	base64_decode解密
 */
function deCode( $string , $skey )
{  
    $skey = array_reverse( str_split( $skey ) );  
    $strArr = str_split( $string, 2 ); 
    $strCount = count( $strArr );  
    foreach ( $skey as $key => $value ) 
	{  
        $key < $strCount && $strArr[ $key ] = $strArr[ $key ]{ 0 };  
    }  
    return base64_decode( join( '', $strArr ) );
}  
?>