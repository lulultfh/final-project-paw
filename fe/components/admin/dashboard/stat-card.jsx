import React from 'react';
import { formatNumber } from '@/core/hooks/useAnimatedCounter';

const StatCard = ({ title, value, subtitle, growth, color, icon }) => (
    <div className="bg-[#F3EBD8] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl`}
                style={{ backgroundColor: color }}>
                {icon}
            </div>
            {growth && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    growth.includes('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {growth}
                </span>
            )}
        </div>
        <div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
                {typeof value === 'number' ? formatNumber(value) : value}
            </p>
            {subtitle && (
                <p className="text-gray-500 text-sm">{subtitle}</p>
            )}
        </div>
    </div>
);

export default StatCard;