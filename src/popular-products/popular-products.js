/* Popular Products - 3D Tilt Effect */
/* =================================== */

export function initPopularProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    let activeContainer = null;
    
    // Click handler for info buttons
    productsGrid.addEventListener('click', function(e) {
        const button = e.target.closest('.info-button');
        if (!button) return;
        
        e.preventDefault();
        button.style.transform = "scale(0.95)";
        setTimeout(() => button.style.transform = "scale(1)", 150);
        
        button.textContent = "در حال هدایت...";
        button.style.background = "#10b981";
        
        // Get product name and redirect
        const productBox = button.closest('.product-box');
        const productName = productBox?.dataset.product || '';
        console.log(`Redirecting to: ${productName}`);
        
        // Redirect to services page after short delay
        setTimeout(() => {
            window.location.href = '/services.html';
        }, 500);
    });
    
    // 3D Tilt effect on mouse move
    productsGrid.addEventListener('mousemove', function(e) {
        const container = e.target.closest('.product-container');
        if (!container) {
            if (activeContainer) {
                activeContainer.style.transform = 'translateY(0) scale(1)';
                activeContainer = null;
            }
            return;
        }
        
        activeContainer = container;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 8;
        const rotateX = ((centerY - y) / centerY) * 8;
        
        container.style.transform = `translateY(-25px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    // Reset transform on mouse leave
    productsGrid.addEventListener('mouseleave', function() {
        if (activeContainer) {
            activeContainer.style.transform = 'translateY(0) scale(1)';
            activeContainer = null;
        }
    }, true);
    
    // Reset individual containers
    const containers = productsGrid.querySelectorAll('.product-container');
    containers.forEach(container => {
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPopularProducts);
} else {
    initPopularProducts();
}
