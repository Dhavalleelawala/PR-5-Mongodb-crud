import { LocalStorage } from "node-localstorage"
global.localStorage = new LocalStorage('./scratch');
export const userAuth = (req,res,next)=>{
    let isValid = localStorage.getItem('id');
    
    if(isValid != "" ){
        next();
    }else{
        res.redirect('/login');
    }
    // next();
}