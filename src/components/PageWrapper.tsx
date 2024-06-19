import React, { ReactNode, useEffect } from "react";
import styled from "styled-components";

export default function PageWrapper(children: ReactNode[]) {
    return (
        <Wrapper>
            {children.map((e) => { return e })}
        </Wrapper>
    )
}
const Wrapper = styled.div`
background-color: #282c34;
display: flex;
height: 100vh;
border: 1px solid red;
`