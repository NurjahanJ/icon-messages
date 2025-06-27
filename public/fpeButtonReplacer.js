// Script to replace the FPE button icon with the logo image
document.addEventListener('DOMContentLoaded', function() {
  // Function to replace the FPE button icon
  function replaceFPEButtonIcon() {
    // Find the button with the FPE icon
    const buttons = document.querySelectorAll('button.flex.items-center.gap-3.rounded-md.px-3.py-2.text-sm');
    
    buttons.forEach(button => {
      const svgElement = button.querySelector('svg circle[cx="16"][cy="16"][r="16"]');
      if (svgElement) {
        // This is the FPE button
        const container = button.querySelector('.w-8.h-8') || button.firstElementChild;
        
        // Create a new image element
        const imgElement = document.createElement('img');
        imgElement.src = '/images/logo.png';
        imgElement.alt = 'Logo';
        imgElement.width = 32;
        imgElement.height = 32;
        
        // Replace the SVG with the image
        if (container) {
          // Clear the container and add the image
          container.innerHTML = '';
          container.appendChild(imgElement);
        }
      }
    });
  }
  
  // Initial replacement
  replaceFPEButtonIcon();
  
  // Set up a MutationObserver to handle dynamically loaded content
  const observer = new MutationObserver(function(mutations) {
    replaceFPEButtonIcon();
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
});
