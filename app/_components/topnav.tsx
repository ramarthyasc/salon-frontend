
export default function TopNav() {
    return (
        <nav>
            <div className="nav-links">
                <a href="#">Overview</a>
                <a href="#">Solutions</a>
                <a href="#">Resources</a>
            </div>
            <div className="logo">
                <a href="#"><img src="/logo.jpeg" alt="logo" /></a>
            </div>
            <div className="nav-buttons">
                <div className="btn primary"><a href="#">Live Demo</a></div>
                <div className="btn secondary"><a href="#">Get Started</a></div>
            </div>
        </nav>
    )
}
