const firebase = require("firebase");

firebase.initializeApp({
  apiKey: "AIzaSyDeL8DKbAVIdWisVYi6Po29_8jBxyQSSKc",
  authDomain: "mylibrary-sid.firebaseapp.com",
  projectId: "mylibrary-sid",
});

const db = firebase.firestore();

db.collection("users").add({
  first: "Ada",
  last: "Lovelace",
  born: 1815
}).
then((ref) => {
  console.log("document written with id: ", ref.id);
})
.catch((error) => {
  console.error("Error adding document: ", error);
});


let myLibrary = [];

function Book(title, author, totPages, read) {
  this.title = title;
  this.author = author;
  this.totPages = totPages;
  this.read = read;
}

let newBookBtn = document.getElementById("newBookBtn");
let formDiv = document.querySelector(".form-div");
let main = document.querySelector("main");
let title = document.querySelector("#title");
let author = document.querySelector("#author");
let pages = document.querySelector("#pages");
let submitBtn = document.querySelector(".submit-btn");
let containerDiv = document.querySelector(".container-div");
let counter = 1;

newBookBtn.addEventListener("click", () => {
  formDiv.classList.toggle("hidden");
  main.classList.toggle("margin-top-for-fixed-header");
});

submitBtn.addEventListener("click", () => {
  myLibrary[counter] = new Book(
    title.value,
    author.value,
    pages.value,
    "Not Read"
  );

  let cardDiv = document.createElement("div");
  let titlePara = document.createElement("p");
  let authorPara = document.createElement("p");
  let pagesPara = document.createElement("p");
  let readPara = document.createElement("p");
  let toggleReadBtn = document.createElement("button");
  let removebtn = document.createElement("button");
  let counterPara = document.createElement("p");

  cardDiv.classList.add("card");
  titlePara.classList.add("title");
  authorPara.classList.add("author");
  pagesPara.classList.add("pages");
  readPara.classList.add("read");
  toggleReadBtn.classList.add("read-button");
  removebtn.classList.add("remove-btn");
  counterPara.classList.add("hidden-elem");

  titlePara.appendChild(document.createTextNode(title.value));
  authorPara.appendChild(
    document.createTextNode("Authored by: " + author.value)
  );
  pagesPara.appendChild(
    document.createTextNode("No. of Pages: " + pages.value)
  );
  let readNode = document.createTextNode("Not Read");
  readPara.appendChild(readNode);
  toggleReadBtn.innerHTML = "Toggle Read";
  removebtn.innerHTML = "Remove";
  counterPara.appendChild(document.createTextNode(counter));

  cardDiv.appendChild(counterPara);
  cardDiv.appendChild(titlePara);
  cardDiv.appendChild(authorPara);
  cardDiv.appendChild(pagesPara);
  cardDiv.appendChild(readPara);
  cardDiv.appendChild(toggleReadBtn);
  cardDiv.appendChild(removebtn);
  containerDiv.appendChild(cardDiv);

  formDiv.classList.add("hidden");
  main.classList.add("margin-top-for-fixed-header");
  counter += 1;
});

document.addEventListener("click", (e) => {
  let parentElement = e.target.parentElement;
  let readElem = parentElement.childNodes;
  if (
    parentElement.classList == "card" &&
    e.target.classList == "read-button"
  ) {
    let index = readElem[0].innerHTML;
    index = Number(index);
    //document.getElementById("newPara").appendChild(document.createTextNode(index));
    if (readElem[4].innerHTML == "I have read this") {
      readElem[4].innerHTML = "Not Read";
      myLibrary[index].read = "Not Read";
    } else if (readElem[4].innerHTML == "Not Read") {
      readElem[4].innerHTML = "I have read this";
      myLibrary[index].read = "I have read this";
    }
  } else if (
    parentElement.classList == "card" &&
    e.target.classList == "remove-btn"
  ) {
    let superParent = parentElement.parentNode;
    superParent.removeChild(parentElement);
  }
});

function showBooks() {
  myLibrary.forEach((element) => {
    console.log(element);
  });
}
