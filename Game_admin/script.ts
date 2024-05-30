type Product = {
    id?: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
};

const productForm = document.getElementById("product-form") as HTMLFormElement;
const productList = document.getElementById("product-list") as HTMLUListElement;
const modal = document.getElementById("modal") as HTMLDivElement;
const openModalButton = document.getElementById("open-modal") as HTMLButtonElement;
const closeModalButton = document.getElementById("close-modal") as HTMLButtonElement;
const modalTitle = document.getElementById("modal-title") as HTMLHeadingElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const pagination = document.getElementById("pagination") as HTMLDivElement;

let currentPage = 1;
const itemsPerPage = 6;
let products: Product[] = [];

openModalButton.addEventListener("click", () => {
    modalTitle.textContent = "Add New Game";
    (document.getElementById("product-id") as HTMLInputElement).value = "";
    productForm.reset();
    modal.classList.remove("hidden");
});

closeModalButton.addEventListener("click", () => {
    modal.classList.add("hidden");
});

productForm.addEventListener("submit", handleFormSubmit);

searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderProducts();
});

// Handle form submit function
async function handleFormSubmit(event: Event) {
    event.preventDefault();

    const id = (document.getElementById("product-id") as HTMLInputElement).value as string;
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const price = parseFloat((document.getElementById("price") as HTMLInputElement).value);
    const description = (document.getElementById("description") as HTMLTextAreaElement).value;
    const imageUrl = (document.getElementById("image-url") as HTMLInputElement).value;

    const product: Product = { name, price, description, imageUrl };

    if (id) {
        await updateProduct(id, product);
    } else {
        await createProduct(product);
    }

    closeModalButton.click();
    await loadProducts();
}

// Load products function
async function loadProducts() {
    const response = await fetch("http://localhost:3000/products");
    products = await response.json();
    renderProducts();
}

// Render products function
function renderProducts() {
    const searchQuery = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery)
    );

    const paginatedProducts = paginate(filteredProducts, currentPage, itemsPerPage);

    // Clear the product list before rendering
    productList.innerHTML = "";

    // Render products for the current page
    paginatedProducts.forEach(product => {
        const li = document.createElement("li");
        li.className = "bg-white rounded-lg shadow-md p-4 flex flex-col";
        li.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-48 object-cover mb-4 rounded-md">
            <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
            <p class="text-gray-700 mb-2">$${product.price}</p>
            <p class="text-gray-700 mb-4">${product.description}</p>
            <div class="flex justify-between">
                <button class="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700" data-id="${product.id}" onclick="deleteProduct('${product.id}')">Delete</button>
                <button class="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700" data-id="${product.id}" onclick="editProduct('${product.id}')">Edit</button>
            </div>
        `;
        productList.appendChild(li);

        li.querySelector('button[data-id][class*="bg-red-600"]')?.addEventListener("click", () => {
            deleteProduct(product.id!);
        });

        li.querySelector('button[data-id][class*="bg-blue-600"]')?.addEventListener("click", () => {
            editProduct(product.id!);
        });
    });

    // Render pagination controls
    renderPagination(filteredProducts.length);
}

// Paginate function
function paginate(array: any[], currentPage: number, itemsPerPage: number) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return array.slice(startIndex, startIndex + itemsPerPage);
}

// Render pagination function
function renderPagination(totalItems: number) {
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
async function createProduct(product: Product) {
    await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
}

// Update product function
async function updateProduct(id: string, product: Product) {
    await fetch(`http://localhost:3000/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
}

// Delete product function
async function deleteProduct(id: string) {
    await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE"
    });
    await loadProducts();
}

// Edit product function
async function editProduct(id: string) {
    const response = await fetch(`http://localhost:3000/products/${id}`);
    const product: Product = await response.json();

    (document.getElementById("product-id") as HTMLInputElement).value = product.id!.toString();
    (document.getElementById("name") as HTMLInputElement).value = product.name;
    (document.getElementById("price") as HTMLInputElement).value = product.price.toString();
    (document.getElementById("description") as HTMLTextAreaElement).value = product.description;
    (document.getElementById("image-url") as HTMLInputElement).value = product.imageUrl;

    modalTitle.textContent = "Edit Game";
    modal.classList.remove("hidden");
}

// Runs on document load to ensure the products are loaded
loadProducts();