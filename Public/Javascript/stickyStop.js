document.addEventListener("DOMContentLoaded", () => {



    function handleScroll() {
        const stickyBox = document.querySelector('.trip-confirmation-details');
        const container = document.querySelector('.page-footer');
      
    
      console.log("scroll " + window.scrollY)


        const containerTop = container.getBoundingClientRect().top ;
        const containerHeight = container.offsetHeight;
        const containerBottom = containerTop;
      
        console.log("container" + containerBottom)
        // Check if sticky box should stop
        if (window.scrollY + stickyHeight + 20 >= containerBottom) {
    
          stickyBox.style.position = 'absolute';
          stickyBox.style.top = (containerBottom - stickyTop - stickyHeight) + 'px';
        } else {
          stickyBox.style.position = 'sticky';
          stickyBox.style.top = '20px'; // or whatever offset you want
        }
      }
      
  
    window.addEventListener("scroll", handleScroll);
  });
  