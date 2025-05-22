
import { EthicalCriteria, Genre, Media, MediaEvaluation } from '@/types';
import { EthicalRating } from "@/types";


export const genres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Aventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comédie' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentaire' },
  { id: 18, name: 'Drame' },
  { id: 10751, name: 'Famille' },
  { id: 14, name: 'Fantastique' },
  { id: 36, name: 'Histoire' },
  { id: 27, name: 'Horreur' },
  { id: 10402, name: 'Musique' },
  { id: 9648, name: 'Mystère' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science-Fiction' },
  { id: 10770, name: 'Téléfilm' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'Guerre' },
  { id: 37, name: 'Western' }
];

export const ethicalCriteriaOptions: EthicalCriteria[] = [
  {
    id: 'animal_violence',
    label: 'Violence envers les animaux',
    description: 'Scènes de maltraitance, abattage, souffrance animale (même implicite)',
    checked: false
  },
  {
    id: 'hunting_fishing',
    label: 'Scènes de pêche / chasse',
    description: 'Présence explicite ou valorisation implicite',
    checked: false
  },
  {
    id: 'entertainment_use',
    label: 'Animaux utilisés comme divertissement',
    description: 'Cirque, zoo, aquarium, corrida, équitation, etc.',
    checked: false
  },
  {
    id: 'constraining_treatment',
    label: 'Traitement contraignant ou humiliant',
    description: 'Dressage, captivité, comportement stressé ou forcé',
    checked: false
  },
  {
    id: 'speciesist_content',
    label: 'Contenu pro-spéciste',
    description: 'Hiérarchie implicite, justification de l\'exploitation, moquerie ou invisibilisation des animaux',
    checked: false
  },
  {
    id: 'animal_consumption',
    label: 'Glorification de la consommation animale',
    description: 'Barbecue, steak, lait, chasse ou pêche présentés sans nuance',
    checked: false
  },
  {
    id: 'problematic_context',
    label: 'Présence d\'animaux dans un cadre problématique',
    description: 'Animaux visibles à l\'écran dans un contexte de captivité, de contrainte ou de détournement de leur environnement naturel',
    checked: false
  },
  {
    id: 'problematic_representation',
    label: 'Représentation animale problématique (même animée)',
    description: 'Stéréotype, enfermement ou exploitation banalisés dans une œuvre animée ou en image de synthèse',
    checked: false
  },
  {
    id: 'vegan_character',
    label: 'Présence d\'un personnage végane ou antispéciste',
    description: 'Un personnage remet en question l\'usage des animaux ou exprime une sensibilité éthique',
    checked: false
  },
  {
    id: 'educational_message',
    label: 'Message critique ou éducatif sur l\'exploitation animale',
    description: 'Le film sensibilise clairement sur la souffrance ou les droits des animaux',
    checked: false
  }
];

export const mockMovies: Media[] = [
  {
    id: 1,
    title: 'Okja',
    overview: 'Une jeune fille risque tout pour empêcher une puissante multinationale de kidnapper son meilleur ami - un cochon géant nommé Okja.',
    posterPath: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    backdropPath: null,
    releaseDate: '2017-06-28',
    genreIds: [18, 878, 12],
    mediaType: 'movie'
  },
  {
    id: 2,
    title: 'Cowspiracy',
    overview: 'Un documentaire qui suit le parcours d\'un cinéaste environnementaliste alors qu\'il dévoile l\'industrie la plus destructrice de la planète et enquête pourquoi les principales organisations environnementales ne veulent pas en parler.',
    posterPath: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
    backdropPath: null,
    releaseDate: '2014-06-26',
    genreIds: [99],
    mediaType: 'movie'
  },
  {
    id: 3,
    title: 'Babe, le cochon devenu berger',
    overview: 'Un cochon qui veut être un chien de berger défie les conventions et change son destin.',
    posterPath: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    backdropPath: null,
    releaseDate: '1995-07-18',
    genreIds: [35, 18, 10751],
    mediaType: 'movie'
  },
  {
    id: 4,
    title: 'The Game Changers',
    overview: 'Un documentaire sur les athlètes d\'élite végétariens et leurs performances physiques.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '2018-01-19',
    genreIds: [99],
    mediaType: 'movie'
  },
  {
    id: 5,
    title: 'Earthlings',
    overview: 'Un documentaire sur la dépendance de l\'humanité aux animaux pour les animaux de compagnie, la nourriture, l\'habillement, le divertissement et la recherche scientifique.',
    posterPath: null,
    backdropPath: null,
    releaseDate: '2005-09-24',
    genreIds: [99],
    mediaType: 'movie'
  }
];

export const mockTvShows: Media[] = [
  {
    id: 101,
    title: 'BoJack Horseman',
    overview: 'Dans un monde où humains et animaux anthropomorphes coexistent, BoJack Horseman, une ancienne star de sitcom des années 90, tente de relancer sa carrière.',
    posterPath: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    backdropPath: null,
    firstAirDate: '2014-08-22',
    genreIds: [16, 35, 18],
    mediaType: 'tv'
  },
  {
    id: 102,
    title: 'Tiger King',
    overview: 'Une exploration du monde des éleveurs de grands félins en Amérique et des personnalités excentriques qui le peuplent.',
    posterPath: null,
    backdropPath: null,
    firstAirDate: '2020-03-20',
    genreIds: [99],
    mediaType: 'tv'
  },
  {
    id: 103,
    title: 'Our Planet',
    overview: 'Une série documentaire mettant en valeur les merveilles naturelles de notre planète.',
    posterPath: null,
    backdropPath: null,
    firstAirDate: '2019-04-05',
    genreIds: [99],
    mediaType: 'tv'
  }
];

export const mockEvaluations: MediaEvaluation[] = [
  {
    id: '1',
    mediaId: 1,
    mediaType: 'movie',
    username: 'VeganActivist',
    rating: 'green',
    comment: 'Un film qui dénonce brillamment l\'industrie de la viande et notre rapport aux animaux. Très émouvant et éducatif!',
    criteria: [
      {...ethicalCriteriaOptions[0], checked: true},
      {...ethicalCriteriaOptions[4], checked: true},
      {...ethicalCriteriaOptions[8], checked: true},
      {...ethicalCriteriaOptions[9], checked: true},
    ],
    createdAt: '2023-05-10T14:48:00.000Z'
  },
  {
    id: '2',
    mediaId: 2,
    mediaType: 'movie',
    username: 'EcoWarrior',
    rating: 'green',
    comment: 'Documentaire essentiel qui fait le lien entre l\'élevage et la destruction environnementale. A voir absolument!',
    criteria: [
      {...ethicalCriteriaOptions[4], checked: true},
      {...ethicalCriteriaOptions[9], checked: true},
    ],
    createdAt: '2023-04-22T09:15:00.000Z'
  },
  {
    id: '3',
    mediaId: 3,
    mediaType: 'movie',
    username: 'AnimalLover',
    rating: 'yellow',
    comment: 'Film touchant qui humanise les cochons mais qui présente quand même l\'élevage sous un jour acceptable.',
    criteria: [
      {...ethicalCriteriaOptions[3], checked: true},
      {...ethicalCriteriaOptions[4], checked: true},
    ],
    createdAt: '2023-06-05T18:30:00.000Z'
  },
  {
    id: '4',
    mediaId: 101,
    mediaType: 'tv',
    username: 'SeriesAddict',
    rating: 'yellow',
    comment: 'Malgré l\'anthropomorphisme, la série aborde parfois le spécisme de manière intéressante.',
    criteria: [
      {...ethicalCriteriaOptions[8], checked: true},
    ],
    createdAt: '2023-05-28T21:10:00.000Z'
  }
];

export const combineMedia = () => {
  return [...mockMovies, ...mockTvShows].sort((a, b) => {
    const dateA = new Date(a.releaseDate || a.firstAirDate || '');
    const dateB = new Date(b.releaseDate || b.firstAirDate || '');
    return dateB.getTime() - dateA.getTime();
  });
};

export const getMediaById = (id: number, mediaType: 'movie' | 'tv'): Media | undefined => {
  if (mediaType === 'movie') {
    return mockMovies.find(movie => movie.id === id);
  } else {
    return mockTvShows.find(tvShow => tvShow.id === id);
  }
};

export const getEvaluationsForMedia = (id: number, mediaType: 'movie' | 'tv'): MediaEvaluation[] => {
  return mockEvaluations.filter(
    evaluation => evaluation.mediaId === id && evaluation.mediaType === mediaType
  );
};

export const getRatingForMedia = (id: number, mediaType: 'movie' | 'tv'): EthicalRating => {
  const evaluations = getEvaluationsForMedia(id, mediaType);
  
  if (evaluations.length === 0) return 'unrated';
  
  const ratings = {
    green: 0,
    yellow: 0,
    red: 0
  };
  
  evaluations.forEach(evaluation => {
    if (evaluation.rating in ratings) {
      ratings[evaluation.rating as keyof typeof ratings] += 1;
    }
  });
  
  if (ratings.green > ratings.yellow && ratings.green > ratings.red) return 'green';
  if (ratings.yellow > ratings.green && ratings.yellow > ratings.red) return 'yellow';
  if (ratings.red > ratings.green && ratings.red > ratings.yellow) return 'red';
  
  // En cas d'égalité, on priorise par ordre de sévérité
  if (ratings.red > 0) return 'red';
  if (ratings.yellow > 0) return 'yellow';
  return 'green';
};
