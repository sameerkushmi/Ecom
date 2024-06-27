axios.defaults.baseURL = server

window.onload = () =>{
    fetchProducts()
    handleMenuUi()
}

const handleMenuUi = async () => {
    const session = await checkAuth()
    const accountMenuUi = (session ? withLogin(session) : withoutLogin())
    const accountMenu = document.getElementById("account-menu")
    accountMenu.innerHTML = accountMenuUi
}

const adminMenu = (session)=>{
    return (`
        <h1 class="capitalize font-semibold text-right px-4">${session.fullname}</h1>
        <p class="text-gray-400 text-sm px-4">${session.email}</p>
        <hr class="my-3"/>
        <ul>
            <li>
                <a href="/admin" class="flex gap-3 px-6 py-2 hover:bg-gray-100 text-center">
                    <i class="ri-shopping-cart-line"></i>
                    Products
                </a>
            </li>
            <li>
                <a href="/admin" class="flex gap-3  px-6 py-2 hover:bg-gray-100 text-center">
                    <i class="ri-group-2-line"></i>
                    Orders
                </a>
            </li>
            <li>
                <a href="/admin" class="flex  gap-3 px-6 py-2 hover:bg-gray-100 text-center" onclick="logout()">
                    <i class="ri-money-rupee-circle-line"></i>
                    Payments
                </a>
            </li>
            <li>
                <a href="/admin" class="flex gap-3 px-6 py-2 hover:bg-gray-100 text-center" onclick="logout()">
                    <i class="ri-user-line"></i>
                    Customers
                </a>
            </li>
            <li>
                <a class="flex gap-3 px-6 py-2 hover:bg-gray-100 text-center" onclick="logOut()">
                    <i class="ri-logout-circle-r-line"></i>
                    Logout
                </a> 
            </li>
        </ul>
        
    `)
}

const userMenu = (session)=>{
    return (`
        <h1 class="capitalize font-semibold text-right px-4">${session.fullname}</h1>
        <p class="text-gray-400 text-sm px-4">${session.email}</p>
        <hr class="my-3"/>
        <ul>
            <li>
                <a href="/order.html" class="block py-2 hover:bg-gray-100 text-center">
                    <i class="ri-money-rupee-circle-fill"></i>
                    Orders
                </a>
            </li>
            <li>
                <a href="/cart.html" class="block py-2 hover:bg-gray-100 text-center">
                    <i class="ri-shopping-cart-line"></i>
                    Cart
                </a>
            </li>
            <li>
                <button class="py-2 w-full hover:bg-gray-100 text-center" onclick="logOut()">
                    <i class="ri-logout-circle-line"></i>
                    Log Out
                </button>
            </li>
        </ul>
    `)
}

const loadApp = (session)=>{
    if(session.role === "admin")
        return adminMenu(session)
    
    if(session.role === "user")
        return userMenu(session)
    
    logOut()
}

const withoutLogin = () => {
    return (
        `
            <a href="/login.html" class="hover:font-bold">Login</a>
            <a href="/signup.html" 
            class="bg-gradient-to-b from-cyan-500 to-blue-500 text-white px-8 py-3 
            font-semibold rounded-lg hover:font-bold">
            SignUp</a>
       `
       )
}

const withLogin = (session) =>{
        return (
        `
        <div class="relative left-0 top-0" onclick="toggleUserMenu()">
            <button>
                <img src="/images/pic.jpg" class="w-12 h-12 rounded-full" />
            </button>
            <div class="bg-white shadow absolute top-[100%] right-0 py-2 rounded hidden" id="user-menu">
                ${loadApp(session)}
            </div>
        </div>
    `)
}

const toggleUserMenu = () => {
    const userMenu = document.getElementById("user-menu")
    const isHidden = userMenu.classList.contains("hidden")
    if(!isHidden) 
    return userMenu.classList.add("hidden")
    userMenu.classList.remove("hidden")
}

const logOut = () =>{
    localStorage.clear()
    handleMenuUi()
}

const fetchProducts = async () =>{
    try{
        const productContainer = document.getElementById("product-container")
        const productNotFound = document.getElementById("product-not-found")
        const {data} = await axios.get('/product')
        // product is empty
        if(data.length === 0) 
            return productNotFound.style.display = "flex"
        // product awailable
        for(let product of data)
        {
            const ui =  `
                    <div class="shadow-md bg-white rounded-md">
                        <img class="h-[250px] object-cover w-full" src="${product.thumbnail ? `${server}/${product.thumbnail}` : '/images/avatar.png'}" alt="a">
                        <div class="space-y-2 p-4">
                            <h1 class="capitalize font-semibold text-lg">${product.title}</h1>
                            <span class="font-bold text-rose-600">${product.brand}</span>
                            <div class="flex gap-2">
                                <h1 class="font-bold">₹${product.price - (product.price*product.discount)/100}</h1>
                                <del>₹${product.price}</del>
                                <label class="text-neutral-500">(${product.discount}% off)</label>
                            </div>
                            <div class="flex gap-2">
                                <button
                                    onclick="buyNow('${product._id}')"
                                    class="text-sm flex bg-rose-500 text-white py-2 px-4 rounded-lg"
                                >
                                    Check Out
                                </button>
                                <button 
                                    onclick="addToCart('${product._id}')"
                                    class="text-sm flex gap-1 bg-green-500 text-white py-2 px-4 rounded-lg">
                                    <i class="ri-shopping-cart-line "></i>
                                    <span> 
                                        Add To Cart
                                    </span> 
                                </button>
                            </div>
                        </div>
                    </div>
            `
            productContainer.innerHTML += ui
        }
    }
    catch(err)
    {
        console.log(err.message)
    }
}

const buyNow = async (id) =>{
    try{
        const session = localStorage.getItem('auth')
        const options = {
            headers : {
                Authorization : `Bearer ${session}`
            }
        }
        const {data} = await axios.post('/checkout', {productId : id} , options)
        window.location.href = `/checkout.html?token=${data.token}`
    }catch(err){
        localStorage.clear()
        window.location.href = '/login.html'
    }
}
 
const addToCart = async (id) => {
    try{
        const authToken = localStorage.getItem('auth')
        const options = {
            headers : {
                Authorization : `Bearer ${authToken}`
            }
        }
        await axios.post('/cart',{product : id},options)
        new Swal({
            icon : 'success',
            title : 'Product Added',
        }) 
    }catch(err){
        new Swal({
            icon : 'error',
            title : 'Failed !',
            text : err.message
        })
    }
}