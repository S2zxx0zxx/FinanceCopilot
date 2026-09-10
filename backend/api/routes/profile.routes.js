import express from 'express';
import { requireAuth } from '../middlewares/security.js';
import { ProfileController } from '../controllers/profile.controller.js';

export function setupProfileRoutes(app) {
    const router = express.Router();

    router.get('/profile', requireAuth, ProfileController.getMe);
    router.get('/profile/avatar-presets', requireAuth, ProfileController.listAvatarPresets);
    router.patch('/profile/avatar', requireAuth, ProfileController.updateAvatar);

    app.use('/api/v1', router);
}
