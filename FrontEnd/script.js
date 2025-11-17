fetch("http://localhost:5678/api/works")
  .then((r) => r.json())
  .then((works) => {
    works.forEach((work) => {
      const figure = document.createElement("figure");

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      const caption = document.createElement("figcaption");
      caption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(caption);
      document.querySelector(".gallery").appendChild(figure);
    });
  });
