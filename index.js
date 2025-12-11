// DOM Elements
const themeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const navLinks = document.querySelectorAll('.nav-link');
const pageSections = document.querySelectorAll('.page-section');
const toggleText = document.querySelector('.toggle-text');

// Theme Toggle Functionality
themeToggle.addEventListener('change', function() {
    if (this.checked) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        toggleText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        toggleText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    themeToggle.checked = true;
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    toggleText.textContent = 'Light Mode';
} else {
    themeToggle.checked = false;
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    toggleText.textContent = 'Dark Mode';
}

// Navigation and Section Switching
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the target page from data attribute
        const targetPage = this.getAttribute('data-page');
        
        // Update active nav link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        this.classList.add('active');
        
        // Hide all sections
        pageSections.forEach(section => {
            section.classList.remove('active-section');
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
        });
        
        // Show target section with animation
        const targetSection = document.getElementById(targetPage);
        if (targetSection) {
            setTimeout(() => {
                targetSection.classList.add('active-section');
                setTimeout(() => {
                    targetSection.style.opacity = '1';
                    targetSection.style.transform = 'translateY(0)';
                }, 50);
            }, 300);
            
            // Update URL hash without scrolling
            history.pushState(null, null, `#${targetPage}`);
        }
        
        // Mobile: close menu if open
        if (window.innerWidth < 768) {
            // Add mobile menu close functionality here if needed
        }
    });
});

// Highlight current section based on scroll position
window.addEventListener('scroll', function() {
    let current = '';
    const scrollPos = window.scrollY + 100;
    
    pageSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === current) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') !== '#') {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // In a real application, you would send this data to a server
        // For demo purposes, we'll just show an alert
        alert(`Thank you, ${name}! Your message has been sent. I'll get back to you soon at ${email}.`);
        
        // Reset form
        this.reset();
    });
}

// Animate skill bars when they come into view
const skillBars = document.querySelectorAll('.skill-level');
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBar = entry.target;
            const width = skillBar.style.width;
            skillBar.style.width = '0';
            
            setTimeout(() => {
                skillBar.style.transition = 'width 1.5s ease';
                skillBar.style.width = width;
            }, 300);
            
            // Stop observing after animation
            observer.unobserve(skillBar);
        }
    });
}, observerOptions);

skillBars.forEach(bar => observer.observe(bar));

// Add hover effect to project cards with delay
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transitionDelay = '0s';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transitionDelay = '0.1s';
    });
});

// Initialize with home section active
window.addEventListener('DOMContentLoaded', function() {
    // Check URL hash on page load
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetLink = document.querySelector(`.nav-link[data-page="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
    
    // Animate hero content on load
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDesc = document.querySelector('.hero-desc');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle && heroSubtitle && heroDesc && heroButtons) {
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
        
        setTimeout(() => {
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 600);
        
        setTimeout(() => {
            heroDesc.style.opacity = '1';
            heroDesc.style.transform = 'translateY(0)';
        }, 900);
        
        setTimeout(() => {
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }, 1200);
    }
});
// GitHub API Integration for Projects
async function loadGitHubProjects() {
    const projectsContainer = document.getElementById('projects-container');
    const loadingElement = document.getElementById('loading-projects');
    
    try {
        // GitHub API call for repositories
        const response = await fetch('https://api.github.com/users/mishi-del/repos?sort=updated&per_page=12');
        const repos = await response.json();
        
        // Clear loading state
        loadingElement.style.display = 'none';
        
        // Process and display repositories
        repos.forEach((repo, index) => {
            if (!repo.fork && repo.name !== '.github') {
                setTimeout(() => {
                    createProjectCard(repo, index);
                }, index * 100);
            }
        });
        
        // Initialize filter functionality
        initProjectFilter();
        
    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        loadingElement.innerHTML = '<p>Error loading projects. Please check your connection.</p>';
        
        // Fallback to static projects
        createFallbackProjects();
    }
}

function createProjectCard(repo, delayIndex) {
    const projectsContainer = document.getElementById('projects-container');
    
    // Determine project category based on description or language
    let category = 'other';
    const repoName = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    const language = (repo.language || '').toLowerCase();
    
    if (repoName.includes('web') || repoName.includes('site') || description.includes('website') || description.includes('web')) {
        category = 'web';
    } else if (language === 'javascript' || repoName.includes('js') || repoName.includes('game')) {
        category = 'js';
    } else if (description.includes('design') || description.includes('ui') || description.includes('ux')) {
        category = 'design';
    }
    
    // Get project image based on repository
    const projectImage = getProjectImage(repo.name);
    
    // Create project card
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.setAttribute('data-category', category);
    projectCard.style.animationDelay = `${delayIndex * 0.1}s`;
    
    projectCard.innerHTML = `
        <div class="project-img">
            <img src="${projectImage}" alt="${repo.name}" onerror="this.src='https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'">
            <div class="project-tech">${repo.language || 'Web'}</div>
            <div class="project-overlay">
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" class="project-link github">
                        <i class="fab fa-github"></i>
                        <span>Code</span>
                    </a>
                    ${getLiveDemoLink(repo)}
                </div>
            </div>
        </div>
        <div class="project-info">
            <div class="project-header">
                <h3>${formatProjectName(repo.name)}</h3>
                <span class="project-year">${new Date(repo.updated_at).getFullYear()}</span>
            </div>
            <p>${repo.description || 'A web development project showcasing modern technologies.'}</p>
            <div class="project-stats">
                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                <span><i class="fas fa-circle"></i> ${repo.size} KB</span>
            </div>
        </div>
    `;
    
    projectsContainer.appendChild(projectCard);
}

function getProjectImage(repoName) {
    // Map repository names to appropriate images
    const imageMap = {
        'AquaVerse': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'weather-card': 'https://images.unsplash.com/photo-1592210454359-9043f067919b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'Alibaba-Inspired-E-Commerce-Website': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w-800&q=80',
        'Customize-Responsive-website': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'todo-list': 'https://images.unsplash.com/photo-1551376347-075b0121a65b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'guess-game': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'quiz-game': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'travel-agency': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    };
    
    return imageMap[repoName] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
}

function getLiveDemoLink(repo) {
    // Check if repository has GitHub Pages enabled or provide demo link
    const demoLinks = {
        'AquaVerse': 'https://mishi-del.github.io/AquaVerse',
        'weather-card': 'https://mishi-del.github.io/weather-card',
        'Customize-Responsive-website': 'https://mishi-del.github.io/Customize-Responsive-website',
        'todo-list': 'https://mishi-del.github.io/todo-list',
        'Alibaba-Inspired-E-Commerce-Website': 'https://mishi-del.github.io/Alibaba-Inspired-E-Commerce-Website'
    };
    
    if (demoLinks[repo.name]) {
        return `<a href="${demoLinks[repo.name]}" target="_blank" class="project-link">
            <i class="fas fa-external-link-alt"></i>
            <span>Live Demo</span>
        </a>`;
    }
    
    // Check if it's a web project that might have a demo
    if (repo.has_pages) {
        return `<a href="https://${repo.owner.login}.github.io/${repo.name}" target="_blank" class="project-link">
            <i class="fas fa-external-link-alt"></i>
            <span>Live Demo</span>
        </a>`;
    }
    
    return '';
}

function formatProjectName(name) {
    return name
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Typewriter Effect
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter-text');
    const roles = ['Web Developer', 'Student', 'JavaScript Lover', 'UI Designer', 'Problem Solver'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = 100;
        
        if (isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 1000);
}

// Particle Animation
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            color: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.3 + 0.1})`
        });
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.y > canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = canvas.height;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Draw connections
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(100, 100, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Counter Animation for Stats
function initCounters() {
    const counters = document.querySelectorAll('.stat[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 16);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        // Start counter when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Enhanced Dark/Light Mode Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const toggleText = document.querySelector('.toggle-text');
    
    // Check saved preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        toggleText.textContent = 'Light Mode';
    }
    
    // Toggle with animation
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            toggleText.textContent = 'Light Mode';
            localStorage.setItem('portfolio-theme', 'dark');
            
            // Add transition effect
            body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            toggleText.textContent = 'Dark Mode';
            localStorage.setItem('portfolio-theme', 'light');
        }
    });
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initTypewriter();
    initParticles();
    initCounters();
    loadGitHubProjects();
    
    // Add smooth scroll to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});