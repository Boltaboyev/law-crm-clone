const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "support") {
    const redirectPath = user ? `../pages/${user.role}.html` : "../index.html";
    window.location.href = redirectPath;
}