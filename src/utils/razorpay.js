// Step 1: Load the Razorpay checkout script only when needed.
export const loadRazorpay = () => new Promise((resolve) => {

    // Check whether Razorpay is already loaded in the browser.
    if (window.Razorpay) return resolve(true)

    // Create a new script element.
    const script = document.createElement('script')

    // Set the Razorpay checkout script URL.
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'

    // If the script loads successfully, return true.
    script.onload = () => resolve(true)

    // If the script fails to load, return false.
    script.onerror = () => resolve(false)

    // Add the script to the HTML document.
    document.body.appendChild(script)
})

// Step 2: Open the Razorpay payment popup.
export const openCheckout = (order, description, { onPaid, onError }) => {

    // Configure the Razorpay checkout options.
    const options = {

        // Public Razorpay key received from the backend.
        key: order.keyId,

        // Payment amount in paise.
        amount: order.amountInPaise,

        // Currency used for payment.
        currency: order.currency,

        // Order ID created by the backend.
        order_id: order.orderId,

        // Application name displayed in checkout.
        name: 'SimplyFly',

        // Description displayed in the checkout popup.
        description,

        // Prefill passenger name from localStorage.
        prefill: { name: localStorage.getItem('username') },

        // Customize checkout popup theme.
        theme: { color: '#0d6efd' },

        // Callback executed after successful payment.
        handler: onPaid,

        // Callback executed when the passenger closes the popup.
        modal: {
            ondismiss: () => onError("Payment window closed. You can try again before the hold expires.")
        }
    }

    // Create a Razorpay checkout instance using the options.
    const checkout = new window.Razorpay(options)

    // Listen for payment failure events.
    checkout.on('payment.failed', (resp) =>
        onError(resp.error?.description || "Payment failed")
    )

    // Open the Razorpay payment popup.
    checkout.open()
}
