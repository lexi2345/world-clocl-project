const DEFAULT_TIMEZONES = [
  'America/New_York',
  'Europe/London', 
  'Asia/Tokyo'
];

const CITY_NAMES = {
  'America/New_York': 'New York',
  'America/Los_Angeles': 'Los Angeles',
  'America/Chicago': 'Chicago',
  'America/Denver': 'Denver',
  'America/Toronto': 'Toronto',
  'America/Mexico_City': 'Mexico City',
  'America/Sao_Paulo': 'São Paulo',
  'Europe/London': 'London',
  'Europe/Paris': 'Paris',
  'Europe/Berlin': 'Berlin',
  'Europe/Rome': 'Rome',
  'Europe/Madrid': 'Madrid',
  'Europe/Moscow': 'Moscow',
  'Asia/Dubai': 'Dubai',
  'Asia/Tokyo': 'Tokyo',
  'Asia/Shanghai': 'Shanghai',
  'Asia/Hong_Kong': 'Hong Kong',
  'Asia/Singapore': 'Singapore',
  'Asia/Seoul': 'Seoul',
  'Asia/Mumbai': 'Mumbai',
  'Asia/Bangkok': 'Bangkok',
  'Australia/Sydney': 'Sydney',
  'Pacific/Auckland': 'Auckland',
  'Africa/Cairo': 'Cairo',
  'Africa/Johannesburg': 'Johannesburg'
};

const FUN_FACTS = [
  "The International Date Line isn't straight! It zigzags around countries and islands.",
  "China uses only one time zone for the entire country, even though it spans 5 geographical zones!",
  "Russia has 11 time zones - the most of any country in the world.",
  "Some places like Nepal and India use half-hour or 45-minute offsets instead of full hours.",
  "The concept of time zones was invented by railroad companies to make train schedules work!",
  "At midnight in one time zone, it could be tomorrow in another - time travel is real! 🚀",
  "Arizona doesn't observe Daylight Saving Time, except in the Navajo Nation.",
  "The world's first time zone conference was held in 1884 in Washington D.C.",
  "France has the most time zones (12) if you count overseas territories!",
  "Some islands in the Pacific are 25 hours apart despite being only a few miles away!"
];

// ===== STATE =====
let selectedTimezones = [...DEFAULT_TIMEZONES];
let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let userLocationDetected = false;

// ===== THEME TOGGLE =====
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });
}

// ===== PARTICLES =====
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 4 + 2;
      const startX = Math.random() * window.innerWidth;
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${startX}px`;
      particle.style.background = Math.random() > 0.5 
        ? 'rgba(255, 20, 147, 0.6)' 
        : 'rgba(147, 112, 219, 0.6)';
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      
      particlesContainer.appendChild(particle);
      
      // Remove and recreate particle after animation
      setTimeout(() => {
        particle.remove();
      }, (duration + delay) * 1000);
    }, i * 100);
  }

  // Continuously create new particles
  setInterval(() => {
    if (particlesContainer.children.length < particleCount) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 4 + 2;
      const startX = Math.random() * window.innerWidth;
      const duration = Math.random() * 10 + 10;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${startX}px`;
      particle.style.background = Math.random() > 0.5 
        ? 'rgba(255, 20, 147, 0.6)' 
        : 'rgba(147, 112, 219, 0.6)';
      particle.style.animationDuration = `${duration}s`;
      
      particlesContainer.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    }
  }, 2000);
}

// ===== UPDATE CLOCKS =====
function updateClock(timezone, index) {
  try {
    const now = new Date();
    
    // Get time in specific timezone
    const timeString = now.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const dateString = now.toLocaleDateString('en-US', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Get UTC offset
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    const parts = formatter.formatToParts(now);
    const tzAbbr = parts.find(part => part.type === 'timeZoneName')?.value || '';
    
    // Calculate UTC offset
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const offset = (tzDate - utcDate) / (1000 * 60 * 60);
    const offsetString = offset >= 0 ? `UTC+${offset}` : `UTC${offset}`;
    
    // Update digital display
    const timeElement = document.querySelector(`[data-time="${index}"]`);
    const dateElement = document.querySelector(`[data-date="${index}"]`);
    const tzElement = document.querySelector(`[data-tz="${index}"]`);
    const cityElement = document.querySelector(`[data-city="${index}"]`);
    
    if (timeElement) timeElement.textContent = timeString;
    if (dateElement) dateElement.textContent = dateString;
    if (tzElement) tzElement.textContent = `${tzAbbr} (${offsetString})`;
    if (cityElement) cityElement.textContent = CITY_NAMES[timezone] || timezone;
    
    // Update analog clock hands
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    updateClockHands(hours, minutes, seconds, index);
    
  } catch (error) {
    console.error(`Error updating clock ${index}:`, error);
  }
}

function updateClockHands(hours, minutes, seconds, index) {
  const hourHand = document.querySelector(`[data-hand="hour-${index}"]`);
  const minuteHand = document.querySelector(`[data-hand="minute-${index}"]`);
  const secondHand = document.querySelector(`[data-hand="second-${index}"]`);
  
  if (hourHand && minuteHand && secondHand) {
    const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
    const minuteDegrees = minutes * 6;
    const secondDegrees = seconds * 6;
    
    hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
    secondHand.style.transform = `rotate(${secondDegrees}deg)`;
  }
}

// ===== USER'S CURRENT LOCATION =====
function updateUserLocation() {
  try {
    const now = new Date();
    
    // Get user's local time
    const timeString = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const dateString = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Update display
    document.getElementById('yourTime').textContent = timeString;
    document.getElementById('yourDate').textContent = dateString;
    
    if (userLocationDetected) {
      document.getElementById('yourCityName').textContent = CITY_NAMES[userTimezone] || userTimezone;
      document.getElementById('yourTimezone').textContent = userTimezone;
    } else {
      document.getElementById('yourCityName').textContent = 'Your Location';
      document.getElementById('yourTimezone').textContent = 'Click "Detect My Location"';
    }
    
    // Update analog clock
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const hourHand = document.getElementById('yourHourHand');
    const minuteHand = document.getElementById('yourMinuteHand');
    const secondHand = document.getElementById('yourSecondHand');
    
    if (hourHand && minuteHand && secondHand) {
      const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
      const minuteDegrees = minutes * 6;
      const secondDegrees = seconds * 6;
      
      hourHand.style.transform = `rotate(${hourDegrees}deg)`;
      minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
      secondHand.style.transform = `rotate(${secondDegrees}deg)`;
    }
  } catch (error) {
    console.error('Error updating user location:', error);
  }
}

function detectUserLocation() {
  userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  userLocationDetected = true;
  updateUserLocation();
  showToast(`Location detected: ${CITY_NAMES[userTimezone] || userTimezone}`);
}

// ===== TIMEZONE SELECTORS =====
function initTimezoneSelectors() {
  const selectors = document.querySelectorAll('.location-select');
  
  selectors.forEach((select, index) => {
    select.addEventListener('change', (e) => {
      const newTimezone = e.target.value;
      selectedTimezones[index] = newTimezone;
      updateClock(newTimezone, index);
      showToast(`Changed to ${CITY_NAMES[newTimezone] || newTimezone}`);
    });
  });
}

// ===== FUN FACTS =====
function showRandomFact() {
  const factElement = document.getElementById('funFact');
  const randomFact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
  if (factElement) {
    factElement.textContent = randomFact;
  }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ===== SMOOTH SCROLL ANIMATION =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.location-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

// ===== UPDATE ALL CLOCKS =====
function updateAllClocks() {
  // Update world clocks
  selectedTimezones.forEach((timezone, index) => {
    updateClock(timezone, index);
  });
  
  // Update user's location
  updateUserLocation();
}

// ===== INITIALIZATION =====
function init() {
  console.log('🌍 World Clock Initialized!');
  
  // Initialize theme
  initTheme();
  
  // Create particle effects
  createParticles();
  
  // Initialize timezone selectors
  initTimezoneSelectors();
  
  // Show random fun fact
  showRandomFact();
  
  // Change fun fact every 30 seconds
  setInterval(showRandomFact, 30000);
  
  // Detect location button
  const detectBtn = document.getElementById('detectLocation');
  if (detectBtn) {
    detectBtn.addEventListener('click', detectUserLocation);
  }
  
  // Update all clocks immediately
  updateAllClocks();
  
  // Update clocks every second
  setInterval(updateAllClocks, 1000);
  
  // Initialize navbar scroll effect
  initNavbarScroll();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Show welcome toast
  setTimeout(() => {
    showToast('Welcome to World Clock! 🌍');
  }, 500);
}

// ===== START APPLICATION =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ===== EXPORT FOR DEBUGGING =====
window.WorldClock = {
  updateClock,
  updateAllClocks,
  detectUserLocation,
  selectedTimezones,
  userTimezone
};