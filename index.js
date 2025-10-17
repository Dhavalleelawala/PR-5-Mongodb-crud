import express from "express";
import dotenv from "dotenv";
import { db } from "./configs/db.js";
import { User } from "./models/user.model.js";
import bodyParser from "body-parser";
import { LocalStorage } from "node-localstorage";
import { userAuth } from "./middlewares/userAuth.middleware.js";
global.localStorage = new LocalStorage('./scratch');

dotenv.config();
const port = process.env.PORT || 8081;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get("/",userAuth, (req, res) => {
  return res.render("./index");
});

app.get("/form-basic", (req, res) => {
  return res.render("./pages/form-basic");
});

app.get("/tables", (req, res) => {
  return res.render("./pages/tables");
});

app.get("/login", (req, res) => {
  return res.render("./pages/login");
});

app.post("/login", async (req, res) => {
  try {
    let rs = await fetch("http://localhost:5674/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    let data = await rs.json();
    console.log("login route",data);    
    if (data.success) {
      console.log(data.data);
      localStorage.setItem("id", JSON.stringify(data.data._id));
      return res.redirect("/");
    } else {
      return res.redirect(req.get("Referrer") || "/");
    }
  } catch (error) {
    console.log(error.message);
    return res.redirect(req.get("Referrer") || "/");
  }
});
// Login Api
app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      if (user.password == password) {
        return res.json({
          message: "Login Success",
          success: true,
          data: user,
        });
      } else {
        return res.json({ message: "Password Not match.", success: false });
      }
    } else {
      return res.json({ message: "User Not Found.", success: false });
    }
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
});

app.get("/signup", (req, res) => {
  return res.render("./pages/signup");
});

app.post("/signup", (req, res) => {
  console.log("data from signup", req.body);

  fetch("http://localhost:5674/user/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  })
    .then((rs) => {
      return rs.json();
    })
    .then((data) => {
      console.log(data);
      return res.redirect("/login");
    })
    .catch((error) => {
      console.log(error);
      return res.redirect(req.get("Referrer") || "/");
    });
});

// singup Api
app.post("/user/create", (req, res) => {
  console.log("data from Api", req.body);
  User.create(req.body)
    .then((data) => {
      return res.json(data);
    })
    .catch((error) => {
      return res.json(error.message);
    });
});

app.get("/user/getAllUser", (req, res) => {
  User.find({})
    .then((data) => {
      return res.json(data);
    })
    .catch((error) => {
      return res.json({ message: error.message });
    });
});

app.get("/user/delete/:id", (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id)
    .then((data) => {
      return res.json({ message: "User Deleted.", data });
    })
    .catch((error) => {
      return res.json({ message: error.message });
    });
});

app.post("/user/update/:id", (req, res) => {
  const { id } = req.params;
  User.findByIdAndUpdate(id, req.body)
    .then((data) => {
      return res.json({ message: "User Updated.", id: data.id });
    })
    .catch((error) => {
      return res.json({ message: error.message });
    });
});

app.listen(port, (err) => {
  if (!err) {
    console.log("Server start on port", port);
    console.log("http://localhost:" + port);
  }
});
