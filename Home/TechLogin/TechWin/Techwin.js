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


function writeSlotDetails(userId, name, email, date, start, end) {
    console.log('run')
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();
    const reference = ref(db, 'SlotDetails/' + userId)
    set(reference, {
        userId: userId.substring(0, 8),
        username: name,
        email: email,
        date: date,
        StartTime: start,
        EndTime: end,
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

function updateData(database, userId = '', EndTime = '', StartTime = '', date = '', email = '', username = '', status = '') {
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
                writeSlotDetails('STA-T000', 'name', 'email', 'date', 'start', 'end')
            }
        })
        .catch((error) => {
            restart()
        });
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

document.querySelector('span.userTitle').innerHTML = localStorage.getItem('userId') + "<br>" + localStorage.getItem('userName')

document.querySelector('button#btn-slot').addEventListener('click', createSlot)
document.querySelector('button#btn-all-slot').addEventListener('click', allSlot)
document.querySelector('button#btn-my-slot').addEventListener('click', mySlot)
document.querySelector('button#btn-msg').addEventListener('click', checkMsgs)

autoDelete()
var techdiv = null
techdiv = document.createElement('div')
techdiv.className = 'tech-details-div'

function createSlot() {
    hideBtnDiv()
    let h1 = document.createElement('h1')
    h1.className = 'h1'
    h1.id = 'createslot-h1'
    h1.innerHTML = 'Create Slot'

    techdiv.appendChild(h1)


    let Texts = ["UserId", "Name", "Email Id", "Start Time", "End Time", "Date"]
    Texts.forEach(text => {
        let div = document.createElement('div')
        div.className = 'tech-inp-div'
        div.id = `tech-inp-div-${text}`

        let topdiv = document.createElement('div')
        topdiv.className = 'tech-inp-topdiv'

        let bottomdiv = document.createElement('div')
        bottomdiv.className = 'tech-inp-bottomdiv'

        div.appendChild(topdiv)
        div.appendChild(bottomdiv)

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

        if (text == 'Email Id') {
            lbl.id = "Email"
            inp.type = 'email'
        } else if (text.substring(text.length - 4, text.length) == 'Time') {
            inp.type = 'time'
            inp.disabled = false
        } else if (text == 'Date') {
            inp.type = 'date'
            inp.disabled = false
        } else {
            inp.type = 'text'
            inp.disabled = true
        }

        techdiv.appendChild(div)
        topdiv.appendChild(inp)
        topdiv.appendChild(lbl)
    })
    read(() => {
        document.getElementById('UserId').value = SlotData.userId
        document.getElementById('Name').value = SlotData.name
        document.getElementById('Email Id').value = SlotData.email
    }, 'Teacher', localStorage.getItem('userId'))

    let btn = document.createElement('button')
    btn.className = 'btn-create-slot'
    btn.innerHTML = 'Create'

    btn.addEventListener('click', create)
    techdiv.appendChild(btn)
}

function create() {
    let uid = document.getElementById('UserId').value
    let name = document.getElementById('Name').value
    let email = document.getElementById('Email Id').value
    let start = document.getElementById('Start Time').value
    let end = document.getElementById('End Time').value
    let date = document.getElementById('Date').value

    let curdate = new Date();
    let startdate = new Date(date + " " + start);
    let enddate = new Date(date + " " + end);

    let startTime, endTime
    let firstTwoStart = null
    if (parseInt(start.substring(0, 2)) >= 12) {
        firstTwoStart = String(parseInt(start.substring(0, 2)) - 12)
        if (firstTwoStart == 0) {
            firstTwoStart = 12
        }
        startTime = ((firstTwoStart.length == 1) ? "0" : "") + firstTwoStart + start.substring(2, start.length) + ' PM'
    } else {
        firstTwoStart = String(parseInt(start.substring(0, 2)))
        if (start == "00:00")
            startTime = '12:00 AM'
        else
            startTime = start + " AM"
    }
    let firstTwoEnd = null
    if (parseInt(end.substring(0, 2)) >= 12) {
        firstTwoEnd = String(parseInt(end.substring(0, 2)) - 12)
        if (firstTwoEnd == 0) {
            firstTwoEnd = 12
        }
        endTime = ((firstTwoEnd.length == 1) ? "0" : "") + firstTwoEnd + end.substring(2, end.length) + ' PM'
    } else {
        firstTwoEnd = String(parseInt(end.substring(0, 2)))
        if (end == '00:00')
            endTime = "12:00 AM"
        else
            endTime = end + ' AM'
    }


    let id = `${startTime}-${endTime} ${date}`
    uid += `/${startTime}-${endTime} ${date}`
    console.log(id, uid)
    read(() => {
        console.log('run')
        if (Slotkeys[Slotkeys.indexOf(localStorage.getItem('userId'))] == undefined) {
            console.log('ifrun')
            let duration = (((enddate - startdate) / 1000) / 3600)
            if (end == '' || start == '' || date == '') {
                swal('Warning', 'All fields must be filled!', 'error')
            } else if (curdate > new Date(startdate)) {
                swal('Warning', 'Slot can\'t be created for past date!', 'error')
            } else if (((enddate - startdate) / 1000) < 0) {
                swal('Warning', 'Slot can\'t be created for past time!', 'error')
            } else if (((enddate - startdate) / 1000) < 3600) {
                swal('Warning', 'Slot duration must be for an hour!', 'error')
            } else if ((((enddate - startdate) / 1000) / 3600) > 2) {
                swal('Warning', 'Maximum Slot duration can be of 2 hour only!', 'error')
            } else {
                writeSlotDetails(uid, name, email, date, start, end)
                swal('Slot Created', `Slot Timing: ${startTime} to ${endTime}<br>Slot Date: ${date}<br>Slot Duration: ${duration} Hours`, 'success')
                document.querySelector('div.tech-details-div').remove()
                document.querySelector('h1#createslot-h1').remove()
                document.querySelectorAll('div.tech-inp-div').forEach(div => {
                    div.remove()
                })
                document.querySelector('button.btn-create-slot').remove()
                slotData(uid)
            }
        } else {
            console.log('elserun')
            read(() => {
                console.log('Execute 1')
                if (Slotkeys[Slotkeys.indexOf(id)] == undefined) {
                    let duration = (((enddate - startdate) / 1000) / 3600)
                    if (end == '' || start == '' || date == '') {
                        swal('Warning', 'All fields must be filled!', 'error')
                    } else if (curdate > new Date(startdate)) {
                        swal('Warning', 'Slot can\'t be created for past date!', 'error')
                    } else if (((enddate - startdate) / 1000) < 0) {
                        swal('Warning', 'Slot can\'t be created for past time!', 'error')
                    } else if (((enddate - startdate) / 1000) < 3600) {
                        swal('Warning', 'Slot duration must be for an hour!', 'error')
                    } else if ((((enddate - startdate) / 1000) / 3600) > 2) {
                        swal('Warning', 'Maximum Slot duration can be of 2 hour only!', 'error')
                    } else {
                        writeSlotDetails(uid, name, email, date, start, end)
                        swal('Slot Created', `Slot Timing: ${startTime} to ${endTime}<br>Slot Date: ${date}<br>Slot Duration: ${duration} Hours`, 'success')
                        document.querySelector('h1#createslot-h1').remove()
                        document.querySelectorAll('div.tech-inp-div').forEach(div => {
                            div.remove()
                        })
                        document.querySelector('button.btn-create-slot').remove()
                        slotData(uid)
                    }
                } else {
                    swal('Warning', 'Slot Already Exists!', 'error')
                }
            }, 'SlotDetails', localStorage.getItem('userId'))
        }
    }, 'SlotDetails', '')
}


function slotData(key) {
    let table = document.createElement('table')
    table.id = key
    read(() => {
        table.innerHTML = `
                <tr><td>UserId:</td><td>${SlotData.userId}</td></tr>
                <tr><td>Name:</td><td>${SlotData.username}</td></tr>
                <tr><td>Email:</td><td>${SlotData.email}</td></tr>
                <tr><td>Start Time:</td><td>${SlotData.StartTime}</td></tr>
                <tr><td>End Time:</td><td>${SlotData.EndTime}</td></tr>
                <tr><td>Date:</td><td>${SlotData.date}</td></tr>
                `
    }, 'SlotDetails', key)
    let h1 = document.createElement('h1')
    h1.className = 'h1'
    h1.innerHTML = 'Created Slot details'

    let div = document.querySelector('div.techwin-div')
    techdiv.appendChild(h1)
    div.insertBefore(table, div.children[2])
}

let table = document.createElement('table')

function allSlot() {
    hideBtnDiv()
    table.id = 'AllSlot'
    table.innerHTML = `
    <tr><th id='SlotH'>Teacher ID</th>
    <th id='SlotH'>Name</th>
    <th id='SlotH'>Email</th>
    <th id='SlotH'>Start Time</th>
    <th id='SlotH'>End Time</th>
    <th id='SlotH'>Date</th>
    <th id='SlotH'>Edit</th>
    </tr>
    `
    let div = document.querySelector('div.techwin-div')
    slotSheet(localStorage.getItem('userId'), null)
}

function slotSheet(Key, id = null) {
    let h1 = document.createElement('h1')
    h1.className = 'details-h1'
    h1.innerHTML = 'No Data available at the moment!'

    let div = document.querySelector('div.techwin-div')
    div.insertBefore(h1, div.children[2])

    read(() => {
        h1.remove()
        div.insertBefore(table, div.children[2])
        var count = 0
        Slotkeys.forEach(key => {
            table.innerHTML += `
            <tr><td id='SlotRow'>${SlotData[key].userId}</td>
            <td id='SlotRow'>${SlotData[key].username}</td>
            <td id='SlotRow'>${SlotData[key].email}</td>
            <td id='SlotRow'>${SlotData[key].StartTime}</td>
            <td id='SlotRow'>${SlotData[key].EndTime}</td>
            <td id='SlotRow'>${SlotData[key].date}</td>
            <td id='SlotRow'><button id='edit-${SlotData[key].userId}-${key}' class='edit'>Edit</button></td>
            </tr>
            `
            document.querySelectorAll('button.edit').forEach(btn => {
                    btn.addEventListener('click', edit)
                })
                // if (id == 'btn-my-slot') {
                //     let i = 0
                //     document.querySelectorAll('button.btn-slot-update').forEach(btn => {
                //         if (i == count) {
                //             btn.id = `btn-slot-update-${key}`
                //         }
                //         btn.addEventListener('click', Update)
                //         i++
                //     })
                //     let j = 0
                //     document.querySelectorAll('button.btn-slot-delete').forEach(btn => {
                //         if (j == count) {
                //             btn.id = `btn-slot-delete-${key}`
                //         }
                //         btn.addEventListener('click', Delete)
                //         j++
                //     });
                //     count++

            // }
        })
    }, 'SlotDetails', Key)
}

function mySlot() {
    hideBtnDiv()
    table.id = 'AllSlot'
    table.innerHTML = `
    <tr>
    <th id='SlotH'>Student Name</th>
    <th id='SlotH'>Email</th>
    <th id='SlotH'>Time</th>
    <th id='SlotH'>Date</th>
    <th id='SlotH'>Status</th>
    <th id='SlotH'>Edit</th>
    </tr>
    `
    read(() => {
        Slotkeys.forEach(key => {
            if (key.substring(9, key.length).startsWith(localStorage.getItem('userId'))) {
                console.log(SlotData[key])
                table.innerHTML += `
                <tr>
                    <td id='SlotRow'>${SlotData[key].studentName}</td>
                    <td id='SlotRow'>${SlotData[key].email}</td>
                    <td id='SlotRow'>${SlotData[key].time}</td>
                    <td id='SlotRow'>${SlotData[key].date}</td>
                    <td id='SlotRow'>${SlotData[key].status}</td>
                    <td id='SlotRow'><button class='slot-btn' id='btn-${key}'>Edit Status</button></td>
                </tr>
                `
            }
        })
        document.querySelectorAll('button.slot-btn').forEach(btn => {
            btn.addEventListener('click', editMySlot)

        })
    }, 'Booking', '')
    let div = document.querySelector('div.techwin-div')
    div.insertBefore(table, div.children[1])
}

function edit() {
    let id = this.id.substring(14, this.id.length)
    let div = document.createElement('div')
    div.className = 'slot-update-div'

    let h1 = document.createElement('h1')
    h1.className = 'details'
    h1.innerHTML = 'Edit Slot'
    techdiv.appendChild(h1)

    document.getElementById('AllSlot').remove()
    let Key = `${localStorage.getItem('userId')}/${id}`
    console.log(Key)
    read(() => {
        Slotkeys.forEach(key => {
            let lbl = document.createElement('label')
            lbl.className = 'lbl-slot'

            let inp
            if (key != 'userId') {
                let innerdiv = document.createElement('div')
                innerdiv.className = 'inner-slot-div'
                innerdiv.id = `inner-${key}-div`
                inp = document.createElement('input')
                innerdiv.appendChild(lbl)
                innerdiv.appendChild(inp)
                div.appendChild(innerdiv)
                inp.type = 'text'
            }

            if (key == 'username') {
                inp.type = 'text'
                inp.value = SlotData.username
                lbl.innerHTML = 'UserName'
                inp.id = 'username'

                let btndiv = document.createElement('div')
                btndiv.className = 'btn-slot-div'
                let btnupdate = document.createElement('button')
                btnupdate.innerHTML = 'Update'
                btnupdate.className = 'slot-btn'
                btnupdate.id = `update-${SlotData.userId}`
                btnupdate.addEventListener('click', () => {
                    Update(Key)
                })

                let btndel = document.createElement('button')
                btndel.innerHTML = 'Delete'
                btndel.className = 'slot-btn'
                btndel.id = `del-${SlotData.userId}`
                btndel.addEventListener('click', () => {
                    initializeApp(firebaseConfig)
                    let db = getDatabase()
                    swal('Deleted!', 'Slot is deleted successfully', 'success')
                    remove(ref(db, `SlotDetails/` + Key))
                    read(() => {
                        Slotkeys.forEach(key => {
                            let id = `${key}-${localStorage.getItem('userId')}-` + Key.substring(9, Key.length)
                            console.log(id)
                            initializeApp(firebaseConfig)
                            let db = getDatabase()
                            remove(ref(db, 'Booking/' + id))
                        })
                    }, 'Student', '')
                    restart()

                })

                btndiv.appendChild(btnupdate)
                btndiv.appendChild(btndel)
                try {
                    div.appendChild(btndiv)
                } catch (error) {

                }
            } else if (key == 'email') {
                inp.type = 'text'
                inp.value = SlotData.email
                lbl.innerHTML = 'Email Id'
                inp.id = 'email'
            } else if (key == 'StartTime') {
                inp.type = 'text'
                inp.value = SlotData.StartTime
                lbl.innerHTML = 'StartTime'
                inp.id = 'StartTime'
            } else if (key == 'EndTime') {
                inp.type = 'text'
                inp.value = SlotData.EndTime
                lbl.innerHTML = 'EndTime'
                inp.id = 'EndTime'
            } else if (key == 'date') {
                inp.type = 'text'
                inp.value = SlotData.date
                lbl.innerHTML = 'Date'
                inp.id = 'date'
            }

        })
    }, 'SlotDetails', Key)
    techdiv.insertBefore(div, techdiv.children[1])
}

function Update(Key) {
    let username = document.getElementById('username').value
    let email = document.getElementById('email').value
    let StartTime = document.getElementById('StartTime').value
    let EndTime = document.getElementById('EndTime').value
    let date = document.getElementById('date').value
    let curdate = new Date();
    console.log(new Date(StartTime + " " + date))
    console.log(new Date(EndTime + " " + date))
    let duration = (((new Date(EndTime + " " + date) - new Date(StartTime + ' ' + date)) / 1000) / 3600)
    console.log(curdate)
    console.log(duration)
    if (String(username).trim().length <= 3) {
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
    } else if (StartTime.trim().length < 1) {
        swal('Update Unsuccessfull', 'Invalid Time!', 'error')
    } else if (EndTime.trim().length < 1) {
        swal('Update Unsuccessfull', 'Invalid Time!', 'error')
    } else if (date.trim().length < 10) {
        swal('Update Unsuccessfull', 'Invalid Date!', 'error')
    } else if (curdate > new Date(StartTime + ' ' + date)) {
        swal('Warning', 'Slot can\'t be created for past date!', 'error')
    } else if ((duration * 1000 * 3600) < 0) {
        swal('Warning', 'Slot can\'t be created for past time!', 'error')
    } else if ((duration * 36000) < 3600) {
        swal('Warning', 'Slot duration must be for an hour!', 'error')
    } else if (duration > 2) {
        swal('Warning', 'Maximum Slot duration can be of 2 hour only!', 'error')
    } else {
        swal('Updated', 'Slot is successfully updated!', 'success')
        updateData('SlotDetails', Key, EndTime, StartTime, date, email, username)
        restart()
    }
}

function editMySlot() {
    document.querySelector('table#AllSlot').remove()
    let h1 = document.createElement('h1')
    h1.innerHTML = 'Edit Status'
    techdiv.appendChild(h1)

    console.log(this.id)
    let arr = ['Name', 'Email', 'Status']
    arr.forEach(item => {
        let lbl = document.createElement('label')
        lbl.className = 'lbl-inner'
        lbl.innerHTML = item

        if (item != 'Status') {

            let inp = document.createElement('input')
            inp.id = 'inp-' + item
            inp.type = 'text'
            inp.disabled = true

            let div = document.createElement('div')
            div.className = `inner-div`
            div.id = `inner-div-${item}`

            div.appendChild(lbl)
            div.appendChild(inp)

            techdiv.appendChild(div)
        } else {
            let select = document.createElement('select')
            select.className = 'select'

            let opt1 = document.createElement('option')
            opt1.value = 'Approved'
            opt1.innerHTML = 'Approved'

            let opt2 = document.createElement('option')
            opt2.value = 'Pending'
            opt2.innerHTML = 'Pending'
            let opt3 = document.createElement('option')
            opt3.value = 'Cancel'
            opt3.innerHTML = 'Cancel'

            select.appendChild(opt1)
            select.appendChild(opt2)
            select.appendChild(opt3)

            let div = document.createElement('div')
            div.className = `inner-div`
            div.id = `inner-div-${item}`

            div.appendChild(lbl)
            div.appendChild(select)
            techdiv.appendChild(div)
        }
    })

    let btn = document.createElement('button')
    btn.className = 'update-booking'
    btn.innerHTML = 'Update'
    btn.addEventListener('click', () => {
        swal('Update!', 'Status is updated successfully!', 'success')
        let val = document.querySelector('select.select').value
        updateData('Booking', this.id.substring(4, this.id.length), '', '', '', '', '', val)
        restart()
    })

    techdiv.appendChild(btn)
    read(() => {
        document.getElementById('inp-Name').value = SlotData.studentName
        document.getElementById('inp-Email').value = SlotData.email
    }, 'Booking', this.id.substring(4, this.id.length))
}

function checkMsgs() {
    hideBtnDiv()
    let h1 = document.createElement('h1')
    h1.innerHTML = 'My Messages'
    techdiv.appendChild(h1)

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
                let div = document.querySelector('div.techwin-div')
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
                updateData('Message', key, '', '', '', '', '', 'read')
        })
    }, 'Message', '')
}

function reply() {
    let Id = this.id
    let div = document.createElement('div')
    div.className = 'Msg-div'

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
    btn.id = 'inp-msg-btn'
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
    console.log(msg)
    console.log(rply)
    let date = new Date()
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = new Date();
    let cur = date.getDate() + '-' + month[date.getMonth()] + '-' + date.getFullYear() + '-' + date.getHours() + ":" + date.getMinutes() + ':' + date.getSeconds()
    let Key = `${cur}-${key.substring(29, key.length)}-${localStorage.getItem('userId')}`
    read(() => {
        writeMessage(Key, msg, rply, SlotData.username, localStorage.getItem('userName'), 'unread')
        swal('Success', "Message Sent", 'success')
        document.querySelector('div.outer-div').remove()
    }, 'Student', key.substring(key.length - 8, key.length))

}

function hideBtnDiv() {
    document.querySelectorAll('div.techwin-btn-div').forEach(div => {
        div.style.visibility = 'hidden'
        div.style.position = 'absolue'
    })

    techdiv = document.createElement('div')
    techdiv.className = 'tech-details-div'

    let div = document.querySelector('div.techwin-div')
    div.insertBefore(techdiv, div.children[1])
}

document.querySelector('button#Home').addEventListener('click', restart)

function restart() {
    document.querySelectorAll('div.techwin-btn-div').forEach(div => {
        div.style.visibility = 'visible'
        div.style.position = 'static'
    })
    try {
        document.querySelector('div.tech-details-div').remove()
        document.querySelector('table').remove()
    } catch (error) {

    }
    try {
        document.querySelector('h1.details-h1').remove()
    } catch (err) {}
    try {
        document.querySelector('table#AllSlot').remove()
    } catch (err) {}
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

function autoDelete() {
    console.log('Auto Delete')
    read(() => {
        Slotkeys.forEach(key => {
            read(() => {
                if (key != 'STA-T000') {
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