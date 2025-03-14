import {useFetch} from "./utils/asp.module/moduleA/base.js"
const fetchApi = useFetch()

// scan user
const user = JSON.parse(localStorage.getItem("user"))

if (!user || user.role !== "reception") {
    const redirectPath = user ? `../pages/${user.role}.html` : "../index.html"
    window.location.href = redirectPath
}

// notify
const notyf = new Notyf({
    position: {
        x: "right",
        y: "top",
    },
    dismissible: true,
})

// greeting receptionist by name
const receptionName = document.getElementById("receptionName")
receptionName.innerHTML = `${user.name}`


// section active functions
const buttons = document.querySelectorAll(".sectionBtn")
const sections = document.querySelectorAll(".section")
const savedSection = localStorage.getItem("activeSection")

sections.forEach((section, index) => {
    if (savedSection) {
        if (section.id === savedSection) {
            section.style.display = "flex"
            buttons[index].classList.add("adminActiveBtn")
        } else {
            section.style.display = "none"
        }
    } else {
        if (index === 0) {
            section.style.display = "flex"
            buttons[index].classList.add("adminActiveBtn")
        } else {
            section.style.display = "none"
        }
    }
})

buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        sections.forEach((section) => (section.style.display = "none"))
        buttons.forEach((btn) => btn.classList.remove("adminActiveBtn"))

        sections[index].style.display = "flex"
        button.classList.add("adminActiveBtn")

        localStorage.setItem("activeSection", sections[index].id)
    })
})

// daily attendance -----------------------------------
const appendStudentsAttendance = document.getElementById(
    "appendStudentsAttendance"
)
fetchApi({url: "users"})
    .then((data) => {
        const students = data.filter((user) => user.role === "student")
        students.forEach((value) => {
            let tableRow = document.createElement("tr")
            tableRow.classList.add("attendanceTableRow")
            tableRow.innerHTML = `
                <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                    <img class="w-10 h-10 rounded-full" src=${
                        value?.avatar
                    } alt="">
                    <div class="ps-3">
                        <div class="text-primary font-semibold">${
                            value?.name + " " + value?.surname
                        }</div>
                    </div>
                </th>

                <td class="px-6 py-4">
                    <p>${value?.phoneNum}</p>
                    <p>${value?.parentsPhoneNum}</p>
                </td>
                <td class="px-6 py-4">
                <div class="flex items-center">
                    <div class="h-2.5 w-2.5 rounded-full ${
                        value?.attend ? "bg-green-500" : "bg-red-500"
                    } me-2"></div> ${value?.attend ? "Keldi" : "Kelmadi"} </div>
                </td>
            `

            appendStudentsAttendance.append(tableRow)
        })
    })
    .catch((err) => console.log(err))

const passwordInput = document.querySelectorAll(".passwordInput")
const showPassEye = document.querySelectorAll(".showPassEye")
const passwordInputs = document.querySelectorAll(".passwordInput")
const showPassEyes = document.querySelectorAll(".showPassEye")

showPassEyes.forEach((eye, index) => {
    eye.addEventListener("click", () => {
        const input = passwordInputs[index]

        if (input.type === "password") {
            input.type = "text"
            eye.classList.remove("fa-eye")
            eye.classList.add("fa-eye-slash")
        } else {
            input.type = "password"
            eye.classList.remove("fa-eye-slash")
            eye.classList.add("fa-eye")
        }
    })
})

// phone number regex ---------------------------------------------------------------------
const receptionPhoneNum = document.querySelectorAll(".receptionPhoneNum")

receptionPhoneNum.forEach((value) => {
    value.addEventListener("input", (event) => {
        let input = value.value.replace(/\D/g, "")
        if (event.inputType === "deleteContentBackward" && input.length <= 3) {
            input = input.slice(0, 3)
        } else {
            if (!input.startsWith("998")) {
                input = "998" + input
            }
        }

        input = input.slice(0, 12)

        let formatted = "+998"
        if (input.length > 3) formatted += `(${input.slice(3, 5)}`
        if (input.length > 5) formatted += `)-${input.slice(5, 8)}`
        if (input.length > 8) formatted += `-${input.slice(8, 10)}`
        if (input.length > 10) formatted += `-${input.slice(10, 12)}`

        value.value = formatted
    })
})

// name, surname regex
const uppercaseInput = document.querySelectorAll(".uppercaseInput")
uppercaseInput.forEach((input) => {
    input.addEventListener("input", (event) => {
        let value = event.target.value
        value = value.replace(/[^a-zA-Z]/g, "")
        value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        event.target.value = value
    })
})

// Format users join time
const joinTime = new Date()
const formatDate = (date) => {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
}

// Add teacher
const addTeacherForm = document.getElementById("addTeacherForm")
const addTeacherName = document.getElementById("addTeacherName")
const addTeacherSurname = document.getElementById("addTeacherSurname")
const addTeacherPhone = document.getElementById("addTeacherPhone")
const addTeacherRole = document.getElementById("addTeacherRole")
const addTeacherUsername = document.getElementById("addTeacherUsername")
const addTeacherPassword = document.getElementById("addTeacherPassword")

addTeacherForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = addTeacherUsername.value.trim()

    // Check username
    const isUsernameTaken = await checkIfUsernameExists(username)
    if (isUsernameTaken) {
        notyf.error("Maxfiy so'z ishlatilingan")
        return
    }

    let teacherData = {
        name: addTeacherName.value.trim(),
        surname: addTeacherSurname.value.trim(),
        phoneNum: addTeacherPhone.value.trim(),
        role: addTeacherRole.value,
        username: addTeacherUsername.value.trim(),
        password: addTeacherPassword.value.trim(),
        avatar: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
        coin: null,
        parentsPhoneNum: null,
        payment: false,
        attend: false,
        joinDate: formatDate(joinTime),
    }

    fetchApi({
        url: "users",
        method: "POST",
        data: JSON.stringify(teacherData),
    })
        .then(() => {
            notyf.success("Yangi o'qituvchi qo'shildi")
        })
        .catch(() => {
            notyf.error("Xatolik yuz berdi")
        })
})

// Add student
const addStudentForm = document.getElementById("addStudentForm")
const addStudentName = document.getElementById("addStudentName")
const addStudentSurname = document.getElementById("addStudentSurname")
const addStudentPhone = document.getElementById("addStudentPhone")
const addStudentParentPhone = document.getElementById("addStudentParentPhone")
const addStudentUsername = document.getElementById("addStudentUsername")
const addStudentPassword = document.getElementById("addStudentPassword")

addStudentForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = addStudentUsername.value.trim()

    const isUsernameTaken = await checkIfUsernameExists(username)
    if (isUsernameTaken) {
        notyf.error("Maxfiy so'z ishlatilingan")
        return
    }

    let studentData = {
        name: addStudentName.value.trim(),
        surname: addStudentSurname.value.trim(),
        phoneNum: addStudentPhone.value.trim(),
        parentsPhoneNum: addStudentParentPhone.value.trim(),
        role: "student",
        username: addStudentUsername.value.trim(),
        password: addStudentPassword.value.trim(),
        avatar: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
        coin: 0,
        xp: 0,
        parentsPhoneNum: addStudentParentPhone.value.trim(),
        payment: false,
        attend: false,
        joinDate: formatDate(joinTime),
    }

    fetchApi({
        url: "users",
        method: "POST",
        data: JSON.stringify(studentData),
    })
        .then(() => {
            notyf.success("Yangi o'quvchi qo'shildi")
        })
        .catch(() => {
            notyf.error("Xatolik yuz berdi")
        })
})

// Username tekshirish funksiyasi
const checkIfUsernameExists = async (username, currentUserId) => {
    const users = await fetchApi({url: "users"})
    return users.some(
        (user) => user.username === username && user.id !== currentUserId
    )
}

// Edit teachers -----------------------------------------------
const editTeacherAppendDiv = document.getElementById("editTeacherAppendDiv")
const editTeacherModal = document.getElementById("editTeacherModal")
const closeEditTeacherModal = document.getElementById("closeEditTeacherModal")
const editTeacherModalForm = document.getElementById("editTeacherModalForm")
const editTeacherModalFormName = document.getElementById(
    "editTeacherModalFormName"
)
const editTeacherModalFormSurname = document.getElementById(
    "editTeacherModalFormSurname"
)
const editTeacherModalFormUsername = document.getElementById(
    "editTeacherModalFormUsername"
)
const editTeacherModalFormPassword = document.getElementById(
    "editTeacherModalFormPassword"
)
const editTeacherModalFormPhone = document.getElementById(
    "editTeacherModalFormPhone"
)
const editTeacherModalFormRole = document.getElementById(
    "editTeacherModalFormRole"
)

fetchApi({url: "users"})
    .then((data) => {
        const teachers = data.filter(
            (user) => user.role === "teacher" || user.role === "support"
        )
        teachers.forEach((value) => {
            let editTeacherBox = document.createElement("div")
            editTeacherBox.classList.add("editTeacherBox")
            editTeacherBox.innerHTML = `
                <div class="flex justify-center items-center">
                    <img src="${
                        value?.avatar
                    }" alt="" class="h-[70px] w-[70px] rounded-full object-cover">
                </div>

                <div class="flex flex-col gap-[0] p-[5px]">
                    <p class="text-[13px] opacity-40 fon-[400]">F.I.SH</p>
                    <h1 class="fullName">${
                        value?.name + " " + value?.surname
                    }</h1>
                </div>

                <hr>

                <div class="flex flex-col gap-[0] p-[5px]">
                    <p class="text-[13px] opacity-40 fon-[400]">Kasbi</p>
                    <h1>${
                        value?.role === "teacher"
                            ? "Asosiy o'qituvchi"
                            : "Yordamchi o'qituvchi"
                    }</h1>
                </div>

                <div class="flex justify-between items-center gap-[20px]">
                    <button
                        class="deleteButton w-full p-[8px] border border-red-500 text-red-500 rounded-md hover:bg-red-400 hover:text-white active:scale-[.98] transition-colors duration-[.2s]"
                        data-id="${value.id} ">
                        <i class="bx bx-trash"></i>
                    </button>

                    <button
                        class="editButton w-full p-[8px] border border-blue-500 text-blue-500 rounded-md hover:bg-blue-400 hover:text-white active:scale-[.98] transition-colors duration-[.2s]"
                        data-id="${value.id}">
                        <i class="bx bx-edit"></i>
                    </button>
                </div>
            `

            editTeacherAppendDiv.append(editTeacherBox)
        })

        const deleteButtons = document.querySelectorAll(".deleteButton")
        const deletingUserModal = document.getElementById("deletingUserModal")
        const deletingUserName = document.getElementById("deletingUserName")
        const yesBtn = document.getElementById("yesBtn")
        const noBtn = document.getElementById("noBtn")

        let userIdToDelete = null

        deleteButtons.forEach((button) => {
            button.addEventListener("click", () => {
                userIdToDelete = button.getAttribute("data-id")

                deletingUserModal.style.display = "flex"

                const userName =
                    button.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.querySelector(
                        "h1"
                    ).textContent
                deletingUserName.textContent = userName
            })
        })

        yesBtn.addEventListener("click", () => {
            if (userIdToDelete) {
                fetchApi({
                    url: `users/${userIdToDelete}`,
                    method: "DELETE",
                })
                    .then(() => {
                        notyf.success("O'qituvchi o'chirildi")
                    })
                    .catch(() => {
                        notyf.error("Xatolik yuz berdi")
                    })
            }
        })

        noBtn.addEventListener("click", () => {
            deletingUserModal.style.display = "none"
            userIdToDelete = null
        })

        const editButtons = document.querySelectorAll(".editButton")
        editButtons.forEach((button) => {
            button.addEventListener("click", () => {
                editTeacherModal.style.display = "flex"

                const userId = button.getAttribute("data-id")
                const userData = teachers.find(
                    (teacher) => teacher.id == userId
                )

                // Modalni to'ldirish
                editTeacherModalFormName.value = userData.name
                editTeacherModalFormSurname.value = userData.surname
                editTeacherModalFormUsername.value = userData.username
                editTeacherModalFormPassword.value = userData.password
                editTeacherModalFormPhone.value = userData.phoneNum
                editTeacherModalFormRole.value = userData.role

                closeEditTeacherModal.addEventListener("click", () => {
                    editTeacherModal.style.display = "none"
                })

                // Username tekshirish
                editTeacherModalFormUsername.addEventListener(
                    "input",
                    async () => {
                        const username =
                            editTeacherModalFormUsername.value.trim()
                        const isUsernameTaken = await checkIfUsernameExists(
                            username,
                            userId
                        )

                        if (isUsernameTaken) {
                            editTeacherModalFormUsername.classList.add(
                                "border-red-500"
                            )
                            notyf.error("Maxfiy so'z ishlatilingan")
                        } else {
                            editTeacherModalFormUsername.classList.remove(
                                "border-red-500"
                            )
                        }
                    }
                )

                // Formani yuborish
                editTeacherModalForm.addEventListener("submit", async (e) => {
                    e.preventDefault()

                    const username = editTeacherModalFormUsername.value.trim()
                    const isUsernameTaken = await checkIfUsernameExists(
                        username,
                        userId
                    )

                    if (isUsernameTaken) {
                        editTeacherModalFormUsername.classList.add(
                            "border-red-500"
                        )
                        notyf.error("Maxfiy so'z ishlatilingan")
                        return
                    }

                    const updatedData = {
                        name: editTeacherModalFormName.value.trim(),
                        surname: editTeacherModalFormSurname.value.trim(),
                        username: editTeacherModalFormUsername.value.trim(),
                        password: editTeacherModalFormPassword.value.trim(),
                        phoneNum: editTeacherModalFormPhone.value.trim(),
                        role: editTeacherModalFormRole.value,
                        avatar: userData.avatar,
                    }

                    fetchApi({
                        url: `users/${userId}`,
                        method: "PUT",
                        data: JSON.stringify(updatedData),
                    })
                        .then(() => {
                            editTeacherModal.style.display = "none"
                            notyf.success("O'qituvchi tahrirlandi")
                        })
                        .catch(() => {
                            editStudentModal.style.display = "none"
                            notyf.error("Xatolik yuz berdi")
                        })
                })
            })
        })
    })
    .catch((err) => console.log(err))

// edit students ----------------------------------------------------------------
const editStudentAppendDiv = document.getElementById("editStudentAppendDiv")
const editStudentModal = document.getElementById("editStudentModal")
const closeEditStudentModal = document.getElementById("closeEditStudentModal")
const editStudentModalForm = document.getElementById("editStudentModalForm")
const editStudentModalFormName = document.getElementById(
    "editStudentModalFormName"
)
const editStudentModalFormSurname = document.getElementById(
    "editStudentModalFormSurname"
)
const editStudentModalFormUsername = document.getElementById(
    "editStudentModalFormUsername"
)
const editStudentModalFormPassword = document.getElementById(
    "editStudentModalFormPassword"
)
const editStudentModalFormPhone = document.getElementById(
    "editStudentModalFormPhone"
)
const editStudentModalFormParentPhone = document.getElementById(
    "editStudentModalFormParentPhone"
)

fetchApi({url: "users"})
    .then((data) => {
        const students = data.filter((user) => user.role === "student")

        students.forEach((value) => {
            const editStudentBox = document.createElement("div")
            editStudentBox.classList.add("editStudentBox")
            editStudentBox.innerHTML = `
                <div class="flex justify-center items-center">
                    <img src="${value?.avatar}" alt="" class="h-[70px] w-[70px] rounded-full object-cover">
                </div>
                <div class="flex flex-col gap-[0] p-[5px]">
                    <p class="text-[13px] opacity-40 fon-[400]">F.I.SH</p>
                    <h1 class="fullName">${value?.name} ${value?.surname}</h1>
                </div>
                <hr>
                <div class="flex flex-col gap-[0] p-[5px]">
                    <p class="text-[13px] opacity-40 fon-[400]">Raqam</p>
                    <h1>${value?.phoneNum}</h1>
                </div>
                <div class="flex justify-between items-center gap-[20px]">
                    <button
                        class="studentDeleteButton w-full p-[8px] border border-red-500 text-red-500 rounded-md hover:bg-red-400 hover:text-white active:scale-[.98] transition-colors duration-[.2s]"
                        data-id="${value.id}">
                        <i class="bx bx-trash"></i>
                    </button>
                    <button
                        class="editButton w-full p-[8px] border border-blue-500 text-blue-500 rounded-md hover:bg-blue-400 hover:text-white active:scale-[.98] transition-colors duration-[.2s]"
                        data-id="${value.id}">
                        <i class="bx bx-edit"></i>
                    </button>
                </div>
            `

            editStudentAppendDiv.append(editStudentBox)
        })

        // Delete
        const studentDeleteButton = document.querySelectorAll(
            ".studentDeleteButton"
        )
        const deletingStudentModal = document.getElementById(
            "deletingStudentModal"
        )
        const deletingStudentName = document.getElementById(
            "deletingStudentName"
        )
        const studentYesBtn = document.getElementById("studentYesBtn")
        const studentNoBtn = document.getElementById("studentNoBtn")

        let studentIdToDelete = null

        studentDeleteButton.forEach((button) => {
            button.addEventListener("click", () => {
                studentIdToDelete = button.getAttribute("data-id")
                deletingStudentModal.style.display = "flex"

                const studentName =
                    button.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.querySelector(
                        "h1"
                    ).textContent
                deletingStudentName.textContent = studentName
            })
        })

        studentYesBtn.addEventListener("click", () => {
            if (studentIdToDelete) {
                fetchApi({
                    url: `users/${studentIdToDelete}`,
                    method: "DELETE",
                })
                    .then(() => {
                        deletingStudentModal.style.display = "none"
                        notyf.success("O'quvchi o'chirildi")
                    })
                    .catch(() => {
                        deletingStudentModal.style.display = "none"
                        notyf.error("Xatolik yuz berdi")
                    })
            }
        })

        studentNoBtn.addEventListener("click", () => {
            deletingStudentModal.style.display = "none"
            studentIdToDelete = null
        })

        // Edit
        const editButtons = document.querySelectorAll(".editButton")
        editButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const userId = button.getAttribute("data-id")
                const userData = students.find(
                    (student) => student.id == userId
                )

                // Modalni to'ldirish
                editStudentModalFormName.value = userData.name
                editStudentModalFormSurname.value = userData.surname
                editStudentModalFormUsername.value = userData.username
                editStudentModalFormPassword.value = userData.password
                editStudentModalFormPhone.value = userData.phoneNum
                editStudentModalFormParentPhone.value = userData.parentsPhoneNum

                // Modalni ochish
                editStudentModal.style.display = "flex"

                // Modalni yopish
                closeEditStudentModal.addEventListener("click", () => {
                    editStudentModal.style.display = "none"
                })

                // Username tekshirish
                editStudentModalFormUsername.addEventListener(
                    "input",
                    async () => {
                        const username =
                            editStudentModalFormUsername.value.trim()
                        const isUsernameTaken = await checkIfUsernameExists(
                            username,
                            userId
                        )

                        if (isUsernameTaken) {
                            editStudentModalFormUsername.classList.add(
                                "border-red-500"
                            )
                            notyf.error("Maxfiy so'z ishlatilingan")
                        } else {
                            editStudentModalFormUsername.classList.remove(
                                "border-red-500"
                            )
                        }
                    }
                )

                // Formani yuborish
                editStudentModalForm.addEventListener("submit", async (e) => {
                    e.preventDefault()

                    const username = editStudentModalFormUsername.value.trim()
                    const isUsernameTaken = await checkIfUsernameExists(
                        username,
                        userId
                    )

                    if (isUsernameTaken) {
                        editStudentModalFormUsername.classList.add(
                            "border-red-500"
                        )
                        notyf.error("Maxfiy so'z ishlatilingan")
                        return
                    }

                    const updatedData = {
                        name: editStudentModalFormName.value.trim(),
                        surname: editStudentModalFormSurname.value.trim(),
                        username: editStudentModalFormUsername.value.trim(),
                        password: editStudentModalFormPassword.value.trim(),
                        phoneNum: editStudentModalFormPhone.value.trim(),
                        parentsPhoneNum:
                            editStudentModalFormParentPhone.value.trim(),
                    }

                    fetchApi({
                        url: `users/${userId}`,
                        method: "PUT",
                        data: JSON.stringify(updatedData),
                    })
                        .then(() => {
                            editStudentModal.style.display = "none"
                            notyf.success("O'quvchi tahrirlandi")
                        })
                        .catch(() => {
                            notyf.error("Xatolik yuz berdi")
                        })
                })
            })
        })
    })
    .catch((err) => console.log(err))

const getMonthNameUZB = (month) => {
    const months = [
        "Yanvar",
        "Fevral",
        "Mart",
        "Aprel",
        "May",
        "Iyun",
        "Iyul",
        "Avgust",
        "Sentabr",
        "Oktabr",
        "Noyabr",
        "Dekabr",
    ]
    return months[month - 1] || "month"
}

// const sendPaymentInformationToTelegram = (userName, userSurname, month) => {
//     const BOT_TOKEN = "7988582606:AAE01HqFOtdOzoqwuRxXJ-V8czGATC84A58"
//     const CHAT_ID = "-1002196603250"

//     const message = `${userName} ${userSurname} : ${getMonthNameUZB(
//         month
//     )} oyi uchun to'lov qildi ✅\n\nBugungi sana: ${formatDate(new Date())}`

//     fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             chat_id: CHAT_ID,
//             text: message,
//         }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             console.log("Xabar Telegramga yuborildi:", data)
//         })
//         .catch((err) => {
//             console.error("Telegramga xabar yuborishda xatolik:", err)
//         })
// }

// const resetPaymentsOnFirstDay = async () => {
//     const now = new Date()

//     if (now.getDate() === 1 && now.getHours() === 0) {
//         try {
//             const students = await fetchApi({url: "users"})
//             const filteredStudents = students.filter(
//                 (user) => user.role === "student"
//             )

//             const resetPromises = filteredStudents.map((student) =>
//                 fetchApi({
//                     url: `users/${student.id}`,
//                     method: "PUT",
//                     data: JSON.stringify({payment: false}),
//                 })
//             )

//             await Promise.all(resetPromises)
//             console.log("payment: false")
//         } catch (err) {
//             console.error("To'lovlarni qayta tiklashda xatolik:", err)
//         }
//     }

//     const nextDayStart = new Date(
//         now.getFullYear(),
//         now.getMonth(),
//         now.getDate() + 1,
//         0,
//         0,
//         0
//     ).getTime()

//     const timeUntilMidnight = nextDayStart - now.getTime()
//     setTimeout(resetPaymentsOnFirstDay, timeUntilMidnight)
// }

// resetPaymentsOnFirstDay()

// const handlePayment = async (userId, students) => {
//     try {
//         await fetchApi({
//             url: `users/${userId}`,
//             method: "PUT",
//             data: JSON.stringify({payment: true}),
//         })

//         const user = students.find((student) => student.id === userId)
//         const currentMonth = new Date().getMonth() + 1

//         sendPaymentInformationToTelegram(user.name, user.surname, currentMonth)
//         notyf.success("Muvaffaqiyatli to'lov")
//         setTimeout(() => location.reload(), 2500)
//     } catch (err) {
//         notyf.error("Xatolik yuz berdi")
//     }
// }

const paymentControlUsersDiv = document.getElementById("paymentControlUsersDiv")
const paymentConfirmModal = document.getElementById("paymentConfirmModal")
const paymentYesBtn = document.getElementById("paymentYesBtn")
const paymentNoBtn = document.getElementById("paymentNoBtn")
const currentMonthName = document.getElementById("currentMonthName")

// Joriy oy nomini ko'rsatish
const montName = new Date().getMonth() + 1
currentMonthName.textContent = getMonthNameUZB(montName)

let payedUserId = null

// To'lovlarni ko'rsatish
fetchApi({url: "users"}).then((students) => {
    const filteredStudents = students.filter((user) => user.role === "student")

    if (filteredStudents) {
        filteredStudents.forEach((value) => {
            const paymentControlUser = document.createElement("div")
            paymentControlUser.classList.add("paymentControlUser")

            paymentControlUser.innerHTML = `
                <div class="text-gray-500 flex justify-start items-center">
                    <p class="text-[17px]">${value?.name} ${value?.surname}</p>
                </div>
                <div class="flex justify-center">
                    <i class="bx ${
                        value.payment
                            ? "bx-check text-green-500"
                            : "bx-x text-red-500"
                    } text-[35px]"></i>
                </div>
                <div class="flex justify-end">
                    <button class="paymentButton p-[10px] rounded-md ${
                        value?.payment
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-green-500"
                    } text-white active:scale-[.98]" data-id="${value?.id}" ${
                value?.payment ? "disabled" : ""
            }>
                        ${
                            value?.payment
                                ? "to'langan"
                                : "to'langan deb belgilash"
                        }
                    </button>
                </div>
            `

            paymentControlUsersDiv.append(paymentControlUser)
        })

        // To'lov tugmalariga event listener qo'shish
        const paymentButtons = document.querySelectorAll(".paymentButton")
        paymentButtons.forEach((button) => {
            button.addEventListener("click", () => {
                payedUserId = button.getAttribute("data-id")
                paymentConfirmModal.style.display = "flex"
            })
        })

        // To'lovni tasdiqlash
        paymentYesBtn.addEventListener("click", () => {
            if (payedUserId) {
                handlePayment(payedUserId, filteredStudents)
                paymentConfirmModal.style.display = "none"
            }
        })

        // To'lovni bekor qilish
        paymentNoBtn.addEventListener("click", () => {
            paymentConfirmModal.style.display = "none"
        })

        // Modalni yopish
        window.addEventListener("click", (event) => {
            if (event.target === paymentConfirmModal) {
                paymentConfirmModal.style.display = "none"
            }
        })
    }
})

// payment info --------------------------------------------------------------
const calculatePayments = (students, monthlyCourseFee) => {
    let collectedPayment = 0
    let unpaidPayment = 0

    students.forEach((student) => {
        if (student.payment) {
            collectedPayment += monthlyCourseFee
        } else {
            unpaidPayment += monthlyCourseFee
        }
    })

    const totalPayment = students.length * monthlyCourseFee

    return {totalPayment, collectedPayment, unpaidPayment}
}

const formatCurrency = (amount) => {
    return `${amount.toLocaleString().replace(/,/g, ".")} UZS`
}

const totalPaymentCourse = document.getElementById("totalPaymentCourse")
const collectedPaymentCourse = document.getElementById("collectedPaymentCourse")
const restPaymentCourse = document.getElementById("restPaymentCourse")
const monthlyPaymentPrice = document.getElementById("monthlyPaymentPrice")

const fetchAndDisplayPayments = async () => {
    try {
        const data = await fetchApi({url: "users"})
        const findMainAdmin = data.find((user) => user.role === "mainadmin")
        const monthlyCourseFee = findMainAdmin?.coursePrice

        if (monthlyCourseFee) {
            const students = await fetchApi({url: "users"})
            const filteredStudents = students.filter(
                (user) => user.role === "student"
            )

            const {totalPayment, collectedPayment, unpaidPayment} =
                calculatePayments(filteredStudents, monthlyCourseFee)

            totalPaymentCourse.textContent = formatCurrency(totalPayment)
            collectedPaymentCourse.textContent =
                formatCurrency(collectedPayment)
            restPaymentCourse.textContent = formatCurrency(unpaidPayment)
            monthlyPaymentPrice.textContent = formatCurrency(monthlyCourseFee)
        }
    } catch (err) {
        console.error("To'lovlarni yuklashda xatolik:", err)
    }
}

fetchAndDisplayPayments()

// self edit
const selfEditModal = document.getElementById("selfEditModal")
const closeSelfEditModal = document.getElementById("closeSelfEditModal")
const selfEditModalOpenBtn = document.getElementById("selfEditModalOpenBtn")
const selfEditModalForm = document.getElementById("selfEditModalForm")
const selfEditModalFormName = document.getElementById("selfEditModalFormName")
const selfEditModalFormSurname = document.getElementById(
    "selfEditModalFormSurname"
)
const selfEditModalFormUsername = document.getElementById(
    "selfEditModalFormUsername"
)
const selfEditModalFormPassword = document.getElementById(
    "selfEditModalFormPassword"
)

fetchApi({url: "users"})
    .then((data) => {
        selfEditModalOpenBtn.addEventListener("click", () => {
            selfEditModal.style.display = "flex"

            const userData = data.find((value) => value.id === user.id)

            selfEditModalFormName.value = userData.name
            selfEditModalFormSurname.value = userData.surname
            selfEditModalFormUsername.value = userData.username
            selfEditModalFormPassword.value = userData.password

            closeSelfEditModal.addEventListener("click", () => {
                selfEditModal.style.display = "none"
            })

            // Username tekshirish
            selfEditModalFormUsername.addEventListener("input", async () => {
                const username = selfEditModalFormUsername.value.trim()
                const isUsernameTaken = await checkIfUsernameExists(
                    username,
                    user.id
                )

                if (isUsernameTaken) {
                    selfEditModalFormUsername.classList.add("border-red-500")
                    notyf.error("Maxfiy so'z ishlatilingan")
                } else {
                    selfEditModalFormUsername.classList.remove("border-red-500")
                }
            })

            // Formani yuborish
            selfEditModalForm.addEventListener("submit", async (e) => {
                e.preventDefault()

                const username = selfEditModalFormUsername.value.trim()
                const isUsernameTaken = await checkIfUsernameExists(
                    username,
                    user.id
                )

                if (isUsernameTaken) {
                    selfEditModalFormUsername.classList.add("border-red-500")
                    notyf.error("Maxfiy so'z ishlatilingan")
                    return
                }

                const updatedData = {
                    name: selfEditModalFormName.value.trim(),
                    surname: selfEditModalFormSurname.value.trim(),
                    username: selfEditModalFormUsername.value.trim(),
                    password: selfEditModalFormPassword.value.trim(),
                }

                fetchApi({
                    url: `users/${user.id}`,
                    method: "PUT",
                    data: JSON.stringify(updatedData),
                })
                    .then(() => {
                        selfEditModal.style.display = "none"
                        notyf.success("Ma'lumotlar saqlandi")
                    })
                    .catch(() => {
                        selfEditModal.style.display = "none"
                        notyf.error("Xatolik yuz berdi")
                    })
            })
        })
    })
    .catch((err) => console.log(err))

// logout
const logoutBtn = document.getElementById("logoutBtn")
const logoutModal = document.getElementById("logoutModal")
const yesLogout = document.getElementById("yesLogout")
const noLogout = document.getElementById("noLogout")

logoutBtn.addEventListener("click", () => {
    logoutModal.style.display = "flex"
})

yesLogout.addEventListener("click", () => {
    localStorage.removeItem("user")
    window.location.href = "../index.html"
})

noLogout.addEventListener("click", () => {
    logoutModal.style.display = "none"
})

window.addEventListener("click", (event) => {
    if (event.target === logoutModal) {
        logoutModal.style.display = "none"
    }
})
