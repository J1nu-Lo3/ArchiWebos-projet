const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".categories-buttons");

let allWorks = [];

// projets gallerie
fetch("http://localhost:5678/api/works")
  .then((res) => res.json())
  .then((works) => {
    allWorks = works;
    displayWorks(works);
  });

// fonction pour afficher les photos de la gallerie
function displayWorks(works) {
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");

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

// categories button
fetch("http://localhost:5678/api/categories")
  .then((res) => res.json())
  .then((categories) => {
    createFilterButtons(categories);
  });

// boultons categories dynamique
function createFilterButtons(categories) {
  const btnAll = document.createElement("button");
  btnAll.textContent = "Tous";
  btnAll.classList.add("active");
  btnAll.addEventListener("click", () => {
    setActiveButton(btnAll);
    displayWorks(allWorks);
  });

  filtersContainer.appendChild(btnAll);

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.dataset.id = category.id;

    btn.addEventListener("click", () => {
      setActiveButton(btn);
      const filtered = allWorks.filter(
        (work) => work.categoryId === category.id
      );
      displayWorks(filtered);
    });

    filtersContainer.appendChild(btn);
  });
}

// button active
function setActiveButton(activeBtn) {
  document
    .querySelectorAll(".categories-buttons button")
    .forEach((btn) => btn.classList.remove("active"));

  activeBtn.classList.add("active");
}
