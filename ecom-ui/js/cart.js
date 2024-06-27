window.onload = async () => {
    const session = await checkAuth()
    if(!session || session.role === 'admin') return window.location.href = '/'
    showCart()
}

const showCart = async () => {
    try{
        const authToken = localStorage.getItem('auth')
        const options = {
            headers : {
                Authorization : `Bearer ${authToken}`
            }
        }
        const {data} = await axios.get('/cart',options)
        const cartContainer = document.getElementById("cart-container")
        let loopIndex = 0
        for(let cart of data){
            const dynamicId = `cart-box-${loopIndex}`
            const ui = `
                        <div class="flex gap-4 bg-white border rounded-lg p-4" id="${dynamicId}">
                            <img 
                                src="${server}/${cart.product.thumbnail}" 
                                alt="a"
                                class="w-[120px]"
                            />
                            <div class="flex-1 space-y-2">
                                <div>
                                    <h1 class="text-lg font-semibold">${cart.product.title}</h1>
                                    <p class="text-gray-600 text-sm">
                                        ${cart.product.description.slice(0,200)}
                                    </p>
                                </div>
                                <div class="space-y-2">
                                    <h1 class="font-bold text-xl">$${cart.product.price-(cart.product.price*cart.product.discount)/100}</h1>
                                    <div class="flex gap-2 items-center">
                                        <del>${cart.product.price}</del>
                                        <p>${cart.product.discount}% Off</p>
                                    </div>
                                    <div class="flex items-center">
                                        <button class="border border-r-0 border-gray-300 w-[34px] h-[34px] flex justify-center items-center">-</button>
                                        <button class="border border-r-0 border-gray-300 w-[34px] h-[34px] flex justify-center items-center">4</button>
                                        <button class="border border-gray-300 w-[34px] h-[34px] flex justify-center items-center">+</button>
                                    </div>
                                </div>
                            </div>
                            <div class=" flex text-sm items-center gap-2 justify-center">
                                <button class="bg-green-500 text-white w-[120px] py-3 rounded-lg">
                                    <i class="ri-shopping-cart-line"></i>
                                    Buy Now
                                </button>
                                <button
                                    onclick="removeCart('${cart._id}','${dynamicId}')" 
                                    class="bg-rose-500 text-white w-[120px] py-3 rounded-lg">
                                    <i class="ri-delete-bin-6-line"></i>
                                    Remove
                                </button>
                            </div>
                        </div>
            `
        cartContainer.innerHTML += ui
        loopIndex += 1
        }
    }catch(err){
        console.log(err)
    }
}

const removeCart = async (id,cartBoxId) => {
    try{
        const token = localStorage.getItem('auth')
        const options = {
            headers : {
                Authorization : `Bearer ${token}`
            }
        }
        
        const res = await axios.delete(`/cart/${id}`,options)
        const cartBox = document.getElementById(cartBoxId)
        cartBox.remove()
    }catch(err){
        console.log(err)
    }
}