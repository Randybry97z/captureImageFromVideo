'use client';
import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const plans = [
  {
    name: 'Gratis',
    price: '$0',
    period: 'mes',
    type: 'Mensual',
    features: [
      { text: '100 imágenes por mes', included: true },
      { text: '10 videos por mes', included: true },
      { text: 'Máx. 5 minutos por video', included: true },
      { text: 'Todas las funciones principales', included: true },
      { text: 'Uso ilimitado', included: false },
      { text: 'Soporte prioritario', included: false },
    ],
    cta: 'Usar Gratis',
    highlight: false,
    badge: 'Mensual',
    priceNote: 'Sin costo, sin tarjeta',
  },
  {
    name: 'Premium',
    price: '$5',
    period: 'USD/mes',
    type: 'Mensual',
    features: [
      { text: 'Imágenes ilimitadas', included: true },
      { text: 'Videos ilimitados', included: true },
      { text: 'Sin límite de duración de video', included: true },
      { text: 'Todas las funciones principales', included: true },
      { text: 'Soporte prioritario', included: true },
    ],
    cta: 'Suscríbete a Premium',
    highlight: true,
    badge: 'Recomendado',
    priceNote: 'Cancela en cualquier momento. Pago seguro con Stripe/PayPal.',
  },
];

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-[#181A20] flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white text-center">Elige tu suscripción</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {/* Free Plan */}
        <div className="bg-[#23262F] rounded-2xl shadow-lg p-8 flex flex-col items-center border border-[#353945] relative">
          <span className="absolute top-4 right-4 bg-[#353945] text-white text-xs px-3 py-1 rounded-full">Mensual</span>
          <h2 className="text-xl font-semibold mb-1 text-white">Gratis</h2>
          <div className="text-[#00FFB0] text-3xl font-bold mb-1">$0<span className="text-base font-normal text-white">/mes</span></div>
          <ul className="text-gray-200 mb-6 space-y-2 w-full mt-2">
            {plans[0].features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                {f.included ? <FaCheckCircle className="text-[#00FFB0]" /> : <FaTimesCircle className="text-gray-500" />}
                <span className={f.included ? 'font-semibold' : 'line-through'}>{f.text}</span>
              </li>
            ))}
          </ul>
          <div className="text-gray-400 text-xs mb-2">Sin costo, sin tarjeta</div>
          <button className="w-full bg-[#00FFB0] text-black font-bold py-2 rounded-lg mt-auto hover:bg-[#00e6a0] transition">{plans[0].cta}</button>
        </div>
        {/* Premium Plan */}
        <div className="bg-[#23262F] rounded-2xl shadow-2xl p-8 flex flex-col items-center border-2 border-[#FFD600] relative scale-105 z-10">
          <span className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#FFD600] text-black text-xs px-4 py-1 rounded-full font-bold">Recomendado</span>
          <h2 className="text-xl font-semibold mb-1 text-white">Premium</h2>
          <div className="text-[#FFD600] text-3xl font-bold mb-1">$5<span className="text-base font-normal text-white"> USD/mes</span></div>
          <ul className="text-gray-200 mb-6 space-y-2 w-full mt-2">
            {plans[1].features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                {f.included ? <FaCheckCircle className="text-[#FFD600]" /> : <FaTimesCircle className="text-gray-500" />}
                <span className={f.included ? 'font-semibold' : 'line-through'}>{f.text}</span>
              </li>
            ))}
          </ul>
          <div className="text-gray-400 text-xs mb-2">Cancela en cualquier momento. Pago seguro con Stripe/PayPal.</div>
          <button className="w-full bg-[#FFD600] text-black font-bold py-2 rounded-lg mt-auto hover:bg-yellow-400 transition">{plans[1].cta}</button>
        </div>
      </div>
      <div className="mt-10 text-center text-gray-400 text-sm">
        <p>¿Tienes preguntas? <a href="mailto:support@yourapp.com" className="text-[#00FFB0] hover:underline">Contacta soporte</a></p>
      </div>
    </div>
  );
} 