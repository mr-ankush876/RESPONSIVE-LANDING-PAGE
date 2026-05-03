document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Hamburger Menu ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Cart Functionality ---
    let cart = [];
    
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartBadge = document.getElementById('cart-badge');
    const totalPriceEl = document.getElementById('total-price');

    // Toggle Cart
    function toggleCart() {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('open');
    }

    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart();
    });

    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Add to Cart
    const addButtons = document.querySelectorAll('.btn-add');
    
    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.menu-card');
            const name = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace('$', ''));
            const imageSrc = card.querySelector('img').src;

            addToCart({ name, price, imageSrc });
            
            // Visual feedback
            const originalText = button.innerText;
            button.innerText = 'Added!';
            button.style.background = 'var(--primary)';
            button.style.color = '#fff';
            
            setTimeout(() => {
                button.innerText = originalText;
                button.style.background = '#fff';
                button.style.color = 'var(--primary)';
            }, 1000);
        });
    });

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.name === item.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        
        updateCartUI();
    }

    function removeFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        updateCartUI();
    }

    function changeQuantity(name, amount) {
        const item = cart.find(cartItem => cartItem.name === name);
        if (item) {
            item.quantity += amount;
            if (item.quantity <= 0) {
                removeFromCart(name);
            } else {
                updateCartUI();
            }
        }
    }

    function updateCartUI() {
        // Update badge
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.innerText = totalItems;

        // Render items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            totalPriceEl.innerText = '$0.00';
            return;
        }

        let html = '';
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            html += `
                <div class="cart-item">
                    <img src="${item.imageSrc}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                        <div class="cart-item-actions">
                            <button onclick="changeQuantity('${item.name.replace(/'/g, "\\'")}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="changeQuantity('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
                        </div>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">&times;</button>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html;
        totalPriceEl.innerText = '$' + total.toFixed(2);
    }

    // Expose functions to global scope for inline onclick handlers
    window.changeQuantity = changeQuantity;
    window.removeFromCart = removeFromCart;
});
