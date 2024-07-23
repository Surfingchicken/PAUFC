import eau from "../../img/content/eau.jpg"
import clim from "../../img/content/clim.jpg"
import train from "../../img/content/train.jpg"
import booking from "../../img/content/booking.jpg"
import golf from "../../img/content/golf.jpg"
import dpe from "../../img/content/dpe.jpg"
import olympique from "../../img/content/olympique.jpg"
import assuranceHabitation from "../../img/content/assuranceHabitation.png"
import gazElectricite from "../../img/content/gazElectricite.png"
import forfaitsMobiles from "../../img/content/forfaitsMobiles.png"
import prixSupermarches from "../../img/content/prixSupermarches.png"
import assuranceVie from "../../img/content/assuranceVie.png"
import tarifsBancaires from "../../img/content/tarifsBancaires.png"
import fournisseursInternet from "../../img/content/fournisseursInternet.png"
import mutuelles from "../../img/content/mutuelles.png"
import '../../styles/home.css'; 
import { Link } from 'react-router-dom';

export default function MainContent(){
  const token = localStorage.getItem('token'); 
    return (
        <>
          <section className="main-content">
            <article className="featured-article">
              <img src={eau} alt="prix eau" />
              <div className="article-content">
                <p>Prix de l'eau</p>
                <br/>
                <br/>
                <h2 className="bigtext">Pourquoi vous allez payer plus</h2>
                <br/>
                <br/>
                <p>Micropolluants, coûts de l’énergie, vétusté… Les dépenses des collectivités pour acheminer et traiter l’eau explosent, et le dérèglement climatique va encore davantage alourdir la facture dans les années à venir.</p>
              </div>
            </article>
          </section>

          <section className="articles-section" id="actualites">
            <div className="article-card">
              <img src={clim} alt="Climatiseur mobile" />
              <div className="article-content">
                <p className="article-category">GUIDE D'ACHAT</p>
                <h3>Climatiseurs mobiles</h3>
                <p>Comment bien choisir un climatiseur mobile monobloc</p>
              </div>
            </div>
            <div className="article-card">
              <img src={train} alt="Vacances" />
              <div className="article-content">
                <p className="article-category">ENQUÊTE</p>
                <h3>Vacances</h3>
                <p>Le casse-tête tarifaire des trajets en train</p>
              </div>
            </div>
            <div className="article-card">
              <img src={booking} alt="Location saisonnière" />
              <div className="article-content">
                <p className="article-category">ACTUALITÉ</p>
                <h3>Location saisonnière</h3>
                <p>Gare aux attaques d’escrocs sur Booking.com</p>
              </div>
            </div>
        </section>

        <h3 className="lire-aussi">Lire aussi sur Que Choisir</h3>
        <section className="additional-content">
          <div className="content-box">
            <img src={olympique} alt="Jeux olympiques Paris 2024" />
            <div className="article-details">
              <p className="article-category">ACTUALITÉ</p>
              <h3>Jeux olympiques Paris 2024</h3>
              <p>Les billets électroniques incompatibles avec les « vieux » smartphones</p>
            </div>
          </div>
          <div className="content-box">
            <img src={golf} alt="Volkswagen Golf 8" />
            <div className="article-details">
              <p className="article-category">ACTUALITÉ</p>
              <h3>Volkswagen Golf 8 (2024)</h3>
              <p>Premières impressions</p>
            </div>
          </div>
          <div className="content-box">
            <img src={dpe} alt="Logement" />
            <div className="article-details">
              <p className="article-category">ACTUALITÉ</p>
              <h3>Logement</h3>
              <p>Où sont les 140 000 logements qui profitent de la réforme du DPE ?</p>
            </div>
          </div>
      </section>

     <section className="support-section" id="nous-soutenir">
      <h2>Financez-nous !</h2>
      <p>Soutenez une association 100 % indépendante de l’État, des producteurs et des distributeurs.</p>
      <div className="support-content">
        <div className="support-item">
          <div className="check-icon"></div>
          <div>
            <p className="support-title">Tests comparatifs</p>
            <p>Nos experts testent, comparent et donnent leur avis en toute indépendance sur les produits et services de votre quotidien.</p>
          </div>
        </div>
        <div className="support-item">
          <div className="check-icon"></div>
          <div>
            <p className="support-title">Enquêtes de la rédaction</p>
            <p>Nos journalistes d’investigation vous proposent des enquêtes approfondies.</p>
          </div>
        </div>
        <div className="support-item">
          <div className="check-icon"></div>
          <div>
            <p className="support-title">Conseils et décryptages</p>
            <p>Nous mettons à votre disposition des contenus qui vous permettent de mieux appréhender l’univers de la consommation.</p>
          </div>
        </div>
      </div>
      <Link to="/donations" className="support-button">
        Nous soutenir
    </Link>
    </section>
    
    <section className="services-section" id="nos-services">
      <h2>Nos services</h2>
      <div className="services-content">
        <div className="service-box">
          <img src={assuranceHabitation} alt="Assurance habitation" />
          <p>Comparateur<br /><strong>Assurance habitation</strong></p>
        </div>
        <div className="service-box">
          <img src={forfaitsMobiles} alt="Forfaits mobiles" />
          <p>Comparateur<br /><strong>Forfaits mobiles</strong></p>
        </div>
        <div className="service-box">
          <img src={gazElectricite} alt="Gaz / Électricité" />
          <p>Comparateur<br /><strong>Gaz / Électricité</strong></p>
        </div>
        <div className="service-box">
          <img src={mutuelles} alt="Mutuelles" />
          <p>Comparateur<br /><strong>Mutuelles</strong></p>
        </div>
        <div className="service-box">
          <img src={tarifsBancaires} alt="Tarifs bancaires" />
          <p>Comparateur<br /><strong>Tarifs bancaires</strong></p>
        </div>
        <div className="service-box">
          <img src={assuranceVie} alt="Assurance vie" />
          <p>Comparateur<br /><strong>Assurance vie</strong></p>
        </div>
        <div className="service-box">
          <img src={fournisseursInternet} alt="Fournisseurs d’accès internet" />
          <p>Comparateur<br /><strong>Fournisseurs d’accès internet</strong></p>
        </div>
        <div className="service-box">
          <img src={prixSupermarches} alt="Des prix et supermarchés" />
          <p>Carte<br /><strong>Des prix et supermarchés</strong></p>
        </div>
      </div>
    </section>

    </>
        
  );
}