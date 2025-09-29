import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import { FaHeart, FaRegHeart, FaTimes, FaSearch } from 'react-icons/fa';
import 'react-calendar/dist/Calendar.css';
import './Events.css';
import { useLocale } from '../../contexts/LocaleContext';

const upcomingEvents = [
  { 
    id: 1, 
    title: 'Saga Dawa Festival', 
    location: 'Gangtok', 
    description: 'A sacred month-long observance culminating on the full moon.', 
    date: '2026-06-02', 
    image: '/images/saga.jpg'
  },
  { 
    id: 2, 
    title: 'Pang Lhabsol', 
    location: 'Gangtok', 
    description: 'A unique festival dedicated to Mount Kanchenjunga, Sikkim\'s guardian deity.', 
    date: '2025-09-09', 
    image: '/images/pang1.jpg'
  },
  { 
    id: 3, 
    title: 'Losar - Tibetan New Year', 
    location: 'Pelling', 
    description: 'Celebrate the Tibetan New Year with local communities and grand feasts.', 
    date: '2026-02-18', 
    image: 'https://www.tourmyindia.com/states/sikkim/images/losar-festival1.jpg'
  },
  {
    id: 4,
    title: 'Drupka Teshi Festival',
    location: 'Namchi',
    description: 'Commemorating Buddha\'s first sermon, celebrated with prayers and yak races.',
    date: '2025-07-31',
    image: '/images/drupka.jpg'
  },
  {
    id: 5,
    title: 'Tendong Lho Rum Faat',
    location: 'Namchi',
    description: 'A festival of the Lepcha tribe, offering prayers to the Tendong Hill for protection.',
    date: '2025-08-08',
    image: '/images/tendong.jpg'
  }
];

const pastEvents = [
  { 
    id: 101, 
    title: 'Drupka Teshi Festival 2024', 
    location: 'Muguthang', 
    description: 'Commemorating Buddha\'s first sermon with prayers and yak races.', 
    date: '2024-08-04', 
    image: '/images/drupka.jpg',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  { 
    id: 102, 
    title: 'Hee Bermiok Tourism Festival 2024', 
    location: 'Hee Bermiok', 
    description: 'A celebration of local culture, cuisine, and natural beauty.', 
    date: '2024-05-10', 
    image: '/images/hee.jpg',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  }
];

const Events = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [date, setDate] = useState(new Date());
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [clickedEvent, setClickedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('name');

  const filterEvents = (events) => {
    if (!searchTerm) return events;
    return events.filter(event => {
      const term = searchTerm.toLowerCase();
      if (searchCategory === 'name') {
        return event.title.toLowerCase().includes(term);
      } else {
        return event.location.toLowerCase().includes(term);
      }
    });
  };

  const filteredUpcomingEvents = useMemo(() => filterEvents(upcomingEvents), [searchTerm, searchCategory, upcomingEvents]);
  const filteredPastEvents = useMemo(() => filterEvents(pastEvents), [searchTerm, searchCategory, pastEvents]);

  const eventDates = useMemo(() => {
    const dates = {};
    upcomingEvents.forEach(event => {
      const eventDate = new Date(event.date).toDateString();
      if (!dates[eventDate]) {
        dates[eventDate] = [];
      }
      dates[eventDate].push(event.title);
    });
    return dates;
  }, [upcomingEvents]);

  const toggleFavorite = (eventId) => {
    setFavoriteEvents(prevFavorites => 
      prevFavorites.includes(eventId)
        ? prevFavorites.filter(id => id !== eventId)
        : [...prevFavorites, eventId]
    );
  };

  const handleBookNow = (event) => alert(`Redirecting to payment gateway for ${event.title}.`);
  const handleWatchLive = (event) => alert(`Checking for a live stream for ${event.title}...`);
  const handleWatchVideo = (event) => {
    if (event.videoUrl) {
      window.open(event.videoUrl, '_blank');
    } else {
      alert('Video for this event is not available.');
    }
  };

  const markEventDates = (date, view) => {
    if (view === 'month') {
      const dateString = date.toDateString();
      if (eventDates[dateString]) {
        return 'event-date-marker';
      }
    }
    return null;
  };
  
  const handleDateClick = (clickedDate) => {
    const dateString = clickedDate.toDateString();
    if (eventDates[dateString]) {
      setClickedEvent({ date: clickedDate, titles: eventDates[dateString] });
    } else {
        setDate(clickedDate);
    }
  };

  return (
    <>
      {clickedEvent && (
        <div className="event-popup-backdrop" onClick={() => setClickedEvent(null)}>
          <div className="event-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup-btn" onClick={() => setClickedEvent(null)}><FaTimes /></button>
            <h4>{t('events.eventsOn')} {clickedEvent.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h4>
            <ul>
              {clickedEvent.titles.map(title => <li key={title}>{title}</li>)}
            </ul>
          </div>
        </div>
      )}

      <div className="events-page-container">
        <div className="events-content">
          <div className="page-header">
              <h2>{t('events.title')}</h2>
          </div>

          <div className="event-search-bar">
            <div className="search-category-selector">
              <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
                <option value="name">{t('events.searchByName')}</option>
                <option value="location">{t('events.searchByLocation')}</option>
              </select>
            </div>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={t('events.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="event-tabs">
            <button onClick={() => setActiveTab('upcoming')} className={activeTab === 'upcoming' ? 'active' : ''}>{t('events.upcoming')}</button>
            <button onClick={() => setActiveTab('past')} className={activeTab === 'past' ? 'active' : ''}>{t('events.past')}</button>
          </div>
          
          {activeTab === 'upcoming' && (
            <div className="events-list">
              {filteredUpcomingEvents.map(event => {
                const isFavorite = favoriteEvents.includes(event.id);
                return (
                <div key={event.id} className="event-card">
                  <img src={event.image} alt={event.title} className="event-card-image" />
                  <div className="event-card-content">
                      <div className="event-card-header">
                          <h3>{event.title}</h3>
                          <button onClick={() => toggleFavorite(event.id)} className="favorite-btn">
                              {isFavorite ? <FaHeart className="heart-filled" /> : <FaRegHeart />}
                          </button>
                      </div>
                    <p className="event-meta"><strong>{t('events.location')}:</strong> {event.location}</p>
                    <p className="event-meta"><strong>{t('events.date')}:</strong> {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="event-description">{event.description}</p>
                    <div className="event-actions">
                      <button onClick={() => handleBookNow(event)} className="book-btn">{t('events.bookNow')}</button>
                      <button onClick={() => handleWatchLive(event)} className="live-btn">{t('events.watchLive')}</button>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}
          
          {activeTab === 'past' && (
            <div className="events-list">
              {filteredPastEvents.map(event => {
                const isFavorite = favoriteEvents.includes(event.id);
                return (
                <div key={event.id} className="event-card past-event">
                  <img src={event.image} alt={event.title} className="event-card-image" />
                  <div className="event-card-content">
                    <div className="event-card-header">
                        <h3>{event.title}</h3>
                        <button onClick={() => toggleFavorite(event.id)} className="favorite-btn">
                            {isFavorite ? <FaHeart className="heart-filled" /> : <FaRegHeart />}
                        </button>
                    </div>
                    <p className="event-meta"><strong>{t('events.location')}:</strong> {event.location}</p>
                    <p className="event-meta"><strong>{t('events.date')}:</strong> {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="event-description">{event.description}</p>
                    <div className="event-actions">
                      <button onClick={() => handleWatchVideo(event)} className="book-btn">{t('events.watchVideo')}</button>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
        
        <aside className="calendar-container">
          <div className="calendar-widget">
            <h3>{t('events.calendar')}</h3>
            <Calendar
              onChange={setDate}
              value={date}
              onClickDay={handleDateClick}
              tileClassName={({ date, view }) => markEventDates(date, view)} 
            />
          </div>
        </aside>
      </div>
    </>
  );
};

export default Events;