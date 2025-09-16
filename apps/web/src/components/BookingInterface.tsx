import React, { useState } from 'react';
import { Calendar, Clock, Video, MapPin, DollarSign, User } from 'lucide-react';
import { api } from '../api';

interface BookingInterfaceProps {
  tutorId?: string;
  onBookingComplete?: (booking: any) => void;
}

export default function BookingInterface({ tutorId, onBookingComplete }: BookingInterfaceProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    tutor_id: tutorId || '',
    student_id: '', // This would come from auth context
    mode: 'ONLINE' as 'ONLINE' | 'IN_PERSON',
    start_utc: '',
    end_utc: '',
    subject: '',
    notes: ''
  });
  const [heldBooking, setHeldBooking] = useState<any>(null);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleHoldBooking = async () => {
    setLoading(true);
    try {
      const response = await api<any>('/bookings/hold', {
        method: 'POST',
        body: JSON.stringify({
          ...bookingData,
          idempotency_key: `booking-${Date.now()}`
        })
      });
      setHeldBooking(response);
      setStep(3);
    } catch (error: any) {
      console.error('Hold booking failed:', error);
      // Fallback to direct booking
      try {
        const response = await api<any>('/bookings', {
          method: 'POST',
          body: JSON.stringify({
            studentId: bookingData.student_id,
            tutorId: bookingData.tutor_id,
            subjectId: 'math-subject-id', // Mock subject ID
            mode: bookingData.mode.toLowerCase(),
            startAt: bookingData.start_utc,
            endAt: bookingData.end_utc
          })
        });
        onBookingComplete?.(response);
        setStep(4);
      } catch (fallbackError) {
        console.error('Booking failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const response = await api<any>('/bookings/confirm', {
        method: 'POST',
        body: JSON.stringify({
          booking_id: heldBooking.booking_id,
          payment_method_id: 'pm_mock_payment_method'
        })
      });
      onBookingComplete?.(response);
      setStep(4);
    } catch (error) {
      console.error('Confirm booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlot = (date: string, time: string) => {
    const startDate = new Date(`${date}T${time}:00`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    return {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNum ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum}
              </div>
              {stepNum < 4 && (
                <div className={`w-16 h-0.5 ${step > stepNum ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <span className="text-sm text-gray-600">
            {step === 1 && 'Select Date & Time'}
            {step === 2 && 'Review Details'}
            {step === 3 && 'Payment'}
            {step === 4 && 'Confirmation'}
          </span>
        </div>
      </div>

      {/* Step 1: Date & Time Selection */}
      {step === 1 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Your Session</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
              <input
                type="date"
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const { start, end } = generateTimeSlot(e.target.value, '10:00');
                  setBookingData({ ...bookingData, start_utc: start, end_utc: end });
                }}
              />
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Select Time</h3>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    className="p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-sm"
                    onClick={() => {
                      const date = bookingData.start_utc.split('T')[0] || new Date().toISOString().split('T')[0];
                      const { start, end } = generateTimeSlot(date, time);
                      setBookingData({ ...bookingData, start_utc: start, end_utc: end });
                    }}
                  >
                    <Clock className="h-4 w-4 mx-auto mb-1" />
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    className="input-field"
                    value={bookingData.subject}
                    onChange={(e) => setBookingData({ ...bookingData, subject: e.target.value })}
                  >
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className={`p-3 border rounded-lg transition-colors ${
                        bookingData.mode === 'ONLINE'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setBookingData({ ...bookingData, mode: 'ONLINE' })}
                    >
                      <Video className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Online</div>
                    </button>
                    <button
                      className={`p-3 border rounded-lg transition-colors ${
                        bookingData.mode === 'IN_PERSON'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setBookingData({ ...bookingData, mode: 'IN_PERSON' })}
                    >
                      <MapPin className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">In-Person</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Any specific topics or goals for this session?"
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!bookingData.start_utc || !bookingData.subject}
              className="btn-primary disabled:opacity-50"
            >
              Continue to Review
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Review Details */}
      {step === 2 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Booking</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Session Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{new Date(bookingData.start_utc).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      {new Date(bookingData.start_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(bookingData.end_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {bookingData.mode === 'ONLINE' ? (
                      <Video className="h-4 w-4 text-gray-500" />
                    ) : (
                      <MapPin className="h-4 w-4 text-gray-500" />
                    )}
                    <span>{bookingData.mode === 'ONLINE' ? 'Online Session' : 'In-Person Session'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>Subject: {bookingData.subject}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Pricing</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Hourly Rate:</span>
                    <span>$50.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>1 hour</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span>$50.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="btn-secondary"
            >
              Back to Edit
            </button>
            <button
              onClick={handleHoldBooking}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Processing...' : 'Hold Booking'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              Your booking is held for 10 minutes. Please complete payment to confirm your session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" defaultChecked className="text-primary-600" />
                    <div>
                      <p className="font-medium">Credit Card</p>
                      <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <input type="text" placeholder="123" className="input-field" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Session Fee:</span>
                  <span>$50.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platform Fee:</span>
                  <span>$2.50</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>$52.50</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="btn-secondary"
            >
              Back to Review
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              <DollarSign className="h-4 w-4" />
              <span>{loading ? 'Processing...' : 'Confirm & Pay'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your tutoring session has been successfully booked. You'll receive a confirmation email shortly.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Session Details</h3>
            <div className="text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(bookingData.start_utc).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>
                  {new Date(bookingData.start_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <span>{bookingData.mode === 'ONLINE' ? 'Online' : 'In-Person'}</span>
              </div>
              <div className="flex justify-between">
                <span>Subject:</span>
                <span>{bookingData.subject}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button className="btn-secondary">
              View in Calendar
            </button>
            <button className="btn-primary">
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
