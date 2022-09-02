(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const hideAlert = () => {
    const el = document.querySelector('.alert');
    if(el){
        el.parentElement.removeChild(el)
    }
}

exports.showAlert = (type , msg) => {
    hideAlert()
    const markup = `<div class='alert alert--${type}'>${msg}</div>`
    document.querySelector('body').insertAdjacentHTML('afterbegin' , markup) 
    window.setTimeout(hideAlert, 3000)
}





},{}],2:[function(require,module,exports){
const showAlert = require('./alert')


// login functionality

const login = async (email , password) => {
    try{
        console.log(email , password);
   const res = await axios({
        method : 'POST',
        url : 'http://127.0.0.1:8000/api/v1/users/login',
        data : {
            email,
            password
        }
    })

    if(res.data.status === 'success'){
        showAlert.showAlert( 'success' , 'login successfully')
        window.setTimeout(() => {
            location.assign('/')
        }, 1000)
    }
}catch(err){
    showAlert.showAlert( "error" , err.response.data.message);
}
}


// const logout = async () => {
//     try{
//         const res = await axios({
//             method : 'GET',
//             url : "http://127.0.0.1:8000/api/v1/users/logout",
//         });
//         console.log(res.data.status);
//         if(res.data.status = 'success') location.reload(true)
//     }catch(err){
//         showAlert('error' , 'Error logging out ! try again')
//     }
// }


document.querySelector('.form').addEventListener('submit' , e => {
    e.preventDefault()
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email , password)
})

// const logOutBtn = document.querySelector('.nav__el--logout')



// if(logOutBtn){
//     logOutBtn.addEventListener('click' , logout)
// }

 

document.querySelector('.nav__el--logout').addEventListener('click' , () => {
    console.log('bulshit');
})
},{"./alert":1}]},{},[2]);
