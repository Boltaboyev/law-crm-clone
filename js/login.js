import {useFetch} from "./utils/asp.module/moduleA/base.js"

const fetchApi = useFetch()

const loginForm = document.getElementById("loginForm")
const loginUsername = document.getElementById("loginUsername")
const loginPassword = document.getElementById("loginPassword")
const passwordInputs = document.querySelectorAll(".passwordInput")
const showPassEyes = document.querySelectorAll(".showPassEye")
const loginPasswordDiv = document.querySelector(".loginPasswordDiv")

// notify
const isMobile = window.innerWidth <= 768;
const notyf = new Notyf({
    position: isMobile 
        ? { x: "center", y: "bottom" } 
        : { x: "right", y: "top" },    
    dismissible: true,
});


// Show/hide password
showPassEyes.forEach((eye, index) => {
    eye.addEventListener("click", () => {
        const input = passwordInputs[index]
        const isPassword = input.type === "password"
        input.type = isPassword ? "text" : "password"
        eye.classList.toggle("fa-eye", !isPassword)
        eye.classList.toggle("fa-eye-slash", isPassword)
    })
})

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const usernameValue = loginUsername.value.trim()
    const passwordValue = loginPassword.value.trim()

    loginUsername.style.border = ""
    loginPassword.style.border = ""

    if (!usernameValue || !passwordValue) {
        notyf.error("Ma'lumot kiriting !")

        if (!usernameValue) loginUsername.style.borderColor = "red"
        if (!passwordValue) loginPasswordDiv.style.borderColor = "red"

        return
    }

    try {
        const data = await fetchApi({url: "users"})
        const findUser = data.find(
            (user) =>
                user.username === usernameValue &&
                user.password === passwordValue
        )

        if (findUser) {
            notyf.success("Xush kelibsiz")
            setTimeout(() => {
                const role = findUser.role
                const rolePages = {
                    admin: "../pages/admin.html",
                    reception: "../pages/reception.html",
                    teacher: "../pages/teacher.html",
                    support: "../pages/support.html",
                    student: "../pages/student.html",
                }

                if (rolePages[role]) {
                    window.location.href = rolePages[role]
                }

                localStorage.setItem("user", JSON.stringify(findUser))
            }, 2000)
        } else {
            notyf.error("Login yoki parol xato !")
        }
    } catch (err) {
        notyf.error("Xatolik yuz berdi")
    }
})
