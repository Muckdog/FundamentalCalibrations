let itemCount = 1;

function addItem() {
    itemCount++;
    const itemsDiv = document.getElementById('items');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-row editable';
    itemDiv.setAttribute('data-item', itemCount);
    itemDiv.innerHTML = `
        <label>Item ${itemCount}</label>
        <input type="text" name="manufacturer[${itemCount}]" placeholder="Manufacturer" required>
        <input type="text" name="model[${itemCount}]" placeholder="Model" required>
        <input type="text" name="serial[${itemCount}]" placeholder="Serial" required>
        <input type="text" name="asset[${itemCount}]" placeholder="Asset Number" required>
        <div class="note-slider">
            <label>Additional Notes:</label>
            <input type="range" name="notes[${itemCount}]" min="0" max="500" value="0" oninput="updateNoteValue(${itemCount}, this.value)">
            <span id="note-value-${itemCount}">0/500</span>
        </div>
    `;
    itemsDiv.appendChild(itemDiv);
}

function updateNoteValue(itemNum, value) {
    document.getElementById(`note-value-${itemNum}`).textContent = `${value}/500`;
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

// Ensure Item 1 finalizes on input if all fields are filled
document.addEventListener('input', (e) => {
    const firstItem = document.querySelector('.item-row[data-item="1"]');
    if (firstItem && !firstItem.classList.contains('editable')) return;
    const inputs = firstItem.getElementsByTagName('input');
    const range = firstItem.querySelector('input[type="range"]');
    let allFilled = true;
    for (let input of inputs) {
        if (!input.value.trim()) allFilled = false;
    }
    if (range.value === "0") allFilled = false;
    if (allFilled && firstItem) finalizeItem(firstItem);
});
