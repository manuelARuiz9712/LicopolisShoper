$(function(){


    console.log(location.pathname);
    if( localStorage.getItem("sesion") !== null ){
        window.location = "ListadoArticulos.html";
    }

    $("#EnviarAccion").click( evt=>{

        let correo = $("#Correo").val();
        let pass = $("#password").val();

        console.log(correo,pass);


        if( correo == ''  || pass == '' ){
            Swal.fire("Los campos estan vacios")
        }else{

            $.ajax({
                url:"http://localhost/DismelAdminPage/public/api/mobile/LoginLicpolis",
                dataType:"json",
                type:"post",
                data:{
                    correo:correo,
                    clave:pass
                }
            }).then(result=>{
               console.log(result);
          
              if(result.state == false ){
                  Swal.fire(result.msg)
              }else{
                  
                localStorage.setItem("sesion",JSON.stringify(result.value));
                window.location = "ListadoArticulos.html";

              }
          
          
            }).catch(error=>{
              console.log(error);
            });


        }




    } );








})