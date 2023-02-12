import React from "react";
import styled from "styled-components";
import {Route, Switch} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createBucket, loadBucketFB, addBucketFB} from "./redux/modules/bucket";

import BucketList from "./BucketList";
import Detail from "./Detail";
import NotFound from "./NotFound";
import Progress from "./Progress";
import Spinner from "./Spinner";
import {db} from "./firebase";
import {collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc} from "firebase/firestore";
import { async } from "@firebase/util";


function App() {

  // const [list, setList] = React.useState(["영화관 가기", "매일 책읽기", "수영 배우기"]);
  const text = React.useRef(null);
  const dispatch = useDispatch();
  const is_loaded = useSelector(state => state.bucket.is_loaded);

  React.useEffect( () => {
    // console.log(db);
    // addDoc(collection(db, "buckets"), {text:"new", completed:false})
    dispatch(loadBucketFB());
  },[]);

  const addBucketList = () => {
    // setList([...list, text.current.value]);
    // dispatch(createBucket({text: text.current.value, completed: false}));
    dispatch(addBucketFB({text: text.current.value, completed: false}));
  }
  return (
    <div className="App">
      <Container>
        <Title>내 버킷리스트</Title>
        <Progress/>
        <Line />
        <Switch>
          <Route path="/" exact>
            {/* <BucketList list={list} /> */}
            <BucketList/>
          </Route>
          <Route path="/detail/:index">
            <Detail />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Container>
      <Input>
        <input type="text" ref={text} />
        <button onClick={addBucketList}>추가하기</button>
      </Input>
      {/* <button onClick={()=>{
          window.scrollTo({top:0, left:0, behavior:"smooth"});
        }}>위로가기</button> */}
      {!is_loaded && <Spinner/>}
    </div>
  );
}

const Input = styled.div`
max-width: 350px;
min-height: 10vh;
background-color: #fff;
padding: 16px;
margin: 20px auto;
border-radius: 5px;
border: 1px solid #ddd;
display: flex;

& > * {
  padding: 5px;
}

& input {
  border: 1px solid #888;
  width: 70%;
  margin-right: 10px;
}

& input:focus {
  border: 1px solid #a673ff;
  outline: none;
}

& button{
  width: 25%;
  color: #fff;
  border: #a673ff;
  background: #a673ff;
}
`;

const Container = styled.div`
max-width: 350px;
min-height: 60vh;
background-color: #fff;
padding: 16px;
margin: 20px auto;
border-radius: 5px;
border: 1px solid #ddd;
`;

const Title = styled.h1`
color: slateblue;
text-align: center;
`;

const Line = styled.hr`
margin: 16px 0px;
border: 1px dotted #ddd;
`;

export default App;