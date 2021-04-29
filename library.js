// *** Initialized the firebase database into the variable named db ----->
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
//---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX

// *** Function to add books from the databse to array ------>
async function addBooksFromDbToArray() {
  await db
    .collection("Books")
    .get()
    .then((snapShot) => {
      snapShot.forEach((doc) => {
        myLibrary.push(
          new Book(
            doc.data().title,
            doc.data().author,
            doc.data().totPages,
            doc.data().read,
            doc.id
          )
        );
      });
    });
}
//---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX

// *** Function to show books (add book cards in the DOM) on the page ----->
function createBooks(title, author, pages, read) {
  let cardDiv = document.createElement("div");
  let titlePara = document.createElement("p");
  let authorPara = document.createElement("p");
  let pagesPara = document.createElement("p");
  let readPara = document.createElement("p");
  let toggleReadBtn = document.createElement("button");
  let removebtn = document.createElement("button");

  cardDiv.classList.add("card");
  titlePara.classList.add("title");
  authorPara.classList.add("author");
  pagesPara.classList.add("pages");
  readPara.classList.add("read");
  toggleReadBtn.classList.add("read-button");
  removebtn.classList.add("remove-btn");

  titlePara.appendChild(document.createTextNode(title));
  authorPara.appendChild(document.createTextNode("Authored by: " + author));
  pagesPara.appendChild(document.createTextNode("No. of Pages: " + pages));

  readPara.appendChild(document.createTextNode(read));
  toggleReadBtn.innerHTML = "Toggle Read";
  removebtn.innerHTML = "Remove";

  cardDiv.appendChild(titlePara);
  cardDiv.appendChild(authorPara);
  cardDiv.appendChild(pagesPara);
  cardDiv.appendChild(readPara);
  cardDiv.appendChild(toggleReadBtn);
  cardDiv.appendChild(removebtn);
  containerDiv.appendChild(cardDiv);
}
//---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX

let myLibrary = []; // *** Array to store books locally

// *** Called the functions to get book documents from the database and show on page ----->
addBooksFromDbToArray().then(() => {
  myLibrary.forEach((book) => {
    createBooks(book.title, book.author, book.totPages, book.read);
  });
});
//---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX

// *** Constructor function (class) to create new books ------>
function Book(title, author, totPages, read, id) {
  this.title = title;
  this.author = author;
  this.totPages = totPages;
  this.read = read;
  this.id = id;
}
//---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX

// *** Acquiring the Library Page from the DOM to variables for manipulation ------>
let newBookBtn = document.getElementById("newBookBtn");
let formDiv = document.querySelector(".form-div");
let main = document.querySelector("main");
let title = document.querySelector("#title");
let author = document.querySelector("#author");
let pages = document.querySelector("#pages");
let submitBtn = document.querySelector(".submit-btn");
let containerDiv = document.querySelector(".container-div");
//---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX

// *** Show the form to add new book when Add New Book Link is clicked ----------->
newBookBtn.addEventListener("click", () => {
  formDiv.classList.toggle("hidden");
  main.classList.toggle("margin-top-for-fixed-header");
});
//---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX

// *** Add the data of new book from form to database and show on the page -------->
submitBtn.addEventListener("click", () => {
  let snapShot = db.collection("Books").where("title", "==", title.value).get();
  snapShot.then((snap) => {
    if (snap.empty) {
      db.collection("Books").add({
        title: title.value,
        author: author.value,
        totPages: pages.value,
        read: "Not Read",
      });
      createBooks(title.value, author.value, pages.value, "Not Read");
    } else
      alert(
        "Book having same title already in library, choose another book to add."
      );
  });

  formDiv.classList.add("hidden");
  main.classList.add("margin-top-for-fixed-header");
});
//---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX

// *** toggle read button code to toggle the book read or not ----->
document.addEventListener("click", (e) => {
  if (e.target.classList == "read-button") {
    let parentElement = e.target.parentElement;
    let cardTitle = parentElement.children[0].innerText;
    let readKey = parentElement.children[3].innerText;
    if (readKey === "Not Read") {
      parentElement.children[3].innerText = "I have read this";
    } else {
      parentElement.children[3].innerText = "Not Read";
    }
    let snapShot = db.collection("Books").where("title", "==", cardTitle).get();
    snapShot.then((snap) => {
      snap.forEach((doc) => {
        db.collection("Books").doc(doc.id).update({
          read: parentElement.children[3].innerText,
        });
      });
    });
  }
});
//---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX

// *** remove button to remove book from the database, from the array and from the page ----->
document.addEventListener("click", (e) => {
  if (e.target.classList == "remove-btn") {
    let parentElement = e.target.parentElement;
    let cardTitle = parentElement.children[0].innerText;
    let snapShot = db.collection("Books").where("title", "==", cardTitle).get();
    snapShot.then((snap) => {
      snap.forEach((doc) => {
        db.collection("Books").doc(doc.id).delete();
      });
    });
    parentElement.remove();
  }
});
//---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX---------------XXXXXXXXXXXX
