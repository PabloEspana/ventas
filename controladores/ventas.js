var venta_model = require('../modelos/ventas');
var cliente = require('../modelos/cliente');
var productos = require('../modelos/productos');
var config = require('../modelos/configuraciones');

function obtenerFecha() {
	var date = new Date(); // Peparamos para crear la fecha
	dia = date.getDate(); // Obtención del día
	mes = (date.getMonth()) + 1; // Obtención del mes
	anio = date.getFullYear(); // Obtención del año
	fecha = dia + "/" + mes + "/" + anio;
	return fecha;
}

// variables para guardar el código de la venta y controlar si hay registros
var CodVen_Vent = 0
var hayRegistros = false

function obtenerVistaVenta(req, res) {
	// Función para cargar los datos que visualizará el cliente en la vista de ventas
	venta_model.find({}, (err, total) => { // Consulta de registros en la colección ventas
		if (err) { // Comprobación si existe error en la consulta
			console.log("error")
		} else { // Si no hay error se procede a consultar en la colección de configuraciones
            config.find({}, function (err, configuracion){
                if (!total.length) { // Si no hay nada aun en ventas el codigo de factura será 1 (primera factura)
                    CodVen_Vent = 1
                    res.render('ventas', { factura: CodVen_Vent ,config:configuracion})
                } else { // De lo contrario el código irá incrementando
                    CodVen_Vent = total.length + 1
                    res.render('ventas', { factura: CodVen_Vent,config:configuracion})
                }
            })
		}
	})

}
function obtenerVistaConsultaVentas(req, res) {
	venta_model.find({}, function (err, ventas) {
		if (err) {
			res.render('consulta-ventas', { error: "Error al obtener datos" })
			console.log("Error al consultar ventas")
		} else {
			if (!ventas) {
				res.render({ mensaje: "No hay ventas registradas" })
				console.log("No hay ventas registradas")
			} else {
				res.render('consulta-ventas', { ventas: ventas });
			}
		}
	});
}

function consultarVentas(req, res) {
	venta_model.find({}, function (err, ventas) {
		if (err) {
			res.render('500', { error: "Error del sistema :(", descripcion: "¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente" })
		} else {
			if (!ventas) {
				res.send({ mensaje: "No hay ventas registradas" })
				console.log("No hay ventas registradas")
			} else {
				res.send({ ventas: ventas });
			}
		}
	});
}


function vistaReporteVentas(req, res){
	venta_model.find({}, function (err, ventas) {
		if (err) {
			res.render('500', { error: "Error del sistema :(", descripcion: "¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente" })
		} else {
			if (!ventas) {
				res.send({ mensaje: "No hay ventas registradas" })
				console.log("No hay ventas registradas")
			} else {
				res.render('reporteVentas', { ventas: ventas });
			}
		}
	});
}

function busquedaCliente(req, res) {
	var cedula = req.params.cedula
	cliente.findOne({ Ced_Cli: cedula }, (err, clienteObtenido) => {
		if (err) {
			res.render('500', { error: "Error del sistema :(", descripcion: "¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente" })
		} else {
			if (!clienteObtenido) {
				res.send({ cliente: "El cliente no existe" })
			} else {
				res.status(200).send({ cliente: clienteObtenido })
			}
		}
	});
}

function busquedaProducto(req, res) {
	var codigo = req.params.codigo;
	productos.findOne({ Cod_Prod: codigo }, (err, productoObtenido) => {
		if (err) {
			res.status(500).send({ error: "Error al buscar" })
		} else {
			if (!productoObtenido) {
				res.send({ producto: "El producto no existe" })
			} else {
				res.status(200).send({ producto: productoObtenido })
				console.log("Encontrado");
			}
		}
	});
}

function registrarVenta(req, res) {
	var params = req.body; // Obtengo los datos del formulario
	var date = new Date(); // Instancia de la fecha
	dia = date.getDate();
	mes = (date.getMonth()) + 1;
	anio = date.getFullYear();
	var Fech_Vent = dia + "/" + mes + "/" + anio; // Creo una nueva fecha para asegurarse de que se registra el día correcto

	var nuevaVenta = new venta_model({ // Modelo ventas
		CodVen_Vent: CodVen_Vent,
		Ced_Vent: params.Ced_Vent,
		NomCli_Vent: params.NomCli_Vent,
		Fech_Vent: Fech_Vent,
		CodPro_Vent: params.CodPro_Vent,
		Desc_Vent: params.Desc_Vent,
		Total_Vent: params.Total_Vent
	})
	CodPro_Vent: params.CodPro_Vent
	nuevaVenta.save(function (error, resp) { // Registro la venta y actualizao el inventario
		if (error) {
			res.render('500', { error: "Error del sistema :(", descripcion: "¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente" })
		} else {
			var products = params.CodPro_Vent.productos
			for (var i = 0; i < products.length; i++) { // Por cada producto se reducirá la existencia
				productos.findOneAndUpdate({ Cod_Prod: products[i].codigo }, { Exis_Prod: (products[i].existencia - products[i].cantidad) }, { new: false }, (err, productUpdated) => {
					if (err) {
						res.render('500', { error: "Error del sistema :(", descripcion: "¡Vaya!, algo salió mal. Tu petición no ha sido completada. Por favor inténtelo nuevamente" })
					} else {
						if (!productUpdated) {
							console.log("No se actualizao la existencia de un producto")
						} else {
							console.log("Producto actualizado")
						}
					}
				});
			}
			res.status(200).send("Venta guardada con exito, presione OK para imprimir la factura")
			console.log("Venta Guardada")
		}
	})
}


module.exports = { obtenerVistaVenta, obtenerVistaConsultaVentas, vistaReporteVentas, consultarVentas, registrarVenta, busquedaCliente, busquedaProducto }
