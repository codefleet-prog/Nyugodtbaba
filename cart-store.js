/**
 * Nyugodtbaba Cart System
 * Handles localStorage-based cart persistence across all pages.
 */
const NyugodtbabaCart = (() => {
    const STORAGE_KEY = 'nyugodtbaba_cart';

    // Product catalog (single source of truth)
    const PRODUCTS = {
        'nyugodt-baba': {
            id: 'nyugodt-baba',
            name: 'Nyugodt baba, nyugodt anya',
            price: 4990,
            oldPrice: 5988,
            image: 'assets/product_bundle.png',
            desc: 'Gyakorlati kísérő az első hetekhez.'
        },
        'nyugodt-estek': {
            id: 'nyugodt-estek',
            name: 'Nyugodt esték, jobb alvás',
            price: 5990,
            oldPrice: 7188,
            image: 'assets/product_bundle.png',
            desc: 'Haladóbb altatási és esti rutin útmutató.'
        },
        'teljes-csomag': {
            id: 'teljes-csomag',
            name: 'Teljes nyugalom csomag',
            price: 8990,
            oldPrice: 10788,
            image: 'assets/product_bundle.png',
            desc: 'Mindkét digitális útmutató egy csomagban.'
        }
    };

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }

    function addItem(productId, qty = 1) {
        const product = PRODUCTS[productId];
        if (!product) return;

        const cart = getCart();
        const existing = cart.find(item => item.id === productId);

        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({ id: productId, qty });
        }

        saveCart(cart);
        updateAllBadges();
    }

    function removeItem(productId) {
        let cart = getCart();
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        updateAllBadges();
    }

    function updateQty(productId, newQty) {
        const cart = getCart();
        const item = cart.find(i => i.id === productId);
        if (!item) return;

        if (newQty <= 0) {
            removeItem(productId);
            return;
        }
        item.qty = newQty;
        saveCart(cart);
        updateAllBadges();
    }

    function getItemCount() {
        return getCart().reduce((sum, item) => sum + item.qty, 0);
    }

    function getTotal() {
        return getCart().reduce((sum, item) => {
            const product = PRODUCTS[item.id];
            return product ? sum + product.price * item.qty : sum;
        }, 0);
    }

    function getCartWithProducts() {
        return getCart().map(item => ({
            ...item,
            product: PRODUCTS[item.id]
        })).filter(item => item.product);
    }

    function clearCart() {
        localStorage.removeItem(STORAGE_KEY);
        updateAllBadges();
    }

    function formatPrice(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Ft';
    }

    function updateAllBadges() {
        const count = getItemCount();
        document.querySelectorAll('.cart-badge').forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    return {
        PRODUCTS,
        getCart,
        addItem,
        removeItem,
        updateQty,
        getItemCount,
        getTotal,
        getCartWithProducts,
        clearCart,
        formatPrice,
        updateAllBadges
    };
})();

// Update badges on every page load
document.addEventListener('DOMContentLoaded', () => {
    NyugodtbabaCart.updateAllBadges();
});
