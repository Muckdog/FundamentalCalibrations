document.getElementById('quoteForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = this;
    const formData = new FormData(form);

    try {
        const response = await fetch('/', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Thank you! Your quote request has been submitted. We’ll contact you within 24-48 hours.');
            form.reset();
            document.querySelectorAll('.item-row').forEach((row, index) => {
                if (index > 0) row.classList.add('hidden');
            });
        } else {
            alert('Submission failed. Please try again or contact support.');
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
});
