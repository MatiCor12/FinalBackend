document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/sessions/current', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.user && data.user.cart) {
                cartId = data.user.cart;
            } else {
                console.error('Cart not found in user session');
            }
        } else {
            console.error('Error getting cart', response.statusText);
        }
    } catch (error) {
        console.error('Error getting cart', error);
    }
    fetchProducts();
});

document.getElementById('filterForm').addEventListener('change', function() {
    fetchProducts();
});

async function fetchProducts(page = 1) {
    const query = document.getElementById('query').value;
    const availability = document.getElementById('availability').value;
    const sort = document.getElementById('sort').value;

    const limit = 6;

    const url = new URL('/api/products', window.location.origin);
    url.searchParams.set('query', query);
    url.searchParams.set('availability', availability);
    url.searchParams.set('sort', sort);
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching products: ${response.statusText}`);
        }
        const data = await response.json();
        renderProducts(data.payload);
        renderPagination(data);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function renderProducts(products) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    products.forEach(product => {
        const productCard = `
            <div>
                <div>
                    <div>
                        Code: ${product.code}
                    </div>
                    <div>
                        <h5 id="title">${product.title}</h5>
                        <ul>
                            <li><i class="bi bi-currency-dollar"></i> Price: $${product.price}</li>
                            <li><i class="bi bi-currency-house"></i> Category: ${product.category}</li>
                            <li><i class="bi bi-check-circle"></i> Status: ${product.status}</li>
                            <li>
                                <img src="${product.thumbnail || 'default-image.jpg'}" alt="${product.title}">
                            </li>
                        </ul>
                        <div>
                            <button class="btn btn-success text-lg product" data-value="${product.stock}" id="${product._id}">Agregar al carrito</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });

    document.querySelectorAll('.product').forEach(button => {
        button.addEventListener('click', () => {
            Swal.fire({
                title: 'Cantidad a agregar',
                input: 'number',
                inputAttributes: {
                    min: 1,
                    step: 1
                },
                showCancelButton: true,
                confirmButtonText: 'Agregar',
                cancelButtonText: 'Cancelar',
                showLoaderOnConfirm: true,
                preConfirm: (quantity) => {
                    if (quantity <= 0) {
                        Swal.showValidationMessage('The quantity must be greater than zero');
                    }
                    return quantity;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const cartElement = document.querySelector("#cartid");
                    const cartId = cartElement.getAttribute("data-value");
                    if (cartId) {
                        addToCart(cartId, button.id, parseInt(result.value, 10));
                    } else {
                        Swal.fire('Error', 'Cart not found', 'error');
                    }
                }
            });
        });
    });
}

async function addToCart(cartId, productId, quantity) {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        Swal.fire('Product added', 'The product has been added to the cart', 'success');
    } catch (error) {
        console.error('Error when adding product to cart', error);
        Swal.fire('Error', 'Could not add product to cart', 'error');
    }
}

function renderPagination(data) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const prevPage = data.hasPrevPage ? `<a href="#" onclick="fetchProducts(${data.prevPage}); return false;" class="btn btn-primary">Prev Page</a>` : `<span class="btn btn-secondary disabled">Prev Page</span>`;
    const nextPage = data.hasNextPage ? `<a href="#" onclick="fetchProducts(${data.nextPage}); return false;" class="btn btn-primary">Next Page</a>` : `<span class="btn btn-secondary disabled">Next Page</span>`;

    pagination.innerHTML = `${prevPage} ${nextPage}`;
}