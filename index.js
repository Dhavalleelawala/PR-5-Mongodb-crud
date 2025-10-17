import express from "express";
import dotenv from "dotenv";
import { db } from "./configs/db.js";
import { User } from "./models/user.model.js";
import bodyParser from "body-parser";
import { Book } from "./models/book.model.js";

dotenv.config();
const port = process.env.PORT || 8081;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded());


app.get("/", (req, res) => {
  return res.render("./index");
});

app.get("/form-basic", (req, res) => {
  return res.render("./pages/form-basic");
});
// create book
app.post("/form-basic", async(req, res) => {
  try {
    await Book.create(req.body);
    return res.redirect(req.get('Referrer') || '/');
  } catch (error) {
    console.log(error.message);    
    return res.redirect(req.get('Referrer') || '/');
  }
});
// View book
app.get("/tables", async(req, res) => {
    try {
      let books = await Book.find({});
      return res.render('./pages/tables',{
        books
      });
    } catch (error) {
      console.log(error.message);
      return res.render('./pages/tables',{
        books:[]
      });
    }
});

// Delete Book
app.get('/book/delete/:id',async(req,res)=>{
  try {
    await Book.findByIdAndDelete(req.params.id);
    console.log("Book Deleted.");
    return res.redirect(req.get('Referrer') || '/');
  } catch (error) {
    console.log(error.message);    
    return res.redirect(req.get('Referrer') || '/');
  }
});

// render edit page
app.get('/book/edit/:id',async(req,res)=>{
  try {
    let {id} = req.params;
    let book = await Book.findById(id);
    return res.render('./pages/editBook',{
      book
    });
  } catch (error) {
    console.log(error.message);    
    return res.render('./pages/editBook',{
      book:{}
    });
  }
})

app.post('/book/edit/:id',async(req,res)=>{
  try {
    let {id} = req.params;
    await Book.findByIdAndUpdate(id,req.body);
    return res.redirect('/tables');
  } catch (error) {
    console.log(error.message);    
    return res.redirect(req.get('Referrer') || '/');
  }
})


app.get("/login", (req, res) => {
  return res.render("./pages/login");
});

app.get("/signup", (req, res) => {
  return res.render("./pages/signup");
});



app.listen(port, (err) => {
  if (!err) {
    console.log("Server start on port", port);
    console.log("http://localhost:" + port);
  }
});
