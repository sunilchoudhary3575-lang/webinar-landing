// Bawra Digitals - Landing Page Interactive Logic

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Countdown Timer (Weekly Rollover Monday 7:30 PM)
  // ==========================================
  function getNextMonday730PM() {
    const now = new Date();
    const resultDate = new Date();
    
    // Find days until next Monday (Monday is day 1)
    const currentDay = now.getDay();
    let daysToMonday = 1 - currentDay;
    if (daysToMonday <= 0) {
      daysToMonday += 7; // It's Tuesday-Sunday or Monday, push to next Monday
    }
    
    // If it's Monday today, check if it's before or after 7:30 PM
    if (currentDay === 1) {
      const today730PM = new Date();
      today730PM.setHours(19, 30, 0, 0);
      if (now < today730PM) {
        daysToMonday = 0; // Today is the day
      }
    }
    
    resultDate.setDate(now.getDate() + daysToMonday);
    resultDate.setHours(19, 30, 0, 0);
    
    return resultDate.getTime();
  }

  const targetTime = getNextMonday730PM();
  const timerElements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  };

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance < 0) {
      // Rollover dynamically if countdown expires
      clearInterval(countdownInterval);
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    // Format with leading zeros
    if (timerElements.days) timerElements.days.textContent = d.toString().padStart(2, '0');
    if (timerElements.hours) timerElements.hours.textContent = h.toString().padStart(2, '0');
    if (timerElements.minutes) timerElements.minutes.textContent = m.toString().padStart(2, '0');
    if (timerElements.seconds) timerElements.seconds.textContent = s.toString().padStart(2, '0');
  }

  // Update timer every second
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);


  // ==========================================
  // 2. Modal Open/Close Logic
  // ==========================================
  const modal = document.getElementById('reg-modal');
  const openModalButtons = document.querySelectorAll('.open-modal-btn');
  const closeModalButton = document.getElementById('modal-close');
  const regForm = document.getElementById('registration-form');
  const successState = document.getElementById('success-state');

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable background scrolling
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable background scrolling
    
    // Clear validation errors and inputs if they haven't submitted successfully
    if (!successState.classList.contains('hidden') === false) {
      clearFormErrors();
    }
  }

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
  }

  // Close modal when clicking outside of the modal dialog box
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });


  // ==========================================
  // 3. Interactive FAQ Accordion
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQ accordions
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-content').style.maxHeight = null;
        }
      });

      // Toggle current accordion
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });


  // ==========================================
  // 4. Scroll-Triggered Sticky Footer CTA Bar
  // ==========================================
  const stickyBar = document.getElementById('sticky-bar');
  const heroSection = document.querySelector('.hero');

  if (stickyBar && heroSection) {
    const observerOptions = {
      root: null, // relative to document viewport
      threshold: 0 // trigger when hero is completely/partially out
    };

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          // Hero is scrolled past, show the sticky CTA bar
          stickyBar.classList.add('visible');
        } else {
          // Hero is visible, hide the sticky CTA bar
          stickyBar.classList.remove('visible');
        }
      });
    }, observerOptions);

    heroObserver.observe(heroSection);
  }


  // ==========================================
  // 5. Form Validation & Submission
  // ==========================================
  const inputs = {
    fullName: document.getElementById('fullName'),
    mobile: document.getElementById('mobile'),
    email: document.getElementById('email'),
    specialty: document.getElementById('specialty'),
    clinicName: document.getElementById('clinicName')
  };

  const errors = {
    fullName: document.getElementById('name-error'),
    mobile: document.getElementById('mobile-error'),
    email: document.getElementById('email-error'),
    specialty: document.getElementById('specialty-error'),
    clinicName: document.getElementById('clinic-error')
  };

  function clearFormErrors() {
    Object.values(inputs).forEach(input => {
      if (input) input.classList.remove('invalid');
    });
    Object.values(errors).forEach(err => {
      if (err) err.textContent = '';
    });
  }

  function validateForm() {
    let isValid = true;
    clearFormErrors();

    // 1. Full Name check
    if (!inputs.fullName.value.trim()) {
      errors.fullName.textContent = 'Name is required.';
      inputs.fullName.classList.add('invalid');
      isValid = false;
    } else if (inputs.fullName.value.trim().length < 3) {
      errors.fullName.textContent = 'Name must be at least 3 characters.';
      inputs.fullName.classList.add('invalid');
      isValid = false;
    }

    // 2. Mobile number check (10 digits)
    const mobileValue = inputs.mobile.value.trim();
    if (!mobileValue) {
      errors.mobile.textContent = 'Mobile number is required.';
      inputs.mobile.classList.add('invalid');
      isValid = false;
    } else if (!/^\d{10}$/.test(mobileValue)) {
      errors.mobile.textContent = 'Please enter a valid 10-digit mobile number.';
      inputs.mobile.classList.add('invalid');
      isValid = false;
    }

    // 3. Email address check
    const emailValue = inputs.email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
      errors.email.textContent = 'Email address is required.';
      inputs.email.classList.add('invalid');
      isValid = false;
    } else if (!emailPattern.test(emailValue)) {
      errors.email.textContent = 'Please enter a valid email address.';
      inputs.email.classList.add('invalid');
      isValid = false;
    }

    // 4. Specialty check
    if (!inputs.specialty.value) {
      errors.specialty.textContent = 'Please select your medical specialty.';
      inputs.specialty.classList.add('invalid');
      isValid = false;
    }

    // 5. Clinic Name check
    if (!inputs.clinicName.value.trim()) {
      errors.clinicName.textContent = 'Clinic or Hospital name is required.';
      inputs.clinicName.classList.add('invalid');
      isValid = false;
    }

    return isValid;
  }

  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (validateForm()) {
        const formData = {
          name: inputs.fullName.value.trim(),
          mobile: inputs.mobile.value.trim(),
          email: inputs.email.value.trim(),
          specialty: inputs.specialty.value,
          clinicName: inputs.clinicName.value.trim(),
          timestamp: new Date().toISOString()
        };

        // Save registration data to localStorage (standard prototype db simulation)
        let registrations = JSON.parse(localStorage.getItem('webinar_registrations') || '[]');
        registrations.push(formData);
        localStorage.setItem('webinar_registrations', JSON.stringify(registrations));

        console.log('Registration details successfully captured:', formData);

        // Hide form and display success panel
        regForm.classList.add('hidden');
        successState.classList.remove('hidden');
      }
    });
  }

});
