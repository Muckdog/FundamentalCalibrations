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
        nextItem.querySelector('label').textContent = `Item ${itemCount}`; // Ensure item number updates
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

// Client-side validation for contact info only
document.addEventListener('input', (e) => {
    const form = document.querySelector('form[name="quoteForm"]');
    const requiredFields = form.querySelectorAll('input[required]');
    let allRequiredFilled = true;
    requiredFields.forEach(field => {
        if (!field.value.trim()) allRequiredFilled = false;
    });
    if (!allRequiredFilled && form.checkValidity()) {
        alert('Please fill in all contact information (Name, Company, Phone, Email) before submitting.');
    }
    // Ensure Item 1 finalizes if all its fields are filled
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

// Intercept form submission to filter empty fields
document.getElementById('quoteForm').addEventListener('submit', (e) => {
    const form = document.getElementById('quoteForm');
    const items = document.querySelectorAll('.item-row');
    let hasEditable = false;

    // Check for editable items
    items.forEach(item => {
        if (item.classList.contains('editable')) {
            hasEditable = true;
        }
    });

    if (hasEditable) {
        alert('Please finalize all items before submitting.');
        e.preventDefault();
        return;
    }

    // Filter out empty item fields before submission
    items.forEach(item => {
        const inputs = item.querySelectorAll('input');
        const textarea = item.querySelector('textarea');
        let isEmpty = true;
        inputs.forEach(input => {
            if (input.value.trim()) isEmpty = false;
        });
        if (textarea && textarea.value.trim()) isEmpty = false;
        if (isEmpty) {
            inputs.forEach(input => input.disabled = true); // Disable empty fields
            if (textarea) textarea.disabled = true;
        }
    });

    // Ensure required fields are filled
    const requiredFields = form.querySelectorAll('input[required]');
    let allRequiredFilled = true;
    requiredFields.forEach(field => {
        if (!field.value.trim()) allRequiredFilled = false;
    });
    if (!allRequiredFilled) {
        alert('Please fill in all contact information (Name, Company, Phone, Email) before submitting.');
        e.preventDefault();
        // Re-enable disabled fields to avoid submission issues
        items.forEach(item => {
            item.querySelectorAll('input').forEach(input => input.disabled = false);
            const textarea = item.querySelector('textarea');
            if (textarea) textarea.disabled = false;
        });
        return;
    }
});
