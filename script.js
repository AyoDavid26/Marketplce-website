document.addEventListener('DOMContentLoaded', () => {
    // Initialize event listeners
    initializeEventListeners();

    // Display initial products (if any)
    fetchProducts()
        .then(products => {
            displayProducts(products);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });

    // Start scrolling reviews
    scrollReviews();
});

// Initialize event listeners
function initializeEventListeners() {
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', handleSearch);

    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

    const loginSignupBtn = document.getElementById("loginSignupBtn");
    if (loginSignupBtn) {
        loginSignupBtn.onclick = function() {
            document.getElementById("myModal").style.display = "block";
        };
    }

    const modalCloseBtn = document.getElementsByClassName("close")[0];
    if (modalCloseBtn) {
        modalCloseBtn.onclick = function() {
            document.getElementById("myModal").style.display = "none";
        };
    }

    window.onclick = function(event) {
        const modal = document.getElementById("myModal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);

    initializeLazyLoading();
}

// Handle search form submission
function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        console.log('Sending search term to content script:', query);
        // Send a message to the extension's content script
        chrome.runtime.sendMessage({ action: "searchProducts", searchTerm: query }, function (response) {
            if (chrome.runtime.lastError) {
                console.error("Message sending failed:", chrome.runtime.lastError);
                displayError('Error sending message to content script.');
            } else if (response && response.status === "success") {
                console.log('Received response from content script:', response.data);
                displayResults(response.data);
            } else {
                console.error('No response or error from content script');
                displayError('Error fetching search term.');
            }
        });
    } else {
        console.error('Search input is empty.');
        displayError('Please enter a search term.');
    }
}

// Display error message
function displayError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p>${message}</p>`;
}

// Fetch products (simulated)
function fetchProducts(query = '') {
    return new Promise((resolve) => {
        setTimeout(() => {
            const products = [
                { id: 1, name: "Product 1", price: 10, image: "images/product1.jpg" },
                { id: 2, name: "Product 2", price: 20, image: "images/product2.jpg" },
                { id: 3, name: "Product 3", price: 30, image: "images/product3.jpg" }
            ];

            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            
            resolve(filteredProducts);
        }, 1000); // Simulated network latency
    });
}

// Display products
function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No products found.</p>';
    } else {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <img src="${product.image}" alt="${product.name}">
                <p>Price: $${product.price}</p>
            `;
            productsContainer.appendChild(productElement);
        });
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            alert('Login successful!');
            document.getElementById("myModal").style.display = "none";
        } else {
            alert('Login failed!');
        }
    });
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername, newPassword })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            alert('Signup successful!');
            document.getElementById("myModal").style.display = "none";
        } else {
            alert('Signup failed!');
        }
    });
}

// Lazy load images
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy');

    if ('IntersectionObserver' in window) {
        let lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.add('loaded');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(lazyImage => {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.add('loaded');
        });
    }
}

// Scroll reviews
function scrollReviews() {
    const reviewContainer = document.getElementById('reviewContainer');
    let currentIndex = 0;

    function scroll() {
        const scrollAmount = currentIndex * reviewContainer.offsetWidth;
        reviewContainer.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });

        currentIndex = (currentIndex + 1) % reviewContainer.children.length;
        setTimeout(scroll, 5000); // Change review every 5 seconds
    }

    scroll();
}

// Check login status (example)
function checkLoginStatus() {
    // Example: Check if a token exists in local storage (implement your own logic)
    return localStorage.getItem('authToken') !== null;
}

// Perform search action
function performSearch() {
    const query = document.getElementById('search-input').value.trim();
    console.log('Searching for:', query);
    // Add your search functionality here
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');

    // Check if user exists based on email (mocked example)
    function checkUserExists(email) {
        // Mock logic to check if email exists
        const existingUsers = ['user1@example.com', 'user2@example.com'];
        return existingUsers.includes(email);
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (checkUserExists(email)) {
            // User exists, proceed with login logic
            alert('Login successful!'); // Replace with actual login logic
            loginForm.reset();
        } else {
            // User doesn't exist, redirect to signup form
            alert('New user detected. Redirecting to signup form.');
            signupForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        }
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newUsername = document.getElementById('newUsername').value;
        const newPassword = document.getElementById('newPassword').value;

        // Perform signup logic here (e.g., API call)
        alert(`Signing up new user: ${newUsername}`);
        signupForm.reset();
    });
});

