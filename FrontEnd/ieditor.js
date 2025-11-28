const gallery = document.querySelector(".gallery");
let allWorks = [];

const token = localStorage.getItem("token");

// fonction fecth pour la gallerie
function fetchWorks() {
  return fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .catch((err) => console.error("Erreur :", err));
}

// fonction pour afficher les photos de la gallerie
function displayWorks(works) {
  gallery.innerHTML = "";
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
// editor > supprimer photo
const editor = document.getElementById("editor");
const editorOverlay = document.getElementById("editor-overlay");
const editorClose = document.querySelector(".editor-close");
const editBtn = document.querySelector(".edit-btn");
const editorGallery = document.querySelector(".editor-gallery");

// ouvrir l'editor
editBtn.addEventListener("click", function () {
  editor.classList.remove("hidden");
  editorOverlay.classList.remove("hidden");
  fillEditorGallery();
});

// fermer l'editor
editorClose.addEventListener("click", closeEditor);
editorOverlay.addEventListener("click", closeEditor);

function closeEditor() {
  editor.classList.add("hidden");
  editorOverlay.classList.add("hidden");
}

// afficher les images dans l'editor
function fillEditorGallery() {
  editorGallery.innerHTML = "";

  for (let work of allWorks) {
    let item = document.createElement("div");
    item.classList.add("editor-item");
    item.dataset.id = work.id;

    let img = document.createElement("img");
    img.src = work.imageUrl;

    // btn poubelle
    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    // supprimer
    deleteBtn.addEventListener("click", function () {
      deleteWork(work.id, item);
    });

    item.appendChild(img);
    item.appendChild(deleteBtn);
    editorGallery.appendChild(item);
  }
}

// function supprimer alert
function deleteWork(id, htmlElement) {
  if (!token) {
    alert("Vous devez être connecté pour supprimer une image.");
    return;
  }

  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Erreur suppression :", response.status);
        return;
      }

      htmlElement.remove();

      allWorks = allWorks.filter((work) => work.id !== id);

      displayWorks(allWorks);
    })
    .catch((err) => {
      console.error("Erreur réseau :", err);
    });
}

// editor > ajout photo
const editorAdd = document.getElementById("editor-add");
const addPhotoBtn = document.getElementById("add-photo-btn");
const editorAddClose = document.querySelector("#editor-add .editor-add-close");
const editorBack = document.getElementById("editor-back");

// ouvrir mondale ajout photo
addPhotoBtn.addEventListener("click", function () {
  editor.classList.add("hidden");
  editorAdd.classList.remove("hidden");
});

editorBack.addEventListener("click", function () {
  editorAdd.classList.add("hidden");
  editor.classList.remove("hidden");
});

// lancement du script
fetchWorks().then((works) => {
  allWorks = works;
  displayWorks(works);
});

editorAddClose.addEventListener("click", function () {
  editorAdd.classList.add("hidden");
  editorOverlay.classList.add("hidden");
});

const uploadBtn = document.getElementById("upload-btn");
const photoInput = document.getElementById("photo-input");
const uploadPreview = document.querySelector(".upload-preview");
const uploadPlaceholder = document.querySelector(".upload-placeholder");

// ouvrir input fichier
uploadBtn.addEventListener("click", () => photoInput.click());

// afficher l'aperçu
photoInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  uploadPreview.src = URL.createObjectURL(file);
  uploadPreview.classList.remove("hidden");
  uploadPlaceholder.classList.add("hidden");
});

//logout
const logoutBtn = document.getElementById("logout");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();

    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    window.location.href = "index.html";
  });
}
