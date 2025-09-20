// Content Replacement Navigation
let currentSectionIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
let diffX = 0;

// Get all sections
const sections = document.querySelectorAll('.content-section');
const totalSections = sections.length;

// Section names for debugging
const sectionNames = ['Hero (Homepage)', 'Our Story', 'Gallery', 'Wedding Details', 'RSVP'];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Wedding website initialized');
    console.log('📱 Total sections found:', totalSections);
    console.log('📍 Section names:', sectionNames);
    
    // Check if mobile
    if (window.innerWidth <= 768) {
        initializeMobileSwipe();
    } else {
        initializeDesktopNavigation();
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            initializeMobileSwipe();
        } else {
            initializeDesktopNavigation();
        }
    });
    
    // Initialize first section as active
    updateSectionVisibility();
});

function initializeMobileSwipe() {
    console.log('📱 Initializing mobile content replacement swipe');
    
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        console.error('❌ Main content container not found');
        return;
    }
    
    // Add touch event listeners
    mainContent.addEventListener('touchstart', handleTouchStart, { passive: false });
    mainContent.addEventListener('touchmove', handleTouchMove, { passive: false });
    mainContent.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Add mouse events for testing on desktop
    mainContent.addEventListener('mousedown', handleMouseDown);
    mainContent.addEventListener('mousemove', handleMouseMove);
    mainContent.addEventListener('mouseup', handleMouseUp);
    
    console.log('✅ Mobile content replacement swipe initialized');
}

function initializeDesktopNavigation() {
    console.log('🖥️ Initializing desktop vertical navigation');
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            navigateSection(1);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            navigateSection(-1);
        }
    });
    
    console.log('✅ Desktop vertical navigation initialized');
}

function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
    diffX = 0;
    console.log('👆 Touch start at:', startX);
}

function handleTouchMove(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    currentX = e.touches[0].clientX;
    diffX = startX - currentX;
    
    console.log('👆 Touch move - diffX:', diffX);
}

function handleTouchEnd(e) {
    if (!isDragging) return;
    
    isDragging = false;
    console.log('👆 Touch end - diffX:', diffX);
    
    // Determine if we should change sections
    const threshold = window.innerWidth * 0.3; // 30% of screen width
    
    if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
            // Swiped left - go to next section
            if (currentSectionIndex < totalSections - 1) {
                currentSectionIndex++;
                console.log('➡️ Moving to next section:', currentSectionIndex);
                updateSectionVisibility();
            }
        } else {
            // Swiped right - go to previous section
            if (currentSectionIndex > 0) {
                currentSectionIndex--;
                console.log('⬅️ Moving to previous section:', currentSectionIndex);
                updateSectionVisibility();
            }
        }
    }
}

function handleMouseDown(e) {
    startX = e.clientX;
    isDragging = true;
    diffX = 0;
    console.log('🖱️ Mouse down at:', startX);
}

function handleMouseMove(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    currentX = e.clientX;
    diffX = startX - currentX;
    
    console.log('🖱️ Mouse move - diffX:', diffX);
}

function handleMouseUp(e) {
    if (!isDragging) return;
    
    isDragging = false;
    console.log('🖱️ Mouse up - diffX:', diffX);
    
    // Determine if we should change sections
    const threshold = window.innerWidth * 0.3; // 30% of screen width
    
    if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
            // Swiped left - go to next section
            if (currentSectionIndex < totalSections - 1) {
                currentSectionIndex++;
                console.log('➡️ Moving to next section:', currentSectionIndex);
                updateSectionVisibility();
            }
        } else {
            // Swiped right - go to previous section
            if (currentSectionIndex > 0) {
                currentSectionIndex--;
                console.log('⬅️ Moving to previous section:', currentSectionIndex);
                updateSectionVisibility();
            }
        }
    }
}

function updateSectionVisibility() {
    // Remove all active classes
    sections.forEach(section => {
        section.classList.remove('active', 'prev', 'next');
    });
    
    // Add active class to current section
    if (sections[currentSectionIndex]) {
        sections[currentSectionIndex].classList.add('active');
    }
    
    // Add prev class to previous section
    if (currentSectionIndex > 0 && sections[currentSectionIndex - 1]) {
        sections[currentSectionIndex - 1].classList.add('prev');
    }
    
    // Add next class to next section
    if (currentSectionIndex < totalSections - 1 && sections[currentSectionIndex + 1]) {
        sections[currentSectionIndex + 1].classList.add('next');
    }
    
    console.log(`📍 Currently viewing: ${sectionNames[currentSectionIndex] || 'Unknown'} (Index: ${currentSectionIndex})`);
    
    // Update desktop navigation buttons
    updateDesktopNavButtons();
}

// Desktop Navigation Functions
function navigateSection(direction) {
    if (window.innerWidth <= 768) {
        // Mobile - use swipe logic
        if (direction > 0 && currentSectionIndex < totalSections - 1) {
            currentSectionIndex++;
            updateSectionVisibility();
        } else if (direction < 0 && currentSectionIndex > 0) {
            currentSectionIndex--;
            updateSectionVisibility();
        }
        return;
    }
    
    // Desktop - use vertical navigation
    const newSection = currentSectionIndex + direction;
    
    // Check boundaries
    if (newSection < 0 || newSection >= totalSections) {
        console.log('🚫 Navigation boundary reached');
        return;
    }
    
    currentSectionIndex = newSection;
    console.log('🖥️ Desktop navigation to section:', currentSectionIndex);
    
    updateSectionVisibility();
}

function updateDesktopNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const upArrow = document.querySelector('.desktop-nav-up');
    
    if (!prevBtn || !nextBtn) return;
    
    // Update previous button (up arrow)
    if (currentSectionIndex <= 0) {
        // Hide up arrow completely on hero section (index 0)
        prevBtn.disabled = true;
        prevBtn.style.opacity = '0';
        if (upArrow) {
            upArrow.style.display = 'none';
        }
    } else {
        // Show up arrow on all other sections
        prevBtn.disabled = false;
        prevBtn.style.opacity = '1';
        if (upArrow) {
            upArrow.style.display = 'block';
        }
    }
    
    // Update next button (down arrow)
    if (currentSectionIndex >= totalSections - 1) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.3';
    } else {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
    }
    
    console.log('🖥️ Desktop nav buttons updated - currentSectionIndex:', currentSectionIndex);
    console.log('⬆️ Up arrow visible:', currentSectionIndex > 0);
}

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const rsvpForm = document.querySelector('.rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your RSVP! We look forward to celebrating with you.');
        });
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Add some fun interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to detail cards
    const detailCards = document.querySelectorAll('.detail-card');
    detailCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'translateY(0) scale(1)';
            }, 200);
        });
    });
});

console.log('🎉 Wedding website script loaded successfully!');
