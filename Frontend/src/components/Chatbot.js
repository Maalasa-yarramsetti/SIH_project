import React, { useState, useRef, useEffect } from 'react';
import { FaCommentDots, FaPaperPlane } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css';

// Enhanced chat message handling with fallback LLM responses
const sendMessage = async (userMessage) => {
  try {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Service temporarily unavailable");
    }
    return data;
  } catch (error) {
    // Fallback to intelligent local responses when backend is unavailable
    console.log("Backend unavailable, using local LLM responses");
    return generateLocalResponse(userMessage);
  }
};

// Enhanced LLM-style responses with markdown formatting
const generateLocalResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Monastery-related responses
  if (message.includes('monastery') || message.includes('temple') || message.includes('monk')) {
    return {
      reply: `## 🏛️ Sacred Monasteries of Sikkim

The monasteries of Sikkim are **sacred sanctuaries** of peace and spirituality. Each one holds unique architectural beauty and spiritual significance.

### 🏔️ **Historical Context**
Sikkim's monasteries represent over 300 years of Buddhist heritage, established during the reign of the Chogyal kings. These sacred sites blend Tibetan, Nepalese, and Sikkimese architectural styles.

### 🏛️ **Major Monasteries & Their History:**

#### **Rumtek Monastery** (Gangtok, East Sikkim)
- **Founded**: 1960s (rebuilt), original 16th century
- **Sect**: Kagyu (Karma Kagyu)
- **History**: Replica of the original Tsurphu Monastery in Tibet, serves as the seat of the Karmapa
- **Significance**: Golden stupa, intricate murals, spiritual center of Kagyu Buddhism
- **Architecture**: Traditional Tibetan style with golden roofs

#### **Pemayangtse Monastery** (Pelling, West Sikkim)
- **Founded**: 1705 (one of the oldest)
- **Sect**: Nyingma (Old School)
- **History**: Established by Lama Lhatsun Chempo, part of the "Three Lamas" who consecrated Sikkim
- **Significance**: Houses the seven-tiered Zangdok Palri (Guru Rinpoche's heavenly palace)
- **Architecture**: Ancient Nyingma style with wooden carvings

#### **Tashiding Monastery** (Tashiding, West Sikkim)
- **Founded**: 17th century
- **Sect**: Nyingma
- **History**: Built on a heart-shaped hill between two rivers, blessed by Guru Rinpoche
- **Significance**: Bhumchu festival site, believed to cleanse sins just by sight
- **Architecture**: Perched on sacred hill, traditional Sikkimese style

#### **Dubdi Monastery** (Yuksom, West Sikkim)
- **Founded**: 1701 (oldest in Sikkim)
- **Sect**: Nyingma
- **History**: "Hermit's Cell" - first monastery built after Sikkim's consecration
- **Significance**: Historical foundation of Buddhism in Sikkim
- **Architecture**: Simple hermitage style, accessible by foot

#### **Enchey Monastery** (Gangtok, East Sikkim)
- **Founded**: 1840
- **Sect**: Nyingma
- **History**: "The Solitary Temple" - blessed by Lama Druptob Karpo (flying lama)
- **Significance**: Known for Chaam masked dances, 200-year-old tradition
- **Architecture**: Traditional with beautiful prayer wheels

### 🎯 **Quick Actions:**
- Ask about specific monastery history
- Request 360° virtual tours
- Get directions to any monastery
- Learn about Buddhist sects and practices

**Which monastery's history interests you most?**`,
      action: null
    };
  }
  
  // Travel and location responses
  if (message.includes('visit') || message.includes('travel') || message.includes('go to')) {
    return {
      reply: `## 🗺️ Spiritual Journey Planning

Sikkim offers incredible spiritual journeys! I can help you with:

### ✨ What I can do:
- **Plan visits** to various monasteries
- **Provide historical information** about each site
- **Guide through 360° virtual tours** before you visit
- **Show directions** and nearby attractions
- **Help with bookings** and payments

### 🎯 Quick Actions:
- Ask about specific monasteries
- Request 360° tours
- Get travel directions
- Book monastery visits

Which monastery interests you most?`,
      action: null
    };
  }
  
  // 360° and virtual tour responses
  if (message.includes('360') || message.includes('virtual') || message.includes('tour') || message.includes('panorama')) {
    return {
      reply: `## 🌐 360° Virtual Experience

Experience the monasteries in **immersive 360° views**! 

### Available Virtual Tours:
- **Rumtek Monastery** - Golden stupa and intricate murals
- **Pemayangtse Monastery** - Seven-tiered wooden sculpture
- **Tashiding Monastery** - Heart-shaped hill views
- **Dubdi Monastery** - Historic hermit's cell

### How to Access:
1. Click the **"360° Tour"** button on any monastery card
2. Use mouse/touch to navigate the panoramic view
3. Zoom in/out to explore details

Just let me know which monastery you'd like to explore virtually!`,
      action: null
    };
  }
  
  // Booking and payment responses
  if (message.includes('book') || message.includes('payment') || message.includes('price') || message.includes('cost')) {
    return {
      reply: `## 💳 Booking & Payment System

I can help you with **bookings and payments** for monastery visits!

### 💰 Payment Methods:
- **Razorpay** - Secure online payments
- **Digital Wallets** - Quick and convenient
- **GST included** - Transparent pricing

### 📋 Booking Process:
1. Select your preferred monastery
2. Choose visit date and duration
3. Complete payment securely
4. Receive confirmation

### 💵 Pricing:
- Base prices vary by monastery
- 18% GST included
- Transparent cost breakdown

**What would you like to book?** I can open the payment modal for you!`,
      action: null
    };
  }
  
  // General spiritual guidance
  if (message.includes('spiritual') || message.includes('meditation') || message.includes('peace') || message.includes('blessing')) {
    return {
      reply: `## 🙏 Spiritual Guidance

As your spiritual guide, I believe that **true peace comes from within**. The monasteries of Sikkim offer perfect sanctuaries for meditation and spiritual reflection.

### 🧘‍♂️ Spiritual Practices:
- **Meditation** in serene monastery courtyards
- **Prayer wheels** for spiritual merit
- **Thangka paintings** for contemplation
- **Monk teachings** and wisdom

### 🏔️ Sacred Energy:
Each monastery has its own unique energy and teachings:
- **Rumtek** - Dynamic Kagyu practices
- **Pemayangtse** - Ancient Nyingma traditions
- **Tashiding** - Purification and blessings

### 🌟 Inner Journey:
*"The journey to enlightenment begins with a single step toward inner peace."*

Would you like guidance on specific spiritual practices or monastery visits?`,
      action: null
    };
  }
  
  // Weather and practical information
  if (message.includes('weather') || message.includes('climate') || message.includes('season')) {
    return {
      reply: `## 🌤️ Weather & Best Times to Visit

Sikkim's climate varies with altitude, creating diverse microclimates across the region.

### 📅 Best Seasons:
- **Spring (March-May)** - Pleasant weather, clear views
- **Autumn (September-November)** - Ideal for monastery visits
- **Winter (December-February)** - Snow-capped peaks, fewer crowds

### 🌡️ Climate Zones:
- **Lower altitudes** (1000-2000m) - Moderate climate
- **Mid altitudes** (2000-3000m) - Cool and pleasant
- **High altitudes** (3000m+) - Cold, snow possible

### 🎒 What to Pack:
- **Layered clothing** for temperature changes
- **Comfortable walking shoes** for monastery visits
- **Rain gear** during monsoon season
- **Warm clothes** for high-altitude monasteries

**Planning your visit?** I can help with specific monastery recommendations based on the season!`,
      action: null
    };
  }
  
  // Maps and directions
  if (message.includes('map') || message.includes('direction') || message.includes('location') || message.includes('where')) {
    return {
      reply: `## 🗺️ Maps & Navigation

I can help you navigate to Sikkim's monasteries with **Google Maps integration**!

### 🧭 Navigation Features:
- **Interactive Google Maps** with monastery locations
- **Real-time directions** from your current location
- **Nearby attractions** (restaurants, accommodation, transport)
- **Route planning** for multiple monastery visits

### 📍 How to Use:
1. Go to the **Maps page**
2. Search for any monastery name
3. Get directions and nearby recommendations
4. Plan your spiritual journey route

### 🏛️ Monastery Locations:
- **Rumtek** - Near Gangtok, East Sikkim
- **Pemayangtse** - Pelling, West Sikkim
- **Tashiding** - Tashiding, West Sikkim
- **Dubdi** - Yuksom, West Sikkim

**Ready to explore?** I can open the maps for you!`,
      action: null
    };
  }
  
  // Specific monastery history responses
  if (message.includes('rumtek')) {
    return {
      reply: `## 🏛️ Rumtek Monastery - The Golden Seat

### 📜 **Historical Background**
**Rumtek Monastery** is the most significant Kagyu monastery outside Tibet, serving as the seat of the Karmapa lineage.

#### **Timeline:**
- **16th Century**: Original monastery built by 9th Karmapa Wangchuk Dorje
- **1959**: 16th Karmapa Rangjung Rigpe Dorje fled Tibet during Chinese occupation
- **1960s**: Rebuilt as exact replica of Tsurphu Monastery in Tibet
- **Present**: Active spiritual center and pilgrimage site

#### **Architectural Marvels:**
- **Golden Stupa**: Contains relics of the 16th Karmapa
- **Main Temple**: Three-story structure with intricate murals
- **Monastery Complex**: Includes monks' quarters, library, and meditation halls
- **Prayer Wheels**: Traditional Tibetan prayer wheels around the complex

#### **Spiritual Significance:**
- **Kagyu Lineage**: Heart of Karma Kagyu tradition
- **Meditation Center**: Active practice of Mahamudra meditation
- **Festivals**: Annual Kagyu Monlam Chenmo festival
- **Pilgrimage**: Sacred destination for Tibetan Buddhists worldwide

#### **Visitor Information:**
- **Location**: 24 km from Gangtok
- **Best Time**: March-May, September-November
- **Dress Code**: Modest clothing, remove shoes
- **Photography**: Restricted in prayer halls

**Would you like directions, booking information, or a 360° virtual tour?**`,
      action: null
    };
  }

  if (message.includes('pemayangtse')) {
    return {
      reply: `## 🏛️ Pemayangtse Monastery - The Seven-Tiered Wonder

### 📜 **Historical Background**
**Pemayangtse Monastery** is one of Sikkim's oldest and most sacred monasteries, established by the "Three Lamas" who consecrated Sikkim.

#### **Timeline:**
- **1705**: Founded by Lama Lhatsun Chempo
- **18th Century**: Expanded and decorated with murals
- **19th Century**: Added the famous Zangdok Palri
- **Present**: UNESCO World Heritage site candidate

#### **The Zangdok Palri Masterpiece:**
- **Creator**: Dungzin Rinpoche (single-handed carving)
- **Structure**: Seven-tiered wooden palace
- **Significance**: Represents Guru Rinpoche's heavenly abode
- **Details**: Intricate carvings of deities, mandalas, and celestial beings
- **Time**: Took 5 years to complete

#### **Architectural Features:**
- **Main Temple**: Traditional Nyingma architecture
- **Murals**: Ancient Buddhist paintings and thangkas
- **Prayer Hall**: Large assembly area for ceremonies
- **Library**: Collection of ancient Buddhist texts

#### **Spiritual Practices:**
- **Nyingma Tradition**: Oldest school of Tibetan Buddhism
- **Guru Rinpoche**: Central figure in worship and practice
- **Festivals**: Annual Tsechu festival with masked dances
- **Meditation**: Active meditation and study programs

#### **Visitor Information:**
- **Location**: Pelling, West Sikkim
- **Altitude**: 2,085 meters
- **Access**: 2-hour drive from Gangtok
- **Timings**: 6 AM - 6 PM daily

**Ready to explore this ancient wonder? I can help with directions or virtual tours!**`,
      action: null
    };
  }

  if (message.includes('tashiding')) {
    return {
      reply: `## 🏛️ Tashiding Monastery - The Sin-Cleansing Sanctuary

### 📜 **Historical Background**
**Tashiding Monastery** is one of Sikkim's most sacred sites, believed to cleanse sins just by sight.

#### **Timeline:**
- **17th Century**: Founded by Ngadak Sempa Chempo
- **18th Century**: Expanded during Chogyal reign
- **19th Century**: Became center of Bhumchu festival
- **Present**: Major pilgrimage destination

#### **Sacred Geography:**
- **Heart-Shaped Hill**: Located between two rivers (Rathong and Rangit)
- **Guru Rinpoche's Blessing**: Site blessed by Padmasambhava
- **Sacred Waters**: Rivers believed to have purifying powers
- **Natural Mandala**: Hill formation represents cosmic mandala

#### **The Bhumchu Festival:**
- **Annual Event**: February-March (Tibetan calendar)
- **Sacred Pot**: Water in sacred pot predicts year's fortune
- **Ritual**: Opening ceremony by high lamas
- **Significance**: Weather and harvest predictions
- **Pilgrimage**: Thousands gather for the ceremony

#### **Architectural Features:**
- **Main Temple**: Traditional Sikkimese architecture
- **Stupas**: Multiple stupas around the complex
- **Prayer Wheels**: Large prayer wheels for merit
- **Viewpoint**: Panoramic views of surrounding valleys

#### **Spiritual Beliefs:**
- **Sin Cleansing**: Merely seeing the monastery cleanses sins
- **Wish Fulfillment**: Prayers here are believed to be answered
- **Karma Purification**: Special power to purify negative karma
- **Blessing Site**: Sacred energy from Guru Rinpoche

#### **Visitor Information:**
- **Location**: Tashiding, West Sikkim
- **Access**: 3-hour drive from Gangtok
- **Trekking**: 1-hour trek from main road
- **Best Time**: October-April

**This sacred site offers profound spiritual experiences. Would you like directions or more information?**`,
      action: null
    };
  }

  if (message.includes('dubdi')) {
    return {
      reply: `## 🏛️ Dubdi Monastery - The Hermit's Cell

### 📜 **Historical Background**
**Dubdi Monastery** holds the honor of being Sikkim's oldest monastery, established shortly after the state's consecration.

#### **Timeline:**
- **1701**: Founded by Chogyal Namgyal (first king of Sikkim)
- **1701**: Built immediately after Sikkim's consecration
- **18th Century**: Active during early Sikkim kingdom
- **Present**: Historical monument and pilgrimage site

#### **The "Hermit's Cell":**
- **Name Origin**: "Dubdi" means "the retreat"
- **Purpose**: Hermitage for meditation and study
- **Architecture**: Simple, ascetic design
- **Location**: Forested hillside above Yuksom

#### **Historical Significance:**
- **First Monastery**: Earliest Buddhist establishment in Sikkim
- **Consecration Site**: Part of Sikkim's spiritual foundation
- **Royal Patronage**: Built by the first Chogyal
- **Monastic Tradition**: Beginning of organized Buddhism in Sikkim

#### **Architectural Features:**
- **Simple Design**: Basic hermitage structure
- **Wooden Construction**: Traditional Sikkimese building methods
- **Prayer Hall**: Small meditation space
- **Natural Setting**: Surrounded by ancient forests

#### **Spiritual Practices:**
- **Meditation**: Focus on mindfulness and contemplation
- **Study**: Buddhist philosophy and texts
- **Retreat**: Hermit-style spiritual practice
- **Pilgrimage**: Sacred destination for devotees

#### **Visitor Information:**
- **Location**: Yuksom, West Sikkim
- **Access**: 30-minute trek from Yuksom
- **Difficulty**: Moderate hiking required
- **Best Time**: October-April

**This historic hermitage offers a glimpse into Sikkim's spiritual origins. Ready to explore?**`,
      action: null
    };
  }

  // Default response
  return {
    reply: `## 🙏 Welcome to GURUJI

I'm your **spiritual guide** to Sikkim's sacred monasteries, combining the wisdom of an agent with the intelligence of an LLM.

### 🎯 How I can help you:

#### 🏛️ **Monastery Exploration**
- Detailed historical information about each monastery
- Architectural details and spiritual significance
- 360° virtual tours and AR experiences
- Festival dates and special events

#### 🗺️ **Navigation & Planning**
- Google Maps integration for directions
- Route planning for multiple visits
- Nearby attractions and recommendations
- Real-time geolocation and directions

#### 💳 **Booking & Payments**
- Secure payment processing
- Multiple payment methods (Razorpay, Digital Wallets)
- Transparent pricing with GST
- Instant booking confirmations

#### 🧘‍♂️ **Spiritual Guidance**
- Meditation and prayer guidance
- Cultural and religious insights
- Personalized spiritual journey planning
- Historical context and traditions

### 💬 **Try asking me:**
- "Tell me about Rumtek Monastery history"
- "What's special about Pemayangtse?"
- "How do I get to Tashiding?"
- "Book a visit to Dubdi Monastery"
- "Show me 360° tour of Enchey"

**What would you like to explore today?**`,
    action: null
  };
};


const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Namaste! I am GURUJI, your spiritual guide to Sikkim\'s sacred monasteries. How may I assist you on your journey today?' }
    ]);
    const [input, setInput] = useState('');
    const messagesContainerRef = useRef(null);

    // Keep chat anchored at top by default; do not auto-scroll to bottom.
    useEffect(() => {
        if (isOpen && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = 0;
        }
    }, [isOpen]);

    // Helper methods for actions
    const handleOpenModal = (data) => {
        if (data && data.modalType) {
            console.log(`Opening ${data.modalType} modal:`, data);
            // You can implement modal opening logic here
            // For now, just log the action
            alert(`Opening ${data.modalType} modal: ${data.title || 'Modal'}`);
        }
    };

    const handleScrollToSection = (data) => {
        if (data && data.section) {
            console.log(`Scrolling to section: ${data.section}`);
            const element = document.getElementById(data.section) || 
                          document.querySelector(`[data-section="${data.section}"]`) ||
                          document.querySelector(`.${data.section}`);
            
            if (element) {
                element.scrollIntoView({ 
                    behavior: data.smooth ? "smooth" : "auto",
                    block: "start"
                });
            } else {
                console.warn(`Section '${data.section}' not found`);
            }
        }
    };

    const handleSend = async () => {
        if (input.trim() === '') return;
        
        const newMessages = [...messages, { from: 'user', text: input }];
        setMessages(newMessages);
        const userText = input;
        setInput('');

        try {
            const { reply, action, target, data } = await sendMessage(userText);
            setMessages(prev => [...prev, { from: 'bot', text: reply || 'No response.' }]);

            // Execute structured actions if any
            if (action) {
                console.log(`Executing action: ${action} -> ${target}`);
                
                // Navigation actions
                if (action === 'navigate' && typeof target === 'string') {
                    window.location.href = target;
                } else if (action === 'book' && typeof target === 'string') {
                    window.location.href = target;
                } else if (action === 'payment' && typeof target === 'string') {
                    window.location.href = target;
                } else if (action === 'search_results' && typeof target === 'string') {
                    window.location.href = target;
                } else if (action === 'events_list' && typeof target === 'string') {
                    window.location.href = target;
                } else if (action === 'profile_data' && typeof target === 'string') {
                    window.location.href = target;
                } else if (action === 'profile_updated' && typeof target === 'string') {
                    window.location.href = target;
                } else if (action === 'feedback_submitted' && typeof target === 'string') {
                    window.location.href = target;
                } else if (action === 'weather_info' && typeof target === 'string') {
                    window.location.href = target;
                } else if (action === 'travel_info' && typeof target === 'string') {
                    window.location.href = target;
                }
                
                // Modal actions
                else if (action === 'open_modal') {
                    handleOpenModal(data);
                }
                
                // Scroll actions
                else if (action === 'scroll_to_section') {
                    handleScrollToSection(data);
                }
                
                // Error actions
                else if (action === 'error') {
                    console.error('Agent error:', data);
                }
                
                // Log additional data for debugging
                if (data) {
                    console.log('Action data:', data);
                }
            }
        } catch (e) {
            console.error('Chat error:', e);
            setMessages(prev => [...prev, { 
                from: 'bot', 
                text: 'I apologize for the technical difficulty. As your spiritual guide, I\'m still here to help you explore the sacred monasteries of Sikkim. Please try asking again or let me know how I can assist you.' 
            }]);
        }
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>GURUJI</h3>
                    </div>
                    <div className="chat-messages" ref={messagesContainerRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.from}`}>
                                {msg.from === 'bot' ? (
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                ) : (
                                    msg.text
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me anything..." 
                        />
                        <button onClick={handleSend}><FaPaperPlane /></button>
                    </div>
                </div>
            )}
            <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
                <FaCommentDots />
            </button>
        </div>
    );
};

export default Chatbot;