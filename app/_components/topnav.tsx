import { forwardRef } from "react"

const TopNav = forwardRef<HTMLElement>((props ,ref) => {
    return (
        <nav ref={ref}>
            <div className="nav-links">
                <a href="#">Services</a>
                <a href="#">Products</a>
                <a href="#">About Us</a>
            </div>
            <div className="logo">
                <a href="#"><img src="/logo.jpg" alt="logo" /></a>
            </div>
            <div className="nav-buttons">
                <div className="btn primary"><a href="#">Book</a></div>
                <div className="btn secondary"><a href="#">Offers</a></div>
            </div>
        </nav>
    )
})

export default TopNav;
