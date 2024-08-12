// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyANeV-QaMFvJlo9udiekdMvBG7oCU0VWE0",
    authDomain: "student-teacher-booking-webapp.firebaseapp.com",
    projectId: "student-teacher-booking-webapp",
    storageBucket: "student-teacher-booking-webapp.appspot.com",
    messagingSenderId: "787638806906",
    appId: "1:787638806906:web:7c235e877e971ed5ef0ec3",
    measurementId: "G-EQLRJMW33C"
};

function writeAdminData(userId, name, email, password, active) {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();

    const reference = ref(db, 'Admin/' + userId)
    set(reference, {
        userId: userId,
        username: name,
        email: email,
        password: password,
        status: active
    });
}

writeAdminData('STA-A001', 'Anwar', 'anwaransari@gmai.com', '@nw@r9451', true)

function readUserData(userId) {
    initializeApp(firebaseConfig);
    const db = getDatabase();
    const distanceRef = ref(db, 'Admin/' + userId)
    var val = null
    var keys = null
    onValue(distanceRef, (snapshot) => {
        val = snapshot.val()
        keys = snapshot.key
    })
    return val
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

let data = readUserData('STA-A001')
let btn = document.querySelector('button#login')
btn.addEventListener('click', () => {
    let u_id = document.getElementById('u_id').value.trim()
    localStorage.setItem('userId', u_id)
    localStorage.setItem('userName', data.username)
    let u_pass = document.getElementById('u_pass').value.trim()
    if (u_id == data.userId && u_pass == data.password && data.status == true) {
        swal("Login Success", `Welcome ${data.username}! As Admin`, 'success').then((result) => {
            location.href = 'AdminWin/adminwin.html'
        }).catch((err) => {

        });
    } else if (String(u_id).trim().length < 3) {
        document.getElementById('u_correct').style.visibility = 'hidden'
        swal("Warning", 'Length of Username must be greater than 3', 'error')
        document.getElementById('u_incorrect').style.visibility = 'visible'
    } else if (String(u_pass).trim().length < 8) {
        document.getElementById('p_correct').style.visibility = 'hidden'
        document.getElementById('p_incorrect').style.visibility = 'visible'
        swal("Warning", 'Length of Password must be 8', 'error')
    } else {
        document.getElementById('u_correct').style.visibility = 'hidden'
        document.getElementById('p_correct').style.visibility = 'hidden'
        document.getElementById('u_incorrect').style.visibility = 'visible'
        document.getElementById('p_incorrect').style.visibility = 'visible'
        swal("Login Failed", 'Wrong UserName or Password! <br>Please Enter correct Username and Password', 'error').then((result) => {
            document.querySelector('input.u_inp').value = ""
            document.querySelector('input.p_inp').value = ""
        }).catch((err) => {

        });
    }
})

let uInp = document.querySelector('input.u_inp')
uInp.addEventListener('change', (e) => {
    let u_id = document.getElementById('u_id').value.trim()
    let u_pass = document.getElementById('u_pass').value.trim()
    if (String(u_id).trim().length <= 3) {
        document.getElementById('u_correct').style.visibility = 'hidden'
        document.getElementById('u_incorrect').style.visibility = 'visible'
    } else {
        document.getElementById('u_correct').style.visibility = 'visible'
        document.getElementById('u_incorrect').style.visibility = 'hidden'
    }
})

let pInp = document.querySelector('input.p_inp')
pInp.addEventListener('change', (e) => {
    let u_pass = document.getElementById('u_pass').value.trim()
    if (String(u_pass).trim().length <= 8) {
        document.getElementById('p_correct').style.visibility = 'hidden'
        document.getElementById('p_incorrect').style.visibility = 'visible'
    } else {
        document.getElementById('p_correct').style.visibility = 'visible'
        document.getElementById('p_incorrect').style.visibility = 'hidden'
    }
})

document.querySelector('button.close').addEventListener('click', () => {
    window.history.back();
    window.history.back();
})

history.pushState(window.document.title, "#");