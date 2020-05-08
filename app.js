
const http=require('http');
const socketio=require('socket.io');
const path=require('path');
const express=require('express');

const app=express();

const port=process.env.PORT|| 3000;
const server=http.createServer(app);
const {generate}=require('./util/message');
const io=socketio(server);
const {addusers,removeuser,getuser,getuserinroom}=require('./util/users');
const pathDiretory=path.join(__dirname,'./views')
app.use(express.static(pathDiretory));








io.on('connection',(socket)=>{
    console.log('connected');

   
    socket.on('roomjoin',({username,room},callback)=>{

      const {error,user}=  addusers({id:socket.id,username,room})


      if(error) {
         
             return  callback(error);
          
      }


      socket.join(user.room)

      socket.emit('join',generate("Admin"+"  welcome"))
      socket.broadcast.to(user.room).emit('join',generate(user.username+' has joined'));

      io.to(user.room).emit('chattingroom',{
          room:user.room,
          users:getuserinroom(user.room)
      })
      callback();

    })
   

    //input messages
    socket.on('message',(message,callback)=>{

        const user=getuser(socket.id);

       io.to(user.room).emit('join',generate(user.username,message));
       callback('shared successfull')
    })


    //Location

    socket.on('location',({latt,lon},callback)=>{

        const user=getuser(socket.id);

       io.to(user.room).emit('locations',generate(user.username,'https://google.com/maps?q='+latt+','+lon));
       callback();
    })


    socket.on('disconnect',()=>{

        const user=removeuser(socket.id)

        if(user) {
            io.to(user.room).emit('join',generate(user.username+' is  disconnected'))
            
            io.to(user.room).emit('chattingroom',{
                room:user.room,
                users:getuserinroom(user.room)
            })
        }
       
    })
})

server.listen(port,()=>{
    console.log(port);
})