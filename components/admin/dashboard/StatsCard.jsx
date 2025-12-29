import React from 'react';

const StatsCard = ({ title, value, icon, trend, trendUp }) => {
    return (
        <div className="bg-black/40 backdrop-blur-md border border-gold/30 rounded-xl p-6 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] transition-all duration-300 group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-bold text-white mt-2 group-hover:text-gold transition-colors">{value}</h3>
                </div>
                <div className="p-3 bg-gold/10 rounded-lg border border-gold/20 group-hover:bg-gold/20 transition-colors">
                    {icon}
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={`${trendUp ? 'text-green-400' : 'text-red-400'} flex items-center font-medium`}>
                        {trendUp ? '↑' : '↓'} {trend}
                    </span>
                    <span className="text-gray-500 ml-2">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
