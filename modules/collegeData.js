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

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataInfo = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile('./data/students.json','utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataInfo = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataInfo.students.length == 0) {
            reject("No results Available"); return;
        }

        resolve(dataInfo.students);
    })
}

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataInfo.students.length; i++) {
            if (dataInfo.students[i].TA == true) {
                filteredStudents.push(dataInfo.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("No results Available"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataInfo.courses.length == 0) {
        reject("No results Available"); return;
    }

    resolve(dataInfo.courses);
   });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;

        for (let i = 0; i < dataInfo.students.length; i++) {
            if (dataInfo.students[i].studentNum == num) {
                foundStudent = dataInfo.students[i];
            }
        }

        if (!foundStudent) {
            reject("No results Available"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataInfo.students.length; i++) {
            if (dataInfo.students[i].course == course) {
                filteredStudents.push(dataInfo.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("No results Available"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        if (!dataInfo) {
            reject("Data not initialized");
            return;
        }

        studentData.TA = studentData.TA ? true : false;
        studentData.studentNum = dataInfo.students.length + 1;
        studentData.course = parseInt(studentData.course);

        // Maintain consistent key order
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

        // Append new student to in-memory collection
        dataInfo.students.push(orderedStudent);

        // Correct file path: Moves up one level from modules/ to project root, then into data/
        const filePath = path.join(__dirname, "../data/students.json");

        // Write updated students array to the file
        fs.writeFile(filePath, JSON.stringify(dataInfo.students, null, 4), "utf8", (err) => {
            if (err) {
                reject("Unable to write to students.json: " + err);
            } else {
                resolve();
            }
        });
    });
};




