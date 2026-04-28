document.addEventListener('DOMContentLoaded', () => {
    const placeholders = document.querySelectorAll('[data-include]');
    placeholders.forEach(async (el) => {
        const url = el.getAttribute('data-include');
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
            el.outerHTML = await res.text();
        } catch (err) {
            console.error('[include]', err);
        }
    });
});
