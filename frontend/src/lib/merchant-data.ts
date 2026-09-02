// Merchant brand colors for realistic transaction avatars
// Based on 2026 research — real Indian + global merchant brand colors

export const merchantColors: Record<string, { color: string; bg: string; glyph: string }> = {
  "BigBasket": { color: "#319527", bg: "rgba(49,149,39,0.12)", glyph: "🛒" },
  "Uber": { color: "#000000", bg: "rgba(0,0,0,0.08)", glyph: "🚗" },
  "Swiggy": { color: "#FC8019", bg: "rgba(252,128,25,0.12)", glyph: "🍽️" },
  "Zomato": { color: "#CB202D", bg: "rgba(203,32,45,0.12)", glyph: "🍴" },
  "Netflix": { color: "#E50914", bg: "rgba(229,9,20,0.12)", glyph: "🎬" },
  "Amazon Pay": { color: "#FF9900", bg: "rgba(255,153,0,0.12)", glyph: "📦" },
  "Amazon": { color: "#FF9900", bg: "rgba(255,153,0,0.12)", glyph: "📦" },
  "Salary — TechCorp": { color: "#047857", bg: "rgba(4,120,87,0.12)", glyph: "💰" },
  "Rent — Landlord": { color: "#6B7280", bg: "rgba(107,114,128,0.12)", glyph: "🏠" },
  "Mutual Fund SIP": { color: "#3858C5", bg: "rgba(56,88,197,0.12)", glyph: "📈" },
  "Jio Recharge": { color: "#0A2885", bg: "rgba(10,40,133,0.12)", glyph: "📱" },
  "BookMyShow": { color: "#D6182D", bg: "rgba(214,24,45,0.12)", glyph: "🎟️" },
  "Cult.fit": { color: "#FF3D00", bg: "rgba(255,61,0,0.12)", glyph: "💪" },
  "Paytm": { color: "#00BAF2", bg: "rgba(0,186,242,0.12)", glyph: "💳" },
  "PhonePe": { color: "#5F259F", bg: "rgba(95,37,159,0.12)", glyph: "📱" },
  "Flipkart": { color: "#2874F0", bg: "rgba(40,116,240,0.12)", glyph: "🛍️" },
  "HDFC Bank": { color: "#004C8F", bg: "rgba(0,76,143,0.12)", glyph: "🏦" },
  "ICICI Bank": { color: "#F37120", bg: "rgba(243,113,32,0.12)", glyph: "🏦" },
  "Axis Bank": { color: "#97144D", bg: "rgba(151,20,77,0.12)", glyph: "🏦" },
  "Zerodha": { color: "#3858C5", bg: "rgba(56,88,197,0.12)", glyph: "📈" },
  "Groww": { color: "#00D09C", bg: "rgba(0,208,156,0.12)", glyph: "🌱" },
  "Notion": { color: "#000000", bg: "rgba(0,0,0,0.08)", glyph: "📝" },
  "Spotify": { color: "#1DB954", bg: "rgba(29,185,84,0.12)", glyph: "🎵" },
  "Google Pay": { color: "#4285F4", bg: "rgba(66,133,244,0.12)", glyph: "💳" },
};

export function getMerchantStyle(merchantName: string) {
  return merchantColors[merchantName] || { color: "#6B7280", bg: "rgba(107,114,128,0.12)", glyph: "💸" };
}

// Bank card gradients for 3D card display
export const bankCardGradients: Record<string, string> = {
  "HDFC Bank": "linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #6d28d9 100%)",
  "ICICI Bank": "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
  "Axis Bank": "linear-gradient(135deg, #4c0519 0%, #9f1239 50%, #be123c 100%)",
  "Zerodha": "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
  "fincopilot": "linear-gradient(135deg, #047857 0%, #065F46 40%, #B08D57 100%)",
  "platinum": "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 30%, #FFFFFF 50%, #C0C0C0 70%, #A9A9A9 100%)",
};
