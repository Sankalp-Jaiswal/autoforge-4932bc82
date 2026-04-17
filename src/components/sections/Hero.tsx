import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Calendar } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              Expert Healthcare <br className="hidden md:block"/> 
              <span className="text-primary">Tailored For You</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg">
              Dr. Smith provides comprehensive, compassionate medical care. Book your appointment today and take the first step towards better health.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
                <Calendar className="mr-2 h-5 w-5" /> Book Appointment
              </Button>
              <Button size="lg" variant="outline">
                Our Services
              </Button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1612349317150-e410f624c427?auto=format&fit=crop&q=80&w=1000"
              alt="Doctor consulting patient" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};