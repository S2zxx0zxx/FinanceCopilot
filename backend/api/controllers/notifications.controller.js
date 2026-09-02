import { dbClient } from '../db/client.js';

/**
 * Notifications Controller — Full CRUD + mark read + create
 */
export class NotificationsController {
    /**
     * GET /api/v1/notifications
     * Returns all notifications for the user, newest first.
     */
    static async listNotifications(req, res, next) {
        try {
            const userId = req.user.userId;
            const { unread_only, limit = 50 } = req.query;
            const filter = unread_only === 'true' ? 'AND is_read = false' : '';
            const query = `
                SELECT notification_id, type, title, description, severity,
                       action_href, action_label, is_read, created_at, read_at
                FROM notifications
                WHERE user_id = $1 ${filter}
                ORDER BY created_at DESC
                LIMIT $2;
            `;
            const result = await dbClient.query(query, [userId, parseInt(limit, 10)]);
            res.json({
                notifications: result.rows,
                unread_count: result.rows.filter(n => !n.is_read).length,
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * PUT /api/v1/notifications/:id/read
     * Mark a single notification as read.
     */
    static async markRead(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            await dbClient.query(
                `UPDATE notifications SET is_read = true, read_at = NOW() WHERE notification_id = $2 AND user_id = $1`,
                [userId, id]
            );
            res.json({ status: 'OK' });
        } catch (err) {
            next(err);
        }
    }

    /**
     * PUT /api/v1/notifications/read-all
     * Mark all unread notifications as read.
     */
    static async markAllRead(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await dbClient.query(
                `UPDATE notifications SET is_read = true, read_at = NOW() WHERE user_id = $1 AND is_read = false RETURNING notification_id`,
                [userId]
            );
            res.json({ updated: result.rowCount });
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /api/v1/notifications (internal — used by other services to create notifications)
     */
    static async createNotification(req, res, next) {
        try {
            const userId = req.user.userId;
            const { type, title, description, severity = 'info', action_href, action_label } = req.body;
            if (!type || !title) {
                return res.status(422).json({ error: 'VALIDATION_ERROR', message: 'type and title are required' });
            }
            const query = `
                INSERT INTO notifications (user_id, type, title, description, severity, action_href, action_label)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *;
            `;
            const result = await dbClient.query(query, [userId, type, title, description, severity, action_href, action_label]);
            res.status(201).json({ notification: result.rows[0] });
        } catch (err) {
            next(err);
        }
    }

    /**
     * DELETE /api/v1/notifications/:id
     */
    static async deleteNotification(req, res, next) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            await dbClient.query(`DELETE FROM notifications WHERE notification_id = $2 AND user_id = $1`, [userId, id]);
            res.status(204).json({ status: 'OK' });
        } catch (err) {
            next(err);
        }
    }
}
