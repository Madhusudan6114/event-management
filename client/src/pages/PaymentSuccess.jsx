import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
    const location = useLocation();
    const state = location.state || {};
    const { eventTitle, amount } = state;

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border-t-8 border-green-500 transform transition-all hover:-translate-y-1">
                <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-6 drop-shadow-sm" />
                <h1 className="text-4xl font-black text-gray-900 mb-2">Booking Requested!</h1>
                {eventTitle && (
                    <p className="text-lg font-bold text-gray-800 mb-2">{eventTitle}</p>
                )}
                {amount !== undefined && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                        {amount === 0 ? 'Free Ticket' : `Amount: ₹${amount}`}
                    </span>
                )}
                <p className="text-gray-500 mb-8 text-base">Your booking request has been submitted. An admin will verify your details, and a confirmation email will be sent upon approval.</p>
                <div className="space-y-4">
                    <Link to="/dashboard" className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition shadow-lg hover:shadow-xl">
                        View My Bookings
                    </Link>
                    <Link to="/" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition">
                        Discover More Events
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
