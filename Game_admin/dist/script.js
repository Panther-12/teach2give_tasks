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
// Function to show success notification
function showSuccessNotification(message) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");
    if (notification && notificationMessage) {
        notification.classList.remove("hidden");
        notification.classList.remove("bg-red-500");
        notification.classList.add("bg-green-500");
        notificationMessage.textContent = message;
        setTimeout(() => {
            hideNotification();
        }, 3000); // Hide notification after 3 seconds
    }
}
// Function to show error notification
function showErrorNotification(message) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");
    if (notification && notificationMessage) {
        notification.classList.remove("hidden");
        notification.classList.remove("bg-green-500");
        notification.classList.add("bg-red-500");
        notificationMessage.textContent = message;
    }
}
// Function to hide notification
function hideNotification() {
    const notification = document.getElementById("notification");
    if (notification) {
        notification.classList.add("hidden");
    }
}
// Event listener to close notification
const closeNotificationButton = document.getElementById("close-notification");
if (closeNotificationButton) {
    closeNotificationButton.addEventListener("click", () => {
        hideNotification();
    });
}
// Get elements from the DOM
const productForm = document.getElementById("product-form");
const productList = document.getElementById("product-list");
const modal = document.getElementById("modal");
const openModalButton = document.getElementById("open-modal");
const closeModalButton = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const searchInput = document.getElementById("search-input");
const pagination = document.getElementById("pagination");
// Initialize variables
let currentPage = 1;
const itemsPerPage = 6;
let products = [];
// Open modal button event listener
openModalButton.addEventListener("click", () => {
    modalTitle.textContent = "Add New Game";
    document.getElementById("product-id").value = "";
    productForm.reset();
    modal.classList.remove("hidden");
});
// Close modal button event listener
closeModalButton.addEventListener("click", () => {
    modal.classList.add("hidden");
});
productForm.addEventListener("submit", handleFormSubmit);
searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderProducts();
});
// Handle form submit function
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
        closeModalButton.click();
        yield loadProducts();
    });
}
// Load products function
function loadProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("http://localhost:3000/products");
        products = yield response.json();
        renderProducts();
    });
}
// Render products function
function renderProducts() {
    const searchQuery = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery));
    const paginatedProducts = paginate(filteredProducts, currentPage, itemsPerPage);
    // Clear the product list before rendering
    productList.innerHTML = "";
    // Render products for the current page
    paginatedProducts.forEach(product => {
        var _a, _b;
        const li = document.createElement("li");
        li.className = "bg-white rounded-lg shadow-md p-4 flex flex-col";
        li.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-48 object-cover mb-4 rounded-md">
            <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
            <p class="text-gray-700 mb-2">$${product.price}</p>
            <p class="text-gray-700 mb-4">${product.description}</p>
            <div class="flex justify-between">
                <!-- Delete Icon -->
                <button class="delete text-red-600 p-2 rounded-full" data-id="${product.id}" onclick="deleteProduct('${product.id}')">
                    <i class="fas fa-trash"></i>
                </button>
                <!-- Edit Icon -->
                <button class="edit text-indigo-600 p-2 rounded-full" data-id="${product.id}" onclick="editProduct('${product.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        `;
        productList.appendChild(li);
        (_a = li.querySelector('button[data-id][class*="delete"]')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            deleteProduct(product.id);
        });
        (_b = li.querySelector('button[data-id][class*="edit"]')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            editProduct(product.id);
        });
    });
    // Render pagination controls
    renderPagination(filteredProducts.length);
}
// Paginate function
function paginate(array, currentPage, itemsPerPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return array.slice(startIndex, startIndex + itemsPerPage);
}
// Render pagination function
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    // Clear previous pagination buttons
    pagination.innerHTML = "";
    // Render previous page button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.className = "bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md mr-2";
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
        }
    });
    pagination.appendChild(prevButton);
    // Render page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i.toString();
        pageButton.className = currentPage === i ? "bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md mx-1" : "bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md mx-1";
        pageButton.addEventListener("click", () => {
            currentPage = i;
            renderProducts();
        });
        pagination.appendChild(pageButton);
    }
    // Render next page button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.className = "bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md ml-2";
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
        }
    });
    pagination.appendChild(nextButton);
}
// Create product function
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
// Update product function
function updateProduct(id, product) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`http://localhost:3000/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });
        showSuccessNotification("Product updated successfully!");
    });
}
// Delete product function
function deleteProduct(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`http://localhost:3000/products/${id}`, {
            method: "DELETE"
        });
        yield loadProducts();
        showSuccessNotification("Product deleted successfully!");
    });
}
// Edit product function
function editProduct(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:3000/products/${id}`);
        const product = yield response.json();
        document.getElementById("product-id").value = product.id.toString();
        document.getElementById("name").value = product.name;
        document.getElementById("price").value = product.price.toString();
        document.getElementById("description").value = product.description;
        document.getElementById("image-url").value = product.imageUrl;
        modalTitle.textContent = "Edit Game";
        modal.classList.remove("hidden");
    });
}
// Runs on document load to ensure the products are loaded
loadProducts();
