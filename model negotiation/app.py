import os
import json
import logging
import pickle
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all origins in production
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Model and Metadata
MODEL_PATH = "negotiation_model.pkl"
META_PATH = "model_metadata.json"

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    model = None

try:
    with open(META_PATH, "r") as f:
        metadata = json.load(f)
    logger.info("Metadata loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load metadata: {e}")
    metadata = {}

CATEGORY_CONFIG = {
    "Electronics": (500,  80000, 0.88, 0.30),
    "Fashion":     (200,  15000, 0.72, 0.55),
    "Living":      (300,  20000, 0.76, 0.45),
    "Sports":      (200,  10000, 0.74, 0.40),
    "Books":       (100,   2000, 0.65, 0.20),
    "Beauty":      (150,   5000, 0.69, 0.50),
}

CATEGORY_MAP = metadata.get("category_map", {
    "Electronics": 0, "Fashion": 1, "Living": 2, 
    "Sports": 3, "Books": 4, "Beauty": 5
})

MARKET_MAP = {"low": 0, "normal": 1, "high": 2}

def get_hinglish_message(deal_status, round_number, user_offer, ai_offer):
    if deal_status == "accept":
        return "Bhai kya baat hai, chalo done karte hain! Khush raho."
    elif deal_status == "reject":
        return "Arre sir, is daam me toh dukaan band karni padegi. Maaf karo, nahi ho payega."
    else:
        if round_number == 1:
            return f"Arre Bhai, itna kam mat bolo. Theek theek laga lete hain, {ai_offer} me done karte hain."
        elif round_number == 2:
            return f"Dekho apka na mera, thoda aap badho thoda main kam karta hoon. {ai_offer} aakhri bhav hai mera."
        elif round_number == 3:
            return f"Bhaiya last umeed hai, itne me kahin nahi milega. {ai_offer} dedo aur le jao."
        elif round_number == 4:
            return f"Bas karo sir, jaan loge kya meri? Final {ai_offer} rupaiye, socho mat!"
        else:
            return f"Dekh lo sir, isse niche possible hi nahi hai. {ai_offer} last price hai apna."

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify API and model status."""
    if not model or not metadata:
        return jsonify({
            "status": "error", 
            "message": "Model or metadata not loaded properly"
        }), 500
        
    return jsonify({
        "status": "ok",
        "version": metadata.get("version", "Unknown"),
        "mae": metadata.get("mae", "Unknown"),
        "r2": metadata.get("r2", "Unknown")
    })

@app.route('/negotiate', methods=['POST'])
def negotiate():
    """Main negotiation endpoint."""
    try:
        data = request.json
        required_fields = [
            "original_price", "discount_rate", "user_offer", "round_number", 
            "category", "prev_user_offer", "is_regular", "total_orders", 
            "tenure_days", "market_condition"
        ]
        
        # 1. Validate inputs
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Parse basic types
        original_price = float(data["original_price"])
        discount_rate = float(data["discount_rate"])
        user_offer = float(data["user_offer"])
        round_number = int(data["round_number"])
        category = data["category"]
        prev_user_offer = float(data["prev_user_offer"])
        is_regular = int(data["is_regular"])
        total_orders = int(data["total_orders"])
        tenure_days = int(data["tenure_days"])
        market_condition = data["market_condition"].lower()

        # Lookups
        category_encoded = CATEGORY_MAP.get(category, 0)
        market_encoded = MARKET_MAP.get(market_condition, 1)
        
        # Default proxy values if category missing from config
        low_price, high_price, _, _ = CATEGORY_CONFIG.get(category, (100, 20000, 0.7, 0.3))

        # 2. Derived Feature Calculations (Exact matching to training data formulas)
        loyalty_factor = min(0.06, total_orders * 0.001 + tenure_days * 0.00004) if is_regular else 0.0
        min_threshold  = round(original_price * (1 - discount_rate) / 10) * 10
        gap_pct        = (original_price - user_offer) / original_price
        threshold_gap_pct = (user_offer - min_threshold) / original_price
        user_offer_pct = user_offer / original_price
        round_progress = round_number / 6.0
        momentum       = (user_offer - prev_user_offer) / original_price
        midpoint       = (original_price + min_threshold) / 2
        aggression_score = min(1.0, max(0.0, (midpoint - user_offer) / (midpoint - min_threshold + 1e-6)))
        price_anchor_ratio = user_offer / original_price
        gap_to_threshold = max(0.0, user_offer - min_threshold)
        deal_prob = min(1.0, (gap_to_threshold / (original_price * 0.15 + 1e-6)) * (0.5 + 0.5 * round_progress) * (1 + loyalty_factor))
        
        # Use high_price and low_price for category price range
        abs_gap_norm = (original_price - user_offer) / (high_price - low_price + 1e-6)
        prev_user_offer_pct = prev_user_offer / original_price

        # The model expects exact 20 features in exact order
        order = metadata.get("features", [
            "original_price", "discount_rate", "user_offer", "round_number",
            "category_encoded", "gap_pct", "threshold_gap_pct", "user_offer_pct",
            "round_progress", "is_regular", "total_orders", "tenure_days", 
            "loyalty_factor", "negotiation_momentum", "aggression_score", 
            "price_anchor_ratio", "deal_prob_estimate", "market_encoded", 
            "abs_gap_norm", "prev_user_offer_pct"
        ])

        # Dictionary of all features mapped to their names
        features_dict = {
            "original_price": original_price,
            "discount_rate": discount_rate,
            "user_offer": user_offer,
            "round_number": round_number,
            "category_encoded": category_encoded,
            "gap_pct": gap_pct,
            "threshold_gap_pct": threshold_gap_pct,
            "user_offer_pct": user_offer_pct,
            "round_progress": round_progress,
            "is_regular": is_regular,
            "total_orders": total_orders,
            "tenure_days": tenure_days,
            "loyalty_factor": loyalty_factor,
            "negotiation_momentum": momentum,
            "aggression_score": aggression_score,
            "price_anchor_ratio": price_anchor_ratio,
            "deal_prob_estimate": deal_prob,
            "market_encoded": market_encoded,
            "abs_gap_norm": abs_gap_norm,
            "prev_user_offer_pct": prev_user_offer_pct
        }
        
        # Build DataFrame with proper columns to pass to predict
        feature_array = np.array([[features_dict[col] for col in order]])

        # 3. Predict counter offer
        if model is None:
            # Fallback rule-based logic (in case model goes down)
            ai_counter = original_price - (original_price - min_threshold) * 0.3
        else:
            df_features = pd.DataFrame(feature_array, columns=order)
            ai_counter = float(model.predict(df_features)[0])

        # 4. Clamp and Round
        # Clamp counter offer between min_threshold and original_price
        ai_counter = max(min_threshold, min(ai_counter, original_price))
        # Round to nearest 10
        ai_counter = round(ai_counter / 10) * 10

        # 5. Deal Status
        if user_offer >= min_threshold:
            deal_status = "accept"
        elif round_number > 5 and user_offer < min_threshold * 0.80:
            deal_status = "reject"
        else:
            deal_status = "counter"

        # 6. Generate Hinglish message
        message = get_hinglish_message(deal_status, round_number, user_offer, ai_counter)

        return jsonify({
            "ai_counter_offer": ai_counter,
            "deal_status": deal_status,
            "message": message
        })

    except Exception as e:
        logger.error(f"Error processing negotiate request: {e}", exc_info=True)
        # 500 Fallback logic with rule-based response
        ai_counter = float(data.get("original_price", 1000)) * 0.9 if data else 900
        ai_counter = round(ai_counter / 10) * 10
        return jsonify({
            "ai_counter_offer": ai_counter,
            "deal_status": "counter",
            "message": "Arre system mein thoda load hai, chalo bhaisaab isme final karo.",
            "error": "Internal Server Error. Using fallback."
        }), 500

if __name__ == '__main__':
    # Use PORT environment variable provided by Railway
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
