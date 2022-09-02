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





document.querySelector('.form--login').addEventListener('submit' , e => {
    e.preventDefault()
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email , password)
})

// const logOutBtn = document.querySelector('.nav__el--logout')



// if(logOutBtn){
//     logOutBtn.addEventListener('click' , logout)
// }


 

