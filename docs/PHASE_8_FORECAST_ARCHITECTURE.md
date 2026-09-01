# Phase 8 — Master Autonomous Forecasting Engine Architecture

## Overview
The Phase 8 forecasting engine computes probabilistic estimates of a user's future financial state (7, 30, and 90 days out) based on historical behavior, current liquid cash, and confirmed upcoming commitments.

## Guiding Principles
1. **Forecast Target:** `[horizon]_ending_balance` in `BIGINT` paise.
2. **Point-In-Time Correctness:** Future data must NEVER leak into historical feature extraction. Evaluated rigorously via Walk-Forward Validation.
3. **Dependencies:** The engine utilizes pure JavaScript baselines and probabilistic exponential smoothing models to remain lightweight and avoid PyTorch/Scikit-learn dependencies.
4. **Source of Truth:** Phase 5 and Phase 7 (PostgreSQL) remain the single source of truth. Forecasts are strictly read-only estimates.

## Component Breakdown

### 1. Database Schema (`010_forecast_schema.sql`)
- `forecast_model_registry`: Defines approved models (e.g., `baseline_rolling_median`).
- `forecast_snapshots`: Persisted outputs containing the point estimate, bounds, interval level, trust, drivers, and pressure points.
- `forecast_evaluations`: Persisted evaluation metrics (MAE, RMSE, interval coverage).

### 2. Feature Extraction (`features.js`)
Extracts inputs explicitly constrained by an `as_of` timestamp:
- Liquid cash buffer.
- 30-day historical spending volatility.
- Phase-7 confirmed upcoming commitments (deterministic).

### 3. Forecasting Models
- **Baseline Models (`baselines.js`):** Implements `Rolling Median` projection as the default robust estimator.
- **Probabilistic Models (`models.js`):** Implements `Exponential Smoothing` to capture stable spending trends and project residuals.

### 4. Calibration & Uncertainty (`calibration.js`)
Computes strict 80% nominal prediction intervals using scaled volatility metrics ($variance \times \sqrt{t}$). Never claims false 100% certainty.

### 5. Evaluation (`evaluation.js`)
Time-ordered walk-forward backtesting. Simulates the engine at $T$, measures against actuals at $T+horizon$. Evaluates empirical interval coverage (did the actual number fall within our predicted bounds?).

### 6. Orchestration (`engine.js`)
Integrates the features, runs the model, scales uncertainty bounds, calculates drivers, generates pressure points, and saves the snapshot to PostgreSQL.

### 7. Scenarios
Isolated simulation layer. Mutates extracted features in memory and generates a transient forecast payload. Explicitly bypasses the `forecast_snapshots` persistence layer to prevent data pollution.
