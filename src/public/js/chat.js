const socket = io();

const chatbox = document.getElementById('chatbox');

chatbox.addEventListener('keyup',(event)=>{
    if(event.key==="Enter"){
        //Aquí significaría enviar el mensaje
        socket.emit("message",chatbox.value);
        chatbox.value="";
    }
})


//Events
socket.on('log',data=>{
    const logs = document.getElementById('messagesLog');
    let messages = "";
    data.forEach(message=>{
        messages+=`${socket.id} dice: ${message} <br/>`
    })
    logs.innerHTML = messages;
})