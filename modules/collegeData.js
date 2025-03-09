/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Varsha Maria Alex
   Student ID: 180085235
   Date: 08-03-2025
*
********************************************************************************/ 
const fs = require("fs");
const path = require("path");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataInfo = null;

// Initialize data by reading from JSON files
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        // Use absolute path resolution to ensure compatibility with Vercel
        const courseFilePath = path.join(__dirname, "../data/courses.json");
        const studentFilePath = path.join(__dirname, "../data/students.json");

        fs.readFile(courseFilePath, 'utf8', (err, courseData) => {
            if (err) {
                reject("Unable to load courses: " + err);
                return;
            }

            fs.readFile(studentFilePath, 'utf8', (err, studentData) => {
                if (err) {
                    reject("Unable to load students: " + err);
                    return;
                }

                // Parse JSON data and initialize Data object
                dataInfo = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
};

// Get all students
module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (!dataInfo || dataInfo.students.length === 0) {
            reject("No results available");
            return;
        }
        resolve(dataInfo.students);
    });
};

// Get all teaching assistants
module.exports.getTAs = function () {
    return new Promise((resolve, reject) => {
        if (!dataInfo) {
            reject("Data not initialized");
            return;
        }

        const filteredStudents = dataInfo.students.filter(student => student.TA === true);

        if (filteredStudents.length === 0) {
            reject("No results available");
            return;
        }

        resolve(filteredStudents);
    });
};

// Get all courses
module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (!dataInfo || dataInfo.courses.length === 0) {
            reject("No results available");
            return;
        }
        resolve(dataInfo.courses);
    });
};

// Get student by student number
module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        if (!dataInfo) {
            reject("Data not initialized");
            return;
        }

        const foundStudent = dataInfo.students.find(student => student.studentNum == num);

        if (!foundStudent) {
            reject("No results available");
            return;
        }

        resolve(foundStudent);
    });
};

// Get students by course
module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        if (!dataInfo) {
            reject("Data not initialized");
            return;
        }

        const filteredStudents = dataInfo.students.filter(student => student.course == course);

        if (filteredStudents.length === 0) {
            reject("No results available");
            return;
        }

        resolve(filteredStudents);
    });
};

// Add a new student (in-memory solution for Vercel)
module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        if (!dataInfo) {
            reject("Data not initialized");
            return;
        }

        // Prepare student data
        studentData.TA = studentData.TA ? true : false;
        studentData.studentNum = dataInfo.students.length + 1;
        studentData.course = parseInt(studentData.course);

        const orderedStudent = {
            studentNum: studentData.studentNum,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            addressStreet: studentData.addressStreet,
            addressCity: studentData.addressCity,
            addressProvince: studentData.addressProvince,
            TA: studentData.TA,
            status: studentData.status,
            course: studentData.course
        };

        // Add student to in-memory collection
        dataInfo.students.push(orderedStudent);
        resolve(); // Resolve without writing to file (Vercel limitation)
    });
};



