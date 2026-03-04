"use client"
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ReactLenis, { LenisRef, useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";

// import Image from "next/image";
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const heroimgRef = useRef<HTMLDivElement | null>(null);
    const lenisRef = useRef<LenisRef>(null);
    const frameCountRef = useRef(405);

    useEffect(() => {
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
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000)
        }

        gsap.ticker.add(update)

        return () => gsap.ticker.remove(update)
    }, [])

    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        const frameCount = frameCountRef.current;

        for (let i = 1; i<= frameCount; i++ ) {
            const img = new Image();
            img.src = `/frames/frame_${i.toString().padStart(5, '0')}.webp`;
            loadedImages.push(img);
        }
    }, [frameCountRef]);


    return (
        // only the divs & section (block elements) are given styles. 
        // So put every style inside div
        <>
            <ReactLenis root options={{autoRaf: false}} ref={lenisRef}>
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
