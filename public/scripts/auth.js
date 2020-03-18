const SIGN_IN_URL = '/sign-in';
const authButton = document.getElementById('authButton');

/**
 * Init access for user. Setup auth button.
 */
(function init() {
    const token = getAccessToken();

    if (token) {
        authButton.value = 'Вийти';
        authButton.addEventListener('click', removeAccessToken);
    } else {
        authButton.value = 'Увійти';
        authButton.addEventListener('click', goToSignInPage);
    }
})();

/**
 * Get access token from localStorage
 * @returns {string}
 */
function getAccessToken() {
    return window.localStorage.getItem('accessToken');
}

/**
 * Remove access token
 */
function removeAccessToken() {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
    authButton.value = 'Увійти';
    authButton.addEventListener('click', goToSignInPage);
}

/**
 * Redirect user to sign in page
 */
function goToSignInPage() {
    window.location.href = SIGN_IN_URL;
}
