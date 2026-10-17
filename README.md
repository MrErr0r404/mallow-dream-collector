# ✦ Mallow — The Little Dream Collector

> *A tiny lavender ghost who collects forgotten dreams and repairs unfinished stories.*

**haX.baby — Baby's First Website Hackathon 2026** · Track 2: Your Own Baby

![Mallow Character](public/images/mallow-hero.svg)

---

## ✦ About

Mallow is a completely original character — a friendly, floating lavender ghost creature who lives in The Forgotten Things Library, a whimsical space hidden between bedtime and morning. This website is Mallow's personal corner of the internet: a handcrafted, interactive experience inspired by the magic of early personal websites, reimagined with modern frontend quality.

Every interaction, every animation, every tiny detail is designed to make you feel like you've discovered a forgotten treasure on the early web.

---

## ✦ Features

### Core Experience
- **Original Character Design** — Custom AI-generated and SVG artwork of Mallow with 4 interactive expressions (Happy, Sleepy, Curious, Surprised)
- **Character Sheet** — Complete scrapbook-style profile with personality, quirks, favorites, and abilities
- **Day/Night Theme** — Full theme system with smooth transitions, respects `prefers-color-scheme`, persists choice
- **Responsive Design** — Desktop, tablet, and mobile layouts tested at 360px–1440px
- **Accessibility** — Semantic HTML, keyboard navigation, visible focus states, `prefers-reduced-motion` support

### Three Interactive Projects
1. **The Story Repair Shop** — Read an unfinished story and choose from three possible endings. Each choice reveals animated text with a unique narrative conclusion and a restart option.
2. **The Memory Lantern** — Browse glowing lanterns containing memories. Add your own memories (stored locally in your browser). Delete custom entries. Privacy-first design.
3. **The Dream Delivery Route** — Follow Mallow through a hand-drawn SVG neighborhood map delivering dreams to 5 stops. Animated path drawing, stop highlighting, and progress tracking.

### Interactive Origin Story
- 4 scroll-driven chapters with IntersectionObserver
- Staggered text reveals and parallax decorations
- Vertical timeline progress indicator
- Each scene has distinct visual composition

### Immersive Interactions
- **Pointer Tracking** — Mallow's hero illustration follows your cursor
- **Sparkle Cursor Trail** — Old-school canvas-based glitter trail (desktop only)
- **Web Audio Synthesis** — Music-box chimes, click sounds, and bell effects via the Web Audio API
- **Sound Toggle** — Global mute/unmute control, starts muted, respects browser autoplay
- **Visitor Counter** — Retro odometer-style digit animation with localStorage (clearly labeled as local demo)
- **Chaos Mode** — Optional fun toggle that amplifies particles and adds playful motion

### Hidden Easter Egg
- Click Mallow's character 5 times in the hero, OR click the secret star in the footer 5 times, OR type "mallow", "dream", or "star" on your keyboard
- Unlocks the **Secret Dream Room** with confetti, a hidden collectible, and Mallow's special expression
- Uses canvas-confetti with the project's color palette

---

## ✦ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 |
| Build Tool | Vite 6 |
| Animations | Motion (Framer Motion) |
| Icons | Lucide React |
| Confetti | canvas-confetti |
| Audio | Web Audio API (synthesized) |
| Styling | CSS Custom Properties, Flexbox, Grid |
| Fonts | Fredoka, DM Serif Display, Inter (Google Fonts) |

No backend. No database. No heavy dependencies. Just pure frontend craft.

---

## ✦ Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# (Optional) Copy generated character artwork
node setup-assets.js

# Start development server
npm run dev
```

The site opens at **http://localhost:3000**.

### Production Build

```bash
npm run build
npm run preview
```

---

## ✦ Project Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Sticky navigation with theme/sound/chaos controls
│   ├── Hero.jsx + Hero.css  # Animated hero with pointer tracking
│   ├── CharacterSheet.jsx   # Interactive character profile
│   ├── StoryRepairShop.jsx  # Choose-your-ending interactive story
│   ├── MemoryLantern.jsx    # Glowing memory cards with add/delete
│   ├── DreamRoute.jsx       # Animated SVG delivery map
│   ├── StoryTimeline.jsx    # Scroll-driven origin story
│   ├── MemoryCollection.jsx # Visitor memory form
│   ├── SparkleTrail.jsx     # Canvas cursor trail
│   ├── VisitorCounter.jsx   # Retro odometer counter
│   ├── SecretDreamRoom.jsx  # Easter egg modal
│   └── Footer.jsx           # Storybook-ending footer
├── hooks/
│   ├── useTheme.js          # Theme management with localStorage
│   ├── useSound.js          # Web Audio synthesis engine
│   ├── useReducedMotion.js  # Accessibility motion preference
│   └── usePointerReaction.js # Normalized pointer tracking
├── data/
│   ├── character.js         # Mallow's character data
│   ├── projects.js          # Project content
│   └── story.js             # Origin story scenes
├── styles/
│   ├── tokens.css           # Design tokens & theme variables
│   ├── global.css           # Global styles & utilities
│   └── animations.css       # Keyframe animation library
├── App.jsx                  # Main app with context providers
└── main.jsx                 # Vite entry point
```

---

## ✦ Design System

### Color Palette
| Name | Day | Night |
|------|-----|-------|
| Background | `#fff8f1` Warm Cream | `#1a1630` Deep Night |
| Text | `#5c4033` Warm Brown | `#e8e0f5` Light Lavender |
| Accent | `#a34063` Rich Berry | `#f4cc77` Warm Gold |
| Cards | `#ffffff` White | `#252040` Dark Purple |
| Borders | `#c7b5f5` Lavender | `#3d3560` Muted Purple |

### Typography
- **Display**: DM Serif Display — editorial headings
- **UI**: Fredoka — playful interface elements
- **Body**: Inter — readable body text

---

## ✦ Accessibility

- Semantic HTML5 throughout
- All interactive elements are keyboard accessible
- Visible focus indicators in both themes
- `prefers-reduced-motion` disables all animations
- `prefers-color-scheme` sets initial theme
- Sound starts muted; no autoplay
- Image alt text on all illustrations
- ARIA labels on all controls
- No color-only status communication

---

## ✦ Credits

- **Character & Artwork**: Original creation for haX.baby 2026
- **Fonts**: [Fredoka](https://fonts.google.com/specimen/Fredoka), [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display), [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Confetti**: [canvas-confetti](https://www.kirilv.com/canvas-confetti/)
- **Audio**: All sounds synthesized with the Web Audio API

---

## ✦ License

Created for the haX.baby Baby's First Website Hackathon 2026.

---

*"Every little story deserves a happy ending." — Mallow ✦*
