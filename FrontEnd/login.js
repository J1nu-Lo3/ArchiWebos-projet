// sélection des éléments
const form = document.querySelector(".log_form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

function validerEmail(email) {
  let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");

  if (!emailRegExp.test(email)) {
    throw new Error("L'email n'est pas valide.");
  }
}

function validerPassword(password) {
  if (password.length < 1) {
    throw new Error("Le mot de passe ne peut pas être vide.");
  }
}

function afficherMessageErreur(message) {
  let spanErreur = document.getElementById("erreurMessage");

  if (!spanErreur) {
    spanErreur = document.createElement("span");
    spanErreur.id = "erreurMessage";
    spanErreur.style.color = "red";
    spanErreur.style.display = "block";
    spanErreur.style.marginTop = "10px";

    form.appendChild(spanErreur);
  }

  spanErreur.innerText = message;
}

// fonction pour envoyer la requête API login
function loginUser(email, password) {
  return fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  }).then(function (res) {
    if (!res.ok) {
      throw new Error("Identifiants incorrects.");
    }
    return res.json();
  });
}

// gestion du formulaire
form.addEventListener("submit", function (e) {
  e.preventDefault();

  let email = emailInput.value.trim();
  let password = passwordInput.value.trim();

  try {
    validerEmail(email);
    validerPassword(password);

    //  tentative de connexion
    loginUser(email, password)
      .then(function (data) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        // redirection vers la page d’éditeur
        window.location.href = "ieditor.html";
      })
      .catch(function (error) {
        afficherMessageErreur(error.message);
      });
  } catch (validationError) {
    afficherMessageErreur(validationError.message);
  }
});
