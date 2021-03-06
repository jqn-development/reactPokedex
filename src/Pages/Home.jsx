import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import SearchBar from "../components/SearchBar/Searchbar";
import Pokedex from "../components/Pokedex/Pokedex";

import "./pages.css";
import CardMobile from "../components/Cards/CardMobile";

export default function Home() {
  function importAll(r) {
    let images = {};
    // eslint-disable-next-line array-callback-return
    r.keys().map((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  }

  const images = importAll(
    require.context("../assets/pokemons/", false, /\.(png|jpe?g|svg)$/)
  );

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 767px)",
  });
  const isMobile = useMediaQuery({
    query: "(max-width: 767px)",
  });

  const [name, setName] = useState("");
  const [number, setNumber] = useState(0);
  const [value, setValue] = useState("");
  const [hp, setHp] = useState([]);
  const [attack, setAttack] = useState([]);
  const [defense, setDefense] = useState([]);

  const color =
    "linear-gradient(to bottom right, rgba(53,106,188,1), rgba(255,205,0,.7))";

  useEffect(() => {
    

    const get = async () => {
      
        const response = await fetch("https://pokeapi.co/api/v2/pokedex/2/");
        const data = await response.json();
        const pokemons = data.pokemon_entries;

        for (let i = 0; i < pokemons.length; i++) {
          const pokemonsName = [pokemons[i].pokemon_species.name];
          const pokemonsNumber = [pokemons[i].entry_number];
          pokemonsName.forEach((pokemonName) => {
            if (pokemonName === value) {
              setName(pokemonName);
              setNumber(pokemonsNumber);
            }
          });
        }
      }
    

    document.body.style.background = color;

    document.body.style.height = "100vh";

    get();

   
  }, [value]);

  useEffect(() => {
    if (number > 0) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${number}/`)
        .then((res) => res.json())
        .then((dataUrl) => {
          const hp = dataUrl.stats[0].base_stat;
          const attack = dataUrl.stats[1].base_stat;
          const defense = dataUrl.stats[2].base_stat;

          setHp(hp);
          setAttack(attack);
          setDefense(defense);
        });
    }
  }, [number]);

  const handleValue = (e) => {
    setValue(e.target.value.toLowerCase());
  };

  return (
    <div className="container" style={{}}>
      <SearchBar focus={true} updateValue={handleValue} />
      {isDesktopOrLaptop && (
        <div className="container">
          <Pokedex
            name={name.toUpperCase()}
            hp={hp}
            attack={attack}
            defense={defense}
            number={number}
            photo={<img src={images[`${number}.png`]} alt={name} />}
          />
        </div>
      )}

      {isMobile && (
        <CardMobile
          name={name.toUpperCase()}
          photo={<img src={images[`${number}.png`]} alt={name} />}
          id={number}
          hp={hp}
          attack={attack}
          defense={defense}
        />
      )}
    </div>
  );
}
