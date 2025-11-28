import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Importante: usar service role key
);

// Verificar la firma del webhook
function verifyWebhookSignature(
  body: string,
  xSignature: string
): boolean {
  const parts = xSignature.split(',');
  const timestamp = parts[0].split('=')[1];
  const hash = parts[1].split('=')[1];

  const data = `${timestamp}.${body}`;
  const secret = process.env.MP_WEBHOOK_SECRET!;
  
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64');

  return hmac === hash;
}

// Mapear estados de MP a estados de la app
function mapMPStatus(mpStatus: string): string {
  const statusMap: Record<string, string> = {
    'approved': 'paid',
    'pending': 'pending',
    'authorized': 'pending',
    'in_process': 'processing',
    'rejected': 'failed',
    'cancelled': 'cancelled',
    'refunded': 'refunded',
    'charged_back': 'failed',
  };
  return statusMap[mpStatus] || 'pending';
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const xSignature = request.headers.get('x-signature');

    if (!xSignature || !verifyWebhookSignature(body, xSignature)) {
      console.error('Invalid webhook signature');
      return Response.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(body);

    // Solo procesamos notificaciones de pago
    if (payload.type !== 'payment') {
      return Response.json({ success: true }, { status: 200 });
    }

    const paymentId = payload.data.id;
    const mpStatus = payload.data.status;
    const orderStatus = mapMPStatus(mpStatus);

    // Obtener la orden usando el payment_id
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, reference, payment_id')
      .eq('payment_id', paymentId)
      .single();

    if (fetchError || !order) {
      console.error('Order not found for payment:', paymentId);
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Actualizar el estado de la orden
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        updated_at: new Date().toISOString(),
        payment_status: mpStatus,
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return Response.json(
        { error: 'Error updating order' },
        { status: 500 }
      );
    }

    console.log(`Order ${order.reference} updated to status: ${orderStatus}`);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
