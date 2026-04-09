import { useState, useEffect, useCallback } from 'react';

const images = [
    "https://picsum.photos/id/10/900/700",
    "https://picsum.photos/id/20/900/700",
    "https://picsum.photos/id/30/900/700",
    "https://picsum.photos/id/40/900/700",
    "https://picsum.photos/id/50/900/700",
    "https://picsum.photos/id/60/900/700",
];

export const Gallery = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex(prev => Math.min(prev + 1, images.length - 1));
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    }, []);

    const goToSlide = useCallback((index: number) => {
        if (index >= 0 && index < images.length) {
            setCurrentIndex(index);
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [nextSlide, prevSlide]);

    const getItemClass = (index: number) => {
        const diff = index - currentIndex;
        if (diff === 0) return 'active';
        if (diff === 1) return 'next';
        if (diff === 2) return 'next-2';
        if (diff === -1) return 'prev';
        if (diff === -2) return 'prev-2';
        return 'hidden';
    };

    return (
        <div className="carousel-wrapper">
            <div className="carousel-container">
                {images.map((img, index) => (
                    <div
                        key={img}
                        className={`carousel-item ${getItemClass(index)}`}
                        style={{ backgroundImage: `url(${img})` }}
                        onClick={() => {
                            if (index > currentIndex) goToSlide(index);
                            if (index < currentIndex) goToSlide(index);
                        }}
                        aria-label={`View image ${index + 1}`}
                    />
                ))}
            </div>

            <div className="carousel-controls">
                <button
                    className={`carousel-arrow left ${currentIndex === 0 ? 'disabled' : ''}`}
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    disabled={currentIndex === 0}
                >
                    &lsaquo;
                </button>
                <div className="carousel-dots">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
                <button
                    className={`carousel-arrow right ${currentIndex === images.length - 1 ? 'disabled' : ''}`}
                    onClick={nextSlide}
                    aria-label="Next slide"
                    disabled={currentIndex === images.length - 1}
                >
                    &rsaquo;
                </button>
            </div>
        </div>
    );
};