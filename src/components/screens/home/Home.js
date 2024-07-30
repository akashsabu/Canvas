import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faExpandArrowsAlt } from "@fortawesome/free-solid-svg-icons";

import { setProjectProps } from "../../../features/projectSlice";
import logo from '../../../assets/images/logo.png'


const Home = () => {
  const dispatch = useDispatch();
  const [projectName, setProjectName] = useState("");
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [canvasHeight, setCanvasHeight] = useState(400);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setProjectProps({
        name: projectName,
        height: canvasHeight,
        width: canvasWidth,
      })
    );
    navigate("/canvas");
  };

  const handleWidthChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (value > 720) {
      value = 720;
    }
    setCanvasWidth(value);
  };

  const handleHeightChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (value > 720) {
        value = 720;
      }
    setCanvasHeight(value);
  };

  return (
    <SetupContainer>
        <TitleDiv>
        <LogoDiv>
        <img src={logo} alt="Logo" />
        </LogoDiv>
       
      </TitleDiv>
      <RightContainer>
        <h1>Set Up New Canvas Project</h1>
        <Form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faPen} />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Canvas Width"
              value={canvasWidth}
              onChange={handleWidthChange}
              max={720}
              required
            />
            <FontAwesomeIcon icon={faExpandArrowsAlt} />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Canvas Height"
              value={canvasHeight}
              onChange={handleHeightChange}
              max={720}
              required
            />
            <FontAwesomeIcon icon={faExpandArrowsAlt} />
          </div>
          <button type="submit">Create Project</button>
        </Form>
      </RightContainer>
    </SetupContainer>
  );
};

const SetupContainer = styled.div`
  align-items: center;
  margin: auto;
`;


const LogoDiv = styled.div`
  width: 100px;
`;

const TitleDiv = styled.div`
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 25px;
  background-color: #351430; 
  color: #fff; 
  
`;

const RightContainer = styled.div`
    width: 450px;
  margin: auto;
  background: #76737321;
  padding: 32px;
  border-radius: 7px;

  h1 {
    text-align: center;
    color: #333;
  }
`;

const Form = styled.form`
  .form-group {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    color: #666;
    border: 1px solid #ccc;
    padding: 5px 15px 5px 5px;
    border-radius: 7px;
    background: #fff;

    &:focus-within {
      outline: 2px solid #634c9f;
    }

    input[type="text"],
    input[type="number"] {
      width: 100%;
      padding: 8px;
      border-radius: 3px;
      box-sizing: border-box;
      border: none;
      outline: none;
    }
  }

  button {
    width: 50%;
    padding: 10px;
    background-color: #351430;
    color: #fff;
    border: none;
    border-radius: 7px;
    cursor: pointer;

    &:hover {
      background-color: #551430;
    }
  }
`;
export default Home;
