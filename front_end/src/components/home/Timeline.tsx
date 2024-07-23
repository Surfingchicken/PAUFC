import React from 'react'; 
import event1 from '../../img/timeline/event1.jpg';
import event2 from '../../img/timeline/event2.png';
import event3 from '../../img/timeline/event3.jpg';
import event4 from '../../img/timeline/event4.jpg';
import event5 from '../../img/timeline/event5.jpg';
import event6 from '../../img/timeline/event6.jpg';
import event7 from '../../img/timeline/event7.jpg';
import event8 from '../../img/timeline/event8.jpg';
import event9 from '../../img/timeline/event9.jpg';
import event10 from '../../img/timeline/event10.jpg';
import event11 from '../../img/timeline/event11.jpg';
import event12 from '../../img/timeline/event12.jpg';
import event13 from '../../img/timeline/event13.jpg';
import event14 from '../../img/timeline/event14.jpg';
import event15 from '../../img/timeline/event15.jpg';
import event16 from '../../img/timeline/event16.jpg';
import event17 from '../../img/timeline/event17.jpg';
import event18 from '../../img/timeline/event18.jpg';
import event19 from '../../img/timeline/event19.jpg';
import event20 from '../../img/timeline/event20.jpg';
import event21 from '../../img/timeline/event21.jpg';
import event22 from '../../img/timeline/event22.jpg';
import TimelineArray from '../../interfaces/timeline/Timeline';
import '../../styles/home.css';

const timelineData: TimelineArray[] = [
    {
        image: event1,
        alt: '1951',
        year: '1951',
        description: "Création de l'Union Fédérale de la Consommation (UFC)"
    },
    {
        image: event2,
        alt: '1961',
        year: '1961',
        description: 'Parution du premier Que Choisir mensuel'
    },
    {
        image: event3,
        alt: '1962',
        year: '1962',
        description: 'Participation à la fondation du Bureau européen des Unions des consommateurs (BEUC).'
    },
    {
        image: event4,
        alt: '1965',
        year: '1965',
        description: "Création de la première association qui s’affilie à l’UFC"
    },
    {
        image: event5,
        alt: '1975',
        year: '1975',
        description: 'Pollution des plages : transparence sur la qualité des eaux de baignade'
    },
    {
        image: event6,
        alt: '1976',
        year: '1976',
        description: "Obtention du 1er agrément permettant d’agir en justice dans l’intérêt des consommateurs"
    },
    {
        image: event7,
        alt: '1979',
        year: '1979',
        description: '170 associations locales affiliées à l’UFC'
    },
    {
        image: event8,
        alt: '1988',
        year: '1988',
        description: 'Boycott du veau aux hormones : interdiction des hormones'
    },
    {        
        image: event9,
        alt: '1990',
        year: '1990',
        description: "Participation à la création d’International Consumer Researching and Testing (ICRT)"
    },
    {        
        image: event10,
        alt: '2002',
        year: '2002',
        description: 'Dénonce des tarifs excessifs des SMS, minute indivisible'
    },
    {        
        image: event11,
        alt: '2002',
        year: '2002',
        description: "Lancement du site internet quechoisir.org"
    },
    {        
        image: event12,
        alt: '2005',
        year: '2005',
        description: 'Lancement de cartelmobile.org, à la suite de la condamnation des trois opérateurs de téléphonie mobile par le Conseil de la concurrence'
    },
    {        
        image: event13,
        alt: '2007',
        year: '2007',
        description: 'Ingrédients indésirables dans les lessives : interdiction du phosphate'
    },
    {        
        image: event14,
        alt: '2014',
        year: '2014',
        description: "Scandale des lasagnes au cheval : obtention de la traçabilité de la viande et du lait dans les produits transformés"
    },
    {        
        image: event15,
        alt: '2017',
        year: '2017',
        description: 'Dénonce de la malbouffe : obtention du Nutri-Score'
    },
    {        
        image: event16,
        alt: '2017',
        year: '2017',
        description: "Scandale des marges exorbitantes pour les appels passés/reçus depuis l’Union européenne : abolition du roaming/frais d’itinérance"
    },
    {        
        image: event17,
        alt: '2018',
        year: '2018',
        description: 'Mise en place du RGPD pour un meilleur contrôle de sa vie privée'
    },
    {        
        image: event18,
        alt: '2020',
        year: '2020',
        description: 'Nanoparticules dans l’alimentation : interdiction du dioxyde de Titane'
    },
    {        
        image: event19,
        alt: '2020',
        year: '2020',
        description: 'Explosion du reste à charge : mise en place du 100% santé'
    },
    {        
        image: event20,
        alt: '2020',
        year: '2020',
        description: 'Explosion des loyers dans les grandes agglomérations : mise en place de l’encadrement'
    },
    {        
        image: event21,
        alt: '2020',
        year: '2020',
        description: 'Harcèlement téléphonique : encadrement du démarchage téléphonique'
    },
    {        
        image: event22,
        alt: '2022',
        year: '2022',
        description: "Crédit immobilier : obtention de la résiliation des contrats d'assurance emprunteur à tout moment"
    }
  ];

const Timeline: React.FC = () => {
    const scrollTimeline = (direction: 'left' | 'right') => {
        const container = document.querySelector('.timeline-container') as HTMLElement;
        if (container) {
          const scrollAmount = direction === 'left' ? -800 : 800;
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      };

    return (
        <section className="timeline-section" id="qui-sommes-nous">
        <h2>L’UFC-Que Choisir en quelques dates</h2>
        <div className="timeline-wrapper">
          <div className="timeline-container">
            {timelineData.map((event, index) => (
              <div className="timeline-item" key={index}>
                <img src={event.image} alt={event.alt} />
                <p><strong>{event.year}</strong><br />{event.description}</p>
              </div>
            ))}
          </div>
          <button className="scroll-button left" onClick={() => scrollTimeline('left')}>{'<'}</button>
          <button className="scroll-button right" onClick={() => scrollTimeline('right')}>{'>'}</button>
        </div>
      </section>
    );
}

export default Timeline;
