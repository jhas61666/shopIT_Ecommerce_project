import React, { useState, useEffect } from 'react'
import { countries } from 'countries-list' // You might need: npm install countries-list
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MetaData from '../layout/MetaData';
import { saveShippingInfo } from '../../redux/features/cartSlice';
import CheckOutSteps from './CheckOutSteps';

const Shipping = () => {
    
    const countriesList = Object.values(countries);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get existing shipping info from Redux (if any)
    const { shippingInfo } = useSelector((state) => state.cart);

    const [address, setAddress] = useState(shippingInfo?.address || "");
    const [city, setCity] = useState(shippingInfo?.city || "");
    const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo || "");
    const [zipCode, setzipCode] = useState(shippingInfo?.zipCode || "");
    const [country, setCountry] = useState(shippingInfo?.country || "");

    const submitHandler = (e) => {
        e.preventDefault();

        // Save to Redux and LocalStorage
        dispatch(saveShippingInfo({ address, city, phoneNo, zipCode, country }));
        
        // Move to the next step (Confirm Order)
        navigate("/confirm_order");
    };

    return (
        <>
            <MetaData title={"Shipping Info"} />
            <CheckOutSteps shipping />
            
            <div className="row wrapper mb-5">
                <div className="col-10 col-lg-5">
                    <form className="shadow rounded bg-body p-4" onSubmit={submitHandler}>
                        <h2 className="mb-4">Shipping Info</h2>
                        <div className="mb-3">
                            <label htmlFor="address_field" className="form-label">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="city_field" className="form-label">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phone_field" className="form-label">Phone No</label>
                            <input
                                type="tel"
                                id="phone_field"
                                className="form-control"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="zip_code_field" className="form-label">Zip Code</label>
                            <input
                                type="number"
                                id="zip_code_field"
                                className="form-control"
                                value={zipCode}
                                onChange={(e) => setzipCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="country_field" className="form-label">Country</label>
                            <select
                                id="country_field"
                                className="form-select"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            >
                                <option value="">Select Country</option>
                                {countriesList.map((country) => (
                                    <option key={country.name} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button id="shipping_btn" type="submit" className="btn btn-primary w-100 py-2">
                            CONTINUE
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Shipping;