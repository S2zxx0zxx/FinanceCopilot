/**
 * AI Message — Ultra-premium message component
 * Supports USER and AI roles with evidence, actions, confidence, code blocks.
 */
function renderMarkdownLite(text) {
    if (!text) return '';
    let out = text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="text-body bg-surface-subtle px-1 rounded">$1</code>')
        .replace(/```([\s\S]*?)```/g, (_, code) => `<pre class="ai-code-block"><code>${code.trim()}</code><button class="ai-code-copy" aria-label="Copy code">Copy</button></pre>`)
        .replace(/^[•\-] (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul class="ai-msg-list">$1</ul>');
    return out;
}

function formatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function AIMessage(msg, onAction) {
    const isUser = msg.role === 'user';
    const id = msg.id || ('msg-' + Date.now() + Math.random().toString(36).slice(2, 6));

    function render() {
        if (msg.isLoading) {
            return `<div class="ai-msg ai-msg-ai" id="${id}" role="article">
                <div class="ai-msg-bubble">
                    <div class="ai-typing-indicator"><span></span><span></span><span></span></div>
                </div>
            </div>`;
        }

        if (msg.isError) {
            return `<div class="ai-msg ai-msg-ai" id="${id}" role="article">
                <div class="ai-msg-bubble ai-msg-error">
                    <p class="text-body text-negative">${msg.content || 'Something went wrong. Please try again.'}</p>
                    <button class="btn btn-ghost btn-sm mt-3" data-action="retry">Try Again</button>
                </div>
            </div>`;
        }

        if (isUser) {
            return `<div class="ai-msg ai-msg-user" id="${id}" role="article">
                <div class="ai-msg-bubble">
                    <p class="text-body">${renderMarkdownLite(msg.content)}</p>
                </div>
                <span class="ai-msg-time">${formatTime(msg.timestamp)}</span>
            </div>`;
        }

        // AI message
        const confidenceHtml = msg.confidence != null
            ? `<span class="badge ${msg.confidence >= 0.8 ? 'badge-positive' : msg.confidence >= 0.6 ? 'badge-warning' : 'badge-negative'} ai-msg-confidence">${Math.round(msg.confidence * 100)}% confidence</span>`
            : '';

        const evidenceHtml = msg.evidence
            ? `<details class="ai-msg-evidence">
                <summary class="text-caption text-secondary cursor-pointer">View evidence</summary>
                <div class="mt-2 p-3 bg-surface-subtle rounded-lg"><p class="text-body-sm text-secondary leading-relaxed">${msg.evidence}</p></div>
            </details>`
            : '';

        let actionsHtml = '';
        if (msg.actions && msg.actions.length > 0) {
            const confirmAction = msg.actions.find(a => a.type === 'confirm');
            const optionActions = msg.actions.filter(a => a.type === 'option');

            if (confirmAction) {
                actionsHtml += `<button class="btn btn-primary btn-sm mt-3" data-action="confirm" data-action-data='${JSON.stringify(confirmAction.data).replace(/'/g, "&#39;")}'>${confirmAction.label || 'Confirm'}</button>`;
            }
            if (optionActions.length > 0) {
                actionsHtml += `<div class="flex flex-wrap gap-2 mt-3">${optionActions.map(a =>
                    `<button class="btn btn-ghost btn-sm" data-action="option" data-action-data='${JSON.stringify(a.data).replace(/'/g, "&#39;")}'>${a.label}</button>`
                ).join('')}</div>`;
            }
        }

        return `<div class="ai-msg ai-msg-ai" id="${id}" role="article">
            <div class="ai-msg-bubble">
                <div class="flex items-center gap-2 mb-2">
                    <span class="badge badge-dark">AI</span>
                    ${confidenceHtml}
                </div>
                <div class="ai-msg-content text-body leading-relaxed">${renderMarkdownLite(msg.content)}</div>
                ${evidenceHtml}
                ${actionsHtml}
            </div>
            <span class="ai-msg-time">${formatTime(msg.timestamp)}</span>
        </div>`;
    }

    function attachListeners(container, stateMachine) {
        const el = document.getElementById(id);
        if (!el) return;

        // Retry button
        el.querySelectorAll('[data-action="retry"]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (stateMachine && stateMachine.retry) stateMachine.retry();
            });
        });

        // Confirm button
        el.querySelectorAll('[data-action="confirm"]').forEach(btn => {
            btn.addEventListener('click', () => {
                try { const data = JSON.parse(btn.dataset.actionData); if (onAction) onAction('confirm', data); } catch(e) {}
            });
        });

        // Option buttons
        el.querySelectorAll('[data-action="option"]').forEach(btn => {
            btn.addEventListener('click', () => {
                try { const data = JSON.parse(btn.dataset.actionData); if (onAction) onAction('option', data); } catch(e) {}
            });
        });

        // Code copy buttons
        el.querySelectorAll('.ai-code-copy').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = btn.previousElementSibling?.textContent || '';
                navigator.clipboard.writeText(code).then(() => { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy', 2000); }).catch(() => {});
            });
        });
    }

    return { render, attachListeners };
}