// import Image from "next/image";

export default function Home() {
    return (
        // only the divs & section (block elements) are given styles. 
        // So put every style inside div
        <>
            <div className="container">
                <section className="hero">
                    <canvas></canvas>
                    <div className="hero-content">
                        <div className="header">
                            <h1>Where Beauty Begins</h1>
                            <p>Trusted by</p>
                            <div className="client-logos">
                                <div className="client-logo">
                                    <div className="client-logo"><img src="/clients/client-logo-1.svg" alt="img1" /></div>
                                    <div className="client-logo"><img src="/clients/client-logo-2.svg" alt="img2" /></div>
                                    <div className="client-logo"><img src="/clients/client-logo-3.svg" alt="img3" /></div>
                                    <div className="client-logo"><img src="/clients/client-logo-4.svg" alt="img4" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hero-img-container">
                        <div className="hero-img"><img src="/dashboard.png" alt="dashboard" /></div>
                    </div>
                </section>

                <section className="outro">
                    <h1>Experience modern beauty at Chloe</h1>
                </section>
            </div>
        </>
    );
}
