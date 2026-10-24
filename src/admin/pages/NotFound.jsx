import { Link } from 'react-router-dom'
import useAdminTitle from '../useAdminTitle'
import { button, PageHeader } from '../ui'

export default function NotFound() {
  useAdminTitle('Page not found')
  return (
    <div className="flex flex-col gap-7">
      <PageHeader title="Page not found" />
      <p className="text-[0.9375rem] text-[#5E5045]">There is no admin page at this address. It may have been deleted, or the link may be mistyped.</p>
      <Link to="/admin" className={`${button.outline} self-start`}>
        Back to the dashboard
      </Link>
    </div>
  )
}
