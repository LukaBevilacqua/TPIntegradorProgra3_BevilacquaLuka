let altaProducts_container = document.getElementById("altaProducts-container");
let url = "http://localhost:3000";

altaProducts_container.addEventListener("submit", async (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);

    let data = Object.fromEntries(formData.entries());

    try {
        let response = await fetch(`${url}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log(response);

            let result = await response.json();
            console.log(result.message);
            alert(result.message);

        };
    } catch (error) {
        console.error("Error al enviar los datos ", error);
        alert("error al procesar la solicitu");
    }
});