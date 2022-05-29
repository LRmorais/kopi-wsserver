import { io } from "./http";
import ip from 'ip';

interface ClassConfig {
  askNumber: number;
  timeNumber: number;
}

interface RoomUser {
  socket_id: string;
  username: string;
  room: string;
}

interface Message {
  room: string,
  text?: string,
  createdAt: Date,
  username: string,
}
interface RealTimeMessage extends Message {
  time: number,
  next: boolean,
}

const users: RoomUser[] = [];

const messages: Message[] = []

const configs: ClassConfig[] = [];


function teste(){
  return configs
}

io.on("connection", socket => {
  // escutando usuarios que se conectam
  socket.on("select_room", data => {
    socket.join(data.room);

    const userInRoom = users.find(user => user.username === data.username && user.room === data.room);

    if(userInRoom){
      userInRoom.socket_id =socket.id;
    }else{
      users.push({
        room: data.room,
        username: data.username,
        socket_id: socket.id
      });
    }
  });

  // escutando as respostas vindas do usuario
  socket.on("message", data => {
    // salvar respostas 
    const message: Message = {
      room: data.room,
      username: data.username,
      text: data.message,
      createdAt: new Date(),
    }

    messages.push(message);
    //  Enviar para os usuarios da sala
    io.to(data.room).emit("message", message);
  })
  // escutando as respostas vindas do usuario
  socket.on("realTime", data => {
    // salvar respostas 
    const realTime: RealTimeMessage = {
      room: data.room,
      username: data.username,
      createdAt: new Date(),
      time: data.message,
      next: data.next,
    }

    // messages.push(message);
    //  Enviar para os usuarios da sala
    console.log(data)
    io.to(data.room).emit("realTime", realTime);
  })



  socket.on("configArray", (data, callback) => {
    configs.push(data)
  });

  socket.on('config', (data, callback) => {
    const teste2 = teste()
    callback(teste2)
  });

  socket.emit("ip", ip.address());


});


