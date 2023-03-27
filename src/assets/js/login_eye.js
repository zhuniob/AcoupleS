function showPassword() {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
    document.getElementById("show-password").classList.add("fa-eye-slash");
    document.getElementById("show-password").classList.remove("fa-eye");
  } else {
    x.type = "password";
    document.getElementById("show-password").classList.add("fa-eye");
    document.getElementById("show-password").classList.remove("fa-eye-slash");
  }
}
