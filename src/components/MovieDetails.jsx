import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const MovieDetails = ({ id, onClose, KEY, onAddWatched, watched }) => {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: id,
      title,
      year,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onClose();
  };

  const isWatched = watched.map((movie) => movie.imdbID).includes(id);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === id
  )?.userRating;

  useEffect(() => {
    const callback = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [onClose]);

  useEffect(() => {
    async function fetchMovie() {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&i=${id}`
      );
      const data = await response.json();
      setMovie(data);
    }
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return () => (document.title = "usePopcorn");
  }, [title]);

  return (
    <div className="details" key={id}>
      <header>
        <button className="btn-back" onClick={onClose}>
          &larr;
        </button>
        <img src={poster} alt={`Poster of ${movie} movie`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span> {imdbRating} IMDb rating
          </p>
        </div>
      </header>

      <section>
        <div className="rating">
          {!isWatched ? (
            <>
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={setUserRating}
              />
              {userRating > 0 && (
                <button className="btn-add" onClick={handleAdd}>
                  +Add to list
                </button>
              )}
            </>
          ) : (
            <p>You rated the movie {watchedUserRating} ⭐️ </p>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
};

export default MovieDetails;
