function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full bg-black pt-14">
        <div className="w-4/10 h-9/10 flex flex-col items-center justify-between border border-white rounded-lg">
          <div className="flex flex-row justify-center items-center w-full h-1/10 border-b border-white">
            <input
              type="text"
              className=" pl-2.5 pr-120 py-2.5 rounded-y-lg rounded-l-lg border border-white"
            />
            <button className=""></button>
          </div>
          <div className="flex justify-center items-center w-full h-9/10 border"></div>
        </div>
      </div>
    </>
  );
}

export default Home;
