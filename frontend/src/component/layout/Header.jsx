function Header() {
  const HeaderMenuOption = [
    { id: 1, option: "Home" },
    { id: 2, option: "option-1" },
    { id: 3, option: "option-2" },
    { id: 4, option: "option-3" },
  ];

  return (
    <>
      <header className="flex flex-row items-center justify-between w-full h-1/20 bg-blue-950 text-white font-bold fixed z-50 border-b border-white shadow-lg shadow-white">
        <div className="flex flex-row items-center justify-evenly w-1/3 h-full">
          {HeaderMenuOption.map((item) => {
            return (
              <div
                key={item.id}
                className="flex items-center justify-center w-1/4 h-full"
              >
                <button className="flex items-center justify-around font-bold text-white text-md hover:text-lg">
                  {item.option}
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex flex-row items-center justify-evenly w-2/3 h-full"></div>
      </header>
    </>
  );
}

export default Header;
