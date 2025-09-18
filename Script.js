function addItem() {
    const itemsDiv = document.getElementById('items');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-row';
    itemDiv.innerHTML = `
        <input type="text" placeholder="Manufacturer" required>
        <input type="text" placeholder="Model" required>
        <input type="text" placeholder="Serial" required>
        <input type="text" placeholder="Asset Number" required>
        <button type="button" onclick="editItem(this)">Edit</button>
        <button type="button" onclick="removeItem(this)">-</button>
    `;
    itemsDiv.appendChild(itemDiv);
}

function editItem(button) {
    const row = button.parentElement;
    row.classList.toggle('editable');
}

function removeItem(button) {
    const row = button.parentElement;
    row.remove();
}

document.getElementById('quoteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Quote submitted! Data will be processed.');
});
