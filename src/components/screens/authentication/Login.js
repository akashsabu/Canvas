import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import styled from 'styled-components';


import { login } from "../../../features/userSlice";



const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      login({
        name: username,
        email: email,
        is_logged_in: true,
      })
    );
    navigate('/');
  };

  return (
    <LoginContainer>
      <RightContainer>
        <h1>Login</h1>
        <Form id="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faUser} />
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faEnvelope} />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faLock} />
          </div>
          <button type="submit">Login</button>
        </Form>
      </RightContainer>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  margin: auto;
`;


const RightContainer = styled.div`
  /* width: 100%; */
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
    input[type="email"],
    input[type="password"] {
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


export default Login;
