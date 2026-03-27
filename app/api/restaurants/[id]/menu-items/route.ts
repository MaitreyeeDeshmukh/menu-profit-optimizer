import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = getSupabaseAdmin()

  const { data: restaurant } = await db
    .from('restaurants')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data, error } = await db
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', id)
    .order('category')
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const db = getSupabaseAdmin()

  const { data: restaurant } = await db
    .from('restaurants')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (Array.isArray(body)) {
    const items = body.map((item) => ({ ...item, restaurant_id: id }))
    const { data, error } = await db.from('menu_items').insert(items).select()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  }

  const { name, category, cost_price, selling_price, description, is_popular } = body
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const { data, error } = await db
    .from('menu_items')
    .insert({ restaurant_id: id, name, category, cost_price, selling_price, description, is_popular })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const itemId = searchParams.get('itemId')
  if (!itemId) return NextResponse.json({ error: 'itemId required' }, { status: 400 })

  const db = getSupabaseAdmin()
  const { error } = await db.from('menu_items').delete().eq('id', itemId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
