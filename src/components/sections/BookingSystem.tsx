import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { bookingFormSchema, type BookingFormData } from '@/lib/validations/bookingSchema';
import apiClient from '@/lib/apiClient';
import axios from 'axios';

export const BookingSystem = () => {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema)
  });

  const selectedDate = watch('date');

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate);
      setValue('timeSlot', ''); // Reset slot when date changes
    }
  }, [selectedDate, setValue]);

  const fetchAvailability = async (date: string) => {
    setIsLoadingSlots(true);
    try {
      const response = await apiClient.get(`/availability?date=${date}`);
      setAvailableSlots(response.data.availableSlots);
    } catch (error) {
      console.error('Failed to fetch slots', error);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await apiClient.post('/bookings', data);
      setSuccess(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMsg(error.response?.data?.message || 'An error occurred while booking.');
      } else {
        setErrorMsg('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate next 7 days for date selection
  const nextDays = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(new Date(), i + 1);
    return format(date, 'yyyy-MM-dd');
  });

  if (success) {
    return (
      <section id="booking" className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
              <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-slate-600 mb-6">Thank you. We have sent a confirmation to your email.</p>
              <Button onClick={() => setSuccess(false)}>Book Another</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Book an Appointment</h2>
          <p className="text-slate-600">Select a date and time that works best for you.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent>
            {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{errorMsg}</div>}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <select 
                    {...register('date')} 
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="">Choose a date...</option>
                    {nextDays.map(date => (
                      <option key={date} value={date}>{format(new Date(date), 'EEEE, MMM do')}</option>
                    ))}
                  </select>
                  {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Available Times</label>
                  <select 
                    {...register('timeSlot')}
                    disabled={!selectedDate || isLoadingSlots || availableSlots.length === 0}
                    className="w-full p-2 border rounded-md bg-white disabled:bg-slate-100"
                  >
                    <option value="">
                      {!selectedDate ? 'Select a date first' : 
                       isLoadingSlots ? 'Loading...' : 
                       availableSlots.length === 0 ? 'No slots available' : 'Choose a time...'}
                    </option>
                    {availableSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {errors.timeSlot && <p className="text-sm text-red-500">{errors.timeSlot.message}</p>}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input {...register('patientName')} className="w-full p-2 border rounded-md" placeholder="John Doe" />
                    {errors.patientName && <p className="text-sm text-red-500">{errors.patientName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input {...register('phone')} className="w-full p-2 border rounded-md" placeholder="(555) 000-0000" />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input type="email" {...register('email')} className="w-full p-2 border rounded-md" placeholder="john@example.com" />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason for Visit (Optional)</label>
                  <textarea {...register('reason')} className="w-full p-2 border rounded-md" rows={3} placeholder="Briefly describe your symptoms or reason for visit..." />
                  {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
