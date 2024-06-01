const socket = io({
  autoConnect: false,
});
const chatbox = document.getElementById('chatbox');
let username;

Swal.fire({
  title: 'Identifícate',
  icon: 'question',
  input: 'text',
  inputValidator: (value) => {
    if (!value) {
      return '¡Necesitas escribir un nombre de usuario para participar en el chat!';
    }
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((response) => {
  username = response.value;
  socket.connect();
  socket.emit('authenticated',username);
});

chatbox.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    if (chatbox.value.trim()) {
      //Aquí significaría enviar el mensaje
      socket.emit('message', { username: username, message: chatbox.value.trim() });
      chatbox.value = '';
    }else{
        //Aquí ponte creativo, puedes ignorarlo o decirle que no puede enviar cosas vacías
    }
  }
});

//Events
socket.on('log', (data) => {
  const logs = document.getElementById('messagesLog');
  let messages = '';
  data.forEach((logItem) => {
    messages += `${logItem.username} dice: ${logItem.message} <br/>`;
  });
  logs.innerHTML = messages;
});


socket.on('newUserConnected',(data)=>{
    if(!username) return;
    Swal.fire({
        toast:true,
        showConfirmButton:false,
        timer:3000,
        title:`${data} se ha unido al chat`,
        position:'top-end',
        icon:"success"
    })
})