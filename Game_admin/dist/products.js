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
document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.getElementById("cart-button");
});
// Get products function
function loadProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("http://localhost:3000/products");
        products = yield response.json();
        renderProducts(products);
    });
}
function renderRating(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '<i class="fas fa-star"></i>';
        }
        else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}
// Default incase no products are fetched
var products = [
    { id: "1", name: "Game Title 1", description: "Description for Game 1", price: 29.99, imageUrl: "https://via.placeholder.com/150", rating: 4 },
    { id: "2", name: "Game Title 2", description: "Description for Game 2", price: 39.99, imageUrl: "https://via.placeholder.com/150", rating: 3 },
    { id: "3", name: "Game Title 3", description: "Description for Game 3", price: 49.99, imageUrl: "https://via.placeholder.com/150", rating: 5 },
];
let cart = [];
let currentPage2 = 1;
const itemsPerPage2 = 6;
const productList = document.getElementById("product-list");
const cartModal = document.getElementById("cart-modal");
const cartItemsList = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const cartButton = document.getElementById("cart-button");
const closeCartModalButton = document.getElementById("close-cart-modal");
const searchInput = document.getElementById("search-input");
const pagination2 = document.getElementById("pagination");
function renderProducts(filteredProducts) {
    const searchQuery = searchInput.value.toLowerCase();
    filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery));
    const paginatedProducts = paginate2(filteredProducts, currentPage2, itemsPerPage2);
    // Clear the product list before rendering
    productList.innerHTML = "";
    productList.innerHTML = paginatedProducts.map(product => `
        <li class="card">
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3 class="card-title">${product.name}</h3>
            <p class="card-description">${product.description}</p>
            <div class="card-rating">${renderRating(product.rating)}</div>
            <div class="card-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart" data-id="${product.id}">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
        </li>
    `).join('');
    // Render pagination controls
    renderPagination2(filteredProducts.length);
}
// Paginate function
function paginate2(array, currentPage, itemsPerPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return array.slice(startIndex, startIndex + itemsPerPage);
}
// Render pagination function
function renderPagination2(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage2);
    // Clear previous pagination buttons
    pagination2.innerHTML = "";
    // Render previous page button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.className = "bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md mr-2";
    prevButton.addEventListener("click", () => {
        if (currentPage2 > 1) {
            currentPage2--;
            renderProducts();
        }
    });
    pagination2.appendChild(prevButton);
    // Render page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i.toString();
        pageButton.className = currentPage2 === i ? "bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md mx-1" : "bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md mx-1";
        pageButton.addEventListener("click", () => {
            currentPage2 = i;
            renderProducts();
        });
        pagination2.appendChild(pageButton);
    }
    // Render next page button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.className = "bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-md ml-2";
    nextButton.addEventListener("click", () => {
        if (currentPage2 < totalPages) {
            currentPage2++;
            renderProducts();
        }
    });
    pagination2.appendChild(nextButton);
}
function renderCart() {
    cartItemsList.innerHTML = cart.map(item => `
        <li class="cart-item">
            <span class="item-name">${item.name}</span>
            <div class="item-controls">
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="add-item" data-id="${item.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </li>
    `).join('');
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    totalPriceElement.textContent = totalPrice.toFixed(2);
}
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product)
        return;
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    }
    else {
        cart.push(Object.assign(Object.assign({}, product), { quantity: 1 }));
    }
    renderCart();
}
function updateCartItem(productId, increment) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem)
        return;
    if (increment) {
        cartItem.quantity++;
    }
    else {
        cartItem.quantity--;
        if (cartItem.quantity === 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    }
    renderCart();
}
function filterProducts(query) {
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
    renderProducts(filteredProducts);
}
productList.addEventListener("click", (event) => {
    var _a;
    const target = event.target;
    if (target.classList.contains("add-to-cart") || target.closest(".add-to-cart")) {
        const productId = target.getAttribute("data-id") || ((_a = target.closest(".add-to-cart")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id"));
        if (productId)
            addToCart(productId);
        showSuccessNot("Item added to cart");
    }
});
cartItemsList.addEventListener("click", (event) => {
    var _a, _b;
    const target = event.target;
    if (target.classList.contains("remove-item") || target.closest(".remove-item")) {
        const productId = target.getAttribute("data-id") || ((_a = target.closest(".remove-item")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id"));
        if (productId)
            updateCartItem(productId, false);
        showSuccessNot("Item removed from cart");
    }
    else if (target.classList.contains("add-item") || target.closest(".add-item")) {
        const productId = target.getAttribute("data-id") || ((_b = target.closest(".add-item")) === null || _b === void 0 ? void 0 : _b.getAttribute("data-id"));
        if (productId)
            updateCartItem(productId, true);
        showSuccessNot("Item added to cart");
    }
});
cartButton.addEventListener("click", () => {
    cartModal.style.visibility = "visible";
    cartModal.style.opacity = "1";
});
closeCartModalButton.addEventListener("click", () => {
    cartModal.style.visibility = "hidden";
    cartModal.style.opacity = "0";
});
searchInput.addEventListener("input", (event) => {
    const query = event.target.value;
    filterProducts(query);
});
// Function to show success notification
function showSuccessNot(message) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");
    if (notification && notificationMessage) {
        notification.classList.remove("hidden");
        notification.classList.remove("bg-red-200");
        notification.classList.add("bg-green-200");
        notificationMessage.textContent = message;
        setTimeout(() => {
            hideNot();
        }, 3000); // Hide notification after 3 seconds
    }
}
// Function to show error notification
function showErrorNot(message) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");
    if (notification && notificationMessage) {
        notification.classList.remove("hidden");
        notification.classList.remove("bg-green-200");
        notification.classList.add("bg-red-200");
        notificationMessage.textContent = message;
    }
}
// Function to hide notification
function hideNot() {
    const notification = document.getElementById("notification");
    if (notification) {
        notification.classList.add("hidden");
    }
}
// Event listener to close notification
const closeNot = document.getElementById("close-notification");
if (closeNot) {
    closeNot.addEventListener("click", () => {
        hideNot();
    });
}
loadProducts();
renderCart();
