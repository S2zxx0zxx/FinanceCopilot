/**
 * Storage Adapter Interface
 * 
 * Defines the contract for securely storing and retrieving files (e.g. Bank Statements).
 */

export class StorageInterface {
    /**
     * Uploads a file stream/buffer to the storage provider.
     * @param {string} bucketName - Target bucket
     * @param {string} key - Unique path/filename for the object
     * @param {Buffer|ReadableStream} data - File payload
     * @param {string} mimeType - e.g., 'application/pdf'
     * @returns {Promise<string>} The storage URI or key
     */
    async uploadFile(bucketName, key, data, mimeType) {
        throw new Error('Method not implemented.');
    }

    /**
     * Generates a time-limited presigned URL to securely download/view a file.
     * @param {string} bucketName 
     * @param {string} key 
     * @param {number} expiresInSeconds 
     * @returns {Promise<string>} Signed URL
     */
    async getSignedUrl(bucketName, key, expiresInSeconds = 3600) {
        throw new Error('Method not implemented.');
    }

    /**
     * Permanently deletes a file from storage (ADR-006 Data Retention).
     * @param {string} bucketName 
     * @param {string} key 
     */
    async deleteFile(bucketName, key) {
        throw new Error('Method not implemented.');
    }
}
