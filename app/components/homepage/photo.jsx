import react from "react";
const Photos = () => {
    return(
     <div className="bg-black  ">
        <div className="flex items-center pb-5 pl-5">
          <h1 className="font-bruno text-[40px] text-white">unleach 
          the extraordinary</h1>
          <h3 className="font-bruno text-gray-600 text-[15px]">go beyond ordinary and indluge in the exepctional.Our luxury cars are designe
          to inpress and inspire.providing you with unforgettable driving experience.</h3>
        </div>
        <div className="px-6 py-5 flex">
            <img className=" w-[326px] h-[496px]" src="/img/lamboburjdxb.jpg" alt="" />
            <div className="mt-3 ml-5 mr-8">
                <img className=" w-[541px] h-[220px]" src="/img/LAMBOEVO.jpg" alt="" />
                <img className=" mt-3 w-[541px] h-[246px]" src="/img/LAMBOREAR.jpg" alt="" />
            </div>
            
            <img className="  w-[344px] h-[496px]" src="/img/lamboinside.jpg" alt="" /> 
        </div>
     </div>

    );
}
export default Photos;