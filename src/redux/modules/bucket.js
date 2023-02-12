// bucket.js
import {db} from "../../firebase";
import {collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc} from "firebase/firestore";
import { async } from "@firebase/util";
// Actions
const LOAD = 'bucket/LOAD';
const CREATE = 'bucket/CREATE';
const UPDATE = 'bucket/UPDATE';
const DELETE = 'bucket/DELETE';
const LOADED = 'bucket/LOADED';

const initialState = {
    // list: ["영화관 가기", "매일 책읽기", "수영 배우기", "코딩하기"]
    is_loaded: false,
    list: [
        // {text: "영화관 가기", completed: false},
        // {text: "매일 책읽기", completed: false},
        // {text: "수영 배우기", completed: false},
        // {text: "코딩하기", completed: false}
        {text: "안녕!", completed: false},
        {text: "안녕!", completed: false},
        {text: "안녕!", completed: false}
    ]
}

// Action Creators
export function loadBucket(bucket_list) {
    return { type: LOAD, bucket_list };
}

export function createBucket(bucket) {
    console.log("액션을 생성할 거야!");
    return { type: CREATE, bucket };
};

export function updateBucket(bucket_index) {
    return { type: UPDATE, bucket_index};
};

export function deleteBucket(bucket_index) {
    console.log("지울 버킷 인덱스", bucket_index);
    return { type: DELETE, bucket_index };
};

export function isLoaded(loaded) {
    return {type:LOADED, loaded};
};

//middlewares
export const loadBucketFB = () => {
    return async function (dispatch) {
        const bucket_data = await getDocs(collection(db, "bucket"));
        console.log(bucket_data);

        let bucket_list = [];
        bucket_data.forEach((b) => {
            console.log(b.data());
            // bucket_list = [...bucket_list, {...b.data()}]
            bucket_list.push({id: b.id, ...b.data()});
        });
        console.log(bucket_list);

        dispatch(loadBucket(bucket_list));
    };
};

export const addBucketFB = (bucket) => {
    return async function (dispatch) {
        const docRef = await addDoc(collection(db, "bucket"), bucket);
        // console.log((await getDoc(docRef)).data());
        // const _bucket = await getDoc(docRef);
        // const bucket_data = {id: _bucket.id, ..._bucket.data()};
        dispatch(isLoaded(false));
        const bucket_data = {id: docRef.id, ...bucket };
        // console.log(bucket_data);
        dispatch(createBucket(bucket_data));
    };
};

export const updateBucketFB = (bucket_id) => {
    return async function (dispatch, getState) {
        // console.log(bucket_id);
        const docRef = doc(db, "bucket", bucket_id);
        await updateDoc(docRef, {completed: true});

        // console.log(getState().bucket);
        const _bucket_list = getState().bucket.list;
        const bucket_index = _bucket_list.findIndex((b) => {
            return b.id === bucket_id;
        })
        // console.log(bucket_index);
        dispatch(updateBucket(bucket_index));
    };
};

export const deleteBucketFB = (bucket_id) => {
    return async function (dispatch, getState) {
        if(!bucket_id){
            window.alert("아이디가 없네요!")
            return;
        }
        const docRef = doc(db, "bucket", bucket_id);
        await deleteDoc(docRef);

        // console.log(getState().bucket);
        const _bucket_list = getState().bucket.list;
        const bucket_index = _bucket_list.findIndex((b) => {
            return b.id === bucket_id;
        })
        // console.log(bucket_index);
        dispatch(deleteBucket(bucket_index));
    }
}



// Reducer
export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case "bucket/LOAD":{
        return {list: action.bucket_list, is_loaded: true};
    }

    case "bucket/CREATE":{
        console.log("이제 값을 바꿀 거야!")
        const new_bucket_list = [...state.list, action.bucket];
        return {...state, list : new_bucket_list, is_loaded: true};
    }

    case "bucket/UPDATE":{
        console.log("이제 완료할거야!")
        const new_bucket_list = state.list.map((l, idx) => {
            if(parseInt(action.bucket_index) === idx){
                return {...l, completed: true}
            }else{
                return l;
            }
        })
        console.log({ list: new_bucket_list });
        return {...state, list: new_bucket_list};
    }

    case "bucket/DELETE":{
        console.log(state, action)
        const new_bucket_list = state.list.filter((l, idx) => {
            console.log(parseInt(action.bucket_index) !== idx , parseInt(action.bucket_index), idx);
            return parseInt(action.bucket_index) !== idx;
        });
        console.log(new_bucket_list);
        return{...state, list: new_bucket_list};
    }
    
    case "bucket/LOADED":{
        return{...state, is_loaded: action.loaded};
    }

    default: 
    return state;
    }

}