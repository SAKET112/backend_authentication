const express = require("express");
const {connection} = require("./configs/db");
const {UserModel} = require("./models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

app.get("/",(req, res) => {
    res.send("HOME PAGE")
})

app.post("/register", async(req, res) => {
    const {name, email, pass, age} = req.body
    try {
        bcrypt.hash(pass, 5, async (err, secure_password) => {
            if(err){
                console.log(err);
            } else{
                const user = new UserModel({email, pass:secure_password, name, age});
                await user.save();
                res.send("Registered Successfully")
            }
        });
    } catch (error) {
        res.send("Error in registering the User");
        console.log(error);
    }
});

app.post("/login", async (req, res) => {
    const {email, pass} = req.body;
    try {
        const user = await UserModel.find({email});
        console.log(user);
        
            const hashed_pass = user[0].pass;
        if (user.length > 0) {

            bcrypt.compare(pass, hashed_pass, (err, result) => {
                if(result){
                    const token = jwt.sign({ course: 'backend' }, 'masai');
                    res.send({"msg":"successfull", "token": token})
                } else{
                    res.send("Wrong email or password");
                }
            });
            
            
        }else{
            res.send("Wrong email or password");
        }
        
    } catch (error) {
        res.send("Something wnt wrong");
        console.log(error);
    }
});


app.get("/about", (req, res) => {
    res.send("Aout API")
});

app.get("/data", (req, res) => {

    const token=req.headers.authorization;
    console.log(token);

    jwt.verify(token, 'masai', (err, decoded) => {
        if(err){
            res.send("Invalid token");
            console.log(err);
        } else {
            res.send("Data.....")
        }
    });
});

app.get("/cart", (req, res) => {
    const token=req.query.token;

    jwt.verify(token, 'masai', (err, decoded) => {
        if(err){
            res.send("Invalid token");
            console.log(err);
        } else {
            res.send("Cart Page")
        }
    });
});

app.get("/contact", (req, res) => {
    res.send("Contacts Page")
})


app.listen(8080, async() => {
    try {
        await connection
        console.log("Connected to DB");
    } catch (error) {
        console.log("Trouble Conncting to DB");
        console.log(error);
    }
    console.log("Server is running at port 8080");
})