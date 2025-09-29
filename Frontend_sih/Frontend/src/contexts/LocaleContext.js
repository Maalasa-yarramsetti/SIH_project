import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

const LocaleContext = createContext();

const FALLBACK_LOCALE = 'en';

const translations = {
  en: {
    Explore: 'Explore',
    Events: 'Events',
    Maps: 'Maps',
    Archives: 'Archives',
    Trivia: 'Trivia',
    ContactUs: 'Contact Us',
    profile: {
      editProfile: 'Edit Profile',
      myFavorites: 'My Favorites',
      monasteries: 'Monasteries',
      archives: 'Archives',
      email: 'Email',
      phone: 'Phone',
      loading: 'Loading profile...',
      myCoins: 'My Coins',
      logout: 'Logout'
    },
    explore: {
      searchPlaceholder: 'Search monasteries by name...',
      sort: {
        featured: 'Sort by: Featured',
        ratingHigh: 'Sort by: Rating (High to Low)',
        ratingLow: 'Sort by: Rating (Low to High)',
        nameAZ: 'Sort by: Name (A-Z)',
        nameZA: 'Sort by: Name (Z-A)'
      }
    },
    events: {
      title: 'Monastery & Cultural Events',
      searchByName: 'by Name',
      searchByLocation: 'by Location',
      searchPlaceholder: 'Search events by name or location...',
      upcoming: 'Upcoming Events',
      past: 'Past Events',
      location: 'Location',
      date: 'Date',
      bookNow: 'Book Now',
      watchLive: 'Watch Live',
      watchVideo: 'Watch Video',
      calendar: 'Event Calendar',
      eventsOn: 'Events on'
    },
    maps: {
      title: 'Interactive Map & Planner',
      searchPlaceholder: 'Search for a monastery...',
      search: 'Search',
      sacredMonasteries: 'Sacred Monasteries of Sikkim',
      getDirections: 'Get Directions',
      book: 'Book',
      bookVisit: 'Book Visit',
      transport: 'Transport',
      restaurants: 'Restaurants',
      accommodation: 'Accommodation',
      loading: 'Loading Google Maps...'
    },
    archives: {
      title: 'Digital Archives',
      all: 'All',
      murals: 'Murals',
      manuscripts: 'Manuscripts',
      artworks: 'Artworks',
      searchPlaceholder: 'Search by title or monastery...',
      noResults: 'No items match your search.'
    },
    trivia: {
      alreadyCompleted: 'Quiz Already Completed!',
      comeTomorrow: 'You\'ve completed your daily quiz. Come back tomorrow for a new set of questions!',
      yourStreak: 'Your Current Streak:',
      startTitle: 'Sikkim Heritage Trivia',
      startDesc: 'Test your knowledge about the culture and monasteries of Sikkim. You get one chance a day!',
      startButton: 'Start Daily Quiz',
      quizTitle: 'Sikkim Monastery Trivia',
      explanation: 'Explanation:',
      next: 'Next Question',
      finish: 'Finish Quiz',
      completeTitle: 'Quiz Complete!',
      earned: 'You earned',
      coins: 'coins!',
      streakNow: 'Your streak is now',
      continueTomorrow: 'Come back tomorrow to continue.'
    }
  },
  hi: {
    Explore: 'खोजें',
    Events: 'कार्यक्रम',
    Maps: 'मानचित्र',
    Archives: 'अभिलेख',
    Trivia: 'ट्रिविया',
    ContactUs: 'संपर्क करें',
    profile: {
      editProfile: 'प्रोफ़ाइल संपादित करें',
      myFavorites: 'मेरे पसंदीदा',
      monasteries: 'मठ',
      archives: 'अभिलेख',
      email: 'ईमेल',
      phone: 'फ़ोन',
      loading: 'प्रोफ़ाइल लोड हो रही है...',
      myCoins: 'मेरे सिक्के',
      logout: 'लॉगआउट'
    },
    explore: {
      searchPlaceholder: 'नाम से मठ खोजें...',
      sort: {
        featured: 'क्रम: फीचर्ड',
        ratingHigh: 'क्रम: रेटिंग (ऊँचे से नीच)',
        ratingLow: 'क्रम: रेटिंग (नीचे से ऊपर)',
        nameAZ: 'क्रम: नाम (A-Z)',
        nameZA: 'क्रम: नाम (Z-A)'
      }
    },
    events: {
      title: 'मठ एवं सांस्कृतिक कार्यक्रम',
      searchByName: 'नाम से',
      searchByLocation: 'स्थान से',
      searchPlaceholder: 'कार्यक्रम नाम या स्थान से खोजें...',
      upcoming: 'आगामी कार्यक्रम',
      past: 'पूर्व कार्यक्रम',
      location: 'स्थान',
      date: 'तिथि',
      bookNow: 'बुक करें',
      watchLive: 'सीधा देखें',
      watchVideo: 'वीडियो देखें',
      calendar: 'इवेंट कैलेंडर',
      eventsOn: 'कार्यक्रम -'
    },
    maps: {
      title: 'इंटरएक्टिव मानचित्र व योजनाकार',
      searchPlaceholder: 'किसी मठ की खोज करें...',
      search: 'खोजें',
      sacredMonasteries: 'सिक्किम के पवित्र मठ',
      getDirections: 'दिशाएँ प्राप्त करें',
      book: 'बुक',
      bookVisit: 'भ्रमण बुक करें',
      transport: 'परिवहन',
      restaurants: 'रेस्तरां',
      accommodation: 'आवास',
      loading: 'गूगल मैप्स लोड हो रहा है...'
    },
    archives: {
      title: 'डिजिटल अभिलेख',
      all: 'सभी',
      murals: 'भित्तिचित्र',
      manuscripts: 'पांडुलिपियाँ',
      artworks: 'कला-कृतियाँ',
      searchPlaceholder: 'शीर्षक या मठ से खोजें...',
      noResults: 'आपकी खोज से कोई वस्तु मेल नहीं खाती।'
    },
    trivia: {
      alreadyCompleted: 'क्विज़ पहले ही पूरा हो चुका है!',
      comeTomorrow: 'आपने आज का क्विज़ पूरा कर लिया है। कल फिर आएँ!',
      yourStreak: 'आपकी वर्तमान स्ट्रीक:',
      startTitle: 'सिक्किम विरासत ट्रिविया',
      startDesc: 'सिक्किम की संस्कृति और मठों पर अपने ज्ञान को परखें। प्रतिदिन एक मौका!',
      startButton: 'डेली क्विज़ शुरू करें',
      quizTitle: 'सिक्किम मठ ट्रिविया',
      explanation: 'व्याख्या:',
      next: 'अगला प्रश्न',
      finish: 'क्विज़ समाप्त',
      completeTitle: 'क्विज़ पूरा!',
      earned: 'आपने अर्जित किए',
      coins: 'सिक्के!',
      streakNow: 'अब आपकी स्ट्रीक है',
      continueTomorrow: 'जारी रखने के लिए कल आएँ।'
    }
  },
  ne: {
    Explore: 'अन्वेषण',
    Events: 'कार्यक्रम',
    Maps: 'नक्सा',
    Archives: 'अभिलेख',
    Trivia: 'ट्रिभिया',
    ContactUs: 'सम्पर्क',
    profile: {
      editProfile: 'प्रोफाइल सम्पादन',
      myFavorites: 'मेरो मनपर्ने',
      monasteries: 'गुम्बा',
      archives: 'अभिलेख',
      email: 'इमेल',
      phone: 'फोन',
      loading: 'प्रोफाइल लोड हुँदै...',
      myCoins: 'मेरो सिक्का',
      logout: 'लगआउट'
    },
    explore: {
      searchPlaceholder: 'नाम द्वारा गुम्बा खोज्नुहोस्...',
      sort: {
        featured: 'क्रम: विशेष',
        ratingHigh: 'क्रम: रेटिङ् (उच्च देखि न्यून)',
        ratingLow: 'क्रम: रेटिङ् (न्यून देखि उच्च)',
        nameAZ: 'क्रम: नाम (A-Z)',
        nameZA: 'क्रम: नाम (Z-A)'
      }
    },
    events: {
      title: 'गुम्बा र सांस्कृतिक कार्यक्रम',
      searchByName: 'नामले',
      searchByLocation: 'स्थानले',
      searchPlaceholder: 'कार्यक्रम नाम वा स्थानले खोज्नुहोस्...',
      upcoming: 'आउँदै गरेका कार्यक्रम',
      past: 'पूरा भएका कार्यक्रम',
      location: 'स्थान',
      date: 'मिति',
      bookNow: 'बुक गर्नुहोस्',
      watchLive: 'प्रत्यक्ष हेर्नुहोस्',
      watchVideo: 'भिडियो हेर्नुहोस्',
      calendar: 'कार्यक्रम पात्रो',
      eventsOn: 'यस मितिमा कार्यक्रम'
    },
    maps: {
      title: 'इन्टरेक्टिभ नक्सा र योजनाकार',
      searchPlaceholder: 'गुम्बा खोज्नुहोस्...',
      search: 'खोज्नुहोस्',
      sacredMonasteries: 'सिक्किमका पवित्र गुम्बाहरू',
      getDirections: 'दिशा पाउनुहोस्',
      book: 'बुक',
      bookVisit: 'भ्रमण बुक',
      transport: 'यातायात',
      restaurants: 'रेस्टुरेन्ट',
      accommodation: 'आवास',
      loading: 'गुगल नक्सा लोड हुँदै...'
    },
    archives: {
      title: 'डिजिटल अभिलेख',
      all: 'सबै',
      murals: 'भित्तिचित्र',
      manuscripts: 'पाण्डुलिपि',
      artworks: 'कला',
      searchPlaceholder: 'शीर्षक वा गुम्बा द्वारा खोज्नुहोस्...',
      noResults: 'तपाईंको खोजसँग कुनै वस्तु मेल खाँदैन।'
    },
    trivia: {
      alreadyCompleted: 'क्विज आजका लागि पूरा भइसकेको छ!',
      comeTomorrow: 'तपाईंले आजको क्विज पूरा गर्नुभयो। भोलि फेरि आउनुहोस्!',
      yourStreak: 'तपाईंको हालको स्ट्रिक:',
      startTitle: 'सिक्किम सम्पदा ट्रिभिया',
      startDesc: 'सिक्किमको संस्कृति र गुम्बाहरू बारेको ज्ञान जाँच्नुहोस्। दैनिक एउटै मौका!',
      startButton: 'डेली क्विज सुरु गर्नुहोस्',
      quizTitle: 'सिक्किम गुम्बा ट्रिभिया',
      explanation: 'व्याख्या:',
      next: 'अर्को प्रश्न',
      finish: 'क्विज समाप्त',
      completeTitle: 'क्विज पूरा!',
      earned: 'तपाईंले कमाउनुभयो',
      coins: 'सिक्का!',
      streakNow: 'अब तपाईंको स्ट्रिक',
      continueTomorrow: 'भोलि फेरि आउनुहोस्।'
    }
  },
  skm: {
    Explore: 'Zug',
    Events: 'Nyi',
    Maps: 'Lam thak',
    Archives: 'Nangpa',
    Trivia: 'Gya',
    ContactUs: 'Jikpa',
    profile: {
      editProfile: 'La thap che',
      myFavorites: 'Nga’i kyepar',
      monasteries: 'Gonpa',
      archives: 'Nangpa',
      email: 'E-mail',
      phone: 'Phone',
      loading: 'Profile chö lay...',
      myCoins: 'Nga’i nor',
      logout: 'Log out'
    },
    explore: {
      searchPlaceholder: 'Ming gi gompa tshol...',
      sort: {
        featured: 'Shib: nangso',
        ratingHigh: 'Shib: tseg (chenpo–chungchung)',
        ratingLow: 'Shib: tseg (chungchung–chenpo)',
        nameAZ: 'Shib: ming (A-Z)',
        nameZA: 'Shib: ming (Z-A)'
      }
    },
    events: {
      title: 'Gonpa dang rig-gnas nyi',
      searchByName: 'Ming gis',
      searchByLocation: 'Sa-gnas gis',
      searchPlaceholder: 'Nyi ming am sa-gnas gis tshol...',
      upcoming: 'Ring-la nyi',
      past: 'Shing-la nyi',
      location: 'Sa-gnas',
      date: 'Tshe-ring',
      bookNow: 'Buk che',
      watchLive: 'Live lta',
      watchVideo: 'Video lta',
      calendar: 'Nyi tshe-tho',
      eventsOn: 'Nyi —'
    },
    maps: {
      title: 'Lam-thak dang drup-yig',
      searchPlaceholder: 'Gompa tshol...',
      search: 'Tshol',
      sacredMonasteries: 'Sikkim-gyi gtsang-mai gonpa',
      getDirections: 'Lam gzhi len',
      book: 'Buk',
      bookVisit: 'Lok-pa buk',
      transport: 'Nyam-’gro',
      restaurants: 'Zang-khang',
      accommodation: 'Nyi-khang',
      loading: 'Google Map lhung-du...'
    },
    archives: {
      title: 'Nangpa rnying-rkyo',
      all: 'Thamscad',
      murals: 'Ri-thang',
      manuscripts: 'Yig-’bur',
      artworks: 'Zug-srid',
      searchPlaceholder: 'Thor-ba am gonpa gis tshol...',
      noResults: '’Di dang mthun-pa mi ’dug.'
    },
    trivia: {
      alreadyCompleted: 'Quiz deng-gi tshar-song!',
      comeTomorrow: 'Da-nyi quiz tshar-song. Sang nyin log na!',
      yourStreak: 'Da-nyi rgyun:',
      startTitle: 'Sikkim heritage trivia',
      startDesc: 'Sikkim-gyi rig-gnas la shes-pa tshod-pa. Nyin re gcig-go!',
      startButton: 'Nyin-gyi quiz go',
      quizTitle: 'Sikkim gonpa trivia',
      explanation: 'bshad-pa:',
      next: 'gzhon ma zhig',
      finish: 'Quiz rdzogs',
      completeTitle: 'Quiz rdzogs-song!',
      earned: 'Khyed-cigs thob-pa',
      coins: 'nor!',
      streakNow: 'Da rgyun',
      continueTomorrow: 'Sang nyin yang log na.'
    }
  }
};

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => localStorage.getItem('locale') || FALLBACK_LOCALE);

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const t = useMemo(() => {
    return (keyPath) => {
      const parts = keyPath.split('.');
      let current = translations[locale] || translations[FALLBACK_LOCALE];
      for (const p of parts) {
        if (current && typeof current === 'object' && p in current) {
          current = current[p];
        } else {
          current = translations[FALLBACK_LOCALE];
          for (const q of parts) {
            current = current && current[q];
          }
          break;
        }
      }
      return typeof current === 'string' ? current : keyPath;
    };
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => useContext(LocaleContext);


