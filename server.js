/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Varsha Maria Alex
*  Student ID: 180085235
*  Date: 08-03-2025
*
********************************************************************************/ 
const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData");
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
console.log("Serving static files from:", path.join(__dirname, "public"));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Ensure data is initialized before handling requests
let isInitialized = false;
collegeData.initialize()
    .then(() => {
        console.log("Data initialized successfully");
        isInitialized = true;
    })
    .catch(err => {
        console.error("Failed to initialize data:", err);
    });

app.use((req, res, next) => {
    if (!isInitialized) {
        return res.status(500).json({ message: "Server not initialized. Please try again later." });
    }
    next();
});

// Default route
app.get("/", (req, res) => {
    res.redirect("/home");
});

// Route to serve addStudent.html
app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "addStudent.html"));
});

// Home page route
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

// About page route
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

// HTML demo page route
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
});

// Get all students or by course
app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then(students => res.json(students))
            .catch(() => res.status(404).json({ message: "no results" }));
    } else {
        collegeData.getAllStudents()
            .then(students => {
                console.log("Students Retrieved:", students.length);
                res.json(students);
            })
            .catch(() => res.status(404).json({ message: "no results" }));
    }
});

// Get all teaching assistants
app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then(tas => res.json(tas))
        .catch(() => res.status(404).json({ message: "no results" }));
});

// Get all courses
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then(courses => res.json(courses))
        .catch(() => res.status(404).json({ message: "no results" }));
});

// Get a student by student number
app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then(student => res.json(student))
        .catch(() => res.status(404).json({ message: "no results" }));
});

// Route to handle form submission
app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => {
            res.send(`
                <html>
                <head>
                    <title>Student Added</title>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
                </head>
                <body class="d-flex justify-content-center align-items-center vh-100">
                    <div class="text-center">
                        <h2 class="mb-4">Student Added Successfully!</h2>
                        <a href="/home" class="btn btn-primary">Go Back to Home</a>
                        <a href="/students" class="btn btn-success">View All Students</a>
                    </div>
                </body>
                </html>
            `);
        })
        .catch(err => res.status(500).json({ message: "Error adding student: " + err }));
});

// 404 Page Not Found
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

module.exports = app;