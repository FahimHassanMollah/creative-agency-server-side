const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const port = 8080

app.use(cors());
app.use(bodyParser());
app.use(bodyParser.json());
require('dotenv').config();

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrzhf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const orderCollection = client.db("creative-agency").collection("orderDetails");
    app.post('/saveOrderInformations', (req, res) => {
        orderCollection.insertOne(req.body)
            .then(result => {

                res.send(result.insertedCount > 0);

            })
    });
    console.log('working ');
});


app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}) 