import express from "express";
import mongoose from "mongoose";

//connection with database
const DB_URL = "MONGODB URL";
mongoose.connect(DB_URL, {useUnifiedTopology: true, useNewUrlParser: true});
mongoose.connection.once("open", () => {
    console.log("Connected --> mongoDB");
});

//database pattern
const booksSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    type: String
});

//model to be manipulated
const booksModel = mongoose.model("livros", booksSchema);

const router = express.Router();

//creating routes

//GET request -> from MongoDB
router.get("/", (req, res) => {
    booksModel.find((err, books) => {
        if (err) res.status(500).send(err);
        res.json(books);
    });
});

//GET request by ID -> from MongoDB
router.get("/:id", (req, res) => {
    booksModel.findById(req.params.id, (err, book) => {
        if (book) {
            res.json(book);
        } else {
            res.status(404).send(`The book with ID ${req.params.id} was not found.`);
        }
    })
});

//POST request -> into MongoDB
router.post("/", (req, res) => {
    const id = new mongoose.Types.ObjectId();
    const toSave = Object.assign({
        _id: id
    }, req.body);

    const book = new booksModel(toSave);
    book.save().then((err, book) => {
        if (err) res.status(500).send(err);
        res.json(book);
    });
});

//Update MongoDB enter by ID
router.put("/:id", (req, res) => {
    booksModel.findById(req.params.id, (err, book) => {
        if (book) {
            //alter
            book.title = req.body.title;
            book.type = req.body.type;

            //save
            book.save().then((err, book) => {
                if (err) res.status(500).send(err);
                res.json(book);
            });
        } else {
            res.status(404).send(`The book with ID ${req.params.id} was not found.`);
        }
    });

});

//Delete MongoDB enter by ID
router.delete("/:id", (req, res) => {
    booksModel.findOneAndDelete(req.params.id, (err, book)=>{
        if (err) res.status(500).send(err);
        res.status(200).send(`Book with ID ${req.params.id} successfully deleted.`);
    });

});

export default router;
