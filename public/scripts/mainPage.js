window.onload = function () {

    // set style for slider
    function setWidth() {
        let navWidth = document.querySelector('nav').offsetWidth;

        // set style for bestFilm
        let bestFilm = document.getElementById('bestFilm');
        bestFilm.style.width = navWidth + 'px';

        const someWidth1 = navWidth * 0.9 + 'px';
        // set style for frame width = (90% of width bestFilm)
        let frame = document.getElementsByClassName('frame');
        // console.log(frame);
        frame[0].style.width = someWidth1;

        // set style for images in slider
        const someWidth2 = frame[0].offsetWidth * 0.19 + 'px';
        // console.log(someWidth2);
        let slide = document.querySelectorAll('.js_slide');
        // console.log(slide);
        for(let i = 0; i < slide.length; i++) {
            slide[i].style.width = someWidth2;
        }
    }
    setWidth();

    // animate slider
    let slidesToScroll = 5;
    let slider = document.querySelector('.js_slider');
    let slideCount = slider.querySelectorAll('.js_slide').length / slidesToScroll;
    let dotContainer = slider.querySelector('.slider_navigation_dots');
    let templateListItem = document.createElement('li');

    // http://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
    let stop = false;
    let frameCount = 0;
    let fps, fpsInterval, startTime, now, then, elapsed;

    // handle the slider events
    function handleEvents(e) {
        if (e.type === 'before.lory.init') {
            for (let i = 0, len = slideCount; i < len; i++) {
                let clone = templateListItem.cloneNode();
                dotContainer.appendChild(clone);
            }
            dotContainer.childNodes[0].classList.add('active');
        }
        if (e.type === 'after.lory.init') {
            for (let i = 0, len = slideCount; i < len; i++) {
                dotContainer.childNodes[i].addEventListener('click', function(e) {
                    resetTimer();
                    lorySlider.slideTo(Array.prototype.indexOf.call(dotContainer.childNodes, e.target) * slidesToScroll);
                });
            }
        }
        if (e.type === 'after.lory.slide') {
            for (let i = 0, len = dotContainer.childNodes.length; i < len; i++) {
                dotContainer.childNodes[i].classList.remove('active');
            }
            dotContainer.childNodes[(e.detail.currentSlide / slidesToScroll) - 1].classList.add('active');
        }
    }

    // init events to handle
    slider.addEventListener('before.lory.init', handleEvents);
    slider.addEventListener('after.lory.init', handleEvents);
    slider.addEventListener('after.lory.slide', handleEvents);

    // init the slider
    let lorySlider = lory(slider, {
        infinite: slidesToScroll,
        slidesToScroll: slidesToScroll,
        enableMouseEvents: true
    });

    // begin animation (autoplay)
    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        animate();
    }

    // animate (autoplay)
    function animate() {
        requestAnimationFrame(animate);

        now = Date.now();
        elapsed = now - then;

        if (elapsed > fpsInterval && !stop) {
            then = now - (elapsed % fpsInterval);
            lorySlider.next();
        }
    }

    // reset timer
    function resetTimer() {
        now = Date.now();
        elapsed = now - then;
        then = now - (elapsed % fpsInterval);
    }

    // start the animation process with seed time
    startAnimating(.2); // every five seconds

    // mouseover
    slider.addEventListener('mouseover', function(e) {
        stop = true;
    });

    // mouseout
    slider.addEventListener('mouseout', function(e) {
        resetTimer();
        stop = false;
    });

    // add EventListener on slider for redirect to some movies
    const sliders = document.getElementsByClassName('js_slide');

    for (let i = 0; i < sliders.length; ++i) {
        sliders[i].addEventListener('click', (e) => {
            let movieId = e.target.parentElement.id;
            console.log(movieId);

            window.location.href = `movie/page/${movieId}`;
        });
    }

    window.addEventListener('resize', function () {
        // console.log('resize');
        setWidth();
    });
};