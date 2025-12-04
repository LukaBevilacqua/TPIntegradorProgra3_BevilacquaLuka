let contenedorProductos = document.getElementById("contenedor-productos");
let listaProductos = document.getElementById("lista-productos");
let getProductForm = document.getElementById("getProduct-form");
let updateFormContainer = document.getElementById("updateFormContainer");
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
                <input type="button" id="updateProduct-button" value="Actualizar">
            </li>
        `;

    listaProductos.innerHTML = htmlProducto;

    let updateProduct_button = document.getElementById("updateProduct-button");
    updateProduct_button.addEventListener("click", event => {
        event.stopPropagation();
        crearFormulario(producto);
    });
});

async function crearFormulario(producto) {
    console.table(producto);
    updateFormHtml = `
                <form id="updateProducts-form">
                    <input type="hidden" name="id" id="idProd" value="${producto.id}" required>
                    <label for="nameProd">nombre</label>
                    <input type="text" name="nameProd" id="nameProd" value="${producto.nombre}" required>
                    <label for="priceProd">precio</label>
                    <input type="number" name="priceProd" id="priceProd" value="${producto.precio}" required>
                    <label for="categoryProd">categoria</label>
                    <select name="category" id="categoryProd" required>
                        <option value="guitarra" ${producto.tipo === "guitarra" ? "selected" : ""}>guitarra</option>
                        <option value="bajo" ${producto.tipo === "bajo" ? "selected" : ""}>bajo</option>
                    </select>
                    <label for="imageProd">imagen</label>
                    <input type="text" name="imageProd" id="imageProd" value="${producto.img_url}" required>
                    <input type="submit" value="Actualizar producto">
                    <input type="hidden" name="activeProd" id="activeProd" value="${producto.activo}" required>
                </form>
            `;
    updateFormContainer.innerHTML = updateFormHtml;

    let updateProducts_form = document.getElementById("updateProducts-form")

    updateProducts_form.addEventListener("submit", event => {
        actualizarProducto(event);
        alert("Producto actualizado");
        location.reload();
    });
}

async function actualizarProducto(event) {
    event.preventDefault();
    event.stopPropagation();

    let formData = new FormData(event.target);

    let data = Object.fromEntries(formData.entries());

    try {
        let response = await fetch(`${url}/api/products`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        if (response.ok) {
            console.log(result.message);
        } else {

        }
    } catch (error) {
        console.error(error);
    }
}