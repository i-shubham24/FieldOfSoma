import useTitle from '../lib/useTitle'
import Convergence from '../sections/home/Convergence'
import Invitation from '../sections/home/Invitation'
import KinfolkStory from '../sections/home/KinfolkStory'
import Manifesto from '../sections/home/Manifesto'
import Masthead from '../sections/home/Masthead'
import Pillars from '../sections/home/Pillars'
import Voices from '../sections/home/Voices'
import Window from '../sections/home/Window'

export default function Home() {
  useTitle('', {
    description:
      'Field of Soma: Clinical Somatics, Tai Chi, and Creative Movement with Kirti Verma. Gentle, neuromuscular education to release chronic tension and restore ease.',
    path: '/',
  })

  return (
    <>
      <Masthead />
      <Manifesto />
      <KinfolkStory />
      <Pillars />
      <Convergence />
      <Window />
      <Voices />
      <Invitation />
    </>
  )
}
