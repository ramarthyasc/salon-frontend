"use client"
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ReactLenis, { LenisRef, useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import TopNav from "./_components/topnav";

// import Image from "next/image";
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const heroimgRef = useRef<HTMLDivElement | null>(null);
    const heroimg1Ref = useRef<HTMLDivElement | null>(null);
    const heroimg2Ref = useRef<HTMLDivElement | null>(null);
    const heroimg3Ref = useRef<HTMLDivElement | null>(null);
    const heroimg4Ref = useRef<HTMLDivElement | null>(null);
    const navRef = useRef<HTMLElement | null>(null);
    const lenisRef = useRef<LenisRef>(null);
    const frameCountRef = useRef(405);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const lenis = useLenis();

    useEffect(() => {
        lenis?.on("scroll", ScrollTrigger.update);
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000)
        }

        gsap.ticker.add(update)
        gsap.ticker.lagSmoothing(0);

        return () => gsap.ticker.remove(update)
    }, [])

    useEffect(() => {
        // set Canvas
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d");
        function setCanvasSize() {
            const pixelRatio = window.devicePixelRatio || 1;
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";

            canvas.width = window.innerWidth * pixelRatio;
            canvas.height = window.innerHeight * pixelRatio;

            context?.scale(pixelRatio, pixelRatio);
        }
        setCanvasSize();

        // set frames animation variables
        const frameCount = frameCountRef.current;
        const currentFrame = (index: number) => {
            return `/frames/frame_${index.toString().padStart(5, '0')}.webp`;
        }
        const videoFrames = { frame: 0 };
        let imagesToLoad = frameCount;

        /// Loading the frames as images into the imagesRef array
        const onLoad = () => {
            imagesToLoad--;

            if (!imagesToLoad) {
                render();
                setupScrollTrigger();
                setIsLoading(false);
            }
        }

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.onload = onLoad;
            img.onerror = function () {
                onLoad.call(this);
            }
            img.src = currentFrame(i);
            // after onload and onerror handlers are attached, and image is sourcing, we push.
            imagesRef.current.push(img);
        }

        // Render function
        const render = () => {
            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;

            context?.clearRect(0, 0, canvasWidth, canvasHeight);

            const images = imagesRef.current;
            const img = images[videoFrames.frame];

            if (img && img.complete && img.naturalWidth > 0) {
                const imageAspect = img.naturalWidth / img.naturalHeight;
                const canvasAspect = canvasWidth / canvasHeight;

                let drawWidth, drawHeight, drawX, drawY;

                // if i need scaling for the image or not
                if (imageAspect > canvasAspect) {
                    drawHeight = canvasHeight;
                    drawWidth = drawHeight * imageAspect;
                    drawX = (canvasWidth - drawWidth) / 2;
                    drawY = 0;
                } else {
                    drawWidth = canvasWidth;
                    drawHeight = drawWidth / imageAspect;
                    drawX = 0;
                    drawY = (canvasHeight - drawHeight) / 2;
                }

                context?.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            }
        }
        // image loading and first image rendering is done
        function animateHeroImage(
            ref: React.RefObject<HTMLDivElement | null>,
            progress: number,
            start: number
        ) {

            const flyInEnd = start + 0.05
            const holdEnd = start + 0.07
            const end = start + 0.1

            if (progress < start) {

                gsap.set(ref.current, {
                    transform: "translateZ(1000px)",
                    opacity: 0
                })

            } else if (progress >= start && progress <= flyInEnd) {

                // Fly In
                const p = (progress - start) / 0.05
                const translateZ = 1000 - p * 1000
                const opacity = p

                gsap.set(ref.current, {
                    transform: `translateZ(${translateZ}px)`,
                    opacity
                })

            } else if (progress > flyInEnd && progress <= holdEnd) {

                // Hold
                gsap.set(ref.current, {
                    transform: "translateZ(0px)",
                    opacity: 1
                })

            } else if (progress > holdEnd && progress <= end) {

                // Shoot Back + Fade
                const p = (progress - holdEnd) / 0.03
                const translateZ = -1000 * p
                const opacity = 1 - p

                gsap.set(ref.current, {
                    transform: `translateZ(${translateZ}px)`,
                    opacity
                })

            } else {

                gsap.set(ref.current, {
                    transform: "translateZ(-1000px)",
                    opacity: 0
                })
            }
        }

        // dynamic image rendering
        const setupScrollTrigger = () => {
            ScrollTrigger.create({
                trigger: ".hero",
                start: "top top",
                end: `+=${window.innerHeight * 3}px`,
                pin: true,
                pinSpacing: true,
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const velocity = Math.abs(self.getVelocity()); // absolute velocity
                    console.log(velocity);

                    const velocityThreshold = 80; // tweak this value to what feels right
                    if (velocity < velocityThreshold) { return;}

                    const animationProgress = Math.min(progress / 0.9, 1);

                    const targetFrame = Math.round(animationProgress * (frameCount - 1));
                    videoFrames.frame = targetFrame;
                    render();

                    if (progress < 0.1) {
                        const navProgress = progress / 0.1;
                        const opacity = 1 - navProgress;

                        gsap.set(navRef.current, { opacity });
                    } else {
                        gsap.set(navRef.current, { opacity: 0 });
                    }

                    if (progress < 0.20) {
                        const zProgress = progress / 0.25;
                        const translateZ = zProgress * -500;

                        let opacity = 1;
                        if (progress < 0.15) {
                            const fadeProgress = Math.min((progress - 0.15) / (0.20 - 0.15), 1);
                            opacity = 1 - fadeProgress;
                        }

                        gsap.set(headerRef.current, {
                            transform: `translate(-50%, -50%) translateZ(${translateZ}px)`,
                            opacity,
                        })
                    } else {
                        gsap.set(headerRef.current, {
                            opacity: 0
                        })
                    }

                    animateHeroImage(heroimg1Ref, progress, 0.15)
                    animateHeroImage(heroimg2Ref, progress, 0.30)
                    animateHeroImage(heroimg3Ref, progress, 0.45)
                    animateHeroImage(heroimg4Ref, progress, 0.60)


                    if (progress < 0.8) {
                        gsap.set(heroimgRef.current, {
                            transform: "translateZ(1000px)",
                            opacity: 0
                        })
                    } else if (progress >= 0.8 && progress <= 0.9) {
                        const imgProgress = (progress - 0.8) / 0.1;

                        const translateZ = 1000 - imgProgress * 1000;

                        let opacity = 0;
                        if (progress <= 0.90) {
                            const opacityProgress = (progress - 0.80) / 0.1;
                            opacity = opacityProgress;
                        } else {
                            opacity = 1;
                        }

                        gsap.set(heroimgRef.current, {
                            transform: `translateZ(${translateZ}px)`,
                            opacity
                        })
                    } else {
                        gsap.set(heroimgRef.current, {
                            transform: "translateZ(0px)",
                            opacity: 1
                        })
                    }
                }
            })
        }

        function reset() {
            setCanvasSize();
            render();
            ScrollTrigger.refresh();
        }

        window.addEventListener("resize", reset);

        return () => {
            removeEventListener("resize", reset);
        }


    }, []);


    return (
        // only the divs & section (block elements) are given styles. 
        // So put every style inside div
        <>
            <ReactLenis root options={{ lerp: 0.1, autoRaf: true }} ref={lenisRef}>
                <TopNav ref={navRef} />
                <div className="container" ref={containerRef} >
                    <section className="hero">
                        <canvas ref={canvasRef}></canvas>

                        <div className="hero-content">
                            <div className="header" ref={headerRef}>
                                {/* <h1>Beauty by Chloe</h1> */}
                                {/* <p>Loved by</p> */}
                                {/* <div className="client-logos"> */}
                                {/*     <div className="client-logo"><img src="/clients/client-logo-1.svg" alt="img1" /></div> */}
                                {/*     <div className="client-logo"><img src="/clients/client-logo-2.svg" alt="img2" /></div> */}
                                {/*     <div className="client-logo"><img src="/clients/client-logo-3.svg" alt="img3" /></div> */}
                                {/*     <div className="client-logo"><img src="/clients/client-logo-4.svg" alt="img4" /></div> */}
                                {/* </div> */}
                            </div>
                        </div>
                        <div className="hero-img-container">
                            <div className="hero-img" ref={heroimgRef}><img src="/dashboard.png" alt="dashboard" /></div>
                        </div>
                        <div className="hero-img-container">
                            <div className="hero-img1" ref={heroimg1Ref}><img src="/dashboard1.png" alt="dashboard1" /></div>
                        </div>
                        <div className="hero-img-container">
                            <div className="hero-img2" ref={heroimg2Ref}><img src="/dashboard2.png" alt="dashboard2" /></div>
                        </div>
                        <div className="hero-img-container">
                            <div className="hero-img3" ref={heroimg3Ref}><img src="/dashboard3.png" alt="dashboard3" /></div>
                        </div>
                        <div className="hero-img-container">
                            <div className="hero-img4" ref={heroimg4Ref}><img src="/dashboard4.png" alt="dashboard4" /></div>
                        </div>
                    </section>

                    {/* <section className="outro"> */}
                    {/*     <h1>Experience modern beauty at Chloe</h1> */}
                    {/* </section> */}
                </div>


                {/* Loading overlay */}
                <div className={`loading-overlay ${isLoading ? "active" : "fade-out"}`}>
                    <h1 className="brand-title">
                        Beauty <span className="brand-script">by Chloe</span>
                    </h1>
                    <svg
                        width="50"
                        height="50"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <style>
                            {`
          .spinner_9y7u{animation:spinner_fUkk 2.4s linear infinite;animation-delay:-2.4s}
          .spinner_DF2s{animation-delay:-1.6s}
          .spinner_q27e{animation-delay:-0.8s}
          @keyframes spinner_fUkk{
            8.33%{x:13px;y:1px}
            25%{x:13px;y:1px}
            33.3%{x:13px;y:13px}
            50%{x:13px;y:13px}
            58.33%{x:1px;y:13px}
            75%{x:1px;y:13px}
            83.33%{x:1px;y:1px}
          }
        `}
                        </style>
                        <rect className="spinner_9y7u" x="1" y="1" rx="1" width="10" height="10" />
                        <rect className="spinner_9y7u spinner_DF2s" x="1" y="1" rx="1" width="10" height="10" />
                        <rect className="spinner_9y7u spinner_q27e" x="1" y="1" rx="1" width="10" height="10" />
                    </svg>
                </div>
            </ReactLenis>

        </>
    );
}
