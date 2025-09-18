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
    } else {
        console.warn('No more predefined items available');
    }
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
    row.classList.add('hidden');
    row.classList.remove('editable');
    const inputs = row.getElementsByTagName('input');
    const textarea = row.getElementsByTagName('textarea')[0];
    for (let input of inputs) input.value = '';
    if (textarea) textarea.value = '';
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
