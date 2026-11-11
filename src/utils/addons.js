// Meal and extra baggage prices (same values as FareUtility in the backend, before 5% tax)

// Step 1: Define the available meal options and their prices.
export const MEALS = [
    { value: 'NONE', text: 'No meal', price: 0 },
    { value: 'VEG', text: 'Veg meal', price: 300 },
    { value: 'NON_VEG', text: 'Non-veg meal', price: 350 }
]

// Step 2: Define extra baggage pricing and limits.
export const BAGGAGE_PRICE_PER_KG = 400
export const MAX_EXTRA_BAGGAGE = 30
export const TAX_PERCENT = 5

// Step 3: Calculate the add-on price for one traveller for one journey.
export const addOnPrice = (meal, kg) => {

    // Find the selected meal price. If no matching meal is found, use 0.
    const mealPrice = MEALS.find(m => m.value === meal)?.price || 0

    // Calculate meal + baggage charges, add 5% tax and round to 2 decimal places.
    return Math.round((mealPrice + (Number(kg) || 0) * BAGGAGE_PRICE_PER_KG) * (1 + TAX_PERCENT / 100) * 100) / 100
}

// Step 4: Create a readable description of the selected extras for the review page and ticket.
export const extrasText = (t) => {

    // Store the descriptions of the selected extras.
    const parts = []

    // Add the meal description if a meal has been selected.
    if (t.mealOption && t.mealOption !== 'NONE') parts.push(t.mealOption === 'VEG' ? 'Veg meal' : 'Non-veg meal')

    // Add the extra baggage quantity if it is greater than zero.
    if (t.extraBaggageKg > 0) parts.push(`+${t.extraBaggageKg} kg`)

    // Join the descriptions with commas, or display a dash if there are no extras.
    return parts.length ? parts.join(', ') : '—'
}
