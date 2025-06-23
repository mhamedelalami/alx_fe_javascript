let quotes = [];

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
 quotes = storedQuotes ? JSON.parse(storedQuotes) : [
  { id: 1, text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { id: 2, text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { id: 3, text: "Do or do not. There is no try.", category: "Wisdom" },
];
  saveQuotes(); // Save if using defaults
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
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

  const newQuote = {
    id: generateId(),
    text,
    category
  };

  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  showRandomQuote();

  // Clear inputs
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Simulated server quotes (acts like remote server data)
const serverQuotes = [
  { id: 1, text: "Life is beautiful.", category: "Life" },
  { id: 4, text: "Success is not final, failure is not fatal.", category: "Motivation" }
];

// Simulated fetch function that returns server quotes after 1 second delay
async function fetchServerQuotes() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(serverQuotes);
    }, 1000);
  });
}

async function syncWithServer() {
  const serverData = await fetchServerQuotes();

  let updated = false;
  const localMap = new Map(quotes.map(q => [q.id, q]));

  serverData.forEach(serverQuote => {
    const localQuote = localMap.get(serverQuote.id);

    if (!localQuote) {
      // New quote from server - add locally
      quotes.push(serverQuote);
      updated = true;
    } else if (
      localQuote.text !== serverQuote.text || 
      localQuote.category !== serverQuote.category
    ) {
      // Conflict detected - server version wins
      const index = quotes.findIndex(q => q.id === serverQuote.id);
      quotes[index] = serverQuote;
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser("Quotes synced from server. Conflicts resolved.");
  }
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

function notifyUser(message) {
  const note = document.createElement('div');
  note.textContent = message;
  note.style.backgroundColor = '#ffeeba';
  note.style.border = '1px solid #f5c6cb';
  note.style.padding = '10px';
  note.style.marginTop = '10px';

  document.body.insertBefore(note, document.getElementById('quoteDisplay'));

  setTimeout(() => {
    note.remove();
  }, 4000);
}

setInterval(syncWithServer, 20000); // every 20 seconds
