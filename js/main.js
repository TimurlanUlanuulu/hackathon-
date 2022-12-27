const API = "http://localhost:8000/posts";

// json-server --watch db.json --port 8000
// admin
const admin = document.getElementsByClassName("open-admin")[0];
const addPost = document.getElementsByClassName("add-page")[0];
const adminIcon = document.getElementsByClassName("admin-icn")[0];
const displayEdDel = document.getElementsByClassName("edit-delete");

//add
const addUrlInp = document.getElementsByClassName("add-url-inp")[0];
const addNameInp = document.getElementsByClassName("add-name-inp")[0];
const addDescInp = document.getElementsByClassName("add-descrip-inp")[0];
const displayImg = document.getElementsByClassName("display-img")[0];
const imageForm = document.getElementsByClassName("image")[0];

//add buttons
const addModal = document.getElementsByClassName("add-post__modal")[0];
const openAddModalBtn = document.getElementsByClassName("open-add-modal")[0];
const clsAddModal = document.getElementsByClassName("close-add-modal")[0];
const addNewPost = document.getElementsByClassName("add-post-btn")[0];

// edit
const editModal = document.getElementsByClassName("edit-post__modal")[0];
const inpEditName = document.getElementsByClassName("edit-name-inp")[0];
const inpEditUrl = document.getElementsByClassName("edit-url-inp")[0];
const inpEditDescripion =
  document.getElementsByClassName("edit-descrip-inp")[0];
const editImgDisplay = document.getElementsByClassName("display-edit-img")[0];
const clsEditModal = document.getElementsByClassName("close-edit-modal")[0];
const saveBtn = document.getElementsByClassName("save-post-btn")[0];
const likeBtn = document.getElementsByClassName("heart-svg")[0];

//post
const postSection = document.getElementsByClassName("post")[0];

//инпут для переменной поиска
const inpSearch = document.getElementsByClassName("search-txt")[0];
let searchValue = inpSearch.value;

//pagination
const prevBtn = document.getElementsByClassName("prev-btn")[0];
const nextBtn = document.getElementsByClassName("next-btn")[0];
const limit = 2;
let currentPage = 1;

render();

async function render() {
  const data = await getPostsFromStorage();
  postSection.innerHTML = "";
  data.forEach((post) => {
    postSection.innerHTML += `
    <div class="post-content">
    <div class="post-header">
      <div class="logo">
        <img
          src="./images/glass.svg"
          alt="html5-icon"
          class="header-png"
        />
      </div>
      <div class="title">
        <strong class="title-html5">stogramm</strong>
        <p class="title-username">${post.name}</p>
      </div>
      <div class="edit-delete">
        <img
          src="./img/delete-broom-svgrepo-com.svg"
          alt=""
          class="delete"
          onclick="deletePost(${post.id})"
        />
        <img src="./img/edit-svgrepo-com.svg" alt="" class="edit"
        onclick="handleEdit(${post.id})"
        />
      </div>
    </div>

    <!--post-img-->
    <div class="post-img">
      <img src="${post.url}" alt="post-image" />
    </div>

    <!--post-info-->
    <div class="post-info">
      <div class="likes">
        <img class="reposts" src="./images/respost.svg" onclick="repostCount(${
          post.id
        })">
        <img onclick="changeLike(${post.id})" src="${
      post.likeSt == true
        ? "./img/like-svgrepo-com.svg"
        : "./img/heart-svgrepo-com.svg"
    }" class="heart-svg" />
        
        <div>
          <strong> V.V.Putin,V.Zelenskiy,J.Baiden </strong>
          <span> and </span>
          <strong>${post.likes} others</strong>
        </div>
        
      </div>
      <strong>${post.name}</strong>
      <span> ${post.desription} </span>
      
      <div>
      <strong>Reposts: </strong>
      <span> ${post.reposts} </span>
    </div>
      </div>
    <div class="comments">
      <span class="comments_first-child">view all comments(${
        post.comments
      })</span>
    </div>
  </div>
        `;
  });
  checkTotalPages();
  checkAdmin();
}

let password = "";

function checkAdmin() {
  if (password === "123") {
    addPost.style.display = "block";
    adminIcon.style.display = "block";
    admin.style.display = "none";
    for (let i of displayEdDel) {
      i.style.display = "block";
    }
  } else {
    addPost.style.display = "none";
    for (let i of displayEdDel) {
      i.style.display = "none";
    }
  }
}

admin.addEventListener("click", function () {
  password = prompt("Введите пароль");
  checkAdmin();
});

async function setPostToStorage(newPost) {
  let options = {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch(`${API}`, options);
}

async function getPostsFromStorage() {
  const data = await fetch(
    `${API}?q=${searchValue}&_limit=${limit}&_page=${currentPage}`
  );
  const reslut = await data.json();
  return reslut;
}

async function getPostById(id) {
  const respons = await fetch(`${API}/${id}`);
  const result = await respons.json();
  return result;
}

//!==================================
openAddModalBtn.addEventListener("click", function () {
  addModal.style.display = "block";
});

clsAddModal.addEventListener("click", () => {
  addModal.style.display = "none";
});

addUrlInp.addEventListener("change", function () {
  imageForm.style.display = "block";
  displayImg.setAttribute("src", `${addUrlInp.value}`);
});
//?===================================

addNewPost.addEventListener("click", async function () {
  if (
    !addNameInp.value.trim() ||
    !addUrlInp.value.trim() ||
    !addDescInp.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }

  let newPost = {
    name: addNameInp.value,
    desription: addDescInp.value,
    url: addUrlInp.value,
    likeSt: false,
    likes: 0,
    comments: 0,
    views: 0,
    reposts: 0,
  };

  await setPostToStorage(newPost);
  addModal.style.display = "none";
  render();
  addNameInp.value = "";
  addDescInp.value = "";
  addUrlInp.value = "";
});

//!===========================================
let editId = "";

async function handleEdit(id) {
  editModal.style.display = "block";
  const postToEdit = await getPostById(id);
  console.log(postToEdit);
  inpEditName.value = postToEdit.name;
  inpEditUrl.value = postToEdit.url;
  inpEditDescripion.value = postToEdit.desription;
  editImgDisplay.setAttribute("src", `${postToEdit.url}`);
  editId = postToEdit.id;
}

saveBtn.addEventListener("click", () => {
  if (
    !inpEditName.value.trim() ||
    !inpEditDescripion.value.trim() ||
    !inpEditUrl.value.trim()
  ) {
    alert("Заполните все поля");
    return;
  }

  const editedPost = {
    name: inpEditName.value,
    desription: inpEditDescripion.value,
    url: inpEditUrl.value,
  };

  editProduct(editId, editedPost);
  editModal.style.display = "none";
});

clsEditModal.addEventListener("click", function () {
  editModal.style.display = "none";
});

async function editProduct(id, editedPost) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedPost),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  render();
}

//?========================================
async function deletePost(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  render();
}

async function changeLike(id) {
  const postToEditLike = await getPostById(id);

  const changedPost = {
    likeSt: !postToEditLike.likeSt,
    likes: postToEditLike.likes,
  };
  if (changedPost.likeSt == true) {
    changedPost.likes++;
  } else {
    changedPost.likes--;
  }

  editProduct(id, changedPost);
}

//!==========================================
inpSearch.addEventListener("input", function (e) {
  searchValue = e.target.value;
  render();
});
//?==========================================

//! ============== PAGINATION START ===============
let countPage = 1;
async function checkTotalPages() {
  const respons = await fetch(`${API}?q=${searchValue}`);
  const data = await respons.json();
  countPage = Math.ceil(data.length / limit);
}

prevBtn.addEventListener("click", function () {
  if (currentPage <= 1) return;
  currentPage--;
  render();
});

nextBtn.addEventListener("click", function () {
  if (currentPage >= countPage) return;
  currentPage++;
  render();
});

//? ============== PAGINTAION END ===============

async function repostCount(id) {
  const postReposts = await getPostById(id);
  postReposts.reposts++;
  let changedPost = {
    reposts: postReposts.reposts,
  };
  console.log(changedPost);
  editProduct(id, changedPost);
}
