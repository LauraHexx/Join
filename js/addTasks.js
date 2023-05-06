async function initAddTask() {
  await loadUsers();
  await sortUsersAlphabetically();
  await loadCategorys();
}

async function sortUsersAlphabetically() {
  USERS = USERS.sort((a, b) => a.initials.localeCompare(b.initials));
}

async function sortCategorysAlphabetically() {
  CATEGORYS = CATEGORYS.sort((a, b) => a.name.localeCompare(b.name));
}

async function addCategory() {
  let category = getCategory();
  let colour = getSelectedColor();
  CATEGORYS.push({
    name: category,
    color: colour,
  });
  await sortCategorysAlphabetically();
  setItem("categorys", JSON.stringify(CATEGORYS));
}

function getCategory() {
  const newCategory = document.getElementById("categoryInput").value;
  if (!newCategory) {
    document.getElementById("errorName").classList.remove("d-none");
    return;
  }
  if (checkIfCategoryAlreadyExist(newCategory)) {
    document.getElementById("errorNameExists").classList.remove("d-none");
    return;
  }
  return newCategory;
}

function checkIfCategoryAlreadyExist(newCategory) {
  return CATEGORYS.find((category) => category.name === newCategory);
}

/**
 * This function retrieves the ID of the div element that has the class "selectedColor".
 *
 * @returns {string|null} The ID of the selected div element, or null if no element is selected.
 */
function getSelectedColor() {
  const selectedColorDiv = document.querySelector(".selectedColor");
  if (selectedColorDiv) {
    return selectedColorDiv.id;
  } else {
    document.getElementById("errorColor").classList.remove("d-none");
  }
}

function renderCategorys() {
  document.getElementById("selectableCategorys").innerHTML = "";
  CATEGORYS.forEach((category) => {
    const name = category.name;
    const color = category.color;
    document.getElementById("selectableCategorys").innerHTML +=
      renderCategorysHtml(name, color);
  });
}

function renderCategorysHtml(name, color) {
  return /*html*/ `
    <li class="singleCategory">
      <span>${name}</span>
      <div id=${color} class="circle"></div>
    </li>
  `;
}

function moveCircle(event) {
  const circles = document.querySelectorAll(".circle");
  circles.forEach((circle) => {
    if (circle === event.target) {
      circle.classList.add("selectedColor");
    } else {
      circle.classList.remove("selectedColor");
    }
  });
}

/*CATEGORY*/

function toggleNewCategory() {
  toggleClass("selectCategory", "d-none");
  toggleClass("newCategory", "d-none");
  toggleClass("categorysColours", "d-none");
}

function showSelectCategory() {
  toggleNewCategory();
  toggleClass("listCategorys", "d-none");
}

/*CONTACTS*/

function toggleInviteContact() {
  toggleClass("newContact", "d-none");
  toggleClass("selectContact", "d-none");
}

function showSelectContacts() {
  toggleInviteContact();
  toggleClass("listContacts", "d-none");
}
