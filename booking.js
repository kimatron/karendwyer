class BookingSystem {
    constructor() {
        this.calendlyUrl = 'https://calendly.com/karen-dwyer-hair'; // Replace with real URL
        this.init();
    }

    init() {
        this.setupBookingButtons();
        this.createBookingModal();
        this.loadCalendlyScript();
    }

    setupBookingButtons() {
        // Update existing CTA buttons to open booking modal
        document.querySelectorAll('a[href="#contact"]').forEach(btn => {
            if (btn.textContent.includes('Book')) {
                btn.setAttribute('href', '#');
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openBookingModal();
                });
            }
        });

        // Add booking buttons to services
        document.querySelectorAll('.service-card').forEach(card => {
            const bookBtn = document.createElement('button');
            bookBtn.className = 'btn btn-secondary service-book-btn';
            bookBtn.innerHTML = '<i class="fas fa-calendar-alt"></i> Book This Service';
            bookBtn.addEventListener('click', () => this.openBookingModal());
            card.appendChild(bookBtn);
        });
    }

    createBookingModal() {
        const modalHTML = `
            <dialog class="booking-modal" id="booking-modal">
                <div class="booking-content">
                    <div class="booking-header">
                        <h3>Book Your Consultation</h3>
                        <button class="booking-close" id="booking-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="booking-options">
                        <div class="booking-option" data-type="consultation">
                            <div class="option-icon">
                                <i class="fas fa-comments"></i>
                            </div>
                            <h4>Free Consultation</h4>
                            <p>30-minute discussion about your vision</p>
                            <span class="option-price">Free</span>
                        </div>
                        
                        <div class="booking-option" data-type="trial">
                            <div class="option-icon">
                                <i class="fas fa-magic"></i>
                            </div>
                            <h4>Bridal Trial</h4>
                            <p>Full hair trial for your wedding day</p>
                            <span class="option-price">€80</span>
                        </div>
                        
                        <div class="booking-option" data-type="color">
                            <div class="option-icon">
                                <i class="fas fa-palette"></i>
                            </div>
                            <h4>Color Consultation</h4>
                            <p>Expert color analysis and planning</p>
                            <span class="option-price">€40</span>
                        </div>
                    </div>
                    
                    <!-- Calendly widget will be injected here -->
                    <div class="calendly-container" id="calendly-container">
                        <div class="calendly-loading">
                            <div class="loading-spinner"></div>
                            <p>Loading available times...</p>
                        </div>
                    </div>
                    
                    <!-- Fallback contact form -->
                    <div class="booking-fallback" id="booking-fallback" style="display: none;">
                        <h4>Alternative Booking</h4>
                        <p>Having trouble with the calendar? Send a message instead:</p>
                        <form class="quick-booking-form">
                            <div class="form-row">
                                <input type="text" placeholder="Your Name" required>
                                <input type="email" placeholder="Email Address" required>
                            </div>
                            <div class="form-row">
                                <input type="tel" placeholder="Phone Number" required>
                                <select required>
                                    <option value="">Select Service</option>
                                    <option value="consultation">Free Consultation</option>
                                    <option value="trial">Bridal Trial</option>
                                    <option value="color">Color Consultation</option>
                                    <option value="wedding">Wedding Day</option>
                                </select>
                            </div>
                            <textarea placeholder="Preferred dates/times and any questions..." rows="3"></textarea>
                            <button type="submit" class="btn btn-primary">Send Booking Request</button>
                        </form>
                    </div>
                </div>
            </dialog>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupModalEvents();
    }

    setupModalEvents() {
        // Close modal
        document.getElementById('booking-close').addEventListener('click', () => {
            this.closeBookingModal();
        });

        // Click outside to close
        document.getElementById('booking-modal').addEventListener('click', (e) => {
            if (e.target.id === 'booking-modal') {
                this.closeBookingModal();
            }
        });

        // Service selection
        document.querySelectorAll('.booking-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.booking-option').forEach(opt =>
                    opt.classList.remove('selected'));
                option.classList.add('selected');

                const serviceType = option.getAttribute('data-type');
                this.loadCalendlyWidget(serviceType);
            });
        });

        // Fallback form
        document.querySelector('.quick-booking-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFallbackBooking(e);
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('booking-modal').open) {
                this.closeBookingModal();
            }
        });
    }

    openBookingModal() {
        document.getElementById('booking-modal').showModal();
        document.body.style.overflow = 'hidden';
    }

    closeBookingModal() {
        document.getElementById('booking-modal').close();
        document.body.style.overflow = 'auto';

        // Reset modal state
        document.querySelectorAll('.booking-option').forEach(opt =>
            opt.classList.remove('selected'));
        document.getElementById('calendly-container').innerHTML = `
            <div class="calendly-loading">
                <div class="loading-spinner"></div>
                <p>Loading available times...</p>
            </div>
        `;
    }

    loadCalendlyScript() {
        if (!document.querySelector('script[src*="calendly.com"]')) {
            const script = document.createElement('script');
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }

    loadCalendlyWidget(serviceType = 'consultation') {
        const container = document.getElementById('calendly-container');

        // Service-specific Calendly URLs (you'd set these up in Calendly)
        const calendlyUrls = {
            consultation: `${this.calendlyUrl}/consultation`,
            trial: `${this.calendlyUrl}/bridal-trial`,
            color: `${this.calendlyUrl}/color-consultation`
        };

        // Clear container
        container.innerHTML = '';

        try {
            // Initialize Calendly widget
            if (window.Calendly) {
                window.Calendly.initInlineWidget({
                    url: calendlyUrls[serviceType] || this.calendlyUrl,
                    parentElement: container,
                    prefill: {},
                    utm: {
                        utmCampaign: 'website_booking',
                        utmSource: 'karen_dwyer_website',
                        utmMedium: 'booking_modal'
                    }
                });
            } else {
                // Fallback if Calendly doesn't load
                setTimeout(() => this.showBookingFallback(), 3000);
            }
        } catch (error) {
            console.error('Error loading Calendly:', error);
            this.showBookingFallback();
        }
    }

    showBookingFallback() {
        document.getElementById('calendly-container').style.display = 'none';
        document.getElementById('booking-fallback').style.display = 'block';
    }

    handleFallbackBooking(e) {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(e.target);
        const bookingData = Object.fromEntries(formData);

        // Send to your backend or email service
        // For now, show success message
        alert('Booking request sent! Karen will contact you within 24 hours.');
        this.closeBookingModal();
    }
}

// Initialize booking system
document.addEventListener('DOMContentLoaded', () => {
    new BookingSystem();
});