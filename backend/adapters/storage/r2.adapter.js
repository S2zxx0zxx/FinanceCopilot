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
        if (!process.env.R2_ENDPOINT_URL || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
            throw new AppError('R2 Storage credentials missing in environment', 500, true, 'CONFIG_ERROR');
        }
        this.s3Client = new S3Client({
            region: 'auto',
            endpoint: process.env.R2_ENDPOINT_URL,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
            }
        });
    }

    /**
     * Downloads the file from R2 as a Buffer (used by the Queue Worker)
     */
    async downloadFile(bucketName, key) {
        try {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: key
            });
            const response = await this.s3Client.send(command);
            
            // Convert stream to buffer
            const chunks = [];
            for await (const chunk of response.Body) {
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
