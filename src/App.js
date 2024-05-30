import React, { useEffect, useState } from "react";
import { Collection } from "./Collection";
import "./index.scss";

const categories = [
  { name: "All" },
  { name: "Sea" },
  { name: "Mountains" },
  { name: "Architecture" },
  { name: "Cities" },
];

function App() {
  const [categoryId, setCategoryId] = useState(0);
  const [page, setPage] = useState(1);
  const [setLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const categoryParam = categoryId ? `&category=${categoryId}` : '';
    fetch(
      `https://6654e7b83c1d3b602937bf48.mockapi.io/collections?page=${page}&limit=3${categoryParam}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setCollections(json);
        } else {
          setCollections([]);
          console.warn("API response is not an array");
        }
      })
      .catch((err) => {
        console.warn(err);
        alert("Data is not fetching...");
      })
      .finally(() => setIsLoading(false));
  }, [categoryId, page]);


  return (
    <div className="App">
      <h1>Photo-collection</h1>
      <div className="top">
        <ul className="tags">
          {categories.map((obj, i) => (
            <li
              onClick={() => setCategoryId(i)}
              className={categoryId === i ? "active" : ""}
              key={obj.name}
            >
              {obj.name}
            </li>
          ))}
        </ul>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          placeholder="Name search..."
        />
      </div>
      <div className="content">
        {setLoading ? (
          <h2>Loading...</h2>
        ) : (
          collections
            .filter((obj) => {
              return (
                typeof searchValue === "string" &&
                obj.name &&
                obj.name.toLowerCase().includes(searchValue.toLowerCase())
              );
            })
            .map((obj, index) => (
              <Collection key={index} name={obj.name} images={obj.photos} />
            ))
        )}
      </div>
      <ul className="pagination">
        {[...Array(5)].map((_, i) => (
          <li
            onClick={() => setPage(i+1)}
            className={page === i + 1 ? "active" : ""}
          >
            {i + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
