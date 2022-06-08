let pageBody = document.querySelector("body");
let addBookBtn = document.querySelector(".addBook");
let addBookForm = document.querySelector("form");
let submitBtn = document.querySelector(".submitBtn");
let shelf = document.querySelector(".shelf");
let form = document.querySelector(".showForm");

let myLibrary = [];


class Books {
    constructor(title, author, pages, read="not read") {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    info() {
        return (`${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`);
    }
}

// function Books(title, author, pages, read = "not read") {
//     this.title = title;
//     this.author = author;
//     this.pages = pages;
//     this.read = read;
// }

// Books.prototype.info = function () {
//     return (`${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`);
// }

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

    let title = document.querySelector(".title");
    let author = document.querySelector(".author");
    let pages = document.querySelector(".pages");
    let read = document.querySelector(".read").value;
    
    //Custom Validity Added to the form elements ----->
    if (title.validity.valueMissing) {
        title.setCustomValidity("This is a required field!");
        title.reportValidity();
    } else {
        title.setCustomValidity("");
    }
    
    if (author.validity.valueMissing) {
        author.setCustomValidity("This is a required field!");
        author.reportValidity();
    } else {
        author.setCustomValidity("");
    }

    if (!pages.checkValidity()) {
        if (pages.validity.valueMissing) {
            pages.setCustomValidity("This is a required field!");
            pages.reportValidity();
        } else if (pages.validity.rangeOverflow) {
            pages.setCustomValidity("No. of Pages can not be greater than 5000!");
            pages.reportValidity();
        } else if (pages.validity.rangeUnderflow) {
            pages.setCustomValidity("No. of Pages can not be less than 1!");
            pages.reportValidity();
        } else {
            pages.setCustomValidity("");
        }
    }

    //submit data if everything checks out to be correct ------> 
    if ((title.checkValidity()) && (author.checkValidity()) && pages.checkValidity()) {
        addBookToLibrary(title.value, author.value, pages.value, read.value);
        showBooks();
        addBookForm.classList.toggle('hidden');
        document.querySelector(".title").value = "";
        document.querySelector(".author").value = "";
        document.querySelector(".pages").value = "";
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