import './globals.css'

export const metadata = {
  title: 'Gasper Auto Detailing',
  description: 'Book your auto detailing service',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
