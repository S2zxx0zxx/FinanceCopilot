/**
 * AI Composer — Ultra-premium chat input component
 * Auto-growing textarea, character count, context chips, send button.
 */
export function AIComposer(onSubmit, suggestions = []) {
    const placeholders = [
        'Ask about your spending...',
        'How am I doing this month?',
        'Can I afford that purchase?',
        'Find my money leaks...',
        'What\'s my 30-day outlook?',
    ];
    let phIdx = 0;
    let phInterval = null;
    let isDisabled = false;
    let isLoading = false;

    function render() {
        const chips = suggestions.map(s => {
            const text = typeof s === 'string' ? s : s.label || s.text;
            const query = typeof s === 'string' ? s : s.text || s.label;
            return `<button class="ai-suggestion-chip" data-query="${encodeURIComponent(query)}" type="button">${text}</button>`;
        }).join('');

        return `
        <div class="ai-composer">
            <div class="ai-composer-input-wrap">
                <textarea
                    class="ai-composer-textarea"
                    id="ai-composer-textarea"
                    placeholder="${placeholders[0]}"
                    rows="1"
                    maxlength="500"
                    aria-label="Type your question"
                    ${isDisabled ? 'disabled' : ''}
                ></textarea>
                <div class="ai-composer-actions">
                    <button class="btn btn-ghost btn-icon btn-sm" aria-label="Coming soon" disabled title="Voice input coming soon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"></path><path d="M19 10v2a7 7 0 01-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                    </button>
                    <button class="btn btn-ghost btn-icon btn-sm" aria-label="Coming soon" disabled title="Attachments coming soon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path></svg>
                    </button>
                    <button class="btn btn-primary btn-icon" id="ai-composer-send" aria-label="Send message" ${isDisabled || isLoading ? 'disabled' : ''}>
                        ${isLoading
                            ? '<span class="spinner spinner-sm"></span>'
                            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>'
                        }
                    </button>
                </div>
            </div>
            <div class="ai-composer-footer">
                <div class="ai-composer-chips" id="ai-composer-chips">
                    ${chips}
                </div>
                <span class="ai-composer-count text-micro text-tertiary" id="ai-composer-count"></span>
            </div>
        </div>`;
    }

    function attachListeners(container) {
        const textarea = container.querySelector('#ai-composer-textarea');
        const sendBtn = container.querySelector('#ai-composer-send');
        const countEl = container.querySelector('#ai-composer-count');
        const chipsEl = container.querySelector('#ai-composer-chips');

        if (!textarea) return;

        // Auto-grow
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
            const len = textarea.value.length;
            if (countEl) countEl.textContent = len > 400 ? `${len}/500` : '';
            if (sendBtn) sendBtn.disabled = !textarea.value.trim() || isDisabled || isLoading;
        });

        // Enter to send, Shift+Enter for newline
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                doSend(textarea);
            }
        });

        if (sendBtn) sendBtn.addEventListener('click', () => doSend(textarea));

        // Chip clicks
        if (chipsEl) {
            chipsEl.querySelectorAll('.ai-suggestion-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    const q = decodeURIComponent(chip.dataset.query);
                    if (onSubmit) onSubmit(q);
                });
            });
        }

        // Cycling placeholder
        if (!phInterval) {
            phInterval = setInterval(() => {
                phIdx = (phIdx + 1) % placeholders.length;
                if (textarea && document.activeElement !== textarea) {
                    textarea.placeholder = placeholders[phIdx];
                }
            }, 4000);
        }
    }

    function doSend(textarea) {
        const text = textarea.value.trim();
        if (!text || isLoading) return;
        textarea.value = '';
        textarea.style.height = 'auto';
        const countEl = document.querySelector('#ai-composer-count');
        if (countEl) countEl.textContent = '';
        if (onSubmit) onSubmit(text);
    }

    function setValue(text) {
        const ta = document.querySelector('#ai-composer-textarea');
        if (ta) { ta.value = text; ta.dispatchEvent(new Event('input')); }
    }

    function setDisabled(val) {
        isDisabled = val;
        const ta = document.querySelector('#ai-composer-textarea');
        const btn = document.querySelector('#ai-composer-send');
        if (ta) ta.disabled = val;
        if (btn) btn.disabled = val;
    }

    function setLoading(val) {
        isLoading = val;
        const btn = document.querySelector('#ai-composer-send');
        if (btn) {
            btn.disabled = val || isDisabled;
            btn.innerHTML = val
                ? '<span class="spinner spinner-sm"></span>'
                : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
        }
    }

    return { render, attachListeners, setValue, setDisabled, setLoading };
}