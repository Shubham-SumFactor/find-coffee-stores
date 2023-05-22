import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render(){
    return <Html lang='en'>
    
      <Head> 
        <link rel = "preload"
         href="/fonts/IBMPlexSans-Bold.tff"
         as = "font"
         crossOrigin="anonymous"></link>

          <link rel = "preload"
                   href="/fonts/IBMPlexSans-Regular.tff"
                   as = "font"
                   crossOrigin="anonymous"></link>

          <link rel = "preload"
                   href="/fonts/IBMPlexSans-SemiBold.tff"
                   as = "font"
                   crossOrigin="anonymous"></link>


      </Head>

      <body>

        <Main> </Main>
        <NextScript />

      </body>
    </Html>;
    }

}

export default MyDocument;










/*import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
*/