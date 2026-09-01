import { Clerk } from '@clerk/clerk-js';

let clerkInstance = null;
let _initState = "pending";

const DEV_MOCK_USER = {
    uid: "dev-mock-user",
    email: "dev@localhost",
    displayName: "Dev (No Clerk)",
    photoURL: null,
    getIdToken: async () => "dev-mock-no-clerk",
};

export class AuthService {
    static async _ensureInit() {
        if (clerkInstance) return clerkInstance;
        
        // We expect VITE_CLERK_PUBLISHABLE_KEY to be provided by Vite.
        const publishableKey = import.meta.env?.VITE_CLERK_PUBLISHABLE_KEY || window.VITE_CLERK_PUBLISHABLE_KEY;
        
        if (!publishableKey) {
            console.warn("[FinCopilot Auth] DEV MOCK MODE: Clerk Publishable Key missing. Using mock user.");
            _initState = "mock";
            return null;
        }

        clerkInstance = new Clerk(publishableKey);
        await clerkInstance.load({
            // Optional: you can configure Clerk options here
        });
        
        _initState = "real";
        return clerkInstance;
    }

    static async loginWithGoogle() {
        await this._ensureInit();
        if (_initState === "real") {
            // Initiate OAuth flow with Google
            return clerkInstance.redirectToSignIn({ strategy: 'oauth_google', fallbackRedirectUrl: window.location.href });
        }
        return DEV_MOCK_USER;
    }

    static async loginWithGithub() {
        await this._ensureInit();
        if (_initState === "real") {
            return clerkInstance.redirectToSignIn({ strategy: 'oauth_github', fallbackRedirectUrl: window.location.href });
        }
        return DEV_MOCK_USER;
    }

    static async logout() {
        await this._ensureInit();
        if (_initState === "real") {
            await clerkInstance.signOut();
        }
    }

    static async getToken() {
        await this._ensureInit();
        if (_initState === "real" && clerkInstance.session) {
            return await clerkInstance.session.getToken();
        }
        return DEV_MOCK_USER.getIdToken();
    }

    static onAuthStateChanged(callback) {
        this._ensureInit().then(() => {
            if (_initState === "real") {
                clerkInstance.addListener(({ user }) => {
                    if (user) {
                        callback({
                            uid: user.id,
                            email: user.primaryEmailAddress?.emailAddress,
                            displayName: user.fullName || user.username || 'User',
                            photoURL: user.imageUrl,
                            getIdToken: async () => clerkInstance.session?.getToken(),
                        });
                    } else {
                        callback(null);
                    }
                });
            } else {
                // Mock fallback
                setTimeout(() => callback(DEV_MOCK_USER), 100);
            }
        });
        return () => {
            // Clerk listener returns an unsubscribe function if we want to save it.
        };
    }

    static getCurrentUser() {
        if (_initState === "real" && clerkInstance && clerkInstance.user) {
            const user = clerkInstance.user;
            return {
                uid: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                displayName: user.fullName || user.username || 'User',
                photoURL: user.imageUrl,
                getIdToken: async () => clerkInstance.session?.getToken(),
            };
        }
        return _initState === "mock" ? DEV_MOCK_USER : null;
    }

    static get initState() { return _initState; }
}
