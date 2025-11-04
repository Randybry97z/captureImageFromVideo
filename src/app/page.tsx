'use client';
import React from 'react';
import VideoCapture from '../components/VideoCapture';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-transparent">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white text-center">Captura imágenes de tus videos</h1>
      <VideoCapture />
    </main>
  );
} 