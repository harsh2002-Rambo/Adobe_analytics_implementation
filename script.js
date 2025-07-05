// Product data
const products = [
    {
        id: 1,
        title: "RGB Gaming Keyboard",
        description: "Mechanical keyboard with customizable RGB lighting and anti-ghosting technology",
        price: 149.99,
        image: "⌨️",
        rating: 4.8,
        category: "keyboard"
    },
    {
        id: 2,
        title: "Pro Gaming Mouse",
        description: "High-precision gaming mouse with 16000 DPI and programmable buttons",
        price: 89.99,
        image: "🖱️",
        rating: 4.9,
        category: "mouse"
    },
    {
        id: 3,
        title: "Gaming Headset",
        description: "7.1 Surround Sound Gaming Headset with noise-canceling microphone",
        price: 199.99,
        image: "🎧",
        rating: 4.7,
        category: "audio"
    },
    {
        id: 4,
        title: "Gaming Monitor 27\"",
        description: "144Hz QHD Gaming Monitor with 1ms response time and G-Sync",
        price: 449.99,
        image: "🖥️",
        rating: 4.8,
        category: "monitor"
    },
    {
        id: 5,
        title: "Gaming Chair",
        description: "Ergonomic RGB gaming chair with lumbar support and adjustable height",
        price: 299.99,
        image: "🪑",
        rating: 4.6,
        category: "furniture"
    },
    {
        id: 6,
        title: "Mechanical Switches",
        description: "Premium mechanical switches for custom keyboard builds",
        price: 49.99,
        image: "🔧",
        rating: 4.9,
        category: "accessories"
    },
    {
        id: 7,
        title: "Gaming Mousepad XXL",
        description: "Extended RGB gaming mousepad with smooth surface and LED lighting",
        price: 39.99,
        image: "📱",
        rating: 4.5,
        category: "accessories"
    },
    {
        id: 8,
        title: "Webcam 4K",
        description: "4K streaming webcam with auto-focus and built-in microphone",
        price: 129.99,
        image: "📹",
        rating: 4.7,
        category: "streaming"
    },
    {
        id: 9,
        title: "Gaming Controller",
        description: "Wireless gaming controller with haptic feedback and RGB lighting",
        price: 79.99,
        image: "🎮",
        rating: 4.8,
        category: "controller"
    },
    {
        id: 10,
        title: "Graphics Card RTX 4090",
        description: "High-end graphics card for 4K gaming and ray tracing",
        price: 1599.99,
        image: "💾",
        rating: 5.0,
        category: "hardware"
    },
    {
        id: 11,
        title: "Gaming Laptop Cooling fan",
        description: "RGB cooling pad with 6 fans for optimal laptop temperature",
        price: 69.99,
        image: "🌀",
        rating: 4.4,
        category: "cooling"
    },
    {
        id: 12,
        title: "PS5",
        description: "Discover and play games.",
        price: 29.99,
        image: "💡",
        rating: 4.6,
        category: "lighting"
    }
];

// Cart state
let cart = JSON.parse(localStorage.getItem('gamezone_cart')) || [];
let isCartView = false;
let currentFilter = 'all';

// --- Digital Data Object Initialization ---
// This object will hold all the data we want to send to Adobe Analytics via Launch.
// Launch will be configured to read values from this object.
window.digitalData = window.digitalData || {};

// Initialize the page on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Set initial page-level data for Adobe Analytics
    // This data will be picked up by a Page Load Rule in Adobe Launch
    digitalData.page = {
        pageName: document.title,
        pageURL: window.location.href,
        pagePath: window.location.pathname,
        siteSection: getSiteSection(window.location.pathname) // Helper function below
    };

    // --- Adobe Analytics Page View Tracking (via Launch) ---
    // Instead of s.t() directly, we'll trigger a custom event that Launch listens for.
    // This is a common pattern when using a data layer with Launch.
    // Launch will have a rule that fires an Adobe Analytics beacon when 'pageView' event occurs.
    if (typeof _satellite !== 'undefined' && _satellite.track) {
        _satellite.track('pageView');
        console.log('Adobe Launch: Page view event tracked via digitalData and _satellite.track("pageView")');
    } else {
        console.warn('Adobe Launch: _satellite object not found. Ensure Launch embed code is loaded.');
    }

    init(); // Initialize the website
});

// Helper function to determine site section
function getSiteSection(pathname) {
    if (pathname.includes('products.html')) {
        return 'Products';
    } else if (pathname.includes('index.html') || pathname === '/') {
        return 'Home';
    } else if (pathname.includes('cart')) { // Assuming a /cart path if you had one, or based on cart view state
        return 'Cart';
    }
    return 'Other';
}

// Initialize the page
function init() {
    // Only render products if we're on the products page
    if (document.getElementById('productsGrid')) {
        renderProducts();
        setupFilterButtons();
    }
    updateCartCount();
    setupNavigation();
}

// Setup navigation for smooth scrolling on same page
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Handle anchor links on the same page
            if (href.includes('#') && href.includes(window.location.pathname.split('/').pop())) {
                e.preventDefault();
                
                // If we're in cart view, switch back to main page first
                if (isCartView) {
                    toggleCart();
                }
                
                // Then scroll to the target section
                setTimeout(() => {
                    const targetId = href.split('#')[1];
                    const target = document.getElementById(targetId);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
            }

            // --- Adobe Launch: Track Navigation Link Click ---
            // Set data elements for the click event
            digitalData.event = {
                name: 'navigationClick',
                linkText: this.innerText,
                linkURL: this.href,
                linkTarget: this.target || '_self'
            };
            // Trigger a custom event that Launch will listen for
            if (typeof _satellite !== 'undefined' && _satellite.track) {
                _satellite.track('navClick');
                console.log('Adobe Launch: Navigation Link Click event tracked:', this.innerText);
            }
        });
    });
}

// Setup filter buttons
function setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('mouseover', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'linear-gradient(45deg, #ff0080, #0080ff)';
            }
        });
        
        btn.addEventListener('mouseout', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });

        // Add click listener for tracking filter selection
        btn.addEventListener('click', function() {
            // --- Adobe Launch: Track Product Filter Click ---
            digitalData.event = {
                name: 'productFilterClick',
                filterCategory: this.textContent.trim()
            };
            if (typeof _satellite !== 'undefined' && _satellite.track) {
                _satellite.track('filterClick');
                console.log('Adobe Launch: Product Filter Click event tracked:', this.textContent.trim());
            }
        });
    });
}

// Filter products by category
function filterProducts(category) {
    currentFilter = category;
    
    // Update active filter button
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    
    if (event && event.target) {
        event.target.classList.add('active');
        event.target.style.background = 'linear-gradient(45deg, #ff0080, #0080ff)';
    }
    
    renderProducts();
}

// Render products to the grid
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';

    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(product => product.category === currentFilter);

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.6);">
                <h3>No products found in this category</h3>
                <p>Try selecting a different category</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create individual product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image" data-icon="${product.image}"></div>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-price">$${product.price}</div>
        <div class="product-rating">
            <span class="stars">${generateStars(product.rating)}</span>
            <span>(${product.rating})</span>
        </div>
        <button class="add-to-cart" onclick="addToCart(event, ${product.id})">
            Add to Cart
        </button>
    `;
    return card;
}

// Generate star rating display
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '⭐';
    }
    
    if (hasHalfStar) {
        stars += '⭐';
    }
    
    return stars;
}

// Add product to cart
function addToCart(event, productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showSuccessPopup();

    // --- Adobe Launch: Track Add to Cart Event ---
    digitalData.product = {
        id: product.id.toString(),
        name: product.title,
        category: product.category,
        price: product.price,
        quantity: existingItem ? existingItem.quantity : 1
    };
    digitalData.event = {
        name: 'addToCart',
        cartAction: 'add'
    };

    if (typeof _satellite !== 'undefined' && _satellite.track) {
        _satellite.track('addToCart');
        console.log('Adobe Launch: Add to Cart event tracked:', product.title);
    }

    // Add loading animation to button
    const button = event.target;
    const originalText = button.textContent;
    button.innerHTML = '<span class="loading"></span> Adding...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 1000);
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('gamezone_cart', JSON.stringify(cart));
}

// Update cart count display
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Toggle between main page and cart view
function toggleCart() {
    const mainPage = document.getElementById('mainPage');
    const cartPage = document.getElementById('cartPage');
    
    isCartView = !isCartView;
    
    if (isCartView) {
        mainPage.classList.add('hidden');
        cartPage.classList.add('active');
        renderCart();

        // --- Adobe Launch: Track Cart View Page Load ---
        digitalData.page = {
            pageName: "Cart Page",
            pageURL: window.location.href,
            pagePath: "/cart.html", // A logical path for cart view
            siteSection: "Cart"
        };
        digitalData.cart = {
            items: cart.map(item => ({
                id: item.id,
                name: item.title,
                category: item.category,
                price: item.price,
                quantity: item.quantity
            })),
            subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
        };

        if (typeof _satellite !== 'undefined' && _satellite.track) {
            _satellite.track('cartView'); // Custom event for cart page view
            console.log('Adobe Launch: Cart Page view event tracked.');
        }

    } else {
        mainPage.classList.remove('hidden');
        cartPage.classList.remove('active');
        // When going back to shop, trigger an event
        digitalData.event = {
            name: 'backToShop',
            fromPage: 'Cart'
        };
        if (typeof _satellite !== 'undefined' && _satellite.track) {
            _satellite.track('backToShop');
            console.log('Adobe Launch: Back to Shop event tracked.');
        }
    }
}

// Render cart page
function renderCart() {
    const cartContent = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some amazing gaming gear to get started!</p>
                <a href="products.html" style="display: inline-block; margin-top: 1rem; background: linear-gradient(45deg, #ff0080, #0080ff); padding: 1rem 2rem; border-radius: 25px; color: white; text-decoration: none; font-weight: bold;">
                    Browse Products
                </a>
            </div>
        `;
        return;
    }

    const cartItemsHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price}</div>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + tax + shipping;

    cartContent.innerHTML = `
        <div class="cart-items">
            ${cartItemsHTML}
        </div>
        
        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax:</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button class="checkout-btn" onclick="checkout()">
                Proceed to Checkout
            </button>
        </div>
    `;
}

// Update item quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCartCount();
    renderCart();

    // --- Adobe Launch: Track Update Quantity Event ---
    digitalData.product = {
        id: item.id.toString(),
        name: item.title,
        category: item.category,
        price: item.price,
        quantity: item.quantity // New quantity
    };
    digitalData.event = {
        name: 'updateCartQuantity',
        cartAction: change > 0 ? 'increase' : 'decrease',
        quantityChange: change
    };
    if (typeof _satellite !== 'undefined' && _satellite.track) {
        _satellite.track('updateCart');
        console.log('Adobe Launch: Update Cart Quantity event tracked:', item.title);
    }
}

// Remove item from cart
function removeFromCart(productId) {
    const itemToRemove = cart.find(item => item.id === productId); 
    if (!itemToRemove) return;

    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();

    // --- Adobe Launch: Track Remove from Cart Event ---
    digitalData.product = {
        id: itemToRemove.id.toString(),
        name: itemToRemove.title,
        category: itemToRemove.category,
        price: itemToRemove.price,
        quantity: itemToRemove.quantity // Quantity removed
    };
    digitalData.event = {
        name: 'removeFromCart',
        cartAction: 'remove'
    };
    if (typeof _satellite !== 'undefined' && _satellite.track) {
        _satellite.track('removeFromCart');
        console.log('Adobe Launch: Remove from Cart event tracked:', itemToRemove.title);
    }
}

// Show success popup
function showSuccessPopup() {
    const popup = document.getElementById('successPopup');
    if (popup) {
        popup.classList.add('show');
        
        setTimeout(() => {
            popup.classList.remove('show');
        }, 2000);
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        displayMessage('Your cart is empty!');
        return;
    }

    const purchasedItems = [...cart]; 

    // --- Adobe Launch: Track Initiate Checkout Event ---
    digitalData.cart = {
        items: purchasedItems.map(item => ({
            id: item.id,
            name: item.title,
            category: item.category,
            price: item.price,
            quantity: item.quantity
        })),
        subtotal: purchasedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
    };
    digitalData.event = {
        name: 'initiateCheckout',
        checkoutStep: 1
    };
    if (typeof _satellite !== 'undefined' && _satellite.track) {
        _satellite.track('initiateCheckout');
        console.log('Adobe Launch: Initiate Checkout event tracked.');
    }

    // Simulate checkout process (UI update and delay)
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.innerHTML = '<span class="loading"></span> Processing...';
    checkoutBtn.disabled = true;

    setTimeout(() => {
        displayMessage('🎉 Order placed successfully! Thank you for shopping with GameZone!');

        // --- Adobe Launch: Track Purchase Complete Event ---
        const transactionId = 'T' + Date.now();
        const subtotal = purchasedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = (subtotal * 0.08); 
        const shipping = (subtotal > 100 ? 0 : 9.99);
        const totalValue = (subtotal + tax + shipping);

        digitalData.transaction = {
            id: transactionId,
            total: totalValue.toFixed(2),
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            shipping: shipping.toFixed(2),
            currency: 'USD',
            items: purchasedItems.map(item => ({
                id: item.id,
                name: item.title,
                category: item.category,
                price: item.price,
                quantity: item.quantity
            }))
        };
        digitalData.event = {
            name: 'purchaseComplete',
            purchaseStatus: 'success'
        };

        if (typeof _satellite !== 'undefined' && _satellite.track) {
            _satellite.track('purchaseComplete');
            console.log('Adobe Launch: Purchase Complete event tracked:', transactionId);
        }

        cart = []; 
        saveCart();
        updateCartCount();
        renderCart();

        checkoutBtn.textContent = 'Proceed to Checkout';
        checkoutBtn.disabled = false;
    }, 3000); 
}

// --- Contact Form Submission ---
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const nameInput = document.getElementById('userName');
            const emailInput = document.getElementById('userEmail');
            const messageInput = document.getElementById('userMessage');
            const ageInput = document.getElementById('userAge');
            const ratingInput = document.getElementById('userRating');
            const purchasesInput = document.getElementById('userPurchases');

            if (!nameInput || !emailInput || !messageInput || !ageInput || !ratingInput || !purchasesInput) {
                console.error('script.js: ERROR: One or more form input elements not found by ID. Check your HTML IDs!');
                displayMessage('An internal error occurred. Please try again later.');
                return; 
            }

            const name = nameInput.value;
            const email = emailInput.value;
            const message = messageInput.value; 
            const age = ageInput.value;
            const rating = ratingInput.value;
            const purchases = purchasesInput.value;

            // --- Adobe Launch: Track Contact Form Submission ---
            digitalData.form = {
                name: 'contactUsForm',
                userName: name,
                userEmail: email, // Be cautious with PII!
                userMessage: message,
                userAge: parseInt(age),
                userRating: parseInt(rating),
                numPurchases: parseInt(purchases)
            };
            digitalData.event = {
                name: 'contactFormSubmit',
                formStatus: 'success'
            };
            if (typeof _satellite !== 'undefined' && _satellite.track) {
                _satellite.track('contactForm');
                console.log('Adobe Launch: Contact Form Submit event tracked.');
            }

            displayMessage('Thank you for your message! We will get back to you soon.');
            contactForm.reset(); 
        });
    } else {
        console.error('script.js: ERROR: Contact form element NOT found. Selector: ".contact-form form". Please verify your HTML structure and class names.');
    }
});

// Custom message box function (replaces alert)
function displayMessage(message) {
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 9999;
        font-size: 1.2em;
        text-align: center;
        box-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
    `;
    messageBox.textContent = message;
    document.body.appendChild(messageBox);

    setTimeout(() => {
        document.body.removeChild(messageBox);
    }, 3000); // Message disappears after 3 seconds
}
