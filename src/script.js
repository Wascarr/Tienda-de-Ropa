document.addEventListener('DOMContentLoaded', function() {
    let carrito = [];
    const modal = document.getElementById('carrito-modal');
    const carritoContainer = document.querySelector('.carrito-container');
    const closeModal = document.querySelector('.close-modal');
    const carritoItems = document.getElementById('carrito-items');

    // Event Listeners
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-comprar')) {
            agregarAlCarrito(e);
        }
    });

    carritoContainer.addEventListener('click', () => {
        actualizarModalCarrito();
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (carrito.length > 0) {
            alert('¡Gracias por tu compra!');
            carrito = [];
            actualizarCarrito();
            actualizarModalCarrito();
            modal.style.display = 'none';
        }
    });

    // Cart Functions
    function agregarAlCarrito(e) {
        const producto = e.target.closest('.producto');
        const productoInfo = {
            id: producto.dataset.id,
            imagen: producto.querySelector('.producto-imagen').src,
            nombre: producto.querySelector('h3').textContent,
            precio: parseFloat(producto.querySelector('.precio').textContent.replace('$', '')),
            cantidad: 1
        };

        const itemExistente = carrito.find(item => item.id === productoInfo.id);
        
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            carrito.push(productoInfo);
        }

        actualizarCarrito();
        mostrarNotificacion('¡Producto agregado al carrito!');
    }

    function actualizarModalCarrito() {
        carritoItems.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            carritoItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        } else {
            carrito.forEach(item => {
                total += item.precio * item.cantidad;
                carritoItems.innerHTML += `
                    <div class="carrito-item" data-id="${item.id}">
                        <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-imagen">
                        <div class="carrito-item-info">
                            <h4>${item.nombre}</h4>
                            <p class="carrito-item-precio">${item.precio.toFixed(2)}</p>
                            <div class="carrito-item-cantidad">
                                <button class="btn-cantidad btn-restar">-</button>
                                <span class="cantidad-numero">${item.cantidad}</span>
                                <button class="btn-cantidad btn-sumar">+</button>
                                <button class="btn-eliminar">🗑️</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        document.getElementById('carrito-total').textContent = `${total.toFixed(2)}`;
        agregarEventosBotonesCarrito();
    }
    function agregarEventosBotonesCarrito() {
        document.querySelectorAll('.btn-restar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.carrito-item').dataset.id;
                restarCantidad(id);
            });
        });

        document.querySelectorAll('.btn-sumar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.carrito-item').dataset.id;
                sumarCantidad(id);
            });
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.carrito-item').dataset.id;
                eliminarDelCarrito(id);
            });
        });
    }

    function restarCantidad(id) {
        const item = carrito.find(item => item.id === id);
        if (item.cantidad > 1) {
            item.cantidad--;
        } else {
            eliminarDelCarrito(id);
        }
        actualizarCarrito();
        actualizarModalCarrito();
    }

    function sumarCantidad(id) {
        const item = carrito.find(item => item.id === id);
        item.cantidad++;
        actualizarCarrito();
        actualizarModalCarrito();
    }

    function eliminarDelCarrito(id) {
        carrito = carrito.filter(item => item.id !== id);
        actualizarCarrito();
        actualizarModalCarrito();
    }

    function actualizarCarrito() {
        const numeroItems = document.querySelector('.carrito-numero');
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        numeroItems.textContent = totalItems;
    }

    function mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.classList.add('notificacion');
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);

        setTimeout(() => {
            notificacion.remove();
        }, 2000);
    }
});
