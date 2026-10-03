document.addEventListener('DOMContentLoaded', () => {
    
    const cards = document.querySelectorAll('.education-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');

    // 1. Kartalarga navbatma-navbat chiqish animatsiyasini qo'llash (Stagger animation)
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // 2. Qidiruv va Filtr funksiyasi
    function filterCourses() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeBtn ? activeBtn.dataset.filter : 'all';
        let visibleCount = 0;

        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const category = card.dataset.category;

            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesFilter = activeFilter === 'all' || category === activeFilter;

            if (matchesSearch && matchesFilter) {
                card.style.display = 'flex';
                card.style.animation = 'none';
                card.offsetHeight; // Reflow reset
                card.style.animation = 'fadeInUp 0.4s forwards';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Natija topilmaganda xabar ko'rsatish
        if (noResults) {
            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
            } else {
                noResults.classList.add('hidden');
            }
        }
    }

    // 3. Filtr tugmalari bosilganda
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterCourses();
        });
    });

    // 4. Qidiruv maydoniga yozilganda
    if (searchInput) {
        searchInput.addEventListener('input', filterCourses);
    }

    // 5. Sichqoncha harakatiga mos 3D Parallax (Mouse tilt) effekti
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // Supabase va dinamik yuklash skripti bilan integratsiya (agar kiritilgan bo'lsa)
    if (typeof loadCourses === 'function') {
        loadCourses({ gridSelector: "#courseGrid", pathPrefix: "../", withNumber: true });
    }
});