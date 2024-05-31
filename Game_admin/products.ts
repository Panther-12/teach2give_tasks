type Product = {
    id?: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    rating: number;
};

document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.getElementById("cart-button") as HTMLAnchorElement;
});

// Get products function
async function loadProducts() {
    const response = await fetch("http://localhost:3000/products");
    products = await response.json();
    renderProducts(products);
}

function renderRating(rating: number) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Default incase no products are fetched
var products: Product[] = [
    { id: "1", name: "Game Title 1", description: "Description for Game 1", price: 29.99, imageUrl: "https://via.placeholder.com/150", rating: 4},
    { id: "2", name: "Game Title 2", description: "Description for Game 2", price: 39.99, imageUrl: "https://via.placeholder.com/150", rating:3 },
    { id: "3", name: "Game Title 3", description: "Description for Game 3", price: 49.99, imageUrl: "https://via.placeholder.com/150", rating: 5 },
];

interface CartItem extends Product {
    quantity: number;
}

let cart: CartItem[] = [];

const productList = document.getElementById("product-list") as HTMLUListElement;
const cartModal = document.getElementById("cart-modal") as HTMLDivElement;
const cartItemsList = document.getElementById("cart-items") as HTMLUListElement;
const totalPriceElement = document.getElementById("total-price") as HTMLSpanElement;
const cartButton = document.getElementById("cart-button") as HTMLAnchorElement;
const closeCartModalButton = document.getElementById("close-cart-modal") as HTMLButtonElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;

function renderProducts(filteredProducts: Product[]) {
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

function addToCart(productId: string) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
}

function updateCartItem(productId: string, increment: boolean) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    if (increment) {
        cartItem.quantity++;
    } else {
        cartItem.quantity--;
        if (cartItem.quantity === 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    }

    renderCart();
}

function filterProducts(query: string) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(filteredProducts);
}

productList.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("add-to-cart") || target.closest(".add-to-cart")) {
        const productId = target.getAttribute("data-id") || target.closest(".add-to-cart")?.getAttribute("data-id");
        if (productId) addToCart(productId);
        showSuccessNot("Item added to cart");
    }
});

cartItemsList.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("remove-item") || target.closest(".remove-item")) {
        const productId = target.getAttribute("data-id") || target.closest(".remove-item")?.getAttribute("data-id");
        if (productId) updateCartItem(productId, false);
        showSuccessNot("Item removed from cart");
    } else if (target.classList.contains("add-item") || target.closest(".add-item")) {
        const productId = target.getAttribute("data-id") || target.closest(".add-item")?.getAttribute("data-id");
        if (productId) updateCartItem(productId, true);
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
    const query = (event.target as HTMLInputElement).value;
    filterProducts(query);
});


// Notification handling
// Define types
type NotElement = HTMLElement | null;

// Function to show success notification
function showSuccessNot(message: string) {
    const notification: NotificationElement = document.getElementById("notification");
    const notificationMessage: HTMLElement | null = document.getElementById("notification-message");
    if (notification && notificationMessage) {
        notification.classList.remove("hidden");
        notification.classList.remove("bg-red-300");
        notification.classList.add("bg-green-300");
        notificationMessage.textContent = message;
        setTimeout(() => {
            hideNot();
        }, 3000); // Hide notification after 3 seconds
    }
}

// Function to show error notification
function showErrorNot(message: string) {
    const notification: NotElement = document.getElementById("notification");
    const notificationMessage: HTMLElement | null = document.getElementById("notification-message");
    if (notification && notificationMessage) {
        notification.classList.remove("hidden");
        notification.classList.remove("bg-green-300");
        notification.classList.add("bg-red-300");
        notificationMessage.textContent = message;
    }
}

// Function to hide notification
function hideNot() {
    const notification: NotificationElement = document.getElementById("notification");
    if (notification) {
        notification.classList.add("hidden");
    }
}

// Event listener to close notification
const closeNot: NotElement = document.getElementById("close-notification");
if (closeNot) {
    closeNot.addEventListener("click", () => {
        hideNot();
    });
}


loadProducts();
renderCart();
