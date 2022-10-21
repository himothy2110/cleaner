import React, { useState,useEffect } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import CRUD_firestore from "./CRUD_firestore"
 import ReactLoading from "react-loading";
import PostCard from "./PostCard"
import { functions, firestore} from "../firebase"

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [counter, setCounter] = useState(0);
  const history = useHistory();
  const soething=[];
  const crud = new CRUD_firestore();

  useEffect(() => {
   if(loading){
    getdata();
   }
  });

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

//create an async function
    const getdata = async () => {
      const tmpArr = [];
      firestore.collection("posts").doc("top_posts").collection("current").get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
          //console.log(JSON.stringify(doc.data()));
          tmpArr.push({"id":doc.id,"data":doc.data()});
          });
          setData(tmpArr);
          setLoading(false)
         
      });
        
  


  }
  const add_Data = async () => {
    const data = JSON.parse("{\"title\":\"large pothole\",\"time\":{\"seconds\":1666284389,\"nanoseconds\":890000000},\"priority\":0,\"img_url\":\"https:\/\/e3.365dm.com\/19\/03\/2048x1152\/skynews-potholes-rules-roadworks_4598866.jpg\",\"location\":{\"latitude\":33.7744287,\"longitude\":-84.3955764},\"price\":24.56}");
    const res =await crud.addData(data);
    console.log(res);
    setLoading(false);    
}
  return (
    <>
       {loading == true ? (
        <ReactLoading type="spin" color="#0000FF" height={100} width={50} />
       ) : (
        data.map(dataIn => {
          console.log(dataIn.data);
          return (
          
            <div className={dataIn.key}><PostCard data={dataIn} /> </div>
          )
          })
       )}
    </>
  )
}
