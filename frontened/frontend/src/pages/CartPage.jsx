import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const { cartItems, removeFromCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          🛒 Your Cart ({totalItems} items)
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate("/")}
              className="bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500"
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
                  className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain rounded-lg"
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-gray-800 font-semibold text-lg">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{item.category}</p>
                    <p className="text-yellow-500 font-bold mt-1">
                      ₹{item.price.toLocaleString()} x {item.qty}
                    </p>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-gray-800 font-bold text-lg">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Items</span>
                <span className="text-gray-800 font-semibold">{totalItems}</span>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-gray-600">Total</span>
                <span className="text-gray-800 font-bold text-xl">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-500 transition-colors duration-200"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full mt-3 text-gray-600 hover:text-yellow-500 font-semibold py-2"
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