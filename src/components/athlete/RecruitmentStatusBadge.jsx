const statusLabels = {
  New: 'New Prospect',
  Reviewing: 'Under Review',
  Contacted: 'Active Outreach',
  Placed: 'Offer Received',
  Closed: 'Closed'
}

export default function RecruitmentStatusBadge({ status }) {
  const label = statusLabels[status] || status || 'New Prospect'

  return <span className="recruitmentStatusBadge">{label}</span>
}
