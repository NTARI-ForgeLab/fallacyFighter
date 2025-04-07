(function() {
  // Configuration
  const config = {
    apiUrl: 'https://your-backend-api-url.com', // Will update this later
    embedUrl: 'https://your-username.github.io/fallacy-trainer', // Will update this later
    refreshInterval: 3600, // in seconds (1 hour)
    theme: 'light' // 'light' or 'dark'
  };
  
  // Create the iframe
  function createTrainer() {
    const container = document.getElementById('fallacy-trainer');
    if (!container) return;
    
    const iframe = document.createElement('iframe');
    iframe.src = `${config.embedUrl}?theme=${config.theme}&api=${encodeURIComponent(config.apiUrl)}`;
    iframe.title = 'Fallacy Trainer';
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    iframe.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    iframe.allow = 'clipboard-write';
    
    container.appendChild(iframe);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createTrainer);
  } else {
    createTrainer();
  }
  
  // Expose a global API
  window.FallacyTrainer = {
    refresh: function() {
      const iframe = document.querySelector('#fallacy-trainer iframe');
      if (iframe) {
        iframe.contentWindow.location.reload();
      }
    }
  };
})();
