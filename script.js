// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const themeIcon = darkModeToggle.querySelector('i');
    
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the saved theme
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Toggle theme on button click
    darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile nav when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
    
    // API Key for OpenWeatherMap (Note: Replace with your own API key)
    const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
    
    // Function to get weather data by coordinates
    window.getWeatherByCoords = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    };
    
    // Function to get weather data by city name
    window.getWeatherByCity = async (city) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    };
    
    // Function to get forecast data by coordinates
    window.getForecastByCoords = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching forecast data:', error);
            return null;
        }
    };
    
    // Function to get forecast data by city name
    window.getForecastByCity = async (city) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${API_KEY}`
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching forecast data:', error);
            return null;
        }
    };
    
    // Function to get user's current location
    window.getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lon: position.coords.longitude
                        });
                    },
                    (error) => {
                        reject(error);
                    }
                );
            }
        });
    };
    
    // Function to update UI with weather data
    window.updateWeatherUI = (data, elementId) => {
        if (!data || data.cod !== 200) {
            document.getElementById(elementId).innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Unable to fetch weather data. Please try again.</p>
                </div>
            `;
            return;
        }
        
        const { name, main, weather, wind } = data;
        const iconCode = weather[0].icon;
        
        document.getElementById(elementId).innerHTML = `
            <div class="weather-header">
                <h2>${name}</h2>
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weather[0].description}">
            </div>
            <div class="weather-main">
                <div class="temperature">${Math.round(main.temp)}°F</div>
                <div class="description">${weather[0].main}</div>
            </div>
            <div class="weather-details">
                <div class="detail">
                    <i class="fas fa-temperature-high"></i>
                    <span>Feels like: ${Math.round(main.feels_like)}°F</span>
                </div>
                <div class="detail">
                    <i class="fas fa-tint"></i>
                    <span>Humidity: ${main.humidity}%</span>
                </div>
                <div class="detail">
                    <i class="fas fa-wind"></i>
                    <span>Wind: ${Math.round(wind.speed)} mph</span>
                </div>
                <div class="detail">
                    <i class="fas fa-compress-arrows-alt"></i>
                    <span>Pressure: ${main.pressure} hPa</span>
                </div>
            </div>
        `;
    };
});