const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const dbConnect = require("./utils/dbConnect");

class Server {
    app = "";
    port = "";
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.dbConnection();
        this.configs();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(morgan("dev"));
        this.app.use(
            express.urlencoded({
                extended: true,
            })
        );
        this.app.use(
            session({
                secret: "secreto",
                // saveUninitialized: true,
                // resave: true,
            })
        );

        this.app.use(passport.initialize());
        this.app.use(passport.session());

        // globalVariables
        // this.app.use((req, res, next) => {
        //     res.locals.user = req.user;

        //     next();
        // });
    }

    async dbConnection() {
        await dbConnect();
    }

    configs() {
        this.app.engine(
            ".hbs",
            engine({
                layoutsDir: path.join(__dirname, "views/layouts"),
                partialsDir: path.join(__dirname, "views/partials"),
                extname: ".hbs",
            })
        );
        this.app.set("view engine", ".hbs");
        this.app.set("views", __dirname + "/views");
    }

    routes() {
        this.app.use(require("./routes/users.routes"));
        this.app.use(require("./routes/posts.routes"));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("running on port ", this.port);
        });
    }
}

module.exports = Server;
