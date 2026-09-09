import { StorageInterface } from './storage.interface.js';
import { AppError } from '../../utils/errors.js';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


/**
 * Cloudflare R2 Storage Adapter
 * 
 * Implements S3-compatible Presigned URL generation for secure, direct-to-cloud uploads.
 */
export class R2StorageAdapter extends StorageInterface {
    constructor() {
        super();
        this._configured = false;
        if (!process.env.R2_ENDPOINT_URL || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
            console.warn('[WARNING] R2 Storage credentials missing in environment. File uploads will fail.');
        }
        // FIX (audit P0 #29): the AWS SDK S3Client constructor performs
        // credential / endpoint validation that can throw on misconfigured
        // env vars. A throw here is uncaught — server.js calls
        // `new R2StorageAdapter(process.env)` at boot, so an exception would
        // crash the whole process before any route could mount. Wrap in
        // try/catch so the server boots in a degraded mode (uploads will 503
        // but the rest of the API stays up). The try/catch is also needed
        // because the @aws-sdk/client-s3 module is ESM and can fail to
        // resolve the credential chain in some sandboxes.
        if (process.env.R2_ENDPOINT_URL && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
            try {
                this.s3Client = new S3Client({
                    region: 'auto',
                    endpoint: process.env.R2_ENDPOINT_URL,
                    credentials: {
                        accessKeyId: process.env.R2_ACCESS_KEY_ID,
                        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
                    }
                });
                this._configured = true;
            } catch (err) {
                console.error('[STORAGE] Failed to initialize R2 S3Client — file uploads disabled:', err.message);
                this.s3Client = null;
            }
        } else {
            this.s3Client = null;
        }
    }

    /**
     * True when the adapter has a usable R2 client. False when credentials
     * were missing OR the S3Client constructor threw. Used by callers to
     * short-circuit with a 503 instead of attempting operations that will
     * crash on `this.s3Client.send`.
     */
    isConfigured() {
        return this._configured === true && !!this.s3Client;
    }

    /**
     * Downloads the file from R2 as a Buffer (used by the Queue Worker)
     */
    async downloadFile(bucketName, key) {
        if (!this.isConfigured()) {
            throw new AppError('R2 storage is not configured — file download unavailable', 503, true, 'STORAGE_NOT_CONFIGURED');
        }
        try {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: key
            });
            const response = await this.s3Client.send(command);
            
            // Convert stream to buffer
            const chunks = [];
            let size = 0;
            for await (const chunk of response.Body) {
                size += chunk.length;
                if (size > 10 * 1024 * 1024) {
                    response.Body.destroy?.();
                    throw new AppError('Statement exceeds 10 MB limit', 422);
                }
                chunks.push(chunk);
            }
            return Buffer.concat(chunks);
        } catch (error) {
            console.error('[STORAGE] Error downloading file:', error);
            throw new AppError('Failed to fetch file from storage', 500, true, 'STORAGE_DOWNLOAD_ERROR');
        }
    }

    /**
     * Generates a pre-signed URL for direct PUT upload to R2
     */
    async getSignedUploadUrl(bucketName, key, mimeType, expiresInSeconds = 300) {
        if (!this.isConfigured()) {
            throw new AppError('R2 storage is not configured — uploads unavailable', 503, true, 'STORAGE_NOT_CONFIGURED');
        }
        try {
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                ContentType: mimeType
            });
            // Client uploads directly using this URL
            const url = await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
            return url;
        } catch (error) {
            console.error('[STORAGE] Error generating presigned URL:', error);
            throw new AppError('Storage service is currently unavailable', 503, true, 'STORAGE_ERROR');
        }
    }

    async uploadFile(_bucketName, _key, _data, _mimeType) {
        throw new AppError('Server-side upload is disabled in Phase 2. Use Presigned URLs.', 400, true, 'DEPRECATED_METHOD');
    }

    async deleteFile(bucketName, key) {
        if (!this.isConfigured()) {
            throw new AppError('R2 storage is not configured — delete unavailable', 503, true, 'STORAGE_NOT_CONFIGURED');
        }
        try {
            const command = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: key
            });
            await this.s3Client.send(command);
        } catch (error) {
            console.error('[STORAGE] Error deleting file:', error);
            throw new AppError('Failed to delete file from storage', 500, true, 'STORAGE_DELETE_ERROR');
        }
    }
}
