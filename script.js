// ==================== BIDSPIRIT MARKETPLACE - JAVASCRIPT ==================== //
// This file contains all functionality for the BidSpirit fine art & antiques marketplace
// Including: user authentication, product management, modal display, forms, navigation

// ==================== PRODUCT DATABASE ==================== //
// REQ #2, #4: Product data is loaded from data.json
let products = [];

// Load product data from data.json
function fetchProductData() {
    return fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to load product data');
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error('Product data must be an array');
            }
            return data;
        });
}

// ==================== INITIALIZATION ==================== //
// Event listener for page load - initializes all functionality
document.addEventListener('DOMContentLoaded', function() {
    // REQ #5: Initialize name prompt for user personalization
    initNamePrompt();
    
    // Initialize Visitor Counter
    initVisitorCount();

    // Load products from external data file and then initialize UI
    fetchProductData()
        .then(data => {
            products = data;
            initCategories();
            initProducts();
        })
        .catch(error => {
            console.warn(error);
            // if fetching fails, show empty state or fallback
            initCategories();
            initProducts();
        });

    // Initialize Geolocation Ticker
    initTicker();

    // Initialize mobile menu toggle
    initMobileMenu();
    
    // REQ #6: Setup feedback form
    initFeedbackForm();
    
    // Initialize smooth scrolling navigation
    initSmoothScroll();
    
    // Setup scroll animations for page elements
    initScrollAnimations();
});

// ==================== VISITOR COUNT HANDLER ==================== //
function initVisitorCount() {
    let count = localStorage.getItem('bidSpiritVisitorCount');
    if (!count) {
        count = 1250; // Starting base for demo purposes
    }
    count = parseInt(count) + 1;
    localStorage.setItem('bidSpiritVisitorCount', count);
    document.getElementById('visitorCount').textContent = count.toLocaleString();
}

// ==================== TICKER & GEOLOCATION HANDLER ==================== //
function initTicker() {
    const tickerEl = document.getElementById('ticker');
    let userLocation = "Fetching location...";

    // Get Geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            // Reverse geocode using Nominatim API (Free)
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                .then(res => res.json())
                .then(data => {
                    userLocation = data.display_name || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
                })
                .catch(() => {
                    userLocation = `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`;
                });
        }, () => {
            userLocation = "Location Access Denied";
        });
    } else {
        userLocation = "Geolocation Not Supported";
    }

    // Update ticker content every second for time
    setInterval(() => {
        const now = new Date();
        const dateTimeStr = now.toLocaleDateString() + " | " + now.toLocaleTimeString();
        tickerEl.textContent = `[ ${dateTimeStr} ] — CURRENT LOCATION: ${userLocation} — Welcome to BidSpirit Marketplace — Live Bidding Open Now!`;
    }, 1000);
}

// ==================== REQ #5: NAME PROMPT HANDLER ==================== //
// Collects user's first name on first visit and stores it for personalization
function initNamePrompt() {
    const namePromptOverlay = document.getElementById('namePromptOverlay');
    const saveNameBtn = document.getElementById('saveNameBtn');
    const initialNameInput = document.getElementById('initialNameInput');
    const userName = document.getElementById('userName');
    
    // Check if user's name is already saved in browser storage
    const savedName = localStorage.getItem('bidSpiritUserName');
    if (savedName) {
        // Display saved name and hide the prompt
        userName.textContent = savedName;
        namePromptOverlay.style.display = 'none';
    }
    
    // Handle save button click
    saveNameBtn.addEventListener('click', function() {
        const fullName = initialNameInput.value.trim();
        if (fullName) {
            // Extract first name only
            const firstName = fullName.split(' ')[0];
            
            // Save to localStorage for persistence across sessions
            localStorage.setItem('bidSpiritUserName', firstName);
            
            // Update welcome message
            userName.textContent = firstName;
            
            // Hide the prompt overlay
            namePromptOverlay.style.display = 'none';
        } else {
            alert('Please enter your name');
        }
    });
    
    // Allow Enter key to submit the form
    initialNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveNameBtn.click();
        }
    });
}

// ==================== MOBILE MENU TOGGLE ==================== //
// Toggles mobile navigation menu on small screens
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Toggle menu visibility on button click
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when a navigation link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
}

// ==================== REQ #2: CATEGORY INITIALIZATION ==================== //
// Displays product categories with representative images
function initCategories() {
    const categoryGrid = document.getElementById('categoryGrid');
    const categories = ['Fine Art', 'Antiques', 'Furniture', 'Collectibles'];
    
    // Create a category card for each category
    categories.forEach(category => {
        // Find the first product in this category to use its image
        const product = products.find(p => p.category === category);
        if (product) {
            const card = createCategoryCard(category, product.image);
            categoryGrid.appendChild(card);
        }
    });
}

// Creates a single category card element
function createCategoryCard(category, image) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
        <img src="${image}" alt="${category}" class="category-image">
        <div class="category-name">${category}</div>
    `;
    return card;
}

// ==================== REQ #2, #4: PRODUCT INITIALIZATION ==================== //
// Populates auction sections with products
function initProducts() {
    const popularGrid = document.getElementById('popularGrid');
    const upcomingGrid = document.getElementById('upcomingGrid');
    const sponsoredGrid = document.getElementById('sponsoredGrid');
    const completedGrid = document.getElementById('completedGrid');
    const galleryGrid = document.getElementById('galleryGrid');
    
    // Popular Items: First 4 products
    products.slice(0, 4).forEach(product => {
        const card = createProductCard(product, false);
        popularGrid.appendChild(card);
    });
    
    // Sponsored Auctions: Rotate through products
    for (let i = 0; i < 4; i++) {
        const product = products[i % products.length];
        const card = createProductCard(product, false, 'Sponsored');
        sponsoredGrid.appendChild(card);
    }
    
    // Upcoming Auctions: Last 4 products
    products.slice(4, 8).forEach(product => {
        const card = createProductCard(product, true);
        upcomingGrid.appendChild(card);
    });
    
    // Completed Auctions: Products rotated for variety
    for (let i = 0; i < 4; i++) {
        const product = products[(i + 2) % products.length];
        const card = createProductCard(product, false, 'Completed');
        completedGrid.appendChild(card);
    }
    
    // Gallery: Display all products
    products.forEach(product => {
        const card = createProductCard(product, false);
        galleryGrid.appendChild(card);
    });
}

// Creates a single product card for displaying in grids
function createProductCard(product, isUpcoming, badge) {
    const card = document.createElement('div');
    card.className = 'product-card';
    const badgeText = badge || (isUpcoming ? 'Starting Soon' : product.category);
    
    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-badge ${isUpcoming ? 'upcoming' : ''}">
                ${badgeText}
            </div>
        </div>
        <div class="product-info">
            <h4 class="product-title">${product.title}</h4>
            <p class="product-price">$${product.basePrice.toLocaleString()}</p>
            <button class="product-btn">View Details</button>
        </div>
    `;
    
    // Add click handlers for opening modal
    card.querySelector('.product-btn').addEventListener('click', () => openModal(product));
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('product-btn')) {
            openModal(product);
        }
    });
    
    return card;
}

// ==================== REQ #3: PRODUCT MODAL (POP-UP) ==================== //
// Opens a detailed product information modal when clicked

function openModal(product) {
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    // Build detailed product information HTML
    modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="modal-details">
            <div>
                <span class="modal-category">${product.category}</span>
                <h2 class="modal-title">${product.title}</h2>
                <p class="modal-price">$${product.basePrice.toLocaleString()}</p>
            </div>
            
            <!-- Product Description -->
            <div class="modal-section">
                <h3>Description</h3>
                <p class="modal-description">${product.description}</p>
            </div>
            
            <!-- Product Specifications -->
            <div class="modal-section">
                <h3>Specifications</h3>
                ${product.artist ? `
                    <div class="spec-item">
                        <span class="spec-icon">🏆</span>
                        <div class="spec-content">
                            <div class="spec-label">Artist</div>
                            <div class="spec-value">${product.artist}</div>
                        </div>
                    </div>
                ` : ''}
                ${product.year ? `
                    <div class="spec-item">
                        <span class="spec-icon">📅</span>
                        <div class="spec-content">
                            <div class="spec-label">Period</div>
                            <div class="spec-value">${product.year}</div>
                        </div>
                    </div>
                ` : ''}
                ${product.dimensions ? `
                    <div class="spec-item">
                        <span class="spec-icon">📏</span>
                        <div class="spec-content">
                            <div class="spec-label">Dimensions</div>
                            <div class="spec-value">${product.dimensions}</div>
                        </div>
                    </div>
                ` : ''}
                ${product.condition ? `
                    <div class="spec-item">
                        <span class="spec-icon">📋</span>
                        <div class="spec-content">
                            <div class="spec-label">Condition</div>
                            <div class="spec-value">${product.condition}</div>
                        </div>
                    </div>
                ` : ''}
                ${product.provenance ? `
                    <div class="spec-item">
                        <span class="spec-icon">📜</span>
                        <div class="spec-content">
                            <div class="spec-label">Provenance</div>
                            <div class="spec-value">${product.provenance}</div>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <!-- Bid Form -->
            <div class="modal-section bid-section">
                <h3>Place Your Bid</h3>
                <div class="bid-field">
                    <label for="bidderName">Your Name</label>
                    <input type="text" id="bidderName" value="${localStorage.getItem('bidSpiritUserName') || ''}" placeholder="Enter your name">
                </div>
                <div class="bid-field">
                    <label for="bidAmount">Bid Amount ($)</label>
                    <input type="number" id="bidAmount" min="${product.basePrice}" placeholder="Minimum $${product.basePrice.toLocaleString()}">
                </div>
                <div class="bid-error" id="bidError"></div>
            </div>
            <div class="modal-actions">
                <button class="modal-btn primary" id="placeBidBtn">Place Bid</button>
                <button class="modal-btn secondary">Add to Watchlist</button>
            </div>
            <div class="bid-success" id="bidSuccess"></div>
        </div>
    `;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal

    document.getElementById('placeBidBtn').addEventListener('click', () => handlePlaceBid(product));
}

// Closes the product detail modal
function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
}

// Handles place bid click with validation and personalized notification
function handlePlaceBid(product) {
    const bidNameInput = document.getElementById('bidderName');
    const bidAmountInput = document.getElementById('bidAmount');
    const bidError = document.getElementById('bidError');
    const bidSuccess = document.getElementById('bidSuccess');

    const bidderName = bidNameInput.value.trim() || localStorage.getItem('bidSpiritUserName') || '';
    const bidAmount = Number(bidAmountInput.value);
    const minAmount = product.basePrice;

    bidError.textContent = '';
    bidSuccess.textContent = '';

    if (!bidderName) {
        bidError.textContent = 'Please enter your name to place a bid.';
        return;
    }

    if (!bidAmount || bidAmount < minAmount) {
        bidError.textContent = `Please enter a bid amount of at least $${minAmount.toLocaleString()}.`;
        return;
    }

    // Save updated bidder name for future use
    localStorage.setItem('bidSpiritUserName', bidderName);
    document.getElementById('userName').textContent = bidderName;

    // Show personalized success notification
    bidSuccess.innerHTML = `
        <div class="bid-success-notice">
            <strong>${bidderName}</strong>, your bid of <strong>$${bidAmount.toLocaleString()}</strong> for
            <em>"${product.title}"</em> has been submitted successfully.
            We will notify you if you are outbid.
        </div>
    `;

    // Disable place bid button after successful submission
    document.getElementById('placeBidBtn').disabled = true;
    document.getElementById('placeBidBtn').textContent = 'Bid Submitted';
}

// Close modal when X button is clicked
document.addEventListener('DOMContentLoaded', function() {
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
});

// ==================== REQ #6: FEEDBACK FORM HANDLER ==================== //
// Manages the feedback form submission and success message
function initFeedbackForm() {
    // Wait for form to be ready
    setTimeout(() => {
        const form = document.getElementById('feedbackForm');
        if (!form) return;
        
        const container = document.getElementById('feedbackContainer');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success message
            container.innerHTML = `
                <div class="success-message">
                    <div class="success-icon">✅</div>
                    <h3>Thank You!</h3>
                    <p>Your feedback has been received. We'll get back to you shortly.</p>
                </div>
            `;
            
            // Reset form after 3 seconds
            setTimeout(() => {
                container.innerHTML = `
                    <form class="feedback-form" id="feedbackForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="name">Your Name</label>
                                <input type="text" id="name" name="name" required placeholder="John Doe">
                            </div>
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" name="email" required placeholder="john@example.com">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <select id="subject" name="subject" required>
                                <option value="">Select a subject</option>
                                <option value="general">General Inquiry</option>
                                <option value="auction">Auction Questions</option>
                                <option value="authentication">Authentication Services</option>
                                <option value="shipping">Shipping & Delivery</option>
                                <option value="feedback">Feedback</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="message">Your Message</label>
                            <textarea id="message" name="message" rows="6" required placeholder="Tell us what you think..."></textarea>
                        </div>
                        <button type="submit" class="submit-btn">
                            <span>✉</span> Submit Feedback
                        </button>
                    </form>
                `;
                // Re-initialize form after reset
                initFeedbackForm();
            }, 3000);
        });
    }, 100);
}

// ==================== SMOOTH SCROLL NAVIGATION ==================== //
// Smooth scrolling to sections when navigation links are clicked
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Change color after clicking
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-click'));
            this.classList.add('active-click');

            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== SCROLL ANIMATIONS ==================== //
// Adds fade-in animations to cards when they scroll into view
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all product and category cards
    document.querySelectorAll('.category-card, .product-card').forEach(el => {
        observer.observe(el);
    });
}
