import { ForecastEngine } from '../../domains/forecast/engine.js';
import { ForecastRepo } from '../../db/repositories/forecast.repo.js';
import { dbClient } from '../../db/client.js';
import { Telemetry } from '../../utils/telemetry.js';

const engine = new ForecastEngine(dbClient);

export const getOutlook = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        // FIX (audit P1 #28): 3 sequential LLM-free forecast computations
        // ran back-to-back — each is ~50-200ms of DB I/O, so the route was
        // 5-15s in latency. The 3 horizons are independent → fan out via
        // Promise.all. Save only the successful ones.
        const [forecast7, forecast30, forecast90] = await Promise.all([
            engine.generateForecast(userId, 7),
            engine.generateForecast(userId, 30),
            engine.generateForecast(userId, 90)
        ]);

        await Promise.all([
            forecast7.status  !== 'FORECAST_UNAVAILABLE' ? engine.saveSnapshot(forecast7)  : Promise.resolve(),
            forecast30.status !== 'FORECAST_UNAVAILABLE' ? engine.saveSnapshot(forecast30) : Promise.resolve(),
            forecast90.status !== 'FORECAST_UNAVAILABLE' ? engine.saveSnapshot(forecast90) : Promise.resolve()
        ]);

        // Telemetry hook for Phase 13
        Telemetry.trackEvent(userId, 'FORECAST_OUTLOOK_GENERATED', {
            has_7d: !!forecast7,
            has_30d: !!forecast30
        });

        res.json({
            outlook: {
                '7d': forecast7,
                '30d': forecast30,
                '90d': forecast90
            }
        });
    } catch (error) {
        next(error);
    }
};

export const runScenario = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { modifications } = req.body;
        
        const baseForecast = await engine.generateForecast(userId, 30);
        
        let scenarioImpactPaise = 0;
        if (modifications && modifications.length > 0) {
            modifications.forEach(m => scenarioImpactPaise += (m.amount_paise || 0));
        }

        const scenarioForecast = {
            ...baseForecast,
            pointEstimatePaise: baseForecast.pointEstimatePaise + scenarioImpactPaise,
            lowerBoundPaise: baseForecast.lowerBoundPaise + scenarioImpactPaise,
            upperBoundPaise: baseForecast.upperBoundPaise + scenarioImpactPaise,
            assumptions: {
                ...baseForecast.assumptions,
                is_scenario_simulation: true,
                injected_modifications: modifications
            }
        };

        // Telemetry hook for Phase 13
        Telemetry.trackEvent(userId, 'AI_SCENARIO_RUN', { 
            modifications_count: modifications ? modifications.length : 0
        });

        res.json({ scenarioResult: scenarioForecast });
    } catch (error) {
        next(error);
    }
};

export const getEvaluationMetrics = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const metrics = await ForecastRepo.getRecentEvaluations(userId);
        res.json({ evaluations: metrics });
    } catch (error) {
        next(error);
    }
};
