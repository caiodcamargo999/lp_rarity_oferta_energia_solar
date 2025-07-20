# Rarity Agency Landing Page - Design Rules

## 🎨 Design System Overview

### **Brand Identity**
- **Company**: Rarity Agency
- **Tagline**: "Growth for Startups"
- **Value Proposition**: "Unlock Your Growth Engine"
- **Industry**: Digital Marketing & Growth Agency

---

## 🎯 Layout Structure

### **First Section (Above the Fold)**
1. **Logo Area** (Red Rectangle)
   - Large logo positioned at the top
   - Size: 1200px max-width
   - Minimal padding: 0.5rem
   - Margin-bottom: 0.3rem

2. **Headline & Subheadline** (Yellow Rectangle)
   - Headline: "Unlock Your Growth Engine"
   - Font size: 2.2rem
   - Gradient text effect on "Growth Engine"
   - Subheadline: Descriptive text about services
   - Font size: 1rem
   - Max-width: 500px
   - Minimal spacing between elements

3. **Video Section** (Green Rectangle)
   - Label: "SEE OUR APPROACH IN ACTION"
   - Horizontal rectangle format (4:1 aspect ratio)
   - Max-width: 900px
   - Height: 200px
   - Play button icon centered

4. **Call-to-Action Button**
   - Text: "Book a Free Strategy Call"
   - Purple gradient background
   - Rounded corners (50px border-radius)
   - Hover effects with lift animation

### **Second Section**
- **Success Cases/Testimonials**
- Three cards with metrics and results
- Grid layout (responsive)
- Hover effects on cards

---

## 🌈 Color Palette

### **Primary Colors**
- **Background**: Dark gradient (#0a0a0a → #1a0a1a → #2a0a2a → #1a0a1a → #0a0a0a)
- **Text**: White (#F5F5F5)
- **Primary Accent**: Purple (#8A2BE2)
- **Secondary Accent**: Light Purple (#DA70D6)

### **Background Effects**
- **Base Gradient**: 135-degree diagonal gradient
- **Purple Accent Circles**: Multiple radial gradients with 0.05-0.1 opacity
- **Starry Effect**: White speckles (1px-2px) with 0.1 opacity
- **Fixed Background**: Background stays in place while scrolling

### **Text Colors**
- **Primary Text**: White (#F5F5F5)
- **Secondary Text**: Light Grey (#b0b0b0)
- **Accent Text**: Purple gradient on key phrases

---

## 📝 Typography

### **Font Family**
- **Primary**: Poppins (Google Fonts)
- **Weights**: 400 (Regular), 600 (Semi-bold), 700 (Bold)

### **Font Sizes**
- **Logo**: Large (1200px max-width)
- **Main Headline**: 2.2rem
- **Subheadline**: 1rem
- **Video Label**: 0.9rem
- **Button Text**: 1.2rem
- **Success Section Title**: 2.5rem
- **Success Card Titles**: 1.5rem
- **Success Metrics**: 2rem

### **Text Effects**
- **Gradient Text**: Applied to "Growth Engine" and section titles
- **Letter Spacing**: 2px for video section label
- **Text Transform**: Uppercase for video label

---

## 📐 Spacing & Layout

### **Container**
- **Width**: 100% full-width
- **Max-width**: No constraints
- **Padding**: Minimal (0.5rem or less)
- **Min-height**: 100vh

### **Section Spacing**
- **Header**: 0.5rem padding, 0.3rem margin-bottom
- **Hero**: 0.5rem padding, 0.3rem margin-bottom
- **Video**: 0.5rem padding, 0.3rem margin-bottom
- **CTA**: 0.5rem padding, 1rem margin-bottom
- **Success**: 3rem padding, no margins

### **Element Spacing**
- **Headline to Subheadline**: 0.2rem margin
- **Subheadline to Video**: 0.3rem margin
- **Video to Button**: 0.3rem margin

---

## 🎭 Visual Effects

### **Animations**
- **Header**: fadeInDown 1s ease-out
- **Hero**: fadeIn 1.5s ease-out
- **Video**: fadeInUp 1s ease-out
- **CTA**: fadeInUp 1.5s ease-out
- **Success**: fadeInUp 2s ease-out

### **Hover Effects**
- **Video Play Button**: Scale 1.1 on hover
- **CTA Button**: TranslateY(-5px) + enhanced shadow
- **Success Cards**: TranslateY(-5px) + purple shadow

### **Shadows**
- **CTA Button**: 0 4px 20px rgba(0, 0, 0, 0.4)
- **CTA Button Hover**: 0 8px 30px rgba(138, 43, 226, 0.5)
- **Success Cards Hover**: 0 10px 30px rgba(138, 43, 226, 0.2)

---

## 📱 Responsive Design

### **Breakpoints**
- **Desktop**: Default styles
- **Tablet**: max-width: 768px
- **Mobile**: max-width: 480px

### **Mobile Adaptations**
- **Headline**: Reduces to 2.2rem (mobile)
- **Logo**: Reduces to 140px max-width
- **Success Grid**: Single column layout
- **Success Title**: Reduces to 1.8rem

---

## 🎯 Content Guidelines

### **Success Metrics**
- **Revenue Growth**: +450% (SaaS startup)
- **Traffic Increase**: +2,300% (E-commerce brand)
- **Conversion Rate**: +180% (B2B company)

### **Brand Elements**
- **Logo Source**: Local file (rarity_logo.png)
- **External Link**: Links to rarityagency.io
- **Copyright**: "Rarity Agency © 2025 | All rights reserved."

---

## 🚫 Design Constraints

### **What NOT to Do**
- ❌ Don't use `npm run dev` (static HTML file)
- ❌ Don't add excessive white space
- ❌ Don't use bright backgrounds
- ❌ Don't make video vertical (must be horizontal)
- ❌ Don't add section background gradients (use main background)

### **What TO Do**
- ✅ Use full-width layout
- ✅ Keep elements close together
- ✅ Use purple gradient accents
- ✅ Maintain dark theme
- ✅ Use horizontal video format
- ✅ Apply hover animations

---

## 🔧 Technical Specifications

### **File Structure**
```
lp_caio_rarity_offer-main/
├── index.html (IP-based language detection)
├── lp_caio_rarity_offer.html (English version)
├── lp_caio_rarity_offer_pt.html (Portuguese version)
├── rarity_logo.png
├── README.md
└── DESIGN_RULES.md
```

### **Browser Support**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- CSS custom properties (variables) support required

### **Performance**
- Optimized for fast loading
- Minimal external dependencies
- Efficient CSS animations
- Responsive images

---

## 📋 Implementation Checklist

- [x] Dark purple gradient background
- [x] Starry night effect with speckles
- [x] Large logo positioning
- [x] Compact element spacing
- [x] Horizontal video rectangle
- [x] Purple gradient text effects
- [x] Hover animations
- [x] Responsive design
- [x] Success cases section
- [x] Call-to-action button
- [x] IP-based language detection
- [x] Portuguese version
- [x] Language switching buttons

---

*Last Updated: 2025*
*Design System Version: 1.0* 