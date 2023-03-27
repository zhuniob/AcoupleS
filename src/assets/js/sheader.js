// sidebar toggle
const btnToggle = document.querySelector('.toggle-btn');

btnToggle.addEventListener('click', function () {
  console.log('clik')
  document.getElementById('sidebar').classList.toggle('active');
  console.log(document.getElementById('sidebar'))
});


const btn_reaccion = document.querySelector('.btn_reaccion');

btn_reaccion.addEventListener('click', function() {
  btn_reaccion.classList.toggle('active');
});




// buscarSolicitudes() {
//   let id_cliente = "1"; // id del cliente a buscar
//   this.solicitudService.getAllSolicitudesByPersonaID(id_cliente).subscribe((data) => {
//     this.resultado = data;
//     console.log(data); // Muestra el resultado en la consola
//   });
// }