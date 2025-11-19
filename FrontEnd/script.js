const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".categories-buttons");

let allWorks = [];

// fonction fecth pour la gallerie
function fetchWorks() {
  return fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .catch((err) => console.error("Erreur :", err));
}

// fonction button
function fetchCategories() {
  return fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .catch((error) => console.error("Erreur fetch categories :", error));
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

// filtre sans avoir a détruire le DOM
function filterGallery(categoryId) {
  const figures = gallery.querySelectorAll("figure");

  figures.forEach((fig) => {
    const figCat = Number(fig.dataset.category);

    if (categoryId === "all" || figCat === categoryId) {
      fig.style.display = ""; // visible
    } else {
      fig.style.display = "none"; // masqué
    }
  });
}

// boultons categories dynamique
function createFilterButtons(categories) {
  const btnAll = document.createElement("button");

  btnAll.textContent = "Tous";
  btnAll.classList.add("active");

  btnAll.addEventListener("click", () => {
    setActiveButton(btnAll);
    filterGallery("all");
  });

  filtersContainer.appendChild(btnAll);

  for (let category of categories) {
    const btn = document.createElement("button");
    btn.textContent = category.name;

    btn.addEventListener("click", () => {
      setActiveButton(btn);
      filterGallery(category.id);
    });

    filtersContainer.appendChild(btn);
  }
}

// button active
function setActiveButton(activeBtn) {
  document
    .querySelectorAll(".categories-buttons button")
    .forEach((btn) => btn.classList.remove("active"));

  activeBtn.classList.add("active");
}

// Lancement du script
fetchWorks().then((works) => {
  allWorks = works;
  displayWorks(works);
});

fetchCategories().then((categories) => {
  createFilterButtons(categories);
});
