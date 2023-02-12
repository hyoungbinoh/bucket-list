import {createStore, combineReducers, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk"

import bucket from "./modules/bucket";

const middlewares = [thunk];
const rootReducer = combineReducers({bucket});
const enhencer = applyMiddleware(...middlewares);

const store = createStore(rootReducer, enhencer);

export default store;