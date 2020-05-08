
const users=[];

const addusers=({id,username,room})=>{

    username=username.trim().toLowerCase();
    room=room.trim().toLowerCase();

    if(!username || !room) {
        return {
            error:'username is need'
        }
    }

    const check=users.find(p=>{
        return p.room==room && p.username==username;
    })

    if(check) {
        return {
            error:'username and room already exit'
        }
    }

    const user={id,username,room};
    users.push(user);
    return {user};

}



const removeuser=(id)=> {

  const index= users.findIndex(p=>{
        return p.id==id
    })

    if(index!=-1) {
        return users.splice(index,1)[0];
    }


}

const getuser=(id)=>{
    return users.find(user=>{
        return user.id==id
    })
}


const getuserinroom=(room)=>{

    return users.filter(p=>{
        return p.room==room
    })
}


module.exports={
    addusers,
    removeuser,
    getuser,
    getuserinroom
}