let contenedorProductos = document.getElementById("contenedor-productos");
let listaProductos = document.getElementById("lista-productos");
let getProductForm = document.getElementById("getProduct-form");
let url = "http://localhost:3000";

getProductForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);
    console.log(formData);

    let data = Object.fromEntries(formData.entries());
    console.log(data);

    let idProd = data.idProd;
    console.log(idProd);

    console.log(`realizando una peticion GET a la url ${url}/api/products/${idProd}`);
    let response = await fetch(`${url}/api/products/${idProd}`);

    let datos = await response.json();
    console.log(datos);

    let producto = datos.payload[0];
    console.log(producto);

    let htmlProducto = `
                <li class="li-producto">
                    <img class="producto-img" src="${producto.img_url}" alt="${producto.nombre}">
                    <p>id: ${producto.id} nombre: ${producto.nombre} <strong>precio: ${producto.precio}</strong></p>
                    </li>
                    <li class="li-botonera">
                        <input type="button" id="deleteProduct-button" value="Eliminar">
                    </li>
                `;

    listaProductos.innerHTML = htmlProducto;

    let deleteProduct_button = document.getElementById("deleteProduct-button")

    deleteProduct_button.addEventListener("click", event => {
        event.stopPropagation();

        let confirmacion = confirm("Queres eliminar este producto?");
        console.log(confirmacion);

        if (!confirmacion) {
            alert("Eliminacion cancelada");
        } else {
            eliminarProducto(producto.id);
        }
    });
});

async function eliminarProducto(id) {
    console.log(id);
    try {
        let response = await fetch(`${url}/api/products/${id}`, {
            method: "DELETE"
        });

        let result = await response.json();

        if (response.ok) {
            alert(result.message);

            listaProductos.innerHTML = "";
        } else {
            console.error("Error: ", result.message);
            alert("No se pudo eliminar el productos");
        }

    } catch (error) {
        console.error("Error en la solicitud DELETE: ", error);
        alert("Ocurrio un error al eliminar el producto");
    }
}