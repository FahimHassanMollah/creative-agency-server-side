const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs-extra')
const MongoClient = require('mongodb').MongoClient;
let ObjectId = require('mongodb').ObjectID;
const app = express();
const port = 8080
app.use(cors());
app.use(bodyParser());
app.use(bodyParser.json());
app.use(express.static('ServiceImages'));
app.use(fileUpload());
require('dotenv').config();
app.get('/', (req, res) => {
    res.send('Hello World!')
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrzhf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const orderCollection = client.db("creative-agency").collection("orderDetails");
    const serviceCollection = client.db("creative-agency").collection("serviceDetails");
    const reviewCollection = client.db("creative-agency").collection("review");
    const adminCollection = client.db("creative-agency").collection("admin");
    app.post('/saveOrderInformations', (req, res) => {
        orderCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });
    app.post('/addService', (req, res) => {
        serviceCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });
    app.get('/getUserServiceListByEmail/:email', (req, res) => {
        console.log(req.params);
        orderCollection.find({ email: req.params.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    });
    app.get('/getServiceImage', (req, res) => {
        console.log(req.params);
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });
    app.post('/addReview', (req, res) => {
        reviewCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });
    // app.get('/getAllReview', (req, res) => {
    //     reviewCollection.find({})
    //         .toArray((err, documents) => {
    //             res.send(documents);
    //         })
    // });
    app.post('/getAllReview', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                return res.status(200).json(documents);
                // res.send(documents);
            })
    });
    app.get('/getAllOrderInformation', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });
    app.post('/addAdmin', (req, res) => {
        adminCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });
    app.post('/getAdmin', (req, res) => {
        adminCollection.find({ email: req.body.email })
            .toArray((err, documents) => {
                res.send(documents.length > 0)
            })
    });
    app.patch('/updateOrderStatus', (req, res) => {
        orderCollection.updateOne({ _id: ObjectId(req.body.id) },
            {
                $set: { status: req.body.status }
            })
            .then(result => {
                if (result.modifiedCount > 0) {
                    res.send(true);
                }
            })
    }
    )
    app.post('/adminAddService', (req, res) => {

        const file = req.files.file;

        const title = req.body.title;
        const description = req.body.descritpion;

        const newImg = file.data;
        const encImg = newImg.toString('base64');
        var image = {
            contentType:file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        serviceCollection.insertOne({ title, description, image })
            .then(result => {
                res.send(result.insertedCount > 0)

            })

    })
    app.get('/getAllService', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                if (documents.length > 0) {
                    // console.log(documents);
                    res.send(documents)

                }
            })
    });



    console.log('working ');
});
app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}) 