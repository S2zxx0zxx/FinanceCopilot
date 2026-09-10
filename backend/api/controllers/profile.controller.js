import { dbClient } from '../../db/client.js';
import { logger } from '../../utils/logger.js';

const PROFILE_SELECT = `
    SELECT u.user_id, u.email, u.display_name, u.created_at,
           u.avatar_mode, u.preset_avatar_id,
           p.asset_path AS preset_avatar_url,
           p.label AS preset_avatar_label
    FROM users u
    LEFT JOIN profile_avatar_presets p
      ON p.preset_id = u.preset_avatar_id
     AND p.is_active = TRUE
    WHERE u.user_id = $1
`;

function profilePayload(row) {
    return {
        user_id: row.user_id,
        email: row.email,
        display_name: row.display_name,
        created_at: row.created_at,
        avatar_mode: row.avatar_mode || 'account',
        preset_avatar_id: row.preset_avatar_id || null,
        preset_avatar_url: row.preset_avatar_url || null,
        preset_avatar_label: row.preset_avatar_label || null,
    };
}

export class ProfileController {
    static async getMe(req, res, next) {
        try {
            const { rows } = await dbClient.query(PROFILE_SELECT, [req.user.userId]);
            if (!rows.length) return res.status(404).json({ error: 'User not found' });
            res.json(profilePayload(rows[0]));
        } catch (err) {
            next(err);
        }
    }

    static async listAvatarPresets(req, res, next) {
        try {
            const { rows } = await dbClient.query(
                `SELECT preset_id, label, asset_path, alt_text, sort_order
                 FROM profile_avatar_presets
                 WHERE is_active = TRUE
                 ORDER BY sort_order ASC`
            );
            res.json({ presets: rows });
        } catch (err) {
            next(err);
        }
    }

    static async updateAvatar(req, res, next) {
        const client = await dbClient.connect();
        try {
            const mode = req.body?.mode;
            const presetId = req.body?.preset_avatar_id ?? null;

            if (!['account', 'preset'].includes(mode)) {
                return res.status(422).json({
                    error: 'VALIDATION_ERROR',
                    message: 'Avatar mode must be account or preset.',
                });
            }
            if (mode === 'account' && presetId !== null) {
                return res.status(422).json({
                    error: 'VALIDATION_ERROR',
                    message: 'Account avatar mode cannot include a preset avatar.',
                });
            }
            if (mode === 'preset' && (typeof presetId !== 'string' || !presetId.trim())) {
                return res.status(422).json({
                    error: 'VALIDATION_ERROR',
                    message: 'Choose a valid preset avatar.',
                });
            }

            await client.query('BEGIN');

            if (mode === 'preset') {
                const preset = await client.query(
                    `SELECT preset_id
                     FROM profile_avatar_presets
                     WHERE preset_id = $1 AND is_active = TRUE
                     FOR SHARE`,
                    [presetId]
                );
                if (!preset.rows.length) {
                    await client.query('ROLLBACK');
                    return res.status(422).json({
                        error: 'INVALID_AVATAR_PRESET',
                        message: 'That avatar preset is not available.',
                    });
                }
            }

            const updated = await client.query(
                `UPDATE users
                 SET avatar_mode = $2,
                     preset_avatar_id = $3,
                     updated_at = NOW()
                 WHERE user_id = $1 AND is_deleted = FALSE
                 RETURNING user_id`,
                [req.user.userId, mode, mode === 'preset' ? presetId : null]
            );

            if (!updated.rows.length) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'User not found' });
            }

            const profile = await client.query(PROFILE_SELECT, [req.user.userId]);
            await client.query('COMMIT');

            logger.audit('PROFILE_AVATAR_UPDATED', req.user.userId, 'profile_avatar', {
                mode,
                preset_avatar_id: mode === 'preset' ? presetId : null,
            });

            res.json({ profile: profilePayload(profile.rows[0]) });
        } catch (err) {
            try { await client.query('ROLLBACK'); } catch {}
            next(err);
        } finally {
            client.release();
        }
    }
}
