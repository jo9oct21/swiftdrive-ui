import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import CarCard from './CarCard';
import { Car } from '@/types/Car';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface FeaturedCarsCarouselProps {
  cars: Car[];
}

const FeaturedCarsCarousel = ({ cars }: FeaturedCarsCarouselProps) => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={24}
      slidesPerView={1}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      navigation
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      }}
      className="featured-cars-swiper pb-12"
    >
      {cars.map((car, index) => (
        <SwiperSlide key={car.id}>
          <CarCard car={car} index={index} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default FeaturedCarsCarousel;
