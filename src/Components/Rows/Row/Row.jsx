import PropTypes from "prop-types";
import axios from "../../../utils/axios";
import { useState, useEffect } from "react";
import "./Row.css";
import movieTrailer from "movie-trailer";
import YouTube from "react-youtube";

const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovie] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  const base_url = "https://image.tmdb.org/t/p/original";

  useEffect(() => {
    (async () => {
      try {
        // console.log(fetchUrl);
        const request = await axios.get(fetchUrl);
        // console.log(request);
        setMovie(request.data.results);
      } catch (error) {
        console.log("error", error);
      }
    })();
  }, [fetchUrl]);

  const handleClick = (movie) => {
    if (trailerUrl) {
      setMovie("");
    } else {
        movieTrailer(movie?.title || movie?.name || movie?.original_name)
        .then((url) => {
            // console.log(url);
            const urlParams = new URLSearchParams(new URL(url).search);
            // console.log(urlParams);
            // console.log(urlParams.get('v'));
            setTrailerUrl(urlParams.get('v'));
        })
    }
  };

    const opts = {
      height: '390',
      width: '100%',
      playerVars: {
          autoplay: 1,
      },
    }

  return (
    <div className="row">
      <h1>{title}</h1>
      <div className="row_posters">
        {movies?.map((movie, index) => (
          <img
            onClick={() => handleClick(movie)}
            key={index}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
          />
        ))}
      </div>
      <div style={{padding: '40px'}}>
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      </div>
    </div>
  );
};

Row.propTypes = {
    title: PropTypes.string.isRequired,  // Ensures title is a required string
    fetchUrl: PropTypes.string.isRequired,  // Ensures fetchUrl is a required string
    isLargeRow: PropTypes.bool,  // isLargeRow is optional but should be a boolean
  };

export default Row;
