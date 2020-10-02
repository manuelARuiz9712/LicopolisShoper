
console.log("Base url",UrlBase);
let sesion = localStorage.getItem("sesion");
let PedidoSeleccionado = localStorage.getItem("pedidoSeleccionado");
let FilterProductos = [];
let MediosPagoArray = [];
let tableFilter = null;
if( sesion == null || PedidoSeleccionado == null ){
    window.location = "index.html";
}else{
    sesion = JSON.parse(sesion);
    PedidoSeleccionado = JSON.parse(PedidoSeleccionado);
}


function AccionAgregarProductos(index){

    let objectArticulo = {
        Cantidad:0,
        Codigo:"",
        ICO:"",
        IVA:"",
        Impuestos:"",
        NombreProducto:"",
        PrecioBase:0,
        PrecioUnidad:0,
        idProductos:0
    }

    let productoSeleccionado = FilterProductos[index];
    objectArticulo.Cantidad = 1;
    objectArticulo.Codigo = productoSeleccionado.info.Codigo;
    objectArticulo.ICO  = productoSeleccionado.info.ICO;
    objectArticulo.IVA = productoSeleccionado.info.IVA;
    objectArticulo.Impuestos = productoSeleccionado.info.Impuestos;
    objectArticulo.NombreProducto = productoSeleccionado.info.NombreProducto;
    objectArticulo.PrecioBase = productoSeleccionado.info.PrecioBase;
    objectArticulo.PrecioUnidad = productoSeleccionado.info.Precio;
    objectArticulo.idProductos = productoSeleccionado.info.idProductos;
   

    console.log("Producto seleccionado",FilterProductos[index]);
    let found  = false;
    
    
    for (let indexP = 0; indexP < PedidoSeleccionado.items.length; indexP++) {
        const element = PedidoSeleccionado.items[indexP];
        if( productoSeleccionado.info.idProductos === element.idProductos ){
            found = true;
            break;
        }

        
    }

    if(found ){

        Swal.fire("Advertencia","El producto ya fue agregado a la lista","warning");

    }else{

        PedidoSeleccionado.items.push(objectArticulo);
        DisplayItemArray();
        $('#modalSearchProducto').modal('hide');

    }

  




}

function LoadConceptos(){

    $.ajax({
        url:UrlBase+"mobile/LoadConceptosPedidos",
        type:"get",
        dataType:"json",
        beforeSend:function(xhr){

            xhr.setRequestHeader("Authorization","Bearer "+sesion.TokenLogin);
    
        }
    }).done(result=>{

        if( result.state === true ){
            console.log("Load Concepto");
            
            result.value.ArrayMediosPagos.forEach( (element,index)=>{
                $("#medioPago").append("<option value='"+element.IdMedioPago+"' >"+element.CodigoPago+" - "+element.NombrePago+" </option>");
            } );
            MediosPagoArray =   result.value.ArrayMediosPagos;  
            result.value.ConceptosDomicilios.forEach( (element,index)=>{
                $("#ConceptoDomicilio").append("<option value='"+element.IdConceptoDomicilio+"' >"+element.IdConceptoDismel+" - "+element.NombreConcepto+" - "+element.ValorConceptoDomicilio+" </option>");
            });
            result.value.TiposPagos.forEach( (element,index)=>{
                $("#tipoPago").append("<option value='"+element.idTipoPago+"' >"+element.NombreTipoPago+" </option>");
            });
            result.value.arrayBancos.forEach( (element,index)=>{
                $("#banco").append("<option value='"+element.idbanco+"' >"+element.nombrebanco+" </option>");
            });


            $("#medioPago").val(PedidoSeleccionado.Info.MedioPagoId);
            $("#ConceptoDomicilio").val(PedidoSeleccionado.Info.ConceptoDomicilioId);
            $("#CodigoTransaccion").val(PedidoSeleccionado.Info.CodigoTransaccion);
            $("#tipoPago").val(PedidoSeleccionado.Info.TipoPago);
            $("#banco").val(PedidoSeleccionado.Info.BancoId);
            
            

        }else{


        }
        

    }).fail(error=>{

    });





}

function RawFilets(){

    let elements = "";

    FilterProductos.slice(0,5).forEach( (element,index)=>{

        elements = elements + `
        <tr>
        <th>${ element.info.Codigo == null? 'N/A':element.info.Codigo }</th>
        <th>${element.info.NombreProducto}</th>
        <th>${element.info.Presentacion}</th>
        <th>${element.info.PrecioFormat} </th>
        <th> <button onclick="AccionAgregarProductos('${index}')" class="btn btn-sm btn-success" > <img src="img/plus.png"  width="20"  /> </button> </th>
   </tr>
        `;


    } );

    $("#tableFilter").empty();
    $("#tableFilter").append(elements);



}

function RawItems(item,index){

return `<tr>
<th>${item.Codigo}</th>
<th>${item.NombreProducto}</th>
<th>${Intl.NumberFormat().format( item.PrecioUnidad )}</th>
<th><input id="input-number" onkeyup="ChangeValue(this,'${index}')"  value="${item.Cantidad}"  type="number" class="form-control-sm"  /></th>
<th> <button onClick="deleteItem('${index}')" class="btn btn-sm btn-danger" > <img width="20" height="20"  src="img/delete.png" /> </button> </th>
</tr>`

}


function ChangeValue(evt,index){
    // console.log($(evt).val(),"char imput");
    PedidoSeleccionado.items[ Number( index ) ].Cantidad = Number( $(evt).val() );



}


function deleteItem( index ){


    Swal.fire({
        title: 'Confirmar accion',
        text: 'Esta seguro de borrar '+PedidoSeleccionado.items[ Number( index ) ].NombreProducto,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {

            nuevosItems  = [];
            PedidoSeleccionado.items.forEach( (ele,indexAr)=>{

                if( index.toString() !== indexAr.toString() ){
                    nuevosItems.push(ele);
                }

            } );
            PedidoSeleccionado.items = nuevosItems;
            DisplayItemArray();
          
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
        } else if (result.dismiss === Swal.DismissReason.cancel) {
         
        }
      })

}


function DisplayItemArray() {

    let htmlEelements = "";
    $("#tableRaw").empty();

 let ValorPedido = 0;   
PedidoSeleccionado.items.forEach( (element,index)  => {
    ValorPedido = element.PrecioUnidad + ValorPedido;
    htmlEelements = htmlEelements + RawItems( element,index );
    
});
console.log("Nuevo valor pedido",ValorPedido);
$("#valorTotalPedido").text("Valor total: $ "+ValorPedido);

$("#tableRaw").append(htmlEelements);
    
}


$(function(){

$("#NombreCliente").val(PedidoSeleccionado.Info.Nombres);
$("#NumeroTelefono").val(PedidoSeleccionado.Info.Telefono);
$("#DireccionDom").val(PedidoSeleccionado.Info.DireccionDomicilo);
$("#medioPago").val(PedidoSeleccionado.Info.MedioPagoId);
$("#ConceptoDomicilio").val(PedidoSeleccionado.Info.ConceptoDomicilioId);
//$("#DireccionDom").val(PedidoSeleccionado.Info.DireccionDomicilo);
$("#valorTotalPedido").text("Valor total: $ "+Intl.NumberFormat().format( PedidoSeleccionado.Info.ValorPedido )   );
DisplayItemArray();
LoadConceptos();




$("#searchProduc").on("keydown",(evt)=>{
console.log(evt.target.value);

$.ajax({
    url:UrlBase+"mobile/ProductosFiltro",
    type:"post",
    dataType:"json",
    data:{
        nombreFiltro:evt.target.value
    }
}).then(result=>{
    
    console.log(result);
    FilterProductos  = result.value;
    RawFilets();

}).catch(error=>{

    console.log(error);
});


});



$("#GuardarCambiosAction").click(evt=>{
    console.log("Get lef");
console.log("Nuevo pedido",PedidoSeleccionado);

PedidoSeleccionado.Info.ConceptoDomicilioId = $("#ConceptoDomicilio").val();
PedidoSeleccionado.Info.MedioPagoId = $("#medioPago").val();
PedidoSeleccionado.Info.CodigoTransaccion = $("#CodigoTransaccion").val();
PedidoSeleccionado.Info.TipoPago = $("#tipoPago").val();
PedidoSeleccionado.Info.BancoId = $("#banco").val();

if( Number( PedidoSeleccionado.Info.MedioPagoId ) === 2 || Number( PedidoSeleccionado.Info.MedioPagoId ) === 3 ){

   if( PedidoSeleccionado.Info.CodigoTransaccion === '' ){

    Swal.fire("Advertencia","Debe digitar el codigo de la transaccion","warning");
    return ;
   } 

}else{

}

if( PedidoSeleccionado.Info.TipoPago === '' ){

    Swal.fire("Advertencia","Debe Seleccionar un tipo de pago","warning");
    return ;

}else{

    let medioPago = {};

     for( let i = 0; i< MediosPagoArray.length; i++ ){

        if( String( MediosPagoArray[i].IdMedioPago ) === (PedidoSeleccionado.Info.MedioPagoId) ){

            if( String( MediosPagoArray[i].TipoPagoId )  === String( PedidoSeleccionado.Info.TipoPago )  ){
                break;
            }else{
                Swal.fire("Advertencia","El metodo de pago debe corresponder al tipo de pago","warning");
                
                return;
                
            }

        }
     }
     console.log(PedidoSeleccionado);
     console.log("Out Side");
    // return;
    





}





$.ajax({
    url:UrlBase+"licpolisapp/ModificarPedido",
    dataType:"json",
    type:"POST",
    data:{
        pedidoData:JSON.stringify(PedidoSeleccionado)
    },
    beforeSend:function(xhr){

        xhr.setRequestHeader("Authorization","Bearer "+sesion.TokenLogin);

    }
    
}).then(result=>{

    if( result.state === true ){

        Swal.fire(result.msg).then(()=>{
          window.location = "ListadoArticulos.html";
        });

    }else{
        Swal.fire(result.msg);

    }

}).catch(error=>{
    console.log(error);
});


});





});