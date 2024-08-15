async function removeFromCart(cartId, productId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            Swal.fire({
                title: 'Product deleted',
                text: 'The product has been removed from the cart',
                icon: 'success',
            }).then(() => {
                location.reload();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'There was an error removing the product from the cart',
                icon: 'error',
            });
        }
    } catch (error) {
        console.error('Error removing product from cart', error);
        Swal.fire({
            title: 'Error',
            text: 'There was an error removing the product from the cart',
            icon: 'error',
        });
    }
}

// Función para vaciar el carrito
async function emptyCart(cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            Swal.fire({
                title: 'Empty cart',
                text: 'All products have been removed from the cart',
                icon: 'success',
            }).then(() => {
                location.reload();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'There was an error emptying the cart',
                icon: 'error',
            });
        }
    } catch (error) {
        console.error('Error emptying cart', error);
        Swal.fire({
            title: 'Error',
            text: 'There was an error emptying the cart',
            icon: 'error',
        });
    }
}