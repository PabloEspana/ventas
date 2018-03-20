// 376 de 453
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
	IVA = 12;  //IVA = document.getElementById('iva').value || 12; (esto debe cambiar)
totalObtenido = 0, calculoDesc = 0, hayDescuento = false, hayCliente = false, nuevaCantidad = 0, cantidadFinal = 0,
	tipoInsercion = 'Agregar', productoEncontrado = false, clienteEncontrado = false

window.onload = () => { // Evento de carga
	date = new Date() 
	labelFecha = document.getElementById('fecha')
	dia = date.getDate(), mes = (date.getMonth()) + 1, anio = date.getFullYear() 
	labelFecha.innerHTML = `Fecha de la Venta: ${dia}/${mes}/${anio}`
}

//-------------------------Asignación de eventos a los botones----------------------------------
botonBuscarProducto = document.getElementById('btnBuscarProducto')
botonBuscarProducto.addEventListener('click', buscarProducto)
botonBuscarCliente = document.getElementById('btnBuscarCliente')
botonBuscarCliente.addEventListener('click', buscarCliente)
botonAgregarProducto = document.getElementById('btn-agregar')
botonAgregarProducto.addEventListener('click', agregarProducto)

datos = { productos: [] }
enviarContenido = document.getElementById('tablaProductos')

function agregarProducto() {
	var cantidadActual = 0, existeEnLista = false
	if (productoEncontrado) {
		var cont = 0, codigoAComparar = 0, Cantidad = cantidad.value
		if (Cantidad == "" || Cantidad == 0) {
			Cantidad = 1
		}
		for (var data in datos.productos) {
			codigoAComparar = datos.productos[data].codigo
			cont += 1
			if (codigo.value == codigoAComparar) {
				cantidadActual = datos.productos[data].cantidad
				existeEnLista = true
				break
			}
		}
		if (tipoInsercion == 'Agregar') {
			cantidadFinal = parseInt(cantidadActual) + parseInt(Cantidad)			
		}else if (tipoInsercion == 'Modificar'){
			cantidadFinal = parseInt(Cantidad)
		}
		if (superaExixtencia(cantidadFinal, existenciaProductoActual)) {
			swal({
				type: 'error', title: 'Incorrecto', text: `Cantidad ingresada es mayor a existencia del producto.` +
				`Total de ${descripcion.value} en existencia: ${existenciaProductoActual}`, showCancelButton: false,
				confirmButtonText: 'Ok', cancelButtonText: 'No', closeOnConfirm: true
			})
		} else {
			if(existeEnLista){
				datos.productos.splice(cont - 1, 1)  // borro el anterior
			}
			tipoInsercion = 'Agregar'
			price = (precio.value).replace(",", ".")
			totalpagar1 = parseFloat(parseFloat(price) * cantidadFinal).toFixed(2) // Redondeo 2 decimales
			console.log(totalpagar1)
			var totalpagar2 = String(totalpagar1).replace(".", ",")
			id = "prod_" + Math.floor(Math.random() * 10000)
			datos.productos.push({
				id: id, codigo: codigo.value, descripcion: descripcion.value, precio: precio.value,
				cantidad: cantidadFinal, totalAPagar: totalpagar2, existencia: existenciaProductoActual
			})
			limpiarCamposProd(), actualizarTabla()
			productoEncontrado = false
		}
	} else {
		swal({
			type: 'error', title: 'Datos incompletos', text: 'Debe buscar un producto', showCancelButton: false,
			confirmButtonText: 'Ok', cancelButtonText: 'No', closeOnConfirm: true
		})
	}
}

function modificarProducto(identificador) {
	var cont = 0
	codigo.disabled = true
	for (var data in datos.productos) { 
		var aComparar = datos.productos[data].codigo
		cont += 1
		if (identificador == cont) {
			codigo.value = datos.productos[data].codigo
			descripcion.value = datos.productos[data].descripcion
			precio.value = datos.productos[data].precio
			cantidad.value = datos.productos[data].cantidad
			productoEncontrado = true
			existenciaProductoActual = datos.productos[data].existencia
			tipoInsercion = 'Modificar'
			document.getElementById('guardar-actualizar').innerHTML = "Actualizar"
			botonBuscarProducto.disabled = true
			break
		}
	}
}

function eliminarProducto(identificador) {
	swal({
		title: 'Quitar Producto', text: '¿Desea quitar este producto?', showCancelButton: true,
		confirmButtonText: 'Si', cancelButtonText: 'No', closeOnConfirm: true
	}, function (isConfirm) {
		if (isConfirm) {
			datos.productos.splice(identificador - 1, 1)
			actualizarTabla()
		}
	});
}
///////////////////////////// Actualizar tabla de productos //////////////////////////////////////
function actualizarTabla() {
	contadorProductos = 0, subtotal = 0, calculoIVA = 0, descuento = 5, total = 0,
		numeroProd = 0    // Numero que aparece en la primera columna de la tabla
	tablaGernerada = ''
	for (var data in datos.productos) {    // Recorrido a los items de la lista
		numeroProd += (parseInt(data) + 1)    // Generación del número del producto
		tablaGernerada += '<tr><td>' + (parseInt(data) + 1) + '</td><td>' + datos.productos[data].codigo + '</td><td>' + datos.productos[data].descripcion + '</td>'
		tablaGernerada += '<td>$ ' + datos.productos[data].precio + '</td><td>' + datos.productos[data].cantidad + '</td>'
		tablaGernerada += '<td>$ ' + datos.productos[data].totalAPagar + '</td>'
		tablaGernerada += '<td><button validation="deleteEmpleado" event="click" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" id="p' + data + '" onClick="modificarProducto(' + (parseInt(data) + 1) + ')"><i style="color:#3F9735"class="zmdi zmdi-edit"></i></button>    '
		tablaGernerada += '<button validation="deleteEmpleado" event="click" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" id="p' + data + '" onClick="eliminarProducto(' + (parseInt(data) + 1) + ')"><i style="color:#B71C1C"class="zmdi zmdi-close-circle"></i></button></td></tr>'
		totalObtenido = String(datos.productos[data].totalAPagar).replace(",", ".")    // Obtengo el total a pagar
		contadorProductos++
		subtotal += parseFloat(totalObtenido)    // Genero el subtotal sumando los totales de los productos
	}
	calculoIVA = (subtotal * IVA) / 100    // Cálculo del IVA
	if (!hayDescuento) {    // Se comprueba si hay descuento o no
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
	tablaGernerada += '<b><h6>$ ' + total2 + '</h6></b>'
	tablaGernerada += '<td><center><button id="btn-imprimir" onclick="printDiv()" title="Imprimir Factura"'
		+ 'class="mdl-button mdl-js-button mdl-js-ripple-effect" style="color: #3F51B5;"'
		+ 'ocultarID="divTabla" mostrarID="tabNewAdmin">IMPRIMIR FACTURA</button></center></td></td></tr>'
	enviarContenido.innerHTML = tablaGernerada
	document.getElementById('tablaProductosImp').innerHTML = tablaGernerada
}

function buscarCliente(){	
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
					botonBuscarCliente.innerHTML = "Nuevo"
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
		botonBuscarCliente.innerHTML = "Buscar"
		estadoBoton1 = "buscar"
	}
};

function buscarProducto() {
	var codigo = document.getElementById('codigo').value;
	if (estadoBoton2 == "buscar") {    // Si en el botón para buscar un producto esta listo para buscar
		if (codigo.length > 0) {
			$.ajax({ type: "GET", url: `/admin/buscarprod/${codigo}`, dataType: "json", contentType: "text/plain" }).done((datosProd) => {
				if (datosProd.producto.length) {
					descripcion.value = ""
					swal({
						type: "error", title: 'No se encontró', text: 'Busque un producto que este registrado',
						confirmButtonText: 'Ok', closeOnConfirm: true
					})
					productoEncontrado = false
				} else {
					document.getElementById('codigo').disabled = true
					estadoBoton2 = "limpiar"
					botonBuscarProducto.innerHTML = "Nuevo"
					descripcion.value = datosProd.producto.Des_Prod
					precio.value = datosProd.producto.PrecVen_Pro
					existenciaProductoActual = datosProd.producto.Exis_Prod
					productoEncontrado = true
				}
			});
		} else {
			swal({
				type: "error", title: 'Datos incompletos', text: 'Especifique el código del producto',
				confirmButtonText: 'Ok', closeOnConfirm: true
			})
			productoEncontrado = false
		}
	} else if (estadoBoton2 == "limpiar") {
		limpiarCamposProd()
	}
}

function printDiv() {
	var mensaje = ""
	var faltanDatos = true
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
	for (var data in datos.productos) {
		tablaGernerada += '<tr><td>' + (parseInt(data) + 1) + '</td><td>' + datos.productos[data].codigo + '</td><td>' + datos.productos[data].descripcion + '</td>'
		tablaGernerada += '<td>$ ' + datos.productos[data].precio + '</td><td>' + datos.productos[data].cantidad + '</td>'
		tablaGernerada += '<td>$ ' + datos.productos[data].totalAPagar + '</td></tr>'
		totalObtenido = String(datos.productos[data].totalAPagar).replace(",", ".")
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

function superaExixtencia(cantidad, existencia) {
	if (cantidad > existencia) {
		return true
	} else {
		return false
	}
}

function limpiarCamposProd() {
	document.getElementById("codigo").disabled = false
	codigo.value = "", descripcion.value = "", precio.value = "", cantidad.value = ""
	botonBuscarProducto.innerHTML = "Buscar"
	estadoBoton2 = "buscar"
	productoEncontrado = false
}