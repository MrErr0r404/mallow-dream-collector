export const projects = [
  {
    id: 'story-repair-shop',
    title: 'The Story Repair Shop',
    tagline: 'Mending unfinished tales with golden thread and starlight',
    description: 'Every unfinished story leaves a small, chilly draft in the universe. In this cozy corner lined with ink bottles and parchment spools, Mallow listens to the beginnings of abandoned tales and gently stitches on warm, luminous endings.',
    category: 'Interactive Tale Workshop',
    icon: 'feather',
    badge: 'Open for Repairs',
    story: {
      id: 'clockwork-sparrow',
      title: 'The Clockwork Sparrow Who Forgot How to Sing',
      author: 'An unknown child, autumn 1994',
      dateFound: 'Autumn Equinox',
      premise: 'High in the bell tower of Whispering Hollow lived a small brass sparrow named Pip. Handcrafted by an elderly clockmaker, Pip was wound every dawn to sing the morning awake. But when the clockmaker moved away and the brass winding key was misplaced in the fallen leaves, Pip fell silent on his stone perch, his copper gears growing cold under the autumn frost.',
      unfinishedEnding: 'Pip tilted his head toward the morning horizon. He opened his tiny brass beak to call out to the sun, but only a quiet, rusted click echoed into the quiet dawn. Without the winding key, his song had slipped away into the silence...',
      prompt: 'Help Mallow repair Pip\'s ending by choosing how his song returns to the valley:',
      endings: [
        {
          id: 'wind-song',
          title: 'The Song of the North Wind',
          choiceLabel: 'Whisper with the Wind',
          color: '#f4cc77',
          icon: 'wind',
          summary: 'A gentle mountain breeze whistles through Pip\'s hollow brass reeds.',
          text: 'The evening breeze swirled through the louvers of the belfry. Gently, with the tenderness of an old friend, the North Wind touched Pip\'s cold wings. Air rushed through his tiny hollow reeds, stirring cogs that had slept for months. A single pure chime rang out—then another, and another—until the whole valley tilted their heads toward the sky, smiling at the return of the clockwork song.',
          morale: 'Sometimes, letting the world breathe through you is all the wind-up you need.'
        },
        {
          id: 'starlight-key',
          title: 'The Star That Fell Into the Belfry',
          choiceLabel: 'Summon Celestial Starlight',
          color: '#c7b5f5',
          icon: 'star',
          summary: 'A wandering starlight beam slips right into Pip\'s keyhole.',
          text: 'As midnight fell, Mallow guided a wandering star down through the quiet rafters. With a soft click, the star\'s tail fit neatly into the keyhole on Pip\'s back. Warm golden light flooded the sparrow\'s copper gears. Pip blinked his sapphire eyes, fluttered his feather-thin metal wings, and burst into a song of starlight so brilliant that even the sleepy owls woke to dance.',
          morale: 'The brightest lights find you when you think you are completely forgotten.'
        },
        {
          id: 'childs-ribbon',
          title: 'The Little Weaver\'s Velvet Scarf',
          choiceLabel: 'Wrap with Human Kindness',
          color: '#f6dce8',
          icon: 'heart',
          summary: 'A visiting child wraps Pip in warm wool and hums the melody.',
          text: 'A little girl following a trail of starry dust found Pip resting in the belfry dust. She did not have the lost brass key, but she had a silver spool and a warm pocket. Carefully wiping away the dust, she wrapped Pip in a soft velvet scarf and hummed the melody she remembered her grandfather singing. The clockwork heart inside Pip gave a little flutter—and began to sing in warm harmony.',
          morale: 'Kindness is a perpetual winding key.'
        }
      ]
    }
  },
  {
    id: 'memory-lantern',
    title: 'The Memory Lantern',
    tagline: 'Safekeeping quiet, tender moments from fading into the mist',
    description: 'A glowing brass and blown-glass lantern where cherished memories are preserved. Visitors can warm their hands by the glow of these five gentle moments, or whisper a memory of their own into the glass.',
    category: 'Memory Sanctuary',
    icon: 'lantern',
    badge: '5 Memories Glowing',
    memories: [
      {
        id: 'mem-1',
        title: 'Rain on the Sunroom Tin Roof',
        date: 'May 14, 2018',
        donor: 'A sleepy reader wrapped in a quilt',
        description: 'Drinking sweet chamomile tea while a steady afternoon rain tapped rhythmically against the corrugated tin, turning the sunroom into a private island of warmth.',
        color: '#c7b5f5',
        glowColor: 'rgba(199, 181, 245, 0.4)',
        warmth: 88,
        mood: 'Peaceful',
        tag: 'Rain & Tea'
      },
      {
        id: 'mem-2',
        title: 'First Sled Down Pinecone Hill',
        date: 'December 22, 2009',
        donor: 'A winter adventurer with cold knees',
        description: 'The whoosh of icy air on flushed cheeks, flying over powdery drifts with three friends piled onto one wooden toboggan, tumbling into snowbanks in breathless giggles.',
        color: '#f4cc77',
        glowColor: 'rgba(244, 204, 119, 0.4)',
        warmth: 95,
        mood: 'Joyful',
        tag: 'Winter Laughter'
      },
      {
        id: 'mem-3',
        title: 'One Hundred Pastel Cranes',
        date: 'August 03, 2021',
        donor: 'Midnight origami dreamer',
        description: 'Folding paper cranes under a flashlight blanket fort until fingers grew clumsy, stringing each crane with gold thread to hang above a sick friend\'s windowsill.',
        color: '#f6dce8',
        glowColor: 'rgba(246, 220, 232, 0.4)',
        warmth: 92,
        mood: 'Loving',
        tag: 'Friendship Wish'
      },
      {
        id: 'mem-4',
        title: 'Fireflies in the Summer Lawn',
        date: 'July 19, 2015',
        donor: 'A barefoot stargazer',
        description: 'Cupping warm summer grass in small palms, catching tiny blinking amber lanterns in a clean jam jar, and gently uncapping it so they could float back to the stars.',
        color: '#a34063',
        glowColor: 'rgba(163, 64, 99, 0.4)',
        warmth: 86,
        mood: 'Enchanted',
        tag: 'Golden Summer'
      },
      {
        id: 'mem-5',
        title: 'The Cat Sleeping on the Encyclopedias',
        date: 'November 05, 2023',
        donor: 'Afternoon library wanderer',
        description: 'A round tuxedo cat purring loudly on the \'M\' volume of the old encyclopedia set, bathed in a square of late autumn sun as dust motes danced in the quiet air.',
        color: '#eee7ff',
        glowColor: 'rgba(238, 231, 255, 0.4)',
        warmth: 90,
        mood: 'Serene',
        tag: 'Quiet Cozy'
      }
    ]
  },
  {
    id: 'dream-route',
    title: 'Dream Delivery Route',
    tagline: 'Mallow\'s nightly flight path through the sleeping world',
    description: 'Every evening at twilight, Mallow shoulders the starlight satchel and takes flight along five secret waypoints across the rooftops, gathering drifting dreams and repairing forgotten hopes before dawn.',
    category: 'Celestial Cartography',
    icon: 'route',
    badge: 'Nightly Route Active',
    stops: [
      {
        id: 'stop-1',
        name: 'The Whispering Willows',
        time: '9:00 PM',
        dreamType: 'Gentle Lullabies',
        status: 'Collected',
        description: 'Ancient weeping willows by the pond catch evening lullabies hummed through open nursery windows. Mallow gently combs the leafy branches to collect the drifting notes.',
        location: 'West Meadow Pond',
        coordinates: { x: 16, y: 32 },
        notes: 'Abundant sweet hums, lightly damp with river mist.'
      },
      {
        id: 'stop-2',
        name: 'The Chimney-Top Gardens',
        time: '11:15 PM',
        dreamType: 'Stargazer Wishes',
        status: 'Delivered',
        description: 'High above sleeping cobblestones, dreamers sit in thick socks with steaming mugs, gazing at constellations. Mallow leaves a warm star on each windowsill.',
        location: 'Old Town Rooftops',
        coordinates: { x: 38, y: 22 },
        notes: 'Spiced cinnamon smoke; high concentration of hopeful whispers.'
      },
      {
        id: 'stop-3',
        name: 'The Lost Toy Sandbox',
        time: '1:30 AM',
        dreamType: 'Forgotten Daydreams',
        status: 'Repairing',
        description: 'Where buried wooden sailboats and tin soldiers dream of grand oceanic voyages. Mallow dusts them off with starlight to keep their adventures alive.',
        location: 'Schoolyard Corner',
        coordinates: { x: 58, y: 56 },
        notes: 'Repaired two treasure maps and patched a small dragon wing.'
      },
      {
        id: 'stop-4',
        name: 'The Cloud Rest Observatory',
        time: '3:45 AM',
        dreamType: 'Celestial Flights',
        status: 'Inspecting',
        description: 'A brass dome overlooking the mist. Dreams of flying without wings collect on the cool brass telescope barrel like morning dew.',
        location: 'High Peak Ridge',
        coordinates: { x: 78, y: 30 },
        notes: 'Reflected starlight is brilliant; gathered three flight dreams.'
      },
      {
        id: 'stop-5',
        name: 'The Forgotten Things Library',
        time: '5:30 AM',
        dreamType: 'Safe Haven Sanctuary',
        status: 'Home Base',
        description: 'Mallow\'s quiet home. All gathered dreams are transferred into blown-glass bottles and placed on cedar shelves next to unfinished fairy tales.',
        location: 'Secret Library Shelf',
        coordinates: { x: 92, y: 68 },
        notes: 'Warm tea boiling on kettle; all dreams resting peacefully.'
      }
    ]
  }
];

export default projects;
