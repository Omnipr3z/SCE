document.addEventListener("DOMContentLoaded", function () {
    const mask = document.querySelector("#maskYoutube");
    const iframe = document.querySelector("#youtubeBox iframe");
    mask.style.

    mask.addEventListener("click", function () {
        mask.style.display = "none"; // Cache le masque
        const videoSrc = iframe.src;
        iframe.src = videoSrc + "&autoplay=1"; // Ajoute autoplay
    });
});
