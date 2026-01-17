import {
  CSS_flexRow,
  CSS_fixPosition,
  CSS_color_darkest,
  CSS_color_dark,
  CSS_color_light,
  CSS_color_lightest,
  CSS_text_hover_active_colorBase,
  CSS_responsiveTextSize,
} from "../../libraries/CSS_General";

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
        className={`justify-center w-full h-7/100 md:h-5/100 lg:h-5/100 border-b ${CSS_flexRow} ${CSS_color_darkest} ${CSS_fixPosition}`}
      >
        <div
          className={`justify-evenly w-2/3 md:w-1/3 lg:w-1/3 h-full ${CSS_flexRow}`}
        >
          {HeaderMenuOption.map((item) => {
            return (
              <div
                key={item.id}
                className={`justify-center w-1/4 h-full ${CSS_flexRow} ${CSS_color_darkest}`}
              >
                <button
                  className={`justify-around ${CSS_responsiveTextSize} ${CSS_text_hover_active_colorBase} ${CSS_flexRow} ${CSS_color_darkest}`}
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
