import React from 'react';

const CarFleetTable = ({ cars }) => {
    return (
        <div className="bg-black/40 backdrop-blur-md border border-gold/30 rounded-xl p-6 shadow-[0_0_15px_rgba(212,175,55,0.1)] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white border-l-4 border-gold pl-3">Fleet Status</h3>
                <button className="px-4 py-2 bg-gold/10 text-gold border border-gold/30 rounded-lg text-sm hover:bg-gold hover:text-black transition-all">
                    View All Fleet
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                            <th className="pb-4 pl-2 font-medium">Car</th>
                            <th className="pb-4 font-medium">Category</th>
                            <th className="pb-4 font-medium">Price / Day</th>
                            <th className="pb-4 font-medium">Status</th>
                            <th className="pb-4 pr-2 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {cars && cars.length > 0 ? (
                            cars.map((car) => (
                                <tr key={car._id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors group">
                                    <td className="py-4 pl-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-8 rounded overflow-hidden bg-gray-800 relative border border-gray-700 group-hover:border-gold/50 transition-colors">
                                                <img
                                                    src={car.mainImage || car.image || '/img/placeholder-car.png'}
                                                    alt={car.title || car.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="font-medium text-white group-hover:text-gold transition-colors">{car.title || car.name || car.brand + ' ' + car.model}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm">{car.category || 'Luxury'}</td>
                                    <td className="py-4 font-medium text-gold">
                                        {car.price ? `$${car.price}` : 'N/A'}
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${car.state === 'Available' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                car.state === 'Booked' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                            {car.state || 'Available'}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-2 text-right">
                                        <button className="text-gray-400 hover:text-white transition-colors">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-500">
                                    No cars found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CarFleetTable;
