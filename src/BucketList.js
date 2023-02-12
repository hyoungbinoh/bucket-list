import React from "react";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";

const BucketList = (props) => {
    const histrory = useHistory();
    // const my_lists = props.list;
    const my_lists = useSelector((state) => state.bucket.list);

    return (
        <ListStyle>
            {my_lists.map((list, index) => {
                return (
                    <ItemStyle completed={list.completed}
                        className="list_item" 
                        key={index} 
                        onClick={() => {
                            histrory.push("/detail/"+index);
                        }}
                    >
                        {list.text}
                    </ItemStyle>
                );
            })}
        </ListStyle>
        );
};

const ListStyle = styled.div`
    display: flex;
    flex-direction: column;
    height: 50vh;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 50vh;
`;

const ItemStyle = styled.div`
    padding: 16px;
    margin: 8px;
    background-color: ${(props) => props.completed ? "#673ab7" : "aliceblue"};
    color: ${(props)=>props.completed ? "#fff" : "#333"};
`;

export default BucketList;