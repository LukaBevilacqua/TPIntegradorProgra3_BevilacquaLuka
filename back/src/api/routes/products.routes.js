import { Router } from "express";
import { validateId } from "../middlewares/middlewares.js";
import { createProduct, getAllProducts, getProductById, modifyProduct, removeProduct } from "../controllers/product.controllers.js";

const router = Router();

// todos los productos
router.get("/", getAllProducts);

// buscar por id
router.get("/:id", validateId, getProductById);

//crear producto
router.post("/", createProduct);

//actualizar producto
router.put("/", modifyProduct);

//eliminar producto
router.delete("/:id", validateId, removeProduct);

export default router;







