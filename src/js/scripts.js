//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        const nameInput = contactForm.querySelector('#name');
        const emailInput = contactForm.querySelector('#email');
        const messageInput = contactForm.querySelector('#message');
        const submitButton = contactForm.querySelector('#submitButton');

        function checkFormValidity() {
            submitButton.disabled = !(nameInput.checkValidity() && emailInput.checkValidity() && messageInput.checkValidity());
        }

        [nameInput, emailInput, messageInput].forEach(function (field) {
            field.addEventListener('input', checkFormValidity);
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            var formData = {};
            new FormData(contactForm).forEach(function (value, key) {
                formData[key] = value;
            });

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(function (response) { return response.json(); })
            .then(function (data) {
                if (data.success) {
                    submitButton.textContent = 'Message Sent!';
                    contactForm.reset();
                } else {
                    submitButton.textContent = 'Something went wrong';
                }
            })
            .catch(function () {
                submitButton.textContent = 'Something went wrong';
            })
            .finally(function () {
                setTimeout(function () {
                    submitButton.textContent = 'Send Message';
                    checkFormValidity();
                }, 3000);
            });
        });
    }

    // YouTube Lite Embed - Lazy loading with facade pattern
    if ('IntersectionObserver' in window) {
        // Preconnect to YouTube domains for faster loading when user clicks
        const preconnectLinks = [
            'https://www.youtube-nocookie.com',
            'https://www.google.com',
            'https://i.ytimg.com'
        ];

        preconnectLinks.forEach(function (url) {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = url;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });

        // Intersection Observer for lazy loading thumbnails
        const videoObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const videoElement = entry.target;
                    const videoId = videoElement.dataset.id;

                    // Load YouTube thumbnail
                    if (videoId) {
                        videoElement.style.backgroundImage = `url('https://i.ytimg.com/vi/${videoId}/hqdefault.jpg')`;
                        videoObserver.unobserve(videoElement);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observe all lite-youtube elements
        const liteVideos = document.querySelectorAll('.lite-youtube');
        liteVideos.forEach(function (video) {
            videoObserver.observe(video);

            // Click handler - load iframe on demand
            video.addEventListener('click', function (e) {
                e.preventDefault();
                activateVideo(video);
            });

            // Keyboard handler - activate on Enter/Space
            video.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activateVideo(video);
                }
            });
        });

        // Activate video by loading iframe
        function activateVideo(videoElement) {
            if (videoElement.classList.contains('lyt-activated')) {
                return; // Already activated
            }

            const videoId = videoElement.dataset.id;
            if (!videoId) return;

            // Create iframe
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.title = videoElement.getAttribute('aria-label').replace('Play: ', '');

            // Mark as activated and append iframe
            videoElement.classList.add('lyt-activated');
            videoElement.appendChild(iframe);
        }
    }

});
