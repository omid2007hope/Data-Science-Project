import {
  CSS_flexRow,
  CSS_fixPosition,
  CSS_color_darkest,
  CSS_text_hover_active_colorBase,
} from "../../libraries/CSS_General";

function Header() {
  const HeaderMenuOption = [
    { id: 1, option: "Home" },
    { id: 2, option: "option-1" },
    { id: 3, option: "option-2" },
    { id: 4, option: "option-3" },
  ];

  return (
    <>
      <header
        className={`justify-center w-full h-1/20 border-b ${CSS_flexRow} ${CSS_color_darkest} ${CSS_fixPosition}`}
      >
        <div className={`justify-evenly w-1/3 h-full ${CSS_flexRow}`}>
          {HeaderMenuOption.map((item) => {
            return (
              <div
                key={item.id}
                className={`justify-center w-1/4 h-full ${CSS_flexRow}`}
              >
                <button
                  className={`justify-around ${CSS_text_hover_active_colorBase} ${CSS_flexRow} ${CSS_color_darkest}`}
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
