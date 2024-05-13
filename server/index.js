const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const uploads = require("express-fileupload");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");


const {notFound, errorHandler} = require("./middlewares/errorMiddleware");

dotenv.config();

const app = express();

app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(cors({credentials: true, origin: "http://localhost:3000"}));

app.use(uploads());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use(notFound);
app.use(errorHandler);




mongoose.connect(${process.env.MONGO_URL});





app.listen(process.env.PORT, ()=> console.log(`Server running on port ${process.env.PORT}`));
