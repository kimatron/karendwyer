// Gallery Data
// This data structure holds the gallery items with their respective categories, titles, and descriptions.
const galleryData = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'bridal',
        title: 'Romantic Bridal Updo',
        description: 'Elegant twisted updo with delicate pearl accessories for a castle wedding.'
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'color',
        title: 'Balayage Transformation',
        description: 'Natural sun-kissed balayage with dimensional highlights.'
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'bridal',
        title: 'Boho Bridal Style',
        description: 'Loose, textured waves with floral crown for outdoor ceremony.'
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'extensions',
        title: 'Volume Extensions',
        description: 'Seamless tape-in extensions adding length and volume for special occasion.'
    },
    {
        id: 5,
        src: 'https://images.unsplash.com/photo-1487412912498-0447678129ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'color',
        title: 'Platinum Blonde',
        description: 'Complete color transformation to platinum blonde with purple toner.'
    },
    {
        id: 6,
        src: 'https://images.unsplash.com/photo-1618677903109-cbd3c0ce9064?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'bridal',
        title: 'Classic Chignon',
        description: 'Timeless low chignon with subtle braided details.'
    }
];

class ModernGallery {
    constructor() {
        this.currentImageIndex = 0;
        this.filteredData = [...galleryData];
        this.init();
    }

    init() {
        this.renderGallery();
        this.setupEventListeners();
        this.setupIntersectionObserver();
    }

    renderGallery(filter = 'all') {
        const grid = document.getElementById('gallery-grid');

        // Filter data
        this.filteredData = filter === 'all'
            ? [...galleryData]
            : galleryData.filter(item => item.category === filter);

        // Clear and render
        grid.innerHTML = '';

        this.filteredData.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-index', index);
            galleryItem.innerHTML = `
                <img 
                    data-src="${item.src}" 
                    alt="${item.title}"
                    class="lazy-load"
                >
                <div class="gallery-overlay">
                    <i class="fas fa-search-plus"></i>
                    <div class="overlay-text">View Details</div>
                </div>
            `;

            galleryItem.addEventListener('click', () => this.openLightbox(index));
            grid.appendChild(galleryItem);
        });

        // Trigger lazy loading
        this.observeImages();
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Filter gallery
                this.renderGallery(e.target.getAttribute('data-filter'));
            });
        });

        // Lightbox controls
        document.getElementById('lightbox-close').addEventListener('click', () => this.closeLightbox());
        document.getElementById('lightbox-prev').addEventListener('click', () => this.prevImage());
        document.getElementById('lightbox-next').addEventListener('click', () => this.nextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const lightbox = document.getElementById('gallery-lightbox');
            if (lightbox.open) {
                switch (e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.prevImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });

        // Click outside to close
        document.getElementById('gallery-lightbox').addEventListener('click', (e) => {
            if (e.target.id === 'gallery-lightbox') {
                this.closeLightbox();
            }
        });
    }

    setupIntersectionObserver() {
        // Lazy loading for performance
        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');

                    img.onload = () => {
                        img.parentElement.classList.add('loaded');
                    };

                    observer.unobserve(img);
                }
            });
        });
    }

    observeImages() {
        document.querySelectorAll('.lazy-load').forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        const item = this.filteredData[index];

        // Update lightbox content
        document.getElementById('lightbox-image').src = item.src;
        document.getElementById('lightbox-title').textContent = item.title;
        document.getElementById('lightbox-description').textContent = item.description;

        // Show lightbox
        document.getElementById('gallery-lightbox').showModal();
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        document.getElementById('gallery-lightbox').close();
        document.body.style.overflow = 'auto';
    }

    prevImage() {
        this.currentImageIndex = this.currentImageIndex > 0
            ? this.currentImageIndex - 1
            : this.filteredData.length - 1;

        const item = this.filteredData[this.currentImageIndex];
        document.getElementById('lightbox-image').src = item.src;
        document.getElementById('lightbox-title').textContent = item.title;
        document.getElementById('lightbox-description').textContent = item.description;
    }

    nextImage() {
        this.currentImageIndex = this.currentImageIndex < this.filteredData.length - 1
            ? this.currentImageIndex + 1
            : 0;

        const item = this.filteredData[this.currentImageIndex];
        document.getElementById('lightbox-image').src = item.src;
        document.getElementById('lightbox-title').textContent = item.title;
        document.getElementById('lightbox-description').textContent = item.description;
    }
}

// Initialize gallery when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new ModernGallery();
});