/**
 * WINNER NAME POSITIONING CONFIGURATION
 * 
 * Edit these values to position winner names on your background image.
 * Positions are in pixels from the TOP-LEFT corner of the screen.
 * 
 * x = horizontal position (left to right)
 * y = vertical position (top to bottom)
 * 
 * Each winner rank (1st, 2nd, 3rd, etc.) can have custom:
 * - nameX, nameY: Position for the player name
 * - scoreX, scoreY: Position for the score
 * - fontSize: Text size for the name (optional)
 * - scoreFontSize: Text size for the score (optional)
 * - color: Text color for the name (optional)
 * - scoreColor: Text color for the score (optional)
 */

export const WINNER_POSITIONS = {
  // 1st Place Winner
  1: {
    nameX: 310,           // Horizontal position of name
    nameY: 1020,           // Vertical position of name
    scoreX: 880,          // Horizontal position of score
    scoreY: 1020,          // Vertical position of score
    fontSize: '48px',     // Name font size
    scoreFontSize: '60px', // Score font size
    color: '#ffffff',     // Gold color for 1st place
    scoreColor: '#FFC107',
  },
  
  // 2nd Place Winner
  2: {
    nameX: 310,
    nameY: 1140,
    scoreX: 880,
    scoreY: 1130,
    fontSize: '42px',
    scoreFontSize: '60px',
    color: '#ffffff',     // Silver color for 2nd place
    scoreColor: '#FFC107',
  },
  
  // 3rd Place Winner
  3: {
    nameX: 310,
    nameY: 1250,
    scoreX: 880,
    scoreY: 1240,
    fontSize: '48px',
    scoreFontSize: '60px',
    color: '#ffffff',     // Bronze color for 3rd place
    scoreColor: '#FFC107',
  },
  
  // 4th Place
  4: {
    nameX: 310,
    nameY: 1360,
    scoreX: 880,
    scoreY: 1350,
    fontSize: '48px',
    scoreFontSize: '60px',
    color: '#FFFFFF',     // White for 4th place
    scoreColor: '#FFC107',
  },
  
  // 5th Place
  5: {
    nameX: 310,
    nameY: 1460,
    scoreX: 880,
    scoreY: 1450,
    fontSize: '48px',
    scoreFontSize: '60px',
    color: '#FFFFFF',     // White for 5th place
    scoreColor: '#FFC107',
  },
};

/**
 * GLOBAL TEXT STYLES
 * 
 * These apply to all winner names unless overridden above
 */
export const GLOBAL_TEXT_STYLES = {
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
  textTransform: 'uppercase',
};

/**
 * Enable/disable absolute positioning mode
 * Set to true to use custom positions, false to use default layout
 */
export const USE_ABSOLUTE_POSITIONING = true;
