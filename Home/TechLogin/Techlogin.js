// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
// import swal from "sweetalert";

const firebaseConfig = {
    apiKey: "AIzaSyANeV-QaMFvJlo9udiekdMvBG7oCU0VWE0",
    authDomain: "student-teacher-booking-webapp.firebaseapp.com",
    projectId: "student-teacher-booking-webapp",
    storageBucket: "student-teacher-booking-webapp.appspot.com",
    messagingSenderId: "787638806906",
    appId: "1:787638806906:web:7c235e877e971ed5ef0ec3",
    measurementId: "G-EQLRJMW33C"
};

var keys = []
var userName = null
var globalData = null

function readStu(callback) {
    const app = initializeApp(firebaseConfig);
    let db = getDatabase()
    const dbRef = ref(db, 'Teacher/');
    return get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                keys = []
                snapshot.forEach(item => {
                    // key = item.key
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

document.querySelector('button#login').addEventListener('click', validate)
document.querySelector('input.u_inp').addEventListener('change', validate)
document.querySelector('input.p_inp').addEventListener('change', validate)

var correctUser = false
var correctPass = false

function validate() {

    let uid = document.getElementById('u_id').value.trim()
    localStorage.setItem('userId', uid)

    let pass = document.getElementById('u_pass').value.trim()

    if (this.id == 'u_id' || this.id == 'login') {
        if (String(uid).trim().length < 3) {
            document.getElementById('u_correct').style.visibility = 'hidden'
            document.getElementById('u_incorrect').style.visibility = 'visible'
            if (this.id == 'login') {
                swal("Warning", 'Length of Username must be greater than 3', 'error')
            }
        } else {
            document.getElementById('u_correct').style.visibility = 'visible'
            document.getElementById('u_incorrect').style.visibility = 'hidden'
        }
    }
    if (this.id == 'u_pass' || this.id == 'login' && uid.length >= 3) {
        if (String(pass).trim().length < 8) {
            document.getElementById('p_correct').style.visibility = 'hidden'
            document.getElementById('p_incorrect').style.visibility = 'visible'
            if (this.id == 'login') {
                swal("Warning", 'Length of Password must be 8', 'error')
            }
        } else {
            document.getElementById('p_correct').style.visibility = 'visible'
            document.getElementById('p_incorrect').style.visibility = 'hidden'
        }
    }

    if (this.id == 'login' && uid.length >= 3 && pass.length >= 8) {
        readStu(() => {
            try {
                console.log(globalData[uid].userId)
                correctUser = true

                if (correctUser == true) {
                    if (globalData[uid].password == pass) {
                        correctPass = true
                    }
                }
                if (correctUser == true && correctPass == true) {
                    let id = globalData[uid].name
                    swal("Login Success", `Welcome ${globalData[uid].name}! As Teacher`, 'success').then((result) => {
                        location.href = 'TechWin/Techwin.html'
                        uid = id
                        localStorage.setItem('userName', uid)
                    }).catch((err) => {

                    });
                }
            } catch (error) {
                swal("Login Failed", `Incorrect UserName or Password`, 'error')
                correctUser = false
                correctPass = false
            }
        })
    }
}



let Pass = document.querySelector('button.show')
Pass.addEventListener('click', () => {
    document.querySelector('input.p_inp').setAttribute('type', 'text')
    Pass.style.visibility = 'hidden'
    document.querySelector('button.hide').style.visibility = 'visible'
})

let hide = document.querySelector('button.hide')
hide.addEventListener('click', () => {
    document.querySelector('input.p_inp').setAttribute('type', 'password')
    Pass.style.visibility = 'visible'
    hide.style.visibility = 'hidden'
})

document.querySelector('button.close').addEventListener('click', () => {
    window.history.back();
    window.history.back();
})

history.pushState(window.document.title, "#");