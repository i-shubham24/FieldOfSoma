import useTitle from '../lib/useTitle'
import Invitation from '../sections/home/Invitation'
import KinfolkStory from '../sections/home/KinfolkStory'
import Manifesto from '../sections/home/Manifesto'
import Masthead from '../sections/home/Masthead'
import Pillars from '../sections/home/Pillars'
import Voices from '../sections/home/Voices'
import Window from '../sections/home/Window'

// Kirti asked for a minimal first page, so descriptions stay short here and the longer
// text lives on the inner pages.
export default function Home() {
  useTitle('', {
    description:
      'Field of Soma: Somatic Movement Therapy and Tai Chi with Kirti Verma. Gentle, body-based practices for releasing held tension and moving with ease.',
    path: '/',
  })

  return (
    <>
      <Masthead />
      <Manifesto />
      <KinfolkStory />
      <Pillars />
      <Window />
      <Voices />
      <Invitation />
    </>
  )
}
