import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getSupabaseAdmin()

  // Create demo restaurant
  const { data: restaurant } = await db
    .from('restaurants')
    .insert({
      user_id: userId,
      name: "The Golden Fork",
      cuisine_type: "American",
      location: "Austin, TX",
      description: "A classic American diner with modern twists",
    })
    .select()
    .single()

  if (!restaurant) return NextResponse.json({ error: 'Failed to create restaurant' }, { status: 500 })

  // Add realistic menu items with varied margins
  const items = [
    { name: "Classic Cheeseburger", category: "Main", cost_price: 4.50, selling_price: 13.99, is_popular: true },
    { name: "BBQ Bacon Burger", category: "Main", cost_price: 5.80, selling_price: 15.99, is_popular: true },
    { name: "Grilled Chicken Sandwich", category: "Main", cost_price: 4.20, selling_price: 12.99, is_popular: false },
    { name: "Caesar Salad", category: "Appetizer", cost_price: 2.10, selling_price: 9.99, is_popular: false },
    { name: "Loaded Nachos", category: "Appetizer", cost_price: 3.50, selling_price: 11.99, is_popular: true },
    { name: "Crispy French Fries", category: "Side", cost_price: 0.80, selling_price: 4.99, is_popular: true },
    { name: "Onion Rings", category: "Side", cost_price: 1.20, selling_price: 5.49, is_popular: false },
    { name: "Chocolate Lava Cake", category: "Dessert", cost_price: 2.80, selling_price: 7.99, is_popular: true },
    { name: "New York Cheesecake", category: "Dessert", cost_price: 2.20, selling_price: 6.99, is_popular: false },
    { name: "Craft Lemonade", category: "Beverage", cost_price: 0.60, selling_price: 3.99, is_popular: false },
    { name: "Iced Coffee", category: "Beverage", cost_price: 0.90, selling_price: 4.49, is_popular: true },
    { name: "Mushroom Swiss Burger", category: "Main", cost_price: 5.20, selling_price: 14.49, is_popular: false },
    { name: "Fish & Chips", category: "Main", cost_price: 6.50, selling_price: 16.99, is_popular: false },
    { name: "Soup of the Day", category: "Appetizer", cost_price: 2.50, selling_price: 6.99, is_popular: false },
  ]

  await db.from('menu_items').insert(
    items.map(item => ({ ...item, restaurant_id: restaurant.id, description: '' }))
  )

  return NextResponse.json({ success: true, restaurant_id: restaurant.id })
}
