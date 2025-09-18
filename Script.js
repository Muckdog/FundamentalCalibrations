let itemCount = 1;

function addItem() {
    itemCount++;
    const template = document.getElementById('item-template');
    const itemDiv = template.content.cloneNode(true).querySelector('.item-row');
    itemDiv.setAttribute('data-item', itemCount);
    itemDiv.querySelector('label').textContent = `Item ${itemCount}`;
    const inputs = itemDiv.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        const name = input.getAttribute('name').replace('[]', `[${itemCount}]`);
        input.setAttribute('name', name);
    });
    itemDiv.classList.add('editable');
    document.getElementById('items').appendChild(itemDiv);
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
    const form = document.querySelector('form[name="quoteForm"]');
    const items = document.querySelectorAll('.item-row');
    items.forEach(item => {
        if (item.classList.contains('editable')) {
            alert('Please finalize all items before submitting.');
            e.preventDefault();
            e.stopPropagation();
            return;
        }
    });
    // Let Netlify handle submission natively
    console.log('Form submitted, check Netlify Forms for data');
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
