import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, reference } = body;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          title: item.name,
          unit_price: item.price,
          quantity: item.qty,
          currency_id: 'COP',
        })),
        external_reference: reference,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/mercadopago`,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/pending`,
        },
        auto_return: 'approved',
      },
    });

    // Guardar preference_id en Supabase
    await supabase
      .from('orders')
      .update({
        preference_id: result.id,
      })
      .eq('reference', reference);

    return NextResponse.json({
      init_point: result.init_point,
      preference_id: result.id,
    });
  } catch (error) {
    console.error('Mercado Pago error:', error);
    return NextResponse.json({ error: 'mp-error' }, { status: 500 });
  }
}
