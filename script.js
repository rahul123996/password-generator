const passwordEl = document.getElementById('password');
const lengthEl = document.getElementById('length');
const lengthValEl = document.getElementById('length-val');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const toast = document.getElementById('toast');

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

// Update length display
lengthEl.addEventListener('input', () => {
    lengthValEl.innerText = lengthEl.value;
});

// Copy to clipboard
copyBtn.addEventListener('click', () => {
    const password = passwordEl.innerText;
    if (!password || password === 'Click Generate') return;

    navigator.clipboard.writeText(password).then(() => {
        showToast();
    });
});

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Generate Event
generateBtn.addEventListener('click', () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    const password = generateSecurePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
    passwordEl.innerText = password;
    updateStrength(password);
});

function generateSecurePassword(length, lower, upper, number, symbol) {
    let charSet = '';
    if (lower) charSet += LOWERCASE_CHARS;
    if (upper) charSet += UPPERCASE_CHARS;
    if (number) charSet += NUMBER_CHARS;
    if (symbol) charSet += SYMBOL_CHARS;

    if (charSet === '') return 'Select at least one!';

    let password = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        password += charSet[array[i] % charSet.length];
    }

    return password;
}

function updateStrength(password) {
    if (password === 'Select at least one!') {
        strengthBar.style.width = '0%';
        strengthText.innerText = 'Strength: --';
        return;
    }

    let strength = 0;
    if (password.length >= 12) strength += 25;
    if (password.length >= 16) strength += 15;
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (hasLower && hasUpper) strength += 20;
    if (hasNumber) strength += 20;
    if (hasSymbol) strength += 20;

    strengthBar.style.width = strength + '%';
    
    if (strength < 40) {
        strengthBar.style.backgroundColor = '#ef4444';
        strengthText.innerText = 'Strength: Weak';
    } else if (strength < 75) {
        strengthBar.style.backgroundColor = '#f59e0b';
        strengthText.innerText = 'Strength: Medium';
    } else {
        strengthBar.style.backgroundColor = '#10b981';
        strengthText.innerText = 'Strength: Strong';
    }
}

// Initial generation
generateBtn.click();
