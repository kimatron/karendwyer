class InstagramFeed {
    constructor() {
        this.init();
    }

    init() {
        this.createInstagramSection();
        this.loadInstagramPosts();
    }

    createInstagramSection() {
        // Add Instagram section to index.html or create it dynamically
        const instagramHTML = `
            <section class="section instagram-feed" id="instagram">
                <div class="container">
                    <div class="section-header scroll-reveal">
                        <p class="section-subtitle">Follow My Work</p>
                        <h2 class="section-title">Latest from Instagram</h2>
                        <p class="instagram-handle">
                            <a href="https://instagram.com/karend_hair_" target="_blank">
                                <i class="fab fa-instagram"></i> @karend_hair_
                            </a>
                        </p>
                    </div>
                    
                    <div class="instagram-grid" id="instagram-grid">
                        <div class="instagram-loading">
                            <div class="loading-spinner"></div>
                            <p>Loading latest posts...</p>
                        </div>
                    </div>
                    
                    <div class="instagram-cta scroll-reveal">
                        <a href="https://instagram.com/karend_hair_" target="_blank" class="btn btn-primary">
                            <i class="fab fa-instagram"></i> Follow for Daily Inspiration
                        </a>
                    </div>
                </div>
            </section>
        `;

        // Insert after gallery section
        const gallerySection = document.querySelector('.gallery');
        gallerySection.insertAdjacentHTML('afterend', instagramHTML);
    }

    // Method 1: Instagram Embed API (Simple & Official)
    async loadInstagramPosts() {
        const instagramGrid = document.getElementById('instagram-grid');

        // Instagram post URLs (manually curated for now)
        const featuredPosts = [
            'https://www.instagram.com/p/EXAMPLE1/',
            'https://www.instagram.com/p/EXAMPLE2/',
            'https://www.instagram.com/p/EXAMPLE3/',
            'https://www.instagram.com/p/EXAMPLE4/',
            'https://www.instagram.com/p/EXAMPLE5/',
            'https://www.instagram.com/p/EXAMPLE6/'
        ];

        try {
            instagramGrid.innerHTML = '';

            featuredPosts.forEach((postUrl, index) => {
                const postEmbed = document.createElement('div');
                postEmbed.className = 'instagram-post';
                postEmbed.innerHTML = `
                    <blockquote class="instagram-media" data-instgrm-permalink="${postUrl}" data-instgrm-version="14">
                        <div class="instagram-placeholder">
                            <div class="placeholder-content">
                                <i class="fab fa-instagram"></i>
                                <p>Loading post...</p>
                            </div>
                        </div>
                    </blockquote>
                `;
                instagramGrid.appendChild(postEmbed);

                // Stagger animation
                setTimeout(() => {
                    postEmbed.classList.add('loaded');
                }, index * 200);
            });

            // Load Instagram embed script
            this.loadInstagramScript();

        } catch (error) {
            console.error('Error loading Instagram posts:', error);
            this.showFallback();
        }
    }

    loadInstagramScript() {
        if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.instagram.com/embed.js';
            document.body.appendChild(script);
        } else {
            // Reinitialize if script already exists
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        }
    }

    showFallback() {
        const instagramGrid = document.getElementById('instagram-grid');
        instagramGrid.innerHTML = `
            <div class="instagram-fallback">
                <div class="fallback-content">
                    <i class="fab fa-instagram"></i>
                    <h3>Follow @karend_hair_ on Instagram</h3>
                    <p>See the latest transformations and behind-the-scenes content</p>
                    <a href="https://instagram.com/karend_hair_" target="_blank" class="btn btn-primary">
                        View Instagram Profile
                    </a>
                </div>
            </div>
        `;
    }
}

// Alternative Method 2: Third-party service (EmbedSocial, InstagramFeed.js)
class InstagramFeedAlternative {
    constructor() {
        this.accessToken = 'YOUR_INSTAGRAM_ACCESS_TOKEN'; // Would need Instagram Basic Display API
        this.init();
    }

    async fetchInstagramPosts() {
        // This would require Instagram Basic Display API setup
        // For now, we'll use mock data structure
        const mockPosts = [
            {
                id: '1',
                media_url: './images/gallery/bridal-1.jpg',
                caption: 'Beautiful bridal transformation for Sarah\'s special day! ✨ #BridalHair #WeddingHair',
                permalink: 'https://instagram.com/p/example1/',
                timestamp: '2024-01-15T10:00:00+0000'
            },
            // ... more posts
        ];

        return mockPosts;
    }
}