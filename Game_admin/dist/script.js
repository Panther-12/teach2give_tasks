"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const productForm = document.getElementById("product-form");
const productList = document.getElementById("product-list");
const modal = document.getElementById("modal");
const openModalButton = document.querySelector(".bg-indigo-600");
const closeModalButton = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const searchInput = document.getElementById("search-input");
openModalButton.addEventListener("click", () => {
    modalTitle.textContent = "Add New Game";
    document.getElementById("product-id").value = "";
    productForm.reset();
    modal.classList.remove("hidden");
});
closeModalButton.addEventListener("click", () => {
    modal.classList.add("hidden");
});
productForm.addEventListener("submit", handleFormSubmit);
searchInput.addEventListener("input", handleSearch);
function handleFormSubmit(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const id = document.getElementById("product-id").value;
        const name = document.getElementById("name").value;
        const price = parseFloat(document.getElementById("price").value);
        const description = document.getElementById("description").value;
        const imageUrl = document.getElementById("image-url").value;
        const product = { name, price, description, imageUrl };
        if (id) {
            yield updateProduct(id, product);
        }
        else {
            yield createProduct(product);
        }
        closeModalButton.click(); // Close the modal after form submission
        yield loadProducts();
    });
}
function loadProducts() {
    return __awaiter(this, arguments, void 0, function* (query = "") {
        const response = yield fetch("http://localhost:3000/products");
        const products = yield response.json();
        const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
        productList.innerHTML = "";
        filteredProducts.forEach(product => {
            var _a, _b;
            const li = document.createElement("li");
            li.className = "bg-white rounded-lg shadow-md p-4 flex flex-col";
            li.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-48 object-cover mb-4 rounded-md">
            <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
            <p class="text-gray-700 mb-2">$${product.price}</p>
            <p class="text-gray-700 mb-4">${product.description}</p>
            <div class="flex justify-between">
                <button class="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700" data-id="${product.id}">Delete</button>
                <button class="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700" data-id="${product.id}">Edit</button>
            </div>
        `;
            productList.appendChild(li);
            (_a = li.querySelector('button[data-id][class*="bg-red-600"]')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                deleteProduct(product.id);
            });
            (_b = li.querySelector('button[data-id][class*="bg-blue-600"]')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
                editProduct(product.id);
            });
        });
    });
}
function createProduct(product) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch("http://localhost:3000/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });
    });
}
function updateProduct(id, product) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`http://localhost:3000/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });
    });
}
function deleteProduct(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`http://localhost:3000/products/${id}`, {
            method: "DELETE"
        });
        yield loadProducts();
    });
}
function editProduct(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:3000/products/${id}`);
        const product = yield response.json();
        document.getElementById("product-id").value = product.id;
        document.getElementById("name").value = product.name;
        document.getElementById("price").value = product.price.toString();
        document.getElementById("description").value = product.description;
        document.getElementById("image-url").value = product.imageUrl;
        modalTitle.textContent = "Edit Game";
        modal.classList.remove("hidden");
    });
}
function handleSearch(event) {
    const query = event.target.value;
    loadProducts(query);
}
loadProducts();
