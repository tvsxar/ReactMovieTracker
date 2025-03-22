import './Footer.scss';

// images
import facebook from '../../assets/facebook.svg';
import twitter from '../../assets/twitter.svg';
import insta from '../../assets/insta.svg';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <div className="logo">GII</div>

            <span className="email">tvsxar@gmail.com</span>

            <div className="socials">
              <a href="#!"><img src={facebook} alt="facebook" className="social-icon" /></a>
              <a href="#!"><img src={twitter} alt="twitter" className="social-icon" /></a>
              <a href="#!"><img src={insta} alt="insta" className="social-icon" /></a>
            </div>
          </div>

          <nav className="footer-nav">
            <div className="navbar-column">
              <p className="navbar-title">About</p>

              <ul>
                <li className="navbar-item"><a href="#!">About Us</a></li>
                <li className="navbar-item"><a href="#!">Features</a></li>
                <li className="navbar-item"><a href="#!">News & Blogs</a></li>
              </ul>
            </div>

            <div className="navbar-column">
              <p className="navbar-title">Contact</p>

              <ul>
                <li className="navbar-item"><a href="#!">Facebook</a></li>
                <li className="navbar-item"><a href="#!">Twitter</a></li>
                <li className="navbar-item"><a href="#!">Instagram</a></li>
              </ul>
            </div>

            <div className="navbar-column">
              <p className="navbar-title">Support</p>

              <ul>
                <li className="navbar-item"><a href="#!">FAQs</a></li>
                <li className="navbar-item"><a href="#!">Support Centre</a></li>
                <li className="navbar-item"><a href="#!">Contact Us</a></li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer;