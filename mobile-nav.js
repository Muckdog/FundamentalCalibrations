document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const iconOpen = document.getElementById('navIconOpen');
    const iconClose = document.getElementById('navIconClose');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
        const isOpen = !menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        if (iconOpen) iconOpen.classList.toggle('hidden');
        if (iconClose) iconClose.classList.toggle('hidden');
        toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            menu.classList.add('hidden');
            if (iconOpen) iconOpen.classList.remove('hidden');
            if (iconClose) iconClose.classList.add('hidden');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
});
