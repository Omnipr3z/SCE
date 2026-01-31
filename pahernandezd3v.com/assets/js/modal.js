


document.addEventListener("DOMContentLoaded",  ()=> {

const modal = document.getElementById("pixelModal");
const modalBody = document.getElementById("modal-body");

const cantRegister = `
        <p class="error-form">Le service etant en maintenance l'enregistrement de nouveau comptes est bloqué pour le moment.</p>
`;

const openModal = (formContent) => {
    modalBody.innerHTML = formContent;
    modal.style.display = "flex";
    const closeBtn = document.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => modal.style.display = "none");
}

// Écouteurs d'événements pour les boutons
document.getElementById("connect_btn").addEventListener("click", () => openModal(cantRegister));
document.getElementById("register_btn").addEventListener("click", () => openModal(cantRegister));

});
