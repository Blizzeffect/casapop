'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function FailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'desconocida';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pago Rechazado
        </h1>

        <p className="text-gray-600 mb-6">
          Lo sentimos, tu pago no pudo ser procesado. Por favor, intenta nuevamente con
          otro método de pago o verifica tu información.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-red-800">
            <strong>Razón:</strong> {reason}
          </p>
          <p className="text-xs text-red-600 mt-2">
            Si el problema persiste, contacta a nuestro soporte.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/cart"
            className="block w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            Volver al carrito
          </Link>

          <Link
            href="/"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg transition"
          >
            Volver a inicio
          </Link>

          <Link
            href="/contact"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            Contactar soporte
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <FailureContent />
    </Suspense>
  );
}
