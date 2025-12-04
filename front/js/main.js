// sin ia
let contenedorProductos = document.getElementById("contenedor-productos");
let url = "http://localhost:3000";


async function obtenerProductos() {
    try{
        let response = await fetch(`${url}/api/products/`);
        let  data = await response.json();
        let productos = data.payload;
        console.table(productos);

        mostrarProductos(productos);

    }catch(error){
        console.error("error obteniendo productos ", error);
        
    }
}

function mostrarProductos(Array){
    let htmlProductos = "";

    Array.forEach(prod => {
        htmlProductos += `
            <div class="card-producto">
                <img class="producto-img" src="${prod.img_url}" alt="${prod.nombre}">
                <h3>${prod.nombre}</h3>
                <p>Id: ${prod.id}</p>
                <p>$${prod.precio}</p>
            </div>
        `;
        contenedorProductos.innerHTML = htmlProductos;
    });
}

function init(){
    obtenerProductos();
}

init();






