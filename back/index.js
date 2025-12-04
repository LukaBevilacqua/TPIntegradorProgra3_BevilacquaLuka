import express from "express";
import environments from "./src/config/environments.js";
import cors from "cors";
import {productRoutes, sales} from "./src/api/routes/index.js";
import { loggerUrl, requireLogin} from "./src/api/middlewares/middlewares.js";
import { join, __dirname } from "./src/api/utils/index.js";
import connection from "./src/api/database/db.js";
import session from "express-session";


const app = express();
const PORT = environments.port;
const SESSION_KEY = environments.session_key;

//middlewares
app.use(express.json());
app.use(cors());
app.use(loggerUrl);
app.use(express.static(join(__dirname, "src", "public")));

//middleware de sesion
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: true
}));


//config
app.set("view engine", "ejs");
app.set("views", join(__dirname, "src", "views"));


/* rutas */
app.use("/api/products", productRoutes);
app.use("/api/sales", sales);

app.get("/", requireLogin, async (req, res)=>{
    try{
        const [rows] = await connection.query("SELECT * FROM productos");
        res.render("index", {
            title: "Dashboard",
            about: "Productos",
            productos: rows
        });
    }catch(error){
        console.error(error);
        
    }
});

app.get("/consultar", requireLogin, (req, res) => {
    res.render("consultar", {
        title: "Consultar",
        about: "Consultar producto por id:"
    });
});

app.get("/crear", requireLogin, (req, res)=>{
    res.render("crear", {
        title: "Crear",
        about: "Crear producto"
    });
});

app.get("/eliminar", requireLogin, (req, res)=>{
    res.render("eliminar", {
        title: "Eliminar",
        about: "Eliminar producto"
    });
});

app.get("/modificar", requireLogin, (req, res)=>{
    res.render("modificar", {
        title: "Modificar",
        about: "Modificar Producto"
    });
});

//login
app.get("/login", (req, res)=>{
    res.render("login", {
        title: "Login",
        about: "Login"
    });
});

app.post("/login", async (req, res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            res.render("login", {
                title: "Login",
                about: "Login",
                error: "Todos los campos son obligatorios"
            });
        }
    
        const sql = "SELECT * FROM usuarios WHERE correo = ? AND password = ?";
        const [rows] = await connection.query(sql, [email, password]);

        if(rows.length === 0){
            return res.render("login", {
                title: "Login",
                about: "Login",
                error: "Credenciales incorrectas"
            });
        }

        const user = rows[0];
        console.table(user);

        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            email: user.correo
        }

        res.redirect("/");


    }catch(error){
        console.error("erro en el login ", error);
    }
});

app.post("/logout", (req, res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log("Error al destruir la sesion ",err);
            return res.status(500).json({
                error: "Error al cerrar la sesion"
            });
        }
    });
    res.redirect("/login");
});

app.listen(PORT, ()=>{
    console.log(`servidor corriendo en el puerto ${PORT}`);
    
});

