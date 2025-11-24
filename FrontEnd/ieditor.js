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
// Editor
const editor = document.getElementById("editor");
const editorOverlay = document.getElementById("editor-overlay");
const editorClose = document.querySelector(".editor-close");
const editBtn = document.querySelector(".edit-btn");
const editorGallery = document.querySelector(".editor-gallery");

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
    let item = document.createElement("div");
    item.classList.add("editor-item");
    item.dataset.id = work.id;

    // Image
    let img = document.createElement("img");
    img.src = work.imageUrl;

    // Bouton poubelle
    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    // Action supprimer
    deleteBtn.addEventListener("click", function () {
      deleteWork(work.id, item);
    });

    item.appendChild(img);
    item.appendChild(deleteBtn);
    editorGallery.appendChild(item);
  }
}

// Supprimer
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

// Lancement du script
fetchWorks().then((works) => {
  allWorks = works;
  displayWorks(works);
});

//logout
const logoutBtn = document.getElementById("logout");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();

    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    window.location.href = "login.html";
  });
}
