import {
  CSS_FIXED_Z50,
  CSS_H_FULL,
  CSS_RESPONSIVE_TEXT_SIZE,
  CSS_SURFACE_DARKER,
  CSS_TEXT_HOVER_ACTIVE_COLOR_BASE,
  CSS_flexRow_around,
  CSS_flexRow_center,
  CSS_flexRow_evenly,
} from "../../libraries/CSS_Main";

function Header() {
  const HeaderMenuOption = [
    { id: 1, option: "Home" },
    { id: 2, option: "account" },
    { id: 3, option: "about" },
    { id: 4, option: "terms of service" },
  ];

  return (
    <>
      <header
        className={`w-full h-7/100 md:h-5/100 lg:h-5/100 border-b border-slate-700 ${CSS_flexRow_center} ${CSS_SURFACE_DARKER} ${CSS_FIXED_Z50}`}
      >
        <div
          className={`w-full md:w-1/3 lg:w-1/3 ${CSS_H_FULL} ${CSS_flexRow_evenly}`}
        >
          {HeaderMenuOption.map((item) => {
            return (
              <div
                key={item.id}
                className={`w-1/4 ${CSS_H_FULL} ${CSS_flexRow_center} ${CSS_SURFACE_DARKER}`}
              >
                <button
                  className={`${CSS_RESPONSIVE_TEXT_SIZE} ${CSS_TEXT_HOVER_ACTIVE_COLOR_BASE} ${CSS_flexRow_around} ${CSS_SURFACE_DARKER}`}
                >
                  {item.option}
                </button>
              </div>
            );
          })}
        </div>
      </header>
    </>
  );
}

export default Header;
