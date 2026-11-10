// Meal and extra baggage prices (same values as FareUtility in the backend, before 5% tax)
export const MEALS = [
    { value: 'NONE', text: 'No meal', price: 0 },
    { value: 'VEG', text: 'Veg meal', price: 300 },
    { value: 'NON_VEG', text: 'Non-veg meal', price: 350 }
]

export const BAGGAGE_PRICE_PER_KG = 400
export const MAX_EXTRA_BAGGAGE = 30
export const TAX_PERCENT = 5

// Price of the add-ons of one traveller for one journey (with 5% tax)
export const addOnPrice = (meal, kg) => {
    const mealPrice = MEALS.find(m => m.value === meal)?.price || 0
    return Math.round((mealPrice + (Number(kg) || 0) * BAGGAGE_PRICE_PER_KG) * (1 + TAX_PERCENT / 100) * 100) / 100
}

// "Veg meal, +5 kg" text for the review page and the ticket
export const extrasText = (t) => {
    const parts = []
    if (t.mealOption && t.mealOption !== 'NONE') parts.push(t.mealOption === 'VEG' ? 'Veg meal' : 'Non-veg meal')
    if (t.extraBaggageKg > 0) parts.push(`+${t.extraBaggageKg} kg`)
    return parts.length ? parts.join(', ') : '—'
}
