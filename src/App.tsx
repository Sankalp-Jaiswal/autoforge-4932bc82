import React from 'react';
import { Hero } from '@/components/sections/Hero';
import { BookingSystem } from '@/components/sections/BookingSystem';

function App() {
  return (
    <div className="min-h-screen flex flex-col" id="home">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-primary">Dr. Smith Clinic</div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#home" className="hover:text-primary transition-colors">Home</a>
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#booking" className="hover:text-primary transition-colors">Book</a>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        <Hero />
        <BookingSystem />
      </main>

      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Dr. Smith Clinic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
