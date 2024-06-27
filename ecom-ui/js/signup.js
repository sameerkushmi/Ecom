axios.defaults.baseURL = server

window.onload = async() => {
    const session = await checkAuth()
    if(session)
        return window.location.href = '/'
}

window.onstorage = (e) => {
    if(e.storageArea === localStorage){
        const key = localStorage.key('__as')
        const ___as = localStorage.getItem('___as')
        if(key === '___as') return handle___as(___as)
    }
}

const signup =async(e) =>{
    e.preventDefault()
    const form = e.target
    const payload = {
        fullname : form.fullname.value,
        email : form.email.value,
        password : form.password.value,
        mobile : form.mobile.value,
        address : form.address.value
    }

    try{
        const options = {
            headers : {
                'X-Auth-Token' : (form.AN ? form.AN.value : null) 
            }
        }
        const {data} = await axios.post("/auth/signup",payload,options)
        localStorage.setItem('auth',data.token)
        window.location.href = '/'
    }
    catch(err)
    {
        console.log(err.message)
    }
}

const handle___as = async (s) => {
    try{
        const {data} = await axios.post('/token/verify?iss=admin', {token : s})
        const input = document.createElement('input')
        const signupForm = document.getElementById('signup-form')
        signupForm.innerHTML = ''
        signupForm.append(input)
        input.className = 'border p-2 rounded-lg w-full'
        input.value = s
        input.readOnly = true
        input.disabled = true
        input.name = 'AN'
    }catch(err){}
    
}