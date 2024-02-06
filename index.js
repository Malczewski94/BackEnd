const socket = io ()

socket.on("allProduct", (products) => {
    console.log(products)
    const productsList = products.map(
      (product) =>
        `
            <div>
                <p><strong>ID</strong>: ${product.id}</p>
                <p><strong>Nombre</strong>: ${product.title}</p>
                <p><strong>Descripción</strong>: ${product.description}</p>
                <p><strong>Precio</strong>: ${product.price}</p>
                <p><strong>Codigo</strong>: ${product.code}</p>
                <p><strong>Existencias</strong>: ${product.stock}</p>
                <p><strong>Categoria</strong>: ${product.category}</p>
                <p><strong>Estado</strong>: ${product.status}</p>
                <p><strong>Imagen</strong>: ${product.thumbnails}</p>
            </div>
            <hr>
        `
    );
    document.getElementById('list-products').innerHTML = productsList.join("");
});

const formAddProducts = document.getElementById('formAddProducts')

formAddProducts.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const code = document.getElementById("code").value;
    const stock = document.getElementById("stock").value;
    
    socket.emit("newPdt", {
        title,
        description,
        price,
        code,
        stock,
        status: true,
        thumbnail: ["non-image"],
        category: "testing",
      });
});

const formDelete = document.getElementById('formDelete')

formDelete.addEventListener('submit', (e) => {
    e.preventDefault();
    const idPdt = document.getElementById('deleteId').value;
    socket.emit('delPdt', {
        idPdt,
    });
});


// Codigo Viejo

// socket.on('allProducts', (data) =>{
//     console.log(data)
//     render(data)
// })

// const render = (data) => {
//     const html = data.map(el => {
//         return (
//             `
//             <div>
//                 <p><strong>Nombre</strong>: ${el.body.title}</p>
//                 <p><strong>Descripción</strong>: ${el.body.description}</p>
//                 <p><strong>Precio</strong>: ${el.body.price}</p>
//                 <p><strong>Codigo</strong>: ${el.body.code}</p>
//                 <p><strong>Existencias</strong>: ${el.body.stock}</p>
//                 <p><strong>Categoria</strong>: ${el.body.category}</p>
//                 <p><strong>Estado</strong>: ${el.body.status}</p>
//                 <p><strong>Imagen</strong>: ${el.body.thumbnails}</p>
//             </div>
//             <hr>
//             `
//         )
//     }).join(' ')
//     document.getElementById('list-products').innerHTML = html
// }


// const formProducts = document.getElementById('form-products');

// formProducts.addEventListener('submit', (e) =>{
//     e.preventDefault();
//     const inputProducts = document.getElementsByClassName('input-products');
//     const submitData = {};
//     for(let i = 0; i < inputProducts.length; i++) {
//         if(inputProducts[i].type !== "submit") { // Evitar el botón de envío
//             const propertyName = inputProducts[i].name; // Obtener el nombre de la propiedad
//             const propertyValue = inputProducts[i].value; // Obtener el valor del input
//             submitData[propertyName] = propertyValue; // Asignar el valor al nombre de la propiedad en el objeto
//             inputProducts[i].value = '';
//         }
//     }
//     socket.emit('newPdt', { body: submitData });
// });
