import API from "../api/index";

import { useState } from "react";
import {
  CSS_BORDER,
  CSS_BORDER_Y_LEFT,
  CSS_BORDER_Y_RIGHT,
  CSS_H_FULL,
  CSS_RESPONSIVE_BTN_SIZE,
  CSS_RESPONSIVE_INPUT_HEIGHT,
  CSS_SURFACE_DARK,
  CSS_SURFACE_DARKER,
  CSS_SURFACE_LIGHT,
  CSS_TEXT_HOVER_ACTIVE_COLOR_BASE,
  CSS_WH_full,
  CSS_flexCol_center,
  CSS_flexRow_center,
} from "../libraries/CSS_Main";

import { Search } from "lucide-react";

function Home() {
  const [search, setSearch] = useState("");

  const searchSomething = () => {
    if (search) {
      console.log(search);
      API(search);
      setSearch("");
    } else {
      alert("Input is empty");
      return;
    }
  };

  return (
    <>
      <div
        className={`justify-center pt-14 pb-4 ${CSS_WH_full} ${CSS_flexCol_center} ${CSS_SURFACE_LIGHT}`}
      >
        <div
          className={`w-9/10 md:w-8/10 h-10/10 md:h-9/10 lg:h-9/10 justify-between ${CSS_BORDER} ${CSS_flexCol_center}`}
        >
          <div
            className={`justify-center w-full h-1/10 border-b border-slate-700 ${CSS_flexRow_center} ${CSS_SURFACE_DARKER}`}
          >
            <input
              type="text"
              value={search}
              className={`pl-2.5 w-60 md:w-100 lg:w-100 ${CSS_RESPONSIVE_INPUT_HEIGHT} ${CSS_SURFACE_DARK} ${CSS_BORDER_Y_LEFT}`}
              onChange={(e) => setSearch(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchSomething();
              }}
            />
            <button
              className={`${CSS_RESPONSIVE_BTN_SIZE} ${CSS_RESPONSIVE_INPUT_HEIGHT} ${CSS_SURFACE_DARKER} ${CSS_BORDER_Y_RIGHT} ${CSS_flexCol_center} ${CSS_TEXT_HOVER_ACTIVE_COLOR_BASE}`}
              onClick={() => searchSomething()}
            >
              <Search />
            </button>
          </div>
          <div
            className={`justify-center w-full h-9/10 ${CSS_flexCol_center} ${CSS_SURFACE_LIGHT}`}
          >
            s
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
