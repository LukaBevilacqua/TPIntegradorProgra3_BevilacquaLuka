// Logica para trabajar con archivos y rutas del proyecto

import { fileURLToPath } from "url"; //convierte una url a una ruta de sistema archivo
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);

const __dirname = join(dirname(__filename), "../../../");

export{
    __dirname,
    join
}














