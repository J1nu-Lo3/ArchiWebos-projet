document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  Object.defineProperty(window, "allWorks", {
    writable: true,
    value: window.allWorks || [],
  });

  // editor > supprimer photo
  const editor = document.getElementById("editor");
  const editorOverlay = document.getElementById("editor-overlay");
  const editorClose = document.querySelector(".editor-close");
  const editBtn = document.querySelector(".edit-btn");
  const editorGallery = document.querySelector(".editor-gallery");

  // ouvrir éditeur
  if (token && editBtn) {
    editBtn.addEventListener("click", () => {
      editor.classList.remove("hidden");
      editorOverlay.classList.remove("hidden");
      fillEditorGallery();
    });
  }

  // fermer éditeur
  if (editorClose) editorClose.addEventListener("click", closeEditor);
  if (editorOverlay) editorOverlay.addEventListener("click", closeEditor);

  function closeEditor() {
    editor.classList.add("hidden");
    editorOverlay.classList.add("hidden");
  }

  // afficher les images dans l'editor
  function fillEditorGallery() {
    editorGallery.innerHTML = "";

    for (let work of window.allWorks) {
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

        window.allWorks = window.allWorks.filter((work) => work.id !== id);

        displayWorks(window.allWorks);
      })
      .catch((err) => {
        console.error("Erreur réseau :", err);
      });
  }

  // ajout photo
  const editorAdd = document.getElementById("editor-add");
  const addPhotoBtn = document.getElementById("add-photo-btn");
  const editorAddClose = document.querySelector(
    "#editor-add .editor-add-close"
  );
  const editorBack = document.getElementById("editor-back");
  // ouvrir mondale ajout photo
  addPhotoBtn.addEventListener("click", function () {
    loadCategories();
    editor.classList.add("hidden");
    editorAdd.classList.remove("hidden");

    editorOverlay.classList.remove("hidden");
  });

  editorBack.addEventListener("click", function () {
    resetAddPhotoModal();
    editorAdd.classList.add("hidden");
    editor.classList.remove("hidden");
  });

  editorAddClose.addEventListener("click", function () {
    resetAddPhotoModal();
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
    checkFormValidity();
  });

  // ajout
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category-select");
  const validateBtn = document.getElementById("validate-photo");
  const addPhotoForm = document.getElementById("add-photo-form");

  // charger les catégories
  function loadCategories() {
    fetch("http://localhost:5678/api/categories")
      .then((res) => res.json())
      .then((categories) => {
        categorySelect.innerHTML = `
        <option value="" disabled selected></option>
      `;

        categories.forEach((cat) => {
          const option = document.createElement("option");
          option.value = cat.id;
          option.textContent = cat.name;
          categorySelect.appendChild(option);
        });
      })
      .catch((err) => console.error("Erreur chargement catégories :", err));
  }
  // reset complet de la modale
  function resetAddPhotoModal() {
    addPhotoForm.reset();

    categorySelect.value = "";

    uploadPreview.classList.add("hidden");
    uploadPreview.src = "";
    uploadPlaceholder.classList.remove("hidden");

    validateBtn.classList.add("disabled");
    validateBtn.classList.remove("enabled");
    validateBtn.style.cursor = "not-allowed";
  }

  function checkFormValidity() {
    const formIsValid =
      photoInput.files.length > 0 &&
      titleInput.value.trim() !== "" &&
      categorySelect.value !== "";

    validateBtn.classList.toggle("enabled", formIsValid);
    validateBtn.classList.toggle("disabled", !formIsValid);
    validateBtn.style.cursor = formIsValid ? "pointer" : "not-allowed";
  }

  titleInput.addEventListener("input", checkFormValidity);
  categorySelect.addEventListener("change", checkFormValidity);

  validateBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (!token) {
      alert("Vous devez être connecté pour ajouter une photo.");
      return;
    }

    if (validateBtn.classList.contains("disabled")) return;

    uploadNewWork().then((newWork) => {
      window.allWorks.push(newWork);
      displayWorks(window.allWorks);
      fillEditorGallery();

      resetAddPhotoModal();
      editorAdd.classList.add("hidden");
      editorOverlay.classList.add("hidden");
    });
  });

  function uploadNewWork() {
    const formData = new FormData();
    formData.append("image", photoInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    return fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error("Erreur upload :", err);
        throw err;
      });
  }

  // logout
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "index.html";
    });
  }
});
