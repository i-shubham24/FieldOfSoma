import useTitle from '../lib/useTitle'
import Invitation from '../sections/home/Invitation'
import KinfolkStory from '../sections/home/KinfolkStory'
import Manifesto from '../sections/home/Manifesto'
import Masthead from '../sections/home/Masthead'
import Pillars from '../sections/home/Pillars'
import Voices from '../sections/home/Voices'
import Window from '../sections/home/Window'
import { pages } from '../content/seo'

// Kirti asked for a minimal first page, so descriptions stay short here and the longer
// text lives on the inner pages.
export default function Home() {
  useTitle(pages.home)

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
