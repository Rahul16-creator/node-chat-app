const generate=(username,text)=>{

    return {
    username,
    text,
    createAt:new Date().getTime()
    }

}
module.exports={
    generate
}