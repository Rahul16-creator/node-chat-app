const socket=io();

const locoButton=document.querySelector('#location');
const formButton=document.querySelector('#form');
const formbutton=formButton.querySelector('button')
const Inputs=formButton.querySelector('input');
const script1=document.querySelector('#message').innerHTML;
const div1=document.querySelector('#messages');
const script2=document.querySelector('#locations').innerHTML;
const sidebars=document.querySelector('#sidebartemplate').innerHTML;
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true});








const scroll=()=>{
    const newmsg=div1.lastElementChild;

    const margin=getComputedStyle(newmsg);
    const breadth=parseInt(margin.marginBottom);

    const height=newmsg.offsetHeight+breadth;

    const visibleheight=div1.offsetHeight;
    
    const containerHeight=div1.scrollHeight;

    const scrollheight=div1.scrollTop+visibleheight;
    if(containerHeight-height<=scrollheight) {

        div1.scrollTop=div1.scrollheight
    }

}










//message template

socket.on('join',(messages)=>{

    const html=Mustache.render(script1,{
        username:messages.username,
        message:messages.text,
        createdtime:moment(messages.createdAt).format('h:mm a')
    })
    div1.insertAdjacentHTML('beforeend',html);
    scroll();
    //console.log(message);
})



socket.on('chattingroom',({room,users})=>{
    const html=Mustache.render(sidebars,{
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML=html;
   
})


//location template

socket.on('locations',(url)=>{
    console.log(url);
    const html=Mustache.render(script2,{
       username:url.username,
        url:url.text,
        createdAt:moment(url.createdAt).format('h:mm a')
       
    });

    div1.insertAdjacentHTML('beforeend',html);
   
})



formButton.addEventListener('submit',(e)=>{

    e.preventDefault();
formbutton.setAttribute('disabled','disabled');
   const message =e.target.elements.message.value;

   socket.emit('message',message,(message)=>{

    formbutton.removeAttribute('disabled');
Inputs.value='';
Inputs.focus();

    console.log(message);
   });


})


document.querySelector('#location').addEventListener('click',()=>{

    if(!navigator.geolocation) {
        return  alert('click the allow Button');
    }

    navigator.geolocation.getCurrentPosition((pos=>{

        locoButton.setAttribute('disabled','disabled');
        socket.emit('location',{
            latt:pos.coords.latitude,
            lon:pos.coords.longitude
        },()=>{
            console.log('location shared');
            locoButton.removeAttribute('disabled');
        })
    }))
})


socket.emit('roomjoin',{username,room},(error)=>{

    if(error) {
        alert(error);
        location.href='/';
    }
})

