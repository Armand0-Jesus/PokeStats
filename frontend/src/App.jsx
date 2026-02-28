import { useState } from "react";
import "./App.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000").replace(/\/$/, "");

function App() {
  const [pokemon, setPokemon] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = pokemon.trim();
    if (!name) {
      setError("Please enter a Pokemon name");
      setData(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pokemon: name }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Request failed");
      }
      setData(json);
    } catch (err) {
      setData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Pokemon Base Stats</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={pokemon}
          onChange={(e) => setPokemon(e.target.value)}
          placeholder="Select a Pokemon"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
        <hr />
      </form>

      {error && <p>{error}</p>}

      {data && (
        <section>
          <h2>
            {data.name
              ? data.name.charAt(0).toUpperCase() + data.name.slice(1)
              : ""}
          </h2>
          {data.sprite && <img src={data.sprite} alt={data.name} />}
          <p>Type: {(data.types ?? []).join(", ")}</p>
          <ul className="stats-list">
            {(data.stats ?? []).map((stat) => (
              <li key={stat.name}>
                {stat.name}: {stat.base_stat}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

export default App;
