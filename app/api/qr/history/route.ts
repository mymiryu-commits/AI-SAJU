import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type');

    const offset = (page - 1) * limit;

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from('qr_codes')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data: qrCodes, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      qrCodes,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('QR history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch QR code history' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'QR code ID is required' },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('qr_codes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'QR code deleted successfully',
    });
  } catch (error) {
    console.error('QR delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete QR code' },
      { status: 500 }
    );
  }
}
