/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/*.{html,js}", "./js/*.{html,js}", "./*.html"],
    theme: {
        extend: {
            colors: {
                primary: "#1f2937",
                tx: "#1f1f1f",
            },
            height: {
                "screen-minus-80": "calc(100vh - 80px)",
            },
        },
    },
    plugins: [],
}
