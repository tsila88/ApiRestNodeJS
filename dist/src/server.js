"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serve_static_1 = __importDefault(require("serve-static"));
const mongoose_1 = __importDefault(require("mongoose"));
const restaurant_model_1 = __importDefault(require("../model/restaurant.model"));
class Server {
    constructor(port) {
        this.port = port;
    }
    start() {
        const app = express_1.default(); //Lancement de express
        const uri = "mongodb://localhost:27017/db_Restaurant";
        mongoose_1.default.connect(uri, (error) => {
            if (error)
                console.log(error);
            else
                console.log("Mongo Data base connected successfuly");
        });
        app.use(serve_static_1.default("public")); //Pour utiliser le dossier public, on tapant sur Get il renvoie la page 
        // qui se trouve dans le dossier
        app.get("/", (req, resp) => {
            resp.send("Hello express Type Script...test");
        });
        //Importe les restaurants
        app.get("/restaurants", (req, resp) => {
            restaurant_model_1.default.find((error, restaurants) => {
                if (error)
                    resp.status(500).send(error);
                else
                    resp.send(restaurants);
            });
        });
        app.listen(this.port, () => {
            console.log("Server started ...");
        });
    }
}
exports.default = Server;
