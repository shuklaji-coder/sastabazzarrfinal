# -*- coding: utf-8 -*-
"""
=============================================================
  AI NEGOTIATION MODEL  -  Upgraded v2
  Algorithm : XGBoost Regressor (XGBRegressor)
  Features  : 20 engineered features (up from 13)
  Data      : 100,000 synthetic negotiation sessions
  New       : monotonic price constraints, negotiation
              momentum, aggression score, anchor effect,
              deal-probability feature, better regularisation
=============================================================
"""

import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import json
import warnings
warnings.filterwarnings("ignore")

# ---------------------------------------------------------------
# 1.  SYNTHETIC DATA GENERATION  (100k rows)
# ---------------------------------------------------------------

np.random.seed(42)
N = 100_000

CATEGORIES = ["Electronics", "Fashion", "Living", "Sports", "Books", "Beauty"]
CATEGORY_MAP = {cat: i for i, cat in enumerate(CATEGORIES)}

# Each category: (price_low, price_high, stubbornness, avg_margin)
CATEGORY_CONFIG = {
    "Electronics": (500,  80000, 0.88, 0.30),
    "Fashion":     (200,  15000, 0.72, 0.55),
    "Living":      (300,  20000, 0.76, 0.45),
    "Sports":      (200,  10000, 0.74, 0.40),
    "Books":       (100,   2000, 0.65, 0.20),
    "Beauty":      (150,   5000, 0.69, 0.50),
}

MARKET_CONDITIONS = ["high", "normal", "low"]
MARKET_MODIFIER   = {"high": 1.05, "normal": 1.0, "low": 0.92}

records = []

for _ in range(N):
    category      = np.random.choice(CATEGORIES)
    low, high, stub, margin = CATEGORY_CONFIG[category]
    market        = np.random.choice(MARKET_CONDITIONS, p=[0.25, 0.55, 0.20])
    mkt_mod       = MARKET_MODIFIER[market]

    original_price = round(np.random.uniform(low, high) / 10) * 10
    discount_rate  = np.random.uniform(0.05, margin)
    min_threshold  = round(original_price * (1 - discount_rate) / 10) * 10
    round_number   = np.random.randint(1, 7)

    if np.random.rand() < 0.35:
        user_offer_pct = np.random.uniform(0.50, 0.72)
    else:
        user_offer_pct = np.random.uniform(0.72, 0.98)
    user_offer = round(original_price * user_offer_pct / 10) * 10

    if round_number == 1:
        prev_user_offer_pct = user_offer_pct
    else:
        shift = np.random.uniform(0.00, 0.08)
        prev_user_offer_pct = max(0.50, user_offer_pct - shift)
    prev_user_offer = round(original_price * prev_user_offer_pct / 10) * 10

    is_regular   = np.random.choice([0, 1], p=[0.55, 0.45])
    total_orders = (np.random.randint(0, 5)   if is_regular == 0
                    else np.random.randint(5, 60))
    tenure_days  = (np.random.randint(0, 30)  if is_regular == 0
                    else np.random.randint(30, 1200))
    loyalty_factor = 0.0
    if is_regular:
        loyalty_factor = min(0.06, total_orders * 0.001 + tenure_days * 0.00004)

    # -- Engineered features --
    gap_pct            = (original_price - user_offer) / original_price
    threshold_gap_pct  = (user_offer - min_threshold) / original_price
    round_progress     = round_number / 6.0

    momentum           = (user_offer - prev_user_offer) / original_price

    midpoint           = (original_price + min_threshold) / 2
    aggression_score   = max(0.0, (midpoint - user_offer) / (midpoint - min_threshold + 1e-6))
    aggression_score   = min(1.0, aggression_score)

    price_anchor_ratio = user_offer / original_price

    gap_to_threshold   = max(0.0, user_offer - min_threshold)
    deal_prob          = (gap_to_threshold / (original_price * 0.15 + 1e-6))
    deal_prob          = min(1.0, deal_prob) * (0.5 + 0.5 * round_progress) * (1 + loyalty_factor)
    deal_prob          = min(1.0, deal_prob)

    market_encoded     = {"high": 2, "normal": 1, "low": 0}[market]
    abs_gap_norm       = (original_price - user_offer) / (high - low + 1e-6)

    # -- Counter-offer simulation --
    base           = original_price * stub * mkt_mod
    round_discount = round_progress * (original_price - min_threshold) * 0.60
    user_pull      = max(0, threshold_gap_pct) * (original_price - min_threshold) * 0.45
    loyalty_pull   = loyalty_factor * original_price * 1.2
    momentum_pull  = max(0, momentum) * original_price * 0.30
    aggr_penalty   = aggression_score * original_price * 0.03

    counter = base - round_discount - user_pull - loyalty_pull - momentum_pull + aggr_penalty
    counter += np.random.normal(0, original_price * 0.006)
    counter  = round(max(min_threshold, min(counter, original_price * 0.97)) / 10) * 10

    records.append({
        "original_price":       original_price,
        "discount_rate":        discount_rate,
        "user_offer":           user_offer,
        "round_number":         round_number,
        "category_encoded":     CATEGORY_MAP[category],
        "gap_pct":              round(gap_pct, 4),
        "threshold_gap_pct":    round(threshold_gap_pct, 4),
        "user_offer_pct":       round(user_offer_pct, 4),
        "round_progress":       round(round_progress, 4),
        "is_regular":           is_regular,
        "total_orders":         total_orders,
        "tenure_days":          tenure_days,
        "loyalty_factor":       round(loyalty_factor, 4),
        "negotiation_momentum": round(momentum, 4),
        "aggression_score":     round(aggression_score, 4),
        "price_anchor_ratio":   round(price_anchor_ratio, 4),
        "deal_prob_estimate":   round(deal_prob, 4),
        "market_encoded":       market_encoded,
        "abs_gap_norm":         round(abs_gap_norm, 4),
        "prev_user_offer_pct":  round(prev_user_offer_pct, 4),
        "ai_counter_offer":     counter,
    })

df = pd.DataFrame(records)
df.to_csv("negotiation_data.csv", index=False)
print(f"[OK] Dataset created : {len(df):,} rows")
print(f"     Regular customers : {df['is_regular'].sum():,} ({df['is_regular'].mean()*100:.1f}%)")

# ---------------------------------------------------------------
# 2.  FEATURES
# ---------------------------------------------------------------

FEATURES = [
    "original_price", "discount_rate", "user_offer", "round_number",
    "category_encoded",
    "gap_pct", "threshold_gap_pct", "user_offer_pct", "round_progress",
    "is_regular", "total_orders", "tenure_days", "loyalty_factor",
    "negotiation_momentum", "aggression_score", "price_anchor_ratio",
    "deal_prob_estimate", "market_encoded", "abs_gap_norm",
    "prev_user_offer_pct",
]
TARGET = "ai_counter_offer"

X = df[FEATURES]
y = df[TARGET]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ---------------------------------------------------------------
# 3.  XGBOOST  (with monotonic constraints)
#  +1 => output increases with feature
#  -1 => output decreases with feature
#   0 => unconstrained
# ---------------------------------------------------------------

MONOTONE = {
    "original_price":       1,
    "discount_rate":       -1,
    "user_offer":           0,   # Relaxed to allow native interaction importance
    "round_number":        -1,
    "category_encoded":     0,
    "gap_pct":              0,
    "threshold_gap_pct":    0,
    "user_offer_pct":       0,
    "round_progress":       0,
    "is_regular":           0,
    "total_orders":         0,
    "tenure_days":          0,
    "loyalty_factor":      -1,   # Keep loyalty logic
    "negotiation_momentum": 0,   # Relaxed
    "aggression_score":     0,   # Relaxed
    "price_anchor_ratio":   0,   # Relaxed
    "deal_prob_estimate":   0,
    "market_encoded":       1,   # High demand -> hold price
    "abs_gap_norm":         0,
    "prev_user_offer_pct":  0,
}
monotone_constraints = tuple(MONOTONE[f] for f in FEATURES)

print("\n[...] Training XGBoost model (100k rows) ...")

model = XGBRegressor(
    n_estimators         = 400,
    learning_rate        = 0.05,
    max_depth            = 8,      # Slightly deeper to capture complex interactions
    min_child_weight     = 10,
    subsample            = 0.85,
    colsample_bytree     = 0.9,    # Higher to ensure user_offer is sampled more often
    reg_alpha            = 0.1,    # Relaxed L1 to let subtle signals through
    reg_lambda           = 1.0,    # Standard L2
    monotone_constraints = monotone_constraints,
    tree_method          = "hist",
    device               = "cpu",
    random_state         = 42,
    n_jobs               = -1,
    verbosity            = 1,
)

model.fit(
    X_train, y_train,
    eval_set = [(X_test, y_test)],
    verbose  = 100,
)

# ---------------------------------------------------------------
# 4.  EVALUATE
# ---------------------------------------------------------------

y_pred  = model.predict(X_test)
mae     = mean_absolute_error(y_test, y_pred)
r2      = r2_score(y_test, y_pred)
pct_err = np.abs((y_test - y_pred) / y_test).mean() * 100

print(f"\n{'='*55}")
print(f"  MODEL PERFORMANCE  (XGBoost v2)")
print(f"{'='*55}")
print(f"  MAE             : Rs.{mae:.2f}")
print(f"  R2              : {r2:.6f}")
print(f"  Mean Pct Error  : {pct_err:.3f}%")

print("\n  Running 5-fold cross-validation ...")
cv_scores = cross_val_score(model, X, y, cv=5, scoring="r2", n_jobs=-1)
print(f"  CV R2  5-fold   : {cv_scores.mean():.6f} +/- {cv_scores.std():.6f}")

print(f"\n{'-'*55}")
print(f"  FEATURE IMPORTANCES (gain)")
print(f"{'-'*55}")
importances = dict(zip(FEATURES, model.feature_importances_))
for feat, imp in sorted(importances.items(), key=lambda x: -x[1]):
    bar = "#" * int(imp * 80)
    print(f"  {feat:<25} {imp:.4f}  {bar}")

# ---------------------------------------------------------------
# 5.  BEHAVIOUR TESTS
# ---------------------------------------------------------------

print(f"\n{'-'*55}")
print(f"  LOYALTY IMPACT TEST  (Rs.10,000 product, round 3)")
print(f"{'-'*55}")
base_t = {
    "original_price": 10000, "discount_rate": 0.25, "user_offer": 7800,
    "round_number": 3, "category_encoded": 0,
    "gap_pct": 0.22, "threshold_gap_pct": 0.28, "user_offer_pct": 0.78,
    "round_progress": 0.5, "negotiation_momentum": 0.04,
    "aggression_score": 0.30, "price_anchor_ratio": 0.78,
    "deal_prob_estimate": 0.55, "market_encoded": 1,
    "abs_gap_norm": 0.028, "prev_user_offer_pct": 0.74,
}
new_c = {**base_t, "is_regular": 0, "total_orders": 0,  "tenure_days": 0,   "loyalty_factor": 0.0}
reg_c = {**base_t, "is_regular": 1, "total_orders": 25, "tenure_days": 500, "loyalty_factor": 0.05}

new_pred = model.predict(pd.DataFrame([new_c])[FEATURES])[0]
reg_pred = model.predict(pd.DataFrame([reg_c])[FEATURES])[0]
print(f"  New customer counter     : Rs.{new_pred:,.0f}")
print(f"  Regular customer counter : Rs.{reg_pred:,.0f}")
print(f"  Loyalty benefit          : Rs.{new_pred - reg_pred:,.0f} less asked!")

print(f"\n{'-'*55}")
print(f"  MARKET CONDITION TEST  (same product, round 2)")
print(f"{'-'*55}")
base_m = {**new_c, "round_number": 2, "round_progress": 2/6}
for market_name, mcode in [("High Demand", 2), ("Normal", 1), ("Low Demand", 0)]:
    t = {**base_m, "market_encoded": mcode}
    p = model.predict(pd.DataFrame([t])[FEATURES])[0]
    print(f"  {market_name:<15} counter : Rs.{p:,.0f}")

print(f"\n{'-'*55}")
print(f"  AGGRESSION TEST  (same product, round 1)")
print(f"{'-'*55}")
base_a = {**new_c, "round_number": 1, "round_progress": 1/6}
for label, agg, upct in [
    ("Low-baller (50%)",  0.85, 0.50),
    ("Moderate (70%)",    0.40, 0.70),
    ("Fair offer (85%)",  0.10, 0.85),
]:
    t = {**base_a, "user_offer": int(10000*upct), "user_offer_pct": upct,
         "aggression_score": agg, "price_anchor_ratio": upct}
    p = model.predict(pd.DataFrame([t])[FEATURES])[0]
    print(f"  {label:<25} -> counter Rs.{p:,.0f}")

# ---------------------------------------------------------------
# 6.  SAVE
# ---------------------------------------------------------------

with open("negotiation_model.pkl", "wb") as f:
    pickle.dump(model, f)

metadata = {
    "algorithm":      "XGBoost Regressor",
    "version":        "2.0",
    "features":       FEATURES,
    "category_map":   CATEGORY_MAP,
    "n_estimators":   500,
    "learning_rate":  0.04,
    "max_depth":      7,
    "monotone_constraints": MONOTONE,
    "n_training_rows": N,
    "mae":            round(mae, 2),
    "r2":             round(r2, 6),
    "pct_error":      round(float(pct_err), 4),
    "cv_r2_mean":     round(float(cv_scores.mean()), 6),
    "cv_r2_std":      round(float(cv_scores.std()), 6),
    "new_features": [
        "negotiation_momentum",
        "aggression_score",
        "price_anchor_ratio",
        "deal_prob_estimate",
        "market_encoded",
        "abs_gap_norm",
        "prev_user_offer_pct",
    ],
}
with open("model_metadata.json", "w") as f:
    json.dump(metadata, f, indent=2)

print(f"\n{'='*55}")
print(f"  [DONE] Model saved    : negotiation_model.pkl")
print(f"  [DONE] Metadata saved : model_metadata.json")
print(f"  Algorithm used        : XGBoost Regressor v2")
print(f"{'='*55}")
