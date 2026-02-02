/**
 * Authentication Check
 * Include this file in pages that require login
 * Automatically redirects to login if not authenticated
 */

(function() {
    // Check if apiService is loaded
    if (typeof apiService === 'undefined') {
        console.error('apiService not loaded!');
        window.location.href = 'login.html';
        return;
    }

    // Check authentication
    if (!apiService.isAuthenticated()) {
        // Save current page to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = 'login.html';
    }
})();
