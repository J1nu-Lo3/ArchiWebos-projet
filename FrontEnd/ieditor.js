const gallery = document.querySelector(".gallery");

let allWorks = [];

// fonction fecth pour la gallerie
function fetchWorks() {
  return fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .catch((err) => console.error("Erreur :", err));
}

// fonction pour afficher les photos de la gallerie
function displayWorks(works) {
  for (let work of works) {
    const figure = document.createElement("figure");
    figure.dataset.category = work.categoryId;
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    img.loading = "lazy";

    const caption = document.createElement("figcaption");
    caption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  }
}
// Editor
let editor = document.getElementById("editor");
let editorOverlay = document.getElementById("editor-overlay");
let editorClose = document.querySelector(".editor-close");
let editBtn = document.querySelector(".edit-btn");
let editorGallery = document.querySelector(".editor-gallery");

// Ouvrir l'editor
editBtn.addEventListener("click", function () {
  editor.classList.remove("hidden");
  editorOverlay.classList.remove("hidden");
  fillEditorGallery();
});

// Fermer l'editor
editorClose.addEventListener("click", closeEditor);
editorOverlay.addEventListener("click", closeEditor);

function closeEditor() {
  editor.classList.add("hidden");
  editorOverlay.classList.add("hidden");
}

// Afficher les images dans l'editor
function fillEditorGallery() {
  editorGallery.innerHTML = "";

  for (let work of allWorks) {
    let img = document.createElement("img");
    img.src = work.imageUrl;
    editorGallery.appendChild(img);
  }
}

// Lancement du script
fetchWorks().then((works) => {
  allWorks = works;
  displayWorks(works);
});
