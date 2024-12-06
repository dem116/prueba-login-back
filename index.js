const express = require("express");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const { dbConnection } = require("./config/db");
const routerApi = require("./routes/routesAPI");
const path = require('path');
const cors = require('cors');
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH); // Replace with the path to your service account key file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', routerApi);

dbConnection();

app.listen(PORT, () => console.log(`La aplicación está escuchando en el puerto http://localhost:${PORT}`));
