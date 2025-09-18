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
        <div class="note-box">
            <textarea name="notes[${itemCount}]" placeholder="Additional notes about the item" maxlength="500"></textarea>
        </div>
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
    const form = document.querySelector('form[name="quoteForm"]');
    const items = document.querySelectorAll('.item-row');
    items.forEach(item => {
        if (item.classList.contains('editable')) {
            alert('Please finalize all items before submitting.');
            e.stopPropagation();
            return;
        }
    });

    // Collect all form data from DOM
    const formData = new FormData(form);
    const data = {
        name: form.querySelector('input[name="name"]').value,
        company: form.querySelector('input[name="company"]').value,
        phone: form.querySelector('input[name="phone"]').value,
        email: form.querySelector('input[name="email"]').value
    };
    data.manufacturer = [];
    data.model = [];
    data.serial = [];
    data.asset = [];
    data.notes = [];

    items.forEach(item => {
        const itemNum = item.getAttribute('data-item');
        data.manufacturer.push(form.querySelector(`input[name="manufacturer[${itemNum}]"]`).value);
        data.model.push(form.querySelector(`input[name="model[${itemNum}]"]`).value);
        data.serial.push(form.querySelector(`input[name="serial[${itemNum}]"]`).value);
        data.asset.push(form.querySelector(`input[name="asset[${itemNum}]"]`).value);
        data.notes.push(form.querySelector(`textarea[name="notes[${itemNum}]"]`).value);
    });

    // Log data for debugging
    console.log('Submitted Data:', data);

    // Convert to URL-encoded format
    const params = new URLSearchParams();
    for (let key in data) {
        if (Array.isArray(data[key])) {
            data[key].forEach((value, index) => {
                params.append(key, value);
            });
        } else {
            params.append(key, data[key]);
        }
    }

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    }).then(response => {
        console.log('Response:', response);
        return response.text();
    }).then(text => {
        console.log('Response Text:', text);
        alert('Quote submitted! Check your email.');
    }).catch(error => {
        console.error('Error:', error);
        alert('Error submitting.');
    });

    // Fallback to default form submission for Netlify
    form.submit();
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
