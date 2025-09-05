import {useFetch} from "./utils/asp.module/moduleA/base.js"

const fetchApi = useFetch()
const DEMO_MODE = true

// notify
const isMobile = window.innerWidth <= 768
const notyf = new Notyf({
    position: isMobile ? {x: "center", y: "bottom"} : {x: "right", y: "top"},
    dismissible: true,
})

const roles = {
    admin: {login: "reception", password: "reception123"},
    teacher: {login: "teacher", password: "teacher123"},
    student: {login: "john", password: "john123"},
}

const roleAlias = {
    admin: "reception",
    teacher: "teacher",
    student: "student",
}

const rolePages = {
    admin: "../pages/admin.html",
    reception: "../pages/reception.html",
    teacher: "../pages/teacher.html",
    support: "../pages/support.html",
    student: "../pages/student.html",
}

// --- mobil oyna ochish funksiyasi ---
function OpenWindowMobile(b, d, a, c) {
    if (!c) c = "popup"
    if (!d) d = 800
    if (!a) a = 600

    const f = (screen.width - d) / 2
    const e = window.open(
        b,
        c,
        "left=" +
            f +
            ",top=100,width=" +
            d +
            ",height=" +
            a +
            ",directories=no,menubar=no,status=yes,resizable=yes,scrollbars=yes,toolbar=no"
    )

    if (e && e.opener == null) {
        e.opener = self
    }

    if (e) e.focus()
    return false
}

function completeLogin(userObj, preferredRoleKey) {
    const resolvedRole =
        userObj?.role || roleAlias[preferredRoleKey] || "student"

    if (resolvedRole === "student") {
        // studentni redirect emas, faqat mobil popupda ochamiz
        OpenWindowMobile(rolePages.student, 420, 568, "student-app")
        localStorage.setItem("user", JSON.stringify(userObj))
        return
    }

    if (rolePages[resolvedRole]) {
        localStorage.setItem("user", JSON.stringify(userObj))
        window.location.href = rolePages[resolvedRole]
    } else {
        notyf.error("Rol uchun sahifa topilmadi")
    }
}

async function findUserFromBackend(login, password) {
    const data = await fetchApi({url: "users"})
    if (!Array.isArray(data)) return null

    const match = data.find((u) => {
        const uLogin =
            (typeof u.username === "string" && u.username) ||
            (typeof u.login === "string" && u.login) ||
            ""
        const uPass =
            (typeof u.password === "string" && u.password) ||
            (typeof u.pass === "string" && u.pass) ||
            ""

        return uLogin === login && uPass === password
    })

    return match || null
}

document.querySelectorAll("button[data-role]").forEach((btn) => {
    btn.addEventListener("click", async () => {
        const btnRoleKey = btn.dataset.role
        const creds = roles[btnRoleKey]
        if (!creds) {
            notyf.error("Noto‘g‘ri rol")
            return
        }

        const {login, password} = creds

        try {
            if (DEMO_MODE) {
                const demoUser = {
                    id: "demo-" + btnRoleKey,
                    username: login,
                    login,
                    password,
                    role: roleAlias[btnRoleKey],
                    fullName:
                        btnRoleKey === "admin"
                            ? "Reception Admin"
                            : btnRoleKey === "teacher"
                            ? "Demo Teacher"
                            : "John Doe",
                }

                notyf.success(`${btnRoleKey} sifatida kirdingiz (DEMO)!`)
                setTimeout(() => completeLogin(demoUser, btnRoleKey), 800)
                return
            }

            const found = await findUserFromBackend(login, password)

            if (found) {
                notyf.success(`${btnRoleKey} sifatida kirdingiz!`)
                setTimeout(() => completeLogin(found, btnRoleKey), 800)
            } else {
                notyf.error("Login yoki parol xato! (DBda topilmadi)")
                console.warn(
                    "[Login notice] DBda mos user topilmadi. " +
                        "Agar bu demo bo'lsa, DEMO_MODE = true qiling yoki " +
                        "`users` ro'yxatiga quyidagi userlarni qo'shing:",
                    roles
                )
            }
        } catch (err) {
            console.error(err)
            notyf.error("Xatolik yuz berdi")
        }
    })
})
