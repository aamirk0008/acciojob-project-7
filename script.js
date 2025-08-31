let menuItems = [];
let currentOrder = [];

// 1. getMenu() function - Fetch data from the provided API
async function getMenu() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/saksham-accio/f2_contest_3/main/food.json');
        if (!response.ok) {
            throw new Error('Failed to fetch menu data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching menu:', error);
        throw error;
    }
}

// 2. takeOrder() function
function takeOrder() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Randomly select 3 items from the menu
            const selectedItems = [];
            const availableItems = [...menuItems];

            for (let i = 0; i < 3 && availableItems.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * availableItems.length);
                selectedItems.push(availableItems[randomIndex]);
                availableItems.splice(randomIndex, 1);
            }

            const order = {
                order_id: Date.now(),
                items: selectedItems,
                status: "Order Taken"
            };

            resolve(order);
        }, 2500);
    });
}

// 3. orderPrep() function
function orderPrep() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                order_status: true,
                paid: false,
                message: "Food is ready!"
            });
        }, 1500);
    });
}

// 4. payOrder() function
function payOrder() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                order_status: true,
                paid: true,
                message: "Payment successful!"
            });
        }, 1000);
    });
}

// 5. thankyouFnc() function
function thankyouFnc() {
    alert("Thank you for eating with us today! 🍔✨");
    document.getElementById('orderProcessing').style.display = 'none';
}

// Function to display menu items
function displayMenu(items) {
    const menuContainer = document.getElementById('menuContainer');

    if (!items || items.length === 0) {
        menuContainer.innerHTML = '<div class="error">No menu items available</div>';
        return;
    }

    menuContainer.innerHTML = '';

    items.forEach(item => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.className = 'menu-item';

        // Create a placeholder image or use item image if available
        const imageStyle = item.img ? `background-image: url(${item.img})` :
            'background: linear-gradient(135deg, #ff6b35, #f7931e)';

        menuItemDiv.innerHTML = `
                    <div class="menu-item-image" style="${imageStyle}">
                        ${!item.img ? '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 60px;">🍔</div>' : ''}
                    </div>
                    <div class="menu-item-info">
                        <div class="menu-item-name">${item.name || 'Delicious Item'}</div>
                        <div class="menu-item-price">$${item.price || '9.99'}/-</div>
                        <button class="add-btn" onclick="addToOrder(${item.id || Math.random()})">+</button>
                    </div>
                `;

        menuContainer.appendChild(menuItemDiv);
    });
}

// Function to add item to order (placeholder)
function addToOrder(itemId) {
    console.log('Added item to order:', itemId);
    // You can implement cart functionality here
}

// Function to start order process
async function startOrderProcess() {
    try {
        document.getElementById('orderProcessing').style.display = 'flex';
        document.getElementById('orderStatus').textContent = 'Taking your order...';

        // Step 1: Take Order
        const order = await takeOrder();
        currentOrder = order;

        // Display order summary
        const orderSummary = document.getElementById('orderSummaryModal');
        const orderItemsList = document.getElementById('orderItemsList');
        orderItemsList.innerHTML = '';

        order.items.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                        <span>${item.name || 'Food Item'}</span>
                        <span>$${item.price || '9.99'}</span>
                    `;
            orderItemsList.appendChild(orderItem);
        });

        orderSummary.style.display = 'block';
        document.getElementById('orderStatus').textContent = 'Order received! Preparing your food...';

        // Step 2: Prepare Order
        await orderPrep();
        document.getElementById('orderStatus').textContent = 'Food is ready! Processing payment...';

        // Step 3: Process Payment
        const paymentResult = await payOrder();
        document.getElementById('orderStatus').textContent = 'Payment successful! Enjoy your meal!';

        // Step 4: Thank you
        setTimeout(() => {
            thankyouFnc();
        }, 2000);

    } catch (error) {
        console.error('Error processing order:', error);
        document.getElementById('orderStatus').textContent = 'Sorry, there was an error. Please try again.';
    }
}

// Initialize the application
async function initApp() {
    try {
        const items = await getMenu();
        menuItems = items;
        displayMenu(items);
    } catch (error) {
        console.error('Error loading menu:', error);
        document.getElementById('menuContainer').innerHTML =
            '<div class="error">Failed to load menu. Please refresh the page.</div>';
    }
}

// Load menu on page load
window.addEventListener('load', initApp);