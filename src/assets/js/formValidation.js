function validarCajasVacias() {
    let inputNombre = document.getElementById("txt_nombre").value;
    let inputDescripcion = document.getElementById("txt_descripcion").value;
    let inputFoto = document.getElementById("txt_foto").value;

    if (!inputNombre || !inputDescripcion || !inputFoto) {
        return true;
    } else { return false; }
}