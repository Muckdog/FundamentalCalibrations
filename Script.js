// Add item functionality for quote form
function addItem() {
    const items = document.getElementById('items');
    const itemRows = items.getElementsByClassName('item-row');
    const nextItem = itemRows.length + 1;

    if (nextItem <= 10) {
        const newItem = document.querySelector(`[data-item="${nextItem}"]`).cloneNode(true);
        newItem.classList.remove('hidden');
        newItem.querySelectorAll('input, textarea').forEach(input => {
            input.value = '';
            input.name = input.name.replace(`[${nextItem - 1}]`, `[${nextItem}]`);
        });
        items.appendChild(newItem);
    }
}

// Form submission handling (optional enhancement)
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your form submission logic here, e.g., Netlify form handling is automatic
        console.log('Form submitted:', new FormData(this));
        alert('Thank you! Your submission has been received.');
    });
});
