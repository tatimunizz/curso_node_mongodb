import express from "express";
import booksRoute from "./routers/booksRoute.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import https from "https";
import fs from "fs";
import localBooks from "./data/localBooks.json";
import router from "./routers/booksRoute.js";

const tlsOptions = {
    key: fs.readFileSync(path.join("key.pem")),
    cert: fs.readFileSync(path.join("cert.pem")),
    passphrase: "teste"
}

const PORT = 3000;
const PORT_TLS = 3003;
const server = express();

//template for creating URL
const createURL = (version, path) => `/api/${version}/${path}`;
const BOOKS_URL = createURL("v1", "books");

server.set("views", path.join("views"));
server.set("view engine", "ejs");

server.use(morgan('tiny'));
server.use(bodyParser.json());
server.use(BOOKS_URL, booksRoute);
//server.use(express.static("public"));

/*server.get("/download/images/:imageName", (req, res) =>{
   res.download(path.join("/public", "images", req.params.imageName));
});*/

server.get("/local-api-example", (req, res)=>{
    res.render("index", { books: localBooks });
});

server.listen(PORT, ()=>{
    console.log(`Server ON using ${PORT} port`);
});

//encrypted server
https.createServer(tlsOptions, server).listen(PORT_TLS, () =>{
    console.log(`HTTPS server ON ${PORT_TLS} port.`);
});
