// 264 de 453
var cedula = document.getElementById('cedula'),
	cliente = document.getElementById('cliente'),
	numeroProductos = 0, existenciaProductoActual = 0;

var descripcion = document.getElementById('descripcion');
var codigo = document.getElementById('codigo');
var cantidad = document.getElementById('cantidad');
var precio = document.getElementById('precio');
var subtotal = 0;

IVA = 12;  //IVA = document.getElementById('iva').value || 12; (esto debe cambiar)
totalObtenido = 0, calculoDesc = 0, hayDescuento = false, hayCliente = false, nuevaCantidad = 0, cantidadFinal = 0,
	tipoInsercion = 'Agregar', productoEncontrado = false, clienteEncontrado = false

botonBuscarProducto = document.getElementById('btnBuscarProducto')
botonBuscarCliente = document.getElementById('btnBuscarCliente')
botonAgregarProducto = document.getElementById('btn-agregar')
enviarContenido = document.getElementById('tablaProductos')
listado = { productos: [] }

function agregarProducto() {
	var cantidadActual = 0, existeEnLista = false
	if (productoEncontrado) {
		var cont = 0, codigoAComparar = 0, Cantidad = cantidad.value
		if (Cantidad == "" || Cantidad == 0) {
			Cantidad = 1
		}
		for (var item in listado.productos) {
			codigoAComparar = listado.productos[item].codigo
			cont += 1
			if (codigo.value == codigoAComparar) {
				cantidadActual = listado.productos[item].cantidad
				existeEnLista = true
				break
			}
		}
		if (tipoInsercion == 'Agregar') {
			cantidadFinal = parseInt(cantidadActual) + parseInt(Cantidad)
		} else if (tipoInsercion == 'Modificar') {
			cantidadFinal = parseInt(Cantidad)
		}
		if (superaExixtencia(cantidadFinal, existenciaProductoActual)) {
			swal('Incorrecto', `Cantidad ingresada es mayor a existencia del producto.` +
				`Total de ${descripcion.value} en existencia: ${existenciaProductoActual}`, 'error')
		} else {
			if (existeEnLista) {
				listado.productos.splice(cont - 1, 1)  // borro el anterior para que no se repita
			}
			document.getElementById('guardar-actualizar').innerHTML = "Agregar Producto", tipoInsercion = 'Agregar'
			botonBuscarProducto.disabled = false
			price = (precio.value).replace(",", ".")
			totalpagar1 = parseFloat(parseFloat(price) * cantidadFinal).toFixed(2) // Redondeo 2 decimales
			var totalpagar2 = String(totalpagar1).replace(".", ",")
			listado.productos.push({
				codigo: codigo.value, descripcion: descripcion.value, precio: precio.value,
				cantidad: cantidadFinal, totalAPagar: totalpagar2, existencia: existenciaProductoActual
			})
			limpiarCamposProd(), actualizarTabla()
			productoEncontrado = false
		}
	} else {
		swal('Datos incompletos','Debe buscar un producto','error')
	}
}

function modificarProducto(identificador) {
	codigo.disabled = true
	for (var item in listado.productos) {
		var aComparar = listado.productos[item].codigo
		if (identificador == parseInt(item) + 1) {
			codigo.value = listado.productos[item].codigo
			descripcion.value = listado.productos[item].descripcion
			precio.value = listado.productos[item].precio
			cantidad.value = listado.productos[item].cantidad
			productoEncontrado = true
			existenciaProductoActual = listado.productos[item].existencia
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
	}, function (willDelete) {
		if (willDelete) {
			listado.productos.splice(identificador - 1, 1)  // Borra el item
			actualizarTabla()
		}
	});
}

function actualizarTabla() {
	subtotal = 0, calculoIVA = 0, descuento = 5, total = 0,
		numeroProductos = 0    // Numero que aparece en la primera columna de la tabla
	tablaGernerada = ''
	for (var item in listado.productos) {
		numeroProductos += (parseInt(item) + 1)
		tablaGernerada +=  // Sección de items
			`<tr>
				<td>${(parseInt(item) + 1)}</td>
				<td>${listado.productos[item].codigo}</td>
				<td>${listado.productos[item].descripcion}</td>
				<td>$ ${listado.productos[item].precio}</td>
				<td>${listado.productos[item].cantidad}</td>
				<td>$ ${listado.productos[item].totalAPagar}</td>
				<td class='noSeImprime'>
					<button class="mdl-button mdl-button--icon" id="p${item}" onClick="modificarProducto(${(parseInt(item) + 1)})">
						<i style="color:#3F9735"class="zmdi zmdi-edit"></i>
					</button>
					<button class="mdl-button mdl-button--icon" id="p${item}" onClick="eliminarProducto(${(parseInt(item) + 1)})">
						<i style="color:#B71C1C"class="zmdi zmdi-close-circle"></i>
					</button>
				</td>
			</tr>`
		totalObtenido = String(listado.productos[item].totalAPagar).replace(",", ".")    // Obtengo el total a pagar
		subtotal += parseFloat(totalObtenido)    // Genero el subtotal sumando los totales de los productos
	}
	calculoIVA = (subtotal * IVA) / 100
	if (!hayDescuento) {
		calculoDesc = 0
	} else {
		calculoDesc = (subtotal * descuento) / 100
	}
	total = subtotal + calculoIVA - calculoDesc
	var subtotal2 = String(subtotal.toFixed(2)).replace(".", ","), calculoIVA2 = String(calculoIVA.toFixed(2)).replace(".", ","),
		calculoDesc2 = String(calculoDesc.toFixed(2)).replace(".", ","), total2 = String(total.toFixed(2)).replace(".", ",")
	tablaGernerada += // Sección de totales
		`<tr>
			<td colspan='4'>
			<td>
				<b><h6>Subtotal : </h6></b>
				<b><h6>IVA : </h6></b>
				<b><h6>Descuento : </h6></b>
				<b><h6>Total : </h6></b>
			<td>
				<b><h6>$ ${subtotal2}</h6></b>
				<b><h6>$ ${calculoIVA2}</h6></b>
				<b><h6>$ ${calculoDesc2}</h6></b>
				<b><h6>$ ${total2}</h6></b>
			<td class='noSeImprime'>
				<a id="btn-imprimir" onclick="guardarVenta()" class="mdl-button" style="color: #3F51B5;">IMPRIMIR FACTURA</a>
		</tr>`
	enviarContenido.innerHTML = tablaGernerada
	document.getElementById('tablaProductosImp').innerHTML = tablaGernerada
}

function buscarCliente() {
	if (botonBuscarCliente.value == "buscar") {
		if (cedula.value.length > 0) {
			$.ajax({ type: "GET", url: `/admin/buscar/${cedula.value}`, dataType: "json", contentType: "text/plain" }).done((datos) => {
				if (datos.cliente.length) {
					swal('No se encontró', 'Busque un cliente que esté registrado', 'error')
					clienteEncontrado = false
					cliente.value = ""
				} else {
					cedula.disabled = true
					cliente.value = datos.cliente.Nomb_Cli
					tipoCliente = datos.cliente.Tip_Cli
					clienteEncontrado = true
					if (tipoCliente == 'Ocasional') {
						hayDescuento = false
					} else if (tipoCliente == 'Premium') {
						hayDescuento = true
					}
					botonBuscarCliente.value = "limpiar"
					botonBuscarCliente.innerHTML = "Nuevo"
					actualizarTabla()
				}
			});
		} else {
			swal('Datos incompletos', 'Especifique la cédula del cliente', 'error')
			clienteEncontrado = false
		}
	} else if (botonBuscarCliente.value == "limpiar") {
		cedula.value = "", cliente.value = ""
		clienteEncontrado = false, cedula.disabled = false
		botonBuscarCliente.innerHTML = "Buscar", botonBuscarCliente.value = "buscar"
	}
};

function buscarProducto() {
	if (botonBuscarProducto.value == "buscar") {    // Si en el botón para buscar un producto esta listo para buscar
		if (codigo.value.length > 0) {
			$.ajax({ type: "GET", url: `/admin/buscarprod/${codigo.value}`, dataType: "json", contentType: "text/plain" }).done((datosProd) => {
				if (datosProd.producto.length) {
					swal('No se encontró', 'Busque un producto que este registrado', 'error')
					productoEncontrado = false
					descripcion.value = ""
				} else {
					codigo.disabled = true
					descripcion.value = datosProd.producto.Des_Prod
					precio.value = datosProd.producto.PrecVen_Pro
					existenciaProductoActual = datosProd.producto.Exis_Prod
					productoEncontrado = true
					botonBuscarProducto.value = "limpiar"
					botonBuscarProducto.innerHTML = "Nuevo"
				}
			});
		} else {
			swal('Datos incompletos', 'Especifique el código del producto', 'error')
			productoEncontrado = false
		}
	} else if (botonBuscarProducto.value == "limpiar") {
		limpiarCamposProd()
	}
}

function superaExixtencia(cantidad, existencia) {
	if (cantidad > existencia) {
		return true
	} else {
		return false
	}
}

function limpiarCamposProd() {
	codigo.disabled = false
	codigo.value = "", descripcion.value = "", precio.value = "", cantidad.value = ""
	botonBuscarProducto.innerHTML = "Buscar", botonBuscarProducto.value = "buscar"
	productoEncontrado = false
}

function guardarVenta() {  // Hay que mejorar este metodo y el siguiente
	var mensaje = "", faltanDatos = true
	if (numeroProductos == 0) {
		mensaje += " Debe agregar al menos 1 producto para realizar la venta. "
		faltanDatos = false
	} if (cedula.value.trim() == "" || cliente.value.trim() == "") {
		mensaje += "No hay cliente seleccionado. "
		faltanDatos = false
	}
	if (!faltanDatos) {
		swal({ type: "error", title: 'Datos requeridos', text: mensaje, confirmButtonText: 'Ok', closeOnConfirm: true })
		mensaje = ""
	} else {
		swal({
			title: 'Guardar e Imprimir Factura', text: '¿Está seguro de guardar los cambios?', showCancelButton: true,
			confirmButtonText: 'Si, Guardar e Imprimir', cancelButtonText: 'Cancelar', closeOnConfirm: true
		}, function (isConfirm) {
			if (isConfirm) {
				//generarImpresion()
				var idlistado = Math.floor(Math.random() * 100000000)
				datos = {
					"Ced_Vent": cedula.value, "NomCli_Vent": cliente.value, "CodPro_Vent": { idlistado: idlistado, productos: listado.productos },
					"Desc_Vent": calculoDesc, "Total_Vent": parseFloat(total).toFixed(2)
				};
				$.ajax({
					type: "POST", url: "/admin/ventas/", dataType: "text", contentType: "application/json", data: JSON.stringify(datos)
				}).done(function (msg) {
					swal({
						type: "success", title: 'Información', text: msg, confirmButtonText: 'Ok', closeOnConfirm: true
					}, () => {
						setTimeout(() => { window.print(); window.location = 'ventas'; }, 200)
					})
				});
			}
		});
	}
}