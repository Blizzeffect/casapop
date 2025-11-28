const WOMPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY!;

export function goToWompiCheckout(totalCOP: number) {
  if (totalCOP <= 0) return;

  const amountInCents = Math.round(totalCOP * 100);

  const params = new URLSearchParams({
    public_key: WOMPI_PUBLIC_KEY,
    currency: 'COP',
    amount_in_cents: amountInCents.toString(),
    reference: `pedido-${Date.now()}`, // referencia única
    redirect_url: 'https://casafunko.shop/gracias'
  });

  window.location.href = `https://checkout.wompi.co/p/?${params.toString()}`;
}
