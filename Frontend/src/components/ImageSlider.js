import React from 'react';
import Slider from 'react-slick';
import './ImageSlider.css';

const ImageSlider = ({ images, altText }) => {
    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        pauseOnHover: true
    };

    return (
        <div className="inner-slider-wrapper">
            <Slider {...settings}>
                {images.map((imgUrl, index) => (
                    <div key={index}>
                        <img src={imgUrl} alt={`${altText} - view ${index + 1}`} className="slider-image" />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageSlider;