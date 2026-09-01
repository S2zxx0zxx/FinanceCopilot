/**
 * Queue Adapter Interface
 * 
 * Defines the contract for enqueuing background tasks (e.g., OCR, AI parsing).
 */

export class QueueInterface {
    /**
     * Pushes a new message/job to the queue.
     * @param {string} queueName - The target queue name
     * @param {Object} payload - The job payload data
     * @returns {Promise<string>} The job ID
     */
    async enqueue(queueName, payload) {
        throw new Error('Method not implemented.');
    }
}
