document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Navbar Scroll Effect (CSS class based)
    // ==========================================
    const navbar = document.getElementById('navbar');
    const updateNavbar = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // ==========================================
    // 2. Mobile Hamburger Menu Toggle
    // ==========================================
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle && navLinks) {
        const toggleIcon = mobileToggle.querySelector('i');

        const toggleMenu = (open) => {
            const isOpen = typeof open === 'boolean' ? open : !navLinks.classList.contains('active');
            navLinks.classList.toggle('active', isOpen);
            mobileToggle.setAttribute('aria-expanded', isOpen);
            if (toggleIcon) {
                toggleIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            }
        };

        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navbar.contains(e.target)) {
                toggleMenu(false);
            }
        });
    }

    // ==========================================
    // 3. Smooth Scrolling with Fixed Nav Offset
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (mobileToggle) {
                        mobileToggle.setAttribute('aria-expanded', 'false');
                        const icon = mobileToggle.querySelector('i');
                        if (icon) icon.className = 'fas fa-bars';
                    }
                }

                const navHeight = navbar ? navbar.offsetHeight : 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - (navHeight - 10);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 4. Real-time Business Hours Checker
    // ==========================================
    const updateBusinessStatus = () => {
        const heroBadge = document.getElementById('hero-status-badge');
        const infoBadge = document.getElementById('info-status-badge');
        if (!heroBadge && !infoBadge) return;

        const now = new Date();
        const day = now.getDay(); // 0 is Sunday, 5 is Friday
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentMins = hours * 60 + minutes;

        // Business schedule definition:
        // Closed on Friday (day === 5)
        // Lunch: 10:30 (630) ~ 14:00 (840)
        // Break: 14:00 (840) ~ 16:00 (960)
        // Dinner: 16:00 (960) ~ 20:00 (1200)

        let statusClass = 'status-closed';
        let statusText = '本日已打烊（明日 10:30 開始營業）';

        if (day === 5) {
            statusClass = 'status-closed';
            statusText = '今日固定公休（每週五公休）';
        } else if (currentMins >= 630 && currentMins < 840) {
            statusClass = 'status-open';
            statusText = '營業中 ‧ 午餐時段（至 14:00）';
        } else if (currentMins >= 840 && currentMins < 960) {
            statusClass = 'status-break';
            statusText = '下午備料休息中（16:00 開始營業）';
        } else if (currentMins >= 960 && currentMins < 1200) {
            statusClass = 'status-open';
            statusText = '營業中 ‧ 晚餐時段（至 20:00）';
        } else if (currentMins < 630) {
            statusClass = 'status-closed';
            statusText = '尚未營業（今日 10:30 開始營業）';
        } else {
            statusClass = 'status-closed';
            statusText = '本日已打烊（明日 10:30 開始營業）';
        }

        const renderBadge = (container) => {
            if (!container) return;
            container.className = `status-badge ${statusClass} ${container.id === 'info-status-badge' ? 'status-badge-inline' : ''}`;
            container.innerHTML = `
                <span class="status-dot"></span>
                <span class="status-text">${statusText}</span>
            `;
        };

        renderBadge(heroBadge);
        renderBadge(infoBadge);
    };

    updateBusinessStatus();
    // Refresh status every minute
    setInterval(updateBusinessStatus, 60000);

    // ==========================================
    // 5. Native HTML5 Lightbox Modal (<dialog>)
    // ==========================================
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (modal && modalImg && modalCaption) {
        const openModal = (src, caption) => {
            modalImg.src = src;
            modalCaption.textContent = caption || '';
            if (typeof modal.showModal === 'function') {
                modal.showModal();
            } else {
                modal.setAttribute('open', '');
            }
        };

        const closeModal = () => {
            if (typeof modal.close === 'function') {
                modal.close();
            } else {
                modal.removeAttribute('open');
            }
        };

        // Click on Paper Menu
        const menuBtn = document.getElementById('menu-image-btn');
        if (menuBtn) {
            const handleMenuClick = () => {
                const img = menuBtn.querySelector('img');
                if (img) {
                    openModal(img.src, '龍鳳同心億麵館 - 紙本完整菜單價目表');
                }
            };
            menuBtn.addEventListener('click', handleMenuClick);
            menuBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMenuClick();
                }
            });
        }

        // Click on Gallery Items
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const fullSrc = item.getAttribute('data-full') || item.querySelector('img')?.src;
                const caption = item.getAttribute('data-caption') || item.querySelector('img')?.alt || '';
                if (fullSrc) {
                    openModal(fullSrc, caption);
                }
            });
        });

        // Close on close button click
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }

        // Close on clicking backdrop
        modal.addEventListener('click', (e) => {
            const rect = modal.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY &&
                e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX &&
                e.clientX <= rect.left + rect.width
            );
            // Click outside the modal box
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});
