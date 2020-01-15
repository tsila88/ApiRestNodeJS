import express, { Request, Response } from "express";
import serveStatic from "serve-static";
import mongoose from "mongoose";
import Book from "./book.model";
import bodyParser from "body-parser";
import { REFUSED } from "dns";

export default class Server {
  constructor(private port: number) {}

  public start(): void {
    const app = express(); //Lancement de express
    const uri = "mongodb://localhost:27017/db_Biblio";

    //Middleware bodyParser pour parser le corps  de la requetes en Json
    app.use(bodyParser.json());

    mongoose.connect(uri, error => {
      if (error) console.log(error);
      else console.log("Mongo Data base connected successfuly");
    });
    app.use(serveStatic("public")); //Pour utiliser le dossier public, on tapant sur Get il renvoie la page

    mongoose.connect(uri, error => {
      if (error) console.log(error);
      else console.log("Mongo Data base connected successfuly");
    });

    // Requete HTTP GET http://localhost:7777/
    app.get("/", (req: Request, resp: Response) => {
      resp.send("Hello express Type Script...test");
    });

    // Requete HTTP GET http://localhost:7777/books
    app.get("/books", (req: Request, resp: Response) => {
      //Equivalent de findAll
      Book.find((error, books) => {
        if (error) {
          resp.status(500).send(error);
        } else {
          resp.send(books);
        }
      });
    });

    // Requete HTTP GET  http://localhost:7777/books/id

    app.get("/books/:id", (req: Request, resp: Response) => {
      Book.findById(req.params.id, (error, book) => {
        if (error) {
          resp.status(500).send(error);
        } else {
          resp.send(book);
        }
      });
    });

    // Requete HTTP POST http://localhost:7777/books
    app.post("/books", (req: Request, resp: Response) => {
      let book = new Book(req.body);
      book.save(error => {
        if (error) resp.status(500).send(error);
        else resp.send(book);
      });
    });

    // Requete HTTP PUT  http://localhost:7777/books/id

    app.put("/books/:id", (req: Request, resp: Response) => {
      Book.findByIdAndUpdate(req.params.id, req.body, (error, book) => {
        if (error) {
          resp.status(500).send(error);
        } else {
          resp.send("Book updated successfully");
        }
      });
    });

    //Requete HTTP DELETE http://localhost:7777/books/id

    app.delete("/books/:id", (req: Request, resp: Response) => {
      Book.findByIdAndDelete(req.params.id, error => {
        if (error) {
          resp.status(500).send(error);
        } else {
          resp.send("Book deleted successfully");
        }
      });
    });

    // Requete HTTP GET  http://localhost:7777/paginate_books?page=0&size=5

    app.get("/paginate_books", (req: Request, resp: Response) => {

        let p:number = parseInt(req.query.page || 1);
        let size:number = parseInt(req.query.size || 5);
        Book.paginate({},{
            page: p,
            limit: size} ,function(err,result) {
                if (err) resp.status(500).send(err);
                else resp.send(result);
        });
    });


     // Requete HTTP GET  http://localhost:7777/books_search?kw=page=0&size=5

     app.get("/books_search", (req: Request, resp: Response) => {

        let p:number = parseInt(req.query.page || 1);
        let size:number = parseInt(req.query.size || 5);
        let kw:string =  req.query.kw || "";
        Book.paginate({
            title:{$regex:".*(?)"+kw+".*"}},{page:p, limit:size},(err,books)=>{
                if (err) resp.status(500).send(err);
                else resp.send(books);
        });
    });


    //Lancement du serveur
    app.listen(this.port, () => {
      console.log("Server started ...");
    });
  }
}
