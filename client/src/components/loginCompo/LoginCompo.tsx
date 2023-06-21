import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

import { Stack, TextField } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";

import { registerUser, loginUser } from "../../redux/actions/userActions";
import { StateDataType } from "../../datatypes/userDataTypes";

const LoginCompo = () => {
  const [isContainerActive, setIsContainerActive] = useState(false);
  const [focused, setFocused] = useState(false);

  const usernameref = useRef(null);
  const emaileref = useRef(null);
  const password1ref = useRef(null);
  const confirmpasref = useRef(null);

  const [show, setShow] = useState(false);
  const [comfirmpwshow, setComfirmpwshow] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };
  const handlecomfirmpwShow = () => {
    setComfirmpwshow(!comfirmpwshow);
  };

  // password show and hide end

  const signUpButton = () => {
    setIsContainerActive(true);
    setShow(false);
    setLoading(false);
  };
  const signInButton = () => {
    setIsContainerActive(false);
    setShow(false);
    setLoading(false);
  };

  const handleFocus = (e: any) => {
    setFocused(true);
  };

  /*Register Data */

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: StateDataType) => state.user);

  //disableButton while loading and checking user name and email
  const disableButton = loading;
  console.log("disable button", disableButton);

  const CheckLogin = () => {
    if (user && user?.login === true) {
      console.log("thsis chekcing is working");
      navigate("/"), toast.success("Login Successfully");
      //   return toast.success("Your Account successfully created"), navigate("/");
    } else if (user && user?.login === false) {
      setIsContainerActive(false);
      //   navigate("/login");
      return toast.success("Your Account successfully created");
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    CheckLogin();
    // dispatch(reset());
  }, [user]);
  /* Register data onchange */

  /* Register data onsubmit */
  const onSubmit = (e: any) => {
    e.preventDefault();
    if (password1ref.current?.value !== confirmpasref.current?.value) {
      return toast.error("Passwords do not match");
    } else {
      const formData = new FormData();
      formData.append("username", usernameref.current?.value);
      formData.append("email", emaileref.current?.value);
      formData.append("password", password1ref.current?.value);
      console.log("register formdata", formData);

      dispatch(registerUser(formData))
        .then(() => setLoading(false))
        .catch(
          () => toast.error("Your registeration is failed and try again!"),
          setLoading(false)
        );
    }
  };
  /* login data */
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = loginData;

  /* login data onChange */
  const onChangelogin = (e: any) => {
    setLoginData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  /* login data onsubmit */
  const onSubmitlogin = (e: any) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    setLoading(true);
    console.log("user data ", userData);

    dispatch(loginUser(userData))
      .then(() => setLoading(false))
      .catch(
        () => toast.error("username or password something wrong!"),
        setLoading(false)
      );
  };

  return (
    <>
      <div className={"login-con " + (isContainerActive ? "signupmode" : " ")}>
        <ToastContainer />
        <div className="forms-con">
          <div className="signin-signup">
            {/* <!-- for sign in --> */}
            <form action="" className="sign-in-form" onSubmit={onSubmitlogin}>
              <h2 className="titlt">Sign in</h2>

              <Stack>
                <TextField
                  className="singinemail"
                  variant="outlined"
                  label="Email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChangelogin}
                  required
                />
              </Stack>
              <Stack className="singinpassword">
                {/* <i className="fas fa-lock"></i> */}
                <TextField
                  className="singinemail"
                  type={show ? "text" : "password"}
                  label="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChangelogin}
                />

                <label className="passwordshow" onClick={handleShow}>
                  {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </label>
              </Stack>
              <input
                type={`${disableButton ? "disable" : "submit"}`}
                value={`${disableButton ? "Login..." : "Login"}`}
                className="logbtn solid"
              />

              <p className="color_forgetpass">
                Forget Password?
                <Link to="/forgetpassword">
                  <span> reset it</span>
                </Link>
              </p>
              <p className="social-text">Or Sign in with social platforms</p>
            </form>
            {/* <!-- end of sign in --> */}

            {/* <!-- for sign up --> */}
            <form action="" className="sign-up-form" onSubmit={onSubmit}>
              <h2 className="titlt">Sign Up</h2>
              <div className="input-field">
                <PersonIcon className="inputlock" />
                <input
                  type="text"
                  pattern="^[a-zA-Z0-9 ]{3,16}$"
                  placeholder="Username"
                  name="username"
                  id="username"
                  required
                  ref={usernameref}
                  focused={focused.toString()}
                  onBlur={handleFocus}
                />
                <span className="msgforUsername">
                  Username should be 3-16 characters and shouldn't include any
                  special character!
                </span>
              </div>

              <div className="input-field">
                <EmailIcon className="inputlock" />
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  name="email"
                  required
                  ref={emaileref}
                  focused={focused.toString()}
                  onBlur={handleFocus}
                  // onChange={onChange}
                />

                <span className="msgforEmail">
                  It should be a vaild email address!
                </span>
              </div>
              <div className="input-field">
                <LockIcon className="inputlock" />
                <input
                  type={show ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  name="password"
                  pattern="^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,20}"
                  required
                  ref={password1ref}
                  focused={focused.toString()}
                  onBlur={handleFocus}
                />
                <label className="singuppassword" onClick={handleShow}>
                  {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </label>

                <span className="msgforPassword">
                  at least 8-20 characters and include 1 letter, 1 number and 1
                  special character!
                </span>
              </div>
              <div className="input-field">
                <LockIcon className="inputlock" />
                <input
                  type={comfirmpwshow ? "text" : "password"}
                  placeholder="Confirm Password"
                  id="password2"
                  name="password2"
                  required
                  pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]- , _, @, ., /, #, &, +{8,20}$"
                  ref={confirmpasref}
                  focused={focused.toString()}
                  onBlur={handleFocus}
                />

                <label className="singuppassword" onClick={handlecomfirmpwShow}>
                  {comfirmpwshow ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </label>
                <span className="msgforcomfirmps">Passwords don't match!</span>
              </div>

              <input
                type={`${disableButton ? "disable" : "submit"}`}
                value={`${disableButton ? "Sign Up..." : "Sign Up"}`}
                className="logbtn solid"
              />

              <p className="social-text">Or Sign Up with social platforms</p>
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="login-content">
              <h3>New Here ?</h3>
              <p>If you don't have an account.Please create new one.</p>
              <button
                disabled={disableButton && disableButton}
                className={`${
                  disableButton ? "loginbtnDisable" : "logbtn"
                } "transparent"`}
                onClick={signUpButton}
                id="sign-up-btn"
              >
                Sign Up
              </button>
            </div>
            <img src="../images/login2.png" className="image" alt="" />
          </div>

          <div className="panel right-panel">
            <div className="login-content">
              <h3>One of Us ?</h3>
              <p>
                If you have already created user account, Please Login here!
              </p>
              <button
                disabled={disableButton && disableButton}
                className={`${
                  disableButton ? "loginbtnDisable" : "logbtn"
                } "transparent"`}
                id="sign-in-btn"
                onClick={signInButton}
              >
                Sign In
              </button>
            </div>
            <img src="../images/login1.png" className="image" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginCompo;
