import React, { useEffect, useState } from 'react'
import style from "./style.module.css"

 function JobPosting ({url,title,by,time}){
  let dateFormate= new Date(time*1000).toLocaleString()
  return (
   <div className={style.post} >
     <h2 className={style.post__title}>
       <a className={url ? "": style.inactiveLink}
          href= {url}
          target='_blank'
          rel="noreferrer"
           >{title}
       </a>
     </h2>
     <span className={style.post_metaData}>By {by} .{dateFormate}</span>
   </div>
  )
 }
const Main = () => {
  const JOB_API="https://hacker-news.firebaseio.com/v0/";
  const ITEM_PER_PAGE=5;
      let [item, setItem]=useState([]);
      let [itemId,setItemId]= useState(null);
      let [fetchingDetails, setFetchingDetails]= useState(false);
      let [currentPage, setCurrentPage] = useState(0);

      let fetchItems= async (currPage)=>{
        setCurrentPage(currPage)
        setFetchingDetails(true)

        let itemsList=itemId;
        if(itemsList===null){
        let response =await fetch (`${JOB_API}jobstories.json`)
        itemsList = await response.json()
        setItemId(itemsList)
        }

        let itemIdsForPage=itemsList.slice(
          currPage*ITEM_PER_PAGE,
          currPage*ITEM_PER_PAGE + ITEM_PER_PAGE
        );
        let itemForPage= await Promise.all(
          itemIdsForPage.map((itemId)=>
            fetch(  `${JOB_API}item/${itemId}.json`).then((res)=>res.json())
          )
        ) 
        setItem([...item,...itemForPage])
        setFetchingDetails(false)
      }
      useEffect(()=>{
        if(currentPage===0) fetchItems(currentPage)
      
      },[])
  return (
    <div className={style.main}>
    <h1 className={style.title}>Hacker News Job Board</h1>
    {
      (item.id===null||item.length<1)?
      (<p className={style.loading}>
        ..loading  </p> ):
      (
      <div>
       <div className={style.item} role='list'> 
         {
          item.map((item)=>{
            return <JobPosting key={item.id}{...item}></JobPosting>
          })
         }
       </div>
       <button className={style.btn}
       onClick={()=>{fetchItems(currentPage+1)}}>
       {fetchingDetails?"Loading...":"Load More Job"}</button>
      </div>
      ) 
    }
    </div>
  )
}

export default Main
