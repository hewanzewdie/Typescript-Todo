import Home from "./Components/Home";
import "./App.css";

type AppProps = {
  setIsAuthenticated: (val: boolean) => void;
};

function App({ setIsAuthenticated }: AppProps) {
  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <div className="bg-gray-100 p-6 rounded sm:w-full md:w-1/2">
        <Home setIsAuthenticated={setIsAuthenticated} />
      </div>
    </div>
  );
}

export default App;
