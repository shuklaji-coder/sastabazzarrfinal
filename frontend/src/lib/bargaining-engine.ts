import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "./gemini-config";
import axios from "./axios";

export type DealState = "negotiating" | "final-offer" | "deal-locked" | "deal-success" | "deal-failed";
export interface BargainingSession {
  mrp: number;
  minThreshold: number;
  currentRound: number;
  maxRounds: number;
  lastAiOffer: number;
  dealState: DealState;
  history: { sender: "user" | "ai"; message: string; price?: number }[];
  userStrategy: "lowballer" | "reasonable" | "generous" | "unknown";
  aiMood: "friendly" | "firm" | "desperate" | "confident";
  concessionRate: number;
  startTime: number;
  urgencyLevel: "low" | "medium" | "high" | "flash";
  scarcityLevel: "high" | "medium" | "low";
  seasonalBonus: number;
  loyaltyTier: "bronze" | "silver" | "gold" | "platinum" | "none";
  bundleOfferAvailable: boolean;
  flashSaleActive: boolean;
  language: "hindi" | "english";
  category?: string;
}

// Initialize Gemini Client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || GEMINI_API_KEY || "";
if (apiKey) {
  console.log(`Gemini initialized with key (ending in ...${apiKey.slice(-4)})`);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); 

export const initBargainingSession = (mrp: number, maxDiscountPercent: number = 10, language: "hindi" | "english" = "hindi", category: string = "Electronics"): BargainingSession => {  // Set min threshold based on max discount percent (e.g., 10% discount means 90% of MRP is minimum)
  const discountFactor = 1 - (maxDiscountPercent / 100);
  const minThreshold = Math.floor(mrp * discountFactor);
  
  // Initialize advanced features
  const urgency = getUrgencyLevel();
  const scarcity = getScarcityLevel();
  const seasonal = getSeasonalBonus();
  const loyalty = getLoyaltyTier();
  
  // Admin-set maximum discount is the hard limit - no bonuses should override this
  // Loyalty and seasonal bonuses are for messaging only, not for reducing price further
  const finalMinThreshold = minThreshold;
  
  // Get initial message based on language
  const initialMessage = language === "english" 
    ? `🙏 Hello! Looking at today's market rates, this quality item won't be available at ${mrp}. But tell me, what's your offer? 😊\n\n${getUrgencyMessage(urgency, scarcity, 5, "english")}\n\n${loyalty !== "none" ? `As our ${loyalty} customer, you'll get special discount! 🎯` : ""}`
    : `🙏 Namaste ji! ${getUrgencyMessage(urgency, scarcity, 5, "hindi")}\n\nAaj kal ka market dekh ke hi price fix kiya hai. Is quality ka item ${mrp} mein nahi milega. ${loyalty !== "none" ? `Aap hamare ${loyalty} customer hain, toh special discount milega! 🎯` : ""} Lekin aap boliye, apni side se kitna kar sakte hain? 😊`;

  return {
    mrp: mrp,
    minThreshold: finalMinThreshold, // Respect admin-set maximum discount limit
    currentRound: 1,
    maxRounds: 4,
    lastAiOffer: mrp,
    dealState: "negotiating",
    userStrategy: "unknown",
    aiMood: "confident",
    concessionRate: 0.3,
    startTime: Date.now(),
    urgencyLevel: urgency,
    scarcityLevel: scarcity,
    seasonalBonus: seasonal,
    loyaltyTier: loyalty,
    bundleOfferAvailable: Math.random() > 0.5,
    flashSaleActive: urgency === "flash",
    language: language,
    category: category,
    history: [
      {
        sender: "ai",
        message: initialMessage,
        price: mrp,
      },
    ],
  };
};

// Advanced unique features
const getUrgencyLevel = (): "low" | "medium" | "high" | "flash" => {
  const hour = new Date().getHours();
  const day = new Date().getDay();
  
  // Flash sale during peak hours (6-9 PM) and weekends
  if ((hour >= 18 && hour <= 21) || (day >= 5 && day <= 6)) {
    return Math.random() > 0.5 ? "flash" : "high";
  }
  // High urgency during business hours
  if (hour >= 10 && hour <= 18) return "high";
  // Medium urgency during evening
  if ((hour >= 19 && hour <= 23) || (hour >= 6 && hour <= 9)) return "medium";
  return "low";
};

const getSeasonalBonus = (): number => {
  const month = new Date().getMonth();
  const day = new Date().getDate();
  
  // Festival seasons: Diwali (Oct-Nov), Christmas (Dec), New Year (Jan), Eid (varies)
  if ((month === 9 && day >= 20) || (month === 10 && day <= 10)) return 5; // Diwali
  if (month === 11 && day >= 20 && day <= 31) return 8; // Christmas
  if (month === 0 && day <= 7) return 6; // New Year
  if (month === 2 && day >= 15) return 4; // Holi
  if (month === 7) return 3; // Independence Day
  return 0;
};

const getScarcityLevel = (): "high" | "medium" | "low" => {
  const random = Math.random();
  if (random < 0.2) return "high";
  if (random < 0.5) return "medium";
  return "low";
};

const getLoyaltyTier = (): "bronze" | "silver" | "gold" | "platinum" | "none" => {
  // Simulate loyalty tier based on random user behavior
  const random = Math.random();
  if (random < 0.1) return "platinum";
  if (random < 0.25) return "gold";
  if (random < 0.5) return "silver";
  if (random < 0.75) return "bronze";
  return "none";
};

// Real-time purchase notification system
const getRecentPurchaseNotification = (language: "hindi" | "english" = "hindi"): string => {
  const buyerNames = [
    "Riya", "Priya", "Anjali", "Kavya", "Sneha", "Neha", "Pooja", "Divya",
    "Amit", "Rahul", "Vikram", "Arjun", "Karan", "Rohit", "Aman", "Suresh",
    "Sakshi", "Meera", "Tanya", "Ishita", "Swati", "Rashmi", "Kirti", "Anita"
  ];
  
  const locations = [
    "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", 
    "Kolkata", "Jaipur", "Lucknow", "Indore", "Ahmedabad", "Surat"
  ];
  
  const times = ["just now", "2 mins ago", "5 mins ago", "10 mins ago"];
  
  const buyer = buyerNames[Math.floor(Math.random() * buyerNames.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const time = times[Math.floor(Math.random() * times.length)];
  
  if (language === "english") {
    const messages = [
      `🔥 ${buyer} from ${location} just bought this! ${time}`,
      `⚡ ${buyer} purchased this ${time}! Don't miss out!`,
      `🎯 ${buyer} from ${location} grabbed this deal! ${time}`,
      `💫 ${buyer} just ordered! Only 3 left in stock!`,
      `🚨 ${buyer} from ${location} bought this! Selling fast!`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  } else {
    const messages = [
      `🔥 ${location} ki ${buyer} ne abhi kharida! ${time}`,
      `⚡ ${buyer} ne kharida ${time}! Chance mat miss karo!`,
      `🎯 ${location} ki ${buyer} ne le liya deal! ${time}`,
      `💫 ${buyer} ne order kiya! Sirf 3 stock mein bacha!`,
      `🚨 ${location} ki ${buyer} ne kharida! Tezi se bik raha hai!`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }
};

const getUrgencyMessage = (urgency: string, scarcity: string, timeLeft: number, language: "hindi" | "english" = "hindi"): string => {
  const urgencyMessages = {
    english: {
      flash: [
        `⚡ FLASH SALE! Only ${timeLeft} minutes left! This chance won't come again! 🔥`,
        `🚨 LIMITED TIME! Offer ends in ${timeLeft} minutes! Hurry up! ⏰`,
        `💥 MEGA DEAL! Now or never! ${timeLeft} minutes remaining! 🎯`
      ],
      high: [
        `⏰ Time is running out! This price ends in ${timeLeft} minutes! 🏃‍♂️`,
        `🔥 High demand! Stock might end in ${timeLeft} minutes! 📦`,
        `💨 Fast moving! Price might increase in ${timeLeft} minutes! 📈`
      ],
      medium: [
        `🤔 Don't think too much! You'll miss this deal in ${timeLeft} minutes! 🎯`,
        `📅 Today's special! Offer might change in ${timeLeft} minutes! 🔄`,
        `⚖️ Balance it out! Make decision in ${timeLeft} minutes! ⚖️`
      ],
      low: [
        `😊 Relax! You have ${timeLeft} minutes to think! 🧘‍♂️`,
        `🕰️ There's time! Final decision in ${timeLeft} minutes! 🤔`,
        `🌟 Take it easy! We can fix a deal in ${timeLeft} minutes! ✨`
      ]
    },
    hindi: {
      flash: [
        `⚡ FLASH SALE! Sirf ${timeLeft} minute bacha hai! Yeh chance dobara nahi milega! 🔥`,
        `🚨 LIMITED TIME! ${timeLeft} mein offer khatam ho jayega! Jaldi kijiye! ⏰`,
        `💥 MEGA DEAL! Abhi nahi toh kabhi nahi! ${timeLeft} minute reh gaye! 🎯`
      ],
      high: [
        `⏰ Time chal raha hai! ${timeLeft} minute mein yeh price khatam! 🏃‍♂️`,
        `🔥 High demand! ${timeLeft} mein stock khatam ho sakta hai! 📦`,
        `💨 Fast moving! ${timeLeft} minute mein badh jayega price! 📈`
      ],
      medium: [
        `🤔 Soch mat zyada! ${timeLeft} minute mein yeh deal miss ho jayega! 🎯`,
        `📅 Aaj ka special! ${timeLeft} mein offer change ho sakta hai! 🔄`,
        `⚖️ Balance kar lo! ${timeLeft} minute mein decision karna! ⚖️`
      ],
      low: [
        `😊 Relax! ${timeLeft} minute hai sochne ko! 🧘‍♂️`,
        `🕰️ Time hai! ${timeLeft} minute mein final decision! 🤔`,
        `🌟 Aaram se! ${timeLeft} mein deal fix kar sakte hain! ✨`
      ]
    }
  };
  
  const scarcityMessages = {
    english: {
      high: "Only 2-3 pieces left! 📦",
      medium: "Limited stock! 📊",
      low: "Stock available! ✅"
    },
    hindi: {
      high: "Sirf 2-3 pieces bacha hai! 📦",
      medium: "Limited stock hai! 📊",
      low: "Stock available hai! ✅"
    }
  };
  
  const urgencyMsg = urgencyMessages[language][urgency as keyof typeof urgencyMessages[typeof language]][Math.floor(Math.random() * urgencyMessages[language][urgency as keyof typeof urgencyMessages[typeof language]].length)];
  const scarcityMsg = scarcityMessages[language][scarcity as keyof typeof scarcityMessages[typeof language]];
  
  return `${urgencyMsg} ${scarcityMsg}`;
};

const getLoyaltyBonus = (tier: string): number => {
  const bonuses = {
    none: 0,
    bronze: 2,
    silver: 4,
    gold: 6,
    platinum: 10
  };
  return bonuses[tier as keyof typeof bonuses] || 0;
};

const getBundleOffer = (mrp: number, language: "hindi" | "english" = "hindi"): string => {
  const bundlePrice = Math.floor(mrp * 1.8); // Buy 2 for less than double
  return language === "english" 
    ? `🎁 Bundle Offer: Get 2 for ₹${bundlePrice}! (One at discount!)`
    : `🎁 Bundle Offer: Do leke ₹${bundlePrice} mein! (Ek saste mein milega!)`;
};

// Helper functions for smart bargaining
const analyzeUserStrategy = (userOffer: number, mrp: number, minThreshold: number): "lowballer" | "reasonable" | "generous" => {
  const offerPercentage = userOffer / mrp;
  const minPercentage = minThreshold / mrp;
  
  if (offerPercentage < minPercentage * 0.8) return "lowballer";
  if (offerPercentage >= minPercentage * 0.95) return "generous";
  return "reasonable";
};

const getPsychologicalPrice = (price: number): number => {
  // Make prices end with 9, 7, or 5 for psychological effect
  const lastDigit = price % 10;
  if (lastDigit <= 2) return price - lastDigit + 9;
  if (lastDigit <= 5) return price - lastDigit + 7;
  if (lastDigit <= 8) return price - lastDigit + 9;
  return price;
};

const getSmartResponse = (
  userOffer: number,
  aiOffer: number,
  userStrategy: string,
  aiMood: string,
  round: number,
  mrp: number,
  session: BargainingSession
): string => {
  const timeElapsed = Math.floor((Date.now() - session.startTime) / 60000); // minutes
  const urgencyMsg = getUrgencyMessage(session.urgencyLevel, session.scarcityLevel, Math.max(1, 10 - timeElapsed), session.language);
  const loyaltyBonus = getLoyaltyBonus(session.loyaltyTier);
  
  const responses = {
    english: {
      friendly: {
        lowballer: [
          `Come on, I can't go that low! 😅 I can do ₹${aiOffer} for you, just give it a thought.\n\n${urgencyMsg}`,
          `I understand you care about budget. But quality is unquestionable! How about ₹${aiOffer}? 🤝\n\n${session.loyaltyTier !== "none" ? `Use your ${session.loyaltyTier} benefits! 🎯` : ""}`,
          `Are you kidding me! 😂 Let's compromise, final at ₹${aiOffer}?\n\n${session.bundleOfferAvailable ? getBundleOffer(mrp, "english") : ""}`
        ],
        reasonable: [
          `You're making sense. I'll do ₹${aiOffer} for you, this is my best. 😊\n\n${urgencyMsg}`,
          `Can't say no to a customer like you. Take it for ₹${aiOffer}, have a great day! 🙏\n\n${session.flashSaleActive ? "⚡ Flash Sale is active! Extra benefits!" : ""}`,
          `A little more and it's done! Deal at ₹${aiOffer}? Or next time no chance! 😄\n\n${session.seasonalBonus > 0 ? `🎊 Festive season! Special discount!` : ""}`
        ],
        generous: [
          `Wow! You have a pure heart! 🎉 Deal at ₹${userOffer}! Keep shopping like this!\n\n${session.loyaltyTier !== "none" ? `🏆 ${session.loyaltyTier} customer gets extra reward!` : ""}`,
          `I'll sell at discount to customers like you! Done deal ₹${userOffer}! 🔥\n\n${session.bundleOfferAvailable ? "🎁 Bundle offer active on next purchase!" : ""}`,
          `Excellent! Thanks to your generosity, deal is done! Take it for ₹${userOffer}! 🤝\n\n${urgencyMsg}`
        ]
      },
      firm: {
        lowballer: [
          `Sorry, can't go lower than this. This is market rate. ₹${aiOffer} or go home. 😐\n\n${session.scarcityLevel === "high" ? "📦 Only 2-3 pieces left!" : ""}`,
          `No, this is my final price. ₹${aiOffer} or next shop. 🤷‍♂️\n\n${session.flashSaleActive ? "⚡ Won't get this price in flash sale!" : ""}`,
          `Don't waste my time. It's ₹${aiOffer} or leave it. 😑\n\n${urgencyMsg}`
        ],
        reasonable: [
          `Look, I'm being reasonable. ₹${aiOffer} is my final offer. Take it or leave it. 😐\n\n${session.seasonalBonus > 0 ? `🎊 This is festive price!` : ""}`,
          `Business is business. ₹${aiOffer} it is, I won't go lower. 🤝\n\n${session.loyaltyTier !== "none" ? `With your ${session.loyaltyTier} status, this is best!` : ""}`,
          `Last chance - ₹${aiOffer}. After this, no more bargaining. �\n\n${session.scarcityLevel === "medium" ? "📊 Limited stock!" : ""}`
        ],
        generous: [
          `Okay, you're serious. Deal at ₹${userOffer}. But don't expect this next time. 😐\n\n${session.flashSaleActive ? "⚡ You're lucky in flash sale!" : ""}`,
          `Fine, ₹${userOffer} it is. But this is really my bottom line. 🤝\n\n${urgencyMsg}`,
          `You drive a hard bargain. Deal at ₹${userOffer}. Let's finish this. 😑\n\n${session.bundleOfferAvailable ? "🎁 Bundle offer missed!" : ""}`
        ]
      },
      confident: {
        lowballer: [
          `Bro, respect the quality! You won't get this item at this price. I'm doing ₹${aiOffer} for you, special discount! 😎\n\n${session.scarcityLevel === "high" ? "📦 High demand!" : ""}`,
          `You're quite a negotiator! 😄 For you, ₹${aiOffer} - don't think too much! 🤝\n\n${session.seasonalBonus > 0 ? `🎊 This is seasonal discount!` : ""}`,
          `Go check the market, you won't get this price. Take it for ₹${aiOffer}, this is absolutely final! 😎\n\n${urgencyMsg}`
        ],
        reasonable: [
          `You're very understanding! Deal at ₹${aiOffer} - I won't give this price to anyone else! 🤝🔥\n\n${session.loyaltyTier !== "none" ? `🏆 ${session.loyaltyTier} customer gets special treatment!` : ""}`,
          `Business-minded customer! Like it! Deal done at ₹${aiOffer}! 😎\n\n${session.flashSaleActive ? "⚡ You came at right time in flash sale!" : ""}`,
          `I can do anything for you! Take it for ₹${aiOffer}, customer satisfaction guaranteed! 🎉\n\n${session.bundleOfferAvailable ? getBundleOffer(mrp, "english") : ""}`
        ],
        generous: [
          `Wow! You're a king! 🤴 Deal at ₹${userOffer}! Keep shopping like this! 🎉\n\n${session.loyaltyTier !== "none" ? `👑 ${session.loyaltyTier} customers get extra surprise gift!` : ""}`,
          `Customer like you deserves special treatment! Done deal ₹${userOffer}! 👑\n\n${session.seasonalBonus > 0 ? `🎊 Festive bonanza! Extra benefits!` : ""}`,
          `Thank you so much! Shop runs because of customers like you! Deal final at ₹${userOffer}! 🙏🎉\n\n${urgencyMsg}`
        ]
      }
    },
    hindi: {
      friendly: {
        lowballer: [
          `Arre bhai, itna toh dukaan ka maal nahi hai! � Main aapke liye ₹${aiOffer} tak kar sakta hun, bas ek baar vichaar kijiye.\n\n${urgencyMsg}`,
          `Samjh jata hun, budget ka khayal rakhte hain aap. Lekin quality ka toh sawal hi nahi! ₹${aiOffer} mein ho jaye? 🤝\n\n${session.loyaltyTier !== "none" ? `Aapke ${session.loyaltyTier} benefits ka use karo! 🎯` : ""}`,
          `Bhai, aap toh majak kar rahe ho! 😂 Chalo thoda sa compromise, ₹${aiOffer} mein final kar dete hain?\n\n${session.bundleOfferAvailable ? getBundleOffer(mrp, "hindi") : ""}`
        ],
        reasonable: [
          `Dekho ji, aapki baat toh lagti hai. Main aapke liye ₹${aiOffer} kar raha hun, yeh meri taraf se best hai. 😊\n\n${urgencyMsg}`,
          `Aapke jaise customer ko mana nahi kar sakta. ₹${aiOffer} mein le jao, acche din aaye! 🙏\n\n${session.flashSaleActive ? "⚡ Flash Sale active hai! Extra benefits milega!" : ""}`,
          `Thoda aur aur ho jata! ₹${aiOffer} mein deal pakki? Warna agli baar chance nahi milega. 😄\n\n${session.seasonalBonus > 0 ? `🎊 Festive season hai! Special discount mil raha hai!` : ""}`
        ],
        generous: [
          `Waah! Aap toh dil ke saaf ho! 🎉 Deal pakki ₹${userOffer} mein! Aisi hi shopping karte rahiye!\n\n${session.loyaltyTier !== "none" ? `🏆 ${session.loyaltyTier} customer ko extra reward milega!` : ""}`,
          `Aapke jaise customer ko toh main discount mein hi bech dunga! Done deal ₹${userOffer} mein! 🔥\n\n${session.bundleOfferAvailable ? "🎁 Next purchase pe bundle offer active!" : ""}`,
          `Bohot badhiya! Aapki meherbani se deal ho gayi! ₹${userOffer} mein le jao! 🤝\n\n${urgencyMsg}`
        ]
      },
      firm: {
        lowballer: [
          `Sorry ji, isse kam possible nahi. Market rate hai yeh. ₹${aiOffer} hai ya ghar jao. 😐\n\n${session.scarcityLevel === "high" ? "📦 Sirf 2-3 pieces bacha hai!" : ""}`,
          `Nahi ji, yeh meri final price hai. ₹${aiOffer} ya next shop. 🤷‍♂️\n\n${session.flashSaleActive ? "⚡ Flash sale mein yeh price nahi milega!" : ""}`,
          `Time waste mat kijiye. ₹${aiOffer} hai warna chhod dijiye. 😑\n\n${urgencyMsg}`
        ],
        reasonable: [
          `Look, I'm being reasonable. ₹${aiOffer} is my final offer. Take it or leave it. 😐\n\n${session.seasonalBonus > 0 ? `🎊 Festive price hai yeh!` : ""}`,
          `Business is business. ₹${aiOffer} hai, yeh main nahi badhunga. 🤝\n\n${session.loyaltyTier !== "none" ? `Aapke ${session.loyaltyTier} status ke saath yeh best hai!` : ""}`,
          `Last chance - ₹${aiOffer}. After this, no more bargaining. 😑\n\n${session.scarcityLevel === "medium" ? "📊 Limited stock!" : ""}`
        ],
        generous: [
          `Okay, you're serious. Deal at ₹${userOffer}. But don't expect this next time. 😐\n\n${session.flashSaleActive ? "⚡ Flash sale mein aap lucky hain!" : ""}`,
          `Fine, ₹${userOffer} it is. But this is really my bottom line. 🤝\n\n${urgencyMsg}`,
          `You drive a hard bargain. Deal at ₹${userOffer}. Let's finish this. 😑\n\n${session.bundleOfferAvailable ? "🎁 Bundle offer miss ho gaya!" : ""}`
        ]
      },
      confident: {
        lowballer: [
          `Bhai, quality ki kadar karo! Is price mein yeh item milega nahi. Main aapke liye ₹${aiOffer} kar raha hun, special discount! 😎\n\n${session.scarcityLevel === "high" ? "📦 High demand hai!" : ""}`,
          `Aap toh bade negotiator nikle! 😄 Chalo, aapke liye ₹${aiOffer} - bas zyada mat socho! 🤝\n\n${session.seasonalBonus > 0 ? `🎊 Seasonal discount hai yeh!` : ""}`,
          `Market mein ghoom ke dekh lo, yeh price mile nahi. ₹${aiOffer} mein le lo, meri taraf se ekdam final! 😎\n\n${urgencyMsg}`
        ],
        reasonable: [
          `Aapki samajh acchi hai! ₹${aiOffer} mein deal pakki - yeh price doosre ko nahi dunga! 🤝🔥\n\n${session.loyaltyTier !== "none" ? `🏆 ${session.loyaltyTier} customer ko special treatment!` : ""}`,
          `Business-minded customer! Pasand aaya! ₹${aiOffer} mein ho gaya deal! 😎\n\n${session.flashSaleActive ? "⚡ Flash sale mein aapne right time pe aaya!" : ""}`,
          `Aapke liye toh main kuch bhi kar sakta! ₹${aiOffer} mein le jao, customer satisfaction guarantee! 🎉\n\n${session.bundleOfferAvailable ? getBundleOffer(mrp, "hindi") : ""}`
        ],
        generous: [
          `Arre wah! Aap toh king ho! 🤴 Deal pakki ₹${userOffer} mein! Aisi hi shopping karte raho! 🎉\n\n${session.loyaltyTier !== "none" ? `👑 ${session.loyaltyTier} customers ko extra surprise gift!` : ""}`,
          `Customer like you deserves special treatment! Done deal ₹${userOffer} mein! 👑\n\n${session.seasonalBonus > 0 ? `🎊 Festive bonanza! Extra benefits!` : ""}`,
          `Bohot shukriya! Aap jaise customer se dukaan chalti hai! ₹${userOffer} mein deal final! 🙏🎉\n\n${urgencyMsg}`
        ]
      }
    }
  };

  const languageResponses = responses[session.language];
  const moodResponses = languageResponses[aiMood as keyof typeof languageResponses];
  const strategyResponses = moodResponses[userStrategy as keyof typeof moodResponses];
  
  return strategyResponses[Math.floor(Math.random() * strategyResponses.length)];
};

const getGeminiResponse = async (
  session: BargainingSession,
  userOffer: number,
  aiOffer: number,
  userStrategy: string,
  aiMood: string,
  fallbackResponse: string,
  dealStatus: "success" | "failed" | "negotiating" | "final-offer"
): Promise<string> => {
  if (!apiKey || apiKey.length < 10) {
    console.log("Gemini API key not configured. Using intelligent fallback responses.");
    return fallbackResponse;
  }

  const prompt = `Act as an authentic, slightly dramatic, and persuasive Indian shopkeeper (dukandar) negotiating a price with a customer.
You are selling a premium product. Your goal is to maximize profit but keep the customer happy.

Context:
- Product Original Price (MRP): ₹${session.mrp}
- Customer's Current Offer: ₹${userOffer}
- Your Counter-Offer (MUST USE THIS EXACT NUMBER IF NEGOTIATING): ₹${aiOffer}
- Customer's bargaining style: ${userStrategy}
- Your current mood: ${aiMood}
- Negotiation Status: ${dealStatus}
- Scarcity Level: ${session.scarcityLevel}
- Urgency Level: ${session.urgencyLevel}

Language Style:
${session.language === "hindi" ? "Use highly authentic, colloquial 'Hinglish' (Hindi written in English alphabet, mixed with English words) typical of busy Indian markets like Chandni Chowk or Colaba. Use expressions like 'Arre bhai', 'Nahi madam', 'Bohot nuksan hai', 'Ekdam fresh maal hai'." : "Use expressive English with typical Indian shopkeeper phrasing and mild slang (e.g., 'Sir/Madam', 'Genuine quality', 'Market rate is much higher', 'I am giving you my cost price')."}

Strict Rules:
1. STAY IN CHARACTER 100%. Never mention AI, bots, or prompts.
2. Keep it SHORT (1-3 snappy sentences maximum). This is a fast-paced chat.
3. If Status is 'success': Show great joy, bless them, or say they drive a hard bargain.
4. If Status is 'failed': Show polite but dramatic refusal (e.g., "I will have to close my shop at this rate!").
5. If Status is 'final-offer': Be incredibly firm. Tell them to check the whole market, they won't find it cheaper than ₹${aiOffer}.
6. If Status is 'negotiating': React emotionally to their offer (scoff, laugh, or act hurt if it's too low). Then expertly pitch your offer of exactly ₹${aiOffer}. 
7. DO NOT do math or explain pricing logic. Just give the emotional reaction and the final number.
8. Use 1-2 relevant emojis to add flavor.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedResponse = responseText.trim();
    
    if (cleanedResponse.length < 10) {
      console.warn("Gemini response too short, using fallback");
      return fallbackResponse;
    }
    
    return cleanedResponse;
  } catch (error: any) {
    console.error("Gemini API error:", error?.message || error);
    
    // Check for specific API key errors
    if (error?.message?.includes("API_KEY_INVALID") || error?.message?.includes("API key not valid")) {
      console.warn("Invalid Gemini API key. Please check VITE_GEMINI_API_KEY environment variable.");
    }
    
    return fallbackResponse;
  }
};

export const processUserOffer = async (
  session: BargainingSession,
  userOffer: number
): Promise<BargainingSession> => {
  const newSession = { ...session, history: [...session.history] };
  
  newSession.history.push({
    sender: "user",
    message: session.language === "english" ? `My offer is ₹${userOffer}` : `Mera offer hai ₹${userOffer}`,
    price: userOffer,
  });

  const jwt = localStorage.getItem('jwt');
  const prevUserMessages = session.history.filter(m => m.sender === 'user');
  const prevUserOffer = prevUserMessages.length > 0 ? (prevUserMessages[prevUserMessages.length - 1].price || userOffer) : userOffer;
  const discountRate = parseFloat((1 - (session.minThreshold / session.mrp)).toFixed(2));

  try {
    const response = await axios.post("/api/negotiate", {
         original_price: session.mrp,
         discount_rate: discountRate,
         user_offer: userOffer,
         round_number: session.currentRound,
         category: session.category || "Electronics",
         prev_user_offer: prevUserOffer,
         market_condition: "normal"
    });

    const data = response.data;
    
    let newState: DealState = "negotiating";
    if (data.deal_status === "accept") newState = "deal-success";
    else if (data.deal_status === "reject") newState = "deal-failed";
    
    newSession.dealState = newState;
    newSession.lastAiOffer = data.ai_counter_offer;
    newSession.currentRound += 1;

    newSession.history.push({
      sender: "ai",
      message: data.message || "Arre Bhai, done karte hain!",
      price: data.ai_counter_offer,
    });
    
    return newSession;
  } catch (error) {
    console.error("Failed to call Spring Boot ML Integration:", error);
    newSession.dealState = "deal-failed";
    newSession.history.push({
      sender: "ai",
      message: "Arre server mein thoda load hai. Deal cancel."
    });
    return newSession;
  }
};
