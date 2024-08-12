import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, get, set, update, remove } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyANeV-QaMFvJlo9udiekdMvBG7oCU0VWE0",
    authDomain: "student-teacher-booking-webapp.firebaseapp.com",
    projectId: "student-teacher-booking-webapp",
    storageBucket: "student-teacher-booking-webapp.appspot.com",
    messagingSenderId: "787638806906",
    appId: "1:787638806906:web:7c235e877e971ed5ef0ec3",
    measurementId: "G-EQLRJMW33C"
};

function writeStuData(userId, name, email, password, mobile, age, address) {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();

    const reference = ref(db, 'Student/' + userId)
    set(reference, {
        userId: userId,
        username: name,
        email: email,
        password: password,
        mobile: mobile,
        age: age,
        address: address
    });
}

writeStuData('STA-S000', 'name', 'email', 'password', 'mobile', 'age', 'address')
var key = null
var len = null
var keys = []
var globalData = null

function readStu(callback) {
    const app = initializeApp(firebaseConfig);
    let db = getDatabase()
    const dbRef = ref(db, 'Student/');
    return get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                keys = []
                snapshot.forEach(item => {
                    key = item.key
                    keys.push(item.key)
                })
                if (snapshot.key != 'STA-S000')
                    globalData = snapshot.val();
                callback();
            } else {
                throw new Error('No data available')
            }
        })
        .catch((error) => {
            console.error('Error getting data:', error);
            throw error;
        });
}

function AddStu() {
    let Name = document.getElementById('Name').value
    let Email = document.getElementById('Email').value
    let Password = document.getElementById('Password').value
    let Mobile = document.getElementById('Mobile').value
    let Age = document.getElementById('Age').value
    let Address = document.getElementById('Address').value
    readStu(() => {
        let end = parseInt(key.substring(key.length - 1, key.length)) + 1
        let start = key.substring(0, key.length - 1)
        if (end > 9) {
            start = key.substring(0, key.length - 2)
        } else if (end > 99) {
            start = key.substring(0, key.length - 3)
        }
        let uid = `${start}${end}`
        writeStuData(uid, Name, Email, Password, Mobile, Age, Address)
        swal('Registration Successfull', `Student Added Successfully!<br>UserName: ${uid}<br>Password: ${Password}`, 'success')
        techData(uid)
    })
}

document.getElementById('Submit').addEventListener('click', validate)
document.querySelectorAll('input.inp').forEach(inp => {
    inp.addEventListener('change', validate)
})

function validate() {
    console.log(this.id)
    let name = document.getElementById('Name').value
    let email = document.getElementById('Email').value
    let password = document.getElementById('Password').value
    let mobile = document.getElementById('Mobile').value
    let age = document.getElementById('Age').value
    let address = document.getElementById('Address').value

    if (this.id == "Name" || this.id == 'Submit') {
        if (String(name).trim().length <= 3) {
            setVisibility('hidden', 'Name-correct')
            setVisibility('visible', 'Name-incorrect')
            setVisibility('visible', 'error-Name', 'Name-incorrect')
            document.getElementById('error-Name').innerHTML = "Name's length must be greater than 3!"
        } else {
            setVisibility('visible', 'Name-correct')
            setVisibility('hidden', 'Name-incorrect')
            setVisibility('hidden', 'error-Name', 'Name-incorrect')
            document.getElementById('error-Name').innerHTML = "Name's length must be greater than 3!"
        }
    }

    if (this.id == "Email" || this.id == 'Submit') {
        if (email.indexOf("@") == -1) {
            setVisibility('hidden', 'Email-correct')
            setVisibility('visible', 'error-Email', 'Email-incorrect')
            document.getElementById('error-Email').innerHTML = "Email must contain '@' sign!"
        } else if (email.match('@').length >= 2) {
            console.log(1)
            setVisibility('hidden', 'Email-correct')
            setVisibility('visible', 'error-Email', 'Email-incorrect')
            document.getElementById('error-Email').innerHTML = "Email must be valid!"
        } else if (email.substring(0, email.indexOf('@')).length < 3) {
            console.log(2)
            setVisibility('hidden', 'Email-correct')
            setVisibility('visible', 'error-Email', 'Email-incorrect')
            document.getElementById('error-Email').innerHTML = "Email must be valid!"
        } else if (email.substring(email.indexOf('@') + 1, email.lastIndexOf('.')).length < 5) {
            setVisibility('hidden', 'Email-correct')
            setVisibility('visible', 'error-Email', 'Email-incorrect')
            document.getElementById('error-Email').innerHTML = "Email must have valid domain!"
        } else if (email.substring(email.lastIndexOf('.'), email.length - 1).length <= 1) {
            setVisibility('hidden', 'Email-correct')
            setVisibility('visible', 'error-Email', 'Email-incorrect')
            document.getElementById('error-Email').innerHTML = "Email must have valid domain!"
        } else {
            setVisibility('visible', 'Email-correct')
            setVisibility('hidden', 'error-Email', 'Email-incorrect')
        }
    }

    if (this.id == "Password" || this.id == 'Submit') {
        if (password.trim().length < 8) {
            setVisibility('hidden', 'Password-correct')
            setVisibility('visible', 'error-Password', 'Password-incorrect')
            document.getElementById('error-Password').innerHTML = "Length of Password must be more than 8"
        } else {
            setVisibility('visible', 'Password-correct')
            setVisibility('hidden', 'error-Password', 'Password-incorrect')
        }
    }

    if (this.id == "Mobile" || this.id == 'Submit') {
        if (mobile.trim().length < 10 || mobile.trim().length > 10) {
            setVisibility('hidden', 'Mobile-correct')
            setVisibility('visible', 'error-Mobile', 'Mobile-incorrect')
            document.getElementById('error-Mobile').innerHTML = "Mobile No. must be valid!"
        } else if (isNumeric(mobile) == false) {
            setVisibility('hidden', 'Mobile-correct')
            setVisibility('visible', 'error-Mobile', 'Mobile-incorrect')
            document.getElementById('error-Mobile').innerHTML = "Mobile No. can only contain digits!"
        } else {
            setVisibility('visible', 'Mobile-correct')
            setVisibility('hidden', 'error-Mobile', 'Mobile-incorrect')
        }
    }

    if (this.id == "Age" || this.id == 'Submit') {
        if (isNumeric(age) == false) {
            setVisibility('hidden', 'Age-correct')
            setVisibility('visible', 'error-Age', 'Age-incorrect')
            document.getElementById('error-Age').innerHTML = "Enter a Valid Age!"
        } else if (age.trim().length < 1 || parseFloat(age) > 150) {
            setVisibility('hidden', 'Age-correct')
            setVisibility('visible', 'error-Age', 'Age-incorrect')
            document.getElementById('error-Age').innerHTML = "Enter a Valid Age!"
        } else {
            setVisibility('visible', 'Age-correct')
            setVisibility('hidden', 'error-Age', 'Age-incorrect')
        }
    }

    if (this.id == "Address" || this.id == 'Submit') {
        if (address.trim().length < 1) {
            setVisibility('hidden', 'Address-correct')
            setVisibility('visible', 'error-Address', 'Address-incorrect')
            document.getElementById('error-Address').innerHTML = "This field can't be empty!"
        } else {
            setVisibility('visible', 'Address-correct')
            setVisibility('hidden', 'error-Address', 'Address-incorrect')
        }
    }

    if (name != "" && email.length != "" && password.length != "" && mobile.length != "" && age.length != "" &&
        address.length != "" && this.id == 'Submit') {
        AddStu()
    }

}


function setVisibility(visibility, ...args) {
    args.forEach(argument => {
        document.getElementById(argument).style.visibility = visibility
    })
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


function techData(key) {
    let table = document.createElement('table')
    table.id = key
    let div = document.createElement('div')
    div.className = 'Stu-Heading'

    let h1 = document.createElement('h1')
    h1.className = 'stu-title'
    h1.innerHTML = 'Student Details'

    div.appendChild(h1)
    readStu(() => {
        document.querySelector('span.userTitle').innerHTML = `${globalData[key].userId}<br>${globalData[key].username}`
        table.innerHTML = `
            <tr><td>UserId:</td><td>${globalData[key].userId}</td></tr>
            <tr><td>Name:</td><td>${globalData[key].username}</td></tr>
            <tr><td>Email:</td><td>${globalData[key].email}</td></tr>
            <tr><td>Password:</td><td>${globalData[key].password}</td></tr>
            <tr><td>Mobile:</td><td>${globalData[key].mobile}</td></tr>
            <tr><td>Department:</td><td>${globalData[key].age}</td></tr>
            <tr><td>Address:</td><td>${globalData[key].address}</td></tr>
            `
    })
    document.querySelector('div.register-div').remove()
    document.querySelector('div.register').appendChild(div)
    document.querySelector('div.register').appendChild(table)
}

document.getElementById('Home').addEventListener('click', () => {
    window.location.replace('http://127.0.0.1:5500/Home/home.html')
})