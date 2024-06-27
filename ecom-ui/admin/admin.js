let quill = null
let fileName = null
axios.defaults.baseURL = server
let options = null
window.onload = async () =>{
    const session = await checkAuth()
    if(!session || session.role !== 'admin')
        return window.location.href = '/'
        
    quill = new Quill('#editor', {
        theme: 'snow'
      });

    const token = localStorage.getItem('auth')
    options = {
        headers : {
            Authorization : `Bearer ${token}`
        }
    }

    await fetchProducts()

    await fetchPayments()

    await fetchOrder()

    await fetchUser()
}

const onTap = (elements) => {
    // hidden all data
    const tabData = document.getElementsByClassName("tabData")
    for(let el of tabData){
        el.style.display = "none"
    }
    // then show only active tab
    const tabContent = document.getElementById(elements)
    tabContent.style.display = "block"
}

const openDrawer = async() =>{
    const drawer = document.getElementById("drawer")
    drawer.style.width = "50%"
    drawer.style.transition = "0.3s"
    drawer.classList.add("p-8")
    await fetchBrands()
    await fetchCategory()
}
const closeDrawer = () =>{
    const drawer = document.getElementById("drawer")
    const form = document.getElementById("product-form")
    drawer.style.width = "0"
    drawer.style.transition = "0.1s"
    drawer.classList.remove("p-8")
    form.reset()
}

const createProduct = async (e) =>{
    e.preventDefault()
    const description = quill.root.innerHTML
    const form = e.target
    const data = {
        title : form.title.value,
        description : description,
        price : form.price.value,
        discount : form.discount.value,
        brand : form.brand.value,
        category : form.category.value,
        quantity : form.quantity.value
    }
    try{
        await axios.post("/product",data,options)
        closeDrawer()
        fetchProducts()
        new Swal({
            icon : 'success',
            title : 'Success',
            text : 'Product Added Successfully'
        })
    }
    catch(err){
        new Swal({
            icon : 'error',
            title : 'Failed',
            text : 'Unable to create product please try after sometime'
        })
    }
}

const fetchProducts = async () =>{
    const products = document.getElementById("products-cont")
    const {data} = await axios.get("/product")
    products.innerHTML = ''
    for(let product of data){
        const ui = `
                <div class="shadow-md bg-white p-4 rounded-md">
                <div class="border relative">
                    <img 
                        class="h-[250px] w-full object-cover"
                        src="${product.thumbnail ? 'http://localhost:8080/' + product.thumbnail : '/images/avatar.png'}"  
                        alt="avatar">
                    <input type="file" 
                    onchange="uploadProductImage(this,'${product._id}')"
                    class="border cursor-pointer opacity-0 w-full h-full absolute left-0 top-0" />
                </div>
                <div class="space-y-2">
                        <label class="text-sm text-gray-600">${product.createdAt}</label>
                        <h1>${product.title}</h1>
                        <span class="font-bold text-rose-600">${product.brand}</span>
                        <div class="flex gap-2">
                            <h1 class="font-bold">${product.price-(product.price*product.discount)/100}</h1>
                            <del>${product.price}</del>
                            <label class="text-neutral-500">(${product.discount}% off)</label>
                        </div>
                        <div class="flex gap-2">
                            <button 
                                class="bg-indigo-100 w-8 h-8 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white"
                            >
                                <i class="ri-edit-box-line"></i>
                            </button>
                            <button 
                                onclick="deleteProduct('${product._id}')"
                                class="bg-rose-100 w-8 h-8 text-rose-600 rounded-full hover:bg-rose-600 hover:text-white"
                            >
                                <i class="ri-delete-bin-3-line"></i>
                            </button>
                        </div>
                    </div>
                </div>
        `
        products.innerHTML += ui
    }
}

const deleteProduct = async (id) => {
    const res = confirm("Are you sure ?") 
    if(res){
        try{
            await axios.delete(`/product/${id}`,options)
            new Swal({
                icon : 'success',
                title : 'Success',
                text : 'Product successfully deleted'
            })
            fetchProducts()
        }
        catch(err)
        {
            new Swal({
                icon : 'error',
                title : 'Failed',
                text : 'Unable to delete this product'
            })
        }
    }
}

const uploadProgress = (progress) =>{
    const loaded = (progress.loaded/1024)/1024
    const total = (progress.total/1024)/1024
    const percent = (loaded*100)/total
    // with increasing
    const progressBar = document.getElementById("progress-bar")
    progressBar.style.width =  percent + "%"
    // showing file size and loaded
    const loadedEl = document.getElementById("loaded")
    loadedEl.innerHTML = loaded.toFixed(1) + 'Mb'
    // showing file size and total
    const totalEl = document.getElementById("total")
    totalEl.innerHTML = total.toFixed(1) + 'Mb'
    // showing file name
    const filenameEl = document.getElementById("filename")
    filenameEl.innerHTML = fileName 
}

const uploadProductImage = async (input,id) => {
    try{
        const file = input.files[0]
        const uploader = document.getElementById("uploader")
        uploader.style.display = 'block'
        fileName = file.name
        const formData = new FormData()
        formData.append('fileData',file)

        const {data} = await axios.post('/storage',formData,{onUploadProgress : uploadProgress, ...options})
        await axios.put(`/product/${id}`,{thumbnail: data.filename},options)
        uploader.style.display = "none"
        fetchProducts()
    }
    catch(err)
    {
        new Swal({
            icon:'error',
            title: 'Failed',
            text: 'Failed to upload file on server'
        })
    }
}

const fetchPayments = async () => {
    try{
        const {data} = await axios.get("/razorpay/payments",options)
        const paymentsTable = document.getElementById("payments-table")
        const noOfPayments = document.getElementById("no-of-payments")
        const totalSalesEl = document.getElementById("total-sales")
        const totalFeeEl = document.getElementById("total-fee")
        const totalTaxEl = document.getElementById("total-tax")
        let totalSales = 0
        let totalFee = 0
        let tax = 0 
        for(let payment of data.items) 
        {
            totalSales += (payment.amount/100)
            totalFee += payment.fee
            tax += payment.tax
            const ui = `
                <tr class="border-b">
                    <td class="py-4">
                        <div class="flex items-center gap-4">
                            <img src="/images/pic.jpg" class="w-12 h-12 rounded-full" alt="pic"/>
                            <div>
                                <h1 class="font-semibold">${payment.notes.name}</h1>
                                <small class="text-neutral-500">May 21, 2024</small>
                            </div>
                        </div>
                    </td>
                    <td class="py-4">${payment.email}</td>
                    <td class="py-4">${payment.contact}</td>
                    <td class="py-4">${payment.notes.address}</td>
                </tr>
            `
            paymentsTable.innerHTML += ui
        }
        noOfPayments.innerHTML = data.count
        totalSalesEl.innerHTML =  '₹'+ Math.round(totalSales).toLocaleString()
        totalTaxEl.innerHTML =  '₹'+ Math.round(tax).toLocaleString()
        totalFeeEl.innerHTML =  '₹'+ Math.round(totalFee).toLocaleString()
    }
    catch(err)
    {
        console.log(err.message)
    }
}

const fetchOrder = async() =>{
    try{
        const ordersTable = document.getElementById("orders-table")
        const {data} = await axios.get('/order',options)
        for(let order of data){
            const ui = `
            <tr class="border-b">
                <td class="py-4 pr-12">
                    ${moment(order.createdAt).format('DD MMM,YYYY hh:mm a')}             
                </td>
                <td class="py-4 pr-12">
                    <div class="flex items-center gap-4">
                        <img src="${server}/${order.product.thumbnail}" class="w-12 h-12 object-cover rounded-full" alt="pic"/>
                        <div>
                            <h1 class="font-semibold">${order.product.title}</h1>
                            <small class="text-neutral-500">id-${order.product._id}</small>
                        </div>
                    </div>
                </td>
                <td class="py-4 pr-12">₹${order.price}</td>
                <td class="py-4 pr-12">${order.discount}%</td>
                <td class="py-4 pr-12">
                    <h1 class="font-semibold">${order.user.fullname}</h1>
                </td>
                <td class="py-4 pr-12">${order.user.email}</td>
                <td class="py-4 pr-12">9319346402</td>
                <td class="py-4 pr-12">vasant kunj , new delhi 110070</td>
                <td class="py-4 pr-12">
                    <select class="p-2 border rounded border-gray-300" onchange="updateStatus(this,'${order._id}')">
                        <option disabled>Created</option>
                        <option value="packaging" ${order.status === 'packaging' && 'selected'}>Packaging</option>
                        <option value="dispatched" ${order.status === 'dispatched' && 'selected'}>Dispatch</option>
                    </select>
                </td>
            </tr>
            `
            ordersTable.innerHTML += ui
        }
    }catch(err){
        console.log(err.message)
    }
}

const updateStatus = async (select,id) => {
    if(select.value === 'created') return 
    try{
        const {data} = await axios.put(`/order/${id}`, {status : select.value},options)
        new Swal({
            icon : 'success',
            title : 'Success',
            text : 'Status Updated !'
        })
    } catch(err){
        new Swal({
            icon : 'error',
            title : 'Failed',
            text : 'Failed to update status'
        })
    }
} 

const showCreateBrand = () => {
    const brandCreatorBox = document.getElementById("brand-creator")
    const findclass = brandCreatorBox.className.indexOf('hidden')
    if(findclass !== -1) return brandCreatorBox.classList.remove('hidden')
    brandCreatorBox.classList.add('hidden')
}

const showCreateCategory = () => {
    const categoryCreatorBox = document.getElementById("category-creator")
    const findclass = categoryCreatorBox.className.indexOf('hidden')
    if(findclass !== -1) return categoryCreatorBox.classList.remove('hidden')
    categoryCreatorBox.classList.add('hidden')
}

const createBrand = async() => {
    const brand = document.getElementById("brand")
    if(brand.value.length === 0) return alert('This field is required !')

    try{
        await axios.post('/brand' , {title : brand.value},options)
        fetchBrands()
        const brandCreatorBox = document.getElementById("brand-creator")
        brandCreatorBox.className = 'hidden'
        brand.value = ''
    }catch(err){
        new Swal({
            icon : 'error',
            title : 'Failed !',
            text : err.message
        })
    }
}

const createCategory = async() => {
    const category = document.getElementById("category")
    if(category.value.length === 0) return alert('This field is required !')

    try{
        await axios.post('/category' , {title : category.value},options)
        fetchCategory()
        const categoryCreatorBox = document.getElementById("category-creator")
        categoryCreatorBox.className = 'hidden'
        category.value = ''
    }catch(err){
        new Swal({
            icon : 'error',
            title : 'Failed !',
            text : err.message
        })
    }
}

const fetchBrands = async () => {
    try{
        const select = document.getElementById('choose-brand')
        select.innerHTML = `<option value='other'>Choose a brand</option>`
        const {data} = await axios.get('/brand')
        for(let brand of data){
            const option = `<option value="${brand.title}" class="uppercase">${brand.title}</option>`
            select.innerHTML += option
        }
    }catch(err){
        console.log(err)
    }
}

const fetchCategory = async () => {
    try{
        const select = document.getElementById('choose-category')
        select.innerHTML = `<option value='other'>Choose a category</option>`
        const {data} = await axios.get('/category')
        for(let category of data){
            const option = `<option value="${category.title}" class="uppercase">${category.title}</option>`
            select.innerHTML += option
        }
    }catch(err){
        console.log(err)
    }
}

const fetchUser = async () => {
    try{
        const {data} = await axios.get('/user',options)
        const table = document.getElementById('customer-table')
        for(let user of data)
        {
            const ui = `
            <tr class="border-b">
                <td class="py-4">
                    <div class="flex items-center gap-4">
                        <img src="/images/pic.jpg" class="w-12 h-12 rounded-full" alt="pic"/>
                        <div>
                            <h1 class="font-semibold capitalize">${user.fullname}</h1>
                            <small class="text-neutral-500">${moment(user.createdAt).format('DD MMM YYYY, hh:mm:ss A')}</small>
                        </div>
                    </div>
                </td>
                <td class="py-4">${user.email}</td>
                <td class="py-4">${user.mobile}</td>
                <td class="py-4">${user.address}</td>
            </tr>
            `
            table.innerHTML += ui
        }
    }catch(err){
        console.log(err)
    }
}