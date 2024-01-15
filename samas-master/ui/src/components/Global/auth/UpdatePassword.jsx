import React, { useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RotatingTrianglesComp from '../utils/RotatingTriangles';
import createSomeContext from '../../../context/createSomeContext';
import { useNavigate } from 'react-router-dom';

export default function UpdatePassword() {
    const {
        sendOtp,
        verifyOtp,
        updatePassword,
    }=useContext(createSomeContext);

    const [email, setEmail] = useState('');
    const [otpSended, setOtpSended] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // handle otp send click
    const sendOtpFunc = async (e) => {
        e.preventDefault();

        setLoading(true);
        const res = await sendOtp(email);
        const json = await res.json();
        if(json.success === true)
        {
            toast.success(json.message);
            setOtpSended(true);
        }
        else
        {
            toast.error("Try again.");
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
        setLoading(false);
    }

    // handle verify otp click
    const verifyOtpFunc = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await verifyOtp(otp, email);
        const json = await res.json();
        if(json.success === true)
        {
            toast.success(json.message);
            setOtpVerified(true);
        }
        else
        {
            toast.error("Otp not verified.");
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
        setLoading(false);
    }

    // handle update password click
    const updatePasswordFunc = async (e) => {
        e.preventDefault();
       
        if (password.trim() !== confirmPassword.trim()) {
            toast.info("Password and Confirm Password must be same.");
            return;
        }
        if (password.trim().length < 6) {
            toast.info("Password must have at least 6 characters.");
            return;
        }

        setLoading(true);
        const res = await updatePassword(otp, email, password);
        const json = await res.json();
        if(json.success === true)
        {
            toast.success(json.message);
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
        else
        {
            toast.error("Try again.");
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
        setLoading(false);
    }

    return (
        <>
            {
                loading ? (
                    <RotatingTrianglesComp/>
                ) 
                :
                (
                !otpSended ? (
                    <div className="auth-form">
                        <form onSubmit={sendOtpFunc}>
                            <div className='form-heading'>
                                <p className='text-white'>Send OTP</p>
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id='email'
                                    name='email'
                                    value={email}
                                    placeholder='Enter Email'
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='auth-buttons'>
                                <button
                                    type='submit'
                                    className='submit-button'>
                                    Send OTP
                                </button>
                            </div>
                        </form>
                    </div>
                )
                    :
                    (
                        <>
                            {
                                !otpVerified ?
                                    (
                                        <div className="auth-form">
                                            <form onSubmit={verifyOtpFunc}>
                                                <div className='form-heading'>
                                                    <p className='text-white'>Verify OTP</p>
                                                </div>
                                                <div>
                                                    <label htmlFor="otp">Otp</label>
                                                    <input
                                                        type="number"
                                                        id='otp'
                                                        name='otp'
                                                        value={otp}
                                                        placeholder='Enter Otp'
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className='auth-buttons'>
                                                    <button
                                                        type='submit'
                                                        className='submit-button'>
                                                        Verify Otp
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )
                                    :
                                    (
                                        <div className="auth-form">
                                            <form onSubmit={updatePasswordFunc}>
                                                <div className='form-heading'>
                                                    <p className='text-white'>UpdatePassword</p>
                                                </div>
                                                <div>
                                                    <label htmlFor="password">Create Password</label>
                                                    <input
                                                        type="text"
                                                        id='password'
                                                        name='password'
                                                        value={password}
                                                        placeholder='Enter Password'
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="rePassword">Confirm Password</label>
                                                    <input
                                                        type="text"
                                                        id='password'
                                                        name='password'
                                                        value={confirmPassword}
                                                        placeholder='Enter Confirm Password'
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className='auth-buttons'>
                                                    <button
                                                        type='submit'
                                                        className='submit-button'>
                                                        Update Password
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )
                            }
                        </>
                    )
                )
            }
            <ToastContainer />
        </>
    )
}
