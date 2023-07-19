// Сделать контактную книжку с использованием  Local Storage

// Нужно реализовать CRUD:
// 1) добавление
// 2) отображение
// 3) редактирование
// 4) удаление

// При создании должно быть 4 инпута:
// 1) Имя контакта
// 2) фамилия
// 3) номер телефона
// 4) фото контакта

let contactName = document.querySelector("#name-inp");
let contactSurname = document.querySelector("#surname-inp");
let contactPhone = document.querySelector("#phone-inp");
let contactImg = document.querySelector("#img-url-inp");
let contactCreateBtn = document.querySelector(".add-contact-btn");
let contactSaveBtn = document.querySelector(".save-contact-btn");
let searchInp = document.querySelector("#search-inp");
let container = document.querySelector(".container");
let btnClose = document.querySelector(".btn-close");

function initStorage() {
  if (!localStorage.getItem("contacts-data")) {
    localStorage.setItem("contacts-data", "[]");
  }
}
initStorage();

function setContactsToStorage(contacts) {
  localStorage.setItem("contacts-data", JSON.stringify(contacts));
}

function getContactsFromStorage() {
  let contacts = JSON.parse(localStorage.getItem("contacts-data"));
  return contacts;
}

function createContact() {
  if (
    !contactName.value.trim() ||
    !contactSurname.value.trim() ||
    !contactPhone.value.trim() ||
    !contactImg.value.trim()
  ) {
    return alert("Some inputs are empty :(");
  }

  let contactObj = {
    id: Date.now(),
    name: contactName.value,
    surname: contactSurname.value,
    number: contactPhone.value,
    url: contactImg.value,
  };

  let contacts = getContactsFromStorage();
  contacts.push(contactObj);
  setContactsToStorage(contacts);

  cleanFormInp();
  btnClose.click();
  render();
}

function cleanFormInp() {
  contactName.value = "";
  contactSurname.value = "";
  contactPhone.value = "";
  contactImg.value = "";
}

// render
function render(data = getContactsFromStorage()) {
  container.innerHTML = "";
  data.forEach((item) => {
    container.innerHTML += `
      <div class="card width-25 m-2" style="width: 18rem;" id="${item.id}">
        <img src="${item.url}" class="card-img-top" alt="..." height="370">
        <div class="card-body">
          <h5 class="card-title">${item.surname}${item.name}</h5>
          <p class="card-text">${item.number}$</p>
          <a href="#" class="btn btn-danger delete-contact-btn">Delete</a>
          <a href="#" class="btn btn-secondary update-contact-btn" data-bs-toggle="modal"
            data-bs-target="#staticBackdrop">Update</a>
        </div>
      </div>
    `;
  });

  if (data.length === 0) return;
  addDeleteEvent();
  addUpdateEvent();
}

render();

function addDeleteEvent() {
  let deleteBtns = document.querySelectorAll(".delete-contact-btn");
  deleteBtns.forEach((item) => item.addEventListener("click", deleteContact));
}

// delete
function deleteContact(e) {
  let contactId = e.target.parentNode.parentNode.id;
  let contacts = getContactsFromStorage();
  contacts = contacts.filter((item) => item.id !== contactId);
  setContactsToStorage(contacts);
  cleanFormInp();
  render();
}

// update
function updateContact(e) {
  let contactId = e.target.parentNode.parentNode.id;
  let contacts = getContactsFromStorage();
  let contactObj = contacts.find((item) => item.id === contactId);
  contactName.value = contactObj.name;
  contactSurname.value = contactObj.surname;
  contactPhone.value = contactObj.number;
  contactImg.value = contactObj.url;
  contactSaveBtn.setAttribute("id", contactId);
}

function saveChanges(e) {
  if (!e.target.id) return;
  let contacts = getContactsFromStorage();
  let contactObj = contacts.find((item) => item.id === e.target.id);

  contactObj.name = contactName.value;
  contactObj.surname = contactSurname.value;
  contactObj.number = contactPhone.value;
  contactObj.url = contactImg.value;

  setContactsToStorage(contacts);
  contactSaveBtn.removeAttribute("id");
  cleanFormInp();
  btnClose.click();
  render();
}

contactSaveBtn.addEventListener("click", saveChanges);

searchInp.addEventListener("input", (e) => {
  let contacts = getContactsFromStorage();
  contacts = contacts.filter((item) => {
    return item.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1;
  });
  render(contacts);
});

btnClose.addEventListener("click", () => {
  cleanFormInp();
  if (contactSaveBtn.id) {
    contactSaveBtn.removeAttribute("id");
  }
});

contactCreateBtn.addEventListener("click", createContact);
