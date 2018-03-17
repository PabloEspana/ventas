// 420 de 436
var cedula = document.getElementById('cedula');
var cliente = document.getElementById('cliente');
var descripcion = document.getElementById('descripcion');
var codigo = document.getElementById('codigo');
var cantidad = document.getElementById('cantidad');
var precio = document.getElementById('precio');
var subtotal = 0, ultimototal = 0, suma = 0, existenciaProductoActual = 0
var contadorProductos = 0
var estadoBoton1 = "buscar", estadoBoton2 = "buscar"
var numeroProd = 0,
//IVA = document.getElementById('iva').value || 12;
IVA = 12;
//var descuento = 5; //Valor que va a cambiar
totalObtenido = 0, calculoDesc = 0, hayDescuento = false, hayCliente = false, nuevaCantidad = 0, cantidadFinal = 0,
	tipoInsercion = 'Agregar', productoEncontrado = false, clienteEncontrado = false

window.onload = () => { // Evento de carga
	var date = new Date();  // Instancia de Date
	var labelFecha = document.getElementById('fecha'); // Se obtiene el label de la fecha
	dia = date.getDate(), mes = (date.getMonth()) + 1, anio = date.getFullYear(); // Obtener día, mes y año actual
	labelFecha.innerHTML = "Fecha de la Venta: " + dia + "/" + mes + "/" + anio; // Envio de la fecha al body
}

boton = document.getElementById('btn-agregar').addEventListener('click', agregarProducto); // Al presionar ejecuta la funcion para agregar items
datos = { productos: [] }//Creacion de Objeto para guardar los productos de la venta
enviarContenido = document.getElementById('tablaProductos');//Referencia a la tabla donde se envia el contenido


//----------------------------------Agregar Producto----------------------------------------------
// Una vez encontrado el producto (ver evento a BuscarProducto) se procede a agregarlo a la tabla
function agregarProducto() {
	var superaExistencia = false    // Se declara una variable para controlar la exixtencia
	if ( productoEncontrado ) { // Si existe el producto se procede a validar la existencia
		if (cantidad.value == "" || cantidad.value == 0) { // Si no se ingresa cantidad por defecto será 1
			cantidad.value = 1
		}
		// Se envía a la función 'controlarExistencia' la cantidad ingresada y la existencia actual de ese producto
		if (controlarExistencia(cantidad.value, existenciaProductoActual)) {    // Si cantidad es mayor a existencia
			swal( { type: 'error', title: 'Incorrecto', text: `Cantidad ingresada es mayor a existencia del producto.` +
					`Total de ${descripcion.value} en existencia: ${existenciaProductoActual}`, showCancelButton: false,
					confirmButtonText: 'Ok', cancelButtonText: 'No', closeOnConfirm: true } )
		} else {    // Si el producto está disponible en existencia
			var cont = 0
			if (cantidad.value == "" || cantidad.value == 0) {//Si no se ingresa cantidad por defecto será 1
				cantidadFinal = 1
			} else {
				cantidadFinal = cantidad.value    // Cantidad final será el valor ingresado pero se procede a comprobar si el producto ya se escogio	
			}
			for (var data in datos.productos) {    // Recorre todos los codigos de productos para comprobar si se repite
				var aComparar = datos.productos[data].codigo    // aComparar representa cada código de la lista de productos
				cont += 1    // incremento del contador
				if (codigo.value == aComparar) {    //   Si el código ingresado ya existe en la lista de productos
					if (tipoInsercion == 'Agregar') {//Si va a agregar y ya existe se suma la cantidad a la anterior
						var cant = parseInt(cantidadFinal) + parseInt(datos.productos[data].cantidad)
						if (cant > datos.productos[data].existencia) {//Antes comprueba la existencia
							swal({
								type: 'error', title: 'Incorrecto',
								text: 'Cantidad ingresada es mayor a existencia del producto. Total de '
								+ descripcion.value + ' en existencia: ' + datos.productos[data].existencia,
								showCancelButton: false, confirmButtonText: 'Ok',
								cancelButtonText: 'No', closeOnConfirm: true
							})
							superaExistencia = true
						} else {
							cantidadFinal = parseInt(cantidadFinal) + parseInt(datos.productos[data].cantidad)
						}
					} else if (tipoInsercion == 'Modificar') {//Si se va a modificar uno que ya existe
						cantidadFinal = cantidad.value
						document.getElementById('guardar-actualizar').innerHTML = "Agregar Producto"
						document.getElementById('btnBuscarProducto').disabled = false
						codigo.disabled = false
					}
					if (!superaExistencia) {
						datos.productos.splice(cont - 1, 1)//a partir de x borrar n cantidad de elemento(s)
						tipoInsercion = 'Agregar'
					}
				}
			}

			if (!superaExistencia) {//Si no supera la existencia
				price = (precio.value).replace(",", ".")//Cambio de coma a punto
				totalpagar1 = parseFloat(parseFloat(price) * parseInt(cantidadFinal)).toFixed(2) // CAlculo de total a pagar
				var totalpagar2 = String(totalpagar1).replace(".", ",")//Volver a dejar la coma
				id = "prod_" + Math.floor(Math.random() * 10000)//Identificador aleatorio para el registro
				datos.productos.push(//Insercion de datos al objeto
					{
						id: id, codigo: codigo.value, descripcion: descripcion.value, precio: precio.value,
						cantidad: cantidadFinal, totalAPagar: totalpagar2, existencia: existenciaProductoActual
					}
				)
				actualizarTabla();//Una vez insertados actualiza la tabla
				productoEncontrado = false
				limpiarCamposProd();
			}
		}

	} else {
		swal( { type: 'error', title: 'Datos incompletos', text: 'Debe buscar un producto', showCancelButton: false, 
				confirmButtonText: 'Ok', cancelButtonText: 'No', closeOnConfirm: true })
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////
function modificarProducto(identificador) {// identificador 1, 2, 3, 4, etc
	var cont = 0
	codigo.disabled = true
	for (var data in datos.productos) {// Recorre todos los codigos de productos para comprobar si se repite
		var aComparar = datos.productos[data].codigo
		cont += 1
		if (identificador == cont) {
			codigo.value = datos.productos[data].codigo
			codigoGuardado = datos.productos[data].codigo
			descripcion.value = datos.productos[data].descripcion
			precio.value = datos.productos[data].precio
			cantidad.value = datos.productos[data].cantidad
			productoEncontrado = true
			existenciaProductoActual = datos.productos[data].existencia
			tipoInsercion = 'Modificar'
			document.getElementById('guardar-actualizar').innerHTML = "Actualizar"
			document.getElementById('btnBuscarProducto').disabled = true
			break
		}
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////
function eliminarProducto(identificador) {// identificador 1, 2, 3, 4, etc
	swal({
		title: 'Quitar Producto',
		text: '¿Desea quitar este producto?',
		showCancelButton: true,
		confirmButtonText: 'Si',
		cancelButtonText: 'No',
		closeOnConfirm: true
	}, function (isConfirm) {
		if (isConfirm) {
			datos.productos.splice(identificador - 1, 1)//a partir de x borrar n cantidad de elemento(s)
			//contadorProductos--;
			actualizarTabla()//Despues de eliminar elementos actualiza la tabla
		}
	});
}
///////////////////////////// Actualizar tabla de productos //////////////////////////////////////
function actualizarTabla() {
	contadorProductos = 0
	total = 0, calculoIVA = 0//Puede cambiar valor de IVA de 12
	var descuento = 5
	tablaGernerada = ''
	subtotal = 0
	numeroProd=0
	console.log(JSON.stringify(datos.productos))
	for (var data in datos.productos) {
		numeroProd += (parseInt(data) + 1)
		tablaGernerada += '<tr><td>' + (parseInt(data) + 1) + '</td><td>' + datos.productos[data].codigo + '</td><td>' + datos.productos[data].descripcion + '</td>'
		tablaGernerada += '<td>$ ' + datos.productos[data].precio + '</td><td>' + datos.productos[data].cantidad + '</td>'
		tablaGernerada += '<td>$ ' + datos.productos[data].totalAPagar + '</td>'
		tablaGernerada += '<td><button validation="deleteEmpleado" event="click" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" id="p' + data + '" onClick="modificarProducto(' + (parseInt(data) + 1) + ')"><i style="color:#3F9735"class="zmdi zmdi-edit"></i></button>    '
		tablaGernerada += '<button validation="deleteEmpleado" event="click" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" id="p' + data + '" onClick="eliminarProducto(' + (parseInt(data) + 1) + ')"><i style="color:#B71C1C"class="zmdi zmdi-close-circle"></i></button></td></tr>'
		totalObtenido = String(datos.productos[data].totalAPagar).replace(",", ".")
		contadorProductos++
		subtotal += parseFloat(totalObtenido)
	}
	calculoIVA = (subtotal * IVA) / 100
	if (!hayDescuento) {
		calculoDesc = 0
	} else {
		calculoDesc = (subtotal * descuento) / 100
	}
	total = subtotal + calculoIVA - calculoDesc

	////////////////////////Cambio de . por la ,  a los datos mostrados en tabla////////////////////////////
	var subtotal2 = String(subtotal.toFixed(2)).replace(".", ","), calculoIVA2 = String(calculoIVA.toFixed(2)).replace(".", ","),
		calculoDesc2 = String(calculoDesc.toFixed(2)).replace(".", ","), total2 = String(total.toFixed(2)).replace(".", ",")
	///////////////////////////////////////////////////////////////////////////////////////////////////////

	tablaGernerada += '<tr><td></td><td></td><td></td><td></td>'
	tablaGernerada += '<td><b><h6>Subtotal : </h6></b><b><h6>IVA : </h6></b><b><h6>Descuento : </h6></b>'
	tablaGernerada += '<b><h6>Total : </h6></b>'
	tablaGernerada += '<td><b><h6>$ ' + subtotal2+ '</h6></b><b><h6>$ ' + calculoIVA2 + '</h6></b><b><h6>$ ' + calculoDesc2 + '</h6></b>'
	tablaGernerada += '<b><h6>$ ' + total2 + '</h6></b>'
	tablaGernerada += '<td><center><button id="btn-imprimir" onclick="printDiv()" title="Imprimir Factura"'
		+ 'class="mdl-button mdl-js-button mdl-js-ripple-effect" style="color: #3F51B5;"'
		+ 'ocultarID="divTabla" mostrarID="tabNewAdmin">IMPRIMIR FACTURA</button></center></td></td></tr>'
	enviarContenido.innerHTML = tablaGernerada
	document.getElementById('tablaProductosImp').innerHTML = tablaGernerada
}

function cambioCedula() {
	document.getElementById("cliente").value = ""
}
function validarCliente() {
	alert("Debe ingresar los datos del cliente")
}
////////////////////////////////////////////////////////////////////////////////////////////////
var BuscarCliente = document.getElementById('btnBuscarCliente')
BuscarCliente.addEventListener('click', () => {
	descuento = 0
	var cedula = document.getElementById('cedula').value;
	if (estadoBoton1 == "buscar") {
		if (cedula.length > 0) {
			$.ajax({ type: "GET", url: "/admin/buscar/" + cedula, dataType: "json", contentType: "text/plain" }).done((datos) => {
				if (datos.cliente.length) {
					cliente.value = ""
					swal({
						type: "error",
						title: 'No se encontró',
						text: 'Busque un cliente que esté registrado',
						confirmButtonText: 'Ok',
						closeOnConfirm: true
					})
					clienteEncontrado = false
				} else {
					console.log(datos)
					document.getElementById('cedula').disabled = true
					cliente.value = datos.cliente.Nomb_Cli
					hayCliente = true
					tipoCliente = datos.cliente.Tip_Cli
					clienteEncontrado = true
					if (tipoCliente == 'Ocasional') {
						hayDescuento = false
					} else if (tipoCliente == 'Premium') {
						hayDescuento = true
					}
					//------------Si se encuentra  se bloquea el campo y cambia el estado del boton------------------
					document.getElementById('cedula').disabled = true
					estadoBoton1 = "limpiar"
					BuscarCliente.innerHTML = "Nuevo"
					actualizarTabla()
					//------------------------------------
				}
			});
		} else {
			swal({
				type: "error",
				title: 'Datos incompletos',
				text: 'Especifique la cédula del cliente',
				confirmButtonText: 'Ok',
				closeOnConfirm: true
			})
			clienteEncontrado = false
		}
	} else if (estadoBoton1 == "limpiar") {
		document.getElementById("cedula").value = ""
		document.getElementById("cliente").value = ""
		clienteEncontrado = false
		document.getElementById("cedula").disabled = false
		BuscarCliente.innerHTML = "Buscar"
		estadoBoton1 = "buscar"
		//actualizarTabla()
	}



});

//----------------------------Búsqueda de producto en la base de datos--------------------------------------
var BuscarProducto = document.getElementById('btnBuscarProducto')
BuscarProducto.addEventListener('click', () => {
	var codigo = document.getElementById('codigo').value;    // Obtengo el código ingresado
	if (estadoBoton2 == "buscar") {    // Si en el botón para buscar un producto esta listo para buscar
		if (codigo.length > 0) {    // Compruebo que se ha ingresado un código para buscar
			$.ajax({ type: "GET", url: `/admin/buscarprod/${codigo}`, dataType: "json", contentType: "text/plain" }).done((datosProd) => {
				if (datosProd.producto.length) {    // Si no existe ese producto
					descripcion.value = ""    // El campo descripción se deja en blanco
					swal( { type: "error", title: 'No se encontró', text: 'Busque un producto que este registrado',
							confirmButtonText: 'Ok', closeOnConfirm: true } )    // Se envía la información correspondiente al modal
					productoEncontrado = false    // Indico que no se encontró el producto
				} else {    // Si encuentro el producto
					document.getElementById('codigo').disabled = true    // desactivo el campo para no ingresar algo más
					estadoBoton2 = "limpiar"	// El bontón cambia su estado, ahora esta listo para limpiar o agregar nuevo
					BuscarProducto.innerHTML = "Nuevo"    // El texto del botón cambia a Nuevo
					descripcion.value = datosProd.producto.Des_Prod                //     Envío los datos obtenidos
					precio.value = datosProd.producto.PrecVen_Pro                  // a los campos correspondientes
					existenciaProductoActual = datosProd.producto.Exis_Prod    // Guardo en variable el número de existencia
					productoEncontrado = true    // Indico que se encontró el producto
				}
			});
		} else { // Si no se ingresa un código en el campo de texto (esta vacío)
			swal( { type: "error", title: 'Datos incompletos', text: 'Especifique el código del producto',
					confirmButtonText: 'Ok', closeOnConfirm: true } )
			productoEncontrado = false    // Indico que no se encontró el producto
		}
	} else if (estadoBoton2 == "limpiar") {   // Si el estado del botón es limpiar llamo la función para limpiar los campos 
		limpiarCamposProd()
	}


});

function printDiv() {
	var mensaje = ""
	var faltanDatos = true
	console.log(numeroProd)
	if (numeroProd == 0) {
		mensaje += " Debe agregar al menos 1 producto para realizar la venta. "
		faltanDatos = false
	} if (document.getElementById("cedula").value.trim() == "" || document.getElementById("cliente").value.trim() == "") {
		mensaje += "No hay cliente seleccionado. "
		faltanDatos = false
	}
	if (!faltanDatos) {
		swal({
			type: "error",
			title: 'Datos requeridos',
			text: mensaje,
			confirmButtonText: 'Ok',
			closeOnConfirm: true
		})
		mensaje = ""
	} else {
		swal({
			title: 'Guardar e Imprimir Factura',
			text: '¿Está seguro de guardar los cambios?',
			showCancelButton: true,
			confirmButtonText: 'Si, Guardar e Imprimir',
			cancelButtonText: 'Cancelar',
			closeOnConfirm: true
		}, function (isConfirm) {
			if (isConfirm) {
				tablaImprimir()
				var idlistado = "prod_" + Math.floor(Math.random() * 10000)
				datos = { "Ced_Vent": cedula.value, "NomCli_Vent": cliente.value, "CodPro_Vent": { idlistado: idlistado, productos: datos.productos }, "Desc_Vent": calculoDesc, "Total_Vent": parseFloat(total).toFixed(2) };
				//datos = { "Ced_Vent": cedula.value, "NomCli_Vent": cliente.value, "CodPro_Vent": datos.productos, "Desc_Vent": calculoDesc, "Total_Vent": parseFloat(total) };
				$.ajax({
					type: "POST",
					url: "/admin/ventas/",
					dataType: "text",
					contentType: "application/json",
					data: JSON.stringify(datos)
				}).done(function (msg) {
					swal({
						type: "success",
						title: 'Información',
						text: msg,
						confirmButtonText: 'Ok',
						closeOnConfirm: true
					}, () => {
						var date = new Date();
						var dia = date.getDate(), mes = (date.getMonth()) + 1, anio = date.getFullYear();//Obtener día, mes y año
						var fecha = dia + "/" + mes + "/" + anio;
						var valor = 0
						document.getElementById('lateralGeneral').style.display = "none"
						document.getElementById('NavPrincipal').style.display = "none"
						$('#todo').removeClass("full-width");
						$('#todo').removeClass("pageContent");
						document.getElementById("vista").style.display = "none"
						document.getElementById("paraImprimir").style.display = "block"
						document.getElementById('titulo').innerHTML = "Car de Lujo"
						//document.getElementById('subtitulo').innerHTML = "Factura N°  "
						document.getElementById('fechaimp').innerHTML = fecha
						document.getElementById('cedulaimp').innerHTML = "Cédula del Cliente: " + cedula.value
						document.getElementById('clienteimp').innerHTML = "Nombre del Cliente: " + cliente.value
						if (hayDescuento) {
							valor = 5
						} else {
							valor = 0
						}
						document.getElementById('descuentoimp').innerHTML = "Descuento: " + valor + "%"
						setTimeout(() => { window.print(); window.location = 'ventas'; }, 200)
					})
				});
			}
		});
	}

	//--------------------------------------------------------------------------------------------------
}

function tablaImprimir() {
	//totalObtenido = 0
	total = 0, calculoIVA = 0//Puede cambiar valor de IVA de 12
	var descuento = 5
	//	calculoDesc = 0;//En este caso esta establecido de 5%
	tablaGernerada = ''
	subtotal = 0///////////////////////
	console.log(JSON.stringify(datos.productos))
	for (var data in datos.productos) {
		tablaGernerada += '<tr><td>' + (parseInt(data) + 1) + '</td><td>' + datos.productos[data].codigo + '</td><td>' + datos.productos[data].descripcion + '</td>'
		tablaGernerada += '<td>$ ' + datos.productos[data].precio + '</td><td>' + datos.productos[data].cantidad + '</td>'
		tablaGernerada += '<td>$ ' + datos.productos[data].totalAPagar + '</td></tr>'
		totalObtenido = String(datos.productos[data].totalAPagar).replace(",", ".")
		console.log(totalObtenido)
		subtotal += parseFloat(totalObtenido)
	}
	calculoIVA = (subtotal * IVA) / 100
	if (!hayDescuento) {
		calculoDesc = 0
	} else {
		calculoDesc = (subtotal * descuento) / 100
	}
	total = subtotal + calculoIVA - calculoDesc

	////////////////////////Cambio de . por la ,  a los datos mostrados en tabla////////////////////////////
	var subtotal2 = String(subtotal.toFixed(2)).replace(".", ","), calculoIVA2 = String(calculoIVA.toFixed(2)).replace(".", ","),
		calculoDesc2 = String(calculoDesc.toFixed(2)).replace(".", ","), total2 = String(total.toFixed(2)).replace(".", ",")
	///////////////////////////////////////////////////////////////////////////////////////////////////////

	tablaGernerada += '<tr><td></td><td></td><td></td><td></td>'
	tablaGernerada += '<td><b><h6>Subtotal : </h6></b><b><h6>IVA : </h6></b><b><h6>Descuento : </h6></b>'
	tablaGernerada += '<b><h6>Total : </h6></b>'
	tablaGernerada += '<td><b><h6>$ ' + subtotal2 + '</h6></b><b><h6>$ ' + calculoIVA2 + '</h6></b><b><h6>$ ' + calculoDesc2 + '</h6></b>'
	tablaGernerada += '<b><h6>$ ' + total2 + '</h6></b></td>'
	tablaGernerada += '</tr>'
	document.getElementById('tablaProductosImp').innerHTML = tablaGernerada
}


function controlarExistencia(cantidad, existencia) {
	if (cantidad > existencia) {
		return true
	} else {
		return false
	}
}

function limpiarCamposProd() {
	document.getElementById("codigo").disabled = false
	codigo.value = "", descripcion.value = "", precio.value = "", cantidad.value = ""
	BuscarProducto.innerHTML = "Buscar"
	estadoBoton2 = "buscar"
	productoEncontrado = false
}
