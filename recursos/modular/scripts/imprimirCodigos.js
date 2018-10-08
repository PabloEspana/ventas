// Función para realizar impresones personalizadas

function imprimirElemento(){
    let contenido= document.getElementById('contenidoImprimir').innerHTML
    let estilos = `body {
        text-align:center
      }`
    let scripts = ``
    var ventana = window.open('', 'PRINT', 'height=400,width=600')
    ventana.document.write(`<html><head><title> ${document.title} </title>`)
    ventana.document.write(`<style>${estilos}</style>`)
    ventana.document.write('</head><body>')
    ventana.document.write(contenido)
    ventana.document.write('</body></html>')
    ventana.document.close()
    ventana.focus()
    ventana.print()
    ventana.close()
    return true
}