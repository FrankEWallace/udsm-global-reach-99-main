# UDSM Journal Analytics - Design System & Branding Guide

> **University of Dar es Salaam**  
> Complete visual identity, color palette, typography, and component styling reference

---

## 🎨 Brand Identity

### University Information
- **Full Name**: University of Dar es Salaam
- **Acronym**: UDSM
- **Motto**: *"Hekima ni Uhuru"* (Knowledge is Freedom)
- **Logo**: UDSM Coat of Arms
- **Platform**: Journal Analytics Dashboard

---

## 🌈 Color Palette

### Primary Colors

#### UDSM Blue (Primary Brand Color)
```
HEX:  #235dcb
RGB:  42, 110, 187
HSL:  210, 63%, 45%
Tailwind CSS Variable: hsl(var(--primary))
```
**Usage**: Main brand color, primary buttons, links, active states, sidebar accents

#### UDSM Navy (Dark Variant)
```
HEX:  #1a3d5c (Darkest)
HEX:  #1e4a6e (Mid-tone)
HEX:  #235dcb (Primary)
HSL:  210, 50%, 14% (Dark)
HSL:  210, 45%, 20% (Mid)
```
**Usage**: Sidebar background gradient, headers, dark sections

#### UDSM Gold (Accent Color)
```
HEX:  #EAB308
RGB:  234, 179, 8
HSL:  43, 85%, 55%
Tailwind CSS Variable: hsl(var(--accent))
```
**Usage**: Highlights, active navigation icons, important badges, call-to-action elements

---

### Sidebar Gradient

The signature UDSM sidebar uses a vertical gradient:

```css
background: linear-gradient(180deg, 
  #1a3d5c 0%,    /* Dark navy top */
  #1e4a6e 40%,   /* Mid navy */
  #235dcb 100%   /* UDSM Blue bottom */
);
```

**HSL Equivalent**:
```css
background: linear-gradient(180deg,
  hsl(210, 50%, 14%) 0%,
  hsl(210, 45%, 20%) 40%,
  hsl(210, 63%, 45%) 100%
);
```

---

### Secondary Colors

#### Success (Green)
```
HEX:  #10B981
HSL:  152, 60%, 42%
Tailwind: emerald-400/500
```
**Usage**: Success messages, positive metrics, live indicators

#### Warning (Amber/Orange)
```
HEX:  #F59E0B
HSL:  38, 92%, 50%
Tailwind: amber-500
```
**Usage**: Warnings, pending states, notifications

#### Destructive (Red)
```
HEX:  #DC2626
HSL:  0, 72%, 51%
Tailwind: red-600
```
**Usage**: Errors, delete actions, critical alerts

#### Muted/Gray Scale
```
Background:    hsl(210, 20%, 97%)  - Off-white
Border:        hsl(210, 20%, 90%)  - Light gray
Muted:         hsl(210, 20%, 95%)  - Subtle gray
Foreground:    hsl(213, 35%, 15%)  - Dark text
Muted Text:    hsl(213, 15%, 50%)  - Gray text
```

---

### Chart Colors

```css
--chart-1: hsl(210, 63%, 45%)  /* UDSM Blue */
--chart-2: hsl(43, 85%, 55%)   /* UDSM Gold */
--chart-3: hsl(152, 60%, 42%)  /* Green */
--chart-4: hsl(280, 60%, 50%)  /* Purple */
--chart-5: hsl(0, 72%, 51%)    /* Red */
```

---

## 🔤 Typography

### Font Families

#### Headings: Source Serif 4
```css
font-family: 'Source Serif 4', 'Georgia', serif;
font-weights: 400 (Regular), 600 (Semi-Bold), 700 (Bold)
```
**Google Fonts Import**:
```html
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap');
```

**Usage**: All headings (H1-H6), page titles, section headers

#### Body: Inter
```css
font-family: 'Inter', system-ui, sans-serif;
font-weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
```
**Google Fonts Import**:
```html
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

**Usage**: Body text, buttons, navigation, UI elements

---

### Font Sizing & Weights

#### Headings
```css
H1: 2.25rem (36px) - font-bold (700)
H2: 1.875rem (30px) - font-semibold (600)
H3: 1.5rem (24px) - font-semibold (600)
H4: 1.25rem (20px) - font-medium (500)
H5: 1.125rem (18px) - font-medium (500)
H6: 1rem (16px) - font-medium (500)
```

#### Body Text
```css
Base:       1rem (16px) - font-normal (400)
Small:      0.875rem (14px) - font-normal (400)
Extra Small: 0.75rem (12px) - font-normal (400)
Tiny:       0.625rem (10px) - font-medium (500)
```

#### Sidebar Specific
```css
University Name: 13px - font-bold - tracking-wide
Subtitle:        10px - font-medium - uppercase - tracking-[0.15em]
Menu Label:      10px - font-semibold - uppercase - tracking-[0.2em]
Nav Items:       14px (sm) - font-medium
Footer:          9-10px - font-normal
```

---

## 📐 Layout & Spacing

### Breakpoints
```typescript
xs:  475px   // Extra small devices
sm:  640px   // Small devices (phones)
md:  768px   // Medium devices (tablets)
lg:  1024px  // Large devices (desktops) - Sidebar appears
xl:  1280px  // Extra large screens
2xl: 1536px  // Ultra-wide screens
```

### Sidebar
```
Width: 16rem (256px)
Position: Fixed left on lg+ screens
Mobile: Slide-in drawer (full overlay)
Z-index: 40 (desktop), 50 (mobile drawer)
```

### Content Area
```
Desktop (lg+): margin-left: 16rem (256px)
Mobile: Full width, hamburger menu
Padding: 1rem (mobile), 1.5-2rem (desktop)
```

### Border Radius
```css
--radius: 0.5rem (8px)   // Base
lg: 0.5rem               // Large
md: 0.375rem             // Medium (radius - 2px)
sm: 0.25rem              // Small (radius - 4px)
```

---

## 🎭 Component Styling

### Sidebar

#### Background
```css
background: linear-gradient(180deg, #1a3d5c 0%, #1e4a6e 40%, #235dcb 100%);
```

#### Logo Section
```css
Border: border-b border-white/10
Logo Circle: 
  - Size: 3.5rem (56px)
  - Background: white/95
  - Shadow: shadow-lg
  - Logo Image: 2.75rem (44px)
```

#### Navigation Items
```css
/* Inactive */
Text: text-blue-100/70
Background: transparent
Hover: bg-white/10, text-white

/* Active */
Text: text-white
Background: bg-white/15
Shadow: shadow-sm
Backdrop: backdrop-blur-sm
Icon: text-yellow-400 (UDSM Gold)
```

#### Live Indicator
```css
Size: 0.5rem (8px) rounded-full
Color: bg-emerald-400
Animation: animate-pulse
```

#### Footer
```css
Border: border-t border-white/10
Icon Color: text-blue-200/30-40
Text Size: 9-10px
Opacity: 30-40%
```

---

### Cards

#### Standard Card
```css
Background: bg-white (light) / bg-card (dark)
Border: border border-gray-200
Border Radius: rounded-lg
Shadow: shadow-sm
Padding: p-4 to p-6

Hover State:
Shadow: shadow-md
Transform: scale-[1.02]
Transition: all 0.2s ease
```

#### KPI Card (Metrics)
```css
Background: white
Border: border-l-4 with accent color
  - Blue: border-l-blue-500
  - Green: border-l-emerald-500
  - Gold: border-l-yellow-500
  - Purple: border-l-purple-500
```

---

### Buttons

#### Primary Button
```css
Background: bg-primary (UDSM Blue)
Text: text-white
Hover: bg-primary/90
Padding: px-4 py-2
Border Radius: rounded-md
Font Weight: font-medium
```

#### Secondary Button
```css
Background: bg-secondary
Text: text-secondary-foreground
Hover: bg-secondary/80
```

#### Destructive Button
```css
Background: bg-destructive (Red)
Text: text-white
Hover: bg-destructive/90
```

#### Ghost Button
```css
Background: transparent
Text: text-foreground
Hover: bg-accent/10
```

---

### Tables

#### Desktop Table
```css
Border: border rounded-lg
Header Background: bg-muted/50
Row Hover: bg-muted/50
Border Color: border-border
```

#### Mobile Cards (Responsive)
```css
Display: md:hidden (mobile only)
Background: bg-white
Border: border rounded-lg
Shadow: shadow-sm
Padding: p-4
Gap: space-y-2
```

---

### Charts

#### Colors
Use chart color variables in order:
1. UDSM Blue (`hsl(var(--chart-1))`)
2. UDSM Gold (`hsl(var(--chart-2))`)
3. Green (`hsl(var(--chart-3))`)
4. Purple (`hsl(var(--chart-4))`)
5. Red (`hsl(var(--chart-5))`)

#### Responsive Heights
```css
Mobile (< sm): height: 280px
Desktop (sm+): height: 320px
```

---

## 🎯 Interactive States

### Hover Effects
```css
Buttons: opacity-90 or brightness-90
Cards: shadow-md + scale-[1.02]
Links: text-primary/80
Navigation: bg-white/10
```

### Active/Focus States
```css
Ring: ring-2 ring-primary ring-offset-2
Outline: outline-none (use ring instead)
```

### Disabled State
```css
Opacity: opacity-50
Cursor: cursor-not-allowed
Pointer Events: pointer-events-none
```

---

## 📱 Mobile Optimizations

### Touch Targets
```css
/* Minimum tap target size */
@media (max-width: 768px) {
  button, a, input, select, textarea {
    min-height: 44px;
    min-width: 44px;
  }
}
```

### Mobile Scrolling
```css
-webkit-overflow-scrolling: touch;
overflow-x: clip; /* Prevent horizontal scroll */
```

### Text Size Adjustment
```css
-webkit-text-size-adjust: 100%;
-moz-text-size-adjust: 100%;
text-size-adjust: 100%;
```

### Hamburger Menu
```css
Icon: Menu from lucide-react
Size: h-6 w-6
Color: text-white
Display: lg:hidden (mobile only)
Position: Absolute or in header
Padding: p-2
Background: bg-primary or transparent
```

### Mobile Drawer
```css
Width: 16rem (256px)
Position: fixed left-0 top-0
Z-index: 50
Transform: translate-x-0 (open) / -translate-x-full (closed)
Transition: transform 300ms ease-in-out
Backdrop: bg-black/60 backdrop-blur-sm
```

---

## 🌓 Dark Mode Support

### Dark Mode Colors
```css
Background:    hsl(210, 40%, 8%)   - Very dark blue
Card:          hsl(210, 35%, 12%)  - Dark blue-gray
Primary:       hsl(210, 65%, 55%)  - Brighter blue
Border:        hsl(210, 25%, 20%)  - Dark border
Text:          hsl(210, 20%, 92%)  - Light text
```

### Implementation
```typescript
// Tailwind config
darkMode: ["class"]

// Toggle with:
document.documentElement.classList.toggle('dark')
```

---

## ✨ Animations

### Pulse Glow (Live Indicators)
```css
@keyframes pulse-glow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.15); }
}
animation: pulse-glow 2s ease-in-out infinite;
```

### Accordion
```css
accordion-down: 0.2s ease-out
accordion-up: 0.2s ease-out
```

### Transitions
```css
Standard: transition-all duration-200
Cards: transition-all duration-200
Drawer: transition-transform duration-300 ease-in-out
Hover: transition-colors duration-200
```

---

## 🎨 Utility Classes

### Custom Utilities

#### Gold Variants
```css
.text-gold { color: hsl(var(--gold)); }
.bg-gold { background-color: hsl(var(--gold)); }
.border-gold { border-color: hsl(var(--gold)); }
```

#### Shadows
```css
.shadow-card {
  box-shadow: 0 1px 3px 0 hsl(var(--foreground) / 0.04),
              0 1px 2px -1px hsl(var(--foreground) / 0.04);
}

.shadow-card-hover {
  box-shadow: 0 4px 12px 0 hsl(var(--foreground) / 0.08),
              0 2px 4px -1px hsl(var(--foreground) / 0.04);
}
```

#### Gradients
```css
.gradient-primary {
  background: linear-gradient(135deg, 
    hsl(var(--primary)), 
    hsl(210, 55%, 55%)
  );
}

.gradient-gold {
  background: linear-gradient(135deg, 
    hsl(var(--gold)), 
    hsl(38, 80%, 50%)
  );
}
```

---

## 📦 Complete Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        heading: ['Source Serif 4', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... (see full config in tailwind.config.ts)
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

## 🎯 CSS Variables Reference

```css
:root {
  /* Primary Brand */
  --primary: 210 63% 45%;           /* #235dcb UDSM Blue */
  --primary-foreground: 0 0% 100%;  /* White text */
  
  /* Accent */
  --accent: 43 85% 55%;             /* #EAB308 UDSM Gold */
  --accent-foreground: 213 35% 15%; /* Dark text */
  
  /* Backgrounds */
  --background: 210 20% 97%;        /* Off-white */
  --foreground: 213 35% 15%;        /* Dark blue-gray */
  --card: 0 0% 100%;                /* White */
  
  /* Sidebar */
  --sidebar-background: 210 50% 14%;         /* #1a3d5c Navy */
  --sidebar-foreground: 210 20% 85%;         /* Light text */
  --sidebar-primary: 210 63% 55%;            /* Bright blue */
  --sidebar-accent: 210 50% 20%;             /* Dark accent */
  --sidebar-border: 210 40% 22%;             /* Border */
  
  /* Semantic Colors */
  --success: 152 60% 42%;           /* Green */
  --warning: 38 92% 50%;            /* Orange */
  --destructive: 0 72% 51%;         /* Red */
  
  /* Charts */
  --chart-1: 210 63% 45%;           /* UDSM Blue */
  --chart-2: 43 85% 55%;            /* UDSM Gold */
  --chart-3: 152 60% 42%;           /* Green */
  --chart-4: 280 60% 50%;           /* Purple */
  --chart-5: 0 72% 51%;             /* Red */
}
```

---

## 🚀 Quick Start Implementation

### 1. Install Dependencies
```bash
npm install tailwindcss tailwindcss-animate
npm install @radix-ui/react-slot lucide-react
```

### 2. Import Fonts (index.html or CSS)
```css
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
```

### 3. Copy CSS Variables
Copy the `:root` variables from `src/index.css` to your project.

### 4. Apply Colors
```tsx
// Primary button
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Click me
</button>

// Gold badge
<span className="bg-gold text-gold-foreground px-2 py-1 rounded">
  Featured
</span>

// UDSM Blue card
<div className="bg-white border-l-4 border-l-primary p-6 rounded-lg">
  Content
</div>
```

---

## 📝 Brand Voice & Messaging

### Tagline Options
- "Made by Metatron"
- "Hekima ni Uhuru" (Knowledge is Freedom)
- "University of Dar es Salaam - Journal Analytics"

### Icon Usage
- **GraduationCap**: Academic/university branding
- **BarChart3**: Analytics/statistics
- **BookOpen**: Journals/publications
- **Activity**: Live data/engagement
- **Globe**: Public/global view

---

## 📸 Logo Guidelines

### UDSM Coat of Arms
- **Format**: PNG with transparency
- **Minimum Size**: 40x40px (44px recommended)
- **Background**: White circle (bg-white/95)
- **Padding**: Contained within 56px circle
- **Shadow**: Use shadow-lg for elevation

### Display Rules
```tsx
<div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg">
  <img src={udsmLogo} alt="UDSM Coat of Arms" className="h-11 w-11 object-contain" />
</div>
```

---

## 📊 Data Visualization Colors

### Sequential (Single Metric)
Use shades of UDSM Blue:
```
hsl(210, 63%, 25%)  - Darkest
hsl(210, 63%, 35%)  - Dark
hsl(210, 63%, 45%)  - Base
hsl(210, 63%, 55%)  - Light
hsl(210, 63%, 65%)  - Lightest
```

### Categorical (Multiple Metrics)
Use in order: Blue → Gold → Green → Purple → Red

### Diverging (Comparison)
- Negative: Red shades
- Neutral: Gray
- Positive: Green shades

---

## 🎨 Summary Card

```
┌─────────────────────────────────────────┐
│   UDSM Journal Analytics Design System  │
├─────────────────────────────────────────┤
│ Primary:    #235dcb (UDSM Blue)         │
│ Accent:     #EAB308 (UDSM Gold)         │
│ Navy:       #1a3d5c → #235dcb           │
│                                         │
│ Heading:    Source Serif 4              │
│ Body:       Inter                       │
│                                         │
│ Breakpoint: lg (1024px) for desktop     │
│ Sidebar:    256px wide                  │
│                                         │
│ Motto:      "Hekima ni Uhuru"           │
└─────────────────────────────────────────┘
```

---

**Document Version**: 1.0  
**Last Updated**: February 15, 2026  
**Maintained by**: UDSM Development Team

For questions or updates, refer to the main project repository.
