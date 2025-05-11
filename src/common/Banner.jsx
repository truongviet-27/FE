import React from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import des from "../static/images/title-des.jpg";
export default function Banner() {
    return (
        <>
            <div className="">
                <div className="flex justify-center !my-20">
                    <img src={des} className="img-fluid" alt="" />
                    <img src="" className="img-fluid" alt="" />
                </div>
                <hr className="my-4" />
            </div>
            <div className="flex justify-center !my-10">
                <div className="">
                    <div className="text-center">
                        <h2 className="text-danger">Liên lạc với chúng tôi</h2>
                    </div>
                    <div className="social">
                        <NavLink to="#">
                            <i className="fab fa-facebook" />
                        </NavLink>
                        <NavLink to="#">
                            <i className="fab fa-google-plus-g" />
                        </NavLink>
                        <NavLink to="#">
                            <i className="fab fa-youtube" />
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    );
}
