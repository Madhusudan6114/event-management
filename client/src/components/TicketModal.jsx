import React from 'react';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaTimes, FaPrint } from 'react-icons/fa';

const TicketModal = ({ booking, onClose }) => {
    if (!booking) return null;

    const event = booking.eventId || {};
    const formattedDate = event.date ? new Date(event.date).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : 'N/A';

    const handlePrint = () => {
        window.print();
    };

    // Simple deterministic QR matrix generator for visual display based on booking ID
    const generateQrCells = (idString) => {
        const size = 15;
        const cells = [];
        let strIdx = 0;
        for (let r = 0; r < size; r++) {
            const row = [];
            for (let c = 0; c < size; c++) {
                // Fixed QR corners
                if ((r < 4 && c < 4) || (r < 4 && c > size - 5) || (r > size - 5 && c < 4)) {
                    row.push(true);
                } else {
                    const charCode = idString ? idString.charCodeAt(strIdx % idString.length) : (r * c);
                    row.push((charCode + r + c) % 2 === 0);
                    strIdx++;
                }
            }
            cells.push(row);
        }
        return cells;
    };

    const qrGrid = generateQrCells(booking._id);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative border border-gray-100 flex flex-col">
                {/* Header Banner */}
                <div className="bg-gray-900 text-white p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-gray-400 hover:text-white text-xl p-1 rounded-full hover:bg-white/10 transition"
                    >
                        <FaTimes />
                    </button>
                    <div className="flex items-center gap-2 mb-2">
                        <FaTicketAlt className="text-xl text-indigo-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-indigo-300">Official Pass</span>
                    </div>
                    <h2 className="text-2xl font-black leading-tight mb-1">{event.title || 'Event Ticket'}</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{event.category || 'General Access'}</p>
                </div>

                {/* Ticket Details */}
                <div className="p-6 sm:p-8 space-y-6 flex-grow">
                    <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-100 text-sm">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Ticket Holder</p>
                            <p className="font-bold text-gray-900 text-base">{booking.userId?.name || 'Verified User'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Booking Status</p>
                            <span className={`inline-block px-2.5 py-1 text-[11px] font-black rounded uppercase tracking-wider mt-0.5 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                {booking.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Price</p>
                            <p className="font-extrabold text-gray-900">{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Payment</p>
                            <p className="font-bold text-gray-800 capitalize">{booking.paymentStatus.replace('_', ' ')}</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-gray-400 text-base shrink-0" />
                            <span><strong className="text-gray-900">Date:</strong> {formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaMapMarkerAlt className="text-gray-400 text-base shrink-0" />
                            <span><strong className="text-gray-900">Venue:</strong> {event.location || 'Location TBD'}</span>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 flex flex-col items-center justify-center">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Scan at Entry</p>
                        <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-inner border border-gray-200 flex items-center justify-center">
                            <div className="grid grid-cols-15 gap-[1px] w-full h-full bg-black p-[2px]">
                                {qrGrid.map((row, r) =>
                                    row.map((active, c) => (
                                        <div
                                            key={`${r}-${c}`}
                                            className={active ? 'bg-black' : 'bg-white'}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono mt-3 uppercase tracking-wider">Ticket ID: {booking._id}</p>
                    </div>
                </div>

                {/* Modal Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-200 transition"
                    >
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition"
                    >
                        <FaPrint /> Print / Save Pass
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketModal;
