let search = document.getElementById("search-icon");
let icon = document.querySelector(".icon");
let main = document.querySelector("main");
let menu_list = document.querySelector(".menu-list");

search.onclick = function () {
  let search_input = document.getElementById("search-input");
  search_input.classList.toggle("active");
};

icon.addEventListener("click", () => {
  main.classList.toggle("move");
  menu_list.classList.toggle("active");
});

// function mostrarTabla(idTabla) {
// 			// oculta todas las tablas
// 			document.querySelectorAll('.tabla').forEach(tabla => {
// 				tabla.style.display = 'none';
// 			});

// 			// muestra la tabla seleccionada
// 			document.getElementById(idTabla).style.display = 'table';
// 		}

 // Funciones para mostrar/ocultar las tablas
 
  function mostrarTabla1() {
  document.getElementById("tabla1").style.display = "block";
  document.getElementById("tabla2").style.display = "none";
}

 function mostrarTabla2() {
  document.getElementById("tabla1").style.display = "none";
  document.getElementById("tabla2").style.display = "block";
}
