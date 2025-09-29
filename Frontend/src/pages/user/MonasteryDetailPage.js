import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { MonasteryCard } from '../../components/MonasteryCard';
import ReviewsSection from '../../components/ReviewsSection';
import './MonasteryDetailPage.css';

const mockMonasteries = [
  { 
    id: 13, name: 'Labrang Monastery', location: 'Phodong, North Sikkim', 
    shortDescription: 'An architecturally unique monastery of the Nyingma sect, featuring well-preserved murals.',
    longDescription: `Labrang Monastery, also known as Palden Phuntsok Phodrang, is one of the six great monasteries of the Nyingma school of Tibetan Buddhism. Established in the early 19th century, it is noted for its unique architectural style, which differs from most other monasteries in Sikkim.`,
    rating: 4.7, image: ['/images/labrang1.jpg', '/images/labrang2.jpg','/images/labrang3.jpg'],
    latitude: 27.4695, longitude: 88.5921, timelapseUrl: '/videos/labrang_timelapse.mp4', modelFile: 'labrang_model.glb'
  },
  { 
    id: 1, name: 'Rumtek Monastery', location: 'Gangtok, East Sikkim', 
    shortDescription: 'A vibrant center of Kagyu Buddhism, Rumtek boasts a stunning golden stupa and intricate murals.',
    longDescription: `A vibrant center of Kagyu Buddhism, Rumtek boasts a stunning golden stupa and intricate murals, serving as a pivotal spiritual hub in the Himalayas. The complex is designed to replicate the original Tsurphu Monastery in Tibet.`,
    rating: 4.8, image: ['/images/rumtek1.jpg', '/images/rumtek2.jpg','/images/rumtek3.jpg'],
    latitude: 27.2913, longitude: 88.5653, timelapseUrl: '/videos/rumtek_timelapse.mp4', modelFile: 'rumtek_model.glb'
  },
  { 
    id: 2, name: 'Pemayangtse Monastery', location: 'Pelling, West Sikkim', 
    shortDescription: 'One of Sikkim\'s oldest monasteries, housing an extraordinary seven-tiered wooden sculpture.',
    longDescription: `One of Sikkim's oldest and most significant monasteries, it houses an extraordinary seven-tiered wooden sculpture depicting the heavenly palace of Guru Rinpoche. This masterpiece, known as the Zangdok Palri, was carved single-handedly by Dungzin Rinpoche.`,
    rating: 4.9, image: ['/images/pemayangtse1.jpg', '/images/pemayangtse2.jpg','/images/pemayangtse3.jpg'],
    latitude: 27.3005, longitude: 88.2435, timelapseUrl: '/videos/pemayangtse_timelapse.mp4', modelFile: 'pemayangtse_model.glb'
  },
  { 
    id: 3, name: 'Tashiding Monastery', location: 'Tashiding, West Sikkim', 
    shortDescription: 'Perched on a heart-shaped hill, this sacred monastery is believed to cleanse the sins of anyone who merely sees it.',
    longDescription: `Perched on a heart-shaped hill between two rivers, this sacred monastery is believed to cleanse the sins of anyone who merely sees it. It's a key site for the Bhumchu festival, where a sacred pot of water is opened to predict the fortunes of the coming year.`,
    rating: 4.9, image: ['/images/tashiding1.jpg', '/images/tashiding2.jpg','/images/tashiding3.jpg'],
    latitude: 27.2848, longitude: 88.2831, timelapseUrl: '/videos/tashiding_timelapse.mp4', modelFile: 'tashiding_model.glb'
  },
    {
    id: 5, name: 'Dubdi Monastery', location: 'Yuksom, West Sikkim',
    shortDescription: 'Established in 1701 and known as the "Hermit\'s Cell," Dubdi is considered the oldest monastery in Sikkim.',
    longDescription: `Established in 1701 and known as the "Hermit's Cell," Dubdi is considered the oldest monastery in Sikkim, offering a glimpse into the state's foundational history. It was established by Chogyar Namgyal, the first king of Sikkim, shortly after his coronation.`,
    rating: 4.7, image: ['https://www.tourmyindia.com/states/sikkim/images/dubdi-monastery1.jpg', '/images/dubdi3.jpg','/images/dubdi2.jpg'],
    latitude: 27.3715, longitude: 88.2255, timelapseUrl: '/videos/dubdi_timelapse.mp4', modelFile: 'dubdi_model.glb'
  },
  { 
    id: 4, name: 'Enchey Monastery', location: 'Gangtok, East Sikkim', 
    shortDescription: 'Meaning "the solitary temple," this 200-year-old monastery is a serene oasis known for its vibrant Chaam masked dances.',
    longDescription: `Meaning "the solitary temple," this 200-year-old monastery is a serene oasis known for its beautiful architecture and the vibrant Chaam masked dances. It is believed to have been blessed by the tantric master Lama Druptob Karpo, who was renowned for his ability to fly.`,
    rating: 4.6, image: ['/images/enchey1.jpg', '/images/enchey2.jpg','/images/enchey3.jpg'],
    latitude: 27.3429, longitude: 88.6181, timelapseUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fast-passing-clouds-over-a-mountain-in-a-time-lapse-4228-large.mp4', modelFile: 'enchey_model.glb'
  },
  {
    id: 8, name: 'Phodong Monastery', location: 'Phodong, North Sikkim',
    shortDescription: 'A significant monastery of the Kagyupa Sect, it has been beautifully reconstructed and houses well-preserved ancient murals.',
    longDescription: `A significant monastery of the Kagyupa Sect, it has been beautifully reconstructed and houses well-preserved ancient murals and religious artifacts. Originally founded in the early 18th century, the current structure is a testament to the enduring artistic traditions of Tibetan Buddhism.`,
    rating: 4.6, image: ['/images/phodong1.jpg', '/images/phodong2.jpg','/images/phodong3.jpg'],
    latitude: 27.4641, longitude: 88.5918, timelapseUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fast-passing-clouds-over-a-mountain-in-a-time-lapse-4228-large.mp4', modelFile: 'phodong_model.glb'
  },
  {
    id: 6, name: 'Sangachoeling Monastery', location: 'Pelling, West Sikkim',
    shortDescription: 'Established in the 17th century, this "place of secret spells" offers breathtaking panoramic views of the Himalayas.',
    longDescription: `Established in the 17th century, this "place of secret spells" is one of the oldest gompas in the region, reserved for men only. To reach it, one must undertake an invigorating walk through a forested trail. Its main attraction is the breathtaking panoramic view of the Himalayas.`,
    rating: 4.8, image: ['/images/sangachoeling1.jpg','/images/sangachoeling2.jpg'],
    latitude: 27.3079, longitude: 88.2329, timelapseUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fast-passing-clouds-over-a-mountain-in-a-time-lapse-4228-large.mp4', modelFile: 'sangachoeling_model.glb'
  },
  {
    id: 7, name: 'Ralang Monastery', location: 'Ravangla, South Sikkim',
    shortDescription: 'Home to an extensive collection of thangkas and paintings, this monastery is renowned for its grand scale and festivals.',
    longDescription: `Home to an extensive collection of thangkas and paintings, this monastery is renowned for its grand scale and the energetic Pang Lhabsol festival. Built to replicate its counterpart in Tibet, Ralang is a significant pilgrimage site for the Kagyu sect.`,
    rating: 4.7, image: ['https://www.tourmyindia.com/states/sikkim/images/ralang-monastery1.jpg', '/images/ralang2.jpg','/images/ralang3.jpg'],
    latitude: 27.3093, longitude: 88.3971, timelapseUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-timelapse-30374-large.mp4', modelFile: 'ralang_model.glb'
  },
  {
    id: 9, name: 'Lingdum (Ranka) Monastery', location: 'Ranka, East Sikkim',
    shortDescription: 'A modern architectural marvel with a vast courtyard, serving as a training center for young monks.',
    longDescription: `A modern architectural marvel, Lingdum is surrounded by lush forested hills and serves as a training center for young monks. Also known as Ranka Monastery, it is a relatively new structure but follows traditional Tibetan architectural principles on a grand scale.`,
    rating: 4.8, image: ['/images/lingdum1.jpg'],
    latitude: 27.3325, longitude: 88.6601,
    timelapseUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-timelapse-30374-large.mp4',
    modelFile: 'lingdum_model.glb'
  },
  {
    id: 10, name: 'Kartok Monastery', location: 'Yuksom, West Sikkim',
    shortDescription: 'One of the three oldest monasteries in Yuksom, this serene gompa is distinguished by its vibrant red structure.',
    longDescription: `One of the three oldest monasteries in Yuksom, this serene gompa is distinguished by its vibrant red structure and beautifully manicured gardens. It is named after a lama who was part of the coronation of the first king of Sikkim.`,
    rating: 4.5, image: ['/images/kartok1.jpg','/images/kartok2.jpg'],
    latitude: 27.3673, longitude: 88.2238,
    timelapseUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fast-passing-clouds-over-a-mountain-in-a-time-lapse-4228-large.mp4',
    modelFile: 'kartok_model.glb'
  },
  {
    id: 11, name: 'Samdruptse Hill', location: 'Namchi, South Sikkim',
    shortDescription: 'A massive pilgrimage site featuring a towering 135-foot statue of Guru Padmasambhava overlooking the region.',
    longDescription: `Not a traditional monastery but a massive pilgrimage site, featuring a towering 135-foot statue of Guru Padmasambhava, the patron saint of Sikkim. The name "Samdruptse" translates to "The Wish Fulfilling Hill." The foundation stone was laid by the Dalai Lama in 1997.`,
    rating: 4.9, image: ['/images/samdruptse3.jpg', '/images/samdruptse2.jpg'],
    latitude: 27.1852, longitude: 88.3582,
    timelapseUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-timelapse-30374-large.mp4',
    modelFile: 'samdruptse_model.glb'
  },
  {
    id: 12, name: 'Gnathang Valley Monastery', location: 'Gnathang, East Sikkim',
    shortDescription: 'A humble yet spiritually significant monastery located in a high-altitude valley near the old Silk Route.',
    longDescription: `A humble yet spiritually significant monastery located in a high-altitude valley, offering a tranquil sanctuary amidst a starkly beautiful landscape. Situated at over 13,000 feet, it serves the local community of Gnathang, a village historically part of the old Silk Route to Tibet.`,
    rating: 4.7, image: ['/images/gnathang1.jpg', '/images/gnathang2.jpg','/images/gnathang3.jpg'],
    latitude: 27.3828, longitude: 88.8205,
    timelapseUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fast-passing-clouds-over-a-mountain-in-a-time-lapse-4228-large.mp4',
    modelFile: 'gnathang_model.glb'
  }
];
// It now receives onArViewClick as a prop
const MonasteryDetailPage = ({ onArViewClick }) => {
    const { monasteryId } = useParams();
    const monastery = mockMonasteries.find(m => m.id === parseInt(monasteryId));

    if (!monastery) {
        return <div>Monastery not found.</div>;
    }

    return (
        <div className="detail-page">
            <Link to="/user/explore" className="back-link">
                <FaArrowLeft /> Back to Explore
            </Link>
            <MonasteryCard 
                monastery={monastery} 
                isDetailPage={true} 
                // Pass the function down to the card
                onArViewClick={onArViewClick}
            />
            <div className="long-description-section">
                <h3>About {monastery.name}</h3>
                <p>{monastery.longDescription}</p>
            </div>
            <ReviewsSection monasteryId={monastery.id} />
        </div>
    );
};

export default MonasteryDetailPage;