let slideIndex = 0;
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");

    function showSlide(n) {
        slides.forEach((slide, index) => {
            slide.classList.remove("active");
            dots[index].classList.remove("active");
        });

        slides[n].classList.add("active");
        dots[n].classList.add("active");
    }

    function changeSlide(n) {
        slideIndex += n;
        if (slideIndex >= slides.length) slideIndex = 0;
        if (slideIndex < 0) slideIndex = slides.length - 1;
        showSlide(slideIndex);
    }

    function currentSlide(n) {
        slideIndex = n - 1;
        showSlide(slideIndex);
    }

    // Défilement automatique
    setInterval(() => changeSlide(1), 5000);

    showSlide(slideIndex);