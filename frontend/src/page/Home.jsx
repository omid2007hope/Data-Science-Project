import {
  CSS_flexCol,
  CSS_color_darkest,
  CSS_H_W_full,
  CSS_border_left,
  CSS_border_right,
  CSS_flexRow,
  CSS_generalBorder,
} from "../libraries/CSS_General";

function Home() {
  return (
    <>
      <div
        className={`justify-center pt-14 ${CSS_H_W_full} ${CSS_flexCol} ${CSS_color_darkest}`}
      >
        <div
          className={`w-4/10 md:w-8/10 h-9/10 justify-between ${CSS_generalBorder} ${CSS_flexCol} ${CSS_color_darkest}`}
        >
          <div
            className={`justify-center w-full h-1/10 border-b ${CSS_flexRow} ${CSS_color_darkest} `}
          >
            <input
              type="text"
              className={`pl-2.5 pr-120 py-2.5 ${CSS_color_darkest} ${CSS_border_left}`}
            />
            <button
              className={`py-2.5 px-5 ${CSS_color_darkest} ${CSS_border_right} ${CSS_flexCol}`}
            >
              x
            </button>
          </div>
          <div className={`justify-center w-full h-9/10 ${CSS_flexCol}`}></div>
        </div>
      </div>
    </>
  );
}

export default Home;
