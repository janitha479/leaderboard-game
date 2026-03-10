# Winner Name Positioning Guide

## Quick Start

To customize where winner names appear on your background image:

1. Open `src/utils/winnerPositions.js`
2. Adjust the `nameX`, `nameY`, `scoreX`, and `scoreY` values for each rank
3. Save the file and refresh your browser

## Understanding Positions

### X and Y Coordinates
- **X position**: Horizontal placement (left to right)
  - 0 = far left edge of screen
  - Larger numbers = move right
- **Y position**: Vertical placement (top to bottom)
  - 0 = top edge of screen
  - Larger numbers = move down

### Example
```javascript
1: {
  nameX: 400,    // Name appears 400px from left
  nameY: 200,    // Name appears 200px from top
  scoreX: 600,   // Score appears 600px from left
  scoreY: 200,   // Score appears 200px from top (same height as name)
}
```

## Customization Options

For each winner rank (1, 2, 3, 4, 5), you can customize:

| Property | Description | Example |
|----------|-------------|---------|
| `nameX` | Name horizontal position (pixels from left) | `400` |
| `nameY` | Name vertical position (pixels from top) | `200` |
| `scoreX` | Score horizontal position (pixels from left) | `600` |
| `scoreY` | Score vertical position (pixels from top) | `200` |
| `fontSize` | Name text size | `'48px'` |
| `scoreFontSize` | Score text size | `'60px'` |
| `color` | Name text color | `'#FFD700'` |
| `scoreColor` | Score text color | `'#FFD700'` |

## Tips for Positioning

### Finding the Right Position
1. Start with rough estimates
2. Save the file and check in browser
3. Adjust by small increments (10-20px at a time)
4. Repeat until perfect

### Common Adjustments
- **Names too close together**: Increase Y values by spacing them further apart
- **Text off screen**: Reduce X or Y values
- **Text overlapping**: Move one element's X or Y position
- **Text too small/large**: Adjust `fontSize` or `scoreFontSize`

### Screen Size Considerations
- Default positions are for standard 1920x1080 screens
- For different screen sizes, you may need to adjust positions
- Test on your actual display setup

## Switching Modes

In `winnerPositions.js`, you can toggle between positioning modes:

```javascript
export const USE_ABSOLUTE_POSITIONING = true;  // Custom positions (your background image)
export const USE_ABSOLUTE_POSITIONING = false; // Draggable mode (original)
```

## Common Color Codes

Use these in the `color` or `scoreColor` properties:

- `'#FFD700'` - Gold
- `'#C0C0C0'` - Silver  
- `'#CD7F32'` - Bronze
- `'#FFFFFF'` - White
- `'#FFC107'` - Yellow/Amber
- `'#FF5722'` - Red/Orange
- `'#4CAF50'` - Green
- `'#2196F3'` - Blue

## Example Configuration

Here's a sample setup for a podium-style layout:

```javascript
export const WINNER_POSITIONS = {
  // 1st Place - Center, highest
  1: {
    nameX: 800,
    nameY: 300,
    scoreX: 1000,
    scoreY: 300,
    fontSize: '52px',
    scoreFontSize: '64px',
    color: '#FFD700',
    scoreColor: '#FFD700',
  },
  
  // 2nd Place - Left, middle height
  2: {
    nameX: 400,
    nameY: 400,
    scoreX: 600,
    scoreY: 400,
    fontSize: '44px',
    scoreFontSize: '56px',
    color: '#C0C0C0',
    scoreColor: '#C0C0C0',
  },
  
  // 3rd Place - Right, middle height
  3: {
    nameX: 1200,
    nameY: 400,
    scoreX: 1400,
    scoreY: 400,
    fontSize: '44px',
    scoreFontSize: '56px',
    color: '#CD7F32',
    scoreColor: '#CD7F32',
  },
  
  // 4th Place - Bottom left
  4: {
    nameX: 300,
    nameY: 600,
    scoreX: 500,
    scoreY: 600,
    fontSize: '36px',
    scoreFontSize: '48px',
    color: '#FFFFFF',
    scoreColor: '#FFC107',
  },
  
  // 5th Place - Bottom right
  5: {
    nameX: 1300,
    nameY: 600,
    scoreX: 1500,
    scoreY: 600,
    fontSize: '36px',
    scoreFontSize: '48px',
    color: '#FFFFFF',
    scoreColor: '#FFC107',
  },
};
```

## Troubleshooting

**Text not appearing?**
- Check that `USE_ABSOLUTE_POSITIONING` is set to `true`
- Verify coordinates are within screen bounds (typically 0-1920 for X, 0-1080 for Y)

**Text overlapping?**
- Adjust X or Y values to create more space
- Reduce font sizes

**Wrong colors?**
- Make sure color codes start with `#` and use valid hex codes
- Wrap color values in quotes: `'#FFD700'`

**Changes not showing?**
- Save the file
- Refresh your browser (Ctrl+R or Cmd+R)
- Clear browser cache if needed
