import API from "../api/index";

import { useState } from "react";
import {
  CSS_BORDER_Y_LEFT,
  CSS_BORDER_Y_RIGHT,
  CSS_RING,
  CSS_SHADOW_SM,
  CSS_RESPONSIVE_BTN_SIZE,
  CSS_RESPONSIVE_INPUT_HEIGHT,
  CSS_TEXT_HOVER_ACTIVE_COLOR_BASE,
  CSS_WH_full,
  CSS_flexCol_between,
  CSS_flexCol_center,
  CSS_flexRow_center,
  CSS_COLOR_50,
  CSS_COLOR_950,
  CSS_COLOR_700,
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
        className={`justify-center pt-14 pb-4 ${CSS_WH_full} ${CSS_flexCol_center} ${CSS_COLOR_50}`}
      >
        <div
          className={`w-9/10 md:w-8/10 h-10/10 md:h-9/10 lg:h-9/10 ${CSS_flexCol_between} ${CSS_RING} ${CSS_SHADOW_SM}`}
        >
          <div
            className={`w-full h-1/10 border-b ${CSS_flexRow_center} ${CSS_COLOR_950}`}
          >
            <input
              type="text"
              value={search}
              className={`pl-2.5 w-60 md:w-100 lg:w-100 ${CSS_RESPONSIVE_INPUT_HEIGHT} ${CSS_COLOR_700} ${CSS_BORDER_Y_LEFT}`}
              onChange={(e) => setSearch(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchSomething();
              }}
            />
            <button
              className={`${CSS_RESPONSIVE_BTN_SIZE} ${CSS_RESPONSIVE_INPUT_HEIGHT} ${CSS_COLOR_950} ${CSS_BORDER_Y_RIGHT} ${CSS_flexCol_center} ${CSS_TEXT_HOVER_ACTIVE_COLOR_BASE}`}
              onClick={() => searchSomething()}
            >
              <Search />
            </button>
          </div>
          <div
            className={`justify-center w-full h-9/10 ${CSS_flexCol_center} ${CSS_COLOR_50}`}
          >
            s
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
