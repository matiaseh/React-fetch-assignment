import styled from "styled-components";
import React from "react";

const ValueBoxContainer = styled.div`
  width: 30%;
  border-radius: 5px;
  box-shadow: 0px 8px 12px 0px rgba(0, 0, 0, 0.22);
`;

const ValueP = styled.p`
  font-size: 4.7vw;
  margin-bottom: 10px;
`;

const TitleP = styled.p`
  text-align: left;
  margin-left: 1.2vw;
  margin-right: 1.2vw;
  font-size: 2.1vw;
`;

const ValueBox = (props) => {
  const value = props.value;
  const title = props.title;

  return (
    <ValueBoxContainer>
      <ValueP>{value}</ValueP>
      <TitleP>{title}</TitleP>
    </ValueBoxContainer>
  );
};

export default ValueBox;
