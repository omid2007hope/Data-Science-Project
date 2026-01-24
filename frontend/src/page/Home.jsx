import API from "../api/index";
import { fetchTweetAnalyses } from "../api/FetchTweetAnalyses";

import { useState } from "react";
import {
  CSS_BORDER_Y_LEFT,
  CSS_BORDER_Y_RIGHT,
  CSS_BORDER_X_TOP,
  CSS_BORDER_X_BOTTOM,
  CSS_BORDER_FULL,
  CSS_RING,
  CSS_SHADOW_SM,
  CSS_RESPONSIVE_BTN_SIZE,
  CSS_RESPONSIVE_INPUT_HEIGHT,
  CSS_TEXT_HOVER_ACTIVE_COLOR_BASE,
  CSS_WH_full,
  CSS_flexCol_between,
  CSS_flexCol_center,
  CSS_flexCol_evenly,
  CSS_flexCol_end,
  CSS_flexCol_start,
  CSS_flexRow_center,
  CSS_COLOR_950,
  CSS_COLOR_700,
  CSS_COLOR_500,
  CSS_COLOR_300,
  CSS_COLOR_100,
  CSS_COLOR_50,
  CSS_flexRow_between,
} from "../libraries/CSS_Main";

import { Search } from "lucide-react";

function Home() {
  const [search, setSearch] = useState("");

  //! ......................................................
  //! SummeryList useState()
  const [summeryList, setSummeryList] = useState([]);

  //! ......................................................
  //! Search function

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

  //! ......................................................
  //! ShowAll function

  const showAll = async () => {
    try {
      //! ......................................................
      //! Get the data from API

      const data = await fetchTweetAnalyses();

      //! ......................................................
      //! Map the data

      const mapped = (data || []).map((item) => ({
        id: item._id,
        summery: item.oneSentence || item.text || "",
        date: item.createdAt || item.updatedAt || "",
      }));

      //! ......................................................
      //! Put the mapped data into SummryList useState()

      setSummeryList(mapped);

      //! ......................................................
      //! Catch any error
    } catch (error) {
      console.error("Show all failed:", error.message);
      alert("Failed to load summaries");
    }
  };

  //! ......................................................
  //! Date function

  const formatDate = (value) => {
    if (!value) return "Unknown";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown";
    return date.toLocaleString();
  };

  return (
    <>
      <div
        className={`pt-16 pb-4 ${CSS_WH_full} ${CSS_flexRow_between} ${CSS_COLOR_700}`}
      >
        <div
          className={`h-full w-1/3 mr-2 ${CSS_COLOR_500} ${CSS_flexCol_between}`}
        >
          <div className={`w-full h-6/100 ${CSS_COLOR_950}`}></div>
          <div className={`w-full h-94/100 ${CSS_COLOR_500}`}></div>
        </div>
        <div
          className={`rounded-4xl ${CSS_WH_full} ${CSS_flexCol_between} ${CSS_RING} ${CSS_SHADOW_SM}`}
        >
          <div
            className={`w-full h-6/100 ${CSS_flexRow_center} ${CSS_COLOR_950}`}
          >
            <div
              className={`w-1/2 h-full ${CSS_flexRow_center} ${CSS_COLOR_950}`}
            ></div>
            <div
              className={`w-1/2 h-full ${CSS_flexRow_center} ${CSS_COLOR_950}`}
            ></div>
          </div>
          <div
            className={`justify-center w-full h-screen pt-2 ${CSS_flexCol_start} ${CSS_COLOR_500}`}
          >
            {summeryList.map((item) => {
              return (
                <div
                  key={item.id}
                  className={`w-92/100 md:w-95/100 lg:w-75/100 h-23/100 md:h-20/100 lg:h-20/100 rounded-md px-5 mb-2 ${CSS_flexCol_evenly} ${CSS_BORDER_FULL} ${CSS_COLOR_950}`}
                >
                  <h1
                    className={`${CSS_WH_full} ${CSS_COLOR_950} ${CSS_flexCol_center}`}
                  >
                    {item.summery}
                    <span
                      className={`text-sm text-white/65 w-full h-1/3 ${CSS_flexCol_end}`}
                    >
                      Date: {formatDate(item.date)}
                    </span>
                  </h1>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={`h-full w-1/3 ml-2 ${CSS_COLOR_500} ${CSS_flexCol_between}`}
        >
          <div
            className={`w-full h-6/100 ${CSS_COLOR_950} ${CSS_flexRow_center}`}
          >
            <button
              className={`hidden md:flex ${CSS_RESPONSIVE_BTN_SIZE} ${CSS_TEXT_HOVER_ACTIVE_COLOR_BASE} ${CSS_COLOR_950} ${CSS_BORDER_Y_LEFT}`}
              onClick={() => showAll()}
            >
              All
            </button>
            <input
              type="text"
              value={search}
              className={`hidden md:block pl-2.5 w-4 md:w-20 lg:w-60 ${CSS_RESPONSIVE_INPUT_HEIGHT} ${CSS_COLOR_50}`}
              onChange={(e) => setSearch(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchSomething();
              }}
            />
            <button
              className={`hidden md:flex ${CSS_RESPONSIVE_BTN_SIZE} ${CSS_RESPONSIVE_INPUT_HEIGHT} ${CSS_COLOR_950} ${CSS_BORDER_Y_RIGHT} ${CSS_flexCol_center} ${CSS_TEXT_HOVER_ACTIVE_COLOR_BASE}`}
              onClick={() => searchSomething()}
            >
              <Search />
            </button>
          </div>
          <div className={`w-full h-94/100 ${CSS_COLOR_500}`}></div>
        </div>
      </div>
    </>
  );
}

export default Home;
