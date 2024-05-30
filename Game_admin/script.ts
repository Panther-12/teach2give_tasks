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
const openModalButton = document.querySelector(".bg-indigo-600") as HTMLButtonElement;
const closeModalButton = document.getElementById("close-modal") as HTMLButtonElement;
const modalTitle = document.getElementById("modal-title") as HTMLHeadingElement;

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

async function handleFormSubmit(event: Event) {
    event.preventDefault();

    const id = (document.getElementById("product-id") as HTMLInputElement).value;
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

    closeModalButton.click(); // Close the modal after form submission
    await loadProducts();
}

async function loadProducts() {
    const response = await fetch("http://localhost:3000/products");
    const products: Product[] = await response.json();

    productList.innerHTML = "";
    products.forEach(product => {
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

        li.querySelector('button[data-id][class*="bg-red-600"]')?.addEventListener("click", () => {
            deleteProduct(product.id!);
        });

        li.querySelector('button[data-id][class*="bg-blue-600"]')?.addEventListener("click", () => {
            editProduct(product.id!);
        });
    });
}

async function createProduct(product: Product) {
    await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
}

async function updateProduct(id: string, product: Product) {
    await fetch(`http://localhost:3000/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
}

async function deleteProduct(id: string) {
    await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE"
    });
    await loadProducts();
}

async function editProduct(id: string) {
    const response = await fetch(`http://localhost:3000/products/${id}`);
    const product: Product = await response.json();

    (document.getElementById("product-id") as HTMLInputElement).value = product.id!;
    (document.getElementById("name") as HTMLInputElement).value = product.name;
    (document.getElementById("price") as HTMLInputElement).value = product.price.toString();
    (document.getElementById("description") as HTMLTextAreaElement).value = product.description;
    (document.getElementById("image-url") as HTMLInputElement).value = product.imageUrl;

    modalTitle.textContent = "Edit Game";
    modal.classList.remove("hidden");
}

loadProducts();
