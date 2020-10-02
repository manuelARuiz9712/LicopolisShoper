let UrlBase  = "http://localhost/DismelAdminPage/public/api/";
$(function(){

// console.log(
//     location.host,
//     location.hostname,
//     location.href,
//     location.pathname
// );

    $("#btnSalir").click(()=>{

        Swal.fire({
            title: 'Confirmar',
            text: 'Esta seguro de querer cerrar sesion',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'SI',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
               
                localStorage.removeItem("sesion");
                window.location = location.pathname+"/.."+"/index.html";
            // For more information about handling dismissals please visit
            // https://sweetalert2.github.io/#handling-dismissals
            } else if (result.dismiss === Swal.DismissReason.cancel) {
          
            }
          })

    });
})