const socket = io ()

socket.on('allProducts', (data) =>{
    console.log(data)
})

const formProducts = document.getElementById('form-products')

formProducts.addEventListener('submit', (e) =>{
    e.preventDefault();
    const inputProducts = document.getElementsByClassName('input-products');
    const submit = inputProducts.value;

    socket.emit('newPdt', submit);
    
    inputProducts.value = '';
})