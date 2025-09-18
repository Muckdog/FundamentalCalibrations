let itemCount = 1;

function addItem() {
    itemCount++;
    const items = document.querySelectorAll('.item-row');
    let nextItem = null;
    for (let item of items) {
        if (item.classList.contains('hidden') && parseInt(item.getAttribute('data-item')) === itemCount) {
            nextItem = item;
            break;
        }
    }
    if (nextItem) {
        nextItem.classList.remove('hidden');
        nextItem.classList.add('editable');
        nextItem.querySelector('label').textContent = `Instrument ${itemCount}`; // Changed to "Instrument"
        // Add delete button immediately for new items
        finalizeItem(nextItem);
    } else {
        console.warn('No more predefined items available. Maximum reached (10).');
    }
}

function finalizeItem(itemDiv) {
    itemDiv.classList.remove('editable');
    // Add delete button only if not already present
    if (!itemDiv.querySelector('button')) {
        itemDiv.innerHTML += `
            <button type="button" onclick="removeItem(this)">-</button>
        `;
    }
}

function removeItem(button) {
    const row = button.parentElement;
    if (parseInt(row.getAttribute('data-item')) > 1) {
        row.classList.add('hidden');
        row.classList.remove('editable');
        const inputs = row.getElementsByTagName('input');
        const textarea = row.getElementsByTagName('textarea')[0];
        for (let input of inputs) input.value = '';
        if (textarea) textarea.value = '';
        itemCount--; // Decrement to allow re-adding
    } else {
        alert('Item 1 cannot be deleted.');
    }
}

document.getElementById('quoteForm').addEventListener('submit', (e) => {
    const items = document.querySelectorAll('.item-row');
    let hasEditable = false;
    items.forEach(item => {
        if (item.classList.contains('editable')) {
            hasEditable = true;
        }
    });
    if (hasEditable) {
        alert('Please finalize all items before submitting.');
        e.preventDefault();
    } else {
        console.log('Form submitted, check Netlify Forms for data');
    }
    // Netlify will handle submission if no prevention occurs
});

// Ensure Item 1 finalizes on input if all fields are filled
document.addEventListener('input', (e) => {
    const firstItem = document.querySelector('.item-row[data-item="1"]');
    if (firstItem && !firstItem.classList.contains('editable')) return;
    const inputs = firstItem.getElementsByTagName('input');
    const textarea = firstItem.getElementsByTagName('textarea')[0];
    let allFilled = true;
    for (let input of inputs) {
        if (!input.value.trim()) allFilled = false;
    }
    if (!textarea.value.trim()) allFilled = false;
    if (allFilled && firstItem) finalizeItem(firstItem);
});
