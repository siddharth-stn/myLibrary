    console.clear();

    function Books(title, author, pages, read = "not read") {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    Books.prototype.info = function () {
        return (`${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`);
    }
