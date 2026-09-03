import { OmniRouterAdapter } from './omnirouter.adapter.js';
import { ZAIAdapter } from './zai.adapter.js';

class ProviderRegistry {
    constructor() {
        this.providers = new Map();
        this.register('omnirouter', new OmniRouterAdapter());
        this.register('zai', new ZAIAdapter());
    }

    register(id, adapter) {
        this.providers.set(id, adapter);
    }

    getProvider(id) {
        const provider = this.providers.get(id);
        if (!provider) {
            throw new Error(`Provider ${id} not found in registry`);
        }
        return provider;
    }
}

export const providerRegistry = new ProviderRegistry();
