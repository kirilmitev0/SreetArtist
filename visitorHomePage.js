function initVisitorHomePage() {

    auctionIcon.classList.remove('d-none')
    hamburgerMenu.classList.add('d-none');

    const movingImages = document.querySelectorAll('.slide-img');
    movingImages.forEach((ev) => {
        ev.addEventListener('click', () => {
            location.hash = '#visitorListingPage';
        })
    })
}

const imagesToRender = items.filter(images => images.id > 3 && images.id < 12)
imagesToRender.forEach(image => {
    upperSlide = document.querySelector('.upper-slide');
    lowerSlide = document.querySelector('.lower-slide');

    if (image.id < 8) {
        upperSlide.innerHTML += `
                <div class="slide-img">
                  <img src="${image.image}" alt="${image.title}" />
                </div>
            `
    } else {
        lowerSlide.innerHTML += `
                <div class="slide-img">
                  <img src="${image.image}" alt="${image.title}" />
                </div>
            `
    }
})

findArtBtn = document.querySelector('.find-art-btn');
findArtBtn.addEventListener('click', () => {
    location.hash = '#visitorListingPage'
})