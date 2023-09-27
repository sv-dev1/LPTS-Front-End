import { useState, useEffect } from "react";



const ActiveData = (data , isActiveRequired ,filterfor) => {
   
//   const [data, setData] = useState(null);
let newFilteredDataList = [];


const filteredData = ()=>{
    


   
 //   debugger
  // for subjects , teams
    if(filterfor == 'subjects' || filterfor == 'teams'){
        newFilteredDataList = data.filter(d => d.isActive == !!isActiveRequired);
        return newFilteredDataList ;
    } 
      // for users
     if(filterfor == 'users'){
      
        newFilteredDataList = data.filter(d => d.status == !!isActiveRequired);
        return newFilteredDataList ;
    } 
     // for phases
     if(filterfor == 'phases'){
       
        newFilteredDataList = data.filter(d => d.phase.isActive == !!isActiveRequired);
        return newFilteredDataList ;
    } 
    // for category
    if(filterfor == 'categories'){
        newFilteredDataList = data.filter(d => d.category.isActive === !!isActiveRequired);
        return newFilteredDataList ;
    }
    if(filterfor == 'learningTarget'){
        newFilteredDataList = data.filter(d => d.progression.isActive === !!isActiveRequired);
        return newFilteredDataList ;
    }
return newFilteredDataList ;

}
  
     
// call filterData for ACtiveData

 data?.length &&(data =  filteredData()) ;
 return  data;

};

export default ActiveData;