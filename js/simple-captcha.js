/**
 * Google reCAPTCHA v2 Integration
 * Note: For production, you need to get your own site key from:
 * https://www.google.com/recaptcha/admin/create
 *
 * This is a demo key that works on localhost
 */

const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Test key
let recaptchaLoaded = false;

/**
 * Load Google reCAPTCHA script
 */
function loadRecaptchaScript() {
    if (recaptchaLoaded) return Promise.resolve();

    return new Promise((resolve, reject) => {
        if (typeof grecaptcha !== 'undefined') {
            recaptchaLoaded = true;
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            recaptchaLoaded = true;
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Show reCAPTCHA modal
 */
async function showCaptchaModal(onSuccess) {
    // Load reCAPTCHA if not already loaded
    try {
        await loadRecaptchaScript();
    } catch (e) {
        console.error('Failed to load reCAPTCHA:', e);
        // Fallback: just call success
        onSuccess();
        return;
    }

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: linear-gradient(135deg, #1A1A1D 0%, #2A2A2C 100%);
        padding: 2rem;
        border-radius: 15px;
        border: 3px solid #F7931A;
        box-shadow: 0 10px 40px rgba(247, 147, 26, 0.5);
        max-width: 400px;
        width: 90%;
        text-align: center;
    `;

    modal.innerHTML = `
        <h2 style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem;">
            Verify You're Human
        </h2>
        <p style="color: #9CA3AF; margin-bottom: 1.5rem;">
            Complete the reCAPTCHA to claim PBTC:
        </p>
        <div style="background: #070510; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem; border: 2px solid #8B5CF6; display: flex; justify-content: center;">
            <div id="recaptcha-container"></div>
        </div>
        <div style="display: flex; gap: 1rem;">
            <button
                id="captcha-cancel"
                style="
                    flex: 1;
                    padding: 0.8rem;
                    background: #1E1B2E;
                    color: #FFFFFF;
                    border: none;
                    border-radius: 10px;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 1rem;
                "
            >
                Cancel
            </button>
            <button
                id="captcha-submit"
                style="
                    flex: 1;
                    padding: 0.8rem;
                    background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
                    color: #FFFFFF;
                    border: 2px solid #FBBF24;
                    border-radius: 10px;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 1rem;
                "
            >
                Verify
            </button>
        </div>
        <div id="captcha-error" style="
            color: #EF5350;
            margin-top: 1rem;
            font-size: 0.9rem;
            display: none;
        "></div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Render reCAPTCHA
    let widgetId;
    setTimeout(() => {
        if (typeof grecaptcha !== 'undefined') {
            widgetId = grecaptcha.render('recaptcha-container', {
                'sitekey': RECAPTCHA_SITE_KEY,
                'theme': 'dark'
            });
        }
    }, 100);

    // Handle submit
    const submitBtn = document.getElementById('captcha-submit');
    const cancelBtn = document.getElementById('captcha-cancel');
    const errorDiv = document.getElementById('captcha-error');

    const handleSubmit = () => {
        if (typeof grecaptcha === 'undefined') {
            // reCAPTCHA not loaded, just allow
            document.body.removeChild(overlay);
            onSuccess();
            return;
        }

        const response = grecaptcha.getResponse(widgetId);

        if (!response) {
            errorDiv.textContent = 'Please complete the reCAPTCHA';
            errorDiv.style.display = 'block';
            return;
        }

        // Success
        document.body.removeChild(overlay);
        onSuccess();
    };

    submitBtn.onclick = handleSubmit;

    cancelBtn.onclick = () => {
        document.body.removeChild(overlay);
    };

    // Close on outside click
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    };
}

// Export
window.simpleCaptcha = {
    showCaptchaModal
};
