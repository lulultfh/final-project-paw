import { useState, useEffect } from 'react';

const formatNumber = (number) => {
    return number.toLocaleString('id-ID');
};

const formatCurrency = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

const useAnimatedCounter = (endValue, duration) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        const animate = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const value = Math.floor(progress * endValue);
            setCount(value);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [endValue, duration]);

    return count;
};

const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
        case 'cake':
            return '#E08764';
        case 'bread':
            return '#A25858';
        case 'cookies':
            return '#FFD7A0';
        case 'pastry':
            return '#C6E0A6';
        default:
            return '#6B7280';
    }
};

export { useAnimatedCounter, formatNumber, formatCurrency, getCategoryColor };