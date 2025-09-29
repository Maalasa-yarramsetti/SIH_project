import React from 'react';
import Slider from 'react-slick';
import './EventCarousel.css';

const carouselItems = [
    {
        title: 'Annual Cham Dance Festival Announced',
        date: 'October 28, 2025',
        details: 'Witness the ancient tradition of masked dances at the Enchey Monastery.',
        image: '/images/chma1.jpg'
    },
    {
        title: 'Digital Archives Expansion Project',
        date: 'Ongoing',
        details: 'Explore 200+ newly digitized murals and manuscripts from Tashiding Monastery.',
        image: '/images/digi.jpg'
    },
    {
        title: 'Live-Streamed Morning Prayers',
        date: 'Daily at 6:00 AM IST',
        details: 'Experience the serene morning chants from Rumtek Monastery, now streaming live.',
        image: '/images/pray.jpg'
    }
];

const EventCarousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true
    };

    return (
        <div className="carousel-wrapper">
            <Slider {...settings}>
                {/* This structure is simpler and more reliable for react-slick */}
                {carouselItems.map((item, index) => (
                    <div key={index}>
                        <div
                            className="carousel-slide"
                            style={{ backgroundImage: `url(${item.image})` }}
                        >
                            <div className="carousel-caption">
                                <h2>{item.title}</h2>
                                <p>{item.details} ({item.date})</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default EventCarousel;