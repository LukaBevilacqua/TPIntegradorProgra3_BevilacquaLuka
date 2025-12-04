
// modelos producto
import connection from "../database/db.js";

const selectAllProducts = ()=>{
    let sql = "SELECT * FROM productos";
    return connection.query(sql);
}

const selectProductsWhereId = (id)=>{
    let sql = `SELECT * FROM productos where id = ?`;
    return connection.query(sql, [id]);
}

const insertProducts = (name, price, category, image)=>{
    let sql = "INSERT INTO productos (nombre, precio, tipo, img_url) VALUES (?, ?, ?, ?)";
    return connection.query(sql, [name, price, category, image]);
}

const updateProduct = (name, price, category, image, id)=>{
    let sql = `
        UPDATE productos 
        SET nombre = ?, precio = ?, tipo = ?, img_url = ?
        WHERE id = ?
    `;
    return connection.query(sql, [name, price, category, image, id]);
}

const deleteProduct = (id)=>{
    let sql = "DELETE FROM productos WHERE id = ?";
    return connection.query(sql, [id]);
}

export default{
    selectAllProducts,
    selectProductsWhereId,
    insertProducts,
    updateProduct,
    deleteProduct
}


