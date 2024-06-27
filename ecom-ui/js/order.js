axios.defaults.baseURL = server
window.onload = async () => {
    const session = await checkAuth()

    if(!session)
        return window.location.href = '/login.html'

    if(session.role === 'admin')
        return window.location.href = '/'

    fetchUserOrder()
}

const getStatusColor = (status) => {
    if(status === 'created')
    return 'bg-indigo-600'

    if(status === 'dispatched')
    return 'bg-rose-600'

    return 'bg-blue-600'
}

const fetchUserOrder = async () => {
    try{
        const token = localStorage.getItem('auth')
        const options = {
            headers : {
                Authorization : `Bearer ${token}`
            }
        }
        const {data} = await axios.get('/order/user',options)
        const orderBox = document.getElementById('order-box')
        for(let order of data){
            const ui = `
                <div class="flex gap-4 items-center">
                    <img 
                        src="${order.product.thumbnail ? server + '/' + order.product.thumbnail : '/images/avatar.png'}"
                        class="w-[100px]"
                    />
                    <div>
                        <h1 class="text-lg font-semibold capitalize">${order.product.title}</h1>
                        <label class="text-gray-600">${moment(order.createdAt).format('DD MMM YYYY, hh:mm:ss A')}</label>
                        <div class="spae-x-1 mt-1">
                            <label class="font-medium text-lg">₹ ${order.price - (order.price*order.discount)/100}</label>
                            <del>${order.price}</del>
                            <label>(${order.discount}% Off)</label>
                        </div>
                        <button 
                            class="capitalize text-xs font-medium ${getStatusColor(order.status)} text-white px-3 py-1 rounded mt-2">
                            ${order.status}
                        </button>
                    </div>
                </div>
            `
            orderBox.innerHTML += ui
        }
    }catch(err){
        console.log(err)
    }
}