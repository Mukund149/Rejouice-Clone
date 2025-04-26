function locoScroll() {
    gsap.registerPlugin(ScrollTrigger);

    if (window.locoScrollInstance) {
        window.locoScrollInstance.destroy();
    }

    const scrollContainer = document.querySelector("#main");
    window.locoScrollInstance = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true
    });

    window.locoScrollInstance.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(scrollContainer, {
        scrollTop(value) {
            return arguments.length
                ? window.locoScrollInstance.scrollTo(value, 0, 0)
                : window.locoScrollInstance.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        pinType: scrollContainer.style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.addEventListener("refresh", () => window.locoScrollInstance.update());
    ScrollTrigger.refresh();
}

function initScrollAnimations() {
    let trollMsg = document.querySelector(".troll-msg h1");
    if (!trollMsg) return;
    let scrollLength = trollMsg.offsetWidth - window.innerWidth;

    gsap.from(".troll-msg h1", {
        opacity: 0,
        duration: 5,
        ease: "none",
        scrollTrigger: {
            trigger: ".troll-msg",
            scroller: "#main",
            start: "top 0%",
            end: "top -50%",
            scrub: 0.2,
            markers: true
        }
    });

    gsap.to(".troll-msg h1", {
        x: () => `-${scrollLength}px`,
        ease: "none",
        scrollTrigger: {
            trigger: ".troll-page",
            scroller: "#main",
            start: "top top",
            end: () => `+=${scrollLength}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            markers: true
        }
    });
}

function cursorMovement() {
    var cursor = document.querySelector(".cursor");
    var main = document.querySelector("#main");

    main.addEventListener("mouseenter", function () {
        gsap.to(cursor, {
            opacity: 1,
            scale: 1,
            duration: 0.5
        });
    });
    main.addEventListener("mouseleave", function () {
        gsap.to(cursor, {
            opacity: 0,
            scale: 0,
            duration: 0.5
        });
    });
    window.addEventListener("mousemove", function (e) {
        gsap.to(cursor, {
            x: e.clientX - cursor.clientWidth / 2,
            y: e.clientY - cursor.clientHeight / 2,
            duration: 0.5,
            ease: "power1.out"
        });
    });
}

// YOUR ORIGINAL textMagnify FUNCTION — UNCHANGED
const lerp = (x, y, a) => x * (1 - a) + y * a;
function textMagnify(whereToScale, textToScale, cursorElement, displacementValue) {
    var frame = document.querySelector(whereToScale);
    var h1 = document.querySelectorAll(`${textToScale}`);
    h1.forEach(elem => {
        var clutter = "";
        var h1Text = elem.textContent;
        var splitText = h1Text.split("");
        splitText.forEach(element => {
            clutter += `<span>${element}</span>`;
        });
        elem.innerHTML = clutter;
    });

    frame.addEventListener("mousemove", function (dets) {
        var dims = frame.getBoundingClientRect();
        var xStart = dims.x;
        var xEnd = dims.x + dims.width;
        var zeroOne = gsap.utils.mapRange(xStart, xEnd, 0, 1, dets.clientX);

        gsap.to(cursorElement, {
            scale: 10
        });
        gsap.to(whereToScale, {
            x: lerp(-80, 80, zeroOne),
            duration: 0.3
        });
    });

    frame.addEventListener("mouseleave", function () {
        gsap.to(cursorElement, {
            scale: 1
        });
        gsap.to(whereToScale, {
            x: 0,
            ease: "elastic.out(1.2,0.3)",
            duration: 1
        });
        const magnify = document.querySelectorAll(`${textToScale} span`);
        magnify.forEach(span => {
            gsap.to(span, {
                margin: "0",
                y: 0,
                scale: 1,
                color: "black",
                ease: "expo.out"
            });
        });
    });

    const magnify = document.querySelectorAll(`${textToScale} span`);
    magnify.forEach((el, index) => {
        el.addEventListener("mousemove", function () {
            gsap.to(el, {
                margin: "0 10px",
                y: "-1.5vw",
                scale: 1.7,
                color: "white",
                duration: 0.5
            });
            if (magnify[index - 1]) {
                gsap.to(magnify[index - 1], {
                    margin: "0 10px",
                    y: "-0.7vw",
                    scale: 1.5,
                    color: "white",
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
            if (magnify[index + 1]) {
                gsap.to(magnify[index + 1], {
                    margin: "0 10px",
                    y: "-0.7vw",
                    scale: 1.5,
                    color: "white",
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });
        el.addEventListener("mouseleave", function () {
            gsap.to([magnify[index - 1], el, magnify[index + 1]], {
                margin: "0",
                y: 0,
                scale: 1,
                color: "black",
                ease: "expo.out"
            });
        });
    });
}

function animateHeadings() {
    gsap.from(".heading .headElem h1", {
        y: 120,
        duration: 1,
        stagger: 0.2
    });
}

// Initial load
window.addEventListener("load", () => {
    locoScroll();
    animateHeadings();
    cursorMovement();
    initScrollAnimations();
    textMagnify(".frame", ".frame a h1", document.querySelector(".cursor"), 20);
});

barba.init({
    transitions: [
        {
            name: 'default-transition',
            leave(data) {
                return gsap.to(data.current.container, {
                    opacity: 0,
                    duration: 1,
                    ease: "expo.out"
                });
            },
            enter(data) {
                return gsap.from(data.next.container, {
                    opacity: 0,
                    duration: 1,
                    ease: "expo.out",
                    onComplete: () => {
                        locoScroll();
                        animateHeadings();
                        cursorMovement();
                        initScrollAnimations();
                        textMagnify(".frame", ".frame a h1", document.querySelector(".cursor"), 20);
                    }
                });
            }
        }
    ]
});
