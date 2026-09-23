export const locales = {
  fr: {
    label: 'Français', langName: 'Français', direction: 'ltr',
    nav: [
      ['home', 'Accueil', '/'], ['about', 'À propos', '/about/'], ['services', 'Services et secteurs', '/services-et-secteurs/'],
      ['projects', 'Projets', '/projets/'], ['insights', 'Analyses', '/insights/'], ['actuality', 'Actualités', '/actualites/'],
      ['sustainability', 'Durabilité', '/durabilite/'], ['experts', 'Experts', '/experts/'], ['careers', 'Carrières', '/carrieres/'], ['contact', 'Contact', '/contact/'],
    ],
    search: 'Rechercher', searchLabel: 'Rechercher sur l’ensemble du site', searchPlaceholder: 'Services, secteurs, expertises…',
    newsletter: 'Infolettre', newsletterCta: 'Recevoir les actualités', dark: 'Mode sombre', light: 'Mode clair', menu: 'Ouvrir le menu',
    footer: 'Conseil énergétique et accompagnement stratégique.', home: 'Accueil', emptyNews: 'Aucune actualité n’a encore été publiée. Abonnez-vous à l’infolettre pour recevoir les nouvelles de l’entreprise.',
    emptyProjects: 'Aucun projet n’est publié pour le moment.', emptyInsights: 'Aucune analyse n’est publiée pour le moment.', emptyJobs: 'Aucun poste n’est ouvert pour le moment. Vous pouvez envoyer une candidature spontanée.',
    contactTitle: 'Parlons de vos enjeux énergétiques', form: { name: 'Nom complet', email: 'Adresse courriel', phone: 'Téléphone (facultatif)', organization: 'Organisation (facultatif)', topic: 'Objet', message: 'Votre message', privacy: 'J’ai lu l’information relative à la confidentialité et j’accepte que mes coordonnées soient utilisées pour répondre à ma demande.', send: 'Envoyer la demande', success: 'Merci. Votre demande a été reçue.', error: 'Votre demande n’a pas pu être envoyée. Réessayez plus tard.', required: 'Ce champ est obligatoire.', invalidEmail: 'Saisissez une adresse courriel valide.' },
    newsletterForm: { title: 'Recevoir les actualités', description: 'Confirmez votre inscription par le lien envoyé à votre adresse courriel. Vous pourrez vous désabonner à tout moment.', consent: 'J’accepte de recevoir les actualités par courriel.', submit: 'M’inscrire', generic: 'Si cette adresse peut être inscrite, un courriel de confirmation vous sera envoyé.' },
    careersForm: { title: 'Candidature spontanée', name: 'Nom complet', email: 'Adresse courriel', phone: 'Téléphone (facultatif)', role: 'Domaine ou poste visé', cv: 'CV (PDF ou DOCX, 5 Mo maximum)', privacy: 'J’ai lu l’avis de confidentialité des candidatures et je comprends l’utilisation de mes données pour traiter ma candidature.', future: 'J’accepte que ma candidature soit conservée pour de futures possibilités (facultatif).', submit: 'Envoyer ma candidature', success: 'Votre candidature a été reçue.', unavailable: 'La réception de candidatures est temporairement indisponible.' },
    contactNote: 'Les champs marqués comme obligatoires sont nécessaires pour répondre à votre demande. Le téléphone et l’organisation sont facultatifs.',
    captcha: 'Vérification reCAPTCHA', captchaLoad: 'Charger reCAPTCHA de Google', captchaConsent: 'Ce service tiers ne se chargera qu’après votre action. Google peut traiter des données techniques. Consultez la politique de confidentialité.',
    searchEmpty: 'Aucun résultat trouvé. Essayez d’autres mots-clés.', searchResults: 'Résultats de recherche',
    legalReview: 'Cette information doit être revue par un conseiller juridique en RDC avant mise en ligne.',
  },
  en: {
    label: 'English', langName: 'English', direction: 'ltr',
    nav: [
      ['home', 'Home', '/'], ['about', 'About', '/about/'], ['services', 'Services & Industries', '/services-industries/'],
      ['projects', 'Projects', '/projects/'], ['insights', 'Insights', '/insights/'], ['actuality', 'Actuality', '/actuality/'],
      ['sustainability', 'Sustainability', '/sustainability/'], ['experts', 'Experts', '/experts/'], ['careers', 'Careers', '/careers/'], ['contact', 'Contact', '/contact/'],
    ],
    search: 'Search', searchLabel: 'Search the whole website', searchPlaceholder: 'Services, sectors, expertise…',
    newsletter: 'Newsletter', newsletterCta: 'Get company updates', dark: 'Dark mode', light: 'Light mode', menu: 'Open menu',
    footer: 'Energy advisory and strategic support.', home: 'Home', emptyNews: 'No company updates have been published yet. Subscribe to the newsletter to hear from the company.',
    emptyProjects: 'No projects are published at this time.', emptyInsights: 'No insights are published at this time.', emptyJobs: 'There are no open positions at this time. You may submit a spontaneous application.',
    contactTitle: 'Discuss your energy priorities', form: { name: 'Full name', email: 'Email address', phone: 'Phone (optional)', organization: 'Organization (optional)', topic: 'Subject', message: 'Your message', privacy: 'I have read the privacy information and agree that my details may be used to respond to my request.', send: 'Send inquiry', success: 'Thank you. Your inquiry has been received.', error: 'Your inquiry could not be sent. Please try again later.', required: 'This field is required.', invalidEmail: 'Enter a valid email address.' },
    newsletterForm: { title: 'Get company updates', description: 'Confirm your subscription using the link sent to your email. You can unsubscribe at any time.', consent: 'I agree to receive company updates by email.', submit: 'Subscribe', generic: 'If this address can be subscribed, you will receive a confirmation email.' },
    careersForm: { title: 'Spontaneous application', name: 'Full name', email: 'Email address', phone: 'Phone (optional)', role: 'Area or role of interest', cv: 'CV (PDF or DOCX, maximum 5 MB)', privacy: 'I have read the recruitment privacy notice and understand how my information will be used to process my application.', future: 'I agree that my application may be retained for future opportunities (optional).', submit: 'Send application', success: 'Your application has been received.', unavailable: 'Applications are temporarily unavailable.' },
    contactNote: 'Required fields are needed to respond to your request. Phone and organization are optional.',
    captcha: 'reCAPTCHA verification', captchaLoad: 'Load Google reCAPTCHA', captchaConsent: 'This third-party service loads only after you request it. Google may process technical data. See the privacy policy.',
    searchEmpty: 'No results found. Try different keywords.', searchResults: 'Search results',
    legalReview: 'This information requires review by qualified counsel in the DRC before publication.',
  },
};

export const services = [
  ['conseil-energetique', 'Energy Advisory', 'Conseil énergétique', 'Electricity market analysis, forecasting, economic and financial studies, feasibility, investment advisory and strategy.', 'Analyse des marchés de l’électricité, prévisions, études économiques et financières, faisabilité, conseil en investissement et stratégie.'],
  ['systemes-electriques', 'Power Systems and Infrastructure', 'Systèmes électriques et infrastructures', 'Generation, transmission and distribution planning, smart grids, energy management and technical studies.', 'Planification de la production, du transport et de la distribution, réseaux intelligents, gestion de l’énergie et études techniques.'],
  ['projets-energetiques', 'Energy Projects', 'Projets énergétiques', 'Project development and engineering support for solar, hydropower, wind, biomass and thermal generation.', 'Développement de projets et appui technique pour la production solaire, hydraulique, éolienne, biomasse et thermique.'],
  ['approvisionnement', 'Power Procurement', 'Approvisionnement en électricité', 'Procurement strategy, power purchase agreement advisory, contract analysis and energy supply strategy.', 'Stratégie d’approvisionnement, conseil relatif aux contrats d’achat d’électricité, analyse contractuelle et stratégie de fourniture.'],
  ['efficacite-energetique', 'Energy Efficiency and Optimization', 'Efficacité énergétique et optimisation', 'Energy audits, consumption analysis, energy-cost and operational optimization.', 'Audits énergétiques, analyse de la consommation et optimisation des coûts énergétiques et des opérations.'],
  ['transition-energetique', 'Energy Transition and Sustainability', 'Transition énergétique et durabilité', 'Energy transition, industrial decarbonization, carbon markets, renewable integration and energy storage.', 'Transition énergétique, décarbonation industrielle, marchés carbone, intégration des énergies renouvelables et stockage.'],
  ['regulation-politique', 'Regulation and Policy', 'Régulation et politiques publiques', 'Sector regulation, policy analysis, monitoring and compliance support.', 'Régulation sectorielle, analyse des politiques, veille et soutien à la conformité.'],
  ['donnees-energie', 'Data and Energy Intelligence', 'Données et intelligence énergétique', 'Demand forecasting, market intelligence, asset analytics and decision-support systems.', 'Prévision de la demande, intelligence de marché, analyse des actifs et outils d’aide à la décision.'],
];

export const industries = [
  ['utilities', 'Utilities', 'Services publics d’électricité'], ['government', 'Government', 'Gouvernement'], ['mining', 'Mining', 'Mines'],
  ['industry', 'Industrial companies', 'Entreprises industrielles'], ['commercial', 'Commercial companies', 'Entreprises commerciales'],
  ['developers', 'Energy developers and power producers', 'Développeurs énergétiques et producteurs d’électricité'],
  ['investors', 'Investors and financial institutions', 'Investisseurs et institutions financières'],
  ['infrastructure', 'Infrastructure companies', 'Entreprises d’infrastructures'], ['partners', 'Development partners', 'Partenaires au développement'],
  ['consumers', 'Large electricity consumers', 'Grands consommateurs d’électricité'],
];

export const experts = [
  {
    slug: 'oguzu-lee-denis', name: 'Oguzu Lee Denis', file: 'OGUZU LEE DENIS pics.jpg', imageFile: 'oguzu-lee-denis.jpg',
    en: 'A Ugandan Member of Parliament for Maracha County, technology innovator, and champion for governance reform. Recognized by the World Health Organization for designing a national emergency ambulance service framework, he leverages his ICT background to drive digital infrastructure expansion, curb illicit financial flows, and foster transparent, youth inclusive development.',
    fr: 'Député ougandais représentant le comté de Maracha, innovateur technologique et défenseur de la réforme de la gouvernance. Reconnu par l’Organisation mondiale de la Santé pour la conception d’un cadre national de service d’ambulances d’urgence, il s’appuie sur son expérience en TIC pour soutenir le développement des infrastructures numériques, lutter contre les flux financiers illicites et promouvoir un développement transparent et inclusif pour les jeunes.',
    focusEn: 'Governance reform · Digital infrastructure · Public services', focusFr: 'Réforme de la gouvernance · Infrastructures numériques · Services publics',
  },
  {
    slug: 'christian-bakole-mukulu', name: 'Christian Bakole Mukulu', file: 'Christian Bakole Mukulu pics.jpg', imageFile: 'christian-bakole-mukulu.jpg',
    en: 'A Congolese energy economist and Deputy Director of Economic and Pricing Affairs at the Democratic Republic of the Congo’s Electricity Regulatory Authority (ARE). A former Hubert H. Humphrey and Mandela Washington Fellow at UC Davis, he holds a Master’s degree in Energy Science and Policy and completed specialized training with the Korea Energy Agency. Supported by World Bank funding as a senior expert on electricity tariff analysis and market regulation, he actively promotes household level energy efficiency and sustainable energy transition strategies across the DRC.',
    fr: 'Économiste congolais de l’énergie et directeur adjoint des affaires économiques et tarifaires à l’Autorité de régulation de l’électricité (ARE) de la République démocratique du Congo. Ancien boursier Hubert H. Humphrey et Mandela Washington à l’UC Davis, il est titulaire d’une maîtrise en sciences et politiques énergétiques et a suivi une formation spécialisée auprès de la Korea Energy Agency. Expert principal en analyse des tarifs d’électricité et régulation des marchés avec un financement de la Banque mondiale, il promeut l’efficacité énergétique des ménages et des stratégies de transition énergétique durable en RDC.',
    focusEn: 'Energy economics · Electricity tariffs · Market regulation', focusFr: 'Économie de l’énergie · Tarifs d’électricité · Régulation des marchés',
  },
  {
    slug: 'geoffrey-aori-mabea', name: 'Dr. Geoffrey Aori Mabea', file: 'Dr. Geoffrey Aori Mabea pics.jpg', imageFile: 'geoffrey-aori-mabea.jpg',
    en: 'A Kenyan energy economist, author, and executive serving as the CEO of the Regional Association of Energy Regulators for Eastern and Southern Africa (RAERESA/COMESA). Holding a PhD in Energy Economics from the University of Dundee, he brings extensive leadership experience from Kenya’s geothermal sector, PwC, and EREA, where he spearheaded the East African Community Energy Union and founded the Energy Regulation Centre of Excellence to drive cross border power market integration, tariff reform, and sustainable energy policy harmonization.',
    fr: 'Économiste de l’énergie, auteur et dirigeant kényan, directeur général de l’Association régionale des régulateurs de l’énergie pour l’Afrique orientale et australe (RAERESA/COMESA). Titulaire d’un doctorat en économie de l’énergie de l’Université de Dundee, il possède une expérience de direction dans le secteur géothermique kényan, chez PwC et à l’EREA. Il a piloté l’Union énergétique de la Communauté d’Afrique de l’Est et fondé le Centre d’excellence en régulation de l’énergie afin de soutenir l’intégration transfrontalière des marchés de l’électricité, la réforme tarifaire et l’harmonisation des politiques énergétiques durables.',
    focusEn: 'Energy regulation · Power markets · Tariff reform', focusFr: 'Régulation énergétique · Marchés de l’électricité · Réforme tarifaire',
  },
  {
    slug: 'matthieu-abena-gongo', name: 'Matthieu Abena Gongo',
    en: 'A Congolese energy expert and public policy advisor with extensive technical and strategic leadership in the Democratic Republic of the Congo’s power sector. Serving as Coordinator of the Technical and Economic Support Unit (CATE), he leads the planning, economic analysis, and validation of national energy projects, building on his prior experience as Chief of Staff at the Ministry of Energy and Hydraulic Resources and chair of the steering committee for the landmark Busanga Hydroelectric Power Station.',
    fr: 'Expert congolais en énergie et conseiller en politiques publiques, disposant d’une expérience de direction technique et stratégique dans le secteur électrique de la République démocratique du Congo. Coordonnateur de la Cellule d’appui technique et économique (CATE), il dirige la planification, l’analyse économique et la validation de projets énergétiques nationaux. Son parcours comprend la fonction de directeur de cabinet au ministère de l’Énergie et des Ressources hydrauliques et la présidence du comité de pilotage de la centrale hydroélectrique de Busanga.',
    focusEn: 'Energy projects · Public policy · Economic analysis', focusFr: 'Projets énergétiques · Politiques publiques · Analyse économique',
  },
];

export const routePages = {
  home: { fr: ['Conseil énergétique et électricité en Afrique', 'Conseil stratégique et solutions énergétiques pour les marchés de l’électricité, les infrastructures et les projets en Afrique.'], en: ['Energy Advisory and Power in Africa', 'Strategic energy advisory and power solutions for electricity markets, infrastructure and projects in Africa.'] },
  services: { fr: ['Services et secteurs', 'Conseil énergétique, infrastructures électriques et appui aux projets pour les secteurs public et privé.'], en: ['Services & Industries', 'Energy advisory, power infrastructure and project support for public and private sector organizations.'] },
  search: { fr: ['Recherche sur le site', 'Recherchez les services, secteurs et expertises présentés par Africa Power Advisory Holdings.'], en: ['Search the website', 'Search services, industries and expertise presented by Africa Power Advisory Holdings.'] },
  about: { fr: ['À propos', 'Conseil énergétique et accompagnement stratégique pour le secteur de l’électricité.'], en: ['About', 'Energy advisory and strategic support for the electricity sector.'] },
  projects: { fr: ['Projets', 'Consultez les projets vérifiés d’Africa Power Advisory Holdings.'], en: ['Projects', 'Explore verified projects from Africa Power Advisory Holdings.'] },
  insights: { fr: ['Analyses', 'Analyses et publications sur l’énergie et le secteur de l’électricité.'], en: ['Insights', 'Research and publications on energy and the electricity sector.'] },
  actuality: { fr: ['Actualités', 'Actualités vérifiées d’Africa Power Advisory Holdings.'], en: ['Actuality', 'Verified company updates from Africa Power Advisory Holdings.'] },
  sustainability: { fr: ['Durabilité', 'Transition énergétique et durabilité.'], en: ['Sustainability', 'Energy transition and sustainability.'] },
  experts: { fr: ['Nos experts', 'Découvrez les experts présentés par Africa Power Advisory Holdings.'], en: ['Our experts', 'Meet the experts presented by Africa Power Advisory Holdings.'] },
  careers: { fr: ['Carrières', 'Possibilités de carrière et candidatures auprès d’Africa Power Advisory Holdings.'], en: ['Careers', 'Career opportunities and applications at Africa Power Advisory Holdings.'] },
  contact: { fr: ['Nous joindre', 'Contactez Africa Power Advisory Holdings au sujet de vos enjeux énergétiques.'], en: ['Contact our team', 'Contact Africa Power Advisory Holdings about your energy priorities.'] },
  newsletter: { fr: ['Infolettre', 'Recevez les actualités de l’entreprise par courriel.'], en: ['Newsletter', 'Receive company updates by email.'] },
  privacy: { fr: ['Confidentialité', 'Information sur le traitement des demandes, candidatures, préférences et cookies.'], en: ['Privacy', 'Information about inquiries, applications, preferences and cookies.'] },
  cookies: { fr: ['Politique relative aux témoins', 'Information sur les témoins et le contrôle des préférences.'], en: ['Cookie Policy', 'Information about cookies and managing preferences.'] },
  terms: { fr: ['Conditions d’utilisation', 'Conditions d’accès et d’utilisation de ce site.'], en: ['Terms and Conditions', 'Terms governing access to and use of this website.'] },
  legal: { fr: ['Mentions légales', 'Identification et informations légales de l’éditeur du site.'], en: ['Legal Notices', 'Publisher identification and legal information.'] },
  accessibility: { fr: ['Accessibilité', 'Engagement et informations relatives à l’accessibilité du site.'], en: ['Accessibility', 'Accessibility information and commitment.'] },
  consent: { fr: ['Gestion du consentement', 'Gérez les préférences relatives aux témoins et services facultatifs.'], en: ['Consent Management', 'Manage cookie preferences and optional services.'] },
  recruitment: { fr: ['Confidentialité des candidatures', 'Information sur l’utilisation des données de candidature.'], en: ['Recruitment Privacy Notice', 'Information about the use of application data.'] },
};
