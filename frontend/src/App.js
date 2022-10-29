import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

function useFetch(query, page) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState([]);

  const sendQuery = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await axios.get(`http://localhost:8000/api/posts/?page=1`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(window.localStorage.access)}`,
        },
      });
      const { data } = res;
      // console.log(data);
      setList((prev) => [...prev, ...data.results]);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err);
    }
  }, [query, page]);

  useEffect(() => {
    sendQuery(query);
  }, [query, sendQuery, page]);

  return { loading, error, list };
}

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { loading, error, list } = useFetch(query, page);
  const loader = useRef(null);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  return (
    <div className="App">
      <h1>Infinite Scroll</h1>
      <h2>with IntersectionObserver</h2>
      <input type="text" value={query} onChange={handleChange} />
      <div>
        {list.map((item, i) => (
          <div key={i}>{JSON.stringify(item)}</div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error!</p>}
      <div ref={loader} />
    </div>
  );
}

export default App;
