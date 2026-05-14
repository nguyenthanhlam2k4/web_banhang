import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

// GET all products with filtering, search, and pagination
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Filters
    const query: any = {};
    
    // Search
    const search = searchParams.get('search');
    if (search) {
      query.$text = { $search: search };
    }

    // Category
    const category = searchParams.get('category');
    if (category) {
      // Try to find by slug first
      const foundCategory = await Category.findOne({ slug: category });
      const categoryId = foundCategory ? foundCategory._id : category;
      
      // If we are looking for related products, we might want OR logic with brand
      const brand = searchParams.get('brand');
      if (brand && searchParams.get('related') === 'true') {
        query.$or = [
          { categories: { $in: [categoryId] } },
          { brand: brand }
        ];
      } else {
        query.categories = { $in: [categoryId] };
      }
    } else {
      // Brand only (if not already handled in $or)
      const brand = searchParams.get('brand');
      if (brand) {
        query.brand = brand;
      }
    }

    // Price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Featured
    const featured = searchParams.get('featured');
    if (featured === 'true') {
      query.featured = true;
    }

    // Sorting
    const sortParam = searchParams.get('sort') || 'newest';
    let sort: any = { createdAt: -1 };
    
    if (sortParam === 'price_asc') sort = { price: 1 };
    if (sortParam === 'price_desc') sort = { price: -1 };
    if (sortParam === 'rating') sort = { rating: -1 };
    if (sortParam === 'oldest') sort = { createdAt: 1 };

    const products = await Product.find(query)
      .populate('categories', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST create product
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
