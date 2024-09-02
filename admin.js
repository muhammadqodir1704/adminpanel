const cardWrapperAdmin = document.getElementById("cardWrapperAdmin");
const title = document.getElementById("title");
const price = document.getElementById("price");
const rate = document.getElementById("rate");
const imageUrl = document.getElementById("imageUrl");
const count = document.getElementById("count");
const btnAdd = document.getElementById("btnAdd");
const btnEdit = document.getElementById("btnEdit");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");

const editImage = document.getElementById("edit-image");
const inputEdit = document.getElementById("input-edit");
const editPrice = document.getElementById("input-edit-price");
const editRate = document.getElementById("input-edit-rate");
const editCount = document.getElementById("input-edit-count");

let editItemId = null;

const toastSuccess = (message) => {
  Toastify({
    text: message,
    duration: 2000,
    style: {
      paddingTop: "10px",
      margin: "20px",
      background: "rgb(79, 179, 79)",
      borderRadius: "10px",
      width: "200px",
      height: "50px",
      fontSize: "20px",
      textAlign: "center",
      color: "white",
      position: "fixed",
      zIndex: 1,
    },
  }).showToast();
};

const toastError = (message) => {
  Toastify({
    text: message,
    duration: 2000,
    style: {
      paddingTop: "10px",
      margin: "20px",
      background: "rgb(201, 68, 68)",
      borderRadius: "10px",
      width: "200px",
      height: "50px",
      fontSize: "20px",
      textAlign: "center",
      color: "white",
      position: "fixed",
      zIndex: 1,
    },
  }).showToast();
};

fetch("https://json-api-c6gv.onrender.com/products", {
  method: "GET",
})
  .then((res) => res.json())
  .then((json) =>
    json.forEach((element) => {
      printProductAdmin(element);
    })
  )
  .catch((err) => console.error(err));

function printProductAdmin(product) {
  const title = product.title.split(" ").slice(0, 2).join(" ");
  const sale = product.rating.count <= 250;
  const stars = Math.round(product.rating.rate);
  let star = "";

  for (let i = 0; i < stars; i++) {
    star += " <div class='bi-star-fill'></div>";
  }

  cardWrapperAdmin.innerHTML += `
      <div id="product-${product.id}" class="col mb-5">
        <div class="card h-100"> 
          ${
            sale
              ? `<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>`
              : ""
          }
          <img class="card-img-top p-4 object-fit-contain" style="width: 250px; height: 250px;" src="${
            product.image
          }" alt="${title}" />
          <div class="card-body p-4">
            <div class="text-center"> 
              <h5 class="fw-bolder">${title}...</h5>   
              <div class='d-flex justify-content-center small text-warning mb-2'>
                ${star}
              </div>
              $${product.price}
            </div>
          </div> 
          <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <button onclick="editProduct(${
              product.id
            })" class="btn btn-primary w-100 mb-3">Edit</button>
            <button onclick="deleteProduct(${
              product.id
            })" class="btn btn-danger w-100">Delete</button>
          </div>
        </div>
      </div>`;
}

function addCart() {
  const newProduct = {
    title: title.value,
    price: parseFloat(price.value),
    rating: {
      rate: parseFloat(rate.value),
      count: parseInt(count.value),
    },
    image: imageUrl.value,
  };
  if (
    !newProduct.title ||
    !newProduct.price ||
    !newProduct.rating.count ||
    !newProduct.image
  ) {
    alert("Barcha maydonlarni to'ldiring!");
    return;
  }
  fetch("https://json-api-c6gv.onrender.com/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProduct),
  })
    .then((res) => res.json())
    .then((data) => {
      printProductAdmin(data);
      toastSuccess("Mahsulot qo'shildi!");
      title.value = "";
      price.value = "";
      rate.value = "";
      count.value = "";
      imageUrl.value = "";
    })
    .catch((err) => console.error(err));
}

function deleteProduct(id) {
  fetch(`https://json-api-c6gv.onrender.com/products/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      document.getElementById(`product-${id}`).remove();
      toastSuccess("Mahsulot o'chirildi!");
    })
    .catch((err) => console.error(err));
}

function openModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function editProduct(productId) {
  fetch(`https://json-api-c6gv.onrender.com/products/${productId}`)
    .then((res) => res.json())
    .then((product) => {
      editItemId = productId;
      inputEdit.value = product.title;
      editImage.src = product.image;
      // editTitle.value = product.title;
      editPrice.value = product.price;
      editRate.value = product.rating.rate;
      openModal();
    })
    .catch((err) => console.error(err));
}

function saveEdit(event) {
  event.preventDefault();

  const newTitle = inputEdit.value.trim();
  const newPrice = parseFloat(editPrice.value);
  const newRate = parseFloat(editRate.value);
  const newCount = parseInt(editCount.value);
  const newImage = editImage.value;
  const updatedProduct = {
    title: newTitle,
    price: newPrice,
    rating: {
      rate: newRate,
      count: newCount,
    },
    image: newImage,
  };

  fetch(`https://json-api-c6gv.onrender.com/products/${editItemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProduct),
  })
    .then((res) => res.json())
    .then((updatedProduct) => {
      const productElement = document.getElementById(
        `product-${updatedProduct.id}`
      );

      productElement.querySelector(".fw-bolder").textContent =
        updatedProduct.title;
      productElement.querySelector(".card-img-top").src = updatedProduct.image;
      productElement.querySelector(
        ".text-center"
      ).lastChild.textContent = `$${updatedProduct.price}`;

      toastSuccess("Mahsulot  tahrirlandi!");
      closeModal();
    })
    .catch((err) => console.error("Xato:", err));
  closeModal();
}
