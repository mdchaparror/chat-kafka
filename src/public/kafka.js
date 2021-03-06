const socket = io()

let topic = document.getElementById('topic');
let subscribe_btn = document.getElementById('subscribe_btn');
let output = document.getElementById('output');
let mensaje = document.getElementById('mensaje');
let send = document.getElementById('send');
let alertas = document.getElementById('alertas');

subscribe_btn.addEventListener('click', function () {
    console.log({
        topic:topic.value
    })
 socket.emit('subscribe_topic',topic.value)
})

socket.on('mensaje',(mensaje)=>{
    console.log(mensaje)
    output.innerHTML +=`
    <h3><span class="badge badge-success">${mensaje}</span></h3>
    
</div>`
})


socket.on('Error',(mensaje)=>{
    console.log(mensaje.mensaje)
    alertas.className = 'alert alert-danger alert-dismissible fade show'
    alertas.innerHTML = mensaje.mensaje
})

socket.on('OK',(mensaje)=>{
    console.log(mensaje.mensaje)
    alertas.className = 'alert alert-success alert-dismissible fade show'
    alertas.innerHTML = mensaje.mensaje
})