const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequeizeStore = require('connect-session-sequelize');
const fileUpload = require('express-fileupload');
const db = require('./config/database');
const Users = require('./routes/Users');
const Events = require('./routes/Events');
require('dotenv').config();
const app = express();

const sessionStore = SequeizeStore(session.Store);
const store = new sessionStore({db:db});

const corsOptions = {
    origin: 'http://localhost:3000',
    optionSuccessStatus: 200
}

app.use(session({
    secret: process.env.SESS,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: "auto",
    },
    proxy: true
}));

app.use(cors(corsOptions));
app.use(express.static("public"));

app.use(express.json());
app.use(fileUpload());
app.use(Users);
app.use(Events);

app.listen(process.env.PORT, () => {console.log(`listening on port http://localhost:${process.env.PORT}`);});