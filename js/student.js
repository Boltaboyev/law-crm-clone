import {useFetch} from "./utils/asp.module/moduleA/base.js"
const fetchApi = useFetch()

const user = JSON.parse(localStorage.getItem("user"))

if (!user || user.role !== "student") {
    const redirectPath = user ? `../pages/${user.role}.html` : "../index.html"
    window.location.href = redirectPath
}

const sidebar = document.getElementById("sidebar")
const openSidebarBtn = document.getElementById("openSidebarpage")
const closeSidebarBtn = document.querySelector("#sidebar .bx-x")

openSidebarBtn.addEventListener("click", () => {
    sidebar.style.transition = ".3s"
    sidebar.style.left = "0px"
})

closeSidebarBtn.addEventListener("click", () => {
    sidebar.style.transition = ".3s"
    sidebar.style.left = "-100%"
})

const pages = document.querySelectorAll(".pages")
const buttons = document.querySelectorAll(".pageOpenBtn")

buttons.forEach((button, index) => {
    button.addEventListener("click", function () {
        pages.forEach((page) => (page.style.display = "none"))

        pages[index].style.display = "block"

        buttons.forEach((btn) => btn.classList.remove("text-yellow-400"))
        button.classList.add("text-yellow-400")
    })
})

pages.forEach((page, index) => {
    page.style.display = index === 0 ? "block" : "none"
})

// toast
const toast = document.getElementById("toast")
const showToast = (message, bgColor) => {
    toast.textContent = message
    toast.classList.add(bgColor)
    toast.style.bottom = "-100%"
    toast.style.transition = ".4s"

    setTimeout(() => {
        toast.style.bottom = "20px"
    }, 100)

    setTimeout(() => {
        toast.style.transition = ".4s"
        toast.style.bottom = "-100%"
    }, 2500)
}

// main page fetch

const sidebarMyAvatar = document.getElementById("sidebarMyAvatar")
const sidebarMyName = document.querySelectorAll(".sidebarMyName")
const sidebarMySurname = document.getElementById("sidebarMySurname")
const sidebarMyNumber = document.getElementById("sidebarMyNumber")
const myCoins = document.getElementById("myCoins")
const myXp = document.getElementById("myXp")
const paymentStatus = document.getElementById("paymentStatus")
const paymentIcon = document.getElementById("paymentIcon")
const myName = document.getElementById("myName")
const myAvatar = document.getElementById("myAvatar")
const joinDate = document.getElementById("joinDate")
const myPhoneNum = document.getElementById("myPhoneNum")
const parentsPhoneNum = document.getElementById("parentsPhoneNum")
const currentAvatar = document.getElementById("currentAvatar")

fetchApi({ url: "users" })
    .then((data) => {
        const studentUser = data.find((value) => value.role === "student" && value.id === user.id);

        if (studentUser) {
            sidebarMyAvatar.src = studentUser?.avatar;
            sidebarMyName.forEach((name) => (name.textContent = studentUser?.name));
            sidebarMySurname.textContent = studentUser?.surname;
            sidebarMyNumber.textContent = studentUser?.phoneNum;
            myName.textContent = `${studentUser?.name} ${studentUser?.surname}`;
            myAvatar.src = studentUser?.avatar;
            myCoins.textContent = studentUser.coin;
            myXp.textContent = studentUser.xp;
            paymentStatus.textContent = studentUser.payment ? "To'langan" : "To'lanmagan";
            paymentIcon.textContent = studentUser.payment ? "✅" : "❌";
            currentAvatar.src = studentUser.avatar;
            joinDate.textContent = studentUser.joinDate;
            myPhoneNum.textContent = studentUser.phoneNum;
            parentsPhoneNum.textContent = studentUser.parentsPhoneNum;
        } else {
            console.error("No student user found");
        }
    })
    .catch(console.error);

const homeworkTextContent = document.getElementById("homeworkTextContent")
const myRankOnGroup = document.getElementById("myRankOnGroup")
const appendMyTeachersBox = document.getElementById("appendMyTeachersBox")

// home tasks
fetchApi({url: "hometask"}).then((data) => {
    let hw = data[0].task
    homeworkTextContent.innerText = hw ? hw : "Ma'lumot yo'q"
})

// my rank
fetchApi({url: "users"})
    .then((data) => {
        const students = data.filter((user) => user.role === "student")
        students.sort((a, b) => (b.xp || 0) - (a.xp || 0))
        const myId = user.id
        const myRank = students.findIndex((student) => student.id === myId) + 1

        myRankOnGroup.textContent = myRank
    })
    .catch(console.error)

// my teachers
fetchApi({url: "users"})
    .then((data) => {
        const teachers = data.filter(
            (user) => user.role === "teacher" || user.role === "support"
        )

        teachers.forEach((value, index) => {
            const div = document.createElement("div")
            const isLast = index === teachers.length - 1
            div.innerHTML = `
                <div class="flex justify-between items-center ${
                    isLast ? "" : "pb-[10px]"
                }">
                    <img src="${
                        value?.avatar
                    }" alt="" class="h-[50px] w-[50px] object-cover rounded-full">
                    <div class="flex flex-col justify-center items-end gap-0">
                        <h1 class="text-[19px] font-bold">${value?.name} ${
                value?.surname
            }</h1>
                        <p class="text-[15px] text-gray-200 ">
                            ${
                                value?.role === "teacher"
                                    ? "asosiy o'qituvchi"
                                    : "yordamchi o'qituvchi"
                            }
                        </p>
                    </div>
                </div>
                ${isLast ? "" : '<hr class="opacity-20">'}
            `

            appendMyTeachersBox.appendChild(div)
        })
    })
    .catch(console.error)

// Rank page
const rankBox = document.querySelector(".rankBox")

fetchApi({url: "users"})
    .then((data) => {
        const students = data.filter((user) => user.role === "student")

        students.sort((a, b) => (b.xp || 0) - (a.xp || 0))

        const myId = user.id

        students.forEach((value, index) => {
            let div = document.createElement("div")

            let isMe = value.id === myId
            let bgColor = isMe ? "bg-green-300" : "bg-white text-primary"

            div.innerHTML = `
                    <div
                        class="relative flex text-primary justify-between items-center ${bgColor} pr-[10px] overflow-hidden h-[60px] rounded-2xl shadow-md border">
                        ${
                            index == 0
                                ? `<i class="fa-solid fa-crown absolute text-yellow-500 left-[42px] top-0 text-[20px]"></i>`
                                : ""
                        }

                        <div class="flex justify-start items-center gap-[5px] h-full">
                            <p class="w-[30px] flex justify-center bg-primary text-white items-center font-medium h-full border-r">${
                                index + 1
                            }</p>
                            <img src=${value?.avatar} alt="Avatar"
                                class="h-[35px] w-[35px] rounded-full object-cover border">
                            <p class="text-[15px] pl-1">${value?.name} ${
                value?.surname
            }</p>
                        </div>

                        <p class="pl-2 border-l text-[15px] flex justify-center items-center gap-[4px]"><span>${
                            value?.xp
                        }</span>
                            <i class="fa-solid fa-gem text-blue-400 text-[12px]"></i></p>
                    </div>
            `

            rankBox.appendChild(div)
        })
    })
    .catch(console.error)

// Profile page
const avatarChangeBtn = document.getElementById("avatarChangeBtn")
const openEditAvatarModal = document.getElementById("openEditAvatarModal")
const editAvatarModal = document.getElementById("editAvatarModal")
const closeEditAvatarModal = document.getElementById("closeEditAvatarModal")
const saveEditAvatarModal = document.getElementById("saveEditAvatarModal")

openEditAvatarModal.addEventListener("click", () => {
    editAvatarModal.classList.remove("hidden")
    editAvatarModal.classList.add("flex")
})

closeEditAvatarModal.addEventListener("click", () => {
    editAvatarModal.classList.add("hidden")
})

document.addEventListener("click", (e) => {
    if (e.target === editAvatarModal) {
        editAvatarModal.classList.remove("flex")
        editAvatarModal.classList.add("hidden")
    }
})

const logoutBtn = document.getElementById("logout")
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
