let firstNames = [];
let lastNames = [];

// Load CSV files
async function loadCSVFiles() {
    try {
        const [firstNameResponse, lastNameResponse] = await Promise.all([
            fetch('first_names.csv'),
            fetch('last_names.csv')
        ]);

        const firstNameText = await firstNameResponse.text();
        const lastNameText = await lastNameResponse.text();

        firstNames = firstNameText.split('\n').filter(name => name.trim());
        lastNames = lastNameText.split('\n').filter(name => name.trim());

        console.log('CSV files loaded successfully');
        // Generate names immediately after loading CSV files
        generateNames();
    } catch (error) {
        console.error('Error loading CSV files:', error);
    }
}

// Generate random name
function generateRandomName() {
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    // Ensure first letter is uppercase, rest lowercase
    const formattedFirstName = randomFirstName.charAt(0).toUpperCase() +
        randomFirstName.slice(1).toLowerCase();
    const formattedLastName = randomLastName.charAt(0).toUpperCase() +
        randomLastName.slice(1).toLowerCase();

    return `${formattedFirstName} ${formattedLastName}`;
}

// Copy name to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}

// Show copy feedback
function showCopyFeedback(element) {
    const originalText = element.textContent;
    element.textContent = 'Copied!';
    element.classList.add('copied');

    setTimeout(() => {
        element.textContent = originalText;
        element.classList.remove('copied');
    }, 1000);
}

// Generate 1000 random names
function generateNames() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    for (let i = 0; i < 1000; i++) {
        const name = generateRandomName();
        const nameElement = document.createElement('div');
        nameElement.className = 'name-item';
        nameElement.textContent = name;

        // Add click event to copy name
        nameElement.addEventListener('click', async () => {
            const success = await copyToClipboard(name);
            if (success) {
                showCopyFeedback(nameElement);
            }
        });

        resultsDiv.appendChild(nameElement);
    }
}

// Clear results
function clearResults() {
    document.getElementById('results').innerHTML = '';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCSVFiles();

    document.getElementById('generateBtn').addEventListener('click', generateNames);
    document.getElementById('clearBtn').addEventListener('click', clearResults);
}); 