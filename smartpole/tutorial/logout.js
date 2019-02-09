function logout()
{
  localStorage.removeItem("token");
  localStorage.removeItem("uname");
  window.location.href="index.html"
}
