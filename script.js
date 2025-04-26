function locoScroll() {
    gsap.registerPlugin(ScrollTrigger);

    // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true
    });
    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);

    // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        }, // we don't have to define a scrollLeft because we're only scrolling vertically.
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
        pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
    });

    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();
}

function resetScroll() {
    // Reinitialize Locomotive Scroll and ScrollTrigger on page transition
    locoScroll();
    ScrollTrigger.refresh();
}

locoScroll()

const page = document.querySelector(".video-page");
const mainVideo = document.querySelector(".video-page .mainvideo")
const cursor = document.querySelector(".play-reel");
const reel = document.querySelector(".open-reel");
const reelVideo = document.querySelector(".open-reel video")

function cursorEffect() {
    page.addEventListener("mousemove", function (e) {
        const rect = page.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(cursor, {
            x: x,
            y: y,
            ease: "power1.out",
            duration: 0.5
        });
    });

    // Rest remains the same
    page.addEventListener("mouseenter", function () {
        gsap.to(cursor, {
            opacity: 1,
            duration: 0.2
        });
    });

    page.addEventListener("mouseleave", function () {
        gsap.to(cursor, {
            opacity: 0,
            duration: 0.2
        });
    });

}
cursorEffect()

function videoAnimation() {
    let isAnimating = false
    mainVideo.addEventListener("click", function () {
        if (isAnimating === false) {
            isAnimating = true
            gsap.to(cursor, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    cursor.innerHTML = "<h3>Close Reel</h3>"
                    gsap.to(cursor, {
                        opacity: 1,
                        duration: 0.1
                    })
                }
            })
            gsap.fromTo(reel, {
                rotate: -45,
                scale: 0.001,
                transformOrigin: "50% 50%",
                zIndex: 0
                // opacity:0

            }, {
                rotate: 0,
                scale: 1,
                duration: 1.5,
                // opacity:1,
                ease: "power4.out",
                onStart: () => {
                    reel.style.pointerEvents = "all";
                    reel.style.zIndex = 4;
                },
                onComplete: () => {
                    isAnimating = false
                }
            })
        }

    })
    reel.addEventListener("click", function () {
        if (isAnimating === false) {

            gsap.to(cursor, {
                opacity: 0,
                duration: 0.1,
                onComplete: () => {
                    cursor.innerHTML = "<h3>Play Reel</h3>"
                    gsap.to(cursor, {
                        opacity: 1,
                        duration: 0.1
                    })
                }
            })
            gsap.fromTo(reel, {
                rotate: 0,
                scale: 1,
                duration: 1,
                transformOrigin: "50% 50%",
                zIndex: 4,

            }, {
                rotate: 45,
                scale: 0,
                duration: 1.5,
                // opacity:0,
                ease: "power4.in",
                onComplete: () => {
                    reel.style.pointerEvents = "none";
                    isAnimating = false
                    reel.style.zIndex = 0
                }
            })

        }
    })

}
videoAnimation()





gsap.from(".elem h1", {
    y: 120,
    duration: 1,
    stagger: 0.05,
    scrollTrigger: {
        trigger: ".top-elem h1",
        scroller: "#main",
        ease: "expo.out"
        // markers:true
    }
})
gsap.from(".line", {
    y: 120,
    duration: 0.5,
    stagger: 0.1,
    scrollTrigger: {
        trigger: ".line",
        scroller: "#main",
        // markers:true
    }
})



// line animation (same as before)
function lineAnimation() {

    var lines = document.querySelectorAll(".line")
    var service = document.querySelector(".service")
    service.addEventListener("mouseenter", function () {
        console.log('working');
        gsap.to(lines[0], {
            x: "100%",
            stagger: 0.2,
            ease: "power2.out"
        })

        gsap.to(lines[1], {
            x: "100%",
            duration: 1,
            ease: "power2.out",
            delay: 0.0005
        })
    })
    service.addEventListener("mouseleave", function () {
        console.log('working');
        gsap.to(lines[1], {
            x: "-100%",
            stagger: 0.2,
            ease: "power2.out"
        })

        gsap.to(lines[0], {
            x: "0",
            duration: 1,
            ease: "power2.out",
            delay: 0.0005
        })
    })

}

lineAnimation()

function floatingVidAnimation(videoParent, videoTobeScaled, imageBehind) {

    var video = document.querySelector(videoParent)
    var floatingVid = document.querySelector(videoTobeScaled)
    video.addEventListener("mousemove", function (dets) {
        const rect = video.getBoundingClientRect()

        let x = dets.clientX - rect.left - floatingVid.clientWidth / 2
        let y = dets.clientY - rect.top - floatingVid.clientHeight / 2

        const maxX = rect.width - floatingVid.clientWidth;
        const maxY = rect.height - floatingVid.clientHeight

        let newX = Math.max(0, Math.min(x, maxX))
        let newY = Math.max(0, Math.min(y, maxY))
        gsap.to(floatingVid, {
            // scale:1,
            x: newX,
            y: newY,
            duration: 1.5,
            ease: "power4.out"
        })

    })
    video.addEventListener("mouseenter", function () {
        gsap.to(floatingVid, {
            scale: 1,
            duration: 0.5,
        })
        gsap.to(imageBehind, {
            opacity: 0.5
        })
    })
    video.addEventListener("mouseleave", function () {
        gsap.to(floatingVid, {
            scale: 0,
            duration: 0.5,
        })
        gsap.to(imageBehind, {
            opacity: 1
        })

    })
}
floatingVidAnimation(".video", ".video video", ".top-image img")
floatingVidAnimation(".bottom-video", ".bottom-video video", ".image1 img")
floatingVidAnimation(".bottom-video2", ".bottom-video2 video", ".image2 img")

gsap.to(".scalingDiv .video .innervideo", {
    scale: 1,
    duration: 1.5,
    scrollTrigger: {
        trigger: ".scalingDiv .video",
        scroller: "#main",
        // markers:true,
        ease: "linear",
        scrub: 0.2,
        end: "top 5%",
        start: "top 80%"

    }
})

function breakText(selector, spacing) {
    var elements = document.querySelectorAll(selector);

    elements.forEach(h1 => {
        var h1Text = h1.textContent;
        var splitText = h1Text.split(spacing);
        var clutter = "";

        splitText.forEach(element => {
            clutter += `<span>${element}</span>`;
        });

        h1.innerHTML = clutter;
    });
}
breakText(".endingWords a h1", " ");  // Assuming you want to split by space

var obj = document.querySelector(".endingWords")
obj.addEventListener("mouseenter", function () {
    console.log("go up");
    gsap.to(".endingWords a h1 span", {
        y: "-100%",
        duration: 0.3,
        stagger: 0.05
    })
    gsap.to(".endingWords .line", {
        transform: "scaleX(1)",
        duration: 0.5,
        ease: "ease"
    })
})
obj.addEventListener("mouseleave", function () {
    console.log("go up");
    gsap.to(".endingWords a h1 span", {
        y: 0,
        duration: 0.3,
        stagger: 0.03
    })
    gsap.to(".endingWords .line", {
        transform: "scaleX(0.8)",
        duration: 0.5,
        ease: "ease"
    })
})

breakText(".loader h3", " ")
breakText(".title-name h1", "")

function loadingScreen(){

    var tl = gsap.timeline();
    tl.to(".loader h3 span", {
        // delay:0.5,
        opacity: 1,
        duration: 1,
        stagger: 0.3
    })
    tl.to(".loader h3", {
        opacity: 0,
        duration: 0.5,
    })
    tl.to(".loader", {
        y: "100%",
        display: "none",
        duration: 1,
        ease: "expo.out",
    })
    tl.from(".title-name h1 span", {
        y: "-100%",
        // delay:1,
        duration: 1.5,
        stagger: 0.05,
    ease: "expo.out",
    // backgroundColor:"white",

}, "<")
}
loadingScreen()






breakText(".end-page .end-name h1", "")
gsap.from(".end-page .end-name h1 span", {
    y: "-100%",
    duration: 1,
    stagger: 0.05,
    scrollTrigger: {
        trigger: ".end-page .end-name h1 span",
        scroller: "#main",
        ease: "expo.out",
        // markers: true
    }
})





function smallLine(hoverItem, hoverUnderline) {
    var home = document.querySelector(hoverItem)
    home.addEventListener("mouseenter", function () {
        gsap.to(hoverUnderline, {
            // opacity:1,
            x: 0,
            duration: 0.5,
            ease: "expo.out"

        })
    })
    home.addEventListener("mouseleave", function () {
        gsap.to(hoverUnderline, {
            // opacity:0,
            x: "100%",
            duration: 0.5,
            ease: "expo.out",
            onComplete: () => {
                gsap.set(".homeline", { x: "-100%" })
            }

        })
    })
}
smallLine("#home", "#homeline")
smallLine("#work", "#wordline")
smallLine("#about", "#aboutline")
smallLine("#services", "#serviceline")
smallLine("#contact", "#contactline")
smallLine("#contact", "#contactline")
smallLine("#talk", "#talkline")
smallLine("#learn", "#learnline")

function arrowAnimation(firstArrow, word, secondArrow, wordDisplacement) {
    var talk = document.querySelector(word)
    talk.addEventListener("mouseenter", function () {
        gsap.to(firstArrow, {
            x: 0,
            y: "-100%"
        })
        gsap.to(word, {
            x: 0,
        })
        gsap.to(secondArrow, {
            x: 0,
            y: 0
        })
    })
    talk.addEventListener("mouseleave", function () {
        gsap.to(secondArrow, {
            x: "-100%",
            y: "100%"
        })
        gsap.to(word, {
            x: `${wordDisplacement}%`,
        })
        gsap.to(firstArrow, {
            x: "-100%",
            y: 0
        })
    })

}

arrowAnimation("#first", "#talk", "#second", -25)
arrowAnimation("#pg3first", "#learn", "#pg3second", -22)


barba.init({
    transitions: [{
        name: 'default-transition',
        async leave(data) {
            await gsap.to(data.current.container, {
                opacity: 0,
                duration: 1,
                ease: "expo.out"
            });
        },
        async enter(data) {
            // Replace this with your actual animation logic
            await gsap.from(data.next.container, {
                opacity: 0,
                duration: 1,
                ease: "expo.out"
            });
        },
        async afterEnter(data) {
            resetScroll(); // Ensures fresh setup after DOM has changed
        }
    }]
});


    var swiper = new Swiper(".mySwiper", {
        speed:10000,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
          },
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      slidesPerView: 4,
      spaceBetween: 30,
      freeMode: true,
    });

gsap.to(".slide", {
    opacity:1,
    transform: "rotateX(0) skewX(0)",
    duration:1,
    scrollTrigger:{
        trigger:".swiper-wrapper",
        scroller:"#main",

    }
})
