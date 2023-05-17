const mongoose = require('mongoose');
const dbName = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const pw = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${username}:${pw}@cluster0.asrdx5m.mongodb.net/${dbName}?retryWrites=true&w=majority`;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Established a connection to the database"))
    .catch(err => console.log("Something went wrong when connecting to the database", err));