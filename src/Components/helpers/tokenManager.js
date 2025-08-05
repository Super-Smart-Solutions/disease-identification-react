
import Cookies from "js-cookie";

class TokenManager {
    constructor() {
        this.refreshTimer = null;
        this.isRefreshing = false;
        this.failedQueue = [];
    }

    // Get access token from cookies
    getAccessToken() {
        return (Cookies.get("access_token") || Cookies.get("access_token"))
    }

    // Get refresh token from cookies
    getRefreshToken() {
        return Cookies.get("refresh_token");
    }

    // Set tokens in cookies
    setTokens(accessToken, refreshToken) {
        // Set access token to expire in 14 minutes
        Cookies.set("access_token", accessToken, { expires: 14 / (24 * 60) });

        // Set refresh token with longer expiration (assuming it's longer-lived)
        Cookies.set("refresh_token", refreshToken, { expires: 30 }); // 30 days

        // Start the refresh timer
        this.startRefreshTimer();
    }

    // Clear all tokens
    clearTokens() {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        this.clearRefreshTimer();
    }

    // Check if access token exists
    hasAccessToken() {
        return !!this.getAccessToken();
    }

    // Check if refresh token exists
    hasRefreshToken() {
        return !!this.getRefreshToken();
    }

    // Start timer to refresh token after 13 minutes
    startRefreshTimer() {
        this.clearRefreshTimer();

        // Refresh token after 13 minutes (780,000 ms)
        this.refreshTimer = setTimeout(() => {
            this.refreshAccessToken();
        }, 13 * 60 * 1000);
    }

    // Clear the refresh timer
    clearRefreshTimer() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    // Refresh access token using refresh token
    async refreshAccessToken() {
        const refreshToken = this.getRefreshToken();

        if (!refreshToken) {
            this.redirectToLogin();
            return null;
        }

        if (this.isRefreshing) {
            // If already refreshing, return a promise that resolves when refresh is complete
            return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
            });
        }

        this.isRefreshing = true;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/jwt/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (!response.ok) {
                throw new Error('Refresh failed');
            }

            const data = await response.json();
            const newAccessToken = data.access_token;
            const newRefreshToken = data.refresh_token || refreshToken;

            // Update tokens
            this.setTokens(newAccessToken, newRefreshToken);

            // Process failed queue
            this.processQueue(null, newAccessToken);

            return newAccessToken;
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.processQueue(error, null);
            this.redirectToLogin();
            return null;
        } finally {
            this.isRefreshing = false;
        }
    }

    // Process queued requests after token refresh
    processQueue(error, token = null) {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve(token);
            }
        });

        this.failedQueue = [];
    }

    // Redirect to login page
    redirectToLogin() {
        localStorage.clear("user")
        this.clearTokens();
        window.location.href = '/auth/login';
    }

    // Initialize tokens (call this after login)
    initialize(accessToken, refreshToken) {
        this.setTokens(accessToken, refreshToken);
    }
}

// Export singleton instance
export default new TokenManager();