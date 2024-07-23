import '../../styles/header.css';
import logo from "../../img/header/favicon.svg.png";
import { Link as ScrollLink } from 'react-scroll';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="header">
            <div className="logo">
                <img src={logo} alt="QUE CHOISIR" />
            </div>
            <nav className="navigation">
                <ScrollLink to="actualites" smooth={true} duration={500} className="navigation-div">Actualités</ScrollLink>
                <ScrollLink to="nos-services" smooth={true} duration={500} className="navigation-div">Nos Services</ScrollLink>
                <ScrollLink to="qui-sommes-nous" smooth={true} duration={500} className="navigation-div">Qui sommes-nous</ScrollLink>
                <ScrollLink to="nous-soutenir" smooth={true} duration={500} className="navigatio-div">Nous soutenir</ScrollLink>
            </nav>
            <div className="auth">
                <Link to="/login"><button>Se connecter</button></Link>
                <Link to="/signup"><button className="subscribe">Nous rejoindre</button></Link>
            </div>
        </header>
    )
}
