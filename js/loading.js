/**
 * Loading Spinner Component
 * Shows/hides loading screens
 */

class LoadingSpinner {
    constructor() {
        this.createSpinner();
    }

    createSpinner() {
        // Check if spinner already exists
        if (document.getElementById('global-loading-spinner')) return;

        const spinnerHTML = `
            <div id="global-loading-spinner" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 10, 30, 0.95);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                flex-direction: column;
            ">
                <div style="
                    width: 80px;
                    height: 80px;
                    border: 8px solid rgba(139, 92, 246, 0.3);
                    border-top: 8px solid #8B5CF6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <p style="
                    color: #FBBF24;
                    font-size: 1.5rem;
                    margin-top: 2rem;
                    font-weight: bold;
                " id="loading-message">Loading...</p>
            </div>

            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', spinnerHTML);
    }

    show(message = 'Loading...') {
        const spinner = document.getElementById('global-loading-spinner');
        const messageEl = document.getElementById('loading-message');

        if (spinner) {
            if (messageEl) messageEl.textContent = message;
            spinner.style.display = 'flex';
        }
    }

    hide() {
        const spinner = document.getElementById('global-loading-spinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    }
}

// Create global instance
window.loadingSpinner = new LoadingSpinner();
