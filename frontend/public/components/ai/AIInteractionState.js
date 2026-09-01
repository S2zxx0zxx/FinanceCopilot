/**
 * AI Interaction State Machine
 * Manages conversation flow: IDLE → SUBMITTING → GATEWAY_PROCESSING → COMPLETE|ERROR
 */

const STATES = {
    IDLE: 'IDLE',
    SUBMITTING: 'SUBMITTING',
    GATEWAY_PROCESSING: 'GATEWAY_PROCESSING',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR',
    UNAVAILABLE: 'UNAVAILABLE',
    CONFIRMATION_REQUIRED: 'CONFIRMATION_REQUIRED',
};

export { STATES };

export class AIInteractionState {
    constructor(updateUICallback) {
        this.updateUI = updateUICallback;
        this.state = STATES.IDLE;
        this.history = [];
        this._lastQuery = null;
        this._lastApiClient = null;
        this._timeout = null;
    }

    _genId() {
        return 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    }

    _addMessage(msg) {
        const m = { ...msg, id: msg.id || this._genId(), timestamp: msg.timestamp || new Date().toISOString() };
        this.history.push(m);
        return m;
    }

    getMessages() {
        return [...this.history];
    }

    submitQuery(text, apiClient) {
        if (!text?.trim() || this.state === STATES.SUBMITTING || this.state === STATES.GATEWAY_PROCESSING) return;

        this._lastQuery = text;
        this._lastApiClient = apiClient;

        // Add user message
        this._addMessage({ role: 'user', content: text.trim() });

        // Add loading indicator for AI
        this._addMessage({ role: 'ai', content: '', isLoading: true });
        this.state = STATES.SUBMITTING;
        this._notify();

        // Clear any existing timeout
        if (this._timeout) { clearTimeout(this._timeout); this._timeout = null; }

        // 30s timeout
        this._timeout = setTimeout(() => this._handleError(new Error('Request timed out. Please try again.')), 30000);

        this._callAPI(apiClient, text);
    }

    async _callAPI(apiClient, text) {
        try {
            this.state = STATES.GATEWAY_PROCESSING;
            this._notify();

            let result;
            if (typeof apiClient === 'function') {
                result = await apiClient(text);
            } else {
                result = apiClient;
            }

            if (this._timeout) { clearTimeout(this._timeout); this._timeout = null; }

            // Remove loading indicator
            this.history = this.history.filter(m => !m.isLoading);

            // Add AI response
            this._addMessage({
                role: 'ai',
                content: result?.answer || result?.content || result?.message || 'I analyzed your data but couldn\'t generate a clear response. Please try rephrasing.',
                evidence: result?.evidence,
                actions: result?.actions || [],
                confidence: result?.confidence,
            });

            this.state = result?.requires_confirmation ? STATES.CONFIRMATION_REQUIRED : STATES.COMPLETE;
            this._notify();

        } catch (err) {
            this._handleError(err);
        }
    }

    _handleError(err) {
        if (this._timeout) { clearTimeout(this._timeout); this._timeout = null; }

        this.history = this.history.filter(m => !m.isLoading);

        const isUnavailable = err?.status === 503 || err?.code === 'AI_UNAVAILABLE';

        if (isUnavailable) {
            this.state = STATES.UNAVAILABLE;
            this._addMessage({ role: 'ai', content: 'AI is temporarily unavailable. Please try again in a moment.', isError: true });
        } else {
            this.state = STATES.ERROR;
            this._addMessage({ role: 'ai', content: err?.message || 'An unexpected error occurred. Please try again.', isError: true });
        }
        this._notify();
    }

    static renderTypingIndicator() {
        return `<div class="ai-msg ai-msg-ai" role="article">
            <div class="ai-msg-bubble">
                <div class="ai-typing-indicator"><span></span><span></span><span></span></div>
            </div>
        </div>`;
    }

    static renderErrorState(msg) {
        return `<div class="ai-msg ai-msg-ai" role="article">
            <div class="ai-msg-bubble ai-msg-error">
                <p class="text-body text-negative">${msg || 'Something went wrong.'}</p>
                <button class="btn btn-ghost btn-sm mt-3" data-action="retry">Try Again</button>
            </div>
        </div>`;
    }

    static renderUnavailableState() {
        return `<div class="ai-msg ai-msg-ai" role="article">
            <div class="ai-msg-bubble ai-msg-error">
                <p class="text-body text-negative">AI is temporarily unavailable. Please try again in a moment.</p>
            </div>
        </div>`;
    }

    static attachErrorListeners(container, onRetry) {
        if (!container) return;
        const retryBtns = container.querySelectorAll('[data-action="retry"]');
        retryBtns.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', () => {
                if (onRetry) onRetry();
                else if (window.aiChatRetry) window.aiChatRetry();
            });
        });
    }

    confirmAction(data, apiClient) {
        if (!data || this.state === STATES.SUBMITTING || this.state === STATES.GATEWAY_PROCESSING) return;

        // Remove last AI confirmation message if any
        const lastAi = [...this.history].reverse().find(m => m.role === 'ai' && !m.isError);
        if (lastAi) {
            this.history = this.history.filter(m => m.id !== lastAi.id);
        }

        this._addMessage({ role: 'user', content: data.label || 'Confirmed action' });
        this._addMessage({ role: 'ai', content: '', isLoading: true });
        this.state = STATES.SUBMITTING;
        this._notify();

        this._callAPI(apiClient, data);
    }

    retry() {
        if (this._lastQuery && this._lastApiClient) {
            // Remove last error message
            const lastErr = [...this.history].reverse().find(m => m.isError);
            if (lastErr) this.history = this.history.filter(m => m.id !== lastErr.id);

            this.submitQuery(this._lastQuery, this._lastApiClient);
        }
    }

    _notify() {
        if (this.updateUI) {
            this.updateUI({
                state: this.state,
                history: this.history,
                isProcessing: this.state === STATES.SUBMITTING || this.state === STATES.GATEWAY_PROCESSING,
            });
        }
    }
}
