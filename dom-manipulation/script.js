let quotes = [];

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  quotes = storedQuotes ? JSON.parse(storedQuotes) : [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Do or do not. There is no try.", category: "Wisdom" },
  ];
  saveQuotes(); // Save if using defaults
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function saveSelectedCategory(category) {
  localStorage.setItem('selectedCategory', category);
}

function loadSelectedCategory() {
  return localStorage.getItem('selectedCategory') || "all";
}

// Show random quote based on current filter
function showRandomQuote() {
  const currentCategory = document.getElementById('categoryFilter').value;
  const filtered = currentCategory === "all" 
    ? quotes 
    : quotes.filter(q => q.category.toLowerCase() === currentCategory.toLowerCase());

  if (filtered.length === 0) {
    document.getElementById('quoteDisplay').innerHTML = "<p>No quotes available for this category.</p>";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById('quoteDisplay').innerHTML = `
    <blockquote>"${randomQuote.text}"</blockquote>
    <p><em>Category: ${randomQuote.category}</em></p>
  `;

  sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
}

// Dynamically populate category dropdown
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  select.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  const lastCategory = loadSelectedCategory();
  select.value = lastCategory;
}

// Filter quotes when a category is selected
function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  saveSelectedCategory(category);
  showRandomQuote();
}

// Dynamically build form
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

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert('Please enter both a quote and a category.');
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  populateCategories(); // update dropdown with new category if needed
  showRandomQuote(); // show updated quote
}

// Export quotes to JSON file
function exportQuotesToJson() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported) && imported.every(q => q.text && q.category)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid quote format.');
      }
    } catch (err) {
      alert('Failed to import: ' + err.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Init
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportBtn').addEventListener('click', exportQuotesToJson);

window.onload = () => {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();
  filterQuotes();
};
