let nombreUsuario = sessionStorage.getItem("nombreUsuario");

if(!nombreUsuario){
	window.location.href = "index.html";
}

let cuadriculaProductos = document.querySelector(".product-grid");
let barraBusqueda = document.querySelector(".search-bar");
let botonesCarrito = document.querySelectorAll(".add-to-cart");
let objetosCarrito = document.getElementById("cart-items");
let precioCarrito = document.getElementById("total-price");
let contadorCarrito = document.getElementById("cart-count");
let boton_imprimir = document.getElementById("btn-imprimir");

let checkboxGuitarra = document.getElementById("checkboxGuitarra");
let checkboxBajo = document.getElementById("checkboxBajo");

let productos = [];
let carrito = [];

const url = "http://localhost:3000/api/products"; 

async function obtenerProductos() {
    try {
        let respuesta = await fetch(url);

        let data = await respuesta.json();

        console.log(data);

        productos = data.payload; 
        
        if (checkboxGuitarra) checkboxGuitarra.checked = true;
        if (checkboxBajo) checkboxBajo.checked = true;
        
        mostrarProductos(productos);
    } catch(error) {
        console.error(error);
    }
}

function mostrarProductos(array) {
    let cartaProducto = "";
    
    for(let i = 0; i < array.length; i++) {   
        if(array[i].activo == 1){
            cartaProducto += `
                <div class="product-card">
                    <img src="${array[i].img_url}" alt="${array[i].nombre}">
                    <h3>${array[i].nombre}</h3>
                    <p>$${array[i].precio}</p>
                    <p>${array[i].tipo}</p>
                    <button class="add-to-cart" onclick="agregarCarrito(${array[i].id})">Agregar a carrito</button>
                </div>
            `;
        }
    }
    cuadriculaProductos.innerHTML = cartaProducto;
}

function saludarUsuario() {
    let saludoUsuario = document.getElementById("saludo-usuario");
    saludoUsuario.innerHTML = `Bienvenidx ${nombreUsuario}!`;
}

function mostrarCarrito() {
    let carritoCompra = "";
    precioTotal = 0;

    carrito.forEach((producto, indice) => {
        carritoCompra += `
            <li class="item-block">
                <p class="item-name">${producto.nombre} - $${producto.precio}</p>
                <button class="delete-button" onclick="eliminarProducto(${indice})">Eliminar</button>
            </li>
            `;
            
        precioTotal += parseInt(producto.precio, 10);
    });

    objetosCarrito.innerHTML = carritoCompra;
    precioCarrito.innerHTML = `$${precioTotal}`;
    contadorCarrito.innerHTML = carrito.length;

    if(carrito.length > 0) {
        document.getElementById("empty-cart").classList.remove("hidden");
        document.getElementById("empty-cart").classList.add("visible");
        
        document.getElementById("btn-imprimir").classList.remove("hidden");
        document.getElementById("btn-imprimir").classList.add("visible");
    } else {
        document.getElementById("empty-cart").classList.remove("visible");
        document.getElementById("empty-cart").classList.add("hidden");
        document.getElementById("btn-imprimir").classList.remove("visible");
        document.getElementById("btn-imprimir").classList.add("hidden");
        
        objetosCarrito.innerHTML = `<p class="info-carrito">No hay productos en el carrito.</p>`;
    }
}

function aplicarFiltroTipo(arrayProductos) {
    if (!checkboxGuitarra || !checkboxBajo) {
        return arrayProductos;
    }

    const mostrarGuitarras = checkboxGuitarra.checked;
    const mostrarBajos = checkboxBajo.checked;
    
    if (!mostrarGuitarras && !mostrarBajos) {
        return [];
    }
    
    if (mostrarGuitarras && mostrarBajos) {
        return arrayProductos;
    }
    
    return arrayProductos.filter((producto) => {
        const tipo = producto.tipo ? producto.tipo.toLowerCase() : "";
        
        if (mostrarGuitarras && !mostrarBajos) {
            return tipo.includes("guitarra");
        }
        
        if (mostrarBajos && !mostrarGuitarras) {
            return tipo.includes("bajo");
        }
        
        return true;
    });
}

function aplicarTodosLosFiltros() {
    const valorBusqueda = barraBusqueda.value;
    let productosFiltrados = productos.filter((producto) => {
        return producto.nombre.includes(valorBusqueda);
    });

    productosFiltrados = aplicarFiltroTipo(productosFiltrados);

    mostrarProductos(productosFiltrados);
}

if (checkboxGuitarra && checkboxBajo) {
    checkboxGuitarra.addEventListener("change", aplicarTodosLosFiltros);
    checkboxBajo.addEventListener("change", aplicarTodosLosFiltros);
}

barraBusqueda.addEventListener("keyup", filtrarProductos);

function filtrarProductos() {
	let valorBusqueda = barraBusqueda.value;
	let productosFiltrados = productos.filter((producto) => {
		return producto.nombre.includes(valorBusqueda);
	});
	
	productosFiltrados = aplicarFiltroTipo(productosFiltrados);
	
	mostrarProductos(productosFiltrados);
}

boton_imprimir.addEventListener("click", imprimirTicket);

function imprimirTicket() {
    alert("Compra exitosa");
    vaciarCarrito();
}

async function registrarVenta(precioTotal, idProductos) {
    const fecha = new Date()
    .toLocaleString("sv-SE", { hour12: false })  
    .replace("T", " ");

    console.log(fecha);

    const data = {
        date: fecha, 
        total_price: precioTotal,
        user_name: nombreUsuario,
        products: idProductos
    }

    const response = await fetch("http://localhost:3000/api/sales", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if(response.ok) {
        console.log(response);
        alert(result.message);

        sessionStorage.removeItem("nombreUsuario");

        window.location.href = "index.html"
    } else {
        alert(result.message);
    }
}

function agregarCarrito(id) {
	let instrumentoSeleccionada = productos.find(instrumento => instrumento.id === id);
	carrito.push(instrumentoSeleccionada);

	mostrarCarrito();
}

function eliminarProducto(index) {
    carrito.splice(index, 1);
    mostrarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
}

function init() {
    obtenerProductos();
    saludarUsuario();
}

init();