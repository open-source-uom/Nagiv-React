import logo from './logo.svg';
import './App.css';
import Navigation from './pages/Navigation'
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <Navigation/>
      </ChakraProvider>
    </div>
  );
}

export default App;
