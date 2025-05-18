import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getProductById } from "../../../api/ProductApi";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
const Detail = () => {
    const { id } = useParams();
    const [item, setItem] = useState();
    const [attributes, setAttributes] = useState([]);
    const [price, setPrice] = useState();
    const [stock, setStock] = useState();
    const [flag, setFlag] = useState();
    const history = useHistory();

    const [images, setImages] = useState([]);

    useEffect(() => {
        onLoad();
    }, [id]);

    console.log(price, stock, flag, attributes, "xxxxxxxxxxxx");

    const onLoad = () => {
        getProductById(id)
            .then((res) => {
                setItem(res.data.data);
                setAttributes(res.data.data.attributes);
                setImages(
                    res.data.data.imageUrls.map((item) => ({
                        original: item.url,
                        thumbnail: item.url,
                    }))
                );
                onModify(
                    res.data.data.attributes[0].price,
                    res.data.data.attributes[0].stock,
                    res.data.data.attributes[0]._id
                );
            })
            .catch((error) => console.log(error));

        // getAttribute(id, 39)
        //     .then((res) => {
        //         onModify(res.data.price, res.data.stock, res.data.id);
        //     })
        //     .catch((error) => console.log(error));
    };

    const onModify = (price, stock, flag) => {
        setPrice(price);
        setStock(stock);
        setFlag(flag);
    };

    const goBack = () => {
        history.goBack();
    };
    return (
        item && (
            <div className="card flex flex-col !mx-[25px] overflow-y-scroll">
                <div className="col-12 flex items-center justify-between text-center mb-5">
                    <button style={{ width: 60 }} onClick={() => goBack()}>
                        <i
                            className="fa fa-arrow-left"
                            style={{ fontSize: 18 }}
                            aria-hidden="true"
                        ></i>
                    </button>
                    <h2 className="text-danger">Chi tiết sản phẩm</h2>
                    <div className="w-[60px]"></div>
                </div>
                <div className="flex flex-col lg:flex-row border border-gray-200 rounded-2xl !p-10 !mb-10 !mt-0">
                    <div className="w-full xl:w-2/5 lg:!pr-10">
                        <div className="h-full w-full">
                            <div className="!h-full !w-full">
                                {item.imageUrls.length > 0 && (
                                    <ImageGallery
                                        items={images}
                                        showPlayButton={false}
                                        additionalClass="custom-gallery"
                                    />
                                )}
                            </div>
                            <div className="container row offset-3 mt-5 mb-5">
                                {item?.images?.map((item, index) => (
                                    <img
                                        key={index}
                                        src={item}
                                        alt={`Image ${index + 1}`}
                                        className="img-thumbnail mr-3"
                                        style={{
                                            width: "200px",
                                            height: "200px",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="w-full xl:w-3/5">
                        <div className="text-[14px]">
                            <div className="text-[24px] font-bold">
                                <span>{item?.name.toUpperCase()} </span>
                                <span className="">- {item?.code}</span>
                            </div>

                            <div className="mt-4">
                                <span className="font-medium">
                                    Mã SP: {item?.code}
                                </span>
                            </div>
                            <div className="flex gap-10 mt-4">
                                <span className="font-medium">
                                    Đã bán: {12} sản phẩm
                                </span>
                                <span className="font-medium">
                                    Lượt xem: {item?.view} lượt
                                </span>
                                <span className="font-medium">
                                    Yêu thích: {item?.likeQuantity?.length}
                                </span>
                            </div>

                            <div className="flex gap-4 mt-4 font-medium">
                                <div className="flex gap-2 items-center text-[20px] text-[#b4b4b4]">
                                    <span> Giá gốc:</span>
                                    <span className="ml-2">
                                        {price && item?.sale?.discount > 0 ? (
                                            <del>
                                                {price?.toLocaleString() + " đ"}
                                            </del>
                                        ) : (
                                            price &&
                                            price?.toLocaleString() + " đ"
                                        )}
                                    </span>
                                </div>
                                <span className="text-[20px]">
                                    Giá bán:{" "}
                                    {price &&
                                        (
                                            (price *
                                                (100 - item?.sale?.discount)) /
                                            100
                                        )?.toLocaleString() + " đ"}
                                </span>
                                <div className="flex items-center rounded-[4px] px-1 bg-[#feeeea] !text-[#ee4d2d] text-[12px]">
                                    {item?.sale?.discount}%
                                </div>
                            </div>

                            <div className="mt-4">
                                <span className="text-[15px] font-medium">
                                    Tồn kho: {stock}
                                </span>
                            </div>
                            <hr />
                            <div className="flex items-start gap-4">
                                <span className="text-[15px] font-medium">
                                    Kích thước:
                                </span>
                                <div className="flex gap-4 flex-wrap">
                                    {attributes?.map((i) => (
                                        <div
                                            className="flex items-center gap-2"
                                            key={item._id}
                                        >
                                            <input
                                                className="form-check-input !mt-0"
                                                type="radio"
                                                name="inlineRadioOptions"
                                                id="inlineRadio3"
                                                defaultValue="option3"
                                                onChange={() =>
                                                    onModify(
                                                        i?.price,
                                                        i?.stock,
                                                        i?._id
                                                    )
                                                }
                                                checked={flag == i?._id}
                                            />
                                            <div className="flex gap-1 items-center">
                                                <span className="text-[15px] font-medium">
                                                    {i?.size}{" "}
                                                </span>
                                                <span className="text-[12px] font-medium">
                                                    {i?.stock === 0 &&
                                                        "(Hết hàng)"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr />
                        </div>
                        <div className="">
                            <p className="text-[20px] font-bold !mb-4 !mt-10">
                                Mô tả sản phẩm
                            </p>
                            <span className="text-[14px]">
                                {item?.description}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default Detail;
