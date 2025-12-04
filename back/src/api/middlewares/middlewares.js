// middleware logger
const loggerUrl = (req, res, next)=>{
    console.log(`[${new Date().toLocaleString()}]  ${req.method} ${req.url}`);
    next();
};

//middleware validador de id
const validateId = (req, res, next)=>{
    const {id} = req.params;

    if(!id || isNaN(Number(id))){
        return res.status(400).json({
            message: "El id del producto debe ser un numero valido"
        });
    };
    req.id = parseInt(id, 10);
    next();
};

//middleware para sesion creada
const requireLogin = (req, res, next) =>{
    if(!req.session.user){
        return res.redirect("/login");
    }
    next();
};


export{
    loggerUrl,
    validateId,
    requireLogin
}