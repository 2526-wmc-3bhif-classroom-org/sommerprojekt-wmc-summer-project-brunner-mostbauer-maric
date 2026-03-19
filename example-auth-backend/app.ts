// for installing all dependencies once run 'npm install'
// for starting the server run 'npm start'
// for starting the server in watchmode run 'npm run server-dev'

// import modules
import express from "express";
import 'dotenv/config';
import cors from "cors";

import { fruitRouter } from "./routers/fruit-router";
import { authRouter } from "./routers/auth-router";

// create express application
const app = express();

// mount middleware
app.use(cors());
app.use(express.json());    // parse JSON data and place result in req.body

// mount router(s)
app.use("/api/auth", authRouter);
app.use("/api/fruits", fruitRouter);

const port = process.env.PORT || 8080;
// start http server
app.listen(port, function () {
    console.log(`Server listening on port ${port}`);
});