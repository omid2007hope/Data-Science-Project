import {
  CSS_flexStyleRow,
  CSS_flexStyleCol,
  CSS_fixPosition,
  CSS_color,
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
        className={`justify-between w-full h-1/20 border-b ${CSS_flexStyleRow} ${CSS_color} ${CSS_fixPosition}`}
      >
        <div className={`justify-evenly w-1/3 h-full ${CSS_flexStyleRow}`}>
          {HeaderMenuOption.map((item) => {
            return (
              <div
                key={item.id}
                className={`justify-center w-1/4 h-full ${CSS_flexStyleRow}`}
              >
                <button
                  className={`justify-around ${CSS_flexStyleRow} ${CSS_color}`}
                >
                  {item.option}
                </button>
              </div>
            );
          })}
        </div>
        <div
          className={`justify-evenly w-2/3 h-full ${CSS_flexStyleRow}`}
        ></div>
      </header>
    </>
  );
}

export default Header;
