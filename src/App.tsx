import { useState, useRef, useEffect } from "react";

const API_URL = "https://api.chucknorris.io/jokes/random";

function App() {
  const [joke, setJoke] = useState<string>("");
  const [joking, setJoking] = useState<boolean>(false);
  const favouriteList = localStorage.getItem("myFavourites");
  const [favourites, setFavourites] = useState<string | null | string[]>(
    favouriteList
  );
  const [dubleClickFavourites, setDubleClickFavourites] =
    useState<boolean>(false);

  const intervalRef: any = useRef(null);
  //smth

  const generateJoke = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setJoke(data.value));
    setDubleClickFavourites(false);
  };

  const startJoking = () => {
    setJoking(!joking);
    intervalRef.current = setInterval(() => {
      generateJoke();
    }, 3000);
  };

  const stopJoking = () => {
    setJoking(!joking);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    localStorage.setItem("myFavourites", favourites as string);
  });

  const addToFavourites = () => {
    setFavourites([...(favourites as string[]), joke]);
    setDubleClickFavourites(!dubleClickFavourites);
    if (favourites?.includes(joke)) {
      setFavourites((favourites as string[]).filter((e: string) => e !== joke));
    }
    if ((favourites as string[]).length === 10) {
      (favourites as string[]).shift();
    }
  };

  const removeAllFavourites = () => {
    setFavourites([]);
    localStorage.removeItem("myFavourites");
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
          onClick={generateJoke}
        >
          Get joke
        </button>
        <button
          className="bg-sky-500/100 border-0 rounded-xl text-white w-48 h-20 cursor-pointer"
          onClick={!joking ? startJoking : stopJoking}
        >
          {!joking ? "Start Joking" : "Stop Joking"}
        </button>
        <button
          className="bg-sky-500/100 border-0 rounded-xl text-white w-48 h-20 cursor-pointer"
          onClick={addToFavourites}
          type="button"
        >
          {dubleClickFavourites ? "Remove this favourite" : "Add to favourites"}
        </button>
        <button
          className="bg-sky-500/100 border-0 rounded-xl text-white w-48 h-20 cursor-pointer"
          onClick={removeAllFavourites}
          type="button"
        >
          Remove All Favourites
        </button>
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <h1 className="text-3xl">My Favourites</h1>
        <div className="w-3/5">
          <h4 className="text-lg text-center mt-5 text-green-500">{favourites}</h4>
        </div>
      </div>
    </div>
  );
}

export default App;
