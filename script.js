// Subscription Manager JavaScript with Firebase

// State Management
let subscriptions = [];
let editingSubscriptionId = null; // Track which subscription is being edited

// Firestore collection reference
const subscriptionsCollection = () => window.db.collection('subscriptions');

// Load subscriptions from Firestore on page load
async function loadSubscriptions() {
    try {
        const snapshot = await subscriptionsCollection().get();

        if (snapshot.empty) {
            // Add demo data if no subscriptions exist
            const demoData = [
                {
                    name: 'Netflix',
                    cost: 15.99,
                    billing: 'monthly',
                    category: 'entertainment',
                    nextPayment: '2025-11-15'
                },
                {
                    name: 'Spotify',
                    cost: 9.99,
                    billing: 'monthly',
                    category: 'music',
                    nextPayment: '2025-11-20'
                },
                {
                    name: 'Adobe Creative Cloud',
                    cost: 54.99,
                    billing: 'monthly',
                    category: 'software',
                    nextPayment: '2025-11-10'
                }
            ];

            // Add demo subscriptions to Firestore
            for (const sub of demoData) {
                await subscriptionsCollection().add(sub);
            }

            // Reload after adding demo data
            await loadSubscriptions();
            return;
        }

        // Load subscriptions from Firestore
        subscriptions = [];
        snapshot.forEach(doc => {
            subscriptions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        renderSubscriptions();
        updateStats();
        updateAnalytics();
    } catch (error) {
        console.error('Error loading subscriptions:', error);
        alert('Error loading subscriptions. Please check Firebase configuration.');
    }
}

// Add new subscription to Firestore
async function addSubscription(subscriptionData) {
    try {
        await subscriptionsCollection().add(subscriptionData);
        await loadSubscriptions(); // Reload to get the new data
    } catch (error) {
        console.error('Error adding subscription:', error);
        alert('Error adding subscription.');
    }
}

// Update subscription in Firestore
async function updateSubscription(id, subscriptionData) {
    try {
        await subscriptionsCollection().doc(id).update(subscriptionData);
        await loadSubscriptions(); // Reload to get the updated data
    } catch (error) {
        console.error('Error updating subscription:', error);
        alert('Error updating subscription.');
    }
}

// Delete subscription from Firestore
async function deleteSubscription(id) {
    if (confirm('Are you sure you want to delete this subscription?')) {
        try {
            await subscriptionsCollection().doc(id).delete();
            await loadSubscriptions(); // Reload after deletion
        } catch (error) {
            console.error('Error deleting subscription:', error);
            alert('Error deleting subscription.');
        }
    }
}

// Calculate monthly cost from any billing cycle
function calculateMonthlyCost(cost, billing) {
    switch(billing) {
        case 'weekly':
            return cost * 4.33; // Average weeks per month
        case 'monthly':
            return cost;
        case 'yearly':
            return cost / 12;
        default:
            return cost;
    }
}

// Update statistics
function updateStats() {
    const totalSubs = subscriptions.length;
    const monthlyCost = subscriptions.reduce((sum, sub) => {
        return sum + calculateMonthlyCost(sub.cost, sub.billing);
    }, 0);
    const yearlyCost = monthlyCost * 12;

    document.getElementById('total-subs').textContent = totalSubs;
    document.getElementById('monthly-cost').textContent = `$${monthlyCost.toFixed(2)}`;
    document.getElementById('yearly-cost').textContent = `$${yearlyCost.toFixed(2)}`;
}

// Render subscription cards
function renderSubscriptions() {
    const grid = document.getElementById('subscriptions-grid');

    if (subscriptions.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--color-text-muted);">
                <p style="font-size: 1.25rem; margin-bottom: 1rem;">No subscriptions yet</p>
                <p>Click "Add New" to get started tracking your subscriptions</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = subscriptions.map(sub => `
        <div class="subscription-card">
            <div class="subscription-header">
                <div class="subscription-info">
                    <h3>${sub.name}</h3>
                    <span class="subscription-category">${sub.category}</span>
                </div>
            </div>
            <div class="subscription-cost">
                $${sub.cost.toFixed(2)}
                <div class="subscription-billing">per ${sub.billing === 'monthly' ? 'month' : sub.billing === 'yearly' ? 'year' : 'week'}</div>
            </div>
            <div class="subscription-footer">
                <div class="next-payment">
                    Next payment
                    <strong>${formatDate(sub.nextPayment)}</strong>
                </div>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="openEditModal('${sub.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteSubscription('${sub.id}')">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Update analytics
function updateAnalytics() {
    updateCategoryBreakdown();
    updateUpcomingPayments();
}

// Update category breakdown
function updateCategoryBreakdown() {
    const categoryList = document.getElementById('category-list');
    const categories = {};

    subscriptions.forEach(sub => {
        const monthlyCost = calculateMonthlyCost(sub.cost, sub.billing);
        if (categories[sub.category]) {
            categories[sub.category] += monthlyCost;
        } else {
            categories[sub.category] = monthlyCost;
        }
    });

    if (Object.keys(categories).length === 0) {
        categoryList.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; padding: 2rem;">No data available</p>';
        return;
    }

    categoryList.innerHTML = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount]) => `
            <div class="category-item">
                <span class="category-name">${capitalizeFirst(category)}</span>
                <span class="category-amount">$${amount.toFixed(2)}/mo</span>
            </div>
        `).join('');
}

// Update upcoming payments
function updateUpcomingPayments() {
    const upcomingList = document.getElementById('upcoming-payments');

    if (subscriptions.length === 0) {
        upcomingList.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; padding: 2rem;">No upcoming payments</p>';
        return;
    }

    const sorted = [...subscriptions].sort((a, b) => {
        return new Date(a.nextPayment) - new Date(b.nextPayment);
    });

    upcomingList.innerHTML = sorted.slice(0, 5).map(sub => {
        const daysUntil = Math.ceil((new Date(sub.nextPayment) - new Date()) / (1000 * 60 * 60 * 24));
        return `
            <div class="upcoming-item">
                <div>
                    <div class="payment-name">${sub.name}</div>
                    <div class="payment-date">${daysUntil} days (${formatDate(sub.nextPayment)})</div>
                </div>
                <span class="payment-amount">$${sub.cost.toFixed(2)}</span>
            </div>
        `;
    }).join('');
}

// Capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Modal Management
const modal = document.getElementById('add-subscription-modal');
const addBtn = document.getElementById('add-subscription-btn');
const addBtnHeader = document.getElementById('add-subscription-btn-header');
const closeBtn = document.getElementById('modal-close');
const cancelBtn = document.getElementById('cancel-btn');
const form = document.getElementById('subscription-form');
const modalTitle = document.querySelector('.modal-header h3');
const submitBtn = document.querySelector('#subscription-form button[type="submit"]');

// Function to open modal for adding new subscription
function openAddModal() {
    editingSubscriptionId = null;
    modalTitle.textContent = 'Add New Subscription';
    submitBtn.textContent = 'Add Subscription';
    modal.classList.add('active');
    form.reset();
}

// Open modal for adding new subscription (from main button)
addBtn.addEventListener('click', openAddModal);

// Open modal for adding new subscription (from header button)
if (addBtnHeader) {
    addBtnHeader.addEventListener('click', openAddModal);
}

// Open modal for editing subscription
function openEditModal(id) {
    const subscription = subscriptions.find(sub => sub.id === id);
    if (!subscription) return;

    editingSubscriptionId = id;
    modalTitle.textContent = 'Edit Subscription';
    submitBtn.textContent = 'Update Subscription';

    // Fill form with subscription data
    document.getElementById('sub-name').value = subscription.name;
    document.getElementById('sub-cost').value = subscription.cost;
    document.getElementById('sub-billing').value = subscription.billing;
    document.getElementById('sub-category').value = subscription.category;
    document.getElementById('sub-date').value = subscription.nextPayment;

    modal.classList.add('active');
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    editingSubscriptionId = null;
}

closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Handle form submission (Add or Update)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const subscriptionData = {
        name: document.getElementById('sub-name').value,
        cost: parseFloat(document.getElementById('sub-cost').value),
        billing: document.getElementById('sub-billing').value,
        category: document.getElementById('sub-category').value,
        nextPayment: document.getElementById('sub-date').value
    };

    if (editingSubscriptionId) {
        // Update existing subscription
        await updateSubscription(editingSubscriptionId, subscriptionData);
    } else {
        // Add new subscription
        await addSubscription(subscriptionData);
    }

    closeModal();
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.flexDirection = 'column';
            navLinks.style.margin = '1rem';
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Firebase to be ready
    if (typeof firebase !== 'undefined' && window.db) {
        loadSubscriptions();
    } else {
        console.error('Firebase not initialized. Please check firebase-config.js');
    }
});

