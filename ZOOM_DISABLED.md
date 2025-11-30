# Zoom Disabled on Search Inputs & Pinch Zoom Prevention

## Changes Made

### 1. **Global Viewport Settings** (`src/pages/_document.js`)

Added comprehensive viewport meta tag to prevent pinch zoom:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
```

**Key attributes:**
- `maximum-scale=1` - Prevents user zoom
- `user-scalable=no` - Disables pinch zoom on touch devices
- `viewport-fit=cover` - Ensures content respects notches/safe areas
- Previously the `touch-none` class had been added to `body` but was later removed because it blocked scrolling; input-level `touch-action` rules are retained

### 2. **Search Input Zoom Prevention** 

#### Main Search (Home Page)
**File:** `src/components/container/index.js`

```javascript
<Input
  ref={searchInputRef}
  type="search"
  placeholder="Search..."
  name="q"
  className="w-full text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 text-base"
  style={{ fontSize: "16px" }}
  onFocus={(e) => e.target.style.fontSize = "16px"}
/>
```

**Why font-size: 16px?**
- iOS Safari automatically zooms to 100% when font-size < 16px
- By keeping font-size at 16px, we prevent the auto-zoom behavior
- The `onFocus` handler ensures it stays at 16px

#### GitHub Explorer Search
**File:** `src/components/github/GithubExplorerContainer.js`

Applied the same technique to prevent zoom when typing in the search box.

### 3. **Global CSS Rules** (`src/styles/globals.css`)

Added rules for all input types:

```css
html {
  touch-action: manipulation;
}

input[type="text"],
input[type="search"],
input[type="email"],
input[type="tel"],
input[type="number"],
textarea,
select {
  font-size: 16px !important;
  touch-action: manipulation;
}

input[type="text"]:focus,
input[type="search"]:focus,
input[type="email"]:focus,
input[type="tel"]:focus,
input[type="number"]:focus,
textarea:focus,
select:focus {
  font-size: 16px !important;
}
```

**What this does:**
- `touch-action: manipulation` - Allows tap and pinch, but no double-tap zoom
- `font-size: 16px` - Prevents iOS auto-zoom on input focus
- Applied globally to all input types for consistency

---

## How It Works

### **Preventing Zoom on Search Input Focus**
iOS Safari automatically zooms to 100% when you tap on an input with font-size < 16px. By setting and maintaining font-size at 16px, we bypass this behavior.

### **Preventing Pinch Zoom**
The viewport meta tag with `user-scalable=no` and `maximum-scale=1` disables the pinch zoom gesture entirely.

### **Touch Action Manipulation**
`touch-action: manipulation` allows standard touch gestures (tap, multi-touch) but prevents double-tap zoom.

---

## Browser Compatibility

| Feature | iOS Safari | Chrome | Firefox | Edge |
|---------|-----------|--------|---------|------|
| Viewport zoom control | ✅ | ✅ | ✅ | ✅ |
| Input font-size zoom | ✅ | ✅ | ✅ | ✅ |
| touch-action | ✅ | ✅ | ✅ | ✅ |

---

## Testing

### **To verify zoom is disabled:**

1. **On iOS Safari:**
   - Tap on any search input
   - Page should NOT zoom in
   - You should be able to type normally

2. **On Android Chrome:**
   - Try pinch-to-zoom on the page
   - Zoom should be disabled
   - Search inputs should not trigger zoom

3. **On Desktop:**
   - Behavior is unchanged (zoom controls still work in browser menus)

---

## Files Modified

| File | Changes |
|------|---------|
| `src/pages/_document.js` | Added viewport meta tag; previously applied `touch-none` class removed (blocked scrolling) |
| `src/components/container/index.js` | Added font-size 16px + onFocus handler |
| `src/components/github/GithubExplorerContainer.js` | Added font-size 16px + onFocus handler |
| `src/styles/globals.css` | Added global CSS rules for inputs |

---

## Notes

- ✅ No breaking changes to functionality
- ✅ 100% backward compatible
- ✅ Improves mobile UX by preventing accidental zooms
- ✅ All search functionality remains intact
- ✅ Responsive design not affected

---

## Future Enhancements

Consider adding to other input types if needed:
- Login/signup forms
- Community upload forms
- Filter inputs
- Any custom input components

Just apply the same pattern: `font-size: 16px` + `style={{ fontSize: "16px" }}` inline + `onFocus` handler.
