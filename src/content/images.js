// Photography. These are stand-ins from Unsplash (free licence) until Kirti's own
// photographs arrive. To replace one, swap its entry for { src: '/photos/name.jpg', alt: '...' }.

const BASE = 'https://images.unsplash.com/photo-'
const WIDTHS = [700, 1100, 1600, 2200]

const url = (id, width) => `${BASE}${id}?auto=format&fit=crop&w=${width}&q=72`

const photo = (id, alt) => ({
  src: url(id, 1400),
  srcSet: WIDTHS.map((width) => `${url(id, width)} ${width}w`).join(', '),
  alt,
})

export const images = {
  wallWalk: photo(
    '1694377162124-f38181cf6700',
    'A person walking beside a white wall dappled with sunlight',
  ),
  floorLight: {
    src: '/photos/kirti-forest-hero.jpg',
    alt: 'Kirti Verma standing tall in white linen among ancient mountain pines',
  },
  taiChiTrees: {
    src: '/photos/kirti-tai-chi-lake.jpg',
    alt: 'Kirti Verma practicing Tai Chi single whip stance on a rock by the tranquil lake with water reflection',
  },
  taiChiWall: photo(
    '1616246672038-82ce1e3a9f72',
    'A man seen from behind, practising beside an old wall and climbing plants',
  ),
  taiChiForm: {
    src: '/photos/kirti-tai-chi-lake.jpg',
    alt: 'Kirti Verma practicing Tai Chi single whip stance on a rock by the tranquil lake with water reflection',
  },
  danceReach: {
    src: '/photos/kirti-creative-dance.jpg',
    alt: 'Kirti Verma moving barefoot in creative dance on a wooden stage in warm light',
  },
  danceTurn: {
    src: '/photos/kirti-creative-dance.jpg',
    alt: 'Kirti Verma moving barefoot in creative dance on a wooden stage in warm light',
  },
  handShadow: photo('1668847309909-c1e9a2d5c5bc', 'The shadow of a raised hand on a sunlit wall'),
  back: photo('1683575136632-81d17d5a2af2', 'A back seen from behind, the shoulder blades in relief'),
  leafShadow: {
    src: '/photos/kirti-portrait.jpg',
    alt: 'Kirti Verma, movement and somatic educator, in calm contemplation with sunlight and leaf shadows',
  },
  arches: {
    src: '/photos/kirti-contemplation-leaves.jpg',
    alt: 'Kirti Verma with eyes closed in calm contemplation, her hand gently touching green leaves in soft natural light',
  },
  curtain: photo('1682421938316-4b186e25174c', 'Sunlight through a linen curtain'),
  studio: {
    src: '/photos/soma-studio-group.jpg',
    alt: 'A diverse group of students practicing standing somatic alignment in a sunlit glass studio with Kirti Verma',
  },
  kirtiPortrait: {
    src: '/photos/kirti-portrait.jpg',
    alt: 'Kirti Verma, movement and somatic educator, in calm contemplation with sunlight and leaf shadows',
  },
  kirtiTaiChiLake: {
    src: '/photos/kirti-tai-chi-lake.jpg',
    alt: 'Kirti Verma practicing Tai Chi single whip stance on a rock by the tranquil lake with water reflection',
  },
  kirtiCreativeDance: {
    src: '/photos/kirti-creative-dance.jpg',
    alt: 'Kirti Verma moving barefoot in creative dance on a wooden stage in warm light',
  },
  somaStudioGroup: {
    src: '/photos/soma-studio-group.jpg',
    alt: 'A diverse group of students practicing standing somatic alignment in a sunlit glass studio with Kirti Verma',
  },
  kirtiForestHero: {
    src: '/photos/kirti-forest-hero.jpg',
    alt: 'Kirti Verma standing tall in white linen among ancient mountain pines',
  },
  kirtiFieldSoma: {
    src: '/photos/kirti-field-soma.jpg',
    alt: 'Kirti Verma reaching upward with open arms in an expansive wild field of grasses under an open sky',
  },
  kirtiSomaticTeaching: {
    src: '/photos/kirti-somatic-teaching.jpg',
    alt: 'Kirti Verma offering hands-on somatic facilitation to students resting on a sunlit studio floor',
  },
  somaticConstructiveRest: {
    src: '/photos/somatic-constructive-rest.jpg',
    alt: 'A student lying in peaceful constructive rest on a wooden studio floor, hands resting on the abdomen in somatic release',
  },
  kirtiContemplationLeaves: {
    src: '/photos/kirti-contemplation-leaves.jpg',
    alt: 'Kirti Verma with eyes closed in calm contemplation, her hand gently touching green leaves in soft natural light',
  },
  himalayanCedarForest: {
    src: '/photos/himalayan-cedar-forest.jpg',
    alt: 'Sunlight filtering through ancient Himalayan cedar and pine trees in morning mist',
  },
  kirtiTaiChiCloudHands: {
    src: '/photos/kirti-tai-chi-cloud-hands.jpg',
    alt: 'Kirti Verma demonstrating Tai Chi standing posture by the lake with mindful hand alignment',
  },
  kirtiForestGrounding: {
    src: '/photos/kirti-forest-grounding.jpg',
    alt: 'Kirti Verma seated in calm somatic grounding among forest ferns with hand resting gently over her heart',
  },
  sideBend: photo('1597586594276-456f8c50b82d', 'A woman seated on the floor in a slow side bend'),
  reach: photo('1620242736370-bfb4ce9ebf3e', 'A woman reaching both arms overhead in window light'),
  notebook: photo('1504542227056-9178533a9175', 'A notebook and pen on a pale desk'),
  forest: photo('1606458669574-2f4de395e078', 'Morning light through a forest'),
  somaticGround: {
    src: '/photos/somatic-constructive-rest.jpg',
    alt: 'A student lying in peaceful constructive rest on a wooden studio floor, hands resting on the abdomen in somatic release',
  },
  somaticRelease: {
    src: '/photos/kirti-somatic-teaching.jpg',
    alt: 'Kirti Verma offering hands-on somatic facilitation to students resting on a sunlit studio floor',
  },
  lowerBackRelease: photo(
    '1545205597-3d9d02c29597',
    'A person resting with ease on a mat in a sunlit room, gentle spinal release',
  ),
  taiChiStanding: photo(
    '1599447421416-3414500d18a5',
    'A tai chi practitioner standing in quiet, grounded contemplation',
  ),
  fluidMovement: photo(
    '1508700115892-45ecd05ae2ad',
    'A dancer moving with expressive fluidity and graceful spinal articulation',
  ),
  sanctuaryInterior: photo(
    '1513694203232-719a280e022f',
    'A serene minimalist room with warm natural materials and soft light',
  ),
  kinfolkStory: {
    src: '/photos/kirti-field-presence.jpg',
    alt: 'Kirti Verma reaching upward with open arms in an expansive wild field of grasses under an open sky',
  },
  kirtiContact: {
    src: '/photos/kirti-field-soma.jpg',
    alt: 'Kirti Verma in mindful somatic presence in a wild field of grain under an open sky',
  },
  contactScenery: {
    src: '/photos/contact-scenery-mountain-mist.jpg',
    alt: 'Tranquil misty mountain valley with pine trees in soft morning light',
  },
  neckShoulderFreedom: photo(
    '1506126613408-eca07ce68773',
    'Mindful seated somatic posture with relaxed neck, dropped shoulders, and natural breath',
  ),
  morningLight: photo(
    '1518495973542-4542c06a5843',
    'Warm morning golden sunlight streaming through foliage',
  ),
  ancientTree: photo(
    '1502082553048-f009c37129b9',
    'A magnificent ancient tree deeply rooted in the earth with sunlight filtering through branches',
  ),
  danceShadow: photo(
    '1508700115892-45ecd05ae2ad',
    'Expressive unchoreographed body movement casting artistic fluid shadows in sunlight',
  ),
  mistCalm: photo(
    '1470240731273-7821a6eeb6bd',
    'Tranquil mountain meadow bathed in soft morning mist',
  ),
  calmWaterRipple: photo(
    '1439066615861-d1af74d74000',
    'Quiet glassy water surface with gentle ripples reflecting mountain stillness',
  ),
  kirtiFieldMeadowFlow: {
    src: '/photos/kirti-field-meadow-flow.jpg',
    alt: 'Kirti Verma moving with somatic ease in a lush open meadow with trees and tall grasses',
  },
  kirtiFieldPresence: {
    src: '/photos/kirti-field-presence.jpg',
    alt: 'Kirti Verma in mindful somatic presence in a wild field of grain under an open sky',
  },
  kirtiSomaticWorkshop: {
    src: '/photos/kirti-somatic-workshop.jpg',
    alt: 'Kirti Verma demonstrating somatic holding release and self-regulation in studio',
  },
  kirtiStageLunge: {
    src: '/photos/kirti-stage-lunge.jpg',
    alt: 'Kirti Verma in dramatic expressive movement on stage in theater light',
  },
  kirtiTaiChiBlueSky: {
    src: '/photos/kirti-tai-chi-blue-sky.jpg',
    alt: 'Kirti Verma practicing grounded Tai Chi stance on natural rock under a clear blue sky',
  },
  kirtiTaiChiHorseStance: {
    src: '/photos/kirti-tai-chi-horse-stance.jpg',
    alt: 'Kirti Verma demonstrating deep rooted Tai Chi horse stance on natural rock',
  },
  kirtiTaiChiSingleWhipBw: {
    src: '/photos/kirti-tai-chi-single-whip-bw.jpg',
    alt: 'Kirti Verma practicing Tai Chi single whip stance on rock in high contrast black and white',
  },
  kirtiDanceMotionBlur: {
    src: '/photos/kirti-dance-motion-blur.jpg',
    alt: 'Kirti Verma in dynamic spinning motion blur in creative dance inquiry',
  },
}
