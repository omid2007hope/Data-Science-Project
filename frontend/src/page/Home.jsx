import { useState } from "react";
import {
  CSS_flexCol,
  CSS_color_darkest,
  CSS_color_dark,
  CSS_color_light,
  CSS_color_lightest,
  CSS_H_W_full,
  CSS_border_left,
  CSS_border_right,
  CSS_flexRow,
  CSS_generalBorder,
  CSS_text_hover_active_colorBase,
  CSS_responsive_input_btn_height,
  CSS_responsive_btn_width,
} from "../libraries/CSS_General";

import { Search } from "lucide-react";

function Home() {
  const [search, setSearch] = useState("");

  const searchSomething = () => {
    if (search) {
      console.log(search);
      setSearch("");
    } else {
      alert("Input is empty");
      return;
    }
  };

  return (
    <>
      <div
        className={`justify-center pt-14 pb-4 ${CSS_H_W_full} ${CSS_flexCol} ${CSS_color_lightest}`}
      >
        <div
          className={`w-9/10 md:w-8/10 h-10/10 md:h-9/10 lg:h-9/10 justify-between ${CSS_generalBorder} ${CSS_flexCol}`}
        >
          <div
            className={`justify-center w-full h-1/10 border-b ${CSS_flexRow} ${CSS_color_darkest}`}
          >
            <input
              type="text"
              value={search}
              className={`pl-2.5  w-60 md:w-100 lg:w-100 ${CSS_responsive_input_btn_height} ${CSS_color_dark} ${CSS_border_left}`}
              onChange={(e) => setSearch(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchSomething();
              }}
            />
            <button
              className={`${CSS_responsive_btn_width} ${CSS_responsive_input_btn_height} ${CSS_color_darkest} ${CSS_border_right} ${CSS_flexCol} ${CSS_text_hover_active_colorBase}`}
              onClick={() => searchSomething()}
            >
              <Search />
            </button>
          </div>
          <div
            className={`justify-center w-full h-9/10 ${CSS_flexCol} ${CSS_color_light}`}
          >
            s
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
