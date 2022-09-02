const logout = async () => {
    try{
        const res = await axios({
            method : 'GET',
            url : "http://127.0.0.1:8000/api/v1/users/logout",
        });
        console.log(res.data.status);
        if(res.data.status = 'success') location.reload(true)
    }catch(err){
        showAlert('error' , 'Error logging out ! try again')
    }
}



document.querySelector('.nav__el--logout').addEventListener('click' , logout )