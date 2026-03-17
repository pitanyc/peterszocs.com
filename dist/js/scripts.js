/*!
* Start Bootstrap - peterszocs.com v7.0.12 (https://www.peterszocs.com)
* Copyright 2013-2026 Peter Szocs
* Licensed under MIT (https://github.com/StartBootstrap/peterszocs.com/blob/master/LICENSE)
*/
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

});
