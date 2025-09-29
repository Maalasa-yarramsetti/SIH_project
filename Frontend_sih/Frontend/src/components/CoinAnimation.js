import React, { useEffect, useState } from 'react';
import { FaCoins } from 'react-icons/fa';
import './CoinAnimation.css';

const CoinAnimation = () => {
    const [coins, setCoins] = useState([]);

    useEffect(() => {
        const newCoins = Array.from({ length: 10 }, (_, i) => ({
            id: i,
            delay: Math.random() * 0.5,
        }));
        setCoins(newCoins);
    }, []);

    if (coins.length === 0) {
        return null;
    }

    return (
        <div className="coin-animation-container">
            {coins.map(coin => (
                <div 
                    key={coin.id} 
                    className="flying-coin"
                    style={{ animationDelay: `${coin.delay}s` }}
                >
                    <FaCoins />
                </div>
            ))}
        </div>
    );
};

export default CoinAnimation;