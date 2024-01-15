import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RotatingTriangles } from 'react-loader-spinner'
import createSomeContext from '../../../context/createSomeContext';
// import { useCookies } from 'react-cookie';


export default function Login() {
    // context api function
    const {
        login
    } = useContext(createSomeContext);

    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    // const [cookie, setCookie, removeCookie] = useCookies(["token"]);
    const navigate = useNavigate();

    // await removeCookie("userToken", { path: "/", expires: Date.now() });

    //  calling a api
    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        console.log(credentials);
        const res = await login(credentials.email, credentials.password);
        // console.log(res.headers);
        const json = await res.json();
        if (json.success === true) {
            toast.success("login successful");
            if(json.data.role === "BDI")
            {
                navigate("/bdi/home");
            }
            else if(json.data.role === "TL")
            {
                navigate("/tl/home");
            }
            else if(json.data.role === "CXO")
            {
                navigate("/cxo/home");
            }
            else if(json.data.role === "MD")
            {
                navigate("/md/home");
            }
            window.location.reload();
        }
        else {
            toast.error(json.message);
        }
        setLoading(false);
    }
    // handle on change
    function handleOnChange(e) {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    // handle forgot button click
    const handleForgotButtonClick = ()=>{
        navigate("/updatePassword");
    }


    return (
        <>
            {
                loading ?
                    (
                        <>
                        <div className="react-loader-spinner">
                            <RotatingTriangles
                                visible={true}
                                height="100"
                                width="100"
                                ariaLabel="rotating-triangels-loading"
                                wrapperStyle={{}}
                                wrapperClass="rotating-triangels-wrapper"
                            />
                        </div>
                        </>
                    )
                    :
                    (
                        <>
                            <div className="auth-form">
                                <form onSubmit={handleLogin}>
                                    <div className='form-heading'>
                                        <p className='text-white'>Login-Form</p>
                                    </div>
                                    <div>
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id='email'
                                            name='email'
                                            value={credentials.email}
                                            placeholder='Enter Email'
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            id='password'
                                            name='password'
                                            value={credentials.password}
                                            placeholder='Enter Password'
                                            onChange={handleOnChange}
                                            required
                                        />
                                    </div>
                                    <div className='auth-buttons'>
                                        <button
                                            type='submit'
                                            className='submit-button'>
                                            Login
                                        </button>
                                        <button
                                            type='button'
                                            className='forgot-button'
                                            onClick={(e)=>handleForgotButtonClick()}
                                        >
                                            Forgot-Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    )
            }
            <ToastContainer />
        </>
    )
}
