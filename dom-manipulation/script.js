// ========== Step 0: Initialize ==========
let quotes = []; // Will load from localStorage

// ========== Step 1: Load quotes from localStorage ==========
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // If none exist, use defaults
    quotes = [
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Do or do not. There is no try.", category: "Wisdom" },
    ];
    saveQuotes(); // Save default quotes
  }
}

// ========== Step 2: Save quotes to localStorage ==========
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ========== Step 3: Show a random quote + store in session ==========
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  document.getElementById('quoteDisplay').innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>Category: ${quote.category}</em></p>
  `;

  // Store last viewed quote in session storage
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// ========== Step 4: Create quote form dynamically ==========
function createAddQuoteForm() {
  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  document.body.appendChild(quoteInput);
  document.body.appendChild(categoryInput);
  document.body.appendChild(addButton);
}

// ========== Step 5: Add new quote and save ==========
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText === '' || quoteCategory === '') {
    alert('Please enter both a quote and a category.');
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);
  saveQuotes();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  showRandomQuote();
}

// ========== Step 6: Export Quotes as JSON File ==========
function exportQuotesToJson() {
  const data = JSON.stringify(quotes, null, 2); // pretty JSON
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();

  URL.revokeObjectURL(url); // clean up
}

// ========== Step 7: Import Quotes from JSON File ==========
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      // Check that each entry has text and category
      if (Array.isArray(importedQuotes) &&
          importedQuotes.every(q => q.text && q.category)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid quote format.');
      }
    } catch (err) {
      alert('Failed to import quotes: ' + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ========== Step 8: Setup Event Listeners and UI ==========
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportBtn').addEventListener('click', exportQuotesToJson);

window.onload = function () {
  loadQuotes();
  showRandomQuote();
  createAddQuoteForm();
};
