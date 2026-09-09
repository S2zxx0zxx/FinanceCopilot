import { ConsentRepo, AuditRepo } from '../../db/repositories.js';
import { ConsentService } from '../../domains/consent/consent.service.js';
import { getActivePolicyVersion } from '../../config/policies.js';
const service = new ConsentService(ConsentRepo, AuditRepo);
export const requireConsent = policy => async (req, res, next) => {
    try {
        if (!await service.hasConsent(req.user.userId, policy, getActivePolicyVersion(policy))) return res.status(403).json({error:'CONSENT_REQUIRED',policy,message:'Review your privacy choices and grant consent before continuing.'});
        next();
    } catch(error) { next(error); }
};
