const socket = io();

// Actualizar lista de productos al conectarse
socket.on('updateProducts', (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Limpiar lista existente

    products.forEach(product => {
        const li = document.createElement('li');
        li.dataset.id = product.id;
        li.textContent = `${product.name} - Precio: $${product.price}`;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Eliminar';
        removeBtn.className = 'remove-btn';
        removeBtn.onclick = () => removeProduct(product.id);
        
        li.appendChild(removeBtn);
        productList.appendChild(li);
    });
});

// Agregar nuevo producto desde el formulario
document.getElementById('productForm').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;

    socket.emit('addProduct', { name, price }); // Emitir evento para agregar producto

    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
});

// Escuchar eventos para actualizar la lista cuando se agrega un producto
socket.on('productAdded', (product) => {
    const productList = document.getElementById('productList');
    
    const li = document.createElement('li');
    li.dataset.id = product.id;
    li.textContent = `${product.name} - Precio: $${product.price}`;
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Eliminar';
    removeBtn.className = 'remove-btn';
    removeBtn.onclick = () => removeProduct(product.id);
    
    li.appendChild(removeBtn);
    productList.appendChild(li);
});

// Función para eliminar un producto
function removeProduct(id) {
    socket.emit('removeProduct', id); // Emitir evento para eliminar producto
}

// Escuchar eventos para actualizar la lista cuando se elimina un producto
socket.on('productRemoved', (id) => {
    const productList = document.getElementById('productList');
    
    const itemToRemove = [...productList.children].find(item => item.dataset.id === id);
    
    if (itemToRemove) {
        productList.removeChild(itemToRemove);
    }
});