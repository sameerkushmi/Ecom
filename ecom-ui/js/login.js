axios.defaults.baseURL = server

window.onload = async () => {
    const session = await checkAuth()
    if(session)
        return window.location.href = '/'
}

const login = async (e) =>{
    e.preventDefault()
    const form = e.target
    const loader = document.getElementById("loader")
    const signinButton = document.getElementById("signin-button")

    const payload = {
        email : form.email.value,
        password : form.password.value
    }
    try{
        signinButton.style.display = "none"
        loader.style.display = "block"
        const {data} = await axios.post('/auth/login',payload)
        localStorage.setItem('auth',data.token)
        window.location.href = '/'
    }
    catch(err)
    {
        const error = document.getElementById("error")
        error.style.display = "block"
        error.innerHTML = err.message
    }
    finally{
        signinButton.style.display = "block"
        loader.style.display = "none"
    }
}
const removeError = () =>{
    const error = document.getElementById("error")
    if(error.style.display !== "block") return false
    error.style.display = "none"
}
