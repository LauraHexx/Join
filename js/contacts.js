let FIRST_INITIALS_NO_DUPLICAT = [];
let SELECTED_CONTACT = "";

async function initContacts() {
  await loadUserData();
  await getLoggedUser();
  await init("contacts");
  renderContactList();
  setContactsAndCategorysDropDownMenu();
  setEventScreenSize();
  setEventCloseDropDown();
}

function renderContactList() {
  CONTACTS = LOGGED_USER.contacts;
  if (CONTACTS) {
    sortArrayAlphabetically(CONTACTS);
    renderFirstInitialsList();
    renderContactsInInitialList();
  }
}

async function renderFirstInitialsList() {
  FIRST_INITIALS_NO_DUPLICAT = [];
  document.getElementById("contactList").innerHTML = "";
  CONTACTS.forEach((contact) => {
    const firstInitial = contact.initials.charAt(0);
    if (!FIRST_INITIALS_NO_DUPLICAT.includes(firstInitial)) {
      FIRST_INITIALS_NO_DUPLICAT.push(firstInitial);
      document.getElementById("contactList").innerHTML +=
        renderFirstInitialsListHtml(firstInitial);
    }
  });
}

function renderFirstInitialsListHtml(firstInitial) {
  return /*html*/ `
      <div class="oneSection">
        <span id="letterCategory">${firstInitial}</span>
         <div class="partingLineGrey"></div>
         <div id="contactsLetter${firstInitial}"></div>
      </div>
  `;
}

function renderContactsInInitialList() {
  clearContacts();
  CONTACTS.forEach((contact) => {
    const firstInitial = contact.initials.charAt(0);
    const indexOfContact = CONTACTS.indexOf(contact);
    document.getElementById(`contactsLetter${firstInitial}`).innerHTML +=
      renderContactsInInitialListHtml(contact, indexOfContact);
  });
}

function clearContacts() {
  const containers = document.querySelectorAll('[id^="contactsLetter"]');
  containers.forEach((container) => {
    container.innerHTML = "";
  });
}

function renderContactsInInitialListHtml(contact, indexOfContact) {
  return /*html*/ `
     <div
        onclick="openContactDetails(${indexOfContact})"
        class="singleContact">
        <div style="background-color: ${contact.color}" class="initialsOfNames smallCircle">${contact.initials}</div>
        <div id="deatilsOfUSer">
          <span>${contact.name}</span>
          <br />
          <a href="mailto:${contact.email}"
          onclick="event.stopPropagation();"
          >${contact.email}</a
          >
        </div>
      </div>
    `;
}

async function openContactDetails(indexOfContact) {
  if (!bigScreen()) {
    styleContactDetailsMobile();
  }
  if (animationIsNotPlaying()) {
    SELECTED_CONTACT = CONTACTS[indexOfContact];
    playAnimationContactDetails();
    renderContactDetails();
  }
}

function styleContactDetailsMobile() {
  document.getElementById("contactDetails").style.display = "flex";
  document.getElementById("contactList").style.display = "none";
}

function animationIsNotPlaying() {
  const mainInfosContact = document.getElementById("mainInfosContact");
  return !mainInfosContact.classList.contains("animation-slideInRight");
}

async function playAnimationContactDetails() {
  if (window.innerWidth > 920) {
    await playAnimation("mainInfosContact", "animation-slideInRight");
    setTimeout(() => {
      toggleClass("mainInfosContact", "animation-slideInRight");
    }, 1000);
  }
}

function renderContactDetails() {
  document.getElementById("mainInfosContact").innerHTML = "";
  document.getElementById("mainInfosContact").innerHTML =
    renderContactDetailsHtml();
}

function renderContactDetailsHtml() {
  return /*html*/ `
     <div class="addTaskToContact gap">
       <div class="initialsOfNames bigCircle" style="background-color: ${SELECTED_CONTACT.color}">${SELECTED_CONTACT.initials}</div>
       <div class="nameAndAddTask">
         <span class="name">${SELECTED_CONTACT.name}</span>
         <a
           onclick="showDisplay('contentAddTaskDisplay', 'animation-slideInRight', 'd-none'); toggleClass('body', 'overflowHidden')"
           class="addTask">
           <img
             src="../assets/img/plusBlue.svg"
             alt="image of icon to add a task" />
           <span>Add Task</span>
         </a>
       </div>
     </div>
     <div class="editContact gap">
       <span>Contact Information</span>
       <a
         onclick="renderEditContact()">
         <img
           src="../assets/img/pencilBlue.svg"
           alt="image of icon to edit contact" />
         <span class="editContactSpan">Edit Contact</span>
       </a>
     </div>
     <div class="emailAndPhone gap">
       <div class="email">
         <span class="bold">Email</span>
         <a href="mailto:${SELECTED_CONTACT.email}">${SELECTED_CONTACT.email}</a>
       </div>
       <div class="phone">
         <span class="bold">Phone</span>
         <a href="tel:${SELECTED_CONTACT.phone}">${SELECTED_CONTACT.phone}</a>
       </div>
     </div>
    `;
}

function renderEditContact() {
  document.getElementById("contentEditDisplay").innerHTML =
    renderEditContactHtml();
  showDisplay("contentEditDisplay", "animation-slideInRight", "d-none");
  toggleClass("body", "overflowHidden");
}

function renderEditContactHtml() {
  return /*html*/ `
      <div class="displayEditContact">
        <div class="leftSectionEdit">
          <img
            onclick="hideDisplay('contentEditDisplay', 'd-none'); toggleClass('body', 'overflowHidden')"
            class="cursorPointer closeWhite d-none"
            src="../assets/img/closeWhite.svg"
            alt="image of icon to close the editing" />
          <img
            class="logoEdit"
            src="../assets/img/logoWhite.svg"
            alt="logo of join" />
          <h1>Edit contact</h1>
          <div class="blueLine"></div>
        </div>
        <div class="rightSectionEdit">
          <img
            onclick="hideDisplay('contentEditDisplay', 'd-none'); toggleClass('body', 'overflowHidden')"
            class="cursorPointer closeDarkEdit"
            src="../assets/img/closeDark.svg"
            alt="image of icon to close the adding" />
          <div id="editContactInitials" class="bigCircleEdit" style="background-color:${SELECTED_CONTACT.color}">${SELECTED_CONTACT.initials}</div>
          <div class="formEdit">
            <input
              value="${SELECTED_CONTACT.name}"
              id="editContactName"
              class="input inputName"
              type="name"
              placeholder="Name"
              maxlength="25"
              minlength="2"
              required />
            <div class="editContactEmailContainer">
              <input
                value="${SELECTED_CONTACT.email}"
                id="editContactEmail"
                class="input inputEmail"
                type="email"
                placeholder="Email"
                maxlength="25"
                minlength="2"
                required />
              <span id="errorEmailIsAlreadyTaken" class="d-none">Email already belongs to a contact. Please update it.</span>
            </div>
            <input
              value=${SELECTED_CONTACT.phone}
              id="editContactPhone"
              class="input inputPhone"
              type="number"
              placeholder="Phone"
               />
            <div class="editContactBtns">
              <button onclick="deleteContact()" class="deleteBtn">Delete</button>
              <button onclick="checkEdits()" class="saveBtn">Save</button>
            </div>
          </div>
        </div>
      </div>
    `;
}

async function deleteContact() {
  const indexSelectedContact = CONTACTS.indexOf(SELECTED_CONTACT);
  CONTACTS.splice(indexSelectedContact, 1);
  const idSelectedContact = SELECTED_CONTACT.id;
  deleteContactFromTasks(idSelectedContact);
  await setItem("users", JSON.stringify(USERS));
  initContacts();
  playAnimationContactDeletedSuccess();
  hideDisplay("contentEditDisplay", "d-none");
  toggleClass("body", "overflowHidden");
  closeDetailInfos();
}

function deleteContactFromTasks(idSelectedContact) {
  const tasksToEdit = LOGGED_USER.tasks;
  tasksToEdit.forEach((task) => {
    const indexContactToDelete = task.contacts.indexOf(idSelectedContact);
    if (indexContactToDelete) {
      task.contacts.splice(indexContactToDelete, 1);
    }
  });
}

async function playAnimationContactDeletedSuccess() {
  await toggleClass("contactDeletedSucess", "d-none");
  await playAnimation("contactDeletedSucess", "animation-moveUpAndShake");
  setTimeout(() => {
    toggleClass("contactDeletedSucess", "animation-moveUpAndShake");
    toggleClass("contactDeletedSucess", "d-none");
  }, 2000);
}

function closeDetailInfos() {
  let detailInfos = document.getElementById("mainInfosContact");
  detailInfos.innerHTML = "";
}

function checkEdits() {
  const filteredContacts = filteredContacts();
  const foundExistingEmail = findExistingEmail(
    filteredContacts,
    editContactEmail.value
  );
  if (foundExistingEmail) {
    showError("errorEmailIsAlreadyTaken");
  } else {
    saveEdits();
  }
}

function filteredContacts() {
  return CONTACTS.filter((contact) => contact !== SELECTED_CONTACT);
}

function findExistingEmail(contacts, email) {
  return contacts.find((contact) => contact.email === email);
}

async function saveEdits() {
  changeData();
  await setItem("users", JSON.stringify(USERS));
  initContacts();
  if (window.innerWidth < 920) {
    closeDetailInfos();
  }
  closeDetailInfos();
  showContactList();
  hideDisplay("contentEditDisplay", "d-none");
  toggleClass("body", "overflowHidden");
}

function changeData() {
  SELECTED_CONTACT.name = editContactName.value;
  SELECTED_CONTACT.email = editContactEmail.value;
  SELECTED_CONTACT.phone = editContactPhone.value;
  SELECTED_CONTACT.initials = getInitials(editContactName.value);
}

async function getDataNewContact() {
  let newContact = {
    id: getContactId(),
    color: getRandomColor(),
    name: addContactName.value,
    initials: getInitials(addContactName.value),
    email: addContactEmail.value,
    phone: addContactPhone.value,
  };
  checkIfEmailIsAlreadyExisting(newContact);
}

function getContactId() {
  let highestId = 0;
  CONTACTS.forEach((contact) => {
    if (contact.id > highestId) {
      highestId = contact.id;
    }
  });
  return highestId + 1;
}

function checkIfEmailIsAlreadyExisting(newContact) {
  const foundExistingEmail = findExistingEmail(
    LOGGED_USER.contacts,
    addContactEmail.value
  );
  if (foundExistingEmail) {
    showError("errorEnterANewEmail");
  } else {
    addNewContact(newContact);
  }
}

async function addNewContact(newContact) {
  LOGGED_USER.contacts.push(newContact);
  await setItem("users", JSON.stringify(USERS));
  await initContacts();
  cancelAddContact();
  closeAddContact();
  hideError("errorEnterANewEmail");
  showAnimationNewContactSuccess();
}

function cancelAddContact() {
  addContactName.value = "";
  addContactEmail.value = "";
  addContactPhone.value = "";
}

function closeAddContact() {
  hideDisplay("contentAddDisplay", "d-none");
  toggleClass("body", "overflowHidden");
}

async function showAnimationNewContactSuccess() {
  await toggleClass("contactCreatedSucess", "d-none");
  await playAnimation("contactCreatedSucess", "animation-moveUpAndShake");
  setTimeout(() => {
    toggleClass("contactCreatedSucess", "animation-moveUpAndShake");
    toggleClass("contactCreatedSucess", "d-none");
  }, 2000);
}

function showContactList() {
  document.getElementById("contactList").style.display = "flex";
}

/*EVENT LISTENER************************************/

function setEventScreenSize() {
  window.addEventListener("resize", monitorScreenSize);
}

function monitorScreenSize() {
  const mainInfosContact = document.getElementById("mainInfosContact");
  if (bigScreen()) {
    document.getElementById("contactList").style.display = "flex";
    document.getElementById("contactDetails").style.display = "flex";
  } else if (!mainInfosAreKlicked(mainInfosContact)) {
    document.getElementById("contactList").style.display = "flex";
    document.getElementById("contactDetails").style.display = "none";
  } else if (mainInfosAreKlicked() && contactListStyleIsFlex()) {
    document.getElementById("contactList").style.display = "flex";
    document.getElementById("contactDetails").style.display = "none";
  }
}

function bigScreen() {
  return window.innerWidth > 920;
}

function mainInfosAreKlicked() {
  return mainInfosContact.innerHTML.trim() !== "";
}

function contactListStyleIsFlex() {
  return document.getElementById("contactList").style.display === "flex";
}
