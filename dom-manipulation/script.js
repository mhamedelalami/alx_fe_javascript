// Step 1: Initialize the quotes array
const quotes = [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Do or do not. There is no try.", category: "Wisdom" },
];

// Step 2: Show a random quote
function showRandomQuote() {
  // Get a random index
  const randomIndex = Math.floor(Math.random() * quotes.length);

  // Get the quote at that index
  const quote = quotes[randomIndex];

  // Display it in the quoteDisplay div
  const displayDiv = document.getElementById('quoteDisplay');
  displayDiv.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>Category: ${quote.category}</em></p>
  `;
}

// Step 3: Add a new quote dynamically
function addQuote() {
  // Get values from input fields
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  // Validate inputs
  if (quoteText === '' || quoteCategory === '') {
    alert('Please enter both a quote and a category.');
    return;
  }

  // Create new quote object
  const newQuote = {
    text: quoteText,
    category: quoteCategory
  };

  // Add to quotes array
  quotes.push(newQuote);

  // Clear inputs
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  // Optionally show the new quote immediately
  showRandomQuote();
}

// Step 4: Attach event listener to the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Optional: Show a quote immediately on page load
showRandomQuote();
