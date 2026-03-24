const HOSTS = [
    {
        id: "h1",
        name: "Maria Rossi",
        type: "Trained under Master Chef",
        bio: "Learned the art of pasta making directly from culinary legends in Naples.",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: "h2",
        name: "Aarav Patel",
        type: "Home Cook",
        bio: "Generations of family recipes passed down from my grandmother in Mumbai.",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        id: "h3",
        name: "Elena Gomez",
        type: "Culinary School Certified",
        bio: "Classic techniques applied to traditional Mexican street food.",
        image: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
        id: "h4",
        name: "Kenji Tanaka",
        type: "Professional",
        bio: "15 years experience working in top-tier sushi restaurants across Tokyo.",
        image: "https://randomuser.me/api/portraits/men/46.jpg"
    },
    {
        id: "h5",
        name: "Marcus Johnson",
        type: "Professional",
        bio: "Specializing in soulful Southern comfort food with a modern twist.",
        image: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
        id: "h6",
        name: "Sophie Blanc",
        type: "Culinary School Certified",
        bio: "Bringing the authentic taste of Parisian bistros straight to your door.",
        image: "https://randomuser.me/api/portraits/women/10.jpg"
    }
];

const KITCHENS = [
    {
        id: "k1",
        hostId: "h1",
        name: "Mama Rossi's Pasta",
        cuisine: "Italian",
        rating: 4.8,
        reviews: 124,
        distance: 0.8,
        delivery: true,
        pickup: true,
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=400&fit=crop",
        lat: 40.7142,
        lng: -74.0085,
        menu: [
            { id: "m1_1", name: "Classic Carbonara", price: 18.50, description: "Silky pasta with guanciale and pecorino romano.", taste: "Rich, savory, slightly salty with deep umami flavor" },
            { id: "m1_2", name: "Spicy Arrabbiata", price: 16.00, description: "Penne pasta in a fiery tomato sauce.", taste: "Very spicy, tangy, and robust" },
            { id: "m1_3", name: "Tiramisu", price: 8.50, description: "Coffee-flavored Italian dessert.", taste: "Mildly sweet, creamy, with a bitter coffee finish" }
        ]
    },
    {
        id: "k7",
        hostId: "h1",
        name: "Rossi's Pizzeria",
        cuisine: "Pizza",
        rating: 4.9,
        reviews: 312,
        distance: 0.9,
        delivery: true,
        pickup: true,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop",
        lat: 40.7150,
        lng: -74.0080,
        menu: [
            { id: "m7_1", name: "Margherita Pizza", price: 14.00, description: "Classic tomato sauce, fresh mozzarella, and basil.", taste: "Savory, cheesy, with fresh herbal notes" },
            { id: "m7_2", name: "Diavola Pizza", price: 17.50, description: "Spicy salami, chili flakes, and mozzarella.", taste: "Spicy, salty, and intensely savory" }
        ]
    },
    {
        id: "k2",
        hostId: "h2",
        name: "Spice Route Curries",
        cuisine: "Indian",
        rating: 4.9,
        reviews: 89,
        distance: 1.2,
        delivery: true,
        pickup: false,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop",
        lat: 40.7180,
        lng: -74.0040,
        menu: [
            { id: "m2_1", name: "Butter Chicken", price: 21.00, description: "Tender chicken simmered in a spiced tomato butter sauce.", taste: "Mildly sweet, creamy, with a rich umami flavor" },
            { id: "m2_2", name: "Vindaloo Curry", price: 19.50, description: "Traditional fiery Goan dish.", taste: "Very spicy, tangy, and highly seasoned" },
            { id: "m2_3", name: "Garlic Naan", price: 4.00, description: "Freshly baked Indian bread topped with garlic.", taste: "Salty, buttery with a pungent garlic flavor" }
        ]
    },
    {
        id: "k3",
        hostId: "h3",
        name: "Abuela's Tacos",
        cuisine: "Mexican",
        rating: 4.7,
        reviews: 215,
        distance: 2.5,
        delivery: false,
        pickup: true,
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=400&fit=crop",
        lat: 40.7090,
        lng: -73.9980,
        menu: [
            { id: "m3_1", name: "Al Pastor Tacos (3)", price: 14.00, description: "Marinated pork with pineapple on corn tortillas.", taste: "Sweet and savory, mildly spicy with a citrusy tang" },
            { id: "m3_2", name: "Birria Quesatacos (3)", price: 16.50, description: "Slow-cooked beef with melted cheese and consommé.", taste: "Very rich, salty, savory with deep umami flavor" },
            { id: "m3_3", name: "Churros", price: 6.00, description: "Fried dough pastries sprinkled with cinnamon sugar.", taste: "Sweet, warm, with notes of cinnamon" }
        ]
    },
    {
        id: "k4",
        hostId: "h4",
        name: "Tokyo Bites",
        cuisine: "Japanese",
        rating: 4.6,
        reviews: 156,
        distance: 1.5,
        delivery: true,
        pickup: true,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop",
        lat: 40.7155,
        lng: -73.9950,
        menu: [
            { id: "m4_1", name: "Shoyu Ramen", price: 18.00, description: "Soy-sauce based broth with chashu pork.", taste: "Deeply savory, salty, with intense umami flavor" },
            { id: "m4_2", name: "Spicy Tuna Roll", price: 12.00, description: "Fresh tuna mixed with spicy mayo inside a sushi roll.", taste: "Spicy, fresh, with a creamy umami taste" },
            { id: "m4_3", name: "Matcha Mochi", price: 5.00, description: "Chewy rice cake filled with green tea ice cream.", taste: "Mildly sweet, earthy, with a refreshing finish" }
        ]
    },
    {
        id: "k8",
        hostId: "h4",
        name: "Kyoto Matcha House",
        cuisine: "Desserts",
        rating: 4.9,
        reviews: 300,
        distance: 1.6,
        delivery: true,
        pickup: true,
        image: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=400&h=400&fit=crop",
        lat: 40.7160,
        lng: -73.9940,
        menu: [
            { id: "m8_1", name: "Matcha Crepe Cake", price: 9.50, description: "20 delicate layers of matcha crepes and cream.", taste: "Mildly sweet, earthy, and highly creamy" },
            { id: "m8_2", name: "Hojicha Latte", price: 6.00, description: "Roasted green tea latte.", taste: "Nutty, mildly sweet, with a roasted flavor" }
        ]
    },
    {
        id: "k5",
        hostId: "h5",
        name: "Soul Food Haven",
        cuisine: "American",
        rating: 4.9,
        reviews: 310,
        distance: 0.5,
        delivery: true,
        pickup: true,
        image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=400&fit=crop",
        lat: 40.7110,
        lng: -74.0110,
        menu: [
            { id: "m5_1", name: "Fried Chicken Plate", price: 20.00, description: "Crispy fried chicken with a side of mac and cheese.", taste: "Crispy, salty, savory and highly seasoned" },
            { id: "m5_2", name: "Spicy Jambalaya", price: 22.00, description: "Rice dish with sausage, shrimp, and holy trinity vegetables.", taste: "Very spicy, smoky, with complex savory flavors" },
            { id: "m5_3", name: "Peach Cobbler", price: 8.00, description: "Warm spiced peaches baked under a sweet crust.", taste: "Very sweet, buttery, with caramelized notes" }
        ]
    },
    {
        id: "k6",
        hostId: "h6",
        name: "Le Petit Four",
        cuisine: "French",
        rating: 4.5,
        reviews: 74,
        distance: 3.1,
        delivery: false,
        pickup: true,
        image: "https://images.unsplash.com/photo-1620286392095-21d4281f6d0a?w=400&h=400&fit=crop",
        lat: 40.7205,
        lng: -74.0100,
        menu: [
            { id: "m6_1", name: "Boeuf Bourguignon", price: 28.00, description: "Beef stew braised in red wine with pearl onions.", taste: "Rich, deeply savory with intense umami and wine notes" },
            { id: "m6_2", name: "French Onion Soup", price: 14.00, description: "Beef broth, caramelized onions topped with Gruyère cheese.", taste: "Salty, savory, with slightly sweet caramelized onion flavor" },
            { id: "m6_3", name: "Crème Brûlée", price: 10.00, description: "Vanilla custard topped with a layer of hard caramel.", taste: "Sweet, creamy, with a distinct caramelized sugar taste" }
        ]
    }
];

// Current user location (Downtown Manhattan, NY)
const USER_LOCATION = {
    name: "Downtown Manhattan, NY",
    lat: 40.7128,
    lng: -74.0060
};

const DRIVERS = [
    { id: "d1", name: "Mike T.", vehicle: "Honda Civic", image: "https://randomuser.me/api/portraits/men/75.jpg" },
    { id: "d2", name: "Sarah L.", vehicle: "Bicycle", image: "https://randomuser.me/api/portraits/women/65.jpg" }
];

const MOCK_ORDERS = [
    {
        id: "ORD-1001",
        kitchenId: "k1",
        customerName: "Alice W.",
        items: [
            { name: "Classic Carbonara", quantity: 2, price: 18.50 },
            { name: "Tiramisu", quantity: 1, price: 8.50 }
        ],
        fulfillment: "delivery",
        driverId: "d1",
        status: "Preparing",
        time: "12:15 PM"
    },
    {
        id: "ORD-1002",
        kitchenId: "k7",
        customerName: "Bob M.",
        items: [
            { name: "Diavola Pizza", quantity: 1, price: 17.50 }
        ],
        fulfillment: "pickup",
        status: "Ready",
        time: "12:30 PM"
    },
    {
        id: "ORD-1003",
        kitchenId: "k2",
        customerName: "Charlie D.",
        items: [
            { name: "Butter Chicken", quantity: 1, price: 21.00 },
            { name: "Garlic Naan", quantity: 3, price: 4.00 }
        ],
        fulfillment: "delivery",
        driverId: "d1",
        status: "New",
        time: "12:45 PM"
    },
    {
        id: "ORD-1004",
        kitchenId: "k4",
        customerName: "Diana P.",
        items: [
            { name: "Shoyu Ramen", quantity: 2, price: 18.00 },
            { name: "Spicy Tuna Roll", quantity: 1, price: 12.00 }
        ],
        fulfillment: "pickup",
        status: "Preparing",
        time: "1:00 PM"
    },
    {
        id: "ORD-1005",
        kitchenId: "k5",
        customerName: "Evan R.",
        items: [
            { name: "Fried Chicken Plate", quantity: 4, price: 20.00 },
            { name: "Spicy Jambalaya", quantity: 1, price: 22.00 }
        ],
        fulfillment: "delivery",
        driverId: "d1",
        status: "New",
        time: "1:15 PM"
    },
    {
        id: "ORD-1006",
        kitchenId: "k8",
        customerName: "Fiona G.",
        items: [
            { name: "Matcha Crepe Cake", quantity: 6, price: 9.50 },
            { name: "Hojicha Latte", quantity: 2, price: 6.00 }
        ],
        fulfillment: "delivery",
        driverId: "d2",
        status: "Ready",
        time: "1:30 PM"
    }
];
