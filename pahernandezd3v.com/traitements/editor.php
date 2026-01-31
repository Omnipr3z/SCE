<?php
session_start();
if(!isset($_SESSION['username'])){
    include "index.php";
}else{
    include "sc_editor/index.php";
}