import react from "react";
export default function pagination(){
    return(
       
        <div className="flex justify-center space-x-3 mt-8">
          {[1, 2, 3, 4, 5].map((page) => (
            <button key={page} className="bg-yellow-600 hover:bg-yellow-400 w-10 h-10 rounded-xl text-black font-bold">
              {page}
            </button>
          ))}
          <button className="text-gold-400 font-semibold hover:underline">Next Page</button>
        </div>
    );
}
