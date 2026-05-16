<?php
require_once __DIR__ . "/../../assets/config.php";
include __DIR__ . "/../../ado/fxns.php";
include __DIR__ . "/../../assets/advanceSQL.php";

function signIn($param){
    if( !isset($param['email']) || !isset($param['password_hash'])){
        die( Error(2, "Invalid Paramaters for Authentication", $param) );
    }

    $username = $param['email'];
    $pass = $param['password_hash'];

    [$err, $result] = advanceSelect('users', "*", ['email'=>$username, 'password_hash'=>$pass]);
    
    // die("YOYOOY");

    if( $err ){
        die(Error(2, 'unable to perform authentication ' . $err));
    }

    if(!count($result)) {
        die(Error(2, 'Invalid credentials' . $param['email']));
    }

    return $result[0]??null;
}


if (isset($_POST['email'], $_POST['password_hash'])) {
    $param = [
        'email' => $_POST['email'],
        'password_hash' => $_POST['password_hash']
    ];
    $user = signIn($param);
    $profile = null;
    $role = $user['role'];
    // get profile
    if($role=='supplier' || $role=='resident') {
        [$err, $profiles] = advanceSelect($role."_profile", "*", ['user_id'=>$user['id']]);
        // if not error and profile exists
        if(!$err && count($profiles)){
            $profile = $profiles[0];
        }
    }

    echo Result("Authentication Sucessful", ['user'=>$user, 'profile'=>$profile]);
    exit(0);
}else{
    die(Error(2, "Invalid Paramaters for Authentication", $_POST));
}