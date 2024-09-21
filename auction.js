const biddingsUl = document.querySelector('#biddings')
const biddingsUlOther = document.querySelector('#otherBiddings')
const yourBid = document.querySelector('.yourBids')
const otherBid = document.querySelector('.otherBids')
let yourBids = []
let otherBids = []

function initAuctionPage() {
    headerName.innerText = 'Auction';
    headerName.innerText = 'Auction';
    auctionIcon.classList.add('d-none');
    hamburgerMenu.classList.add('d-none');

    yourBid.innerHTML += ``

    const noAuctionElement = document.querySelector('.noAuctionInProgress');
    const auctionInnerElement = document.querySelector('.auctionInner')

    noAuctionElement.classList.add('d-none');
    auctionInnerElement.classList.remove('d-none');

    const activeAuction = items_LS.filter(item => item.isAuctioning)
    if (activeAuction.length === 0) {
        noAuctionElement.classList.remove('d-none');
        auctionInnerElement.classList.add('d-none');
    } else {
        startTimer();
    }

    const input = document.querySelector('.bidAmount');
    const bidBtn = document.querySelector('.bidBtn')
    const backBtn = document.querySelector('.back')

    // Auctioning Item
    const auctioningItemIndex = items_LS.findIndex(item => item.isAuctioning);

    if (auctioningItemIndex !== -1) {
        items_LS[auctioningItemIndex].isAuctioning = true;
        auctionImage.src = items_LS[auctioningItemIndex].image;
        auctionArtistName.innerText = items_LS[auctioningItemIndex].artist;
        auctionStartingPrice.innerText = Math.floor(items_LS[auctioningItemIndex].price / 2);
        auctionDescription.innerText = items_LS[auctioningItemIndex].description;

    }

    input.value = auctionStartingPrice.innerText

    // BackBtn
    backBtn.addEventListener('click', () => {
        if (localStorage.getItem('artistName')) {
            location.hash = '#artistsItemsPage'
        } else {
            location.hash = '#visitorListingPage'
            auctionIcon.classList.remove('d-none')
            headerName.innerText = 'StreetARTists'
            headerName.innerText = 'StreetARTists'
        }
    })

    if (localStorage.getItem('artistName')) {
        bidBtn.disabled = true;
        bidBtn.innerText = 'Disabled for artists'
        return
    } else {
        bidBtn.disabled = false;
        bidBtn.innerText = 'Place your bid'
    }

    // Bid button
    bidBtn.removeEventListener('click', bid)
    bidBtn.addEventListener('click', bid)

    function bid() {
        const bidAmount = input.value
        input.value = +bidAmount + 30
        yourBid.innerHTML += `<li class="bid"><i class="fa-solid fa-user m-1"></i>$${+bidAmount}</li>`
        otherBid.innerHTML += `<li class="otherBid">$${+bidAmount + 30}<i class="fa-solid fa-user m-1"></i></li>`
        yourBids.push(+bidAmount)
        otherBids.push(+bidAmount + 30)

        fetch('https://blooming-sierra-28258.herokuapp.com/bid', {
                method: 'POST',
                body: JSON.stringify({
                    amount: bidAmount
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
            .then(data => {
                if (!data.isBidding) {
                    countDownEl.innerHTML = `You won!!!`;
                } else {
                    otherBid.innerHTML += `<li class="otherBid">${data.bidAmount}<li class="bid"><i class="fa-solid fa-user m-1"></i></li>`
                    otherBids.push(+data.bidAmount)
                    input.value = +data.bidAmount + 30
                }
            })
        removeEventListener('click', bid)
    }
}

function startTimer() {
    // Set the initial time in seconds
    const auctioningItemIndex = items_LS.findIndex(item => item.isAuctioning);
    let time;

    if (+localStorage.getItem("time") > 0) {
        time = +localStorage.getItem("time");
    } else {
        time = 120;
        localStorage.setItem("time", time);
        time = +localStorage.getItem("time");
    }
    // Update the time in local storage and on the page every second
    const timerInterval = setInterval(() => {
        time -= 1;
        localStorage.setItem("time", time);

        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        const timeElement = document.getElementById("time");
        timeElement.innerText = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        timeElement.innerText = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

        // If the time reaches 0
        if (time === 0) {
            clearInterval(timerInterval);

            // if (!+yourBid.lastChild.innerText) {
            //     timeElement.innerText = `Auction failed!`;
            //     items_LS[auctioningItemIndex].isAuctioning = false;
            //     update_LS(items_LS);
            //     updateCards()
            //     return
            // }

            items_LS[auctioningItemIndex].dateSold = new Date().toJSON();
            if (+yourBids[+yourBids.length - 1] > +otherBids[otherBids.length - 1]) {
                items_LS[auctioningItemIndex].priceSold = +yourBids[yourBids.length - 1];
                timeElement.innerText = `You WON! Item sold for $${+yourBids[yourBids.length - 1]}`;
            } else {
                items_LS[auctioningItemIndex].priceSold = +otherBids[otherBids.length - 1];
                timeElement.innerText = `You lost! Item sold for $${+otherBids[otherBids.length - 1]}`
            }

            items_LS[auctioningItemIndex].isAuctioning = false;

            update_LS(items_LS);
            updateCards()
        }
    }, 1000);
}