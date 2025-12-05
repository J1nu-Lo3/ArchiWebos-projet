// DOM
const gallery = document.querySelector(".gallery");
window.gallery = gallery; // ça c'est important pour IEDITOR.JS

const filtersContainer = document.querySelector(".categories-buttons");

window.allWorks = [];

// fetch works
function fetchWorks() {
  return fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .catch((err) => console.error("Erreur :", err));
}

// fetch categories
function fetchCategories() {
  return fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .catch((error) => console.error("Erreur fetch categories :", error));
}

// UI co/déco
function initAuthUI() {
  const token = localStorage.getItem("token");

  const editionBar = document.querySelector(".edition-bar");
  const editBtn = document.querySelector(".edit-btn");
  const logout = document.getElementById("logout");
  const login = document.getElementById("login");

  if (!editionBar || !editBtn || !logout || !login) return;

  if (token) {
    // mode connecté
    editionBar.style.display = "flex";
    editBtn.style.display = "flex";
    logout.style.display = "block";
    login.style.display = "none";

    filtersContainer.style.display = "none";
  } else {
    // mode visiteur
    editionBar.style.display = "none";
    editBtn.style.display = "none";
    logout.style.display = "none";
    login.style.display = "block";

    filtersContainer.style.display = "flex";
  }
}

// display gallery
function displayWorks(works) {
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.dataset.category = work.categoryId;

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const caption = document.createElement("figcaption");
    caption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}

// btn categories dynamique
function createFilterButtons(categories) {
  filtersContainer.innerHTML = "";

  const btnAll = document.createElement("button");
  btnAll.textContent = "Tous";
  btnAll.classList.add("active");

  btnAll.addEventListener("click", () => {
    setActiveButton(btnAll);
    filterGallery("all");
  });

  filtersContainer.appendChild(btnAll);

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;

    btn.addEventListener("click", () => {
      setActiveButton(btn);
      filterGallery(category.id);
    });

    filtersContainer.appendChild(btn);
  });
}

function setActiveButton(activeBtn) {
  document
    .querySelectorAll(".categories-buttons button")
    .forEach((btn) => btn.classList.remove("active"));

  activeBtn.classList.add("active");
}

// button active
function filterGallery(categoryId) {
  document.querySelectorAll(".gallery figure").forEach((fig) => {
    const figCat = Number(fig.dataset.category);

    fig.style.display =
      categoryId === "all" || figCat === categoryId ? "" : "none";
  });
}

// lancement
Promise.all([fetchWorks(), fetchCategories()]).then(([works, categories]) => {
  allWorks = works;
  displayWorks(allWorks);
  createFilterButtons(categories);
  initAuthUI();

  // important pour ieditor.js
  window.dispatchEvent(new Event("worksReady"));
});
