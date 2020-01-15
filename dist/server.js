"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serve_static_1 = __importDefault(require("serve-static"));
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = __importDefault(require("./book.model"));
const body_parser_1 = __importDefault(require("body-parser"));
class Server {
    constructor(port) {
        this.port = port;
    }
    start() {
        const app = express_1.default(); //Lancement de express
        const uri = "mongodb://localhost:27017/db_Biblio";
        //Middleware bodyParser pour parser le corps  de la requetes en Json
        app.use(body_parser_1.default.json());
        mongoose_1.default.connect(uri, error => {
            if (error)
                console.log(error);
            else
                console.log("Mongo Data base connected successfuly");
        });
        app.use(serve_static_1.default("public")); //Pour utiliser le dossier public, on tapant sur Get il renvoie la page
        mongoose_1.default.connect(uri, error => {
            if (error)
                console.log(error);
            else
                console.log("Mongo Data base connected successfuly");
        });
        // Requete HTTP GET http://localhost:7777/
        app.get("/", (req, resp) => {
            resp.send("Hello express Type Script...test");
        });
        // Requete HTTP GET http://localhost:7777/books
        app.get("/books", (req, resp) => {
            //Equivalent de findAll
            book_model_1.default.find((error, books) => {
                if (error) {
                    resp.status(500).send(error);
                }
                else {
                    resp.send(books);
                }
            });
        });
        // Requete HTTP GET  http://localhost:7777/books/id
        app.get("/books/:id", (req, resp) => {
            book_model_1.default.findById(req.params.id, (error, book) => {
                if (error) {
                    resp.status(500).send(error);
                }
                else {
                    resp.send(book);
                }
            });
        });
        // Requete HTTP POST http://localhost:7777/books
        app.post("/books", (req, resp) => {
            let book = new book_model_1.default(req.body);
            book.save(error => {
                if (error)
                    resp.status(500).send(error);
                else
                    resp.send(book);
            });
        });
        // Requete HTTP PUT  http://localhost:7777/books/id
        app.put("/books/:id", (req, resp) => {
            book_model_1.default.findByIdAndUpdate(req.params.id, req.body, (error, book) => {
                if (error) {
                    resp.status(500).send(error);
                }
                else {
                    resp.send("Book updated successfully");
                }
            });
        });
        //Requete HTTP DELETE http://localhost:7777/books/id
        app.delete("/books/:id", (req, resp) => {
            book_model_1.default.findByIdAndDelete(req.params.id, error => {
                if (error) {
                    resp.status(500).send(error);
                }
                else {
                    resp.send("Book deleted successfully");
                }
            });
        });
        // Requete HTTP GET  http://localhost:7777/paginate_books?page=0&size=5
        app.get("/paginate_books", (req, resp) => {
            let p = parseInt(req.query.page || 1);
            let size = parseInt(req.query.size || 5);
            book_model_1.default.paginate({}, {
                page: p,
                limit: size
            }, function (err, result) {
                if (err)
                    resp.status(500).send(err);
                else
                    resp.send(result);
            });
        });
        // Requete HTTP GET  http://localhost:7777/books_search?kw=page=0&size=5
        app.get("/books_search", (req, resp) => {
            let p = parseInt(req.query.page || 1);
            let size = parseInt(req.query.size || 5);
            let kw = req.query.kw || "";
            book_model_1.default.paginate({
                title: { $regex: ".*(?)" + kw + ".*" }
            }, { page: p, limit: size }, (err, books) => {
                if (err)
                    resp.status(500).send(err);
                else
                    resp.send(books);
            });
        });
        //Lancement du serveur
        app.listen(this.port, () => {
            console.log("Server started ...");
        });
    }
}
exports.default = Server;
