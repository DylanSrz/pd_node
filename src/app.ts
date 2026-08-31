import express from "express";
import 'dotenv/config';
import db from "./config/db.js";

// import routerRoles from './routes/role.routes.js'
// import routerTypeIdentification from './routes/type_identification.routes.js'
// import routerCities from './routes/cities.routes.js'
// import routerSchedule from './routes/schedule.routes.js'

const { PORT } = process.env;

const app = express();

app.use(express.json());

// ENDPOINTS DE MI API
// app.use('/roles', routerRoles)
// app.use('/type_identification', routerTypeIdentification)
// app.use('/cities', routerCities)
// app.use('/schedule', routerSchedule)

start()

async function start() {

    try {

        await db.authenticate()

        // await db.sync({alter: true})

        app.listen(PORT, () => {
            console.log(`Server running in PORT: ${PORT}`)
            // console.log(`Docs disponibles en: http://localhost:${PORT}/api-docs`)
        })
    } catch (error) {
        console.log(error)
        console.log('Error en APP')
    }
}