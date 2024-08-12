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

function writeBookingDetails(BookingId, name, email, date, time, status) {
    console.log('run')
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();
    const reference = ref(db, 'Booking/' + BookingId)
    set(reference, {
        BookingId: BookingId,
        studentName: name,
        email: email,
        date: date,
        time: time,
        message: '',
        status: status
    });
}

function writeMessage(Key, Msg, reply, to, from, status) {
    console.log('run')
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();
    const reference = ref(db, 'Message/' + Key)
    set(reference, {
        Msg: Msg,
        reply: reply,
        to: to,
        from: from,
        status: status
    });
}


writeBookingDetails(9, 'name', 'email', 'date', 'time', 'status')
writeMessage('key', 'msg', 'reply', 'to', 'from', 'unread')

function updateData(userId, username, email, password, mobile, address, age) {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();
    update(ref(db, 'Student/' + userId), {
        userId: userId,
        username: username,
        email: email,
        password: password,
        mobile: mobile,
        address: address,
        age: age,
    }).then(() => {
        swal('Updated Successfully', "Done", 'success')
    }).catch((err) => {
        console.error(err)
    })
}

function updatedata(database, userId = '', EndTime = '', StartTime = '', date = '', email = '', username = '', status = '') {
    initializeApp(firebaseConfig)
    const db = getDatabase()
    if (database == 'SlotDetails') {
        update(ref(db, `${database}/` + userId), {
            EndTime: EndTime,
            StartTime: StartTime,
            date: date,
            email: email,
            username: username
        })
    }
    if (database == 'Booking' || database == 'Message') {
        update(ref(db, `${database}/` + userId), {
            status: status
        })
    }
}


var Slotkey = null
var Slotkeys = []
var SlotData = null

function read(callback, database, userId) {
    initializeApp(firebaseConfig);
    let db = getDatabase()
    const dbRef = ref(db, `${database}/` + userId);
    return get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                Slotkeys = []
                snapshot.forEach(item => {
                    Slotkey = item.key
                    Slotkeys.push(item.key)
                })
                if (snapshot.key != 'STA-T000')
                    SlotData = snapshot.val();
                callback();
            } else {
                // writeSlotDetails('STA-T000', 'name', 'email', 'date', 'start', 'end')
            }
        })
        .catch((error) => {
            restart()
        });
}

autoDelete()

let studiv = document.createElement('div')
studiv.className = 'stu-details-div'

document.querySelector('button.menu').addEventListener('click', show)

document.querySelector('button#Home').addEventListener('click', restart)

document.querySelector('button#btn-booking').addEventListener('click', book)
document.querySelector('button#btn-mybooking').addEventListener('click', checkBooking)
document.querySelector('button#btn-profile').addEventListener('click', showProfile)
document.querySelector('button#btn-msg').addEventListener('click', message)

function restart() {
    document.querySelectorAll('div.stuwin-btn-div').forEach(div => {
        div.style.visibility = 'visible'
        div.style.position = 'static'
    })
    try {
        document.querySelector('div.tech-details-div').remove()
        document.querySelector('table').remove()
    } catch (error) {

    }
    try {
        document.querySelector('table.book-slot').remove()
    } catch (error) {

    }
    try {
        document.querySelector('p.para').remove()
    } catch (error) {

    }
    try {
        document.querySelector('h1.details-h1').remove()
        document.querySelectorAll('table').forEach(table => {
            table.remove()
        })
        document.querySelectorAll('div.book-slot-btn-div').forEach(div => {
            div.remove()
        })
    } catch (error) {

    }
    try {
        document.getElementById('para').remove()
    } catch (error) {}
    try {
        document.querySelector('div.inp-update-div').remove()
    } catch (error) {}
    hide()
}

function book() {
    hideBtnDiv()
    createBookTable()

}

function createBookTable() {
    let div = document.querySelector('div.stuwin-div')
    div.insertBefore(studiv, div.children[1])

    let h1 = document.createElement('h1')
    h1.className = 'details-h1'
    h1.innerHTML = 'Teacher\'s Details'

    studiv.appendChild(h1)
    read(() => {
        Slotkeys.forEach(key => {
            if (key != 'STA-T000') {
                let table = document.createElement('table')
                table.id = key
                table.innerHTML = `
                    <tr><td>Name:</td><td>${SlotData[key].name}</td></tr>
                    <tr><td>Email:</td><td>${SlotData[key].email}</td></tr>
                    <tr><td>Nobile:</td><td>${SlotData[key].mobile}</td></tr>
                    <tr><td>Department:</td><td>${SlotData[key].department}</td></tr>
                    <tr><td>Subject:</td><td>${SlotData[key].subject}</td></tr>
                    <tr><td>Designation:</td><td>${SlotData[key].designation}</td></tr>
                `
                let btndiv = document.createElement('div')
                btndiv.className = 'book-slot-btn-div'

                let bookBtn = document.createElement('button')
                bookBtn.className = 'bookBtn1'
                bookBtn.id = `book-${key}`
                bookBtn.innerHTML = 'Book'
                bookBtn.addEventListener('click', bookTech)

                let MsgBtn = document.createElement('button')
                MsgBtn.className = 'MsgBtn'
                MsgBtn.id = `msg-${key}`
                MsgBtn.innerHTML = 'Message'
                MsgBtn.addEventListener('click', bookMsg)

                btndiv.appendChild(bookBtn)
                btndiv.appendChild(MsgBtn)

                studiv.appendChild(table)
                studiv.appendChild(btndiv)
            }

        })

    }, 'Teacher', "")
}

function bookTech() {
    read(() => {
        if (Slotkeys.length >= 2) {
            document.querySelector('h1.details-h1').remove()
            studiv.appendChild(table)
        } else {
            document.querySelector('h1.details-h1').innerHTML = 'No Data available at the moment!'
        }
    }, 'SlotDetails', '')
    document.querySelectorAll('table').forEach(table => {
        table.remove()
    })
    document.querySelectorAll('div.book-slot-btn-div').forEach(div => {
        div.remove()
    })
    let table = document.createElement('table')
    table.className = 'book-slot'
    table.innerHTML = `
            <tr>
                <th>Teacher Id</th><th>Name</th><th>Book</th><th>Time</th><th>Date</th>
            </tr>
        `
    read(() => {
        Slotkeys.forEach(nextkey => {
            console.log(nextkey)
            table.innerHTML += `
                    <tr>
                        <td class='book-slot-td'>${SlotData[nextkey].userId}</td><td class='book-slot-td'>${SlotData[nextkey].username}</td><td class='book-slot-td'><button class='bookBtn' id='bookBtn-${this.id.substring(5, this.id.length)}-${nextkey}'>Book</button></td>
                        <td class='book-slot-td'>${SlotData[nextkey].StartTime} to ${SlotData[nextkey].EndTime}</td><td class='book-slot-td'>${SlotData[nextkey].date}</td>
                    </tr>
                `
        })
        document.querySelectorAll('button.bookBtn').forEach(btn => {
            btn.addEventListener('click', bookSlot)
        })
    }, 'SlotDetails', `/${this.id.substring(5, this.id.length)}`)
}

function bookSlot() {
    let id = localStorage.getItem('userId') + this.id.substring(7, this.id.length)
    read(() => {
        if (Slotkeys.indexOf(id) != -1)
            swal('Slot Already Booked', 'This slot is already booked by you!', 'error')
        else {
            read(() => {
                writeBookingDetails(id, localStorage.getItem('userName'), localStorage.getItem('Email'), id.substring(id.length - 10, id.length), id.substring(18, id.length - 11), 'Pending')
            }, 'SlotDetails', id.substring(9, 17) + '/' + id.substring(18, id.length))
            this.innerHTML = 'Booked'
            this.disabled = true
            swal('Slot Booked', 'Your Slot is booked!<br>Your Teacher will respond you soon.', 'success')
            restart()
        }
    }, 'Booking', '')
}

function bookMsg() {
    let div = document.createElement('div')
    div.className = 'Msg-div'

    let inp = document.createElement('input')
    inp.className = 'inp-msg'

    let img = document.createElement('img')
    img.src = 'send.png'
    img.id = 'send'

    let btn = document.createElement('button')
    btn.id = 'inp-msg-btn'
    btn.appendChild(img)

    div.appendChild(inp)
    div.appendChild(btn)
    document.querySelector('body').appendChild(div)

    let date = new Date()
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date();
    let cur = date.getDate() + '-' + month[date.getMonth()] + '-' + date.getFullYear() + '-' + date.getHours() + ":" + date.getMinutes() + ':' + date.getSeconds()
    let key = `${cur}-${this.id.substring(4, this.id.length)}-${localStorage.getItem('userId')}`
    console.log(key)
    btn.addEventListener('click', () => {
        send(key)
    })
}

function send(id) {
    let msg = document.querySelector('input.inp-msg').value
    try {
        read(() => {
            writeMessage(id, msg, '', SlotData.name, localStorage.getItem('userName'), 'Unread')
        }, 'Teacher', id.substring(id.length - 17, id.length - 9))
    } catch (error) {
        console.error(error)
    }
    swal('Success', 'Message Sent!', 'success')
    document.querySelector('div.Msg-div').remove()
}

function checkBooking() {
    hideBtnDiv()
    read(() => {
        let count = 0
        Slotkeys.forEach(key => {
            if (key.startsWith(localStorage.getItem('userId')) == false) {
                let h1 = document.createElement('h1')
                h1.className = 'details-h1'
                h1.id = 'no-slot'
                h1.innerHTML = 'No Slots available at this moment'
                if (count == 0)
                    studiv.appendChild(h1)
                count++
            } else {
                try {
                    document.querySelector('h1#no-slot').remove()
                } catch (error) {

                }
                if (key.startsWith(localStorage.getItem('userId'))) {
                    let h1 = document.createElement('h1')
                    h1.className = 'details-h1'
                    h1.innerHTML = `Booked Slot`
                    studiv.appendChild(h1)
                    let count = 0
                    let table = document.createElement('table')
                    table.innerHTML = `
                    <tr><td>Name: </td><td>${SlotData[key].studentName}</td></tr>
                    <tr><td>Email: </td><td>${SlotData[key].email}</td></tr>
                    <tr><td>Time: </td><td>${SlotData[key].time}</td></tr>
                    <tr><td>Date: </td><td>${SlotData[key].date}</td></tr>
                    <tr><td>Status: </td><td>${SlotData[key].status}</td></tr>
                    `
                    read(() => {
                        if (count == 0) {
                            table.innerHTML += `
                            <tr><td>Teacher's Name: </td><td>${SlotData.name}</td></tr>
                            <tr><td>Teacher's Email: </td><td>${SlotData.email}</td></tr>
                            <tr><td>Teacher's Moible No.: </td><td>${SlotData.mobile}</td></tr>
                            <tr><td>Subject: </td><td>${SlotData.subject}</td></tr>
                            `
                        }
                        count++
                    }, 'Teacher', key.substring(9, 17))
                    studiv.appendChild(table)
                }
            }
        })
    }, 'Booking', '')
}

function showProfile() {
    hideBtnDiv()
    let h1 = document.createElement('h1')
    h1.className = 'details-h1'
    h1.id = 'details-h1'
    h1.innerHTML = 'Student Details'
    studiv.appendChild(h1)
    let para = document.createElement('p')
    para.id = 'para'
    read(() => {
        para.innerHTML += `
            ${SlotData.userId}<br>
            ${SlotData.username}<br>
            ${SlotData.email}<br>
            ${SlotData.password}<br>
            ${SlotData.age}<br>
            ${SlotData.mobile}<br>
            ${SlotData.address}<br><br>
            <button id='update-user'>Update</button>
        `
        document.getElementById('update-user').addEventListener('click', updateUser)
    }, 'Student', localStorage.getItem('userId'))
    studiv.appendChild(para)
}

function updateUser() {
    document.getElementById('para').remove()
    document.getElementById('details-h1').innerHTML = 'Update Student Details'
    let div = document.createElement('div')
    div.className = 'inp-update-div'
    read(() => {
        Slotkeys.forEach(key => {
            let inp = document.createElement('input')
            inp.className = 'inp'
            inp.id = key
            inp.type = 'text'
            inp.addEventListener('change', validate)
            if (key == 'address')
                inp.value = SlotData.address
            if (key == 'age')
                inp.value = SlotData.age
            if (key == 'username')
                inp.value = SlotData.username
            if (key == 'email')
                inp.value = SlotData.email
            if (key == 'mobile')
                inp.value = SlotData.mobile
            if (key == 'password') {
                inp.value = SlotData.password
            }
            if (key != 'userId') {
                div.appendChild(inp)
                studiv.appendChild(div)
                div.appendChild(btn)
            }
        })
    }, 'Student', localStorage.getItem('userId'))
    let btn = document.createElement('button')
    btn.innerHTML = 'Update'
    btn.id = 'update-inp-btn'
    btn.addEventListener('click', validate)
}

function validate() {
    let name = document.getElementById('username').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let mobile = document.getElementById('mobile').value
    let age = document.getElementById('age').value
    let address = document.getElementById('address').value

    console.log(name, email, password, mobile, age, address)

    if (this.id == 'update-inp-btn') {
        if (String(name).trim().length <= 3) {
            swal('Update Unsuccessfull', 'Username is not valid!', 'error')
        } else if (email.indexOf("@") == -1) {
            swal('Update Unsuccessfull', 'Invalid Email address!<br>Email must contain "@" sign!', 'error')
        } else if (email.match('@').length >= 2) {
            swal('Update Unsuccessfull', 'Invalid Email address!', 'error')
        } else if (email.substring(0, email.indexOf('@')).length < 3) {
            swal('Update Unsuccessfull', 'Invalid Email address!', 'error')
        } else if (email.substring(email.indexOf('@') + 1, email.lastIndexOf('.')).length < 5) {
            swal('Update Unsuccessfull', 'Invalid Email address! <br>Email must have valid domain!', 'error')
        } else if (email.substring(email.lastIndexOf('.'), email.length - 1).length <= 1) {
            swal('Update Unsuccessfull', 'Invalid Email address! <br>Email must have valid domain!', 'error')
        } else if (password.trim().length < 8) {
            swal('Update Unsuccessfull', 'Length of Password must be more than 8!', 'error')
        } else if (mobile.trim().length < 10 || mobile.trim().length > 10) {
            swal('Update Unsuccessfull', 'Mobile No. must be valid!', 'error')
            document.getElementById('error-Mobile').innerHTML = ""
        } else if (isNumeric(mobile) == false) {
            swal('Update Unsuccessfull', 'Mobile No. can only contain digits!', 'error')
        } else if (isNumeric(age) == false) {
            swal('Update Unsuccessfull', 'Enter a Valid Age!', 'error')
        } else if (age < 10 || parseFloat(age) > 150) {
            swal('Update Unsuccessfull', 'Enter Age more than 10!', 'error')
        } else if (address.trim().length < 1) {
            swal('Update Unsuccessfull', "This field can't be empty!", 'error')
        } else {
            updateData(localStorage.getItem('userId'), name, email, password, mobile, address, age)
            document.getElementById('details-h1').remove()
            document.querySelector('div.inp-update-div').remove()
            showProfile()
        }
    }

}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function message() {
    hideBtnDiv()
    let h1 = document.createElement('h1')
    h1.innerHTML = 'My Messages'
    h1.className = 'details-h1'
    studiv.appendChild(h1)

    read(() => {
        Slotkeys.forEach(key => {
            if (key != 'key') {
                let para = document.createElement('p')
                para.className = 'para'
                para.id = key
                para.innerHTML = `
                TimeStamp: ${key.substring(0, key.length-18)}<br>
                To: ${SlotData[key].to}<br>
                From: ${SlotData[key].from}<br>
                Message: ${SlotData[key].Msg}<br>
                `
                if (SlotData[key].reply != "") {
                    para.innerHTML += `Reply to: ${SlotData[key].reply}`
                }
                if (SlotData[key].status == 'read') {
                    para.style.border = '3px solid blue'
                    para.title = 'Message sent and read by the recipient!'
                } else {
                    para.title = 'Message sent!'
                }
                let div = document.querySelector('div.stuwin-div')
                div.insertBefore(para, div.children[2])
                if (!key.endsWith(localStorage.getItem('userId'))) {
                    let btn = document.createElement('button')
                    btn.id = key
                    btn.className = 'reply'
                    btn.innerHTML = 'Reply'
                    para.title = 'Message Received!'
                    para.appendChild(btn)
                    document.querySelector('button.reply').addEventListener('click', reply)
                }
            }
        })
    }, "Message", '')
    read(() => {
        Slotkeys.forEach(key => {
            if (key.substring(0, key.length - 9).endsWith(localStorage.getItem('userId')))
                updatedata('Message', key, '', '', '', '', '', 'read')
        })
    }, 'Message', '')

}

function reply() {
    let Id = this.id
    let div = document.createElement('div')
    div.className = 'Msg-rply-div'

    let outerdiv = document.createElement('div')
    outerdiv.className = 'outer-div'

    let inp = document.createElement('input')
    inp.className = 'inp-msg'
    inp.placeholder = 'Send Message'

    let replyInp = document.createElement('textarea')
    replyInp.className = 'inp-reply'
    replyInp.rows = 10
    replyInp.cols = 150

    read(() => {
        replyInp.value = SlotData.Msg
    }, 'Message', this.id)

    let img = document.createElement('img')
    img.src = 'send.png'
    img.id = 'send'

    let btn = document.createElement('button')
    btn.id = 'rply-msg-btn'
    btn.appendChild(img)

    div.appendChild(inp)
    div.appendChild(btn)
    outerdiv.appendChild(replyInp)
    outerdiv.appendChild(div)
    document.querySelector('body').appendChild(outerdiv)

    btn.addEventListener('click', () => {
        sendReply(Id)
    })
}

function sendReply(key) {
    let msg = document.querySelector('input.inp-msg').value
    let rply = document.querySelector('textarea.inp-reply').value
    let date = new Date()
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date();
    let cur = date.getDate() + '-' + month[date.getMonth()] + '-' + date.getFullYear() + '-' + date.getHours() + ":" + date.getMinutes() + ':' + date.getSeconds()
    let Key = `${cur}-${key.substring(30, key.length)}-${localStorage.getItem('userId')}`
    writeMessage(Key, msg, rply, key.substring(key.length - 8, key.length), localStorage.getItem('userName'), 'unread')
    swal('Success', "Message Sent", 'success')
    document.querySelector('div.outer-div').remove()

}

function hideBtnDiv() {
    document.querySelectorAll('div.stuwin-btn-div').forEach(div => {
        div.style.visibility = 'hidden'
        div.style.position = 'absolue'
    })

    let div = document.querySelector('div.stuwin-div')
    div.insertBefore(studiv, div.children[1])
}


function show() {
    document.getElementById("dropdown").style.visibility = 'visible';
    document.querySelector('button.menu').removeEventListener('click', show)
    document.querySelector('button.menu').addEventListener('click', hide)
}

function hide() {
    document.getElementById("dropdown").style.visibility = 'hidden';
    document.querySelector('button.menu').addEventListener('click', show)
}

document.querySelector('span.userTitle').innerHTML = localStorage.getItem('userId') + "<br>" + localStorage.getItem('userName')

document.querySelector('button#LogOut').addEventListener('click', () => {
    history.pushState(window.document.title, "#");
    // To replace the current entry in the browser's history stack
    history.replaceState(hideBtnDiv(), '', 'http://127.0.0.1:5500/Home/home.html');

    // To add a new entry to the history stack
    history.pushState(hideBtnDiv(), '', 'http://127.0.0.1:5500/Home/home.html');
    window.location.replace('http://127.0.0.1:5500/Home/home.html')
})

function autoDelete() {
    console.log('Auto Delete')
    read(() => {
        Slotkeys.forEach(key => {
            read(() => {
                if (key != 'STA-T000') {
                    // console.log(Slotkeys)
                    Slotkeys.forEach(nextkey => {
                        let date = SlotData[nextkey].date
                        let end = SlotData[nextkey].EndTime
                        let curdate = new Date();
                        let enddate = new Date(date + " " + end);
                        if ((curdate > enddate) == true) {
                            DeleteRecord(key, nextkey)
                        }
                    }, key)
                }

            }, 'SlotDetails', key)
        })
    }, 'SlotDetails', '')
}

function DeleteRecord(key, nextkey) {
    initializeApp(firebaseConfig)
    let db = getDatabase()
    remove(ref(db, `SlotDetails/${key}/` + nextkey))
}