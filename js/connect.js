
function connectUser(){
    if(myMSALObj.getAccount()){
        console.log('connected');
    }
    else console.log('not connected');
}