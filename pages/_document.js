import { Html, Head, Main, NextScript } from 'next/document'

// The function that loads things needed for the applicaiton. In this case, it is the font that is used throughout the application.
export default function Document() {
  return (
    <Html>

      {/* Imported font for everything*/}
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
