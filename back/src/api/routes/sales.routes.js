import { Router } from "express";
import connection from "../database/db.js"

const router = Router();

router.get("/", async (req, res)=>{
    try{
    let sql = "SELECT * FROM ventas";
    const [rows] = await connection.query(sql);
    res.status(200).json({payload: rows});
    } catch (error){
        res.status(500).json("error al consultar ventas.");
    }
    

});

router.get("/:id", async (req, res) => {
    try{
        let {id} = req.params;
        let querySql = "SELECT * FROM VENTAS WHERE id = ?";
        const {rows} = await connection.query(querySql, [id]);
        console.log(id);
        if (rows.lenght === 0){
            res.status(404).json("no se encontro el id "+ id);
        }
        res.status(200).json({payload: rows[0]});
    } catch(error){
        res.status(500).json("no se encontro el id de la venta");
    }
});


router.post("/", async (req, res) => {
    try{
        let {fecha, nombre_usuario, productos} = req.body;

        if(!fecha || !nombre_usuario || !Array.isArray(productos)){
            return res.status(400).json("debe llenar todos los campos")
        }
        
        let total = productos.reduce((acumulador, product) => {
            return acumulador + product.precio * product.cantidad;
        },
        0
    );

        let querySql = "INSERT INTO ventas (`fecha`, `nombre_usuario`, `total`) VALUES (?, ?, ?)";
        
        const [result] = await connection.query(querySql, [fecha, nombre_usuario, total]);
        const venta_id = result.insertId; 
        console.log(result);
        
        let queryVentaProducto = "INSERT INTO ventas_productos (venta_id, producto_id, precio, cantidad) VALUES (?, ?, ?, ?)";
        for(const producto of productos){
            const {producto_id, precio, cantidad} = producto;
            total += cantidad * precio;
            const ventaProducto = [venta_id, producto_id, precio, cantidad];

            const [result] = await connection.query(queryVentaProducto, ventaProducto);
            console.log(result);
            
        }
    res.status(201).json("salio todo joya");
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
});

/*
router.put();
router.delete();
*/

export default router;







