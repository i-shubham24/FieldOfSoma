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
    'Students lying on a studio floor during a somatic class while Kirti guides them',
  ),
  somaticConstructiveRest: photo(
    'somatic-constructive-rest',
    1200,
    'A student resting on the studio floor with her hands on her belly',
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
}
