const accessKey = "MrlvkgTYL-oPxaayuRsL1dwd0fsnCv21SQVS3kiRJMQ";

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const showMoreButtonEl = document.getElementById("show-more-button");
const suggestionLinks = document.querySelectorAll("#sugg a");


let inputData = "";
let page = 1;

async function searchImages() {

    if (!inputData) {
        alert("Please enter a search term!");
        return;
    }

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (page === 1) {
        searchResultsEl.innerHTML = "";
    }

    if (data.results.length === 0) {
        searchResultsEl.innerHTML = `<p>No results found. Try a different search term.</p>`;
        showMoreButtonEl.style.display = "none";
        return;
    }

    document.getElementById("suggestions").style.display = "none";
    
    const results = data.results;

    results.forEach((result) => {
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("search-result");
        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description || "Image";
        const imageLink = document.createElement("a");
        imageLink.href = result.links.html;
        imageLink.target = "_blank";
        imageLink.textContent = result.alt_description || "View Image";

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(imageLink);
        searchResultsEl.appendChild(imageWrapper);
    });

    page++;
    showMoreButtonEl.style.display = "block";
}

formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1;
    inputData = searchInputEl.value.trim();
    searchImages();
});

showMoreButtonEl.addEventListener("click", () => {
    searchImages();
});

suggestionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault(); 
        inputData = link.textContent.trim(); 
        searchInputEl.value = inputData; 
        page = 1;
        searchImages();
    });
});

document.querySelector(".home-icon").addEventListener("click", (event) => {
    event.preventDefault(); 
    location.reload(); 
});
