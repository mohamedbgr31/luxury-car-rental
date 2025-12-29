'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const RevenueChart = ({ data }) => {
    return (
        <div className="bg-black/40 backdrop-blur-md border border-gold/30 rounded-xl p-6 shadow-[0_0_15px_rgba(212,175,55,0.1)] h-[400px]">
            <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-gold pl-3">Revenue Analytics</h3>
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#666"
                            tick={{ fill: '#888', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#666"
                            tick={{ fill: '#888', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', borderColor: '#D4AF37', borderRadius: '8px' }}
                            itemStyle={{ color: '#D4AF37' }}
                            labelStyle={{ color: '#fff' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#D4AF37"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
