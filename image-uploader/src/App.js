import React,{useEffect} from 'react';
import Home from './pages/Home';
import Detection from './pages/Detection';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

function App() {
  const useScrollToTop = () => {
    const location = useLocation();
    useEffect(() => {
      window.scrollTo({ top: 0 });
     // scroll to the top of the browser window when changing route
     // the window object is a normal DOM object and is safe to use in React.
    }, [location]);
  };

  //console.log(account);
  return (
    <div className="App">
      
	<Router>
		<Routes>
			<Route exact path="/" element={<Home/>}></Route>
			<Route exact path="/detect" element={<Detection/>}></Route>
		</Routes>
	</Router>
    
	</div>
  );
}

export default App;

