
import '../styles/globals.css'
import StoreProvider from '@/store/store-context';



function App({ Component, pageProps }) {
  return (
    <StoreProvider>
  <Component {...pageProps} />
  </StoreProvider>);

<div>
  <footer>
    <p>Mr.Riddle</p>
  </footer>
      </div>
}

export default App;