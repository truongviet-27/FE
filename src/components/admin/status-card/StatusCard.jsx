import React from "react";
import "./status-card.css";

const StatusCard = (props) => {
    return (
        <div
            className="status-card"
            onClick={props.onClick}
            style={{ cursor: "pointer" }}
        >
            <div className="status-card__icon">
                <i className={props.icon}></i>
            </div>
            <div className="status-card__info flex gap-2 items-center">
                <span>{props.title} </span>
                <h4 className="!text-[20px] !mb-1">{props.count}</h4>
            </div>
        </div>
    );
};

export default StatusCard;
