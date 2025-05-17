import "./status-card.css";

const StatusCard = (props) => {
    return (
        <div
            className="status-card !pr-10 lg:!pr-20 2xl:!pr-30 lg:!pl-10  flex justify-between"
            onClick={props.onClick}
            style={{ cursor: "pointer" }}
        >
            <div className="status-card__icon">
                <i className={props.icon}></i>
            </div>
            <div className="status-card__info flex gap-2 items-center justify-between font-bold !text-[15px] lg:!text-[17px] 2xl:!text-[20px] ">
                <span>{props.title} </span>
                <h4 className="!text-[15px] lg:!text-[17px] 2xl:!text-[20px] !mb-0">
                    {props.count}
                </h4>
            </div>
        </div>
    );
};

export default StatusCard;
