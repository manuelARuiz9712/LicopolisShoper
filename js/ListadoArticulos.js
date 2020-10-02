console.log("Base url",UrlBase);
let ListadoArticulos = [];
let sesion = localStorage.getItem("sesion");

if(sesion == null ){
    window.location = location.pathname+"/.."+"/index.html";
}


sesion = JSON.parse(sesion);




function AprobarPedido(idPedido){


    $.ajax({
        url: UrlBase+"licpolisapp/AprobarPedido",
        data:{ pedidoId:idPedido },
        type:"post",
        dataType:"json",
        beforeSend:(xhr)=>{
            xhr.setRequestHeader("Authorization","Bearer "+sesion.TokenLogin);
        }
    }).then(result=>{
        console.log( result.state,"estado a" );
        if( result.state === true ){
            Swal.fire("Pedido Aprobado","el pedido fue aprobado con exito","success");
        }else{
            Swal.fire("Advertencia",result.msg,"warning");
        }

    }).catch(error=>{
        Swal.fire("Error del servidor","No pudimos enviar tu peticion","error");
        console.log(error);

    });

}


function RechazarPedido(idPedido){


    $.ajax({
        url:+UrlBase+"licpolisapp/RechazarPedido",
        data:{ pedidoId:idPedido },
        type:"post",
        dataType:"json",
        beforeSend:(xhr)=>{
            xhr.setRequestHeader("Authorization","Bearer "+sesion.TokenLogin);
        }
    }).then(result=>{
        console.log( result.state,"estado a" );
        if( result.state === true ){

        }else{
            Swal.fire("Advertencia",result.msg,"warning");
        }

    }).catch(error=>{
        Swal.fire("Error del servidor","No pudimos enviar tu peticion","error");
        console.log(error);

    });

}




function DisplayInfo(itemInfo,index){
   
    
    return  ` <tr>
    <th>${itemInfo.idPedido}</th>
    <th>${itemInfo.Nombres}</th>
    <th>${itemInfo.Created_at}</th>
    <th>${ itemInfo.EstadoPedido_idEstadoPedido }</th>
    <th>${ Intl.NumberFormat().format(itemInfo.ValorPedido) }  </th>
    <th> <button onclick="onShowPedido('${index}')"  class="btn btn-sm btn-round btn-primary" ><img  src="img/eye.png"  width="24"  height="24" /></button> </th>
    <th> <button onclick="AprobarPedido('${itemInfo.idPedido}')"  class="btn btn-sm btn-round btn-success"  ><img  src="img/tick.png"  width="24"  height="24" /></button> </th>
    <th> <button onclick="RechazarPedido('${itemInfo.idPedido}')"  class="btn btn-sm btn-round btn-danger"  ><img  src="img/delete.png"  width="24"  height="24" /></button> </th>
</tr>`;


}

function onShowPedido(index){

console.log("pedido Seleccionado",ListadoArticulos[index]);
localStorage.setItem("pedidoSeleccionado",JSON.stringify( ListadoArticulos[index] ) );
window.location = "DetallePedido.html";

}

$(function(){

 





    $.ajax({
        url:UrlBase+"licpolisapp/GetPedidosDisponibles",
        type:"post",
        dataType:"json",
        beforeSend:(xhr)=>{

          xhr.setRequestHeader("Authorization","Bearer "+sesion.TokenLogin);

        }
    }).then(result=>{

        if( result.state == true ){
            ListadoArticulos = result.value;
            let ListHtml = "";
            ListadoArticulos.forEach( (element,index)=>{

                ListHtml = ListHtml  + DisplayInfo(element.Info,index);


            } );
            $("#tablePedido").append(ListHtml);
            $("#tableId").DataTable({
                //searching:false,
                ordering:false,
                pageLength:5,
                lengthChange:false,
                dom: 'Bfrtip',
                buttons: [
                     'excel', 'pdf'
                  ],
                language:{
                    "sProcessing":     "Procesando...",
                    "sLengthMenu":     "Mostrar _MENU_ registros",
                    "sZeroRecords":    "No se encontraron resultados",
                    "sEmptyTable":     "Ningún dato disponible en esta tabla",
                    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                    "sInfoPostFix":    "",
                    "sSearch":         "Buscar:",
                    "sUrl":            "",
                    "sInfoThousands":  ",",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst":    "Primero",
                        "sLast":     "Último",
                        "sNext":     "Siguiente",
                        "sPrevious": "Anterior"
                    }
                    
                }
                

            });

        }else{
            Swal.fire(result.msg);
            setTimeout(()=>{
                window.location = "/";
            },2000);
        }

    }).catch(error=>{
        Swal.fire("Error del servidor");
        console.log(error);
    });





});
