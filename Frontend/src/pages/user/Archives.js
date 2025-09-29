import React, { useState, useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import { ArchiveItemCard } from '../../components/ArchiveItemCard'; // <-- FIX: Changed to named import
import ImageModal from '../../components/ImageModal';
import './Archives.css';
import { useLocale } from '../../contexts/LocaleContext';

// --- FIX: Added 'export' to make this list available to other files ---
export const allArchives = [
  { id: 1, type: 'mural', title: 'Life of Buddha Fresco', monastery: 'Rumtek Monastery', description: 'A detailed mural depicting the key stages of Gautama Buddha\'s life.', image: '/images/life.jpg' },
  { id: 2, type: 'manuscript', title: 'Kanjur Buddhist Scripture', monastery: 'Pemayangtse Monastery', description: 'A rare, handwritten manuscript of the Kanjur.', image: '/images/script.jpg' },
  { id: 3, type: 'artwork', title: 'Mandala of Compassion', monastery: 'Enchey Monastery', description: 'An intricate sand mandala of Avalokiteshvara, created by resident monks.', image: '/images/mandala.jpg' },
  { id: 4, type: 'mural', title: 'Wrathful Deities Thangka', monastery: 'Tashiding Monastery', description: 'A vibrant Thangka painting of protector deities, used in advanced meditation.', image: '/images/wrath.jpg' },
  { id: 5, type: 'artwork', title: 'Ceremonial Phurba Dagger', monastery: 'Dubdi Monastery', description: 'A ritual three-sided peg, or dagger, used to subdue demonic spirits.', image: '/images/phurba.jpg' },
  { id: 6, type: 'manuscript', title: 'Prajnaparamita Sutra Text', monastery: 'Sangachoeling Monastery', description: 'An ancient text of the "Perfection of Wisdom" sutras in Tibetan script.', image: '/images/praja.jpg' },
  { id: 7, type: 'mural', title: 'Guru Rinpoche Fresco', monastery: 'Ralang Monastery', description: 'A large wall painting depicting Padmasambhava, who brought Buddhism to Tibet.', image: 'https://live.staticflickr.com/65535/51253019855_0856a93d98_b.jpg' },
  { id: 8, type: 'artwork', title: 'Singing Bowl of Healing', monastery: 'Phodong Monastery', description: 'A hand-hammered seven-metal bowl used in sound therapy and meditation.', image: 'https://images.unsplash.com/photo-1542822137-0249f2f3b9c2?q=80&w=2070&auto=format&fit=crop' },
  { id: 9, type: 'mural', title: 'The Wheel of Life', monastery: 'Lingdum (Ranka) Monastery', description: 'A detailed Bhavacakra mural, representing the cycle of samsara.', image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Wheel_of_Life_-_Yama_Holding_the_Wheel_of_Life_-_Rubin_Museum_of_Art.jpg' },
  { id: 10, type: 'manuscript', title: 'Uchen Script Calligraphy', monastery: 'Kartok Monastery', description: 'An exemplary piece of Uchen script, a form of the Tibetan alphabet.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Signature_of_the_5th_Dalai_Lama.svg/1280px-Signature_of_the_5th_Dalai_Lama.svg.png' },
  { id: 11, type: 'artwork', title: 'Vajra and Bell Set', monastery: 'Samdruptse Hill', description: 'A symbolic ritual set representing wisdom (bell) and compassion (vajra).', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Vajra_and_Bell_at_the_Rubin_Museum_of_Art_2011.jpg/1024px-Vajra_and_Bell_at_the_Rubin_Museum_of_Art_2011.jpg' },
  { id: 12, type: 'artwork', title: 'Prayer Wheel Collection', monastery: 'Gnathang Valley', description: 'A series of traditional prayer wheels, containing rolled scrolls of mantras.', image: 'https://images.unsplash.com/photo-1560098911-7c42b4a52a36?q=80&w=1936&auto=format&fit=crop' },
  { id: 13, type: 'mural', title: 'Milarepa\'s Life Story', monastery: 'Rumtek Monastery', description: 'A series of murals illustrating the life of the famous Tibetan yogi, Milarepa.', image: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Milarepa_with_disciples_in_a_cave_-_Rubin_Museum_of_Art.jpg' },
  { id: 14, type: 'manuscript', title: 'Medical Thangka Illustrations', monastery: 'Pemayangtse Monastery', description: 'An illustrated manuscript detailing principles of traditional Tibetan medicine.', image: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Tibetan_medical_thangka_Wellcome_L0035133.jpg' },
  { id: 15, type: 'artwork', title: 'Kapala (Skull Cup)', monastery: 'Tashiding Monastery', description: 'A ritual cup made from a human skull, used in tantric ceremonies.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Kapala_%28skull_cup%29_and_stand_-_Sino-Tibetan.jpg/1280px-Kapala_%28skull_cup%29_and_stand_-_Sino-Tibetan.jpg' },
  { id: 16, type: 'mural', title: 'The Four Harmonious Friends', monastery: 'Enchey Monastery', description: 'A popular mural depicting the Buddhist fable of four animals working together.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/The_four_harmonious_brothers.jpg/1280px-The_four_harmonious_brothers.jpg' },
  { id: 17, type: 'manuscript', title: 'Bardo Thödol Text', monastery: 'Sangachoeling Monastery', description: 'A manuscript of the "Tibetan Book of the Dead," a guide for consciousness after death.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bardo_Thodol_Mandala.jpg/1024px-Bardo_Thodol_Mandala.jpg' },
];

const Archives = () => {
  const { t } = useLocale();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalImage, setModalImage] = useState(null);

  const filteredArchives = useMemo(() => {
    let result = [...allArchives];
    if (filter !== 'all') {
      result = result.filter(item => item.type === filter);
    }
    if (searchTerm) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.monastery.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result;
  }, [filter, searchTerm]);

  const handleView = (image) => setModalImage(image);
  const closeModal = () => setModalImage(null);

  return (
    <div className="archives-page">
      <div className="page-header">
        <h2>{t('archives.title')}</h2>
      </div>
      <div className="archive-controls">
        <div className="filter-buttons">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>{t('archives.all')}</button>
          <button onClick={() => setFilter('mural')} className={filter === 'mural' ? 'active' : ''}>{t('archives.murals')}</button>
          <button onClick={() => setFilter('manuscript')} className={filter === 'manuscript' ? 'active' : ''}>{t('archives.manuscripts')}</button>
          <button onClick={() => setFilter('artwork')} className={filter === 'artwork' ? 'active' : ''}>{t('archives.artworks')}</button>
        </div>
        <div className="archive-search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder={t('archives.searchPlaceholder')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="archive-grid">
        {filteredArchives.length > 0 ? (
          filteredArchives.map(item => (
            <ArchiveItemCard key={item.id} item={item} onView={handleView} />
          ))
        ) : (
          <p className="no-results">{t('archives.noResults')}</p>
        )}
      </div>
      {modalImage && <ImageModal imageUrl={modalImage} onClose={closeModal} />}
    </div>
  );
};

export default Archives;