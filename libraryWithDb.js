

//Book object class/constructor.
function Book (title, author, totPages, read) {
    this.title = title;
    this.author = author;
    this.totPages = totPages;
    this.read = read;
};

//Initialize and call firebase database reference.
var database = firebase.database();

//Initialize the value of the counter variable 
//during loading of the Program,
//from the database.
let counter;
async function initCounter (runAfterCounter) {
    await database.ref('Book').once('value').then((snapshot) => {
            counter = Number(snapshot.numChildren());
            console.log("I am counter Iniatialized " + counter);
    })
    runAfterCounter();
}

//Funtion to Send data to firebase database. 
function writeUserData(counter, title, author, totPages, read) {
    database.ref('Book/' + counter).set({
      title: title,
      author: author,
      totPages : totPages,
      read: read
    });
    console.log("data written to firebase");
  }

//Function to retreive data from the firebase database
//and populate the library book Array with this data
async function getData (addDataToGui) {
    //Initialize library books Array.
    let myLibrary = [];
    let key;

    await database.ref('Book').once('value', (snapshot) => {
        snapshot.forEach(function (childSnapshot) {
            key = Number(childSnapshot.key);
            let title = childSnapshot.val().title;
            let author = childSnapshot.val().author;
            let read = childSnapshot.val().read;
            let totPages = childSnapshot.val().totPages;

            myLibrary.push(new Book(title, author, totPages, read))
            console.log("data added to array");
            console.log(myLibrary);

            counter = key;

            console.log("key is " + key);
            addDataToGui(myLibrary, key);
        }); 
    });
    
}

//Get the data from the form of Library of Books to be added(Elements called from HTML)
let newBookBtn = document.getElementById("newBookBtn");
let formDiv = document.querySelector(".form-div");
let main = document.querySelector("main");
let title = document.querySelector("#title");
let author = document.querySelector("#author");
let pages = document.querySelector("#pages");
let submitBtn = document.querySelector(".submit-btn");
let containerDiv = document.querySelector(".container-div");

//Button Program to Open Add Book Form
newBookBtn.addEventListener("click", () => {
    formDiv.classList.toggle("hidden");
    main.classList.toggle("margin-top-for-fixed-header");
});

function addDataToGui (myLibrary, key) {
    console.log("counter is " + counter);


    let parent = document.querySelector('.container-div');
    console.log(parent);
    console.log(parent.childElementCount);
    
    let cardCount = Number(parent.childElementCount);
    console.log("key is " + key + " and cardcount is " + cardCount);

    if (!(key < cardCount)) {
        //Create Book GUI (HTML) Elements
        let cardDiv = document.createElement("div");
        let titlePara = document.createElement("p");
        let authorPara = document.createElement("p");
        let pagesPara = document.createElement("p");
        let readPara = document.createElement("p");
        let toggleReadBtn = document.createElement("button");
        let removebtn = document.createElement("button");

        //Add Classes to the newly created Elements
        cardDiv.classList.add("card");
        titlePara.classList.add("title");
        authorPara.classList.add("author");
        pagesPara.classList.add("pages");
        readPara.classList.add("read");
        toggleReadBtn.classList.add("read-button");
        removebtn.classList.add("remove-btn");

        titlePara.appendChild(document.createTextNode(myLibrary[key].title));
        authorPara.appendChild(document.createTextNode("Authored by: " + myLibrary[key].author));
        pagesPara.appendChild(document.createTextNode("No. of Pages: " + myLibrary[key].totPages));
        let readNode = document.createTextNode(myLibrary[key].read);
        readPara.appendChild(readNode);
        toggleReadBtn.innerHTML = "Toggle Read";
        removebtn.innerHTML = "Remove";

        //Add newly Created Book to the DOM
        cardDiv.appendChild(titlePara);
        cardDiv.appendChild(authorPara);
        cardDiv.appendChild(pagesPara);
        cardDiv.appendChild(readPara);
        cardDiv.appendChild(toggleReadBtn);
        cardDiv.appendChild(removebtn);
        containerDiv.appendChild(cardDiv);

        //Update the class of the form 
        formDiv.classList.add("hidden");
        main.classList.add("margin-top-for-fixed-header");
    }
}

//Program to run when new book is added(Submit Button Pressed)
submitBtn.addEventListener("click", () => {
    //Initialize Counter
    initCounter(runAfterCounter);
    
    key = counter;
    function runAfterCounter () {
        //Function called to add the book object to firebase database
        writeUserData(counter, title.value, author.value, pages.value,"Not Read");

        //Function called to retreive book Data from the firebase Database
        getData(addDataToGui);   
        
    }
});


    //Run this function to load the added books from
    //the database to the GUI on load 
    const body = document.querySelector('body');
    body.onload = function onLoad () {

        console.log("</br>load function was run</br>");
        getData(addDataToGui); 
    }

    
    

//use of the toggle button and read flag 
//and use of the remove button 
document.addEventListener("click", (e) => {
    let parentElement = e.target.parentElement;
    let readElem = parentElement.childNodes;

    if (parentElement.classList == "card" && e.target.classList == "read-button") {
        if (readElem[3].innerHTML == "I have read this") {
            readElem[3].innerHTML = "Not Read";
            let titleFind = readElem[0].innerHTML;
            console.log(titleFind); 
            database.ref('Book/').once('value', snapShot => {
                snapShot.forEach(childSnapShot => {
                    let key = childSnapShot.key;
                    let title = childSnapShot.val().title;

                    if (title == titleFind) {
                        database.ref('Book').child(key).update({
                            read: "Not Read",
                        });
                    }
                }); 
            });
        } else if (readElem[3].innerHTML == "Not Read") {
            readElem[3].innerHTML = "I have read this";
            titleFind = readElem[0].innerHTML;
            console.log(titleFind);
            database.ref('Book/').once('value', snapShot => {
                snapShot.forEach(childSnapShot => {
                    let key = childSnapShot.key;
                    let title = childSnapShot.val().title;

                    if (title == titleFind) {
                        database.ref('Book').child(key).update({
                            read: "I have read this",
                        });
                    }
                });
            });
                
        }

    } else if (parentElement.classList == "card" && e.target.classList == "remove-btn") {
        let superParent = parentElement.parentNode;
        let readElem = parentElement.childNodes;
        let titleFind = readElem[0].innerHTML;

        console.log(titleFind);
        console.log(superParent);

        database.ref('Book/').once('value', snapShot => {
            snapShot.forEach(childSnapShot => {
                let key = childSnapShot.key;
                let title = childSnapShot.val().title;

                if (title == titleFind) {
                    database.ref('Book').child(key).remove();
                }
            });
        });

        superParent.removeChild(parentElement);
        
        body.onload = function onLoad () {
            console.log("</br>load function was run</br>");
            getData(addDataToGui); 
        }
    }
});
