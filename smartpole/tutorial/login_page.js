function user_register(){
  var uname = $('#unameregister').val();
  var pwd = $('#pwdregister').val();
  $.ajax({
    url:'/signup',
    method:'POST',
    contentType:'application/x-www-form-urlencoded',
    data:'name='+uname+'&password='+pwd,
    success: function(response){
      alert(response.message)
    }
  });
}
function user_login(){
  var uname = $('#txtuname').val();
  var pwd = $('#txtpwd').val();
  $.ajax({
    url:'/authenticate',
    method:'POST',
    contentType:'application/x-www-form-urlencoded',
    data:'name='+uname+'&password='+pwd,
    success: function(response){
      if(response.message=="Enjoy your token!"){
        //alert(response.message);
        localStorage.setItem("token",response.token);
        localStorage.setItem("uname",uname);
        window.location.href="front_page.html"
      }
      else{
        alert(response.message);
      }
    }
  });
}
