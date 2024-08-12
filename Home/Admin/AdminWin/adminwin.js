// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, get, set, update, remove } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyANeV-QaMFvJlo9udiekdMvBG7oCU0VWE0",
    authDomain: "student-teacher-booking-webapp.firebaseapp.com",
    databaseURL: "https://student-teacher-booking-webapp-default-rtdb.firebaseio.com",
    projectId: "student-teacher-booking-webapp",
    storageBucket: "student-teacher-booking-webapp.appspot.com",
    messagingSenderId: "787638806906",
    appId: "1:787638806906:web:7c235e877e971ed5ef0ec3",
    measurementId: "G-EQLRJMW33C"
};

function writeTeacherData(userId, name, email, password, mobile, department, subject, address, designation, status) {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();
    const reference = ref(db, 'Teacher/' + userId)
    set(reference, {
        userId: userId,
        name: name,
        email: email,
        password: password,
        mobile: mobile,
        department: department,
        subject: subject,
        address: address,
        designation: designation,
        status: status
    });
}

writeTeacherData('STA-T000', 'Name', 'email', 'Password', 'Mobile No.', 'Department', 'Subject', 'Address', 'Designation', true)

const app = initializeApp(firebaseConfig);

var key = null
var len = null
var keys = []
var globalData = null

function readTech(callback) {
    let db = getDatabase(app)
    const dbRef = ref(db, 'Teacher/');
    return get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                keys = []
                snapshot.forEach(item => {
                    key = item.key
                    keys.push(item.key)
                })
                if (snapshot.key != 'STA-T000')
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
let inputs = {}

document.querySelector('span.userTitle').innerHTML = localStorage.getItem('userId') + "<br>" + localStorage.getItem('userName')

function updateData(userId) {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();
    update(ref(db, 'Teacher/' + userId), {
        userId: userId,
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
        mobile: inputs.mobile,
        department: inputs.department,
        subject: inputs.subject,
        address: inputs.address,
        designation: inputs.designation,
        status: true
    }).then(() => {
        swal('Updated Successfully', "Done", 'success')
    }).catch((err) => {
        console.error(err)
    })
}

function deleteData(userId) {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();
    remove(ref(db, 'Teacher/' + userId)).then(() => {
        swal('Data Deleted!', "Data Deleted Successfully", 'success')
    }).catch((err) => {
        console.error(err)
    })
}

document.querySelector('button.AddBtn').addEventListener('click', () => {
    AddWin('Add Teacher', 'Submit', null)
})


function AddWin(lbl, btnlbl, details) {

    let addDiv = document.getElementById('Add')
    addDiv.style.visibility = 'hidden'
    addDiv.style.position = 'absolute'

    let updtDiv = document.getElementById('Update')
    updtDiv.style.visibility = 'hidden'
    updtDiv.style.position = 'absolute'

    let techdiv = document.createElement('div')
    techdiv.className = 'tech-details-div'

    let div = document.querySelector('div.adminwin-div')
    div.insertBefore(techdiv, div.children[1])

    let addlbl = document.createElement('h1')
    addlbl.className = 'Add-Tech-Lbl'
    addlbl.style.marginBottom = '3%'
    addlbl.innerHTML = lbl
    techdiv.appendChild(addlbl)

    let Texts = ["Name", "Email Id", "Password", "Mobile", "Department", "Subject", "Address", "Designation", "Submit"]
    Texts.forEach(text => {
        let div = document.createElement('div')
        div.className = 'tech-inp-div'
        div.id = `tech-inp-div-${text}`

        let topdiv = document.createElement('div')
        topdiv.className = 'tech-inp-topdiv'

        let bottomdiv = document.createElement('div')
        bottomdiv.className = 'tech-inp-bottomdiv'

        let lbl = document.createElement('h1')
        lbl.className = 'lbl'
        lbl.appendChild(document.createTextNode(text))

        let error = document.createElement('h1')
        error.id = `error-${text}`
        error.className = 'error-h1'
        error.innerHTML = "H1"

        let inp = document.createElement('input')
        inp.className = 'inp'
        inp.id = text
        inp.required = true

        if (details != null) {
            inputs = details
            if (text == 'Name')
                inp.value = details.name
            if (text == 'Email Id')
                inp.value = details.email
            if (text == 'Password')
                inp.value = details.password
            if (text == 'Mobile')
                inp.value = details.mobile
            if (text == 'Department')
                inp.value = details.department
            if (text == 'Subject')
                inp.value = details.subject
            if (text == 'Address')
                inp.value = details.address
            if (text == 'Designation')
                inp.value = details.designation

            if (text != 'Submit') {
                inp.addEventListener('change', () => {
                    console.log(inputs)
                    if (inp.id == 'Name')
                        details.name = inp.value
                    if (inp.id == 'Email Id')
                        details.email = inp.value
                    if (inp.id == 'Password')
                        details.password = inp.value
                    if (inp.id == 'Mobile')
                        details.mobile = inp.value
                    if (inp.id == 'Department')
                        details.department = inp.value
                    if (inp.id == 'Subject')
                        details.subject = inp.value
                    if (inp.id == 'Address')
                        details.address = inp.value
                    if (inp.id == 'Designation')
                        details.designation = inp.value
                })
            }
        }

        if (text == 'Email Id') {
            lbl.id = "Email"
            inp.type = 'email'
        } else if (text == 'Password')
            inp.type = 'password'
        else if (text == 'Submit') {
            inp.type = 'submit'
            inp.value = btnlbl
            inp.className = 'btn'
            inp.style.marginBottom = '0%'
        } else
            inp.type = 'text'

        techdiv.appendChild(div)
        topdiv.appendChild(inp)

        if (text == 'Submit') {
            div.style.marginBottom = '2%'
            div.appendChild(inp)
            if (details == null)
                document.getElementById('Submit').addEventListener('click', validate)
            else {
                document.getElementById('Submit').addEventListener('click', () => {
                    updateData(details.userId)
                    document.querySelector('div.tech-details-div').remove()
                    techData(details.userId)
                })
            }
        }

        if (text != 'Submit') {
            inp.addEventListener('change', validate)
            div.appendChild(topdiv)
            div.appendChild(bottomdiv)
            topdiv.appendChild(lbl)
            bottomdiv.appendChild(error)

            let correctImg = document.createElement('img')
            correctImg.src = 'correct.png'
            correctImg.className = 'correct'
            correctImg.id = `${text}-correct`
            correctImg.width = '30px'

            let incorrectImg = document.createElement('img')
            incorrectImg.src = 'incorrect.png'
            incorrectImg.className = 'incorrect'
            incorrectImg.id = `${text}-incorrect`
            incorrectImg.width = '30px'
            topdiv.appendChild(correctImg)
            topdiv.appendChild(incorrectImg)

            if (text == 'Password') {
                lbl.id = 'Password-lbl'
                let hidebtn = document.createElement('button')
                hidebtn.className = 'hide'

                let imgHide = document.createElement('img')
                imgHide.src = 'close-eye.png'
                imgHide.className = 'hideImg'
                imgHide.id = 'p_correct'

                hidebtn.appendChild(imgHide)

                let showbtn = document.createElement('button')
                showbtn.className = 'show'

                let imgShow = document.createElement('img')
                imgShow.src = 'eye open.png'
                imgShow.className = 'hideImg'
                imgShow.id = 'p_correct'

                showbtn.appendChild(imgShow)

                topdiv.appendChild(hidebtn)
                topdiv.appendChild(showbtn)
            }
        }
    })
    console.log(inputs)

    let Pass = document.querySelector('button.show')
    Pass.addEventListener('click', () => {
        document.querySelector('input#Password').setAttribute('type', 'text')
        Pass.style.visibility = 'hidden'
        document.querySelector('button.hide').style.visibility = 'visible'
    })

    let hide = document.querySelector('button.hide')
    hide.addEventListener('click', () => {
        document.querySelector('input#Password').setAttribute('type', 'password')
        Pass.style.visibility = 'visible'
        hide.style.visibility = 'hidden'
    })

}

function validate() {
    let Texts = ["Name", "Email Id", "Password", "Mobile", "Department", "Subject", "Address", "Designation"]
    let values = []
    let name = document.getElementById('Name').value
    let email = document.getElementById('Email Id').value
    let password = document.getElementById('Password').value
    let mobile = document.getElementById('Mobile').value
    let dept = document.getElementById('Department').value
    let sub = document.getElementById('Subject').value
    let address = document.getElementById('Address').value
    let designation = document.getElementById('Designation').value

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

    if (this.id == "Email Id" || this.id == 'Submit') {
        if (email.indexOf("@") == -1) {
            setVisibility('hidden', 'Email Id-correct')
            setVisibility('visible', 'error-Email Id', 'Email Id-incorrect')
            document.getElementById('error-Email Id').innerHTML = "Email must contain '@' sign!"
        } else if (email.match('@').length >= 2) {
            console.log(1)
            setVisibility('hidden', 'Email Id-correct')
            setVisibility('visible', 'error-Email Id', 'Email Id-incorrect')
            document.getElementById('error-Email Id').innerHTML = "Email must be valid!"
        } else if (email.substring(0, email.indexOf('@')).length < 3) {
            console.log(2)
            setVisibility('hidden', 'Email Id-correct')
            setVisibility('visible', 'error-Email Id', 'Email Id-incorrect')
            document.getElementById('error-Email Id').innerHTML = "Email must be valid!"
        } else if (email.substring(email.indexOf('@') + 1, email.lastIndexOf('.')).length < 5) {
            setVisibility('hidden', 'Email Id-correct')
            setVisibility('visible', 'error-Email Id', 'Email Id-incorrect')
            document.getElementById('error-Email Id').innerHTML = "Email must have valid domain!"
        } else if (email.substring(email.lastIndexOf('.'), email.length - 1).length <= 1) {
            setVisibility('hidden', 'Email Id-correct')
            setVisibility('visible', 'error-Email Id', 'Email Id-incorrect')
            document.getElementById('error-Email Id').innerHTML = "Email must have valid domain!"
        } else {
            setVisibility('visible', 'Email Id-correct')
            setVisibility('hidden', 'error-Email Id', 'Email Id-incorrect')
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
        if (mobile.trim().length < 10) {
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

    if (this.id == "Department" || this.id == 'Submit') {
        if (dept.trim().length < 1) {
            setVisibility('hidden', 'Department-correct')
            setVisibility('visible', 'error-Department', 'Department-incorrect')
            document.getElementById('error-Department').innerHTML = "This field can't be empty!"
        } else {
            setVisibility('visible', 'Department-correct')
            setVisibility('hidden', 'error-Department', 'Department-incorrect')
        }
    }

    if (this.id == "Subject" || this.id == 'Submit') {
        if (sub.trim().length < 1) {
            setVisibility('hidden', 'Subject-correct')
            setVisibility('visible', 'error-Subject', 'Subject-incorrect')
            document.getElementById('error-Subject').innerHTML = "This field can't be empty!"
        } else {
            setVisibility('visible', 'Subject-correct')
            setVisibility('hidden', 'error-Subject', 'Subject-incorrect')
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

    if (this.id == "Designation" || this.id == 'Submit') {
        if (designation.trim().length < 1) {
            setVisibility('hidden', 'Designation-correct')
            setVisibility('visible', 'error-Designation', 'Designation-incorrect')
            document.getElementById('error-Designation').innerHTML = "This field can't be empty!"
        } else {
            setVisibility('visible', 'Designation-correct')
            setVisibility('hidden', 'error-Designation', 'Designation-incorrect')
        }
    }

    if (name != "" && email.length != "" && password.length != "" && mobile.length != "" && dept.length != "" && sub.length != "" &&
        address.length != "" && designation.length != "" && this.id == 'Submit') {
        Texts.forEach(txt => {
            values.push(document.getElementById(txt).value)
        })
        readTech(() => {
            let end = parseInt(key.substring(key.length - 1, key.length)) + 1
            let start = key.substring(0, key.length - 1)
            if (end > 9) {
                start = key.substring(0, key.length - 2)
            } else if (end > 99) {
                start = key.substring(0, key.length - 3)
            }
            let uid = `${start}${end}`
            writeTeacherData(uid, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], true)
            swal('Information', `Teacher Added Successfully!<br>UserName: ${uid}<br>Password: ${password}`, 'success')
            techData(uid)
        })
        document.querySelectorAll('div.tech-inp-div').forEach(item => {
            item.remove()
        })
        document.querySelector('h1.Add-Tech-Lbl').innerHTML = 'Teacher Details'
    }
}

function techData(key) {
    let table = document.createElement('table')
    table.id = key
    readTech(() => {
        console.log(globalData[key])
        table.innerHTML = `
            <tr><td>UserId:</td><td>${globalData[key].userId}</td></tr>
            <tr><td>Name:</td><td>${globalData[key].name}</td></tr>
            <tr><td>Email:</td><td>${globalData[key].email}</td></tr>
            <tr><td>Password:</td><td>${globalData[key].password}</td></tr>
            <tr><td>Mobile:</td><td>${globalData[key].mobile}</td></tr>
            <tr><td>Department:</td><td>${globalData[key].department}</td></tr>
            <tr><td>Subject:</td><td>${globalData[key].subject}</td></tr>
            <tr><td>Address:</td><td>${globalData[key].address}</td></tr>
            <tr><td>Designation:</td><td>${globalData[key].designation}</td></tr>
            `
    })
    document.querySelector('div.adminwin-div').appendChild(table)
}

function setVisibility(visibility, ...args) {
    args.forEach(argument => {
        document.getElementById(argument).style.visibility = visibility
    })
}

document.querySelector('button.menu').addEventListener('click', show)

function show() {
    document.getElementById("dropdown").style.visibility = 'visible';
    document.querySelector('button.menu').removeEventListener('click', show)
    document.querySelector('button.menu').addEventListener('click', hide)
}

function hide() {
    document.getElementById("dropdown").style.visibility = 'hidden';
    document.querySelector('button.menu').addEventListener('click', show)
}

document.querySelector('button#Home').addEventListener('click', home)

function home() {
    try {
        document.querySelectorAll('table').forEach(table => {
            table.remove()
        })
        document.querySelectorAll('div.Tech-Data-Div').forEach(div => {
            div.remove()
        })
        document.getElementById('Add').style.position = 'static'
        document.getElementById('Add').style.visibility = 'visible'
        document.getElementById('Update').style.position = 'static'
        document.getElementById('Update').style.visibility = 'visible'
    } catch (error) {
        console.error(error)
    }
    try {
        document.querySelector('table').remove()
    } catch (error) {

    }
    try {
        document.querySelector('div.tech-details-div').remove()
    } catch (error) {

    }
    try {
        document.querySelector('div.No-Data-Div').remove()
    } catch (error) {

    }
    hide()
}

document.querySelector('button#LogOut').addEventListener('click', () => {
    history.pushState(window.document.title, "#");
    // To replace the current entry in the browser's history stack
    history.replaceState(null, '', 'http://127.0.0.1:5500/Home/home.html');

    // To add a new entry to the history stack
    history.pushState(null, '', 'http://127.0.0.1:5500/Home/home.html');
    window.location.replace('http://127.0.0.1:5500/Home/home.html')
})

document.querySelector('button.UpdateBtn').addEventListener('click', Update)

function Update() {
    let addDiv = document.getElementById('Add')
    addDiv.style.visibility = 'hidden'
    addDiv.style.position = 'absolute'

    let updtDiv = document.getElementById('Update')
    updtDiv.style.visibility = 'hidden'
    updtDiv.style.position = 'absolute'

    let techdiv = document.createElement('div')
    techdiv.className = 'tech-details-div'

    let adminwindiv = document.querySelector('div.adminwin-div')
    adminwindiv.insertBefore(techdiv, adminwindiv.children[1])

    let addlbl = document.createElement('h1')
    addlbl.className = 'Add-Tech-Lbl'
    addlbl.style.marginBottom = '3%'
    addlbl.innerHTML = 'Teachers Details'
    techdiv.appendChild(addlbl)
    readTech(() => {
        keys.splice(0, 1)
        console.log(keys)
        if (keys.length == 0) {
            let div = document.createElement('div')
            div.className = 'No-Data-Div'

            let lbl = document.createElement('h2')
            lbl.className = 'No-Data-h2'
            lbl.innerHTML = 'No Data Found'
            div.appendChild(lbl)
            adminwindiv.appendChild(div)
            return
        }
        let count = 1
        keys.forEach(Key => {
            techData(Key)

            let div = document.createElement('div')
            div.className = 'Tech-Data-Div'
            div.id = Key

            let updatebtn = document.createElement('button')
            updatebtn.className = 'update'

            updatebtn.innerHTML = 'Update'
            updatebtn.addEventListener('click', modify)

            let delbtn = document.createElement('button')
            delbtn.className = 'del'
            delbtn.innerHTML = 'Delete'
            delbtn.addEventListener('click', del)

            updatebtn.id = `update-STA-T00${count}`
            delbtn.id = `del-STA-T00${count}`
            if (count > 9) {
                delbtn.id = `del-STA-T0${count}`
                updatebtn.id = `update-STA-T0${count}`
            } else if (count > 99) {
                delbtn.id = `del-STA-T${count}`
                updatebtn.id = `update-STA-T${count}`
            }

            count++
            div.appendChild(updatebtn)
            div.appendChild(delbtn)

            adminwindiv.appendChild(div)
        })
    })
}

function modify() {
    document.querySelector('div.tech-details-div').remove()
    document.querySelectorAll('table').forEach(table => {
        table.remove()
    })
    document.querySelectorAll('div.Tech-Data-Div').forEach(div => {
        div.remove()
    })
    let id = this.id.substring(7, this.id.length)
    readTech(() => {
        AddWin('Update Teacher\'s Details', 'Update', globalData[id])
    })
}

function del() {
    let id = this.id.substring(4, this.id.length)
    deleteData(id)
    document.querySelector(`table#${id}`).remove()
    document.querySelector(`div#${id}`).remove()
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}