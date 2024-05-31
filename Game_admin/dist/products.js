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
const productList = document.getElementById("product-list");
const cartModal = document.getElementById("cart-modal");
const cartItemsList = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const cartButton = document.getElementById("cart-button");
const closeCartModalButton = document.getElementById("close-cart-modal");
const searchInput = document.getElementById("search-input");
function renderProducts(filteredProducts) {
    productList.innerHTML = filteredProducts.map(product => `
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
    }
});
cartItemsList.addEventListener("click", (event) => {
    var _a, _b;
    const target = event.target;
    if (target.classList.contains("remove-item") || target.closest(".remove-item")) {
        const productId = target.getAttribute("data-id") || ((_a = target.closest(".remove-item")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id"));
        if (productId)
            updateCartItem(productId, false);
    }
    else if (target.classList.contains("add-item") || target.closest(".add-item")) {
        const productId = target.getAttribute("data-id") || ((_b = target.closest(".add-item")) === null || _b === void 0 ? void 0 : _b.getAttribute("data-id"));
        if (productId)
            updateCartItem(productId, true);
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
loadProducts();
renderCart();
