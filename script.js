const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("container");
let bookmarks = [];

//validate form
function validate(nameValue, urlValue) {
  var expression =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

  var regex = new RegExp(expression);

  if (!urlValue || !nameValue) {
    return false;
  }
  if (urlValue.match(regex)) {
    return true;
  } else {
    alert(`"${urlValue}" is not valid.`);
    return false;
  }
}

//show modal, focus on input
function showModal() {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

// build Bookmarks DOM
function buildBookmarks() {
  bookmarksContainer.innerHTML = "";
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    //Item
    const item = document.createElement("div");
    item.classList.add("item");
    //close icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "delete bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);
    //favicon
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    const faveicon = document.createElement("img");
    faveicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    faveicon.setAttribute("alt", "Favicon");
    //link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    //Append to bookmarks container
    linkInfo.append(faveicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}
//fetch bookmarks from LS
function fetchBookmarks() {
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    bookmarks = [
      {
        name: "Google",
        url: "https://google.com",
      },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

//delete bookmark
function deleteBookmark(url) {
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

//handle data from form
function storeBookmark(e) {
  e.preventDefault();
  const websiteName = websiteNameEl.value;
  let websiteUrl = "";
  if (
    !websiteUrlEl.value.includes("https://") &&
    !websiteUrlEl.value.includes("http://")
  ) {
    websiteUrl = `https://${websiteUrlEl.value}`;
  } else {
    websiteUrl = websiteUrlEl.value;
  }

  if (!validate(websiteName, websiteUrl)) {
    return false;
  }
  const bookmark = {
    name: websiteName,
    url: websiteUrl,
  };
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

//modal event listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () => {
  modal.classList.remove("show-modal");
});
window.addEventListener("click", (e) => {
  e.target == modal ? modal.classList.remove("show-modal") : false;
});

// event listener
bookmarkForm.addEventListener("submit", storeBookmark);
//onload, fetch bookmarks
fetchBookmarks();
