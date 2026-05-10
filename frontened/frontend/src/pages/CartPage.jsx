import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const { cartItems, removeFromCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">
          🛒 Your Cart ({totalItems} items)
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-xl mb-4 transition-colors">Your cart is empty</p>
            <button
              onClick={() => navigate("/")}
              className="bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors shadow-sm"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart Items */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-4 transition-colors"
                >
                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-gray-100 dark:border-gray-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white font-semibold text-lg transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">{item.category}</p>
                    <p className="text-yellow-600 dark:text-yellow-500 font-bold mt-1 transition-colors">
                      ₹{item.price.toLocaleString()} x {item.qty}
                    </p>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-gray-900 dark:text-white font-black text-lg transition-colors">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-600 dark:hover:text-red-400 text-sm mt-2 transition-colors font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-fit transition-colors">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                Order Summary
              </h2>

              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 transition-colors">Items</span>
                <span className="text-gray-900 dark:text-white font-semibold transition-colors">{totalItems}</span>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-gray-600 dark:text-gray-400 transition-colors">Total</span>
                <span className="text-gray-900 dark:text-white font-black text-xl transition-colors">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-yellow-400 text-gray-900 font-bold py-3.5 rounded-xl hover:bg-yellow-300 transition-colors shadow-md"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full mt-3 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 font-semibold py-2 transition-colors"
              >
                Continue Shopping
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;