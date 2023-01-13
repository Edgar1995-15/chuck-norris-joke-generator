import { useState, useRef, useEffect } from "react";

const API_URL = "https://api.chucknorris.io/jokes/random";
const FAVOURITES_STORAGE_KEY = "myFavourites";
const FAVOURITES_LIMIT = 10;

function App() {
  const [joke, setJoke] = useState<string>("");
  const [isJoking, setIsJoking] = useState<boolean>(false);
  const [favourites, setFavourites] = useState<string[]>(
    JSON.parse(localStorage.getItem(FAVOURITES_STORAGE_KEY) || "[]")
  );
  const [isFavourite, setIsFavourite] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites]);

  const generateJoke = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setJoke(data.value);
      setIsFavourite(false);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleJoking = () => {
    setIsJoking((prev) => !prev);
    if (!isJoking) {
      intervalRef.current = setInterval(() => {
        generateJoke();
      }, 3000);
    } else {
      clearInterval(intervalRef.current as unknown as number);
      intervalRef.current = null;
    }
  };

  const toggleFavourite = () => {
    setIsFavourite((prev) => !prev);
    if (isFavourite) {
      setFavourites((prev) => prev.filter((e) => e !== joke));
    } else {
      if (favourites.length === FAVOURITES_LIMIT) {
        favourites.shift();
      }
      setFavourites((prev) => [...prev, joke]);
    }
  };

  const removeAllFavourites = () => {
    setFavourites([]);
    localStorage.removeItem(FAVOURITES_STORAGE_KEY);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-around bg-yellow-100">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl">Chuck Norris Jokes</h1>
        <p className="text-center mt-5 text-green-500">{joke}</p>
      </div>
      <div className="w-full flex justify-around">
        <button
          className="bg-sky-500/100 border-0 rounded-xl text-white w-48 h-20 cursor-pointer"
          onClick={generateJoke}>
       
          Get joke
          </button>
          <button
            className="bg-sky-500/100 border-0 rounded-xl text-white w-48 h-20 cursor-pointer"
            onClick={toggleJoking}
          >
            {!isJoking ? "Start Joking" : "Stop Joking"}
          </button>
          <button
            className="bg-sky-500/100 border-0 rounded-xl text-white w-48 h-20 cursor-pointer"
            onClick={toggleFavourite}
          >
            {isFavourite ? "Remove from favourites" : "Add to favourites"}
          </button>
          <button
            className="bg-sky-500/100 border-0 rounded-xl text-white w-48 h-20 cursor-pointer"
            onClick={removeAllFavourites}
          >
            Remove All Favourites
          </button>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-3xl">My Favourites</h1>
          <div className="w-3/5">
            <h4 className="text-lg text-center mt-5 text-green-500">
              {favourites.join(", ")}
            </h4>
          </div>
        </div></div>
  );
}

export default App;
      