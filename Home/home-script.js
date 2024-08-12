mainWin()

function mainWin() {
    let btnDiv = document.createElement('div')
    btnDiv.id = 'btn-div'
    btnDiv.className = 'btn-div'

    let mainbtns = ['Admin', 'Student Register', 'Student Login', 'Teacher Login']
    mainbtns.forEach(text => {
        let btn = document.createElement('button')
        btn.className = 'main-btn'
        btn.id = text
        btn.innerHTML = text
        btnDiv.appendChild(btn)
    })

    document.querySelector('div.main-div').appendChild(btnDiv)

    let Mainbuttons = document.querySelectorAll('button.main-btn')
    Mainbuttons.forEach(btn => {
        if (btn.id == "Admin") {
            btn.addEventListener('click', () => {
                location.href = 'Admin\\admin.html'
            })
        } else if (btn.id == "Student Register") {
            btn.addEventListener('click', () => {
                location.href = 'StuRegister\\Register.html'
            })
        } else if (btn.id == "Student Login") {
            btn.addEventListener('click', () => {
                location.href = 'StuLogin\\Stulogin.html'
            })
        } else if (btn.id == "Teacher Login") {
            btn.addEventListener('click', () => {
                location.href = 'TechLogin\\Techlogin.html'
            })
        }
    })
}

function Close() {
    document.querySelector('div.admin-div').remove()
    mainWin()
}