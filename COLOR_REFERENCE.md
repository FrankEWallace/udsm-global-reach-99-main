# UDSM Color Palette Quick Reference

## 🎨 Primary Brand Colors

### UDSM Blue (Primary)
```
Color Name: UDSM Blue
HEX:        #2A6FAE
RGB:        42, 110, 187
HSL:        210, 63%, 45%
Variable:   hsl(var(--udsm-blue))
Tailwind:   text-udsm-blue, bg-udsm-blue, border-udsm-blue
            text-primary, bg-primary, border-primary
```

**Usage**: Main brand color, primary buttons, links, active states, important text

**Example**:
```tsx
<div className="text-primary">UDSM Primary Text</div>
<button className="bg-primary text-white">Primary Button</button>
```

---

### UDSM Blue Light
```
Color Name: UDSM Blue Light
HSL:        210, 63%, 55%
Variable:   hsl(var(--udsm-blue-light))
Tailwind:   text-udsm-blue-light, bg-udsm-blue-light
```

**Usage**: Lighter variant for gradients, hover states, secondary elements

---

### UDSM Gold (Accent)
```
Color Name: UDSM Gold
HEX:        #EAB308
RGB:        234, 179, 8
HSL:        43, 85%, 55%
Variable:   hsl(var(--udsm-gold))
Tailwind:   text-udsm-gold, bg-udsm-gold, border-udsm-gold
            text-secondary, bg-secondary (secondary color)
            text-accent, bg-accent (accent color)
```

**Usage**: Highlights, call-to-action, important badges, accent icons

**Example**:
```tsx
<span className="text-udsm-gold">Featured</span>
<div className="bg-accent text-accent-foreground">Accent Badge</div>
```

---

## 🌑 Navy Variants

### UDSM Navy (Dark)
```
Color Name: UDSM Navy Dark
HEX:        #1a3d5c
HSL:        210, 50%, 14%
Variable:   hsl(var(--udsm-navy))
Tailwind:   text-udsm-navy, bg-udsm-navy
```

**Usage**: Sidebar background (top), dark headers, footer

---

### UDSM Navy Mid
```
Color Name: UDSM Navy Mid
HEX:        #1e4a6e
HSL:        210, 45%, 20%
Variable:   hsl(var(--udsm-navy-mid))
Tailwind:   text-udsm-navy-mid, bg-udsm-navy-mid
```

**Usage**: Sidebar background (middle), gradient transitions

---

## ✅ Semantic Colors

### Success (Green)
```
Color Name: Success Green
HEX:        #10B981
HSL:        152, 60%, 42%
Variable:   hsl(var(--success))
Tailwind:   text-success, bg-success
            text-emerald-600, bg-emerald-600 (alternative)
```

**Usage**: Success messages, positive metrics, checkmarks

---

### Warning (Amber)
```
Color Name: Warning Amber
HEX:        #F59E0B
HSL:        38, 92%, 50%
Variable:   hsl(var(--warning))
Tailwind:   text-warning, bg-warning
```

**Usage**: Warnings, pending states, alerts

---

### Destructive (Red)
```
Color Name: Destructive Red
HSL:        0, 72%, 51%
Variable:   hsl(var(--destructive))
Tailwind:   text-destructive, bg-destructive
```

**Usage**: Errors, delete actions, critical alerts

---

## 📊 Chart Colors

Use these in order for multi-series charts:

1. **Chart 1 (UDSM Blue)**: `hsl(var(--chart-1))` - Primary data
2. **Chart 2 (UDSM Gold)**: `hsl(var(--chart-2))` - Secondary data
3. **Chart 3 (Green)**: `hsl(var(--chart-3))` - Tertiary data
4. **Chart 4 (Purple)**: `hsl(var(--chart-4))` - Additional data
5. **Chart 5 (Red)**: `hsl(var(--chart-5))` - Warning/negative data

**Example**:
```tsx
<div className="text-chart-1">Primary Series</div>
<div className="text-chart-2">Secondary Series</div>
```

---

## 🎭 Neutral Colors

### Background
```
HSL:        210, 20%, 97%
Variable:   hsl(var(--background))
Tailwind:   bg-background
```

### Foreground (Text)
```
HSL:        213, 35%, 15%
Variable:   hsl(var(--foreground))
Tailwind:   text-foreground
```

### Muted (Subtle Gray)
```
HSL:        210, 20%, 95%
Variable:   hsl(var(--muted))
Tailwind:   bg-muted, text-muted-foreground
```

### Border
```
HSL:        210, 20%, 90%
Variable:   hsl(var(--border))
Tailwind:   border-border
```

---

## 🎨 Gradient Examples

### Primary Gradient (Blue)
```css
background: linear-gradient(135deg, 
  hsl(var(--udsm-blue)) 0%, 
  hsl(var(--udsm-blue-light)) 100%
);
```

**Tailwind**:
```tsx
<div className="bg-gradient-to-r from-udsm-blue to-udsm-blue-light">
```

---

### Gold Gradient
```css
background: linear-gradient(135deg, 
  hsl(var(--udsm-gold)) 0%, 
  hsl(var(--udsm-gold-light)) 100%
);
```

---

### Sidebar Navy Gradient
```css
background: linear-gradient(180deg,
  hsl(210, 50%, 14%) 0%,    /* Navy Dark */
  hsl(210, 45%, 20%) 40%,   /* Navy Mid */
  hsl(210, 63%, 45%) 100%   /* UDSM Blue */
);
```

---

## 🔤 Typography

### Font Families

**Headings**: Source Serif 4
```tsx
<h1 className="font-heading">Heading Text</h1>
```

**Body**: Inter
```tsx
<p className="font-body">Body text</p>
<p className="font-sans">Same as body</p>
```

---

### Typography Scale

```tsx
<h1 className="text-4xl font-bold">        {/* 36px */}
<h2 className="text-3xl font-semibold">    {/* 30px */}
<h3 className="text-2xl font-semibold">    {/* 24px */}
<h4 className="text-xl font-medium">       {/* 20px */}
<h5 className="text-lg font-medium">       {/* 18px */}
<h6 className="text-base font-medium">     {/* 16px */}
```

---

## 💡 Common Usage Patterns

### Primary Button
```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Click Me
</button>
```

### Gold Accent Badge
```tsx
<span className="bg-accent text-accent-foreground px-2 py-1 rounded">
  Featured
</span>
```

### Card with Blue Left Border
```tsx
<div className="bg-card border-l-4 border-l-primary p-6 rounded-lg">
  Content
</div>
```

### Icon with Primary Color
```tsx
<GraduationCap className="w-5 h-5 text-primary" />
```

### Gradient Background
```tsx
<div className="bg-gradient-to-r from-udsm-blue to-udsm-blue-light">
  Gradient Content
</div>
```

---

## 🎯 Color Contrast Guide

### Accessible Combinations

✅ **Good Contrast**:
- White text on UDSM Blue (#2A6FAE)
- UDSM Blue text on white background
- White text on UDSM Navy (#1a3d5c)
- UDSM Gold (#EAB308) on white background

⚠️ **Use with Caution**:
- UDSM Gold text on white (ensure sufficient size)
- Light blue on white backgrounds

---

## 📱 Responsive Design

### Breakpoints
```tsx
xs:  475px    // Extra small
sm:  640px    // Small (phones)
md:  768px    // Medium (tablets)
lg:  1024px   // Large (desktops)
xl:  1280px   // Extra large
2xl: 1536px   // Ultra-wide
```

---

## 🔗 Quick Links

- Full Design System: `UDSM_DESIGN_SYSTEM.md`
- Implementation Summary: `BRANDING_UPDATES_SUMMARY.md`
- CSS Variables: `src/index.css`
- Tailwind Config: `tailwind.config.ts`

---

**Last Updated**: February 15, 2026  
**Maintained by**: UDSM Development Team
