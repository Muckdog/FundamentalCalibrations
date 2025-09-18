let itemCount = 1;

function addItem() {
    itemCount++;
    const itemsDiv = document.getElementById('items');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-row editable';
    itemDiv.setAttribute('data-item', itemCount);
    itemDiv.innerHTML = `
        <label>Item ${itemCount}</label>
        <select name="manufacturer[${itemCount}]" required>
            <option value="">Select Manufacturer</option>
            <option value="Fluke">Fluke</option>
            <option value="Keysight">Keysight</option>
        </select>
        <select name="model[${itemCount}]" required>
            <option value="">Select Model</option>
            <option value="Model A">Model A</option>
            <option value="Model B">Model B</option>
        </select>
        <input type="text" name="serial[${itemCount}]" placeholder="Serial" required>
        <input type="text" name="asset[${itemCount}]" placeholder="Asset Number" required>
    `;
    itemsDiv.appendChild(itemDiv);
}

function finalizeItem(itemDiv) {
    itemDiv.classList.remove('editable');
    itemDiv.innerHTML += `
        <button type="button" onclick="editItem(this)">Edit</button>
        <button type="button" onclick="removeItem(this)">-</button>
    `;
}

function editItem(button) {
    const row = button.parentElement;
    if (!row.classList.contains('editable')) {
        row.classList.add('editable');
        const buttons = row.getElementsByTagName('button');
        for (let btn of buttons) btn.remove();
    }
}

function removeItem(button) {
    const row = button.parentElement;
    row.remove();
}

document.getElementById('quoteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const items = document.querySelectorAll('.item-row');
    items.forEach(item => {
        if (item.classList.contains('editable')) {
            alert('Please finalize all items before submitting.');
            e.stopPropagation();
            return;
        }
    });
    fetch('/', {
        method: 'POST',
        body: new FormData(form)
    }).then(() => alert('Quote submitted! Check your email.')).catch(() => alert('Error submitting.'));
});

// Finalize Item 1 on load if filled (not applicable with current setup, adjust if needed)
