<?php
include __DIR__ . "/../../assets/config.php";
include __DIR__ . "/../../ado/fxns.php";
include __DIR__ . "/../../assets/advanceSQL.php";

function signUp($param){
    if( !isset($param['email']) || !isset($param['password_hash'])){
        die( Error(2, "Invalid Paramaters for Authentication", $param) );
    }

    // default role is resident
    $param['role'] = $param['role']=='supplier'?'supplier':'resident';
    /* $username = $param['email'];
    $pass = $param['PasswordHash']; */

    $result = advanceInsert('users', $param);

    if( $result[0] ){
        die(Error(2, 'unable to perform authentication ' . $result[0]));
    }

    return $result[1]??null;
}

if(isset($_POST) && count($_POST)){

    if (isset($_POST['name'], $_POST['phone'], $_POST['email'], $_POST['password_hash'], $_POST['role'])) {
        $param = [
            'name' => $_POST['name'],
            'phone' => $_POST['phone'],
            'email' => $_POST['email'],
            'password_hash' => $_POST['password_hash'],
            'role' => $_POST['role']
        ];
        //register user
        $result = signUp($param);
        echo Result("Registration Sucessful", $result);
        exit(0);
    }else{
        die(Error(2, "Invalid Paramaters for Registration", $_POST));
    }
}else{
    die(Error(2, "Invalid Request Method for Registration", $_POST));
}