// Photography: all of these are Kirti's own photographs, from the folder she shared.
// Each one is served as WebP at two widths (720px for phones, full size for larger
// screens). To add a photo, put the JPG in public/photos, make the two WebP files
// (name-720.webp and name-<width>.webp) and add an entry here.

const photo = (name, width, alt) => ({
  src: `/photos/${name}-${width}.webp`,
  srcSet: width > 720 ? `/photos/${name}-720.webp 720w, /photos/${name}-${width}.webp ${width}w` : undefined,
  alt,
})

export const images = {
  kirtiAuthorPreview: {
    src: '/photos/kirti-author-preview.jpg',
    alt: 'Kirti Verma: Movement and Somatic Educator',
  },
  kirtiForestHero: photo('kirti-forest-hero', 1200, 'Kirti Verma standing among tall pines in a white dress'),
  kirtiPortrait: photo('kirti-portrait', 1200, 'Kirti Verma with her eyes closed, holding a sprig of leaves'),
  kirtiContemplationLeaves: photo(
    'kirti-contemplation-leaves',
    1200,
    'Kirti Verma resting her face against green leaves, eyes closed',
  ),
  kirtiForestGrounding: photo('kirti-forest-grounding', 800, 'Kirti Verma sitting among forest plants, seen from behind'),
  himalayanCedarForest: photo('himalayan-cedar-forest', 1200, 'Cedar trees on a misty mountainside'),

  kirtiCreativeDance: photo('kirti-creative-dance', 1200, 'Kirti Verma dancing barefoot on a dark stage'),
  kirtiDanceMotionBlur: photo('kirti-dance-motion-blur', 1200, 'Kirti Verma turning, her face blurred by the movement'),
  kirtiStageLunge: photo('kirti-stage-lunge', 1200, 'Kirti Verma in a low lunge on a dimly lit stage'),

  kirtiFieldMeadowFlow: photo('kirti-field-meadow-flow', 840, 'Kirti Verma moving slowly in a meadow of tall grass'),
  kirtiFieldPresence: photo('kirti-field-presence', 1200, 'Kirti Verma standing in a field, hands raised in front of her'),
  kirtiFieldSoma: photo('kirti-field-soma', 1200, 'Kirti Verma reaching both arms up in a field under a grey sky'),

  kirtiSomaticTeaching: photo(
    'kirti-somatic-teaching',
    1200,
    'Students lying on a wooden studio floor while Kirti guides them',
  ),
  somaticConstructiveRest: photo(
    'somatic-constructive-rest',
    1200,
    'A student resting on a wooden studio floor with her hands on her belly',
  ),
  kirtiSomaticWorkshop: photo('kirti-somatic-workshop', 1200, 'Kirti Verma in a studio, arms crossed gently over her body'),

  kirtiTaiChiLake: photo('kirti-tai-chi-lake', 1200, 'Kirti Verma in a Tai Chi posture on a rock by a still lake'),
  kirtiTaiChiBlueSky: photo('kirti-tai-chi-blue-sky', 978, 'Kirti Verma in a low Tai Chi stance against a blue sky'),
  kirtiTaiChiCloudHands: photo('kirti-tai-chi-cloud-hands', 900, 'Kirti Verma in a Tai Chi posture by a river, palms forward'),
  kirtiTaiChiHorseStance: photo(
    'kirti-tai-chi-horse-stance',
    900,
    'Kirti Verma in a deep Tai Chi stance with one arm raised, in black and white',
  ),
  kirtiTaiChiSingleWhipBw: photo(
    'kirti-tai-chi-single-whip-bw',
    1048,
    'Kirti Verma in a wide Tai Chi stance in white clothes, in black and white',
  ),
  taiChiGroupClass: photo('soma-studio-group', 1200, 'A Tai Chi group class with arms raised in a bright studio'),

  kirtiSomaticFacilitation: photo(
    'kirti-somatic-facilitation',
    1200,
    'Kirti Verma kneeling beside a participant providing gentle hands-on somatic facilitation',
  ),
  kirtiTaiChiWhiteStance: photo(
    'kirti-tai-chi-white-stance',
    1200,
    'Kirti Verma poised in a balanced Tai Chi posture in traditional white attire',
  ),
  kirtiFieldDance: photo(
    'kirti-field-dance',
    1200,
    'Kirti Verma dancing with arms open wide in an expansive green meadow',
  ),
  kirtiTheatricalPortrait: photo(
    'kirti-theatrical-portrait',
    1200,
    'Kirti Verma seated in contemplative stillness under warm directional light',
  ),
  kirtiForestAwakening: photo(
    'kirti-forest-awakening',
    1200,
    'Kirti Verma mindfully connecting with tall forest trees and moss',
  ),
  kirtiRestingIntegration: photo(
    'kirti-resting-integration',
    1200,
    'A participant resting on a mat in somatic restorative integration',
  ),
  kirtiAtmosphericMovement: photo(
    'kirti-atmospheric-movement',
    1200,
    'Atmospheric movement portrait of Kirti Verma with gentle motion blur',
  ),
  himalayanCedarMisty: photo(
    'himalayan-cedar-misty',
    1200,
    'Misty pine forest on a tranquil mountain slope',
  ),
  kirtiForestPine: photo(
    'kirti-forest-pine',
    1200,
    'Kirti Verma in a grounded posture among woodland trees',
  ),
  kirtiWoodlandStillness: photo(
    'kirti-woodland-stillness',
    1200,
    'Quiet woodland alignment and mindful stillness among tall trees',
  ),
  kirtiMeadowWind: photo(
    'kirti-meadow-wind',
    1200,
    'Organic movement among tall grasses in open countryside',
  ),
  kirtiSomaticGroupCircle: photo(
    'kirti-somatic-group-circle',
    1200,
    'Participants seated in an integration circle on the studio floor',
  ),
  kirtiMeadowCurvedArms: photo(
    'kirti-meadow-curved-arms',
    1200,
    'Kirti Verma moving mindfully with curved arms in an open meadow',
  ),
  kirtiStudioPartnerTouch: photo(
    'kirti-studio-partner-touch',
    1200,
    'Kirti Verma smiling during gentle partner touch in a movement workshop',
  ),
  kirtiStudioReflectiveFlow: photo(
    'kirti-studio-reflective-flow',
    900,
    'Artistic monochrome reflection of Kirti Verma and a partner in floor movement',
  ),
  kirtiContactImprovisation: photo(
    'kirti-contact-improvisation',
    992,
    'Dynamic contact improvisation movement blur between two dancers',
  ),
  kirtiStudioQuadrupedalCrawl: photo(
    'kirti-studio-quadrupedal-crawl',
    1200,
    'Workshop participants exploring quadrupedal floor locomotion',
  ),
  kirtiStudioUpwardGesture: photo(
    'kirti-studio-upward-gesture',
    800,
    'Kirti Verma reaching upward with attentive gaze in studio practice',
  ),
}
