import React from 'react';
import Link from 'next/link';

const TopCarsWidget = ({ cars }) => {
    return (
        <div className="bg-black/40 backdrop-blur-md border border-gold/30 rounded-xl p-6 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-gold pl-3">Most Popular Cars</h3>
            <div className="space-y-4">
                {cars.map((car, index) => (
                    <Link href={`/cars/${car._id}`} key={index} className="block">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-gold/30 cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm border border-gold/40 group-hover:bg-gold group-hover:text-black transition-colors">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="text-white font-medium group-hover:text-gold transition-colors">{car.name || car._id}</p>
                                    <p className="text-xs text-gray-400">{car.count} Bookings</p>
                                </div>
                            </div>
                            <div className="h-2 w-24 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-gold to-yellow-200"
                                    style={{ width: `${Math.min((car.count / (cars[0]?.count || 1)) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </Link>
                ))}
                {cars.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No booking data available yet.</p>
                )}
            </div>
        </div>
    );
};

export default TopCarsWidget;
