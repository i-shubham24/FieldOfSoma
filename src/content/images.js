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
  floorLight: photo(
    '1653486304263-ab872c1f4997',
    'A woman resting on her back on the floor in a patch of sunlight',
  ),
  taiChiTrees: photo('1773204989457-57809a3cda73', 'A man practising tai chi among tall trees'),
  taiChiWall: photo(
    '1616246672038-82ce1e3a9f72',
    'A man seen from behind, practising beside an old wall and climbing plants',
  ),
  taiChiForm: photo(
    '1588419683124-d3864b87bc7c',
    'A tai chi practitioner in white, low in a long stance',
  ),
  danceReach: photo(
    '1602800805409-f40cc632bb05',
    'A dancer in a pale dress, one arm lifted, in warm low light',
  ),
  danceTurn: photo('1670694658790-13fc6e45dc1b', 'A dancer mid-turn, her dress lifting behind her'),
  handShadow: photo('1668847309909-c1e9a2d5c5bc', 'The shadow of a raised hand on a sunlit wall'),
  back: photo('1683575136632-81d17d5a2af2', 'A back seen from behind, the shoulder blades in relief'),
  leafShadow: photo('1674708271645-4d77f9d68707', 'Leaf shadows across a warm plaster wall'),
  arches: photo('1617597190828-1bf579d485ee', 'A pale arched corridor with a sheer curtain'),
  curtain: photo('1682421938316-4b186e25174c', 'Sunlight through a linen curtain'),
  studio: photo(
    '1676496962536-d8ef110ff6f0',
    'A quiet white studio with round windows and mats on the floor',
  ),
  sideBend: photo('1597586594276-456f8c50b82d', 'A woman seated on the floor in a slow side bend'),
  reach: photo('1620242736370-bfb4ce9ebf3e', 'A woman reaching both arms overhead in window light'),
  notebook: photo('1504542227056-9178533a9175', 'A notebook and pen on a pale desk'),
  forest: photo('1606458669574-2f4de395e078', 'Morning light through a forest'),
}
