document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Map
    const map = L.map('map', {
        zoomControl: false // We can add it back later if needed to customize position
    }).setView([USER_LOCATION.lat, USER_LOCATION.lng], 14);

    // Add Dark Mode Map Tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Add user location marker
    const userIcon = L.divIcon({
        className: 'custom-marker user-marker',
        html: '<i class="fa-solid fa-street-view"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    L.marker([USER_LOCATION.lat, USER_LOCATION.lng], { icon: userIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup('<b>You are here</b>')
        .openPopup();

    document.getElementById('current-location').textContent = USER_LOCATION.name;

    const state = {
        filter: 'all', // 'all', 'delivery', 'pickup'
        searchQuery: '',
        markers: {}, // Store references to map markers
        cart: [] // Array of { cartItemId, kitchenId, item, fulfillment }
    };

    const DOM = {
        kitchenList: document.getElementById('kitchen-list'),
        kitchenCount: document.getElementById('kitchen-count'),
        searchInput: document.getElementById('search-input'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        // Modal DOM elements
        modal: document.getElementById('menu-modal'),
        closeModalBtn: document.getElementById('close-modal'),
        modalKitchenName: document.getElementById('modal-kitchen-name'),
        modalKitchenCuisine: document.getElementById('modal-kitchen-cuisine'),
        modalMenuList: document.getElementById('modal-menu-list'),
        // Host Modal DOM elements
        hostModal: document.getElementById('host-modal'),
        closeHostModalBtn: document.getElementById('close-host-modal'),
        hostAvatar: document.getElementById('host-avatar'),
        modalHostName: document.getElementById('modal-host-name'),
        modalHostTypeText: document.getElementById('modal-host-type-text'),
        modalHostBio: document.getElementById('modal-host-bio'),
        modalHostKitchens: document.getElementById('modal-host-kitchens'),
        // Cart DOM elements
        cartFab: document.getElementById('cart-fab'),
        cartCount: document.getElementById('cart-count'),
        cartSidebar: document.getElementById('cart-sidebar'),
        closeCartBtn: document.getElementById('close-cart'),
        cartItemsContainer: document.getElementById('cart-items-container'),
        cartTotalPrice: document.getElementById('cart-total-price'),
        // Checkout & Invoice DOM
        checkoutBtn: document.getElementById('checkout-btn'),
        checkoutModal: document.getElementById('checkout-modal'),
        closeCheckoutBtn: document.getElementById('close-checkout'),
        checkoutSubtotal: document.getElementById('checkout-subtotal'),
        checkoutDeliveryFee: document.getElementById('checkout-delivery-fee'),
        checkoutTotal: document.getElementById('checkout-total'),
        paymentSpinner: document.getElementById('payment-spinner'),
        invoiceModal: document.getElementById('invoice-modal'),
        closeInvoiceBtn: document.getElementById('close-invoice'),
        invoicePaymentMethod: document.getElementById('invoice-payment-method'),
        invoiceTotalPaid: document.getElementById('invoice-total-paid'),
        trackerContainer: document.getElementById('tracker-container'),
        // Host Dashboard DOM
        hostPortalBtn: document.getElementById('host-portal-btn'),
        hostLoginModal: document.getElementById('host-login-modal'),
        closeHostLoginBtn: document.getElementById('close-host-login'),
        hostLoginList: document.getElementById('host-login-list'),
        hostDashboardView: document.getElementById('host-dashboard-view'),
        dashboardHostTitle: document.getElementById('dashboard-host-title'),
        exitHostBtn: document.getElementById('exit-host-btn'),
        statActiveOrders: document.getElementById('stat-active-orders'),
        statRevenue: document.getElementById('stat-revenue'),
        dashboardOrdersList: document.getElementById('dashboard-orders-list'),
        // Driver Dashboard DOM
        driverPortalBtn: document.getElementById('driver-portal-btn'),
        driverLoginModal: document.getElementById('driver-login-modal'),
        closeDriverLoginBtn: document.getElementById('close-driver-login'),
        driverLoginList: document.getElementById('driver-login-list'),
        driverDashboardView: document.getElementById('driver-dashboard-view'),
        dashboardDriverTitle: document.getElementById('dashboard-driver-title'),
        exitDriverBtn: document.getElementById('exit-driver-btn'),
        statActiveDeliveries: document.getElementById('stat-active-deliveries'),
        statDriverRevenue: document.getElementById('stat-driver-revenue'),
        dashboardDeliveriesList: document.getElementById('dashboard-deliveries-list')
    };

    // 3. Render Functions
    function renderKitchens() {
        // Filter Data
        const filtered = KITCHENS.filter(kitchen => {
            // Delivery/Pickup filter
            if (state.filter === 'delivery' && !kitchen.delivery) return false;
            if (state.filter === 'pickup' && !kitchen.pickup) return false;

            // Search filter
            if (state.searchQuery) {
                const query = state.searchQuery.toLowerCase();
                if (!kitchen.name.toLowerCase().includes(query) &&
                    !kitchen.cuisine.toLowerCase().includes(query)) {
                    return false;
                }
            }
            return true;
        });

        // Sort by distance roughly
        filtered.sort((a, b) => a.distance - b.distance);

        // Update UI
        DOM.kitchenList.innerHTML = '';
        DOM.kitchenCount.textContent = `${filtered.length} found`;

        // Clear existing markers (except user)
        Object.values(state.markers).forEach(marker => map.removeLayer(marker));
        state.markers = {};

        filtered.forEach(kitchen => {
            // Render Card
            const host = HOSTS.find(h => h.id === kitchen.hostId);
            const card = document.createElement('div');
            card.className = 'kitchen-card';
            card.dataset.id = kitchen.id;

            card.innerHTML = `
                <div class="card-header">
                    <img src="${kitchen.image}" alt="${kitchen.name}" class="kitchen-image">
                    <div class="kitchen-info">
                        <h3>${kitchen.name}</h3>
                        <div class="host-name host-name-link">
                            <i class="fa-solid fa-user-chef"></i> 
                            Hosted by ${host ? host.name : 'Unknown'}
                        </div>
                        <div class="rating">
                            <i class="fa-solid fa-star"></i> 
                            ${kitchen.rating} <span>(${kitchen.reviews} reviews)</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="tags">
                        <span class="tag cuisine">${kitchen.cuisine}</span>
                        <span class="tag distance">${kitchen.distance} mi</span>
                    </div>
                    <div class="tags">
                        ${kitchen.delivery ? '<span class="tag delivery tooltip-container" data-tooltip="Delivery: We bring the food straight to you"><i class="fa-solid fa-motorcycle"></i></span>' : ''}
                        ${kitchen.pickup ? '<span class="tag pickup tooltip-container" data-tooltip="Pickup: Collect your food straight from the kitchen"><i class="fa-solid fa-bag-shopping"></i></span>' : ''}
                    </div>
                </div>
                <button class="view-menu-btn" data-id="${kitchen.id}">View Menu</button>
            `;

            // Hover interactions
            card.addEventListener('mouseenter', () => highlightMarker(kitchen.id, true));
            card.addEventListener('mouseleave', () => highlightMarker(kitchen.id, false));

            // Click to open host modal
            const hostLink = card.querySelector('.host-name-link');
            if (hostLink) {
                hostLink.addEventListener('click', (e) => {
                    e.stopPropagation(); // prevent flying to map
                    openHostModal(kitchen.hostId);
                });
            }

            // Click to fly to map
            card.addEventListener('click', (e) => {
                // If it's the view menu button, open menu instead
                if (e.target.classList.contains('view-menu-btn')) {
                    openMenuModal(kitchen.id);
                    return;
                }

                map.flyTo([kitchen.lat, kitchen.lng], 16, { animate: true, duration: 1.5 });
                state.markers[kitchen.id].openPopup();

                // Set active card styling
                document.querySelectorAll('.kitchen-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });

            DOM.kitchenList.appendChild(card);

            // Add Map Marker
            const markerIcon = L.divIcon({
                className: `custom-marker kitchen-marker-${kitchen.id}`,
                html: '<i class="fa-solid fa-utensils"></i>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const marker = L.marker([kitchen.lat, kitchen.lng], { icon: markerIcon })
                .addTo(map)
                .bindPopup(`
                    <div style="text-align:center">
                        <h3 style="margin:0;color:#fc5c65;">${kitchen.name}</h3>
                        <p style="margin:4px 0 0 0;font-size:12px;">${kitchen.cuisine} • ${kitchen.distance} mi</p>
                    </div>
                `);

            state.markers[kitchen.id] = marker;
        });
    }

    // 4. Interaction Functions
    function highlightMarker(id, isHighlight) {
        const markerEl = document.querySelector(`.kitchen-marker-${id}`);
        if (markerEl) {
            if (isHighlight) {
                markerEl.classList.add('active');
            } else {
                markerEl.classList.remove('active');
            }
        }
    }

    function openMenuModal(kitchenId) {
        const kitchen = KITCHENS.find(k => k.id === kitchenId);
        if (!kitchen) return;

        // Populate Modal Info
        DOM.modalKitchenName.textContent = kitchen.name;
        DOM.modalKitchenCuisine.innerHTML = `<i class="fa-solid fa-utensils"></i> ${kitchen.cuisine} • <i class="fa-solid fa-star" style="color:#ffd32a"></i> ${kitchen.rating}`;

        // Populate Menu Items
        DOM.modalMenuList.innerHTML = '';
        if (kitchen.menu && kitchen.menu.length > 0) {
            kitchen.menu.forEach(item => {
                const menuItemEl = document.createElement('div');
                menuItemEl.className = 'menu-item';
                menuItemEl.innerHTML = `
                    <div class="menu-item-header">
                        <span class="menu-item-title">${item.name}</span>
                        <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <p class="menu-item-desc">${item.description}</p>
                    <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                        <div class="taste-tag"><i class="fa-solid fa-leaf"></i> Taste: ${item.taste}</div>
                        <button class="add-to-cart-btn" data-kid="${kitchenId}" data-mid="${item.id}">Add to Cart</button>
                    </div>
                `;

                // Add to cart event
                menuItemEl.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                    addToCart(kitchenId, item);
                });

                DOM.modalMenuList.appendChild(menuItemEl);
            });
        } else {
            DOM.modalMenuList.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">Menu coming soon!</p>';
        }

        // Show Modal
        DOM.modal.classList.remove('hidden');
    }

    function closeMenuModal() {
        DOM.modal.classList.add('hidden');
    }

    function openHostModal(hostId) {
        const host = HOSTS.find(h => h.id === hostId);
        if (!host) return;

        // Populate Host Info
        DOM.hostAvatar.src = host.image;
        DOM.modalHostName.textContent = host.name;
        DOM.modalHostTypeText.textContent = host.type;
        DOM.modalHostBio.textContent = host.bio;

        // Populate Host's Kitchens
        DOM.modalHostKitchens.innerHTML = '';
        const hostKitchens = KITCHENS.filter(k => k.hostId === hostId);

        hostKitchens.forEach(hk => {
            const hkEl = document.createElement('div');
            hkEl.className = 'host-kitchen-card';
            hkEl.innerHTML = `
                <div class="host-kitchen-info">
                    <h4>${hk.name}</h4>
                    <span class="host-kitchen-metrics"><i class="fa-solid fa-star" style="color:#ffd32a"></i> ${hk.rating} • ${hk.cuisine}</span>
                </div>
                <button class="visit-kitchen-btn" data-id="${hk.id}">View Menu</button>
            `;

            // Go to menu
            hkEl.querySelector('.visit-kitchen-btn').addEventListener('click', () => {
                closeHostModal();
                openMenuModal(hk.id);
                // Fly to map marker
                map.flyTo([hk.lat, hk.lng], 16, { animate: true, duration: 1.5 });
                if (state.markers[hk.id]) state.markers[hk.id].openPopup();

                // Active Card styling
                document.querySelectorAll('.kitchen-card').forEach(c => c.classList.remove('active'));
                const listCard = document.querySelector(`.kitchen-card[data-id="${hk.id}"]`);
                if (listCard) {
                    listCard.classList.add('active');
                    listCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
            DOM.modalHostKitchens.appendChild(hkEl);
        });

        // Show Modal
        DOM.hostModal.classList.remove('hidden');
    }

    function closeHostModal() {
        DOM.hostModal.classList.add('hidden');
    }

    // Cart Logic
    function addToCart(kitchenId, item) {
        const kitchen = KITCHENS.find(k => k.id === kitchenId);
        const defaultFulfillment = kitchen.pickup ? 'pickup' : 'delivery';

        state.cart.push({
            cartItemId: 'c_' + Math.random().toString(36).substr(2, 9),
            kitchenId: kitchenId,
            item: item,
            fulfillment: defaultFulfillment
        });

        renderCart();

        // Button animation feedback
        const btn = document.querySelector(`.add-to-cart-btn[data-mid="${item.id}"]`);
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = "Added!";
            btn.style.background = "#26de81";
            btn.style.color = "#1a1e24";
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = "";
                btn.style.color = "";
            }, 1000);
        }
    }

    function removeFromCart(cartItemId) {
        state.cart = state.cart.filter(c => c.cartItemId !== cartItemId);
        renderCart();
    }

    function updateFulfillment(cartItemId, method) {
        const cartItem = state.cart.find(c => c.cartItemId === cartItemId);
        if (cartItem) {
            cartItem.fulfillment = method;
            renderCart();
        }
    }

    function renderCart() {
        DOM.cartCount.textContent = state.cart.length;

        if (state.cart.length === 0) {
            DOM.cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            DOM.cartTotalPrice.textContent = '$0.00';
            return;
        }

        // Group by kitchen
        const groups = {};
        let total = 0;

        state.cart.forEach(cItem => {
            if (!groups[cItem.kitchenId]) {
                groups[cItem.kitchenId] = [];
            }
            groups[cItem.kitchenId].push(cItem);
            total += cItem.item.price;
        });

        DOM.cartItemsContainer.innerHTML = '';

        Object.keys(groups).forEach(kid => {
            const kitchen = KITCHENS.find(k => k.id === kid);
            const groupEl = document.createElement('div');
            groupEl.className = 'cart-kitchen-group';

            let groupHTML = `<div class="cart-kitchen-header">${kitchen.name}</div>`;

            groups[kid].forEach(cItem => {
                groupHTML += `
                    <div class="cart-item">
                        <div class="cart-item-row">
                            <div class="cart-item-info">
                                <strong>${cItem.item.name}</strong>
                            </div>
                            <div class="cart-item-price">$${cItem.item.price.toFixed(2)}</div>
                        </div>
                        <div class="cart-item-row" style="margin-top:0.5rem;">
                            <div class="fulfillment-toggle">
                                <button class="fulfillment-btn ${cItem.fulfillment === 'delivery' ? 'active' : ''} ${!kitchen.delivery ? 'hidden' : ''}" 
                                    onclick="window.appUpdateFulfillment('${cItem.cartItemId}', 'delivery')">Delivery</button>
                                <button class="fulfillment-btn ${cItem.fulfillment === 'pickup' ? 'active' : ''} ${!kitchen.pickup ? 'hidden' : ''}" 
                                    onclick="window.appUpdateFulfillment('${cItem.cartItemId}', 'pickup')">Pickup</button>
                            </div>
                            <button class="remove-item-btn" onclick="window.appRemoveFromCart('${cItem.cartItemId}')"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                `;
            });

            groupEl.innerHTML = groupHTML;
            DOM.cartItemsContainer.appendChild(groupEl);
        });

        DOM.cartTotalPrice.textContent = '$' + total.toFixed(2);
    }

    // Mount globals for inline onclicks in cart
    window.appUpdateFulfillment = updateFulfillment;
    window.appRemoveFromCart = removeFromCart;

    // Dashboard Logic
    function renderHostLoginList() {
        DOM.hostLoginList.innerHTML = '';
        HOSTS.forEach(host => {
            const btn = document.createElement('button');
            btn.className = 'payment-btn';
            btn.style.justifyContent = 'flex-start';
            btn.innerHTML = `<img src="${host.image}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;"> <span>${host.name}</span>`;
            btn.addEventListener('click', () => {
                DOM.hostLoginModal.classList.add('hidden');
                openDashboard(host.id);
            });
            DOM.hostLoginList.appendChild(btn);
        });
    }

    function openDashboard(hostId) {
        state.activeHostId = hostId;
        const host = HOSTS.find(h => h.id === hostId);
        DOM.dashboardHostTitle.textContent = `Dashboard: ${host.name}`;

        document.querySelector('.app-container').style.display = 'none';

        // Find kitchens owned by host
        const hostKitchenIds = KITCHENS.filter(k => k.hostId === hostId).map(k => k.id);

        // Find orders for those kitchens
        const hostOrders = MOCK_ORDERS.filter(o => hostKitchenIds.includes(o.kitchenId));

        // Calculate stats
        const activeCount = hostOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Picked Up').length;
        let revenue = 0;
        hostOrders.forEach(o => {
            o.items.forEach(i => revenue += i.price * i.quantity);
        });

        DOM.statActiveOrders.textContent = activeCount;
        DOM.statRevenue.textContent = '$' + revenue.toFixed(2);

        // Render orders
        DOM.dashboardOrdersList.innerHTML = '';
        if (hostOrders.length === 0) {
            DOM.dashboardOrdersList.innerHTML = '<p class="empty-cart-msg">No recent orders found.</p>';
        } else {
            hostOrders.sort((a, b) => b.id.localeCompare(a.id)).forEach(order => {
                const kitchen = KITCHENS.find(k => k.id === order.kitchenId);
                const orderEl = document.createElement('div');
                orderEl.className = 'cart-kitchen-group';

                let itemsHtml = order.items.map(i => `
                    <div class="cart-item-row" style="margin-top:0.3rem;">
                        <span style="color:var(--text-main);">${i.quantity}x ${i.name}</span>
                        <span style="color:var(--text-muted);">$${(i.price * i.quantity).toFixed(2)}</span>
                    </div>
                `).join('');

                const methodClass = order.fulfillment === 'delivery' ? 'delivery' : 'pickup';
                const methodIcon = order.fulfillment === 'delivery' ? 'fa-motorcycle' : 'fa-bag-shopping';

                orderEl.innerHTML = `
                    <div class="cart-kitchen-header" style="display:flex; justify-content:space-between;">
                        <span>Order ${order.id} - ${order.customerName}</span>
                        <span style="color:var(--text-muted); font-size:0.9rem;">${order.time}</span>
                    </div>
                    <div style="padding: 1rem; border-bottom: 1px solid var(--glass-border);">
                        <div style="margin-bottom:0.5rem; font-size:0.9rem; color:var(--text-muted);">
                            <i class="fa-solid fa-store"></i> ${kitchen.name} 
                            &nbsp;&middot;&nbsp; 
                            <span class="tracker-method ${methodClass}"><i class="fa-solid ${methodIcon}"></i> ${order.fulfillment.charAt(0).toUpperCase() + order.fulfillment.slice(1)}</span>
                        </div>
                        ${itemsHtml}
                    </div>
                    <div style="padding: 1rem; background:rgba(0,0,0,0.2); display:flex; justify-content:space-between; align-items:center;">
                        <span style="color:var(--text-main); font-weight:600;">Status: <span style="color:var(--accent-color);">${order.status}</span></span>
                        <div style="display:flex; gap:0.5rem;">
                            <button class="add-to-cart-btn ready-btn" style="background:#26de81; color:#1a1e24; border:none;"><i class="fa-solid fa-check"></i> Ready</button>
                            <button class="add-to-cart-btn decline-btn" style="background:#ff4757; color:#fff; border:none;"><i class="fa-solid fa-xmark"></i> Decline</button>
                        </div>
                    </div>
                `;
                DOM.dashboardOrdersList.appendChild(orderEl);

                // Attach Event Listeners
                const readyBtn = orderEl.querySelector('.ready-btn');
                const declineBtn = orderEl.querySelector('.decline-btn');

                readyBtn.addEventListener('click', () => {
                    const targetOrder = MOCK_ORDERS.find(o => o.id === order.id);
                    if (targetOrder) {
                        targetOrder.status = 'Ready';
                        openDashboard(hostId);
                    }
                });

                declineBtn.addEventListener('click', () => {
                    const targetOrder = MOCK_ORDERS.find(o => o.id === order.id);
                    if (targetOrder) {
                        targetOrder.status = 'Declined';
                        openDashboard(hostId);
                    }
                });
            });
        }

        DOM.hostDashboardView.classList.remove('hidden');
    }

    function exitDashboard() {
        state.activeHostId = null;
        DOM.hostDashboardView.classList.add('hidden');
        document.querySelector('.app-container').style.display = 'flex';
    }

    // Driver Dashboard Logic
    function renderDriverLoginList() {
        DOM.driverLoginList.innerHTML = '';
        DRIVERS.forEach(driver => {
            const btn = document.createElement('button');
            btn.className = 'payment-btn';
            btn.style.justifyContent = 'flex-start';
            btn.innerHTML = `<img src="${driver.image}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;"> <span>${driver.name} - ${driver.vehicle}</span>`;
            btn.addEventListener('click', () => {
                DOM.driverLoginModal.classList.add('hidden');
                openDriverDashboard(driver.id);
            });
            DOM.driverLoginList.appendChild(btn);
        });
    }

    function openDriverDashboard(driverId) {
        state.activeDriverId = driverId;
        const driver = DRIVERS.find(d => d.id === driverId);
        DOM.dashboardDriverTitle.textContent = `Dashboard: ${driver.name}`;

        document.querySelector('.app-container').style.display = 'none';

        // Find assigned orders
        const driverOrders = MOCK_ORDERS.filter(o => o.driverId === driverId && o.status !== 'Delivered');

        DOM.statActiveDeliveries.textContent = driverOrders.length;

        let totalEarnings = 0;

        DOM.dashboardDeliveriesList.innerHTML = '';
        if (driverOrders.length === 0) {
            DOM.dashboardDeliveriesList.innerHTML = '<p class="empty-cart-msg">No pending deliveries found.</p>';
        } else {
            driverOrders.forEach(order => {
                const kitchen = KITCHENS.find(k => k.id === order.kitchenId);

                let orderTotal = 0;
                order.items.forEach(i => orderTotal += i.price * i.quantity);

                // Payout Logic: 4% (1-50), 5% (50-100), 6% (>100)
                let commissionRate = 0.04;
                if (orderTotal > 50 && orderTotal <= 100) commissionRate = 0.05;
                else if (orderTotal > 100) commissionRate = 0.06;

                const payout = orderTotal * commissionRate;
                totalEarnings += payout;

                const orderEl = document.createElement('div');
                orderEl.className = 'cart-kitchen-group';

                orderEl.innerHTML = `
                    <div class="cart-kitchen-header" style="display:flex; justify-content:space-between;">
                        <span>Order ${order.id} - ${order.customerName}</span>
                        <span style="color:var(--text-muted); font-size:0.9rem;">${order.time}</span>
                    </div>
                    <div style="padding: 1rem; border-bottom: 1px solid var(--glass-border);">
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.9rem; color:var(--text-muted);">
                            <span><i class="fa-solid fa-store"></i> Pick up from: ${kitchen.name}</span>
                            <span><i class="fa-solid fa-location-dot"></i> Distance: ${kitchen.distance} mi</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 1rem;">
                            <div>
                                <span style="display:block; color:var(--text-main); font-size:0.9rem;">Order Total: $${orderTotal.toFixed(2)}</span>
                                <span style="display:block; color:var(--text-muted); font-size:0.8rem;">Commission Rate: ${(commissionRate * 100).toFixed(0)}%</span>
                            </div>
                            <div style="text-align:right;">
                                <span style="display:block; color:var(--text-muted); font-size:0.8rem;">Your Payout</span>
                                <span style="display:block; color:#26de81; font-weight:700; font-size:1.2rem;">+$${payout.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div style="padding: 1rem; background:rgba(0,0,0,0.2); display:flex; justify-content:space-between; align-items:center;">
                        <span style="color:var(--text-main); font-weight:600;">Status: <span style="color:var(--accent-color);">${order.status}</span></span>
                        <button class="add-to-cart-btn" style="background:var(--accent-color); color:#fff; border:none;"><i class="fa-solid fa-check"></i> Complete Delivery</button>
                    </div>
                `;
                DOM.dashboardDeliveriesList.appendChild(orderEl);
            });
        }

        DOM.statDriverRevenue.textContent = '$' + totalEarnings.toFixed(2);
        DOM.driverDashboardView.classList.remove('hidden');
    }

    function exitDriverDashboard() {
        state.activeDriverId = null;
        DOM.driverDashboardView.classList.add('hidden');
        document.querySelector('.app-container').style.display = 'flex';
    }

    // 5. Event Listeners
    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active styling
            DOM.filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Update state and re-render
            state.filter = e.target.dataset.filter;
            renderKitchens();
        });
    });

    DOM.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderKitchens();
    });

    // Modal Close Events
    DOM.closeModalBtn.addEventListener('click', closeMenuModal);
    DOM.modal.addEventListener('click', (e) => {
        if (e.target === DOM.modal) {
            closeMenuModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!DOM.modal.classList.contains('hidden')) closeMenuModal();
            if (!DOM.hostModal.classList.contains('hidden')) closeHostModal();
            if (!DOM.checkoutModal.classList.contains('hidden')) DOM.checkoutModal.classList.add('hidden');
            if (!DOM.invoiceModal.classList.contains('hidden')) DOM.invoiceModal.classList.add('hidden');
            if (!DOM.hostLoginModal.classList.contains('hidden')) DOM.hostLoginModal.classList.add('hidden');
            if (!DOM.driverLoginModal.classList.contains('hidden')) DOM.driverLoginModal.classList.add('hidden');
        }
    });

    // Host Modal Close Events
    DOM.closeHostModalBtn.addEventListener('click', closeHostModal);
    DOM.hostModal.addEventListener('click', (e) => {
        if (e.target === DOM.hostModal) closeHostModal();
    });

    // Cart Sidebar Events
    DOM.cartFab.addEventListener('click', () => {
        DOM.cartSidebar.classList.remove('hidden');
    });
    DOM.closeCartBtn.addEventListener('click', () => {
        DOM.cartSidebar.classList.add('hidden');
    });

    // Checkout Events
    DOM.checkoutBtn.addEventListener('click', () => {
        if (state.cart.length === 0) return;

        let subtotal = 0;
        const kitchensDelivering = new Set();
        state.cart.forEach(c => {
            subtotal += c.item.price;
            if (c.fulfillment === 'delivery') kitchensDelivering.add(c.kitchenId);
        });

        // $4.99 flat delivery fee per kitchen delivering
        const deliveryFee = kitchensDelivering.size * 4.99;
        const total = subtotal + deliveryFee;
        state.currentCheckoutTotal = total;

        DOM.checkoutSubtotal.textContent = '$' + subtotal.toFixed(2);
        DOM.checkoutDeliveryFee.textContent = '$' + deliveryFee.toFixed(2);
        DOM.checkoutTotal.textContent = '$' + total.toFixed(2);

        DOM.cartSidebar.classList.add('hidden');
        DOM.checkoutModal.classList.remove('hidden');
    });

    DOM.closeCheckoutBtn.addEventListener('click', () => {
        DOM.checkoutModal.classList.add('hidden');
    });
    DOM.closeInvoiceBtn.addEventListener('click', () => {
        DOM.invoiceModal.classList.add('hidden');
    });

    // Host Dashboard Events
    DOM.hostPortalBtn.addEventListener('click', () => {
        DOM.hostLoginModal.classList.remove('hidden');
    });
    DOM.closeHostLoginBtn.addEventListener('click', () => {
        DOM.hostLoginModal.classList.add('hidden');
    });
    DOM.exitHostBtn.addEventListener('click', exitDashboard);

    // Driver Dashboard Events
    DOM.driverPortalBtn.addEventListener('click', () => {
        DOM.driverLoginModal.classList.remove('hidden');
    });
    DOM.closeDriverLoginBtn.addEventListener('click', () => {
        DOM.driverLoginModal.classList.add('hidden');
    });
    DOM.exitDriverBtn.addEventListener('click', exitDriverDashboard);

    // Payment Processing Logic
    window.processPayment = function (method) {
        DOM.paymentSpinner.classList.remove('hidden');
        const payDiv = document.querySelector('.payment-methods');
        payDiv.style.opacity = '0.5';
        payDiv.style.pointerEvents = 'none';

        setTimeout(() => {
            // Reset checkout state
            DOM.paymentSpinner.classList.add('hidden');
            payDiv.style.opacity = '1';
            payDiv.style.pointerEvents = 'auto';
            DOM.checkoutModal.classList.add('hidden');

            // Setup Invoice
            DOM.invoicePaymentMethod.textContent = method;
            DOM.invoiceTotalPaid.textContent = '$' + state.currentCheckoutTotal.toFixed(2);

            // Build Tracker
            buildTracker();

            // Clear Cart
            state.cart = [];
            renderCart();

            // Show Invoice
            DOM.invoiceModal.classList.remove('hidden');

        }, 1500);
    };

    function buildTracker() {
        DOM.trackerContainer.innerHTML = '';

        const groups = {};
        state.cart.forEach(c => {
            if (!groups[c.kitchenId]) {
                groups[c.kitchenId] = {
                    kitchen: KITCHENS.find(k => k.id === c.kitchenId),
                    fulfillment: c.fulfillment
                };
            }
            if (c.fulfillment === 'delivery') groups[c.kitchenId].fulfillment = 'delivery';
        });

        Object.values(groups).forEach(g => {
            const tk = document.createElement('div');
            tk.className = 'tracker-kitchen';

            if (g.fulfillment === 'delivery') {
                tk.innerHTML = `
                    <div class="tracker-kitchen-name">
                        ${g.kitchen.name}
                        <span class="tracker-method delivery"><i class="fa-solid fa-motorcycle"></i> Delivery</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: 20%;" id="prog-${g.kitchen.id}"></div>
                    </div>
                    <div class="tracker-status-text" id="stat-${g.kitchen.id}">Preparing your order...</div>
                    <div class="driver-status hidden" id="drv-${g.kitchen.id}"><i class="fa-solid fa-user-check"></i> Driver Mike is waiting at kitchen</div>
                `;

                // Simulate tracking updates
                setTimeout(() => {
                    const p = document.getElementById(`prog-${g.kitchen.id}`);
                    const s = document.getElementById(`stat-${g.kitchen.id}`);
                    const d = document.getElementById(`drv-${g.kitchen.id}`);
                    if (p && s && d) {
                        p.style.width = '50%';
                        s.textContent = 'Order is ready. Handoff to driver.';
                        d.classList.remove('hidden');
                    }
                }, 3000);
                setTimeout(() => {
                    const p = document.getElementById(`prog-${g.kitchen.id}`);
                    const s = document.getElementById(`stat-${g.kitchen.id}`);
                    const d = document.getElementById(`drv-${g.kitchen.id}`);
                    if (p && s && d) {
                        p.style.width = '85%';
                        s.textContent = 'Driver is on the way!';
                        d.innerHTML = '<i class="fa-solid fa-car-side"></i> Driver Mike is 3 mins away';
                    }
                }, 7000);

            } else {
                tk.innerHTML = `
                    <div class="tracker-kitchen-name">
                        ${g.kitchen.name}
                        <span class="tracker-method pickup"><i class="fa-solid fa-bag-shopping"></i> Pickup</span>
                    </div>
                    <div class="tracker-status-text">Your order will be ready for pickup at ${g.kitchen.name} in approx 15 mins.</div>
                    <div class="driver-status" style="color:var(--text-muted);"><i class="fa-solid fa-location-dot"></i> Distance: ${g.kitchen.distance} mi</div>
                `;
            }
            DOM.trackerContainer.appendChild(tk);
        });
    }

    // Initial Render
    renderKitchens();
    renderHostLoginList();
    renderDriverLoginList();
});
