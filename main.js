//Establecemos la crecaión del servidor de elementos__________________________________________________________________________________________
const cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
exphbs = require('express-handlebars'),
expressValidator = require('express-validator'),
flash = require('connect-flash'),
session = require('express-session'),
path = require('path');
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
mongoose = require('mongoose'),
express = require('express'),
servidor = express();
user = require('./modelos/user')


var http = require('http').Server(servidor)
var port = process.env.PORT || 8000


var archivos=null;


mongoose.connect("mongodb+srv://Administrador:B55k2yTswp5PbXrJ@cluster0.nwug2.mongodb.net/pablodb?retryWrites=true&w=majority",{ server: { reconnectTries: Number.MAX_VALUE } }); // Conexión a BD

//-----------------Creación de usuario administrador por defecto-------------------
user.find({}, (err, usuarios) => {
  if (!usuarios.length) {//Si no hay nada usuarios
    var administrador = new user({
      username: 'admin',
      password: 'admin',
      typoUser: 'Administrador Principal',
      verificar: 'administrador',
    })
    user.createUser(administrador, function (err, user) {
      if (err) { throw err };
      console.log("Administrador por defecto creado")
    });
  }

})


//Estas rutas dependen de la carpeta rutas
//Si se incrementa una nueva ruta deberá ser referenciada en esta parte
var routes = require('./rutas/index'),
  users = require('./rutas/users'),
  admin = require('./rutas/admin');

//Definimos que se usará tecnología hbs para modificar la vista de una página
servidor.set('views', path.join(__dirname, 'views'));
servidor.engine('handlebars', exphbs({ defaultLayout: 'estatico' }));
servidor.set('view engine', 'handlebars');

//Permitimos el reconocimiento de JSON en el sistema 
servidor.use(bodyParser.json());
servidor.use(bodyParser.urlencoded({ extended: false }));
servidor.use(cookieParser());

//Aqui se define donde estarán los estilos y scripts tanto globales como modulares
servidor.use(express.static(path.join(__dirname, 'recursos')));

//Con esto nos aseguramos que se usen sesiones e inicios de sesión con encriptación
servidor.use(session({ secret: 'secret', saveUninitialized: true, resave: true }));
servidor.use(passport.initialize());
servidor.use(passport.session());

//Usando esta API se puede validar campos desde ambos lados (Cliente- Servidor)
servidor.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//Es necesario el poder enviar mensajes automáticos desde el servidor
servidor.use(flash());

//Establecemos variables globales para el envío de datos
servidor.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//usamos las rutas creadas anteriormente
servidor.use('/', routes);
servidor.use('/users', users);
servidor.use('/admin', admin);

//Controlamos el error de página no encontrada
servidor.use(function (req, res) {
  res.status('404');
  res.render('404')
});

//Controlamos el error de fallos en el servidor
servidor.use(function (err, req, res, next) {
  res.status(500);
  res.render('500', { error: err });
});

//Usa el api de electron____________________________________________________________________________________________________________________
// electron:  const { app, BrowserWindow, Menu, dialog, nativeImage } = require('electron');

//Inicializamos el servidor
http.listen(port, function() {
  console.log("App is running on port " + port);
});

//Definimos que la aplicación usará electron para iniciarse___________________________________________________________________________________


// electron:  let mainWindow,
// electron:    icono = nativeImage.createFromPath(path.join(__dirname, 'recursos/general/imagenes/icono.png'));

//Se define el menu principal independiente del HTML________________________________________________________________________________________
/*electron:  var menu = Menu.buildFromTemplate(
  [
    
  ]
)*/

//Crea la ventana principal________________________________________________________________________________________________
//Crea la ventana principal asignándole los valores necesarios
//Cargamos la información procedente de nuestro html, js y css
//Cuando se cierra reseteamos la ventana
//Asignamos el menú personalizado
/*electron:   var aCerrar = true;
function ventanaPrincipal() {
  mainWindow = new BrowserWindow({
    width: 1000, 
    height: 860, 
    icon: icono, 
    minWidth: 1000, 
    title: "Car de lujo",
    webPreferences:{
      experimentalFeatures:true,
      experimentalCanvasFeatures:true
    }
  });
  mainWindow.maximize();
  mainWindow.webContents.executeJavaScript();
  let cargando = new BrowserWindow({parent: mainWindow, modal: true, show: false, frame:false})
  cargando.once('show', () => {
    mainWindow.hide();
    mainWindow.webContents.once('dom-ready', () => {
      cargando.hide()
      cargando.close()
      mainWindow.show()    
    })
    mainWindow.loadURL('https://cardelujo.herokuapp.com/:'+puerto+'/');
    mainWindow.on('closed', () => { mainWindow = null });
    Menu.setApplicationMenu(menu);
    mainWindow.on('close', (event) => {
      if (aCerrar) {
        event.preventDefault();
      }
      dialog.showMessageBox(mainWindow, {
        title: 'Advertencia',
        type:'warning',
        message: '¿Esta seguro de cerrar el sistema?',
        detail: 'Los cambios sin guardar no estarán disponibles',
        buttons: ['Cerrar', 'No cerrar'],
        noLink: true,
      }, (response) => {
        if (response != 1) {
          aCerrar = false;
          app.quit();
        }
      });
      
    });
  });
  cargando.loadURL(path.join(__dirname, 'recursos/general/imagenes/cargando.html'))
  cargando.show()
}

app.on('ready', ventanaPrincipal); // Se inicia la aplicación
app.on('activate', () => { if (mainWindow === null) { ventanaPrincipal() } }); // Se activa la aplicación
app.on('window-all-closed', function (event) {
  event.preventDefault();
})*/

