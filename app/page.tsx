"use client"
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ReactLenis, { LenisRef, useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import TopNav from "./_components/topnav";

// import Image from "next/image";
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const heroimgRef = useRef<HTMLDivElement | null>(null);
    const navRef = useRef<HTMLElement | null>(null);
    const lenisRef = useRef<LenisRef>(null);
    const frameCountRef = useRef(405);
    const imagesRef = useRef<HTMLImageElement[]>([]);

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

                    const animationProgress = Math.min(progress/0.9, 1);

                    const targetFrame = Math.round(animationProgress * (frameCount - 1));
                    videoFrames.frame = targetFrame;
                    render();
                }
            })
        }


    }, []);


    return (
        // only the divs & section (block elements) are given styles. 
        // So put every style inside div
        <>
            <ReactLenis root options={{lerp: 0.1, autoRaf: true }} ref={lenisRef}>
                <TopNav ref={navRef} />
                <div className="container" ref={containerRef} >
                    <section className="hero">
                        <canvas ref={canvasRef}></canvas>

                        <div className="hero-content">
                            <div className="header" ref={headerRef}>
                                <h1>Where Beauty Begins</h1>
                                <p>Trusted by</p>
                                <div className="client-logos">
                                    <div className="client-logo"><img src="/clients/client-logo-1.svg" alt="img1" /></div>
                                    <div className="client-logo"><img src="/clients/client-logo-2.svg" alt="img2" /></div>
                                    <div className="client-logo"><img src="/clients/client-logo-3.svg" alt="img3" /></div>
                                    <div className="client-logo"><img src="/clients/client-logo-4.svg" alt="img4" /></div>
                                </div>
                            </div>
                        </div>
                        <div className="hero-img-container">
                            <div className="hero-img" ref={heroimgRef}><img src="/dashboard.png" alt="dashboard" /></div>
                        </div>
                    </section>

                    <section className="outro">
                        <h1>Experience modern beauty at Chloe</h1>
                    </section>
                </div>
            </ReactLenis>
        </>
    );
}
