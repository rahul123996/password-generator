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

// Generate Event - Now calls the Python Backend
generateBtn.addEventListener('click', async () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    passwordEl.innerText = 'Generating...';

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                length: length,
                use_letters: hasLower || hasUpper, // Original Python script uses use_letters
                use_numbers: hasNumber,
                use_symbols: hasSymbol
            })
        });

        const data = await response.json();
        
        if (data.password) {
            passwordEl.innerText = data.password;
            updateStrength(data.password);
        } else {
            passwordEl.innerText = 'Error: ' + data.error;
        }
    } catch (error) {
        console.error('Error:', error);
        passwordEl.innerText = 'Server Error';
    }
});

function updateStrength(password) {
    let strength = 0;
    if (password.length > 8) strength += 25;
    if (password.length > 12) strength += 25;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

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
