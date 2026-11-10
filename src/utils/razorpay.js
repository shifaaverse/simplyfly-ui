// Razorpay checkout script is loaded only when it is needed
export const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
})

// Opens the Razorpay pop-up for an order created by the server.
// onPaid gets the signed response, onError gets a message to show.
export const openCheckout = (order, description, { onPaid, onError }) => {
    const options = {
        key: order.keyId,
        amount: order.amountInPaise,
        currency: order.currency,
        order_id: order.orderId,
        name: 'SimplyFly',
        description,
        prefill: { name: localStorage.getItem('username') },
        theme: { color: '#0d6efd' },
        handler: onPaid,
        modal: { ondismiss: () => onError("Payment window closed. You can try again before the hold expires.") }
    }
    const checkout = new window.Razorpay(options)
    checkout.on('payment.failed', (resp) => onError(resp.error?.description || "Payment failed"))
    checkout.open()
}
