import { useState, useEffect } from "react";



const ActiveData = (data , isActiveRequired) => {

//   const [data, setData] = useState(null);
  

const filteredData = ()=>{
    let newFilteredDataList = [];


    if(data[0].isActive){
        // for subjects , teams
        newFilteredDataList = data.filter(d => d.isActive == true);
        return newFilteredDataList ;
    } else if(data[0].status){
        // for users
        newFilteredDataList = data.filter(d => d.status == true);
        return newFilteredDataList ;
    } else if(data[0].phase.isActive){
        // for phases
        newFilteredDataList = data.filter(d => d.phase.isActive == true);
        return newFilteredDataList ;
    } else if(data[0].category.isActive){
        // for categories
        newFilteredDataList = data.filter(d => d.category.isActive == true);
        return newFilteredDataList ;
    }
 return newFilteredDataList ;
}
  
     

  useEffect(() => {
    isActiveRequired && data?.length && filteredData()
  }, [data]);

  return data ;

};

export default ActiveData;