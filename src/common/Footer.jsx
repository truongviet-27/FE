import React from "react";
import "../static/css/style.css";

import { NavLink } from "react-router-dom";
import "../assets/css/index.css";
import "../assets/css/theme.css";
import "../assets/css/grid.css";
const Footer = () => {
    return (
        <footer>
            <div className="bg-black text-white">
                <div className="flex flex-col">
                    <div className="grid grid-cols-1 sm:grid-cols- md:grid-cols-3 2xl:grid-cols-3 gap-4 !px-10 sm:!px-15 md:!px-20 xl:!px-30 2xl:!px-50">
                        <div className="">
                            <hr className="light" />
                            <h5>Liên hệ</h5>
                            <hr className="light" />
                            <p>Tư vấn mua hàng (Miễn phí)</p>
                            <p>0989704950(Nhánh 1)</p>
                            <p>Hỗ trợ kỹ thuật</p>
                            <p>0989704950 (Nhánh 2)</p>
                        </div>
                        <div className="">
                            <hr className="light" />
                            <h5>Giờ làm việc</h5>
                            <hr className="light" />
                            <p>Thứ hai-Chủ nhật: 8:00 - 21:00</p>
                            <p>Have a nice dayy to youuuu!!!!</p>
                        </div>
                        <div className="">
                            <hr className="light" />
                            <h5>Hệ thống cửa hàng</h5>
                            <hr className="light" />
                            <p>Chính sách đổi trả</p>
                            <p>Chính sách trả góp</p>
                            <p>Hướng dẫn mua trả góp</p>
                        </div>
                    </div>
                    <div className="f">
                        <hr className="light-100" />
                        <h5 className="text-center">© 2020 - 2025 ShoeFast </h5>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
