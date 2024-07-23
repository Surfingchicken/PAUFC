import youtube from '../../img/footer/youtube.svg';
import facebook from '../../img/footer/facebook.svg';
import twitter from '../../img/footer/twitter.svg';
import linkedin from '../../img/footer/linkedin.svg';
import instagram from '../../img/footer/instagram.svg';
import '../../styles/home.css';
import { Link } from 'react-router-dom';

export default function Footer(){
    return (
        <footer className="footer">
          <div className="footer-top">
            <div className="footer-section">
              <h3>UFC-Que Choisir</h3>
              <ul>
                <Link to="/signup" >
                  <li>Devenir adhérent de l’association</li>
                </Link>
                <Link to="/donations" >
                  <li>Faire un don à l’UFC-Que Choisir</li>
                </Link>
                
                <li>Qui sommes-nous ?</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="social-media"> 
              <a href="https://www.youtube.com/user/ufcquechoisir" className="social-icon" target="_blank">
                <img src={youtube} alt="YouTube" />
              </a>
              <a href="https://www.facebook.com/UFCquechoisir/" className="social-icon" target="_blank">
                <img src={facebook} alt="Facebook" />
              </a>
              <a href="https://x.com/ufcquechoisir" className="social-icon" target="_blank">
                <img src={twitter} alt="Twitter" />
              </a>
              <a href="https://www.linkedin.com/company/ufc-que-choisir/" className="social-icon" target="_blank">
                <img src={linkedin} alt="LinkedIn" />
              </a>
              <a href="https://www.instagram.com/ufcquechoisir/" className="social-icon" target="_blank">
                <img src={instagram} alt="Instagram" />
              </a>
            </div>
            <div className="footer-links">
              <p>Association indépendante de l’État, des syndicats, des producteurs et des distributeurs depuis 1951.</p>
            </div>
          </div>
        </footer>
      );
}