import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js";

dotenv.config();

const products = [
  // ── Electronics ──────────────────────────────────────
  {
    name: "iPhone 15 Pro Max",
    price: 159900,
    description: "A17 Pro chip, 48MP triple camera system, titanium design, 4K ProRes video, Action Button.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 30,
    rating: 4.9,
    numReviews: 512,
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    price: 129999,
    description: "200MP camera, Snapdragon 8 Gen 3, 12GB RAM, 256GB storage, titanium frame with S Pen.",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 25,
    rating: 4.8,
    numReviews: 312,
  },
  {
    name: "Apple MacBook Air M3",
    price: 114900,
    description: "Apple M3 chip, 16GB RAM, 512GB SSD, 15.3-inch Liquid Retina display, 18-hr battery.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 18,
    rating: 4.9,
    numReviews: 198,
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    price: 29990,
    description: "Industry-leading noise cancellation, 30-hour battery, multipoint connection, Hi-Res Audio.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 40,
    rating: 4.7,
    numReviews: 450,
  },
  {
    name: "iPad Pro 12.9\" M4",
    price: 109900,
    description: "Ultra Retina XDR display, Apple M4 chip, 256GB, Wi-Fi 6E, Apple Pencil Pro support.",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 12,
    rating: 4.8,
    numReviews: 145,
  },
  {
    name: "JBL Flip 6 Bluetooth Speaker",
    price: 9999,
    description: "IP67 waterproof, 12-hour playtime, PartyBoost, JBL Original Pro Sound, dual passive radiators.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 60,
    rating: 4.6,
    numReviews: 523,
  },
  {
    name: "Canon EOS R50 Mirrorless Camera",
    price: 69990,
    description: "24.2MP APS-C sensor, 4K video, Dual Pixel CMOS AF II, lightweight compact body.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 8,
    rating: 4.6,
    numReviews: 93,
  },
  {
    name: "Apple Watch Series 9",
    price: 41900,
    description: "S9 chip, Double Tap gesture, 18-hour battery, Always-On Retina display, ECG & Blood Oxygen.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 22,
    rating: 4.7,
    numReviews: 341,
  },
  {
    name: "OnePlus 12 5G",
    price: 64999,
    description: "Snapdragon 8 Gen 3, 50MP Hasselblad camera, 100W SUPERVOOC charging, 5400mAh battery.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 35,
    rating: 4.5,
    numReviews: 287,
  },
  {
    name: "Dell XPS 15 Laptop",
    price: 149990,
    description: "Intel Core i9, 32GB RAM, 1TB SSD, OLED 4K display, NVIDIA RTX 4070 GPU.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
    category: "Electronics",
    stock: 10,
    rating: 4.7,
    numReviews: 167,
  },

  // ── Clothing ──────────────────────────────────────────
  {
    name: "Nike Air Max 270 React",
    price: 12995,
    description: "Lightweight React foam cushioning, Air Max unit in heel, breathable mesh upper.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    category: "Clothing",
    stock: 50,
    rating: 4.5,
    numReviews: 389,
  },
  {
    name: "Levi's 511 Slim Fit Jeans",
    price: 3499,
    description: "Slim fit from hip to ankle, mid rise, stretch denim for all-day comfort. Classic 5-pocket styling.",
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500&h=500&fit=crop",
    category: "Clothing",
    stock: 75,
    rating: 4.4,
    numReviews: 612,
  },
  {
    name: "Adidas Ultraboost 22",
    price: 17999,
    description: "BOOST midsole for incredible energy return, Primeknit+ upper, Continental rubber outsole.",
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500&h=500&fit=crop",
    category: "Clothing",
    stock: 30,
    rating: 4.6,
    numReviews: 278,
  },
  {
    name: "H&M Oversized Hoodie",
    price: 1799,
    description: "Relaxed-fit hoodie in soft cotton-blend fleece. Kangaroo pocket, ribbed cuffs and hem.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&h=500&fit=crop",
    category: "Clothing",
    stock: 100,
    rating: 4.2,
    numReviews: 845,
  },
  {
    name: "Zara Slim Fit Blazer",
    price: 5990,
    description: "Slim fit blazer in structured fabric. Notch lapels, front flap pockets, single back vent.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=500&fit=crop",
    category: "Clothing",
    stock: 45,
    rating: 4.3,
    numReviews: 196,
  },
  {
    name: "Puma Training T-Shirt",
    price: 1299,
    description: "dryCELL moisture-wicking fabric, slim fit, 100% polyester, reflective logo.",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=500&fit=crop",
    category: "Clothing",
    stock: 120,
    rating: 4.1,
    numReviews: 432,
  },

  // ── Books ─────────────────────────────────────────────
  {
    name: "Atomic Habits – James Clear",
    price: 499,
    description: "An easy and proven way to build good habits and break bad ones. #1 New York Times bestseller.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop",
    category: "Books",
    stock: 200,
    rating: 4.9,
    numReviews: 2100,
  },
  {
    name: "The Psychology of Money",
    price: 349,
    description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel. 19 short stories.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop",
    category: "Books",
    stock: 180,
    rating: 4.8,
    numReviews: 1750,
  },
  {
    name: "Rich Dad Poor Dad",
    price: 299,
    description: "Robert Kiyosaki's classic on what the rich teach their kids about money that the poor don't.",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&h=500&fit=crop",
    category: "Books",
    stock: 250,
    rating: 4.6,
    numReviews: 3200,
  },
  {
    name: "Zero to One – Peter Thiel",
    price: 399,
    description: "Notes on startups or how to build the future. Essential reading for entrepreneurs.",
    image: "https://images.unsplash.com/photo-1476275466078-4cdc8f50b949?w=500&h=500&fit=crop",
    category: "Books",
    stock: 160,
    rating: 4.5,
    numReviews: 920,
  },
  {
    name: "Deep Work – Cal Newport",
    price: 449,
    description: "Rules for focused success in a distracted world. Build the ability to focus without distraction.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&h=500&fit=crop",
    category: "Books",
    stock: 130,
    rating: 4.7,
    numReviews: 1340,
  },

  // ── Home ──────────────────────────────────────────────
  {
    name: "Dyson V15 Detect Vacuum",
    price: 62900,
    description: "Laser dust detection, HEPA filtration, 60-min battery, LCD screen, anti-tangle hair screw.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    category: "Home",
    stock: 15,
    rating: 4.8,
    numReviews: 234,
  },
  {
    name: "Philips Air Fryer XXL 7.3L",
    price: 14995,
    description: "7.3L family-size basket, Rapid Air Technology, fat removal technology, 1725W.",
    image: "https://images.unsplash.com/photo-1585237017125-24baf8d7406b?w=500&h=500&fit=crop",
    category: "Home",
    stock: 28,
    rating: 4.5,
    numReviews: 567,
  },
  {
    name: "Instant Pot Duo 7-in-1",
    price: 8999,
    description: "Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker & warmer. 5.7L.",
    image: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=500&h=500&fit=crop",
    category: "Home",
    stock: 42,
    rating: 4.7,
    numReviews: 890,
  },
  {
    name: "IKEA KALLAX Shelf Unit",
    price: 7990,
    description: "4-cube storage unit in white. Versatile shelf, room divider, or sideboard. Easy assembly.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
    category: "Home",
    stock: 20,
    rating: 4.4,
    numReviews: 1120,
  },

  // ── Sports ────────────────────────────────────────────
  {
    name: "Yonex Astrox 99 Pro Badminton Racket",
    price: 17999,
    description: "4U weight, rotational generator system, ultra-sharp attack, steel carbon nano shaft.",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&h=500&fit=crop",
    category: "Sports",
    stock: 20,
    rating: 4.7,
    numReviews: 156,
  },
  {
    name: "Decathlon Kiprun Running Shoes",
    price: 2999,
    description: "Lightweight foam midsole, breathable mesh upper, rubber outsole, ideal for daily runs.",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop",
    category: "Sports",
    stock: 80,
    rating: 4.3,
    numReviews: 734,
  },
  {
    name: "Nivia Football Storm Pro",
    price: 1299,
    description: "32-panel machine stitched football, PU outer cover, latex bladder, size 5.",
    image: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=500&h=500&fit=crop",
    category: "Sports",
    stock: 90,
    rating: 4.2,
    numReviews: 482,
  },
  {
    name: "Strauss Yoga Mat 6mm",
    price: 799,
    description: "Non-slip surface, extra thick 6mm, moisture-resistant, with carry bag strap.",
    image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=500&h=500&fit=crop",
    category: "Sports",
    stock: 150,
    rating: 4.3,
    numReviews: 2340,
  },
  {
    name: "Boldfit Gym Gloves",
    price: 549,
    description: "Anti-slip workout gloves with wrist support, breathable fabric, for weightlifting & cycling.",
    image: "https://images.unsplash.com/photo-1534368786749-b63e05c90863?w=500&h=500&fit=crop",
    category: "Sports",
    stock: 120,
    rating: 4.1,
    numReviews: 1230,
  },

  // ── Beauty ────────────────────────────────────────────
  {
    name: "Minimalist 10% Niacinamide Serum",
    price: 599,
    description: "Reduces blemishes, pores, and sebum. Contains niacinamide & zinc PCA. 30ml.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop",
    category: "Beauty",
    stock: 200,
    rating: 4.7,
    numReviews: 4210,
  },
  {
    name: "Forest Essentials Facial Cleanser",
    price: 1495,
    description: "Ayurvedic face wash with manjistha, neem, and rose. Gentle daily cleansing. 150ml.",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop",
    category: "Beauty",
    stock: 85,
    rating: 4.5,
    numReviews: 678,
  },
  {
    name: "L'Oreal Paris Elvive Shampoo",
    price: 349,
    description: "Extraordinary oil nourishing shampoo for dry, rough hair. With Moroccan argan oil. 192ml.",
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&h=500&fit=crop",
    category: "Beauty",
    stock: 175,
    rating: 4.2,
    numReviews: 1890,
  },
  {
    name: "Maybelline Fit Me Foundation",
    price: 549,
    description: "Natural coverage liquid foundation with SPF 18. 16-hour wear, blurs pores. 30ml.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop",
    category: "Beauty",
    stock: 130,
    rating: 4.3,
    numReviews: 2750,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear all existing products and re-seed fresh
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    const inserted = await Product.insertMany(products);
    console.log(`✅ Inserted ${inserted.length} products successfully!`);

    await mongoose.disconnect();
    console.log("✅ Done! Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();
