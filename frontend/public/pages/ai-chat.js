// ═══════════════════════════════════════════════════════════════════════
// FinCopilot — AI Chat (SCR-29)
// Conversational AI interface for financial Q&A via AI Gateway
// ═══════════════════════════════════════════════════════════════════════

import { ApiClient } from '../services/api.js';
import { AIInteractionState } from '../components/ai/AIInteractionState.js';
import { AIComposer } from '../components/ai/AIComposer.js';
import { AIMessage } from '../components/ai/AIMessage.js';

const STATUS_CONFIG = {
    IDLE: { color: 'var(--color-positive)', label: 'Ready' },
    SUBMITTING: { color: 'var(--color-warning)', label: 'Sending...' },
    GATEWAY_PROCESSING: { color: 'var(--color-warning)', label: 'Analyzing your financial data...' },
    COMPLETE: { color: 'var(--color-positive)', label: 'Ready' },
    ERROR: { color: 'var(--color-negative)', label: 'Error — tap to retry' },
    UNAVAILABLE: { color: 'var(--color-negative)', label: 'AI unavailable' },
    CONFIRMATION_REQUIRED: { color: 'var(--color-warning)', label: 'Awaiting confirmation' }
};

const WELCOME_CHIPS = [
    { text: 'How am I doing this month?', label: 'Monthly summary' },
    { text: 'Any money leaks I should know about?', label: 'Find money leaks' },
    { text: 'Can I afford a new phone?', label: 'Can I afford?' },
    { text: 'What if I save ₹5,000 more each month?', label: 'What-if scenario' }
];

export async function AIChatPage() {
    return `
    <div class="ai-chat h-full flex flex-col" aria-label="AI Conversation">
        <!-- Header -->
        <header class="flex items-center gap-3 p-4 bg-surface-elevated border-b z-10 shrink-0">
            <button class="btn btn-ghost btn-icon" aria-label="Go back" id="ai-chat-back">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div class="flex-1">
                <h1 class="text-h3">AI Copilot</h1>
                <div class="flex items-center gap-2 mt-1">
                    <span class="w-2 h-2 rounded-full" id="ai-chat-status-dot" aria-hidden="true"></span>
                    <span class="text-caption text-secondary" id="ai-chat-status-header">Ready</span>
                    <span class="badge badge-dark ml-1" id="ai-chat-session-badge" aria-label="Session context">New Chat</span>
                </div>
            </div>
            <button class="btn btn-ghost btn-icon" aria-label="New chat" id="ai-chat-new">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
        </header>

        <!-- Messages Area -->
        <div class="ai-chat-messages flex-1 overflow-y-auto p-4 flex flex-col" id="ai-chat-history" role="log" aria-live="polite" aria-label="Chat messages">
            <!-- Welcome State -->
            <div class="ai-welcome text-center py-10" id="ai-chat-welcome">
                <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-inverse"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h2 class="text-h2 text-primary mb-3">How can I help you today?</h2>
                <p class="text-body text-secondary max-w-xs mx-auto mb-8">Ask questions about your spending, find money leaks, or simulate a purchase before you make it.</p>
                <div class="flex flex-col gap-2 max-w-sm mx-auto stagger-children">
                    ${WELCOME_CHIPS.map(chip => `
                        <button class="ai-suggestion-chip w-full justify-start" data-query="${encodeURIComponent(chip.text)}" aria-label="${chip.label}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            ${chip.label}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- Status Bar -->
        <div class="p-3 text-center bg-surface-elevated border-t hidden" id="ai-chat-status" aria-live="assertive">
            <div class="flex items-center justify-center gap-2">
                <div class="ai-message-typing">
                    <span class="ai-typing-dot"></span>
                    <span class="ai-typing-dot"></span>
                    <span class="ai-typing-dot"></span>
                </div>
                <span class="text-caption text-secondary" id="ai-chat-status-text">Thinking...</span>
            </div>
        </div>

        <!-- Composer -->
        <div class="ai-chat-composer p-4 bg-surface-elevated shrink-0 border-t" id="ai-chat-composer" aria-label="Message composer">
            <!-- Composer injected here -->
        </div>
    </div>`;
}

export function AIChatPageAfterRender() {
    const historyContainer = document.getElementById('ai-chat-history');
    const statusContainer = document.getElementById('ai-chat-status');
    const statusTextEl = document.getElementById('ai-chat-status-text');
    const statusDotEl = document.getElementById('ai-chat-status-dot');
    const statusHeaderEl = document.getElementById('ai-chat-status-header');
    const sessionBadge = document.getElementById('ai-chat-session-badge');
    const composerContainer = document.getElementById('ai-chat-composer');
    const backBtn = document.getElementById('ai-chat-back');
    const newChatBtn = document.getElementById('ai-chat-new');

    // Back navigation
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (window.history.length > 1) {
                window.history.back();
            } else if (window.appInstance) {
                window.appInstance.navigate('/ai');
            }
        });
    }

    // New chat reset
    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            if (window.appInstance) {
                window.appInstance.navigate('/ai/chat');
            }
        });
    }

    // Read initial query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q');

    let messageCount = 0;

    // Scroll to bottom helper
    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            historyContainer.scrollTop = historyContainer.scrollHeight;
        });
    };

    // Update header status
    const updateHeaderStatus = (state) => {
        const config = STATUS_CONFIG[state] || STATUS_CONFIG.IDLE;
        if (statusDotEl) {
            statusDotEl.style.background = config.color;
            if (state === 'GATEWAY_PROCESSING' || state === 'SUBMITTING') {
                statusDotEl.style.animation = 'pulse-dot 1.2s ease-in-out 0s infinite';
            } else {
                statusDotEl.style.animation = 'none';
            }
        }
        if (statusHeaderEl) statusHeaderEl.textContent = config.label;
    };

    // Update session badge
    const updateSessionBadge = () => {
        if (sessionBadge) {
            const count = stateMachine.history.length;
            if (count > 0) {
                sessionBadge.textContent = `${Math.ceil(count / 2)} exchanges`;
            }
        }
    };

    // Render a message into the chat
    const renderMessage = (msg) => {
        const welcome = document.getElementById('ai-chat-welcome');
        if (welcome) welcome.remove();

        const existing = document.getElementById(`msg-${msg.id}`);
        if (existing) return;

        const msgWrapper = document.createElement('div');
        const comp = AIMessage(msg, (actionType, actionData) => {
            if (actionType === 'confirm') {
                stateMachine.confirmAction(actionData, gatewayApiClient);
            } else if (actionType === 'option') {
                stateMachine.submitQuery(actionData, gatewayApiClient);
            } else if (actionType === 'cancel') {
                scrollToBottom();
            }
        });
        msgWrapper.innerHTML = comp.render();
        historyContainer.appendChild(msgWrapper.firstElementChild);
        comp.attachListeners(historyContainer);
        messageCount++;
    };

    // Typing indicator element
    let typingEl = null;

    const showTyping = () => {
        if (typingEl) return;
        const welcome = document.getElementById('ai-chat-welcome');
        if (welcome) welcome.remove();

        typingEl = document.createElement('div');
        typingEl.innerHTML = AIInteractionState.renderTypingIndicator();
        historyContainer.appendChild(typingEl.firstElementChild);
        scrollToBottom();
    };

    const hideTyping = () => {
        if (typingEl && typingEl.parentNode) {
            typingEl.parentNode.removeChild(typingEl);
        }
        typingEl = null;
    };

    // Show error in chat
    const showError = (errorMsg, onRetry) => {
        hideTyping();
        const wrapper = document.createElement('div');
        wrapper.innerHTML = AIInteractionState.renderErrorState(errorMsg, 'aiChatRetry()');
        historyContainer.appendChild(wrapper.firstElementChild);
        AIInteractionState.attachErrorListeners(historyContainer, onRetry);
        scrollToBottom();
    };

    // Show unavailable in chat
    const showUnavailable = () => {
        hideTyping();
        const wrapper = document.createElement('div');
        wrapper.innerHTML = AIInteractionState.renderUnavailableState();
        historyContainer.appendChild(wrapper.firstElementChild);
        scrollToBottom();
    };

    // Retry function
    window.aiChatRetry = () => {
        if (stateMachine.currentError) {
            const lastUserMsg = [...stateMachine.history].reverse().find(m => m.role === 'user');
            if (lastUserMsg) {
                stateMachine.submitQuery(lastUserMsg.content, gatewayApiClient);
            }
        }
    };

    // State machine UI update callback
    const updateUI = (state) => {
        // Remove welcome if we have messages
        if (state.history.length > 0) {
            const welcome = document.getElementById('ai-chat-welcome');
            if (welcome) welcome.remove();
        }

        // Render new messages
        state.history.forEach(msg => renderMessage(msg));

        // Status bar
        if (state.isProcessing) {
            statusContainer.classList.remove('hidden');
            const config = STATUS_CONFIG[state.state] || STATUS_CONFIG.SUBMITTING;
            if (statusTextEl) statusTextEl.textContent = config.label;
            showTyping();
        } else {
            statusContainer.classList.add('hidden');
            hideTyping();
        }

        // Handle error states
        if (state.state === 'ERROR' && state.currentError) {
            showError(state.currentError, () => {
                const lastUserMsg = [...stateMachine.history].reverse().find(m => m.role === 'user');
                if (lastUserMsg) {
                    stateMachine.submitQuery(lastUserMsg.content, gatewayApiClient);
                }
            });
        }

        if (state.state === 'UNAVAILABLE') {
            showUnavailable();
        }

        updateHeaderStatus(state.state);
        updateSessionBadge();
        scrollToBottom();
    };

    // Initialize state machine
    const stateMachine = new AIInteractionState(updateUI);

    // Gateway API client — all requests go through AI Gateway
    const gatewayApiClient = async (payload) => {
        if (typeof payload === 'string') {
            return ApiClient.post('/ai/chat', { prompt: payload });
        } else {
            return ApiClient.post('/ai/chat/confirm', payload);
        }
    };

    // Initialize composer
    const composer = AIComposer((text) => {
        stateMachine.submitQuery(text, gatewayApiClient);
    }, []);

    composerContainer.innerHTML = composer.render();
    composer.attachListeners(composerContainer);

    // Welcome chip click handlers
    const welcomeEl = document.getElementById('ai-chat-welcome');
    if (welcomeEl) {
        welcomeEl.querySelectorAll('.ai-suggestion-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                const q = decodeURIComponent(btn.dataset.query);
                // Immediate visual feedback
                btn.style.opacity = '0.5';
                btn.style.pointerEvents = 'none';
                btn.textContent = btn.textContent + ' ...';
                // Small delay to show feedback before API call
                setTimeout(() => {
                    stateMachine.submitQuery(q, gatewayApiClient);
                }, 150);
            });
        });
    }

    // Handle initial query from URL params
    if (initialQuery) {
        // Clean URL without triggering a re-render
        window.history.replaceState({}, document.title, window.location.pathname);
        stateMachine.submitQuery(initialQuery, gatewayApiClient);
    }
}
