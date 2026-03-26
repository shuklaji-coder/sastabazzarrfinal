export type DealState = "negotiating" | "final-offer" | "deal-locked" | "deal-success" | "deal-failed";

export interface BargainingSession {
  mrp: number;
  minThreshold: number;
  currentRound: number;
  maxRounds: number;
  lastAiOffer: number;
  dealState: DealState;
  history: { sender: "user" | "ai"; message: string; price?: number }[];
}

export const initBargainingSession = (mrp: number): BargainingSession => {
  // Set min threshold to 60-70% of MRP
  const discountFactor = 0.6 + Math.random() * 0.1;
  const minThreshold = Math.floor(mrp * discountFactor);

  return {
    mrp: mrp,
    minThreshold: minThreshold,
    currentRound: 1,
    maxRounds: 4,
    lastAiOffer: mrp,
    dealState: "negotiating",
    history: [
      {
        sender: "ai",
        message: `Namaste ji! Boliye, is ${mrp} wale item ka kya bhaav lagayenge aap? 🤝`,
        price: mrp,
      },
    ],
  };
};

export const processUserOffer = (
  session: BargainingSession,
  userOffer: number
): BargainingSession => {
  const newSession = { ...session, history: [...session.history] };
  newSession.history.push({
    sender: "user",
    message: `Mera offer hai ₹${userOffer}`,
    price: userOffer,
  });

  if (session.dealState === "final-offer") {
    if (userOffer >= session.lastAiOffer) {
      newSession.dealState = "deal-success";
      newSession.history.push({
        sender: "ai",
        message: `Chalo theek hai! Done deal at ₹${userOffer} 🎉. Khush rahiye!`,
        price: userOffer,
      });
      return newSession;
    } else {
      newSession.dealState = "deal-failed";
      newSession.history.push({
        sender: "ai",
        message: `Arre bhai bola na, isse kam nahi hoga. Deal cancel karni padegi. 🙏`,
        price: session.lastAiOffer,
      });
      return newSession;
    }
  }

  // Round logic
  if (userOffer >= session.lastAiOffer) {
    // User offering more than AI's last offer (generous or mistake)
    newSession.dealState = "deal-success";
    newSession.history.push({
      sender: "ai",
      message: `Bohot shukriya! Apne toh zyada de diya, done deal for ₹${userOffer}! 🎉`,
      price: userOffer,
    });
    return newSession;
  }

  if (userOffer >= session.minThreshold) {
    // User offer is acceptable immediately
    // If it's the very first round, the AI might still counter slightly higher to haggle, but let's make it success for simplicity if >= threshold and close to AI last offer.
    // Actually, to make it fun, if it's high enough, just accept.
    if (userOffer >= session.minThreshold * 1.05) {
      newSession.dealState = "deal-success";
      newSession.history.push({
        sender: "ai",
        message: `Aapki aur meri baat barabar. Deal pakki, ₹${userOffer} mein le jao! 🤝🔥`,
        price: userOffer,
      });
      return newSession;
    }
  }

  // Not accepted directly, AI needs to counter
  newSession.currentRound += 1;

  if (newSession.currentRound >= newSession.maxRounds) {
    // Final offer round
    newSession.dealState = "final-offer";
    const finalOffer = Math.floor(session.minThreshold * 1.02); // Just above min threshold
    newSession.lastAiOffer = finalOffer;
    newSession.history.push({
      sender: "ai",
      message: `Dekho ji, bohot discuss kar liya. Ekdam last price ₹${finalOffer} hai. Lena hai toh boliye warna chhod dijiye! 😅`,
      price: finalOffer,
    });
    return newSession;
  }

  // Intermediate rounds: AI calculates a counter offer
  // It drops the price based on difference, but not below minThreshold yet
  const dropAmount = Math.floor((session.lastAiOffer - session.minThreshold) * 0.4);
  let newAiOffer = session.lastAiOffer - dropAmount;
  
  if (newAiOffer <= userOffer) {
    // Edge case if drop makes AI offer lower than user
    newAiOffer = userOffer + Math.floor(dropAmount * 0.5); 
  }

  newSession.lastAiOffer = newAiOffer;

  const responses = [
    `Arre bhai, itna kam nahi hoga! ₹${newAiOffer} mein de dunga, kya bolte ho? 😄`,
    `Nahi ji, fayda nahi hoga mujhe. Thoda aur badhao. ₹${newAiOffer} lagado? 🙏`,
    `Bahut sasta mang rahe ho... Chalega, aapke liye ₹${newAiOffer} final kar dete hain? 🤝`,
  ];
  const responseMsg = responses[Math.floor(Math.random() * responses.length)];

  newSession.history.push({
    sender: "ai",
    message: responseMsg,
    price: newAiOffer,
  });

  return newSession;
};
