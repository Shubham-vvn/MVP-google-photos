/**
 * Google Photos — AI Memory Context MVP
 * Client Application Logic & Multimodal Retrieval
 */

// ==========================================
// SCENARIOS & INITIAL SEED DATA
// ==========================================
const SCENARIOS = {
  delhi_cafe: {
    id: 'cluster_delhi_001',
    title: 'Afternoon in Connaught Place',
    dateText: 'Today, 2:30 PM',
    location: 'Connaught Place, New Delhi',
    subtitle: 'Today you captured 10 photos & 3 videos. Add a little context while it\'s fresh so you can easily find these moments later.',
    itemCount: '+11',
    metaTags: ['📍 Delhi', '🕒 Today, 2:30 PM', '👥 2 People'],
    sampleText: 'I met my friend Ramesh at a café in Delhi after two years. We talked about our childhood, had chocolate cake, and later walked towards Rajiv Chowk.',
    quickPills: [
      '☕ "Met Ramesh at café in Delhi after 2 years. Cake & Rajiv Chowk walk."',
      '🍰 "Childhood catch-up over chocolate cake with old friend Ramesh."'
    ],
    coverImg: 'assets/delhi_cafe_friends.jpg',
    secImg: 'assets/cafe_chocolate_cake.jpg',
    photos: [
      { id: 'p1', src: 'assets/delhi_cafe_friends.jpg', caption: 'Friends laughing at café table', isVideo: false, featured: true, visualTags: ['Café interior (98%)', '2 People (96%)', 'Coffee cups (94%)'] },
      { id: 'p2', src: 'assets/cafe_chocolate_cake.jpg', caption: 'Chocolate fudge cake & latte', isVideo: false, featured: false, visualTags: ['Chocolate cake (99%)', 'Cappuccino (95%)', 'Dessert plate (92%)'] },
      { id: 'p3', src: 'assets/rajiv_chowk_walk.jpg', caption: 'Walking outside Rajiv Chowk colonnade', isVideo: false, featured: false, visualTags: ['Colonnade pillars (97%)', 'Sunny street (95%)', 'Outdoor walk (91%)'] },
      { id: 'p4', src: 'assets/delhi_cafe_friends.jpg', caption: 'Coffee discussion video', isVideo: true, videoDuration: '0:42', featured: false, visualTags: ['Conversation (92%)', 'Indoor café (90%)'] },
      { id: 'p5', src: 'assets/rajiv_chowk_walk.jpg', caption: 'Rajiv Chowk metro exterior', isVideo: false, featured: false, visualTags: ['Metro station (88%)', 'New Delhi (85%)'] },
      { id: 'p6', src: 'assets/cafe_chocolate_cake.jpg', caption: 'Sharing cake slice', isVideo: false, featured: false, visualTags: ['Dessert (94%)', 'Table (89%)'] }
    ],
    summary: 'Meeting Ramesh at a Delhi café — old friends, childhood memories, cake, and walking to Rajiv Chowk.',
    userConcepts: ['Ramesh', 'Delhi café', 'Met after 2 years', 'Childhood memories', 'Chocolate cake', 'Sunny afternoon', 'Rajiv Chowk walk'],
    visualConcepts: ['Café interior (98%)', 'Chocolate cake (96%)', 'Georgian colonnade (94%)', '2 people outdoors (92%)', 'Metro entrance (89%)'],
    metaConcepts: ['Oct 14, 2026', 'Connaught Place', '10 Photos, 3 Videos', 'Pixel 9 Pro'],
    mediaCountStr: '10 photos & 3 videos',
    fadedMemory: {
      thought: '“Catching up with Ramesh at that Connaught Place cafe after two years talking about childhood memories and eating chocolate cake.”',
      query: 'reunion with Ramesh at Delhi cafe eating chocolate truffle cake',
      standardResult: 'Standard Google Photos search found 0 results for "Ramesh" or "reunion". Standard vision models only tag generic pixels like "table" and "indoor cafe". It has no record of who Ramesh was or that you met after 2 years.',
      aiMatchPills: ['👥 Ramesh Reunion', '☕ Delhi Café', '🍰 Chocolate Cake', '🚶 Rajiv Chowk Walk', '✨ 99% Match']
    }
  },

  goa_beach: {
    id: 'cluster_goa_004',
    title: 'Goa Beach Getaway with Friends',
    dateText: 'Saturday, 5:45 PM',
    location: 'Anjuna Beach, North Goa',
    subtitle: 'You captured 18 camera photos & 4 videos at sunset. Add your memory context so you can relive this beach trip anytime.',
    itemCount: '+20',
    metaTags: ['📍 Goa', '🕒 Saturday, Sunset', '👥 4 Friends', '🌊 Beach & Waves'],
    sampleText: 'Trip to Goa with Priya, Arjun, Sneha, and Rohan. We ran into the sunset waves at Anjuna beach, rented scooters, and later had grilled fish and fresh coconuts at a beach shack under fairy lights.',
    quickPills: [
      '🏖️ "Goa trip with Priya, Arjun, Sneha & Rohan. Sunset waves and beach shack dinner."',
      '🥥 "Anjuna beach sunset waves, grilled seafood under fairy lights with college gang."'
    ],
    coverImg: 'assets/goa_beach_friends.jpg',
    secImg: 'assets/goa_beach_shack.jpg',
    photos: [
      { id: 'g1', src: 'assets/goa_beach_friends.jpg', caption: 'Friends laughing and walking along beach waves at golden sunset', isVideo: false, featured: true, visualTags: ['Sunset beach waves (99%)', '4 Friends (98%)', 'Golden hour (96%)', 'Arabian sea (95%)'] },
      { id: 'g2', src: 'assets/goa_beach_shack.jpg', caption: 'Dinner at wooden beach shack under warm fairy lights and candles', isVideo: false, featured: false, visualTags: ['Beach shack (98%)', 'Candlelight (96%)', 'Grilled seafood (94%)', 'Fresh coconuts (92%)'] },
      { id: 'g3', src: 'assets/goa_beach_friends.jpg', caption: 'Slow-motion 4K sunset ocean waves crashing on shore', isVideo: true, videoDuration: '0:48', featured: false, visualTags: ['Ocean waves slow-mo (97%)', 'Golden sky (95%)', 'Surf spray (93%)'] },
      { id: 'g4', src: 'assets/goa_beach_shack.jpg', caption: 'Acoustic guitar singing session around beach table', isVideo: true, videoDuration: '1:24', featured: false, visualTags: ['Friends laughing (95%)', 'Acoustic guitar (93%)', 'Night beach (91%)'] },
      { id: 'g5', src: 'assets/goa_beach_friends.jpg', caption: 'Sunset silhouettes jumping together in the surf', isVideo: false, featured: false, visualTags: ['Silhouettes (96%)', 'Sunset glow (94%)', 'Sea splash (92%)'] },
      { id: 'g6', src: 'assets/goa_beach_shack.jpg', caption: 'Toasting fresh tender coconuts under palm thatched roof', isVideo: false, featured: false, visualTags: ['Coconut toast (95%)', 'Fairy lights (93%)'] }
    ],
    summary: 'Goa beach getaway with college friends Priya, Arjun, Sneha, and Rohan — golden hour sunset waves at Anjuna and candlelit shack dinner.',
    userConcepts: ['Goa beach trip', 'Priya', 'Arjun', 'Sneha', 'Rohan', 'Sunset waves', 'Anjuna beach', 'Beach shack dinner', 'Fresh coconuts', 'College reunion'],
    visualConcepts: ['Sunset beach waves (99%)', '4 Friends (98%)', 'Beach shack (98%)', 'Candlelight dinner (96%)', 'Ocean surf (94%)'],
    metaConcepts: ['Saturday, 5:45 PM', 'Anjuna Beach, Goa', '18 Photos, 4 Videos', 'Pixel 9 Pro'],
    mediaCountStr: '18 photos & 4 videos',
    fadedMemory: {
      thought: '“What was that wooden beach shack where Priya and Arjun ordered spicy butter garlic prawns with Rahul watching sunset waves?”',
      query: 'that beach shack with spicy prawns and Rahul watching waves',
      standardResult: 'Standard Google Photos search found 0 results for "Rahul", "prawns", or "shack". Standard vision models only tag generic items like "sand", "water", "sky". It has zero record of who was there or what you ate.',
      aiMatchPills: ['📍 Anjuna Shack', '👥 Rahul & Priya', '🍤 Spicy Prawns Dinner', '🌊 Sunset Waves', '✨ 98% Match']
    }
  },

  mom_birthday: {
    id: 'cluster_birthday_005',
    title: 'Mom\'s 60th Birthday Celebration',
    dateText: 'Sunday, 1:15 PM',
    location: 'Indiranagar, Bangalore',
    subtitle: 'You captured 16 photos & 3 videos of the family celebration. What made this special milestone memorable?',
    itemCount: '+17',
    metaTags: ['📍 Bangalore', '🕒 Sunday, 1:15 PM', '🎂 Milestone', '👨‍👩‍👧‍👦 3 Generations'],
    sampleText: 'Celebrated Mom\'s 60th birthday with the whole family in Bangalore! Dad, Ananya, and the little grandkids surprised her with a mango cream cake and traditional marigold garlands. Everyone wore festive silk kurtas.',
    quickPills: [
      '🎂 "Mom\'s 60th surprise birthday with Dad, Ananya & grandkids, mango cake & marigolds."',
      '💛 "Family milestone celebration for Mom turning 60 with silk sarees & cake cutting."'
    ],
    coverImg: 'assets/mom_birthday_family.jpg',
    secImg: 'assets/cafe_chocolate_cake.jpg',
    photos: [
      { id: 'm1', src: 'assets/mom_birthday_family.jpg', caption: 'Three generations gathered around Mom cutting her 60th birthday cake', isVideo: false, featured: true, visualTags: ['Family celebration (99%)', 'Birthday cake (98%)', 'Marigold garland (96%)', 'Silk saree (94%)'] },
      { id: 'm2', src: 'assets/cafe_chocolate_cake.jpg', caption: 'Close-up of birthday cake with 60 candles and flowers', isVideo: false, featured: false, visualTags: ['Birthday cake (99%)', 'Candles (97%)', 'Celebration dessert (94%)'] },
      { id: 'm3', src: 'assets/mom_birthday_family.jpg', caption: 'Grandkids singing Happy Birthday Dadi clapping in joy', isVideo: true, videoDuration: '0:38', featured: false, visualTags: ['Kids singing (96%)', 'Family clapping (95%)', 'Indoor lighting (92%)'] },
      { id: 'm4', src: 'assets/mom_birthday_family.jpg', caption: 'Dad placing yellow flower garland on Mom\'s shoulders', isVideo: false, featured: false, visualTags: ['Couple portrait (96%)', 'Floral garland (94%)', 'Festive emotion (93%)'] },
      { id: 'm5', src: 'assets/mom_birthday_family.jpg', caption: 'Mom giving emotional thank you speech to family', isVideo: true, videoDuration: '1:12', featured: false, visualTags: ['Speech video (93%)', 'Living room (91%)'] },
      { id: 'm6', src: 'assets/mom_birthday_family.jpg', caption: 'Family group portrait with 3 generations smiling together', isVideo: false, featured: false, visualTags: ['Group portrait (98%)', 'Indian festive wear (96%)'] }
    ],
    summary: 'Mom\'s 60th birthday in Bangalore — surprise family party with Dad, Ananya, grandkids, marigold garlands, and birthday cake.',
    userConcepts: ['Mom\'s 60th birthday', 'Sunita', 'Dad', 'Ananya', 'Grandkids', 'Family celebration', 'Mango cake', 'Marigold garlands', 'Bangalore house'],
    visualConcepts: ['Family celebration (99%)', 'Birthday cake (98%)', 'Marigold garland (96%)', '3 generations (95%)', 'Festive silk wear (93%)'],
    metaConcepts: ['Sunday, 1:15 PM', 'Indiranagar, Bangalore', '16 Photos, 3 Videos', 'Pixel 9 Pro'],
    mediaCountStr: '16 photos & 3 videos',
    fadedMemory: {
      thought: '“Mom laughing when she couldn\'t blow out all the candles on her 60th birthday mango cream cake with the grandkids.”',
      query: 'mom laughing when she couldn\'t blow out the candles at 60th birthday',
      standardResult: 'Standard search matches generic "cake" or "candle" across hundreds of unrelated events, but has zero knowledge of Mom\'s 60th milestone or who was laughing.',
      aiMatchPills: ['🎂 Mom\'s 60th Birthday', '👨‍👩‍👧‍👦 3 Generations', '🥭 Mango Cream Cake', '💛 Marigold Garlands', '✨ 99% Match']
    }
  },

  himalaya_roadtrip: {
    id: 'cluster_himalaya_006',
    title: 'Himalayan Mountain Pass with Rocky',
    dateText: 'Sept 20, 2026',
    location: 'Rohtang Pass, Himachal Pradesh',
    subtitle: 'You captured 22 camera photos & 5 videos on this mountain pass. Preserve the story behind this epic adventure.',
    itemCount: '+24',
    metaTags: ['📍 Himalayas', '🕒 Sept 20', '🐕 Rocky Dog', '🚙 4x4 Road Trip'],
    sampleText: 'Epic road trip through the Himalayas with Kabir, Zara, and our golden retriever Rocky! We took the 4x4 SUV up Rohtang Pass at 13,000 feet, Rocky saw fresh mountain snow for the first time, and we drank hot masala chai.',
    quickPills: [
      '🏔️ "Himalayan road trip with Kabir, Zara & Rocky the dog up Rohtang Pass at 13,000ft."',
      '🐕 "Rocky\'s first snow on Rohtang pass, 4x4 SUV road trip and hot masala chai."'
    ],
    coverImg: 'assets/himalaya_roadtrip.jpg',
    secImg: 'assets/lake_tahoe_hike.jpg',
    photos: [
      { id: 'h1', src: 'assets/himalaya_roadtrip.jpg', caption: 'Kabir, Zara, and golden retriever Rocky standing beside 4x4 SUV overlooking Himalayan pass', isVideo: false, featured: true, visualTags: ['Mountain pass (99%)', 'Golden retriever Rocky (98%)', '4x4 SUV (97%)', 'Snow peaks (96%)'] },
      { id: 'h2', src: 'assets/lake_tahoe_hike.jpg', caption: 'High-altitude mountain ridgeline and valley winding road', isVideo: false, featured: false, visualTags: ['Alpine mountains (98%)', 'Winding pass (95%)', 'Pristine sky (93%)'] },
      { id: 'h3', src: 'assets/himalaya_roadtrip.jpg', caption: 'Rocky bounding and playing excitedly in alpine snow patch', isVideo: true, videoDuration: '0:54', featured: false, visualTags: ['Dog in snow (99%)', 'Playful motion (96%)', 'Mountain backdrop (94%)'] },
      { id: 'h4', src: 'assets/himalaya_roadtrip.jpg', caption: 'Roadside dhaba steaming masala chai and hot snacks at 13,000 feet', isVideo: false, featured: false, visualTags: ['Steaming chai (95%)', 'Roadside dhaba (93%)'] },
      { id: 'h5', src: 'assets/lake_tahoe_hike.jpg', caption: 'Drone 4K aerial skimming high alpine mountain peaks and switchbacks', isVideo: true, videoDuration: '1:45', featured: false, visualTags: ['Drone video (97%)', 'Glacier peaks (95%)'] },
      { id: 'h6', src: 'assets/himalaya_roadtrip.jpg', caption: 'Rocky with his head out the SUV window enjoying mountain breeze', isVideo: false, featured: false, visualTags: ['Happy dog (97%)', 'Car window (93%)'] }
    ],
    summary: 'Himalayan road trip with Kabir, Zara, and golden retriever Rocky — climbing Rohtang Pass at 13,000ft in 4x4 SUV, Rocky\'s first snow, and hot chai.',
    userConcepts: ['Himalayan road trip', 'Kabir', 'Zara', 'Rocky the dog', 'Golden retriever', 'Rohtang Pass', '13,000 feet', 'Mountain snow', '4x4 SUV', 'Masala chai'],
    visualConcepts: ['Mountain pass (99%)', 'Golden retriever dog (98%)', '4x4 SUV vehicle (97%)', 'Snow peaks (96%)', 'Alpine valley (94%)'],
    metaConcepts: ['Sept 20, 2026', 'Rohtang Pass (13,050 ft)', '22 Photos, 5 Videos', 'Pixel 9 Pro'],
    mediaCountStr: '22 photos & 5 videos',
    fadedMemory: {
      thought: '“That road trip up the mountain pass where Rocky our golden retriever saw snow for the first time and we had hot masala chai at 13,000 feet.”',
      query: 'mountain roadtrip where Rocky the dog was barking at snow sheep',
      standardResult: 'Standard search tags generic "mountain", "snow", "vehicle". It cannot identify "Rocky the dog", Kabir, Zara, or the 13,000ft pass.',
      aiMatchPills: ['🐕 Rocky the Dog', '🏔️ Rohtang Pass (13,000ft)', '🚙 4x4 Road Trip', '☕ Masala Chai', '✨ 98% Match']
    }
  },

  diwali_celebration: {
    id: 'cluster_diwali_007',
    title: 'Diwali Lights & Sparklers on Terrace',
    dateText: 'Nov 1, 2026',
    location: 'South Delhi Rooftop',
    subtitle: 'You captured 15 camera photos & 4 videos of Diwali festivities. Add your family memory note to cherish this evening.',
    itemCount: '+17',
    metaTags: ['📍 Delhi', '🕒 Diwali Night', '🪔 Diyas & Sparklers', '✨ Festive Kurtas'],
    sampleText: 'Diwali celebration on the terrace with Pooja, Vikram, and the kids. We lit dozens of clay diyas, spun golden sparklers (phuljhadi), dressed up in yellow and blue festive kurtas, and shared homemade sweets.',
    quickPills: [
      '🪔 "Diwali night with cousins on balcony: sparklers, glowing diyas & festive kurtas."',
      '✨ "Lighting phuljhadi sparklers and diyas with family for Diwali celebration."'
    ],
    coverImg: 'assets/diwali_sparklers_family.jpg',
    secImg: 'assets/cafe_chocolate_cake.jpg',
    photos: [
      { id: 'd1', src: 'assets/diwali_sparklers_family.jpg', caption: 'Family and cousins laughing together on balcony holding sparkling sparklers at night', isVideo: false, featured: true, visualTags: ['Diwali sparklers (99%)', 'Festive kurtas (98%)', 'Clay diyas (96%)', 'Balcony lights (95%)'] },
      { id: 'd2', src: 'assets/diwali_sparklers_family.jpg', caption: 'Slow-motion video of golden sparks spinning and kids cheering in delight', isVideo: true, videoDuration: '0:32', featured: false, visualTags: ['Golden sparks (98%)', 'Children smiling (96%)', 'Night celebration (94%)'] },
      { id: 'd3', src: 'assets/cafe_chocolate_cake.jpg', caption: 'Festive platter of freshly prepared Diwali sweets and dry fruits', isVideo: false, featured: false, visualTags: ['Festive sweets (95%)', 'Traditional treats (92%)'] },
      { id: 'd4', src: 'assets/diwali_sparklers_family.jpg', caption: 'Terracotta diyas arranged along decorative floral garland railing', isVideo: false, featured: false, visualTags: ['Terracotta diya (97%)', 'Marigold garland (94%)'] },
      { id: 'd5', src: 'assets/diwali_sparklers_family.jpg', caption: 'Full terrace panoramic video with fairy lights overlooking illuminated city skyline', isVideo: true, videoDuration: '0:55', featured: false, visualTags: ['City illumination (95%)', 'Fairy lights (94%)'] },
      { id: 'd6', src: 'assets/diwali_sparklers_family.jpg', caption: 'Brother and sister candid selfie with glowing sparkler reflections', isVideo: false, featured: false, visualTags: ['Siblings selfie (96%)', 'Festive attire (94%)'] }
    ],
    summary: 'Diwali festival of lights on the terrace with Vikram, Pooja, and kids — glowing clay diyas, handheld sparklers, festive kurtas, and sweets.',
    userConcepts: ['Diwali celebration', 'Pooja', 'Vikram', 'Terrace at night', 'Sparklers', 'Phuljhadi', 'Clay diyas', 'Festive kurtas', 'Diwali sweets', 'Family festive'],
    visualConcepts: ['Diwali sparklers (99%)', 'Festive kurtas (98%)', 'Clay diyas (96%)', 'Balcony fairy lights (95%)', 'Night lights (93%)'],
    metaConcepts: ['Nov 1, 2026, 8:45 PM', 'South Delhi', '15 Photos, 4 Videos', 'Pixel 9 Pro'],
    mediaCountStr: '15 photos & 4 videos',
    fadedMemory: {
      thought: '“That Diwali evening on the terrace where everyone wore festive yellow kurtas, lit clay diyas, and spun golden sparklers.”',
      query: 'terrace diwali night when grandma was holding sparklers and diyas',
      standardResult: 'Standard search tags generic "firework" and "night". It has no memory of family members, festive kurtas, or the terrace setting.',
      aiMatchPills: ['🪔 Clay Diyas', '✨ Golden Sparklers', '👕 Festive Kurtas', '👥 Vikram & Pooja', '✨ 97% Match']
    }
  },

  cycling_morning: {
    id: 'cluster_cycling_008',
    title: 'Morning Cycling Ride at Cubbon Park',
    dateText: 'Sunday, 6:45 AM',
    location: 'Cubbon Park, Bangalore',
    subtitle: 'You captured 12 camera photos & 2 videos during your weekend morning ride. Add context to organize your fitness memories.',
    itemCount: '+12',
    metaTags: ['📍 Bangalore', '🕒 Sunday, 6:45 AM', '🚴 30km Cycling', '👥 3 Friends'],
    sampleText: 'Early morning 30km cycling ride with Amit and Neha through Cubbon Park. Soft morning sunbeams through giant banyan trees, crisp cool air, and we finished with hot filter coffee and idlis.',
    quickPills: [
      '🚴 "Sunday 30km cycling ride with Amit & Neha in Cubbon park, sunbeams & filter coffee."',
      '☕ "Cubbon park morning cycle selfie under banyan trees followed by Brahmin\'s coffee."'
    ],
    coverImg: 'assets/cycling_park_friends.jpg',
    secImg: 'assets/lake_tahoe_hike.jpg',
    photos: [
      { id: 'c1', src: 'assets/cycling_park_friends.jpg', caption: 'Amit, Neha and me taking selfie break with bicycles under giant banyan tree in morning sunbeams', isVideo: false, featured: true, visualTags: ['Cyclists selfie (99%)', 'Road bikes (98%)', 'Sunbeams through trees (97%)', 'Helmets & jerseys (96%)'] },
      { id: 'c2', src: 'assets/cycling_park_friends.jpg', caption: 'Video of our cycling peloton gliding along empty tree-lined park boulevard', isVideo: true, videoDuration: '1:04', featured: false, visualTags: ['Cycling peloton (96%)', 'Morning mist (94%)', 'Green park trail (93%)'] },
      { id: 'c3', src: 'assets/cycling_park_friends.jpg', caption: 'Bicycles resting against lush ivy wall during water hydration break', isVideo: false, featured: false, visualTags: ['Bicycles (97%)', 'Lush foliage (94%)'] },
      { id: 'c4', src: 'assets/delhi_cafe_friends.jpg', caption: 'Post-ride breakfast table with hot South Indian filter coffee glasses and steaming idlis', isVideo: false, featured: false, visualTags: ['Filter coffee (95%)', 'Breakfast table (93%)'] },
      { id: 'c5', src: 'assets/cycling_park_friends.jpg', caption: 'Video of fast final sprint down the avenue cheering each other on', isVideo: true, videoDuration: '0:42', featured: false, visualTags: ['Sprint finish (94%)', 'Morning sunlight (93%)'] },
      { id: 'c6', src: 'assets/cycling_park_friends.jpg', caption: 'Strava 30km ride route map and elevation stats on phone', isVideo: false, featured: false, visualTags: ['Fitness tracker (94%)', 'Cycling stats (91%)'] }
    ],
    summary: 'Sunday 30km morning cycle ride through Cubbon Park with Amit and Neha — morning sunbeams under banyans, sprint video, and filter coffee.',
    userConcepts: ['Morning cycling', 'Amit', 'Neha', 'Cubbon Park', 'Bangalore ride', '30km fitness', 'Banyan trees', 'Sunbeams', 'Filter coffee', 'Road bikes'],
    visualConcepts: ['Cyclists selfie (99%)', 'Road bikes (98%)', 'Sunbeams in park (97%)', 'Cycling jerseys (96%)', 'Lush greenery (94%)'],
    metaConcepts: ['Sunday, 6:45 AM', 'Cubbon Park, Bangalore', '12 Photos, 2 Videos', 'Pixel 9 Pro'],
    mediaCountStr: '12 photos & 2 videos',
    fadedMemory: {
      thought: '“That early morning 30km bicycle ride through Cubbon park with Amit and Neha under giant banyan trees followed by filter coffee.”',
      query: 'early morning cycling ride at Cubbon park drinking tender coconut',
      standardResult: 'Standard vision tags "bicycle" and "tree". It cannot differentiate this 30km morning sprint with Amit and Neha from any other bike ride.',
      aiMatchPills: ['🚴 Cubbon Park 30km', '👥 Amit & Neha', '🌳 Banyan Sunbeams', '☕ Filter Coffee', '✨ 96% Match']
    }
  },

  lake_tahoe: {
    id: 'cluster_tahoe_003',
    title: 'Emerald Bay Hiking Trip',
    dateText: 'July 15, 2026',
    location: 'Lake Tahoe, California',
    subtitle: 'You took 24 photos and 2 videos on this mountain hike. Add a memory note to search for this trip naturally later.',
    itemCount: '+22',
    metaTags: ['📍 Lake Tahoe', '🕒 July 15', '🌲 Hiking', '👥 Maya'],
    sampleText: 'Hiking to Emerald Bay with Maya. We caught the golden hour sunset and celebrated with campfire cheesecake.',
    quickPills: [
      '🏔️ "Hiking to Emerald Bay with Maya, golden hour sunset & campfire cheesecake."',
      '🏕️ "Tahoe mountain trail hike with Maya celebrating summer vacation."'
    ],
    coverImg: 'assets/lake_tahoe_hike.jpg',
    secImg: 'assets/cafe_chocolate_cake.jpg',
    photos: [
      { id: 't1', src: 'assets/lake_tahoe_hike.jpg', caption: 'Overlooking Emerald Bay turquoise water', isVideo: false, featured: true, visualTags: ['Turquoise bay (98%)', 'Pine forest (97%)', 'Hiking trail (94%)'] },
      { id: 't2', src: 'assets/cafe_chocolate_cake.jpg', caption: 'Blueberry cheesecake dessert by campfire', isVideo: false, featured: false, visualTags: ['Dessert cheesecake (96%)', 'Ceramic plate (91%)'] },
      { id: 't3', src: 'assets/lake_tahoe_hike.jpg', caption: 'Golden hour mountain ridgeline video', isVideo: true, videoDuration: '1:15', featured: false, visualTags: ['Sunset lighting (95%)', 'Mountain range (93%)'] },
      { id: 't4', src: 'assets/lake_tahoe_hike.jpg', caption: 'Granite boulders path along the lake shore', isVideo: false, featured: false, visualTags: ['Granite rocks (96%)', 'Clear lake water (94%)'] }
    ],
    summary: 'Emerald Bay summer hike in Lake Tahoe with Maya — mountain trail, golden hour sunset, and campfire cheesecake.',
    userConcepts: ['Maya', 'Emerald Bay', 'Lake Tahoe', 'Summer hike', 'Golden hour sunset', 'Campfire cheesecake'],
    visualConcepts: ['Turquoise bay (98%)', 'Pine forest (97%)', 'Hiking trail (94%)', 'Cheesecake dessert (91%)'],
    metaConcepts: ['July 15, 2026', 'Emerald Bay State Park', '24 Photos, 2 Videos'],
    mediaCountStr: '24 photos & 2 videos',
    fadedMemory: {
      thought: '“Hiking up to Emerald Bay overlooking turquoise lake water with Maya and celebrating with campfire cheesecake at sunset.”',
      query: 'emerald bay hike when Maya lost her water bottle at sunset',
      standardResult: 'Standard vision tags "lake" and "forest". It cannot connect the photo to Maya, the Emerald Bay trailhead, or campfire cheesecake.',
      aiMatchPills: ['🌲 Emerald Bay', '👥 Maya', '🍰 Campfire Cheesecake', '🌅 Golden Hour Sunset', '✨ 98% Match']
    }
  },

  laptop_research: {
    id: 'cluster_laptop_002',
    title: 'Product Research: Laptops',
    dateText: 'Yesterday, 6:15 PM',
    location: 'Saved Screenshots',
    subtitle: 'You saved 8 screenshots comparing laptops. Want to add a little context to help you find them when you\'re ready to purchase?',
    itemCount: '+6',
    metaTags: ['📱 8 Screenshots', '🕒 Yesterday', '💻 Product Research'],
    sampleText: 'Mostly screenshots of laptops and specs I was comparing before buying a new ultrabook for work.',
    quickPills: [
      '💻 "Laptop specs & benchmarks comparison before buying new ultrabook."',
      '🛒 "Work laptop research: comparing M3 vs Core Ultra battery & display."'
    ],
    coverImg: 'assets/laptop_specs_compare.jpg',
    secImg: 'assets/laptop_specs_compare.jpg',
    photos: [
      { id: 'l1', src: 'assets/laptop_specs_compare.jpg', caption: 'Dual ultrabook spec benchmark comparison', isVideo: false, featured: true, visualTags: ['Laptop screens (99%)', 'Benchmark charts (96%)', 'Tech review (94%)'] },
      { id: 'l2', src: 'assets/laptop_specs_compare.jpg', caption: 'Processor specifications table', isVideo: false, featured: false, visualTags: ['Spec table (97%)', 'Processor info (93%)'] },
      { id: 'l3', src: 'assets/laptop_specs_compare.jpg', caption: 'Price & discount checkout comparison', isVideo: false, featured: false, visualTags: ['Web store (92%)', 'Price comparison (90%)'] }
    ],
    summary: 'Laptop and ultrabook purchase research — comparing processor benchmarks, specifications, and prices for a new work device.',
    userConcepts: ['Laptop research', 'Buying new ultrabook', 'Work laptop', 'Spec comparison', 'Product reviews'],
    visualConcepts: ['Dual laptop screens (99%)', 'Benchmark charts (96%)', 'Keyboard & trackpad (93%)', 'Tech specs table (91%)'],
    metaConcepts: ['Yesterday, 6:15 PM', '8 Screenshots', 'Screen capture EXIF'],
    mediaCountStr: '8 screenshots',
    fadedMemory: {
      thought: '“Those screenshots comparing M3 vs Core Ultra laptop specs and battery benchmarks before buying a new work ultrabook.”',
      query: 'comparing OLED laptop battery benchmarks for work ultrabook',
      standardResult: 'Standard OCR search matches noisy literal characters. It has no semantic understanding of your buying decision or battery comparisons.',
      aiMatchPills: ['💻 Laptop Research', '🔋 Battery Benchmarks', '⚙️ Ultrabook Specs', '📱 Work Purchase', '✨ 95% Match']
    }
  },

  custom_user_memory: {
    id: 'cluster_custom_user',
    title: 'Your Personal Memory Moment',
    dateText: 'Just Now',
    location: 'Uploaded from Device',
    subtitle: 'Upload 1–5 personal photos and describe what happened to test AI Memory Context on your own memories.',
    itemCount: '+0',
    metaTags: ['📸 Your Photos', '✨ AI Linked', '🔒 Stored Locally'],
    sampleText: 'My personal story...',
    quickPills: [
      '📸 "Upload your own photos to experience personal memory search."'
    ],
    coverImg: 'assets/goa_beach_friends.jpg',
    secImg: 'assets/goa_beach_shack.jpg',
    photos: [
      { id: 'cp1', src: 'assets/goa_beach_friends.jpg', caption: 'Your personal moment', isVideo: false, featured: true, visualTags: ['Personal Camera Photo (99%)', 'User Memory (98%)'] }
    ],
    summary: 'Personal memory test — attach your own photos and story to experience search.',
    userConcepts: ['Personal memory', 'My photos'],
    visualConcepts: ['Personal Camera Photo (99%)', 'Real-world memory (96%)'],
    metaConcepts: ['Just Now', 'Your Device', 'Local Browser Session'],
    mediaCountStr: 'Your photos',
    fadedMemory: {
      thought: '“My personal memory moment with my own photos and story uploaded from my device.”',
      query: 'my personal memory moment',
      standardResult: 'Standard Google Photos only reads image pixels. It has no knowledge of your custom story or personal memories.',
      aiMatchPills: ['📸 Personal Memory', '✨ Instant Recall', '✨ 98% Match']
    }
  }
};

// Application State Store
class MemoryAppState {
  constructor() {
    this.currentScenarioKey = 'goa_beach';
    this.activeTab = 'tabPhotos';
    this.isRecording = false;
    this.recTimerInterval = null;
    this.recSeconds = 0;
    this.recognition = null;
    this.theme = localStorage.getItem('gp_theme') || 'light';
    this.isFrameVisible = true;
    this.searchMode = 'ai_memory'; // 'ai_memory' | 'standard'
    this.tourStep = 0;
    this.isTourActive = false;

    // Check if URL requests a reset
    if (typeof window !== 'undefined' && (window.location.search.includes('reset=true') || window.location.hash === '#reset')) {
      try {
        localStorage.removeItem('gp_saved_memories');
        localStorage.removeItem('gp_dismissed_clusters');
      } catch (e) {}
    }

    // Load saved memories from localStorage
    let saved = null;
    try {
      saved = localStorage.getItem('gp_saved_memories');
      this.savedMemories = saved ? JSON.parse(saved) : {};
    } catch (e) {
      this.savedMemories = {};
    }

    // Initial dismiss state
    this.dismissedClusters = {};
  }

  getScenario() {
    return SCENARIOS[this.currentScenarioKey];
  }

  isClusterLinked(clusterId) {
    return !!this.savedMemories[clusterId];
  }

  saveMemory(clusterId, memoryData) {
    this.savedMemories[clusterId] = memoryData;
    localStorage.setItem('gp_saved_memories', JSON.stringify(this.savedMemories));
  }

  deleteMemory(clusterId) {
    delete this.savedMemories[clusterId];
    localStorage.setItem('gp_saved_memories', JSON.stringify(this.savedMemories));
  }

  clearAllMemories() {
    this.savedMemories = {};
    localStorage.removeItem('gp_saved_memories');
  }
}

const state = new MemoryAppState();

// ==========================================
// DOM ELEMENT REFERENCES
// ==========================================
const DOM = {
  // Desktop Presenter Controls
  scenarioSelect: document.getElementById('scenarioSelect'),
  toggleFrameBtn: document.getElementById('toggleFrameBtn'),
  toggleThemeBtn: document.getElementById('toggleThemeBtn'),
  themeIcon: document.getElementById('themeIcon'),
  themeBtnText: document.getElementById('themeBtnText'),
  resetDemoBtn: document.getElementById('resetDemoBtn'),
  mobileFrame: document.getElementById('mobileFrame'),
  statusClock: document.getElementById('statusClock'),
  dynamicIsland: document.getElementById('dynamicIsland'),
  islandStatusText: document.getElementById('islandStatusText'),

  // Mobile App Top Bar & Demo Showcase Hub
  mobileScenarioSelect: document.getElementById('mobileScenarioSelect'),
  openMobileDemoHubBtn: document.getElementById('openMobileDemoHubBtn'),
  mobileDemoHubBackdrop: document.getElementById('mobileDemoHubBackdrop'),
  mobileDemoHubSheet: document.getElementById('mobileDemoHubSheet'),
  closeMobileDemoHubBtn: document.getElementById('closeMobileDemoHubBtn'),
  hubStartTourBtn: document.getElementById('hubStartTourBtn'),
  hubOpenTimeMachineBtn: document.getElementById('hubOpenTimeMachineBtn'),
  hubOpenCustomUploadBtn: document.getElementById('hubOpenCustomUploadBtn'),
  hubOpenExplainerBtn: document.getElementById('hubOpenExplainerBtn'),
  hubToggleThemeBtn: document.getElementById('hubToggleThemeBtn'),
  hubResetDemoBtn: document.getElementById('hubResetDemoBtn'),

  // Header & Navigation
  headerSearchBtn: document.getElementById('headerSearchBtn'),
  headerNotifBtn: document.getElementById('headerNotifBtn'),
  headerNotifPip: document.getElementById('headerNotifPip'),
  navButtons: document.querySelectorAll('.nav-item'),
  tabViews: document.querySelectorAll('.tab-view'),

  // Timeline / Prompt Card
  storyPromptTrigger: document.getElementById('storyPromptTrigger'),
  storyThumbImg: document.getElementById('storyThumbImg'),
  storyCaptionText: document.getElementById('storyCaptionText'),
  memoryPromptCard: document.getElementById('memoryPromptCard'),
  promptTitleText: document.getElementById('promptTitleText'),
  promptSubtitleText: document.getElementById('promptSubtitleText'),
  promptCoverImg: document.getElementById('promptCoverImg'),
  promptSecImg: document.getElementById('promptSecImg'),
  promptItemCount: document.getElementById('promptItemCount'),
  promptMetaRow: document.getElementById('promptMetaRow'),
  speakMemoryBtn: document.getElementById('speakMemoryBtn'),
  addMemoryBtn: document.getElementById('addMemoryBtn'),
  promptDismissBtn: document.getElementById('promptDismissBtn'),
  notNowBtn: document.getElementById('notNowBtn'),
  dontAskBtn: document.getElementById('dontAskBtn'),

  // Memory Linked Cluster Banner
  memorySavedBanner: document.getElementById('memorySavedBanner'),
  bannerStoryText: document.getElementById('bannerStoryText'),
  bannerChipsStrip: document.getElementById('bannerChipsStrip'),
  bannerEditBtn: document.getElementById('bannerEditBtn'),
  bannerTimeMachineBtn: document.getElementById('bannerTimeMachineBtn'),

  // Photo Stream Grid
  timelineSectionTitle: document.getElementById('timelineSectionTitle'),
  timelineSectionLocation: document.getElementById('timelineSectionLocation'),
  mainPhotoGrid: document.getElementById('mainPhotoGrid'),

  // Memories Tab
  memoriesList: document.getElementById('memoriesList'),

  // Search Tab
  memorySearchInput: document.getElementById('memorySearchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  searchMicBtn: document.getElementById('searchMicBtn'),
  searchChipsWrap: document.getElementById('searchChipsWrap'),
  searchMatchCard: document.getElementById('searchMatchCard'),
  matchMemoryTitle: document.getElementById('matchMemoryTitle'),
  matchMemorySummary: document.getElementById('matchMemorySummary'),
  matchScoreBadge: document.getElementById('matchScoreBadge'),
  matchedChipsWrap: document.getElementById('matchedChipsWrap'),
  searchGridWrap: document.getElementById('searchGridWrap'),
  searchResultsGrid: document.getElementById('searchResultsGrid'),
  searchEmptyState: document.getElementById('searchEmptyState'),

  // Settings Tab
  settingSmartPrompts: document.getElementById('settingSmartPrompts'),
  settingVoiceInput: document.getElementById('settingVoiceInput'),
  frequencyButtons: document.querySelectorAll('#frequencyGroup .radio-pill'),
  exportDataBtn: document.getElementById('exportDataBtn'),
  deleteAllMemoriesBtn: document.getElementById('deleteAllMemoriesBtn'),

  // Memory Input Bottom Sheet Modal
  inputSheetBackdrop: document.getElementById('inputSheetBackdrop'),
  memoryInputSheet: document.getElementById('memoryInputSheet'),
  sheetCloseBtn: document.getElementById('sheetCloseBtn'),
  sheetSubmitBtn: document.getElementById('sheetSubmitBtn'),
  sheetPromptTitle: document.getElementById('sheetPromptTitle'),
  sheetClusterRibbon: document.getElementById('sheetClusterRibbon'),
  autofillPills: document.getElementById('autofillPills'),
  memoryTextInput: document.getElementById('memoryTextInput'),
  charCount: document.getElementById('charCount'),
  voiceDictationCard: document.getElementById('voiceDictationCard'),
  recIndicator: document.getElementById('recIndicator'),
  recTimer: document.getElementById('recTimer'),
  voiceStatusText: document.getElementById('voiceStatusText'),
  bigMicBtn: document.getElementById('bigMicBtn'),
  liveChipsRow: document.getElementById('liveChipsRow'),
  sheetCancelBtn: document.getElementById('sheetCancelBtn'),
  sheetProcessBtn: document.getElementById('sheetProcessBtn'),

  // Confirmation & Review Modal
  reviewModalBackdrop: document.getElementById('reviewModalBackdrop'),
  reviewModal: document.getElementById('reviewModal'),
  reviewSummaryContent: document.getElementById('reviewSummaryContent'),
  reviewUserChips: document.getElementById('reviewUserChips'),
  reviewVisualChips: document.getElementById('reviewVisualChips'),
  reviewMetaChips: document.getElementById('reviewMetaChips'),
  reviewMediaCount: document.getElementById('reviewMediaCount'),
  reviewEditBtn: document.getElementById('reviewEditBtn'),
  reviewSaveConfirmBtn: document.getElementById('reviewSaveConfirmBtn'),

  // Lightbox Modal
  photoLightbox: document.getElementById('photoLightbox'),
  lightboxCloseBtn: document.getElementById('lightboxCloseBtn'),
  lightboxImg: document.getElementById('lightboxImg'),
  lightboxStory: document.getElementById('lightboxStory'),
  lightboxTags: document.getElementById('lightboxTags'),
  lightboxRelevanceBadge: document.getElementById('lightboxRelevanceBadge'),

  // Toast
  appToast: document.getElementById('appToast'),
  toastMessage: document.getElementById('toastMessage'),
  toastUndoBtn: document.getElementById('toastUndoBtn'),

  // Explainer & Presenter Controls
  openExplainerBtn: document.getElementById('openExplainerBtn'),
  startInteractiveTourBtn: document.getElementById('startInteractiveTourBtn'),
  explainerModalBackdrop: document.getElementById('explainerModalBackdrop'),
  explainerModal: document.getElementById('explainerModal'),
  closeExplainerBtn: document.getElementById('closeExplainerBtn'),
  explainerCloseActionBtn: document.getElementById('explainerCloseActionBtn'),
  explainerTourActionBtn: document.getElementById('explainerTourActionBtn'),

  // In-Feed Feature Spotlight
  featureSpotlightCard: document.getElementById('featureSpotlightCard'),
  spotlightTourBtn: document.getElementById('spotlightTourBtn'),
  spotlightWhyBtn: document.getElementById('spotlightWhyBtn'),
  dismissSpotlightBtn: document.getElementById('dismissSpotlightBtn'),

  // Search Mode Switcher & Comparison
  searchModeToggle: document.getElementById('searchModeToggle'),
  modeAiMemoryBtn: document.getElementById('modeAiMemoryBtn'),
  modeStandardBtn: document.getElementById('modeStandardBtn'),
  standardSearchCard: document.getElementById('standardSearchCard'),
  standardSearchDetails: document.getElementById('standardSearchDetails'),
  switchToAiSearchBtn: document.getElementById('switchToAiSearchBtn'),

  // Guided Tour Widget
  tourGuideWidget: document.getElementById('tourGuideWidget'),
  tourStepBadge: document.getElementById('tourStepBadge'),
  tourTitle: document.getElementById('tourTitle'),
  tourDesc: document.getElementById('tourDesc'),
  tourPrevBtn: document.getElementById('tourPrevBtn'),
  tourNextBtn: document.getElementById('tourNextBtn'),
  tourCloseBtn: document.getElementById('tourCloseBtn'),

  // Custom User Photos Upload Modal
  openCustomUploadBtn: document.getElementById('openCustomUploadBtn'),
  spotlightCustomBtn: document.getElementById('spotlightCustomBtn'),
  customUploadBackdrop: document.getElementById('customUploadBackdrop'),
  customUploadModal: document.getElementById('customUploadModal'),
  closeCustomUploadBtn: document.getElementById('closeCustomUploadBtn'),
  cancelCustomUploadBtn: document.getElementById('cancelCustomUploadBtn'),
  submitCustomMemoryBtn: document.getElementById('submitCustomMemoryBtn'),
  uploadDropzone: document.getElementById('uploadDropzone'),
  customFileInput: document.getElementById('customFileInput'),
  browsePhotosBtn: document.getElementById('browsePhotosBtn'),
  dropzonePrompt: document.getElementById('dropzonePrompt'),
  uploadedPreviewsGrid: document.getElementById('uploadedPreviewsGrid'),
  customTitleInput: document.getElementById('customTitleInput'),
  customStoryInput: document.getElementById('customStoryInput'),
  customCharCount: document.getElementById('customCharCount'),
  customMicBtn: document.getElementById('customMicBtn'),
  customExtractedChips: document.getElementById('customExtractedChips'),

  // 1 Year Later Time Machine Simulation
  openTimeMachineBtn: document.getElementById('openTimeMachineBtn'),
  timeMachineModal: document.getElementById('timeMachineModal'),
  timeMachineBackdrop: document.getElementById('timeMachineBackdrop'),
  closeTimeMachineBtn: document.getElementById('closeTimeMachineBtn'),
  launchTimeMachineFromSearchBtn: document.getElementById('launchTimeMachineFromSearchBtn'),
  tmThoughtQuote: document.getElementById('tmThoughtQuote'),
  tmQueryDisplay: document.getElementById('tmQueryDisplay'),
  tmStandardDesc: document.getElementById('tmStandardDesc'),
  tmPreviewImg: document.getElementById('tmPreviewImg'),
  tmMatchScoreBadge: document.getElementById('tmMatchScoreBadge'),
  tmMemoryTitle: document.getElementById('tmMemoryTitle'),
  tmMemorySnippet: document.getElementById('tmMemorySnippet'),
  tmConceptsRow: document.getElementById('tmConceptsRow'),
  tmTestLiveBtn: document.getElementById('tmTestLiveBtn'),
  tmTryOtherScenarioBtn: document.getElementById('tmTryOtherScenarioBtn'),
  tmScenarioChips: document.getElementById('tmScenarioChips'),
  fadedQueriesScroll: document.getElementById('fadedQueriesScroll')
};

// ==========================================
// INITIALIZATION
// ==========================================
function initApp() {
  applyTheme(state.theme);
  updateLiveClock();
  setInterval(updateLiveClock, 30000);

  // Setup Web Speech API if available
  setupSpeechRecognition();

  // Render initial scenario
  renderCurrentScenario();

  // Attach All Event Listeners
  attachEventListeners();
}

// Live Status Bar Clock
function updateLiveClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  if (DOM.statusClock) DOM.statusClock.textContent = `${hours}:${minutes}`;
}

// ==========================================
// SCENARIO RENDERING
// ==========================================
function renderCurrentScenario() {
  const s = state.getScenario();
  if (DOM.scenarioSelect && DOM.scenarioSelect.value !== state.currentScenarioKey) {
    DOM.scenarioSelect.value = state.currentScenarioKey;
  }
  if (DOM.mobileScenarioSelect && DOM.mobileScenarioSelect.value !== state.currentScenarioKey) {
    DOM.mobileScenarioSelect.value = state.currentScenarioKey;
  }
  document.querySelectorAll('.demo-sc-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.scenario === state.currentScenarioKey);
  });
  const isLinked = state.isClusterLinked(s.id);
  const isDismissed = state.dismissedClusters[s.id];

  // Update Prompt Card
  DOM.promptTitleText.textContent = s.title;
  DOM.promptSubtitleText.textContent = s.subtitle;
  DOM.promptCoverImg.src = s.coverImg;
  DOM.promptCoverImg.onerror = () => { DOM.promptCoverImg.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'; };
  DOM.promptSecImg.src = s.secImg;
  DOM.promptSecImg.onerror = () => { DOM.promptSecImg.src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80'; };
  DOM.promptItemCount.textContent = s.itemCount;
  DOM.storyThumbImg.src = s.coverImg;
  DOM.storyThumbImg.onerror = () => { DOM.storyThumbImg.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'; };

  // Prompt Meta tags
  DOM.promptMetaRow.innerHTML = s.metaTags.map(tag => `<span class="meta-tag">${tag}</span>`).join('');

  // Handle Prompt Card vs Memory Linked Banner Visibility
  if (isLinked) {
    const mem = state.savedMemories[s.id] || {};
    DOM.memoryPromptCard.classList.add('hidden');
    DOM.memorySavedBanner.classList.remove('hidden');
    DOM.bannerStoryText.textContent = `"${mem.summary || mem.text || mem.story || ''}"`;
    const concepts = Array.isArray(mem.userConcepts) ? mem.userConcepts : (Array.isArray(mem.concepts) ? mem.concepts : (s.userConcepts || []));
    DOM.bannerChipsStrip.innerHTML = concepts
      .slice(0, 4)
      .map(c => `<span class="concept-chip user-type">${c}</span>`)
      .join('');
    DOM.storyCaptionText.textContent = 'Linked ✨';
    if (DOM.headerNotifPip) DOM.headerNotifPip.style.display = 'none';
  } else if (isDismissed || !DOM.settingSmartPrompts.checked) {
    DOM.memoryPromptCard.classList.add('hidden');
    DOM.memorySavedBanner.classList.add('hidden');
    DOM.storyCaptionText.textContent = 'Cluster';
  } else {
    DOM.memoryPromptCard.classList.remove('hidden');
    DOM.memorySavedBanner.classList.add('hidden');
    DOM.storyCaptionText.textContent = 'Add Context';
    if (DOM.headerNotifPip) DOM.headerNotifPip.style.display = 'block';
  }

  // Update Timeline Grid
  DOM.timelineSectionTitle.textContent = s.dateText.split(',')[0];
  DOM.timelineSectionLocation.textContent = `${s.location} • ${s.photos.length} items shown`;
  renderPhotosGrid(DOM.mainPhotoGrid, s.photos, isLinked);

  // Update Bottom Sheet Ribbon & Quick Pills
  renderSheetClusterRibbon(s.photos);
  renderAutofillPills(s.quickPills);

  // Render Memories Tab
  renderMemoriesManager();
}

// Render Photos Grid
function renderPhotosGrid(container, photos, isLinked) {
  container.innerHTML = photos.map((p, idx) => `
    <div class="photo-cell ${p.featured ? 'featured-large' : ''}" data-index="${idx}">
      <img src="${p.src}" alt="${p.caption}" class="cell-img" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80';">
      ${p.isVideo ? `<span class="cell-video-pill">▶ ${p.videoDuration}</span>` : ''}
      ${isLinked ? `<span class="cell-memory-badge">✨ Memory</span>` : ''}
    </div>
  `).join('');

  // Attach Lightbox click
  container.querySelectorAll('.photo-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const idx = parseInt(cell.getAttribute('data-index'), 10);
      openPhotoLightbox(photos[idx]);
    });
  });
}

// Render Thumbnails in Bottom Sheet
function renderSheetClusterRibbon(photos) {
  DOM.sheetClusterRibbon.innerHTML = photos.map(p => `
    <img src="${p.src}" alt="Thumb" class="sheet-ribbon-thumb" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80';">
  `).join('');
}

// Render Quick Autofill Pills in Sheet
function renderAutofillPills(pills) {
  DOM.autofillPills.innerHTML = pills.map(pill => `
    <button class="autofill-chip" data-text="${pill.replace(/^[^\s]+\s+"/, '').replace(/"$/, '')}">
      ${pill}
    </button>
  `).join('');

  DOM.autofillPills.querySelectorAll('.autofill-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-text');
      DOM.memoryTextInput.value = text;
      handleInputTextChange();
    });
  });
}

// ==========================================
// MEMORY INPUT BOTTOM SHEET LOGIC (FLOW 2)
// ==========================================
function openMemoryInputSheet(isVoiceMode = false) {
  DOM.inputSheetBackdrop.classList.remove('hidden');
  DOM.memoryInputSheet.classList.remove('hidden');

  const s = state.getScenario();
  // Pre-fill if memory already exists
  if (state.isClusterLinked(s.id)) {
    const mem = state.savedMemories[s.id];
    DOM.memoryTextInput.value = mem.text || '';
  } else {
    DOM.memoryTextInput.value = '';
  }

  handleInputTextChange();

  if (isVoiceMode) {
    setTimeout(startVoiceRecording, 300);
  }
}

function closeMemoryInputSheet() {
  stopVoiceRecording();
  DOM.inputSheetBackdrop.classList.add('hidden');
  DOM.memoryInputSheet.classList.add('hidden');
}

// Text Input Realtime Extraction Simulation
function handleInputTextChange() {
  const text = DOM.memoryTextInput.value.trim();
  DOM.charCount.textContent = `${text.length}/400`;

  if (text.length === 0) {
    DOM.liveChipsRow.innerHTML = '<span class="chips-placeholder-text">Entities will appear here as you type or speak...</span>';
    return;
  }

  // Extract entities locally using pattern matching
  const detected = extractLocalEntities(text);
  if (detected.length > 0) {
    DOM.liveChipsRow.innerHTML = detected.map(ent => `
      <span class="concept-chip user-type">
        ${ent.icon} ${ent.label}
      </span>
    `).join('');
  }
}

// Lightweight regex NLU extraction for live preview
function extractLocalEntities(text) {
  const t = text.toLowerCase();
  const entities = [];
  const existingLabels = new Set();

  const addEntity = (icon, label) => {
    if (!existingLabels.has(label.toLowerCase())) {
      existingLabels.add(label.toLowerCase());
      entities.push({ icon, label });
    }
  };

  // People & Companions
  if (t.includes('ramesh')) addEntity('👤', 'Ramesh');
  if (t.includes('maya')) addEntity('👤', 'Maya');
  if (t.includes('priya')) addEntity('👤', 'Priya');
  if (t.includes('arjun')) addEntity('👤', 'Arjun');
  if (t.includes('sneha')) addEntity('👤', 'Sneha');
  if (t.includes('rohan')) addEntity('👤', 'Rohan');
  if (t.includes('kabir')) addEntity('👤', 'Kabir');
  if (t.includes('zara')) addEntity('👤', 'Zara');
  if (t.includes('rocky') || t.includes('dog') || t.includes('retriever')) addEntity('🐕', 'Rocky the Dog');
  if (t.includes('mom') || t.includes('sunita') || t.includes('dadi')) addEntity('👵', 'Mom');
  if (t.includes('dad')) addEntity('👴', 'Dad');
  if (t.includes('ananya')) addEntity('👤', 'Ananya');
  if (t.includes('grandkid') || t.includes('kids') || t.includes('children')) addEntity('👶', 'Grandkids');
  if (t.includes('pooja')) addEntity('👤', 'Pooja');
  if (t.includes('vikram')) addEntity('👤', 'Vikram');
  if (t.includes('amit')) addEntity('👤', 'Amit');
  if (t.includes('neha')) addEntity('👤', 'Neha');
  if (t.includes('friend') || t.includes('friends') || t.includes('gang')) addEntity('👥', 'Friends');
  if (t.includes('family') || t.includes('cousin')) addEntity('👨‍👩‍👧‍👦', 'Family');

  // Places
  if (t.includes('delhi')) addEntity('📍', 'Delhi');
  if (t.includes('rajiv chowk') || t.includes('connaught')) addEntity('🏛️', 'Connaught Place');
  if (t.includes('goa') || t.includes('anjuna')) addEntity('🏖️', 'Goa (Anjuna)');
  if (t.includes('bangalore') || t.includes('indiranagar')) addEntity('📍', 'Bangalore');
  if (t.includes('cubbon')) addEntity('🌳', 'Cubbon Park');
  if (t.includes('himalaya') || t.includes('rohtang')) addEntity('🏔️', 'Rohtang Pass (13,000ft)');
  if (t.includes('tahoe') || t.includes('emerald bay')) addEntity('🏔️', 'Lake Tahoe');

  // Activities & Situations
  if (t.includes('beach') || t.includes('waves') || t.includes('surf')) addEntity('🌊', 'Beach & Waves');
  if (t.includes('shack')) addEntity('🛖', 'Beach Shack');
  if (t.includes('birthday') || t.includes('60th')) addEntity('🎂', 'Birthday Milestone');
  if (t.includes('cake') || t.includes('cheesecake')) addEntity('🍰', 'Cake');
  if (t.includes('marigold') || t.includes('garland')) addEntity('🌼', 'Marigold Garlands');
  if (t.includes('diwali') || t.includes('festival')) addEntity('🪔', 'Diwali Festival');
  if (t.includes('sparkler') || t.includes('phuljhadi')) addEntity('✨', 'Sparklers');
  if (t.includes('diya') || t.includes('diyas')) addEntity('🕯️', 'Clay Diyas');
  if (t.includes('road trip') || t.includes('roadtrip') || t.includes('suv') || t.includes('4x4')) addEntity('🚙', '4x4 Road Trip');
  if (t.includes('snow')) addEntity('❄️', 'Mountain Snow');
  if (t.includes('chai') || t.includes('tea')) addEntity('☕', 'Masala Chai');
  if (t.includes('cycl') || t.includes('bicycle') || t.includes('ride')) addEntity('🚴', 'Cycling Ride');
  if (t.includes('filter coffee') || t.includes('coffee') || t.includes('café') || t.includes('cafe')) addEntity('☕', 'Coffee');
  if (t.includes('hike') || t.includes('hiking')) addEntity('🥾', 'Hiking Trail');
  if (t.includes('sunset') || t.includes('golden hour')) addEntity('🌅', 'Sunset');
  if (t.includes('childhood')) addEntity('📖', 'Childhood Memories');
  if (t.includes('laptop') || t.includes('ultrabook') || t.includes('specs')) addEntity('💻', 'Laptop Research');

  // Dynamic Capitalized Words (Named Entities like people, places, pets)
  const words = text.split(/\s+/);
  const genericWords = new Set(['the', 'this', 'that', 'with', 'after', 'there', 'they', 'when', 'what', 'then', 'here', 'some', 'very', 'were', 'from', 'about', 'into', 'have', 'just']);
  words.forEach(w => {
    const clean = w.replace(/[^a-zA-Z0-9]/g, '');
    if (clean.length > 2 && /^[A-Z][a-z]+$/.test(clean) && !genericWords.has(clean.toLowerCase())) {
      addEntity('✨', clean);
    }
  });

  // Common emotional and lifestyle terms
  const extras = [
    { word: 'anniversary', icon: '💍', label: 'Anniversary' },
    { word: 'wedding', icon: '💒', label: 'Wedding' },
    { word: 'graduation', icon: '🎓', label: 'Graduation' },
    { word: 'dinner', icon: '🍽️', label: 'Dinner' },
    { word: 'lunch', icon: '🥗', label: 'Lunch' },
    { word: 'ice cream', icon: '🍦', label: 'Ice cream' },
    { word: 'rain', icon: '🌧️', label: 'Rainy Day' },
    { word: 'pet', icon: '🐾', label: 'Pet' },
    { word: 'reunion', icon: '🫂', label: 'Reunion' }
  ];
  extras.forEach(item => {
    if (t.includes(item.word)) addEntity(item.icon, item.label);
  });

  // Fallback entity if none of the above
  if (entities.length === 0 && text.length > 5) {
    entities.push({ icon: '✨', label: 'Personal Story' });
  }

  return entities;
}

function extractDynamicEntities(text) {
  return extractLocalEntities(text);
}

// ==========================================
// VOICE DICTATION & AUDIO VISUALIZER
// ==========================================
function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    state.recognition = new SpeechRecognition();
    state.recognition.continuous = true;
    state.recognition.interimResults = true;
    state.recognition.lang = 'en-US';

    state.recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        DOM.memoryTextInput.value += (DOM.memoryTextInput.value ? ' ' : '') + finalTranscript;
        handleInputTextChange();
      }
    };

    state.recognition.onerror = () => {
      stopVoiceRecording();
    };
  }
}

function startVoiceRecording() {
  if (state.isRecording) return;
  state.isRecording = true;

  DOM.voiceDictationCard.classList.add('is-recording');
  DOM.recIndicator.classList.add('recording');
  DOM.voiceStatusText.textContent = 'Listening... Speak your story naturally';

  // Expand Dynamic Island
  DOM.dynamicIsland.classList.add('island-expanded');
  DOM.islandStatusText.textContent = 'Recording Memory...';

  state.recSeconds = 0;
  DOM.recTimer.textContent = '00:00';
  state.recTimerInterval = setInterval(() => {
    state.recSeconds++;
    const mins = String(Math.floor(state.recSeconds / 60)).padStart(2, '0');
    const secs = String(state.recSeconds % 60).padStart(2, '0');
    DOM.recTimer.textContent = `${mins}:${secs}`;
  }, 1000);

  // If browser supports live speech API, start it
  if (state.recognition) {
    try { state.recognition.start(); } catch (e) {}
  } else {
    // High-fidelity natural typing fallback simulation
    simulateVoiceTyping();
  }
}

function stopVoiceRecording() {
  if (!state.isRecording) return;
  state.isRecording = false;

  DOM.voiceDictationCard.classList.remove('is-recording');
  DOM.recIndicator.classList.remove('recording');
  DOM.voiceStatusText.textContent = 'Recording stopped. Tap to speak again';

  DOM.dynamicIsland.classList.remove('island-expanded');
  DOM.islandStatusText.textContent = 'Google Photos';

  clearInterval(state.recTimerInterval);

  if (state.recognition) {
    try { state.recognition.stop(); } catch (e) {}
  }
}

function toggleVoiceRecording() {
  if (state.isRecording) {
    stopVoiceRecording();
  } else {
    startVoiceRecording();
  }
}

// Natural speech simulation fallback for browsers without WebSpeech microphone permission
function simulateVoiceTyping() {
  const s = state.getScenario();
  const sample = s.sampleText;
  let charIdx = 0;

  if (DOM.memoryTextInput.value.length > 0) return;

  const typeInterval = setInterval(() => {
    if (!state.isRecording || charIdx >= sample.length) {
      clearInterval(typeInterval);
      if (state.isRecording) stopVoiceRecording();
      return;
    }
    DOM.memoryTextInput.value = sample.slice(0, charIdx + 1);
    charIdx++;
    handleInputTextChange();
  }, 45);
}

// ==========================================
// CONFIRMATION & REVIEW MODAL (FLOW 3)
// ==========================================
function processAndOpenReviewModal() {
  const s = state.getScenario();
  let userText = DOM.memoryTextInput.value.trim();

  if (!userText) {
    userText = s.sampleText;
    DOM.memoryTextInput.value = userText;
    handleInputTextChange();
  }

  // Dynamic Island AI Processing State
  DOM.dynamicIsland.classList.add('island-expanded');
  DOM.islandStatusText.textContent = 'Gemini AI Extracting...';

  setTimeout(() => {
    DOM.dynamicIsland.classList.remove('island-expanded');
    DOM.islandStatusText.textContent = 'Google Photos';

    // Populate Review Modal
    DOM.reviewSummaryContent.textContent = `"${s.summary}"`;
    DOM.reviewMediaCount.textContent = s.mediaCountStr;

    // Categorized Transparent AI Chips
    DOM.reviewUserChips.innerHTML = s.userConcepts.map((c, i) => `
      <span class="concept-chip user-type" data-type="user" data-idx="${i}">
        ${c}
        <button class="chip-remove-btn" title="Remove">×</button>
      </span>
    `).join('');

    DOM.reviewVisualChips.innerHTML = s.visualConcepts.map((c, i) => `
      <span class="concept-chip visual-type" data-type="visual" data-idx="${i}">
        👁️ ${c}
        <button class="chip-remove-btn" title="Remove">×</button>
      </span>
    `).join('');

    DOM.reviewMetaChips.innerHTML = s.metaConcepts.map((c, i) => `
      <span class="concept-chip meta-type" data-type="meta" data-idx="${i}">
        ${c}
      </span>
    `).join('');

    // Attach chip deletion
    DOM.reviewModal.querySelectorAll('.chip-remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.parentElement.remove();
      });
    });

    closeMemoryInputSheet();
    DOM.reviewModalBackdrop.classList.remove('hidden');
    DOM.reviewModal.classList.remove('hidden');
  }, 600);
}

function closeReviewModal() {
  DOM.reviewModalBackdrop.classList.add('hidden');
  DOM.reviewModal.classList.add('hidden');
}

// Save Memory from Review Modal
function confirmSaveMemory() {
  const s = state.getScenario();
  const text = DOM.memoryTextInput.value.trim() || s.sampleText;

  const memoryRecord = {
    clusterId: s.id,
    title: s.title,
    text: text,
    summary: s.summary,
    userConcepts: s.userConcepts,
    visualConcepts: s.visualConcepts,
    dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    photosCount: s.photos.length,
    coverImg: s.coverImg,
    scenarioKey: state.currentScenarioKey
  };

  state.saveMemory(s.id, memoryRecord);

  // Asynchronously sync to backend REST API if server is running
  if (window.location.protocol.startsWith('http')) {
    fetch('/v1/memory/contexts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cluster_id: s.id,
        user_text: text,
        input_method: 'text',
      }),
    }).catch(() => {});
  }

  closeReviewModal();
  showToast('✨ Memory Context saved & linked to photos!');

  // Refresh current view
  renderCurrentScenario();

  // Show 1-Year Simulation invitation
  showPostSaveTimePrompt(s.title, state.currentScenarioKey);
}

// ==========================================
// MEMORIES MANAGER TAB (FLOW 5)
// ==========================================
function renderMemoriesManager() {
  const keys = Object.keys(state.savedMemories);
  if (keys.length === 0) {
    DOM.memoriesList.innerHTML = `
      <div class="search-empty-state">
        <div class="empty-icon">💭</div>
        <h3 class="empty-title">No saved memories yet</h3>
        <p class="empty-desc">When Google Photos prompts you, add memory context to your photo clusters to see them organized here.</p>
      </div>
    `;
    return;
  }

  DOM.memoriesList.innerHTML = keys.map(clusterId => {
    const mem = state.savedMemories[clusterId];
    if (!mem) return '';
    const scenario = SCENARIOS[mem.scenarioKey] || SCENARIOS[clusterId] || {};
    const title = mem.title || scenario.title || 'Personal Memory';
    const dateSaved = mem.dateSaved || (mem.timestamp ? new Date(mem.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent');
    const summary = mem.summary || mem.text || mem.story || '';
    const concepts = Array.isArray(mem.userConcepts) ? mem.userConcepts : (Array.isArray(mem.concepts) ? mem.concepts : (scenario.userConcepts || []));
    const count = mem.photosCount || (scenario.photos ? scenario.photos.length : 0);

    return `
      <div class="memory-item-card" data-cluster="${clusterId}">
        <div class="memory-item-top">
          <h4 class="memory-item-title">${title}</h4>
          <span class="memory-item-date">${dateSaved}</span>
        </div>
        <p class="memory-item-snippet">"${summary}"</p>
        <div class="memory-item-bottom">
          <div class="memory-item-chips">
            ${concepts.slice(0, 3).map(c => `<span class="concept-chip user-type">${c}</span>`).join('')}
            <span class="meta-tag">+${count} photos</span>
          </div>
          <div class="memory-item-actions">
            <button class="card-action-icon-btn edit-mem-btn" data-cluster="${clusterId}" title="Edit Memory">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="card-action-icon-btn delete-btn delete-mem-btn" data-cluster="${clusterId}" title="Delete Memory">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach actions
  DOM.memoriesList.querySelectorAll('.edit-mem-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const clusterId = btn.getAttribute('data-cluster');
      const mem = state.savedMemories[clusterId];
      if (mem && mem.scenarioKey) {
        state.currentScenarioKey = mem.scenarioKey;
        DOM.scenarioSelect.value = mem.scenarioKey;
        renderCurrentScenario();
        openMemoryInputSheet(false);
      }
    });
  });

  DOM.memoriesList.querySelectorAll('.delete-mem-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const clusterId = btn.getAttribute('data-cluster');
      if (confirm('Permanently delete this AI memory context? Your photos will not be affected.')) {
        state.deleteMemory(clusterId);
        showToast('Memory context deleted.');
        renderCurrentScenario();
      }
    });
  });
}

// ==========================================
// SEARCH MODE SWITCHER & MULTIMODAL RETRIEVAL (FLOW 4)
// ==========================================
function setSearchMode(mode) {
  state.searchMode = mode;
  if (mode === 'standard') {
    DOM.modeStandardBtn?.classList.add('active');
    DOM.modeAiMemoryBtn?.classList.remove('active');
    showToast('Switched to Standard Google Photos mode (Computer Vision only)');
  } else {
    DOM.modeAiMemoryBtn?.classList.add('active');
    DOM.modeStandardBtn?.classList.remove('active');
    showToast('Switched to AI Memory Context mode (Story + Multimodal Fusion)');
  }

  if (DOM.memorySearchInput?.value.trim()) {
    performMemorySearch(DOM.memorySearchInput.value);
  }
}

function performMemorySearch(rawQuery) {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    DOM.searchChipsWrap?.classList.remove('hidden');
    DOM.searchMatchCard?.classList.add('hidden');
    DOM.standardSearchCard?.classList.add('hidden');
    if (DOM.searchResultsGrid) DOM.searchResultsGrid.innerHTML = '';
    DOM.searchEmptyState?.classList.add('hidden');
    DOM.clearSearchBtn?.classList.add('hidden');
    return;
  }

  DOM.clearSearchBtn?.classList.remove('hidden');
  DOM.searchChipsWrap?.classList.add('hidden');

  const tokens = query.split(/\s+/).filter(t => t.length > 1);
  if (tokens.length === 0 && query.length > 0) {
    tokens.push(query);
  }

  // 1. If in Standard Google Photos CV Search mode:
  if (state.searchMode === 'standard') {
    DOM.searchMatchCard?.classList.add('hidden');
    DOM.standardSearchCard?.classList.remove('hidden');

    let standardMatches = [];
    Object.values(SCENARIOS).forEach(s => {
      s.photos.forEach(photo => {
        const hasVisualMatch = (photo.visualTags || []).some(tag => 
          tokens.some(tok => tag.toLowerCase().includes(tok))
        );
        if (hasVisualMatch && !standardMatches.some(p => p.id === photo.id)) {
          standardMatches.push(photo);
        }
      });
    });

    if (DOM.standardSearchDetails) {
      DOM.standardSearchDetails.textContent = `Standard Google Photos only matches generic object labels (e.g. "beach", "ocean", "sunset", "cake"). It has NO KNOWLEDGE of who was there ("Priya", "Arjun", "Ramesh"), the personal milestone ("60th birthday"), or emotional backstories.`;
    }

    if (standardMatches.length > 0) {
      DOM.searchEmptyState?.classList.add('hidden');
      DOM.searchGridWrap?.classList.remove('hidden');
      renderPhotosGrid(DOM.searchResultsGrid, standardMatches, false);
    } else {
      DOM.searchGridWrap?.classList.add('hidden');
      DOM.searchEmptyState?.classList.remove('hidden');
    }
    return;
  }

  // 2. AI Memory Context Mode (Default):
  DOM.standardSearchCard?.classList.add('hidden');

  // Multi-tier matching algorithm
  let bestScenario = null;
  let highestScore = 0;
  let matchedTokens = [];

  Object.values(SCENARIOS).forEach(s => {
    let score = 0;
    const currentMatches = [];

    // Full phrase exact match bonus
    if (s.title.toLowerCase().includes(query) || s.summary.toLowerCase().includes(query)) {
      score += 40;
      currentMatches.push(query);
    }

    // 1. Check title & location (weight: 15)
    tokens.forEach(tok => {
      if (s.title.toLowerCase().includes(tok) || s.location.toLowerCase().includes(tok)) {
        score += 15;
        currentMatches.push(tok);
      }
    });

    // 2. Check user memory context & summary (weight: 35)
    tokens.forEach(tok => {
      if (s.sampleText.toLowerCase().includes(tok) || s.summary.toLowerCase().includes(tok)) {
        score += 35;
        currentMatches.push(tok);
      }
    });

    // 3. Check user concepts (weight: 30)
    s.userConcepts.forEach(c => {
      tokens.forEach(tok => {
        if (c.toLowerCase().includes(tok) || tok.includes(c.toLowerCase())) {
          score += 30;
          currentMatches.push(c);
        }
      });
    });

    // 4. Check visual tags (weight: 20)
    s.visualConcepts.forEach(vc => {
      tokens.forEach(tok => {
        if (vc.toLowerCase().includes(tok)) {
          score += 20;
          currentMatches.push(tok);
        }
      });
    });

    // 5. Check 1 Year Later Faded Memory query & thought (weight: 50)
    if (s.fadedMemory) {
      if (s.fadedMemory.query && (query.includes(s.fadedMemory.query.toLowerCase()) || s.fadedMemory.query.toLowerCase().includes(query))) {
        score += 65;
        currentMatches.push('1-Year Faded Memory');
      }
      tokens.forEach(tok => {
        if (s.fadedMemory.query && s.fadedMemory.query.toLowerCase().includes(tok)) {
          score += 25;
          currentMatches.push(tok);
        }
        if (s.fadedMemory.thought && s.fadedMemory.thought.toLowerCase().includes(tok)) {
          score += 15;
          currentMatches.push(tok);
        }
      });
    }

    if (score > highestScore) {
      highestScore = score;
      bestScenario = s;
      matchedTokens = [...new Set(currentMatches)];
    }
  });

  if (highestScore >= 30 && bestScenario) {
    DOM.searchEmptyState?.classList.add('hidden');
    DOM.searchGridWrap?.classList.remove('hidden');
    DOM.searchMatchCard?.classList.remove('hidden');

    // Populate match hero card
    DOM.matchMemoryTitle.textContent = bestScenario.title;
    DOM.matchMemorySummary.textContent = `"${bestScenario.summary}"`;
    DOM.matchScoreBadge.textContent = `${Math.min(99, Math.max(82, Math.round(highestScore)))}% match`;

    DOM.matchedChipsWrap.innerHTML = matchedTokens.map(t => `
      <span class="highlight-chip">✨ ${t}</span>
    `).join('');

    // Render retrieved photo results
    renderPhotosGrid(DOM.searchResultsGrid, bestScenario.photos, true);
  } else {
    // Zero state
    DOM.searchMatchCard?.classList.add('hidden');
    DOM.searchGridWrap?.classList.add('hidden');
    DOM.searchEmptyState?.classList.remove('hidden');
  }
}

// ==========================================
// EXPLAINER MODAL & GUIDED TOUR
// ==========================================
function openExplainerModal() {
  DOM.explainerModalBackdrop?.classList.remove('hidden');
  DOM.explainerModal?.classList.remove('hidden');
}

function closeExplainerModal() {
  DOM.explainerModalBackdrop?.classList.add('hidden');
  DOM.explainerModal?.classList.add('hidden');
}

let currentHighlightedElement = null;

function highlightElement(el) {
  clearHighlightElements();
  if (!el) return;
  el.classList.add('tour-highlight-target');
  currentHighlightedElement = el;
  try {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {}
}

function clearHighlightElements() {
  if (currentHighlightedElement) {
    currentHighlightedElement.classList.remove('tour-highlight-target');
    currentHighlightedElement = null;
  }
  document.querySelectorAll('.tour-highlight-target').forEach(el => {
    el.classList.remove('tour-highlight-target');
  });
}

const TOUR_STEPS = [
  {
    badge: 'Step 1 of 3: Smart Memory Prompt',
    title: 'The 10-Second Context Window',
    desc: 'Google Photos detects your recent burst of photos and ambiently asks for human context before memories fade. Tap below to capture the story.',
    nextText: 'Capture Memory Context →',
    action: () => {
      closeMemoryInputSheet();
      switchTab('tabPhotos');
      highlightElement(DOM.memoryPromptCard);
    }
  },
  {
    badge: 'Step 2 of 3: Multimodal Extraction',
    title: 'Turning Human Stories into Searchable Knowledge',
    desc: 'Speak or type naturally. Watch Gemini extract key people, emotions, and milestone concepts in real-time, fusing with computer vision tags without manual tagging.',
    nextText: 'Test Natural Search →',
    action: () => {
      openMemoryInputSheet(false);
      const s = state.getScenario();
      if (!DOM.memoryTextInput.value) {
        DOM.memoryTextInput.value = s.sampleText;
        handleInputTextChange();
      }
      highlightElement(DOM.memoryInputSheet);
    }
  },
  {
    badge: 'Step 3 of 4: Natural Human Retrieval',
    title: 'Recall Exactly How You Remember It',
    desc: 'Search for "friends sunset waves" or "meeting Ramesh cake". AI finds the exact moment using personal meaning. Toggle to "Standard Google Photos" to see what CV misses!',
    nextText: 'Fast-Forward 1 Year ⏩',
    action: () => {
      const s = state.getScenario();
      state.saveMemory(s.id, {
        clusterId: s.id,
        title: s.title,
        text: s.sampleText,
        story: s.sampleText,
        userConcepts: s.userConcepts,
        concepts: s.userConcepts,
        visualConcepts: s.visualConcepts,
        summary: s.summary,
        dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        photosCount: s.photos ? s.photos.length : 0,
        coverImg: s.coverImg,
        scenarioKey: state.currentScenarioKey,
        timestamp: new Date().toISOString()
      });
      closeMemoryInputSheet();
      switchTab('tabSearch');
      setSearchMode('ai_memory');
      const sampleQuery = s.quickPills && s.quickPills[0]
        ? (s.quickPills[0].replace(/[^\w\s]/gi, '').trim().split(' ').slice(0, 5).join(' '))
        : 'Goa beach sunset waves with friends';
      DOM.memorySearchInput.value = sampleQuery;
      performMemorySearch(sampleQuery);
      highlightElement(DOM.searchMatchCard);
    }
  },
  {
    badge: 'Step 4 of 4: The 1-Year Payoff',
    title: 'Fast-Forward: Faded Memory Recall',
    desc: '1 year later, you forget dates, folders, and tags. You only have a fragmented thought ("that beach shack with spicy prawns and Rahul"). See how AI retrieves the exact moment!',
    nextText: 'Open 1-Year Time Machine 🕰️',
    action: () => {
      switchTab('tabSearch');
      highlightElement(document.getElementById('fadedMemorySearchCard'));
      setTimeout(() => {
        openTimeMachineModal(state.currentScenarioKey);
      }, 600);
    }
  }
];

function startInteractiveTour() {
  closeExplainerModal();
  state.isTourActive = true;
  state.tourStep = 0;
  DOM.tourGuideWidget?.classList.remove('hidden');
  renderTourStep();
}

function renderTourStep() {
  const step = TOUR_STEPS[state.tourStep];
  if (!step) return;

  if (DOM.tourStepBadge) DOM.tourStepBadge.textContent = step.badge;
  if (DOM.tourTitle) DOM.tourTitle.textContent = step.title;
  if (DOM.tourDesc) DOM.tourDesc.textContent = step.desc;
  if (DOM.tourNextBtn) DOM.tourNextBtn.textContent = step.nextText;

  if (DOM.tourPrevBtn) {
    if (state.tourStep === 0) {
      DOM.tourPrevBtn.style.display = 'none';
    } else {
      DOM.tourPrevBtn.style.display = 'inline-block';
      DOM.tourPrevBtn.textContent = '← Back';
    }
  }

  // Execute step action
  step.action();
}

function nextTourStep() {
  if (state.tourStep < TOUR_STEPS.length - 1) {
    state.tourStep++;
    renderTourStep();
  } else {
    closeTour();
    showToast('🎉 Tour complete! Try searching with your own memories or switch scenarios.', false);
  }
}

function prevTourStep() {
  if (state.tourStep > 0) {
    state.tourStep--;
    renderTourStep();
  }
}

function closeTour() {
  state.isTourActive = false;
  clearHighlightElements();
  DOM.tourGuideWidget?.classList.add('hidden');
}

// ==========================================
// CUSTOM USER PHOTOS & MEMORY INGESTION
// ==========================================
let customUploadedPhotos = [];
let isCustomVoiceRecording = false;
let customSpeechRecognition = null;

function openCustomUploadModal() {
  closeExplainerModal();
  closeMemoryInputSheet();
  DOM.customUploadBackdrop?.classList.remove('hidden');
  DOM.customUploadModal?.classList.remove('hidden');
  updateCustomSubmitState();
}

function closeCustomUploadModal() {
  stopCustomVoice();
  DOM.customUploadBackdrop?.classList.add('hidden');
  DOM.customUploadModal?.classList.add('hidden');
}

function handleCustomFileSelection(files) {
  if (!files || files.length === 0) return;
  const maxPhotos = 5;
  const selectedFiles = Array.from(files).slice(0, maxPhotos - customUploadedPhotos.length);

  selectedFiles.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      customUploadedPhotos.push({
        id: `custom_photo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        src: e.target.result,
        name: file.name,
        caption: file.name.replace(/\.[^/.]+$/, ""),
        isVideo: false,
        featured: customUploadedPhotos.length === 0,
        visualTags: ['Personal Camera Photo (99%)', 'User Memory (98%)', 'Real-world Capture (96%)']
      });
      renderCustomPhotoPreviews();
      updateCustomSubmitState();
    };
    reader.readAsDataURL(file);
  });
}

function renderCustomPhotoPreviews() {
  if (customUploadedPhotos.length === 0) {
    DOM.uploadedPreviewsGrid?.classList.add('hidden');
    DOM.dropzonePrompt?.classList.remove('hidden');
    if (DOM.uploadedPreviewsGrid) DOM.uploadedPreviewsGrid.innerHTML = '';
    return;
  }

  DOM.dropzonePrompt?.classList.add('hidden');
  DOM.uploadedPreviewsGrid?.classList.remove('hidden');

  DOM.uploadedPreviewsGrid.innerHTML = customUploadedPhotos.map((photo, index) => `
    <div class="preview-thumb-card" data-index="${index}">
      <img src="${photo.src}" alt="${photo.name}" class="preview-thumb-img">
      <button type="button" class="preview-remove-btn" data-index="${index}" title="Remove photo">×</button>
    </div>
  `).join('') + `
    ${customUploadedPhotos.length < 5 ? `
      <div class="preview-thumb-card add-more-thumb" id="addMoreThumbBtn" style="display:flex;align-items:center;justify-content:center;background:rgba(66,133,244,0.08);cursor:pointer;border:2px dashed #1A73E8;">
        <span style="font-size:24px;color:#1A73E8;font-weight:700;">+</span>
      </div>
    ` : ''}
  `;

  // Attach remove handlers
  DOM.uploadedPreviewsGrid.querySelectorAll('.preview-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      customUploadedPhotos.splice(idx, 1);
      renderCustomPhotoPreviews();
      updateCustomSubmitState();
    });
  });

  // Attach add more click
  const addMore = document.getElementById('addMoreThumbBtn');
  if (addMore) {
    addMore.addEventListener('click', () => {
      DOM.customFileInput.click();
    });
  }
}

function handleCustomStoryInput() {
  const text = DOM.customStoryInput.value.trim();
  if (DOM.customCharCount) DOM.customCharCount.textContent = `${text.length}/400`;

  if (text.length === 0) {
    if (DOM.customExtractedChips) {
      DOM.customExtractedChips.innerHTML = '<span class="chips-empty-hint">Type or speak above to see names, places, and emotions extracted...</span>';
    }
    updateCustomSubmitState();
    return;
  }

  const entities = extractDynamicEntities(text);
  if (DOM.customExtractedChips) {
    if (entities.length > 0) {
      DOM.customExtractedChips.innerHTML = entities.map(ent => `
        <span class="concept-chip user-type">
          ${ent.icon} ${ent.label}
        </span>
      `).join('');
    } else {
      DOM.customExtractedChips.innerHTML = '<span class="chips-empty-hint">Add more details (names, location, or feelings) for AI extraction...</span>';
    }
  }

  updateCustomSubmitState();
}

function updateCustomSubmitState() {
  const hasPhotos = customUploadedPhotos.length > 0;
  const hasText = DOM.customStoryInput && DOM.customStoryInput.value.trim().length > 3;
  if (DOM.submitCustomMemoryBtn) {
    DOM.submitCustomMemoryBtn.disabled = !(hasPhotos && hasText);
  }
}

function toggleCustomVoice() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    const sample = "Trip with Alex to Kyoto in the autumn rain. We had matcha ice cream and visited Fushimi Inari shrine.";
    DOM.customStoryInput.value = sample;
    handleCustomStoryInput();
    showToast('Voice dictation simulated (browser speech API not available).');
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (isCustomVoiceRecording) {
    stopCustomVoice();
  } else {
    try {
      customSpeechRecognition = new SpeechRecognition();
      customSpeechRecognition.continuous = true;
      customSpeechRecognition.interimResults = true;
      customSpeechRecognition.lang = 'en-US';

      customSpeechRecognition.onstart = () => {
        isCustomVoiceRecording = true;
        DOM.customMicBtn?.classList.add('recording');
        showToast('🎙️ Listening... Speak your memory story.');
      };

      customSpeechRecognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        DOM.customStoryInput.value = transcript;
        handleCustomStoryInput();
      };

      customSpeechRecognition.onerror = () => {
        stopCustomVoice();
      };

      customSpeechRecognition.onend = () => {
        stopCustomVoice();
      };

      customSpeechRecognition.start();
    } catch (e) {
      stopCustomVoice();
    }
  }
}

function stopCustomVoice() {
  if (customSpeechRecognition && isCustomVoiceRecording) {
    try { customSpeechRecognition.stop(); } catch(e) {}
  }
  isCustomVoiceRecording = false;
  DOM.customMicBtn?.classList.remove('recording');
}

function saveCustomMemoryAndSearch() {
  const story = DOM.customStoryInput.value.trim();
  const rawTitle = DOM.customTitleInput.value.trim();
  const title = rawTitle || 'My Personal Memory';
  const customClusterId = 'cluster_custom_user';

  if (customUploadedPhotos.length === 0 || !story) return;

  const extracted = extractDynamicEntities(story);
  const userConcepts = extracted.map(e => e.label);
  if (rawTitle && !userConcepts.includes(rawTitle)) userConcepts.unshift(rawTitle);

  // Build the dynamic scenario
  SCENARIOS['custom_user_memory'] = {
    id: customClusterId,
    title: title,
    dateText: 'Just Now',
    location: rawTitle || 'Personal Collection',
    subtitle: `You uploaded ${customUploadedPhotos.length} personal photos. Memory context is active and indexed for natural search.`,
    itemCount: `+${customUploadedPhotos.length}`,
    metaTags: ['📸 Your Photos', '✨ AI Linked', '🔒 Stored Locally'],
    sampleText: story,
    quickPills: [
      `"${story.slice(0, 60)}..."`
    ],
    coverImg: customUploadedPhotos[0].src,
    secImg: customUploadedPhotos[1] ? customUploadedPhotos[1].src : customUploadedPhotos[0].src,
    photos: customUploadedPhotos,
    summary: `${title}: ${story}`,
    userConcepts: userConcepts.length > 0 ? userConcepts : [title, 'Personal memory'],
    visualConcepts: ['Personal Camera Photo (99%)', 'Family & Friends (96%)', 'User Memory (98%)'],
    metaConcepts: ['Just Now', 'Your Device', `${customUploadedPhotos.length} Photos`],
    mediaCountStr: `${customUploadedPhotos.length} personal photos`
  };

  // Save to app state
  state.saveMemory(customClusterId, {
    clusterId: customClusterId,
    title: title,
    text: story,
    story: story,
    summary: `${title} — ${story}`,
    userConcepts: userConcepts,
    concepts: userConcepts,
    dateSaved: 'Just Now',
    timestamp: new Date().toISOString(),
    photosCount: customUploadedPhotos.length,
    coverImg: customUploadedPhotos[0].src,
    scenarioKey: 'custom_user_memory'
  });

  // Update current scenario
  state.currentScenarioKey = 'custom_user_memory';
  if (DOM.scenarioSelect) DOM.scenarioSelect.value = 'custom_user_memory';

  // Render scenario
  renderCurrentScenario();
  closeCustomUploadModal();

  // Jump to search to show the retrieval in action
  switchTab('tabSearch');
  setSearchMode('ai_memory');

  // Pre-populate search query with first user concept or key words
  const searchSeed = userConcepts[0] || story.split(' ').slice(0, 3).join(' ');

  // Update dynamic faded memory for custom memory
  SCENARIOS.custom_user_memory.fadedMemory = {
    thought: `“${story.slice(0, 110)}${story.length > 110 ? '...' : ''}”`,
    query: searchSeed,
    standardResult: `Standard Google Photos only reads raw pixels. It has no record of "${userConcepts.slice(0, 2).join(', ')}" or the human story you lived.`,
    aiMatchPills: userConcepts.slice(0, 4).concat(['✨ 98% Match'])
  };

  DOM.memorySearchInput.value = searchSeed;
  performMemorySearch(searchSeed);

  showToast(`✨ Success! Linked your personal photos. Showing AI Memory search for "${searchSeed}".`);

  // Prompt to simulate 1-year retrieval on their own memory
  setTimeout(() => {
    showPostSaveTimePrompt(title, 'custom_user_memory');
  }, 1000);
}

// ==========================================
// LIGHTBOX & INSPECTOR MODAL
// ==========================================
function openPhotoLightbox(photo) {
  const s = state.getScenario();
  DOM.lightboxImg.src = photo.src;
  DOM.lightboxStory.textContent = `"${s.summary}"`;

  DOM.lightboxTags.innerHTML = (photo.visualTags || s.visualConcepts.slice(0, 3)).map(tag => `
    <span class="concept-chip visual-type">👁️ ${tag}</span>
  `).join('');

  DOM.photoLightbox.classList.remove('hidden');
}

function closePhotoLightbox() {
  DOM.photoLightbox.classList.add('hidden');
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
let toastTimeout;
function showToast(message, allowUndo = false, onUndo = null) {
  clearTimeout(toastTimeout);
  DOM.toastMessage.textContent = message;

  if (allowUndo && onUndo) {
    DOM.toastUndoBtn.classList.remove('hidden');
    DOM.toastUndoBtn.onclick = () => {
      onUndo();
      DOM.appToast.classList.add('hidden');
    };
  } else {
    DOM.toastUndoBtn.classList.add('hidden');
  }

  DOM.appToast.classList.remove('hidden');
  toastTimeout = setTimeout(() => {
    DOM.appToast.classList.add('hidden');
  }, 4000);
}

// ==========================================
// 1 YEAR LATER: TIME MACHINE CONTROLLER (FLOW 6)
// ==========================================
let currentTimeMachineScenario = 'goa_beach';

function openTimeMachineModal(scenarioKey) {
  currentTimeMachineScenario = scenarioKey || state.currentScenarioKey || 'goa_beach';
  if (currentTimeMachineScenario === 'custom_user_memory' && (!state.savedMemories['cluster_custom_user'])) {
    currentTimeMachineScenario = 'goa_beach';
  }
  renderTimeMachineModal(currentTimeMachineScenario);
  DOM.timeMachineBackdrop?.classList.remove('hidden');
  DOM.timeMachineModal?.classList.remove('hidden');
}

function closeTimeMachineModal() {
  DOM.timeMachineModal?.classList.add('hidden');
  DOM.timeMachineBackdrop?.classList.add('hidden');
}

function renderTimeMachineModal(scenarioKey) {
  currentTimeMachineScenario = scenarioKey;
  const s = SCENARIOS[scenarioKey] || SCENARIOS['goa_beach'];
  const faded = s.fadedMemory || {
    thought: `“${s.sampleText}”`,
    query: s.userConcepts ? s.userConcepts.slice(0, 3).join(' ') : 'my personal memory',
    standardResult: 'Standard search cannot connect personal names or human memories to raw image pixels.',
    aiMatchPills: (s.userConcepts || []).slice(0, 4)
  };

  // Render scenario selector chips inside modal
  if (DOM.tmScenarioChips) {
    const scenarioKeys = ['goa_beach', 'mom_birthday', 'himalaya_roadtrip', 'diwali_celebration', 'cycling_morning', 'delhi_cafe', 'lake_tahoe', 'laptop_research'];
    if (state.savedMemories['cluster_custom_user']) {
      scenarioKeys.push('custom_user_memory');
    }
    DOM.tmScenarioChips.innerHTML = scenarioKeys.map(k => {
      const sc = SCENARIOS[k];
      const isActive = k === scenarioKey;
      const emoji = sc.title.split(' ')[0] || '📸';
      const shortTitle = sc.title.replace(/^[^\s]+\s+/, '').split(' (')[0].slice(0, 18);
      return `<button class="tm-sc-chip ${isActive ? 'active' : ''}" data-tm-scenario="${k}">${emoji} ${shortTitle}</button>`;
    }).join('');

    DOM.tmScenarioChips.querySelectorAll('.tm-sc-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tm-scenario');
        renderTimeMachineModal(target);
      });
    });
  }

  // Populate thought and query
  if (DOM.tmThoughtQuote) DOM.tmThoughtQuote.textContent = faded.thought;
  if (DOM.tmQueryDisplay) DOM.tmQueryDisplay.textContent = faded.query;
  if (DOM.tmStandardDesc) DOM.tmStandardDesc.textContent = faded.standardResult;

  // Populate preview card
  if (DOM.tmPreviewImg) DOM.tmPreviewImg.src = s.coverImg || (s.photos && s.photos[0] ? s.photos[0].src : 'assets/goa_beach_friends.jpg');
  if (DOM.tmMemoryTitle) DOM.tmMemoryTitle.textContent = s.title;
  if (DOM.tmMemorySnippet) DOM.tmMemorySnippet.textContent = `"${s.summary || s.sampleText}"`;
  if (DOM.tmMatchScoreBadge) DOM.tmMatchScoreBadge.textContent = '✅ 98% Match';

  if (DOM.tmConceptsRow) {
    const pills = faded.aiMatchPills || (s.userConcepts ? s.userConcepts.slice(0, 4) : ['✨ 98% Match']);
    DOM.tmConceptsRow.innerHTML = pills.map(p => `<span class="comp-concept-pill">${p}</span>`).join('');
  }
}

function cycleTimeMachineScenario() {
  const scenarioKeys = ['goa_beach', 'mom_birthday', 'himalaya_roadtrip', 'diwali_celebration', 'cycling_morning', 'delhi_cafe', 'lake_tahoe', 'laptop_research'];
  const curIdx = scenarioKeys.indexOf(currentTimeMachineScenario);
  const nextIdx = (curIdx + 1) % scenarioKeys.length;
  renderTimeMachineModal(scenarioKeys[nextIdx]);
}

function testFadedSearchLive() {
  const s = SCENARIOS[currentTimeMachineScenario] || SCENARIOS['goa_beach'];
  const fadedQuery = s.fadedMemory ? s.fadedMemory.query : (s.userConcepts.slice(0, 3).join(' '));

  // Save the scenario memory into state so it's guaranteed to be indexed
  state.saveMemory(s.id, {
    clusterId: s.id,
    title: s.title,
    text: s.sampleText,
    story: s.sampleText,
    userConcepts: s.userConcepts,
    concepts: s.userConcepts,
    visualConcepts: s.visualConcepts,
    summary: s.summary,
    dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    photosCount: s.photos ? s.photos.length : 0,
    coverImg: s.coverImg,
    scenarioKey: currentTimeMachineScenario,
    timestamp: new Date().toISOString()
  });

  closeTimeMachineModal();

  // Switch to search tab
  switchTab('tabSearch');
  setSearchMode('ai_memory');

  if (DOM.memorySearchInput) {
    DOM.memorySearchInput.value = fadedQuery;
    performMemorySearch(fadedQuery);
  }

  // Scroll to results and highlight
  if (DOM.searchMatchCard) {
    DOM.searchMatchCard.classList.remove('hidden');
    DOM.searchMatchCard.classList.add('highlight-faded-retrieval');
    setTimeout(() => {
      DOM.searchMatchCard.classList.remove('highlight-faded-retrieval');
    }, 2500);
  }

  showToast(`🕰️ Fast-Forward: Retrieved 1-year faded memory for "${fadedQuery.slice(0, 32)}..."`);
}

function showPostSaveTimePrompt(title, scenarioKey) {
  const existing = document.getElementById('postSaveTimePrompt');
  if (existing) existing.remove();

  const promptEl = document.createElement('div');
  promptEl.id = 'postSaveTimePrompt';
  promptEl.className = 'post-save-time-prompt';
  promptEl.innerHTML = `
    <div class="post-save-prompt-text">
      <strong>✨ Memory Linked!</strong> Experience how you'll retrieve this 1 year from now when details fade.
    </div>
    <button class="post-save-prompt-btn" id="postSavePromptActionBtn">Simulate 1 Year Later ⏩</button>
  `;

  if (DOM.memorySavedBanner) {
    DOM.memorySavedBanner.insertAdjacentElement('afterend', promptEl);
  } else if (DOM.mainPhotoGrid) {
    DOM.mainPhotoGrid.insertAdjacentElement('beforebegin', promptEl);
  }

  document.getElementById('postSavePromptActionBtn')?.addEventListener('click', () => {
    promptEl.remove();
    openTimeMachineModal(scenarioKey);
  });
}

// ==========================================
// THEME & FRAME TOGGLE
// ==========================================
function applyTheme(theme) {
  state.theme = theme;
  localStorage.setItem('gp_theme', theme);

  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    DOM.themeBtnText.textContent = 'Light';
    DOM.themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  } else {
    document.body.classList.remove('dark-mode');
    DOM.themeBtnText.textContent = 'Dark';
    DOM.themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  }
}

function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

function toggleFrame() {
  state.isFrameVisible = !state.isFrameVisible;
  if (state.isFrameVisible) {
    DOM.mobileFrame.classList.remove('no-frame');
  } else {
    DOM.mobileFrame.classList.add('no-frame');
  }
}

// ==========================================
// MOBILE DEMO SHOWCASE HUB
// ==========================================
function openMobileDemoHub() {
  if (DOM.mobileDemoHubBackdrop) DOM.mobileDemoHubBackdrop.classList.remove('hidden');
  if (DOM.mobileDemoHubSheet) DOM.mobileDemoHubSheet.classList.remove('hidden');
}

function closeMobileDemoHub() {
  if (DOM.mobileDemoHubBackdrop) DOM.mobileDemoHubBackdrop.classList.add('hidden');
  if (DOM.mobileDemoHubSheet) DOM.mobileDemoHubSheet.classList.add('hidden');
}

// ==========================================
// ATTACH EVENT LISTENERS
// ==========================================
function attachEventListeners() {
  // Desktop Presenter Scenario selector
  DOM.scenarioSelect?.addEventListener('change', (e) => {
    if (e.target.value === 'custom_user_memory') {
      openCustomUploadModal();
      return;
    }
    state.currentScenarioKey = e.target.value;
    renderCurrentScenario();
  });

  // Mobile In-App Scenario selector
  DOM.mobileScenarioSelect?.addEventListener('change', (e) => {
    if (e.target.value === 'custom_user_memory') {
      openCustomUploadModal();
      return;
    }
    state.currentScenarioKey = e.target.value;
    renderCurrentScenario();
    showDynamicIslandPill(`Scenario: ${e.target.options[e.target.selectedIndex].text}`);
  });

  // Mobile Demo Hub Triggers
  DOM.openMobileDemoHubBtn?.addEventListener('click', openMobileDemoHub);
  DOM.closeMobileDemoHubBtn?.addEventListener('click', closeMobileDemoHub);
  DOM.mobileDemoHubBackdrop?.addEventListener('click', closeMobileDemoHub);

  // Demo Hub Scenario Pills
  document.querySelectorAll('.demo-sc-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const scKey = pill.dataset.scenario;
      if (scKey === 'custom_user_memory') {
        closeMobileDemoHub();
        openCustomUploadModal();
        return;
      }
      state.currentScenarioKey = scKey;
      renderCurrentScenario();
      closeMobileDemoHub();
      showDynamicIslandPill(`Scenario: ${pill.textContent}`);
    });
  });

  // Demo Hub Action Cards
  DOM.hubStartTourBtn?.addEventListener('click', () => {
    closeMobileDemoHub();
    startInteractiveTour();
  });

  DOM.hubOpenTimeMachineBtn?.addEventListener('click', () => {
    closeMobileDemoHub();
    openTimeMachineModal();
  });

  DOM.hubOpenCustomUploadBtn?.addEventListener('click', () => {
    closeMobileDemoHub();
    openCustomUploadModal();
  });

  DOM.hubOpenExplainerBtn?.addEventListener('click', () => {
    closeMobileDemoHub();
    openExplainerModal();
  });

  DOM.hubToggleThemeBtn?.addEventListener('click', () => {
    toggleTheme();
  });

  DOM.hubResetDemoBtn?.addEventListener('click', () => {
    closeMobileDemoHub();
    resetDemo();
  });

  // Fast-Forward 1-Year Recall button from saved memory banner
  DOM.bannerTimeMachineBtn?.addEventListener('click', () => {
    openTimeMachineModal();
  });

  // Custom User Photos Upload Controls
  DOM.openCustomUploadBtn?.addEventListener('click', openCustomUploadModal);
  DOM.spotlightCustomBtn?.addEventListener('click', openCustomUploadModal);
  DOM.closeCustomUploadBtn?.addEventListener('click', closeCustomUploadModal);
  DOM.cancelCustomUploadBtn?.addEventListener('click', closeCustomUploadModal);
  DOM.customUploadBackdrop?.addEventListener('click', closeCustomUploadModal);
  DOM.submitCustomMemoryBtn?.addEventListener('click', saveCustomMemoryAndSearch);

  DOM.browsePhotosBtn?.addEventListener('click', () => DOM.customFileInput?.click());
  DOM.uploadDropzone?.addEventListener('click', (e) => {
    if (e.target !== DOM.browsePhotosBtn && !e.target.closest('.preview-remove-btn') && !e.target.closest('#addMoreThumbBtn')) {
      DOM.customFileInput?.click();
    }
  });

  DOM.customFileInput?.addEventListener('change', (e) => {
    handleCustomFileSelection(e.target.files);
  });

  // Drag and drop support
  DOM.uploadDropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    DOM.uploadDropzone.classList.add('dragover');
  });
  DOM.uploadDropzone?.addEventListener('dragleave', () => {
    DOM.uploadDropzone.classList.remove('dragover');
  });
  DOM.uploadDropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    DOM.uploadDropzone.classList.remove('dragover');
    if (e.dataTransfer && e.dataTransfer.files) {
      handleCustomFileSelection(e.dataTransfer.files);
    }
  });

  DOM.customStoryInput?.addEventListener('input', handleCustomStoryInput);
  DOM.customTitleInput?.addEventListener('input', updateCustomSubmitState);
  DOM.customMicBtn?.addEventListener('click', toggleCustomVoice);

  // Desktop Controls
  DOM.toggleFrameBtn.addEventListener('click', toggleFrame);
  DOM.toggleThemeBtn.addEventListener('click', toggleTheme);
  DOM.resetDemoBtn.addEventListener('click', () => {
    state.clearAllMemories();
    state.dismissedClusters = {};
    renderCurrentScenario();
    showToast('Demo data reset to fresh state.');
  });

  // Tab Navigation
  DOM.navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  DOM.headerSearchBtn.addEventListener('click', () => {
    switchTab('tabSearch');
    DOM.memorySearchInput.focus();
  });

  // Prompt Card Actions
  DOM.speakMemoryBtn.addEventListener('click', () => openMemoryInputSheet(true));
  DOM.addMemoryBtn.addEventListener('click', () => openMemoryInputSheet(false));
  DOM.storyPromptTrigger.addEventListener('click', () => openMemoryInputSheet(false));
  DOM.bannerEditBtn.addEventListener('click', () => openMemoryInputSheet(false));

  DOM.promptDismissBtn.addEventListener('click', () => dismissPrompt(false));
  DOM.notNowBtn.addEventListener('click', () => dismissPrompt(false));
  DOM.dontAskBtn.addEventListener('click', () => dismissPrompt(true));

  // Memory Input Sheet Events
  DOM.sheetCloseBtn.addEventListener('click', closeMemoryInputSheet);
  DOM.sheetCancelBtn.addEventListener('click', closeMemoryInputSheet);
  DOM.inputSheetBackdrop.addEventListener('click', closeMemoryInputSheet);
  DOM.sheetSubmitBtn.addEventListener('click', processAndOpenReviewModal);
  DOM.sheetProcessBtn.addEventListener('click', processAndOpenReviewModal);
  DOM.memoryTextInput.addEventListener('input', handleInputTextChange);
  DOM.bigMicBtn.addEventListener('click', toggleVoiceRecording);

  // Review Modal Events
  DOM.reviewModalBackdrop.addEventListener('click', closeReviewModal);
  DOM.reviewEditBtn.addEventListener('click', () => {
    closeReviewModal();
    openMemoryInputSheet(false);
  });
  DOM.reviewSaveConfirmBtn.addEventListener('click', confirmSaveMemory);

  // Search Events
  DOM.memorySearchInput.addEventListener('input', (e) => performMemorySearch(e.target.value));
  DOM.clearSearchBtn.addEventListener('click', () => {
    DOM.memorySearchInput.value = '';
    performMemorySearch('');
  });

  DOM.searchMicBtn.addEventListener('click', () => {
    switchTab('tabSearch');
    DOM.memorySearchInput.value = 'Delhi cafe with Ramesh having cake';
    performMemorySearch(DOM.memorySearchInput.value);
  });

  // Suggestion query chips
  document.querySelectorAll('.query-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      DOM.memorySearchInput.value = query;
      performMemorySearch(query);
    });
  });

  // Faded Memory Query Pills in Search Tab
  document.querySelectorAll('.faded-query-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const query = pill.getAttribute('data-query');
      const scKey = pill.getAttribute('data-faded-scenario');
      if (scKey && SCENARIOS[scKey]) {
        state.currentScenarioKey = scKey;
        if (DOM.scenarioSelect) DOM.scenarioSelect.value = scKey;
        const s = SCENARIOS[scKey];
        // Ensure memory is indexed
        state.saveMemory(s.id, {
          clusterId: s.id,
          title: s.title,
          text: s.sampleText,
          story: s.sampleText,
          userConcepts: s.userConcepts,
          concepts: s.userConcepts,
          visualConcepts: s.visualConcepts,
          summary: s.summary,
          dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          photosCount: s.photos ? s.photos.length : 0,
          coverImg: s.coverImg,
          scenarioKey: scKey,
          timestamp: new Date().toISOString()
        });
      }
      setSearchMode('ai_memory');
      DOM.memorySearchInput.value = query;
      performMemorySearch(query);
      if (DOM.searchMatchCard) {
        DOM.searchMatchCard.classList.add('highlight-faded-retrieval');
        setTimeout(() => DOM.searchMatchCard.classList.remove('highlight-faded-retrieval'), 2000);
      }
      showToast(`🕰️ Testing 1-Year Faded Memory retrieval for "${query.slice(0, 30)}..."`);
    });
  });

  // Time Machine Modal Controls
  DOM.openTimeMachineBtn?.addEventListener('click', () => openTimeMachineModal());
  DOM.closeTimeMachineBtn?.addEventListener('click', closeTimeMachineModal);
  DOM.timeMachineBackdrop?.addEventListener('click', closeTimeMachineModal);
  DOM.launchTimeMachineFromSearchBtn?.addEventListener('click', () => openTimeMachineModal());
  DOM.tmTestLiveBtn?.addEventListener('click', testFadedSearchLive);
  DOM.tmTryOtherScenarioBtn?.addEventListener('click', cycleTimeMachineScenario);

  // Lightbox Close
  DOM.lightboxCloseBtn.addEventListener('click', closePhotoLightbox);
  DOM.photoLightbox.addEventListener('click', (e) => {
    if (e.target === DOM.photoLightbox || e.target.classList.contains('lightbox-image-wrap')) closePhotoLightbox();
  });

  // Explainer & Presenter Walkthrough Controls
  DOM.openExplainerBtn?.addEventListener('click', openExplainerModal);
  DOM.closeExplainerBtn?.addEventListener('click', closeExplainerModal);
  DOM.explainerCloseActionBtn?.addEventListener('click', closeExplainerModal);
  DOM.explainerModalBackdrop?.addEventListener('click', closeExplainerModal);
  DOM.explainerTourActionBtn?.addEventListener('click', startInteractiveTour);

  // In-Feed Feature Spotlight
  DOM.spotlightTourBtn?.addEventListener('click', startInteractiveTour);
  DOM.spotlightWhyBtn?.addEventListener('click', openExplainerModal);
  DOM.dismissSpotlightBtn?.addEventListener('click', () => {
    DOM.featureSpotlightCard?.classList.add('hidden');
  });

  // Search Mode Comparison Switcher
  DOM.modeAiMemoryBtn?.addEventListener('click', () => setSearchMode('ai_memory'));
  DOM.modeStandardBtn?.addEventListener('click', () => setSearchMode('standard'));
  DOM.switchToAiSearchBtn?.addEventListener('click', () => setSearchMode('ai_memory'));

  // Guided Tour Widget
  DOM.startInteractiveTourBtn?.addEventListener('click', startInteractiveTour);
  DOM.tourNextBtn?.addEventListener('click', nextTourStep);
  DOM.tourPrevBtn?.addEventListener('click', prevTourStep);
  DOM.tourCloseBtn?.addEventListener('click', closeTour);

  // Explainer Modal Scenario Jump Pills
  document.querySelectorAll('.explainer-scenario-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const scKey = pill.getAttribute('data-scenario');
      if (scKey && SCENARIOS[scKey]) {
        state.currentScenarioKey = scKey;
        if (DOM.scenarioSelect) DOM.scenarioSelect.value = scKey;
        renderCurrentScenario();
        closeExplainerModal();
        showToast(`Loaded scenario: ${SCENARIOS[scKey].title}`);
      }
    });
  });

  // Global Escape key handler
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePhotoLightbox();
      closeReviewModal();
      closeMemoryInputSheet();
      closeExplainerModal();
      closeCustomUploadModal();
      closeTimeMachineModal();
      closeTour();
    }
  });

  // Settings Toggles
  DOM.settingSmartPrompts.addEventListener('change', renderCurrentScenario);

  DOM.frequencyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.frequencyButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Prompt frequency set to ${btn.textContent.split(' ')[0]}`);
    });
  });

  DOM.exportDataBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.savedMemories, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "google_photos_memory_context_export.json");
    dlAnchorElem.click();
    showToast('Exported memory data as JSON.');
  });

  DOM.deleteAllMemoriesBtn.addEventListener('click', () => {
    if (confirm('Permanently wipe all AI Memory Context data?')) {
      state.clearAllMemories();
      renderCurrentScenario();
      showToast('All AI memory data deleted.');
    }
  });
}

// Switch Active Tab
function switchTab(tabId) {
  state.activeTab = tabId;

  DOM.navButtons.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  DOM.tabViews.forEach(view => {
    if (view.id === tabId) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  if (tabId === 'tabMemories') {
    renderMemoriesManager();
  }
}

// Dismiss Prompt
function dismissPrompt(permanent = false) {
  const s = state.getScenario();
  state.dismissedClusters[s.id] = true;

  if (permanent) {
    DOM.settingSmartPrompts.checked = false;
    showToast('Smart prompts turned off in Settings.', true, () => {
      DOM.settingSmartPrompts.checked = true;
      delete state.dismissedClusters[s.id];
      renderCurrentScenario();
    });
  } else {
    showToast('Prompt dismissed. We\'ll ask again later.', true, () => {
      delete state.dismissedClusters[s.id];
      renderCurrentScenario();
    });
  }

  renderCurrentScenario();
}

// Start App on DOM Ready
document.addEventListener('DOMContentLoaded', initApp);
