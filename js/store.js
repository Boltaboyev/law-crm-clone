import { useFetch } from "./utils/asp.module/moduleA/base.js";
const fetchApi = useFetch();

const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "student") {
    const redirectPath = user ? `../pages/${user.role}.html` : "../index.html";
    window.location.href = redirectPath;
}

const coinCount = document.getElementById("coinCount");
coinCount.innerHTML = user.coin;

const buyModal = document.getElementById("buyModal");
const yesBuy = document.getElementById("yesBuy");
const noBuy = document.getElementById("noBuy");

const buttons = document.querySelectorAll(".buyBtn");

buttons.forEach((button) => {
    const priceElement = button.parentElement.querySelector(".text-primary");
    if (priceElement) {
        const price = parseInt(priceElement.textContent.replace(/\D/g, ""), 10);

        if (user.coin < price) {
            button.classList.remove("bg-green-500", "hover:bg-green-600");
            button.classList.add("bg-gray-400", "cursor-not-allowed");
            button.disabled = true;
            button.textContent = "coin yetmaydi";
        }
    }

    button.addEventListener("click", () => {
        buyModal.style.display = "flex";
    });
});

yesBuy.addEventListener("click", async () => {
    // Sovga narxini olish uchun tugma orqali narxni olish
    const priceElement = document.querySelector(".buyBtn:enabled"); // faqat ishlashga yaroqli tugma
    const price = parseInt(priceElement.parentElement.querySelector(".text-primary").textContent.replace(/\D/g, ""), 10);

    try {
        // API so'rovi yuborish (masalan, sovga narxini olish)
        const response = await fetchApi(`users/${user.id}`);  // API endpointni o'zgartirishingiz mumkin
        const data = await response.json();
        
        // Sovganing narxini olish
        const giftPrice = data.giftPrice; // Sovganing narxini olish

        // Foydalanuvchining coinlarini ayirib tashlash
        if (user.coin >= giftPrice + price) {
            user.coin -= (giftPrice + price);
            localStorage.setItem("user", JSON.stringify(user)); // Yangilangan foydalanuvchi ma'lumotlarini saqlash

            // Coinlar ko'rsatilishini yangilash
            coinCount.innerHTML = user.coin;

            // Sovg'a va xarid muvaffaqiyatli amalga oshdi
            alert('Sovga va xarid muvaffaqiyatli amalga oshdi!');
        } else {
            alert('Sizda etarli coin yo\'q!');
        }
    } catch (error) {
        console.error('So\'rov yuborishda xato:', error);
        alert('So\'rov yuborishda xato yuz berdi.');
    }

    // Modalni yopish
    buyModal.style.display = "none";
});

noBuy.addEventListener("click", () => {
    buyModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === buyModal) {
        buyModal.style.display = "none";
    }
});
