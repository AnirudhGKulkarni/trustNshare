# Quick Reference: Using Modern Styles in Components

## 🎨 CSS Variables Reference

### Colors
```tsx
// Light Mode
--bg-light: #ffffff
--text-light-primary: #0f172a
--text-light-secondary: #64748b
--border-light: #e2e8f0
--card-light: #f1f5f9

// Dark Mode
--bg-dark: #0f172a
--text-dark-primary: #f1f5f9
--text-dark-secondary: #cbd5e1
--border-dark: #475569
--card-dark: #1e293b

// Brand Colors
--primary-color: #3b82f6 (Blue)
--accent-color: #8b5cf6 (Purple)
```

### Spacing Scale
```
--spacing-xs: 0.25rem (4px)
--spacing-sm: 0.5rem (8px)
--spacing-md: 1rem (16px)
--spacing-lg: 1.5rem (24px)
--spacing-xl: 2rem (32px)
--spacing-2xl: 3rem (48px)
--spacing-3xl: 4rem (64px)
```

### Shadows
```
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15)
```

### Transitions
```
--transition-fast: 150ms ease-in-out
--transition-base: 200ms ease-in-out
--transition-slow: 300ms ease-in-out
```

---

## 🎭 Animation Classes

### Available Animations
```tsx
// Usage: className="animate-fade-in"
// Uses keyframe animations from globals.css

<div className="animate-fade-in">Fades in with upward slide</div>
<div className="animate-slide-in-left">Slides from left</div>
<div className="animate-slide-in-right">Slides from right</div>
<div className="animate-scale-in">Scales up from 0.95</div>
<div className="animate-pulse">Pulsing opacity effect</div>
```

---

## 🎯 Common Component Patterns

### Modern Card
```tsx
<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl 
             transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700
             hover:border-blue-400 dark:hover:border-blue-500 hover:-translate-y-2">
  {/* Card content */}
</div>
```

### Modern Button
```tsx
<button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                 text-white font-bold rounded-xl shadow-lg
                 hover:shadow-xl hover:from-blue-700 hover:to-blue-800
                 transition-all duration-300 transform hover:scale-105 active:scale-95">
  Click me
</button>
```

### Modern Input
```tsx
<input className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
              transition-all duration-300"
       placeholder="Enter text" />
```

### Glassmorphism Effect
```tsx
<div className="bg-white/10 dark:bg-gray-700/50 backdrop-blur-md rounded-2xl 
             border border-white/20 dark:border-gray-600 p-8 shadow-lg">
  {/* Content */}
</div>
```

### Feature Card with Icon
```tsx
<div className="p-8 rounded-2xl border group animate-fade-in
             bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
             hover:border-blue-400 dark:hover:border-blue-500
             hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 
               rounded-xl flex items-center justify-center mb-6
               shadow-lg group-hover:scale-110 transition-transform duration-300">
    <YourIcon className="w-8 h-8 text-white" />
  </div>
  <h3 className="text-xl font-bold mb-3">{title}</h3>
  <p className="text-gray-600 dark:text-gray-400">{description}</p>
</div>
```

---

## 🌗 Theme Toggle Pattern

```tsx
const [isDarkMode, setIsDarkMode] = useState(false);

// Apply conditionally
const bgClass = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900";
const cardBgClass = isDarkMode ? "bg-gray-800" : "bg-white";

// Use in JSX
<div className={bgClass}>
  <button onClick={() => setIsDarkMode(!isDarkMode)}>
    {isDarkMode ? <Sun /> : <Moon />}
  </button>
</div>
```

---

## 📱 Responsive Grid Pattern

```tsx
// Automatically responsive across breakpoints
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
  {items.map((item, idx) => (
    <div key={idx} className="animate-fade-in" style={{animationDelay: `${idx * 0.1}s`}}>
      {/* Card content */}
    </div>
  ))}
</div>
```

Breakpoints:
- `sm:` ≥ 640px
- `md:` ≥ 768px  
- `lg:` ≥ 1024px
- `xl:` ≥ 1280px

---

## 🎬 Staggered Animation Pattern

```tsx
{items.map((item, idx) => (
  <div 
    key={idx}
    className="animate-fade-in"
    style={{animationDelay: `${idx * 0.1}s`}}
  >
    {item}
  </div>
))}

// Creates 0s, 100ms, 200ms, 300ms delays
```

---

## ⏱️ Transition Pattern for Interactive Elements

```tsx
<div className="transition-all duration-300">
  {/* Will smoothly transition all properties */}
</div>

// Specific properties:
<div className="transition-colors duration-300">
  {/* Only color changes transition */}
</div>

<div className="transition-transform duration-300">
  {/* Only transforms (scale, translate, rotate) */}
</div>
```

---

## 🖱️ Hover Effects Cheatsheet

```tsx
// Scale
className="hover:scale-105"

// Lift (translate Y)
className="hover:-translate-y-2"

// Shadow
className="hover:shadow-xl"

// Color
className="hover:text-blue-600"

// Opacity
className="hover:opacity-80"

// Rotate
className="hover:rotate-180"

// Combined (use group for parent-child)
className="group hover:shadow-lg"
```

---

## 🎪 Dropdown/Menu Pattern

```tsx
<div className="relative group">
  <button>Menu</button>
  
  <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-xl
               opacity-0 invisible group-hover:opacity-100 group-hover:visible
               transition-all duration-300 bg-white dark:bg-gray-800
               border border-gray-200 dark:border-gray-700 py-2">
    <a href="#" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700
                        transition-colors">
      Menu Item
    </a>
  </div>
</div>
```

---

## 📍 Focus States for Accessibility

```tsx
<input className="focus:outline-none focus:ring-2 focus:ring-blue-500/50 
              focus:border-blue-500 transition-all duration-300" />

<button className="focus:outline-none focus:ring-4 focus:ring-blue-400/50
               transition-all duration-300" />
```

---

## 🎨 Gradient Buttons

```tsx
// Blue to Purple
className="bg-gradient-to-r from-blue-600 to-purple-600
          hover:from-blue-700 hover:to-purple-700"

// Horizontal
className="bg-gradient-to-r" // left to right

// Vertical  
className="bg-gradient-to-b" // top to bottom

// Diagonal
className="bg-gradient-to-br" // top-left to bottom-right
```

---

## 📊 Table Modern Styling

```tsx
<table className="w-full">
  <thead className="bg-gray-50 dark:bg-gray-700">
    <tr>
      <th className="px-6 py-4 text-left font-bold">Header</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-gray-200 dark:border-gray-700 
                hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4">Cell</td>
    </tr>
  </tbody>
</table>
```

---

## 🔄 Loading States

```tsx
// Shimmer effect
className="animate-shimmer"

// Pulse effect
className="animate-pulse"

// Skeleton placeholder
<div className="bg-gray-200 dark:bg-gray-700 animate-pulse 
             rounded-lg h-12 w-full"></div>
```

---

## 📐 Common Height/Width Patterns

```tsx
// Icon buttons (touch-friendly)
className="w-10 h-10"  // 40px (minimum recommended)
className="w-12 h-12"  // 48px (comfortable)

// Form inputs
className="h-12 px-4"  // 48px height

// Spacing utilities
className="gap-4"      // 16px gap
className="gap-8"      // 32px gap
className="p-6"        // 24px padding
className="p-8"        // 32px padding
```

---

## 🎓 Implementation Checklist

When building new components:
- [ ] Use CSS variables for colors
- [ ] Add smooth transitions (300ms default)
- [ ] Include hover/focus states
- [ ] Use gradients for modern feel
- [ ] Apply rounded corners (8px-12px)
- [ ] Add subtle shadows for depth
- [ ] Ensure dark mode compatibility
- [ ] Make responsive (3+ breakpoints)
- [ ] Test accessibility (keyboard nav)
- [ ] Verify animation performance

---

## 🚀 Best Practices

1. **Animations**: Use CSS not JavaScript for better performance
2. **Colors**: Always use variables for consistency
3. **Spacing**: Use spacing scale, avoid arbitrary values
4. **Shadows**: Use shadow scale for hierarchy
5. **Borders**: Use 1px or border colors from variables
6. **Typography**: Use font weights 400, 600, 700
7. **Transitions**: Default to 300ms for most interactions
8. **Focus**: Always include focus states for accessibility
9. **Testing**: Test on real devices, not just browsers
10. **Performance**: Profile animations on mobile devices

---

Generated from UI/UX Modernization updates
Last updated: 2025
