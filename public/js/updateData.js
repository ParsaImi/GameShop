
const submitBtn = document.querySelector('.form-user-data')

const updateUser = async (name , email) => {

    const res = await axios({
        method : 'POST',
        url : 'http://127.0.0.1:8000/api/v1/users/updateMe',
        data : {
            email,
            name
        }
    
    }) 
    console.log(res.data);
}




submitBtn.addEventListener('submit' , (e) => {
    e.preventDefault()
    const email = document.getElementById('email')
    const name = document.getElementById('name')
    updateUser(name , email)
})