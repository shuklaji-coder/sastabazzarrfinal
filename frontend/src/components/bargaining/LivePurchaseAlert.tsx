"use client";

import { useState, useEffect } from "react";
import { Users, MapPin, Clock } from "lucide-react";

interface LivePurchaseAlertProps {
  language?: "hindi" | "english";
  isVisible?: boolean;
}

export function LivePurchaseAlert({ language = "hindi", isVisible = true }: LivePurchaseAlertProps) {
  const [notification, setNotification] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  // Generate random purchase notifications
  const getRecentPurchaseNotification = (lang: "hindi" | "english"): string => {
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
    
    if (lang === "english") {
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

  // Show notifications at random intervals
  useEffect(() => {
    if (!isVisible) return;

    const showNotification = () => {
      const newNotification = getRecentPurchaseNotification(language);
      setNotification(newNotification);
      setShowAlert(true);
      
      // Hide after 5 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    };

    // Show first notification after 3 seconds
    const firstTimer = setTimeout(showNotification, 3000);
    
    // Then show notifications at random intervals (8-20 seconds)
    const intervalTimer = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to show notification
        showNotification();
      }
    }, Math.random() * 12000 + 8000); // 8-20 seconds

    return () => {
      clearTimeout(firstTimer);
      clearInterval(intervalTimer);
    };
  }, [language, isVisible]);

  if (!isVisible || !showAlert) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm animate-slide-in-right">
      <div className="bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-white/20 flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium opacity-90 mb-1">
            <MapPin className="w-3 h-3" />
            <span>Live Purchase</span>
            <Clock className="w-3 h-3" />
          </div>
          <p className="text-sm font-bold leading-tight">
            {notification}
          </p>
        </div>
      </div>
    </div>
  );
}
