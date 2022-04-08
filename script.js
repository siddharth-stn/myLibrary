let pageBody = document.querySelector("body");
let addBookBtn = document.querySelector(".addBook");
let addBookForm = document.querySelector("form");
let submitBtn = document.querySelector(".submitBtn");
let shelf = document.querySelector(".shelf");

let myLibrary = [];

function Books(title, author, pages, read = "not read") {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Books.prototype.info = function () {
    return (`${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`);
}

function addBookToLibrary(title, author, pages, read) {
    myLibrary.push(new Books(title, author, pages, read));
}

function showBooks() {
    shelf.textContent = "";

    myLibrary.forEach(element => {
        const list = document.createElement("ul");
        let listItem = document.createElement("li");
        let spanOne = document.createElement("span");
        let spanTwo = document.createElement("span");
        let spanThree = document.createElement("span");
        let toggleRead = document.createElement("button");
        let removeBtn = document.createElement("button");

        spanOne.textContent = element.title;
        spanTwo.textContent = element.author;
        spanThree.textContent = element.pages;
        toggleRead.textContent = element.read
        removeBtn.textContent = "REMOVE";

        removeBtn.classList.add("removeBtn");
        toggleRead.classList.add('readBtn');

        listItem.appendChild(spanOne);
        listItem.appendChild(spanTwo);
        listItem.appendChild(spanThree);
        listItem.appendChild(toggleRead);
        listItem.appendChild(removeBtn);
        list.appendChild(listItem);
        shelf.appendChild(list);
    });

}


addBookBtn.addEventListener('click', () => {
    addBookForm.classList.toggle('hidden');
});

submitBtn.addEventListener('click', () => {
    let title = document.querySelector(".title").value;
    let author = document.querySelector(".author").value;
    let pages = document.querySelector(".pages").value;
    let read = document.querySelector(".read").value;
    if ((title != "") && (author != "") && (pages != "")) {
        addBookToLibrary(title, author, pages, read);
        showBooks();
        document.querySelector(".title").value = "";
        document.querySelector(".author").value = "";
        document.querySelector(".pages").value = "";
        addBookForm.classList.toggle('hidden');
    }
});


pageBody.addEventListener('click', (e) => {
    if (e.target.classList.value == "readBtn") {
        const parentShelf = e.target.parentNode.parentNode.parentNode;
        const shelfChildrenArray = Array.from(parentShelf.children);
        const targetUl = e.target.parentNode.parentNode;
        const indexOfElement = shelfChildrenArray.indexOf(targetUl);
        const targetReadElementInArray = myLibrary[indexOfElement];
        ((e.target.textContent == "READ") ?
            ((e.target.textContent = "NOT READ") && (targetReadElementInArray.read = "NOT READ")) :
            (e.target.textContent = "READ") && (targetReadElementInArray.read = "READ"));
    }

    if (e.target.classList.value == "removeBtn") {
        const parentShelf = e.target.parentNode.parentNode.parentNode;
        const shelfChildrenArray = Array.from(parentShelf.children);
        const targetUl = e.target.parentNode.parentNode;
        const indexOfElement = shelfChildrenArray.indexOf(targetUl);
        myLibrary.splice(indexOfElement, 1);
        showBooks();
    }
});