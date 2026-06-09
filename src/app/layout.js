import './globals.css'

export const metadata = {
  title: 'Canadian Prospects Recruitment',
  description: 'Recruitment intake and athlete profile system for Canadian Prospects Recruitment.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
