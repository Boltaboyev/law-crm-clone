import {useFetch} from "./utils/asp.module/moduleA/base.js"
const fetchApi = useFetch()

const user = JSON.parse(localStorage.getItem("user"))

if (!user || user.role !== "teacher") {
    const redirectPath = user ? `../pages/${user.role}.html` : "../index.html"
    window.location.href = redirectPath
}

// toast
const notyf = new Notyf({
    position: {
        x: "right",
        y: "top",
    },
    dismissible: true,
})

// greeting receptionist by name
const teacherName = document.getElementById("teacherName")
teacherName.innerHTML = `${user.name}`

// section active functions
const buttons = document.querySelectorAll(".sectionBtn")
const sectionsTeacher = document.querySelectorAll(".sectionsTeacher")
const savedSection = localStorage.getItem("activeTeacherSection")

sectionsTeacher.forEach((section, index) => {
    if (savedSection) {
        if (section.id === savedSection) {
            section.style.display = "flex"
            buttons[index].classList.add("teacherActiveBtn")
        } else {
            section.style.display = "none"
        }
    } else {
        if (index === 0) {
            section.style.display = "flex"
            buttons[index].classList.add("teacherActiveBtn")
        } else {
            section.style.display = "none"
        }
    }
})

buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        sectionsTeacher.forEach((section) => (section.style.display = "none"))
        buttons.forEach((btn) => btn.classList.remove("teacherActiveBtn"))

        sectionsTeacher[index].style.display = "flex"
        button.classList.add("teacherActiveBtn")

        localStorage.setItem("activeTeacherSection", sectionsTeacher[index].id)
    })
})

// daily attendance -----------------------------------------------------------------------------------
const saveAttendanceBtn = document.getElementById("saveAttendanceBtn")
const restartAttendanceBtn = document.getElementById("restartAttendance")
const appendStudentsAttendance = document.getElementById(
    "appendStudentsAttendance"
)

// // Telegram Bot configuration
// const TELEGRAM_BOT_TOKEN = "7893200050:AAE0-XMo5QxfSxk-2-tOoO4x06YctIq_TMk"
// const CHAT_ID = "-1002333796248"
// const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

// const sendTelegramMessage = async (message) => {
//     try {
//         await fetch(
//             `${TELEGRAM_URL}?chat_id=${CHAT_ID}&text=${encodeURIComponent(
//                 message
//             )}`
//         )
//     } catch (error) {
//         console.error("Error sending message to Telegram:", error)
//     }
// }

// Check if any checkbox is checked
const checkCheckboxes = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
    const anyChecked = Array.from(checkboxes).some(
        (checkbox) => checkbox.checked
    )
    saveAttendanceBtn.disabled = !anyChecked // Disable button if no checkbox is checked
    saveAttendanceBtn.style.cursor = anyChecked ? "pointer" : "not-allowed"
    saveAttendanceBtn.style.opacity = anyChecked ? "1" : ".6"

    restartAttendanceBtn.disabled = !anyChecked // Disable button if no checkbox is checked
    restartAttendanceBtn.style.cursor = anyChecked ? "pointer" : "not-allowed"
    restartAttendanceBtn.style.opacity = anyChecked ? "1" : ".6"
}

// Studentlarni yuklash
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
                            value?.name
                        } ${value?.surname}</div>
                    </div>
                </th>
                <td class="pr-[40px] text-end"> 
                    <label class="inline-flex items-center cursor-pointer" for="${
                        value.id
                    }">
                        <input type="checkbox" class="sr-only peer" id="${
                            value.id
                        }" ${value.attend ? "checked" : ""}>
                        <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600 dark:peer-checked:bg-teal-600"></div>
                    </label>
                </td>
            `
            appendStudentsAttendance.append(tableRow)
        })

        // Initially check the checkboxes to set the button state
        checkCheckboxes()

        // Event listener for when any checkbox changes
        appendStudentsAttendance.addEventListener("change", checkCheckboxes)

        // saveAttendanceBtn.addEventListener("click", async () => {
        //     const attendanceUpdates = await Promise.all(
        //         students.map(async (student) => {
        //             const checkbox = document.getElementById(student.id)
        //             const newAttend = checkbox.checked

        //             if (!newAttend) {
        //                 return {id: student.id, attend: newAttend}
        //             }

        //             const studentData = await fetchApi({
        //                 url: `users/${student.id}`,
        //             })

        //             const currentCoins = studentData.coin || 0
        //             const currentXp = studentData.xp || 0
        //             return {
        //                 id: student.id,
        //                 attend: newAttend,
        //                 coin: currentCoins + 5, // davomat uchun coin miqdorini belgilash
        //                 xp: currentXp + 2,
        //             }
        //         })
        //     )

        //     try {
        //         const currentDate = new Date()
        //         const monthName = currentDate.toLocaleString("default", {
        //             month: "long",
        //         })
        //         let attendanceMessage = `#${monthName} ${"\n"} DAVOMAT\n\n`

        //         for (let i = 0; i < attendanceUpdates.length; i++) {
        //             const update = attendanceUpdates[i]
        //             await fetchApi({
        //                 url: `users/${update.id}`,
        //                 method: "PUT",
        //                 data: JSON.stringify(update),
        //             })

        //             const student = students.find(
        //                 (student) => student.id === update.id
        //             )
        //             attendanceMessage += `${i + 1}) ${student.name} ${
        //                 student.surname
        //             } : ${update.attend ? "✅" : "❌"}\n\n`
        //         }

        //         attendanceMessage +=
        //             "Bugungi sana: " + currentDate.toLocaleDateString("en-GB")

        //         notyf.success("Davomat saqlandi")

        //         await sendTelegramMessage(attendanceMessage)
        //     } catch (err) {
        //         notyf.error("Xatolik yuz berdi")

        //         console.error(err)
        //     }
        // })
    })
    .catch(console.error)

restartAttendanceBtn.addEventListener("click", async () => {
    try {
        checkCheckboxes()
        const students = await fetchApi({url: "users"})
        const studentList = students.filter((user) => user.role === "student")

        for (const student of studentList) {
            await fetchApi({
                url: `users/${student.id}`,
                method: "PUT",
                data: JSON.stringify({attend: false}),
            })

            const checkbox = document.getElementById(student.id)
            if (checkbox) {
                checkbox.checked = false
            }
        }

        notyf.success("Davomat qayta tiklandi")
    } catch (err) {
        notyf.error("Xatolik yuz berdi")

        console.error("Xatolik: ", err)
    }
})

// Add coin -----------------------------------------------------------------------------------
const saveCoinsBtn = document.getElementById("saveCoinsBtn")
const appendStudentsCoinControl = document.getElementById(
    "appendStudentsCoinControl"
)

// Ball qiymatlari
const ballValues = {
    0: 0,
    2: 10,
    3: 15,
    4: 20,
    5: 30,
}

// XP qiymatlari
const xpValues = {
    0: 0,
    2: 2,
    3: 3,
    4: 5,
    5: 8,
}

// Studentlarni yuklash
fetchApi({url: "users"})
    .then((data) => {
        const students = data.filter(
            (user) => user.role === "student" && user.attend === true
        )

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
                            value?.name
                        } ${value?.surname}</div>
                    </div>
                </th>
                <td class="pr-[40px] text-end">
                    <div class="flex justify-end items-center gap-[5px]" data-student-id="${
                        value.id
                    }">
                        ${[0, 2, 3, 4, 5]
                            .map(
                                (ball) => `
                                <div id="ball-${ball}-${
                                    value.id
                                }" class="ball flex justify-center items-center select-none h-[25px] w-[25px] active:scale-[.98] rounded-md bg-${
                                    ball === 0
                                        ? "gray"
                                        : ball === 2
                                        ? "red"
                                        : ball === 3
                                        ? "yellow"
                                        : ball === 4
                                        ? "blue"
                                        : "green"
                                }-500 text-white font-medium cursor-pointer opacity-40 hover:opacity-100">
                                    ${ball}
                                </div>`
                            )
                            .join("")}
                    </div>
                </td>
            `
            appendStudentsCoinControl.append(tableRow)
        })

        // Ball div'lariga click event listener qo'shish
        appendStudentsCoinControl.addEventListener("click", (event) => {
            if (event.target.classList.contains("ball")) {
                const studentId = event.target
                    .closest("div[data-student-id]")
                    .getAttribute("data-student-id")

                // Avvalgi ballni activeBalldan chiqarish
                const previousActiveBall = document.querySelector(
                    `#appendStudentsCoinControl div[data-student-id="${studentId}"] .activeBall`
                )
                if (previousActiveBall) {
                    previousActiveBall.classList.remove("activeBall")
                }

                // Tanlangan ballga activeBall klassini qo'shish
                event.target.classList.add("activeBall")

                // Qizil borderni olib tashlash
                const studentRow = event.target.closest("tr")
                studentRow.style.border = ""
                studentRow.classList.remove("!bg-red-100")
            }
        })

        // Save button bosilganda coin va xp larni yangilash
        saveCoinsBtn.addEventListener("click", async () => {
            let allBallsAssigned = true // Barcha baholarni tekshirish

            const attendanceUpdates = await Promise.all(
                students.map(async (student) => {
                    // Ballni olish
                    const selectedBallElement = document.querySelector(
                        `#appendStudentsCoinControl div[data-student-id="${student.id}"] .activeBall`
                    )
                    if (!selectedBallElement) {
                        allBallsAssigned = false // Agar biron ball qo'yilmasa
                        const studentRow = document
                            .querySelector(
                                `#appendStudentsCoinControl div[data-student-id="${student.id}"]`
                            )
                            .closest("tr")
                        studentRow.style.borderColor = "red"
                        studentRow.classList.add("!bg-red-100") // Attendance row uchun qizil border qo'yish
                        return null // Ball tanlanmagan bo'lsa, keyingi studentga o'tish
                    }

                    const selectedBallValue = parseInt(
                        selectedBallElement.innerText
                    )

                    // Ballga qarab coin va xp larni yangilash
                    const coinsToAdd = ballValues[selectedBallValue] || 0
                    const xpToAdd = xpValues[selectedBallValue] || 0

                    const studentData = await fetchApi({
                        url: `users/${student.id}`,
                    })
                    const currentCoins = studentData.coin || 0
                    const currentXp = studentData.xp || 0

                    // Studentni yangilash
                    return {
                        id: student.id,
                        coin: currentCoins + coinsToAdd,
                        xp: currentXp + xpToAdd,
                    }
                })
            )

            if (!allBallsAssigned) {
                notyf.error("Hammani baholang !")
                return
            }

            try {
                // O'quvchilarni yangilash
                for (const update of attendanceUpdates) {
                    if (update) {
                        await fetchApi({
                            url: `users/${update.id}`,
                            method: "PUT",
                            data: JSON.stringify(update),
                        })
                    }
                }

                notyf.success("Baho qo'yildi")

                // Ballar va ularning stilini qayta tiklash
                students.forEach((student) => {
                    const balls = document.querySelectorAll(
                        `#appendStudentsCoinControl div[data-student-id="${student.id}"] .ball`
                    )
                    balls.forEach((ball) => {
                        ball.classList.remove("activeBall")
                    })
                    // Qizil borderni olib tashlash
                    const studentRow = document
                        .querySelector(
                            `#appendStudentsCoinControl div[data-student-id="${student.id}"]`
                        )
                        .closest("tr")
                    studentRow.style.border = ""
                    studentRow.classList.remove("!bg-red-100")
                })
            } catch (err) {
                notyf.error("Xatolik yuz berdi")
                console.error(err)
            }
        })
    })
    .catch(console.error)

// score info modal
const scoreInfoOpen = document.getElementById("scoreInfoOpen")
const scoreInfo = document.getElementById("scoreInfo")
const closeScoreInfo = document.getElementById("closeScoreInfo")

scoreInfoOpen.addEventListener("click", (event) => {
    event.stopPropagation()
    scoreInfo.classList.toggle("hidden")
    scoreInfo.classList.toggle("flex")
})
closeScoreInfo.addEventListener("click", () => {
    scoreInfo.classList.remove("flex")
    scoreInfo.classList.add("hidden")
})

document.addEventListener("click", (event) => {
    if (event.target !== scoreInfoOpen && event.target == scoreInfo) {
        scoreInfo.classList.add("hidden")
        scoreInfo.classList.remove("flex")
    }
})

// students rank
const appendStudentsRank = document.getElementById("appendStudentsRank")
fetchApi({url: "users"})
    .then((data) => {
        const students = data.filter((user) => user.role === "student")
        students.sort((a, b) => (b.xp || 0) - (a.xp || 0))

        students.forEach((value, index) => {
            let tableRow = document.createElement("div")
            tableRow.classList.add("rankTableRow")

            // Add background color for top 3 students
            if (index === 0) {
                tableRow.classList.add("bg-yellow-200") // Gold for 1st place
            } else if (index === 1) {
                tableRow.classList.add("bg-gray-200") // Silver for 2nd place
            } else if (index === 2) {
                tableRow.classList.add("bg-orange-200") // Bronze for 3rd place
            }

            tableRow.innerHTML = `
                <div scope="row" class="flex items-center justify-start gap-[10px] text-gray-900 whitespace-nowrap dark:text-white">
                    <img class="w-10 h-10 rounded-full" src=${
                        value?.avatar
                    } alt="">
                    <div>
                        <div class="text-primary font-semibold">${
                            value?.name
                        } ${value?.surname}</div>
                    </div>
                </div>
                <div class="flex justify-center items-center">
                    <h1 class="font-medium">${
                        value.xp || 0
                    }</h1> <!-- Display coins -->
                </div>
                <div class="flex justify-end items-center">
                    <h1 class="text-[20px] font-bold">${
                        index + 1
                    }</h1> <!-- Display rank -->
                </div>
            `
            appendStudentsRank.append(tableRow)
        })
    })
    .catch(console.error)

// add home-task
const homeTaskForm = document.getElementById("homeTaskForm")
const homeTaskFormTextArea = document.getElementById("homeTaskFormTextArea")
const lastHomeTask = document.getElementById("lastHomeTask")

const loadHomeTask = async () => {
    try {
        const tasks = await fetchApi({url: "hometask"})
        if (tasks.length > 0) {
            lastHomeTask.innerText = tasks[0].task
        } else {
            lastHomeTask.innerText = "Ma'lumot yo'q"
        }
    } catch (error) {
        console.error("Xatolik yuz berdi:", error)
    }
}

loadHomeTask()

homeTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const taskText = homeTaskFormTextArea.value.trim()
    if (!taskText) {
        homeTaskFormTextArea.style.borderColor = "red"
        return
    }

    try {
        const tasks = await fetchApi({url: "hometask"})

        if (tasks.length > 0) {
            await fetchApi({
                url: `hometask/${tasks[0].id}`,
                method: "PUT",
                data: JSON.stringify({task: taskText}),
            })
        } else {
            await fetchApi({
                url: "hometask",
                method: "POST",
                data: JSON.stringify({task: taskText}),
            })
        }

        lastHomeTask.innerText = taskText
        homeTaskFormTextArea.value = ""
        homeTaskFormTextArea.style.borderColor = ""
        notyf.success("Uy ishi saqlandi")
    } catch (error) {
        console.error("Xatolik yuz berdi:", error)
        notyf.error("Xatolik yuz berdi")
    }
})

// edit teacher profile
const editProfileBtn = document.getElementById("editProfileBtn")
const closeEditTeacherModal = document.getElementById("closeEditTeacherModal")
const editTeacherModal = document.getElementById("editTeacherModal")
const editTeacherModalForm = document.getElementById("editTeacherModalForm")
const changeAvatar = document.getElementById("changeAvatar") // input type file
const currentAvatarImg = document.getElementById("currentAvatarImg")
const saveEditBtn = document.getElementById("saveEditBtn")
const name = document.getElementById("name")
const surname = document.getElementById("surname")
const phoneNum = document.getElementById("phoneNum")

let teacher = {...user}

currentAvatarImg.src = teacher.avatar
name.innerHTML = teacher.name
surname.innerHTML = teacher.surname
phoneNum.innerHTML = teacher.phoneNum

editProfileBtn.addEventListener("click", () => {
    editTeacherModal.classList.remove("hidden")
    editTeacherModal.classList.add("flex")
    disableSaveButton()
})

const closeModal = () => {
    editTeacherModal.classList.add("hidden")
    editTeacherModal.classList.remove("flex")
}

closeEditTeacherModal.addEventListener("click", closeModal)

window.addEventListener("click", (e) => {
    if (e.target === editTeacherModal) {
        closeModal()
    }
})

changeAvatar.addEventListener("change", (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            currentAvatarImg.src = e.target.result
            currentAvatarImg.classList.add("border-4", "border-green-500")
            enableSaveButton()
        }
        reader.readAsDataURL(file)
    }
})

const enableSaveButton = () => {
    saveEditBtn.disabled = false
    saveEditBtn.classList.remove(
        "opacity-50",
        "cursor-not-allowed",
        "hover:opacity-50"
    )
}

const disableSaveButton = () => {
    saveEditBtn.disabled = true
    saveEditBtn.classList.add(
        "opacity-50",
        "cursor-not-allowed",
        "hover:opacity-50"
    )
}

editTeacherModalForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    try {
        const updatedData = {
            avatar: currentAvatarImg.src,
        }

        await fetchApi({
            url: `users/${teacher.id}`,
            method: "PUT",
            data: JSON.stringify(updatedData),
        })

        teacher.avatar = updatedData.avatar
        currentAvatarImg.classList.remove("border-4", "border-green-500")
        localStorage.setItem("user", JSON.stringify(teacher))
        notyf.success("Ma'lumotlar saqlandi")
        closeModal()
    } catch (error) {
        notyf.error("Xatolik yuz berdi")
        console.error(error)
    }
})

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
