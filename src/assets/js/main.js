function sumar() {
  var num1 = document.getElementById("num1").value;
  var num2 = document.getElementById("num2").value;
  var resultado = parseFloat(num1) + parseFloat(num2);
  document.getElementById("resultado").innerHTML = resultado;
}