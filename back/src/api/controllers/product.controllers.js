
// controladores producto

import ProductsModels from "../models/product.models.js";

export const getAllProducts = async (req, res)=>{
    try{
    const [rows] = await ProductsModels.selectAllProducts();
    res.status(200).json({
        payload: rows, 
        message: rows.length === 0 ? "no se encontraron productos" : "productos encontrados"
    });
    } catch (error){
        res.status(500).json("error al consultar ventas.");
    }
}

export const getProductById = async (req, res)=>{
    try{
        let {id} = req.params;

        const [rows] = await ProductsModels.selectProductsWhereId(id);

        if(rows === 0){
            console.log("Error no existe producto con ese id");
            
            return res.status(404).json({
                message: `No se encontro producto con id: ${id}`
            });
        }

        res.status(200).json({
            payload: rows
        });
    }catch(error){
        console.error("error obteniendo producto", error.message);

        res.status(500).json({
            error: "error interno al obtener un producto con id"
        });
    }
}

export const createProduct = async (req, res)=>{
    try{
        const {nameProd: name, priceProd: price, category, imageProd: image} = req.body;
        console.log(req.body);

        if(!name || !price || !category || !image){
            return res.status(400).json({
                message: "Datos invalidos, asegurate de enviar todos los datos al formulario"
            });
        }
        let [rows] = await ProductsModels.insertProducts(name, price, category, image);

        res.status(201).json({
            message: "producto creado con exito"
        });


    }catch(error){
        console.error("error interno del servidor ", error);
        res.status(500).json({
            message: "error interno del servidor",
            error: error
        });
    }
}

export const modifyProduct = async (req, res)=>{
    try{
        let {id, nameProd: name, priceProd: price, category, imageProd: image, activeProd: active} = req.body;
        console.log("BODY RECIBIDO:", req.body);

        if(!id || !name || !price || !category || !image|| !active){
            return res.status(400).json({
                message: "Datos invalidos, asegurate de enviar todos los datos al formulario"
            });
        }

        let [result] = await ProductsModels.updateProduct(name, price, category, image, id);

        if(result.affectedRows === 0){
            return res.status(400).json({
                message: "No se actualizo el producto"
            });
        }

        res.status(200).json({
            message: "Producto actualizado correctamente"
        });

    }catch(error){
        console.error("Error al actualizar el producto: ", error);
        
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        })
    }
}

export const modifyActive = async (req, res)=>{
    try{
        let {id, active} = req.params;
        if(!id || !active){
            return res.status(400).json({
                message: "Datos invalidos, asegurate de enviar todos los datos"
            });
        }

        let [result] = await ProductsModels.updateActive(active, id);
        if(result.affectedRows === 0){
            return res.status(400).json({
                message: "No se actualizo el producto"
            });
        }

        res.status(200).json({
            message: "Producto actualizado correctamente"
        });

    }catch(error){
        console.error(error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
}

export const removeProduct = async (req, res)=>{
    try{
        let {id} = req.params;
        let [result] = await ProductsModels.deleteProduct(id);
        console.log(result);

        if(result.affectedRows === 0){
            return res.status(404).json({
                message: `No se encontro un producto con id: ${id}`
            });
        }

        return res.status(200).json({
            message:`Producto con id ${id} eliminado correctamente`
        })

    }catch(error){
        console.log(`Error al eliminar `, error);
        
        res.status(500).json({
            message: `Error al eliminar `,
            error: error.message
        });
    }
}