import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { NavLink, useParams } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { toast } from "react-toastify";
import { getAllReviewAttributeByProductId } from "../api/AttributeApi";
import {
    getCartItemByAccountId,
    isEnoughCartItem,
    modifyCartItemFromDetail,
} from "../api/CartApi";
import {
    getProductById,
    getRecommendation,
    relateProduct,
    toggleLikeProduct,
} from "../api/ProductApi";
import formatDate from "../utils/convertDate";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const ProductDetail = (props) => {
    const { id } = useParams();
    const [product, setProduct] = useState();
    const [attributes, setAttributes] = useState([]);
    const [price, setPrice] = useState();
    const [stock, setStock] = useState();
    const [attribute, setAttribute] = useState();
    const [count, setCount] = useState(1);
    const [status, setStatus] = useState(true);
    const [relate, setRelate] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [show, setShow] = useState(false);
    const [temp, setTemp] = useState();
    const [cart, setCart] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [totalReview, setTotalReviews] = useState(1);
    const [pageReview, setPageReview] = useState(0);
    const [images, setImages] = useState([]);

    const [hasMore, setHasMore] = useState(true);

    const loadRelatedProducts = async () => {
        try {
            const res = await relateProduct(
                page,
                5,
                product._id,
                product.brand._id,
                localStorage.getItem("id")
            );
            setRelate(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Error fetching related products:", err);
        }
    };

    useEffect(() => {
        loadRelatedProducts();
        setHasMore(!(page === totalPages - 1));
    }, [page]);

    const handleClose = () => setShow(false);
    const handleShow = (value) => {
        getProductById(value)
            .then((res) => {
                setTemp(res.data);
                console.log(res.data);
            })
            .catch((error) => console.log(error));
        setShow(true);
    };

    useEffect(() => {
        onLoad();
    }, [id]);

    const onLoad = () => {
        getProductById(id)
            .then((res) => {
                setProduct(res.data.data);
                setImages(
                    res.data.data.imageUrls.map((item) => ({
                        original: item.url,
                        thumbnail: item.url,
                    }))
                );
                setAttributes(res.data.data?.attributes);
                onModify(
                    res.data.data.attributes[0].price,
                    res.data.data.attributes[0].stock,
                    res.data.data.attributes[0]
                );
                relateProduct(
                    page,
                    5,
                    res.data.data._id,
                    res.data.data.brand._id,
                    localStorage.getItem("id")
                )
                    .then((resp) => {
                        setRelate(resp.data.content);
                        setTotalPages(resp.data.totalPages);
                    })
                    .catch((error) => console.log(error));

                getRecommendation(res.data.data._id)
                    .then((resp) => {
                        setRecommendations(resp.data.data.content);
                    })
                    .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
        getAllReviewAttributeByProductId(id, page, 5).then((res) => {
            setReviews(res.data.content);
            setTotalReviews(res.data.totalPages);
        });

        setStatus(stock >= count);

        // if (localStorage.getItem("user")) {
        //     getCartItemByAccountId(
        //         JSON.parse(localStorage.getItem("user"))?._id
        //     ).then((resp) => {
        //         console.log("RESSPP" + resp);
        //         setCart(
        //             resp.data.data.map((item) => ({ ...item, checked: false }))
        //         );
        //     });
        // }
    };

    const onModify = (price, stock, attribute) => {
        setCount(1);
        setStatus(stock >= count);
        setPrice(price);
        setStock(stock);
        setAttribute(attribute);
    };

    const handleLike = (productId, currentLikeStatus) => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.warning("Vui lòng đăng nhập trước khi yêu thích sản phẩm");
            return;
        }

        toggleLikeProduct(productId, !currentLikeStatus, token)
            .then((response) => {
                toast.success(response.data.message);
                relateProduct(
                    page,
                    5,
                    product._id,
                    product.brand._id,
                    localStorage.getItem("id")
                ).then((response) => {
                    setRelate(response.data.content);
                    // setTotal(response.data.totalPages);
                });
            })
            .catch((error) => {
                console.error("Lỗi khi thực hiện thao tác like: ", error);
            });
    };

    const onAddCartHandler = async (attribute, lastPrice) => {
        if (!status) {
            toast.warning("Sản phẩm đã hết hàng.");
        } else {
            if (props.user) {
                const data = {
                    attributeId: attribute._id,
                    quantity: count,
                    lastPrice,
                };
                console.log(data, "data");
                modifyCartItemFromDetail(data)
                    .then((response) => {
                        toast.success(response.data.message);
                    })
                    .catch((error) => {
                        setCount(1);
                        toast.error(error.response.data.message);
                    });
            } else {
                const data = {
                    imageUrls: product.imageUrls,
                    product: {
                        _id: product._id,
                        name: product.name,
                        code: product.code,
                    },
                    attribute: {
                        _id: attribute._id,
                        size: attribute.size,
                        stock: attribute.stock,
                        price: attribute.price,
                    },
                    quantity: count,
                    lastPrice: lastPrice,
                };
                props.addHandler(data);
                toast.success("Thêm vào giỏ hàng thành công.");
                setCount(1);
            }
        }
    };

    const updateCount = (value) => {
        if (Number(value) >= 1 && Number(value) <= stock) {
            setCount(Number(value));
            isEnoughCartItem(attribute._id, value).catch((error) => {
                toast.warning(error.response.data.message);
                setCount(1);
            });
        } else {
            toast.warning("Số lượng không hợp lệ");
        }
    };

    const addCount = (value) => {
        if (props.user) {
            isEnoughCartItem(attribute._id, value)
                .then(() => {
                    setCount(value);
                })
                .catch((error) => {
                    toast.warning(error.response.data.message);
                });
        } else {
            const attributeItem = props.cartItem?.find(
                (item) => item.attribute._id === attribute._id
            );

            if (attributeItem) {
                if (
                    attributeItem.quantity + Number(value) >
                    attributeItem.attribute.stock
                ) {
                    toast.warning(
                        `Giỏ hàng đã có ${attributeItem.quantity} sản phẩm`
                    );
                } else {
                    setCount(Number(value));
                }
            } else {
                setCount(Number(value));
            }
        }
    };

    const onChangePageReview = (index) => {};

    var rows = new Array(totalReview).fill(0).map((zero, index) => (
        <li
            className={pageReview === index ? "page-item active" : "page-item"}
            key={index}
        >
            <button
                className="page-link"
                style={{ borderRadius: 50 }}
                onClick={() => onChangePageReview(index)}
            >
                {index + 1}
            </button>
        </li>
    ));

    return (
        <div>
            {product && (
                <div className="col-12 mt-5">
                    <div className="flex flex-col lg:flex-row border border-gray-200 rounded-2xl !p-10 !mb-0 gap-12">
                        <div className="w-full lg:w-2/5 border rounded-2xl overflow-hidden">
                            <div className="!h-full !w-full">
                                {images.length > 0 && (
                                    <ImageGallery
                                        items={images}
                                        showPlayButton={false}
                                        additionalClass="custom-gallery"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="w-full lg:w-3/5">
                            <div className="text-[14px] mt-0 lg:!mt-0">
                                <div className="text-[24px] font-bold">
                                    <span>{product?.name.toUpperCase()} </span>
                                    <span className="">- {product?.code}</span>
                                </div>
                                <div className="mt-2">
                                    <Rating
                                        initialValue={product.rating ?? 5}
                                        size={20}
                                        transition
                                        allowFraction={true}
                                        SVGstyle={{ display: "inline-block" }}
                                        fillColor="#f59e0b"
                                        emptyColor="#9ca3af"
                                        readonly={true}
                                    />
                                </div>
                                <div className="mt-3">
                                    <span className="font-medium">
                                        Mã SP: {product?.code}
                                    </span>
                                </div>
                                <div className="flex gap-10 mt-4">
                                    <div className="flex gap-1 font-medium">
                                        <span> Đã bán:</span>
                                        <span>
                                            {
                                                product.attributes.find(
                                                    (attributeItem) =>
                                                        attributeItem._id ===
                                                        attribute._id
                                                )?.sumOrder
                                            }
                                        </span>
                                        <span>sản phẩm</span>
                                    </div>
                                    <span className="font-medium">
                                        Lượt xem: {product?.view} lượt
                                    </span>
                                    <span className="font-medium">
                                        Yêu thích:{" "}
                                        {product?.likeQuantity?.length}
                                    </span>
                                </div>

                                <div className="flex gap-4 mt-4 font-medium">
                                    <div className="flex gap-2 items-center text-[20px] text-[#b4b4b4]">
                                        <span> Giá gốc:</span>
                                        <span className="ml-2">
                                            {price &&
                                            product?.sale?.discount > 0 ? (
                                                <del>
                                                    {price?.toLocaleString(
                                                        "vi-VN"
                                                    ) + " đ"}
                                                </del>
                                            ) : (
                                                price &&
                                                price?.toLocaleString("vi-VN") +
                                                    " đ"
                                            )}
                                        </span>
                                    </div>
                                    <span className="text-[20px]">
                                        Giá bán:{" "}
                                        {price &&
                                            (
                                                (price *
                                                    (100 -
                                                        product?.sale
                                                            ?.discount)) /
                                                100
                                            )?.toLocaleString("vi-VN") + " đ"}
                                    </span>
                                    <div className="flex items-center rounded-[4px] px-1 bg-[#feeeea] !text-[#ee4d2d] text-[12px]">
                                        {product?.sale?.discount}%
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <span className="text-[15px] font-medium">
                                        Tồn kho: {stock}
                                    </span>
                                </div>
                                <hr />
                                <div className="flex items-center gap-4">
                                    <label className="mr-5">Kích thước</label>
                                    <div className="flex gap-4">
                                        {attributes?.map(
                                            (attributeItem, index) => (
                                                <div
                                                    className="flex items-center gap-2"
                                                    key={attributeItem._id}
                                                >
                                                    <input
                                                        className="form-check-input !mt-0"
                                                        type="radio"
                                                        name="inlineRadioOptions"
                                                        id="inlineRadio3"
                                                        defaultValue="option3"
                                                        onChange={() =>
                                                            onModify(
                                                                attributeItem?.price,
                                                                attributeItem?.stock,
                                                                attributeItem
                                                            )
                                                        }
                                                        disabled={
                                                            attributeItem?.stock ===
                                                            0
                                                        }
                                                        checked={
                                                            attribute._id ==
                                                            attributeItem?._id
                                                        }
                                                    />
                                                    <label className="form-check-label">
                                                        {attributeItem?.size}
                                                    </label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-5">
                                    <div
                                        className={`rounded-[7px] ${
                                            count === 1 ? "bg-gray-300" : ""
                                        }`}
                                    >
                                        <button
                                            className={`btn btn-outline-dark !px-[13px] `}
                                            onClick={() => addCount(count - 1)}
                                            disabled={count == 1}
                                        >
                                            -
                                        </button>
                                    </div>
                                    <input
                                        className="text-center w-[80px]"
                                        type="number"
                                        name="quantity"
                                        value={count}
                                        onChange={(e) =>
                                            updateCount(e.target.value)
                                        }
                                        min={1}
                                    />
                                    <div
                                        className={`rounded-[7px] ${
                                            count >= stock ? "bg-gray-300" : ""
                                        }`}
                                    >
                                        <button
                                            className="btn btn-outline-dark"
                                            onClick={() => addCount(count + 1)}
                                            disabled={count >= stock || !status}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <hr />
                                <button
                                    style={{ marginRight: "20px" }}
                                    onClick={() =>
                                        onAddCartHandler(
                                            attribute,
                                            (price *
                                                (100 -
                                                    product?.sale?.discount)) /
                                                100
                                        )
                                    }
                                    className="btn btn-primary text-white"
                                >
                                    <span className="!mr-2">Thêm vào giỏ</span>
                                </button>
                                <NavLink
                                    to="/cart"
                                    className="btn btn-primary ml-2"
                                >
                                    Đi đến giỏ hàng
                                </NavLink>
                            </div>
                            <div className="">
                                <p className="text-[20px] !mb-4 !mt-10">
                                    Mô tả sản phẩm
                                </p>
                                <span className="text-[14px]">
                                    {product?.description}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Đánh giá sản phẩm */}
                    <div className="col-12 mt-5 border border-gray-200 rounded-2xl !p-10">
                        <div className="text-center">
                            <p className="text-[34px] !mb-2">
                                Đánh giá sản phẩm
                            </p>
                        </div>
                        <div className="!px-10">
                            {reviews.map((review, index) => {
                                return (
                                    <div
                                        key={review._id}
                                        className="flex items-start gap-3 border-b border-gray-200 py-4"
                                    >
                                        <div className="border !border-gray-400 w-[60px] h-[60px] rounded-[50%] overflow-hidden">
                                            <img
                                                src={review?.user?.avatar}
                                                alt="User"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span>
                                                {review?.user?.username}
                                            </span>
                                            <div className="flex">
                                                <Rating
                                                    initialValue={
                                                        review?.rating
                                                    }
                                                    size={13}
                                                    transition
                                                    allowFraction
                                                    SVGstyle={{
                                                        display: "inline-block",
                                                    }}
                                                    fillColor="#f59e0b"
                                                    emptyColor="#9ca3af"
                                                    readonly={true}
                                                />
                                            </div>
                                            <div className="flex gap-1 items-center">
                                                <span className="text-[13px]">
                                                    {formatDate(
                                                        review?.createdAt,
                                                        true
                                                    )}
                                                </span>
                                                <span>|</span>
                                                <div className="text-[13px] flex gap-1">
                                                    <span className="font-medium">
                                                        Phân loại hàng:
                                                    </span>
                                                    <span>
                                                        {review?.product.name}
                                                    </span>
                                                    <span>-</span>{" "}
                                                    <span>Size:</span>
                                                    <span>
                                                        {review?.attribute.size}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1 mt-2">
                                                <span className="font-medium">
                                                    Mô tả:
                                                </span>
                                                <span>
                                                    {review?.description}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <nav
                                aria-label="Page navigation"
                                className="flex items-center justify-center !mt-20"
                            >
                                <div className="flex-1 flex justify-center items-center">
                                    <div className="flex pagination gap-4">
                                        <li
                                            className={
                                                page === 0
                                                    ? "page-item disabled"
                                                    : "page-item"
                                            }
                                        >
                                            <button
                                                className="page-link"
                                                style={{ borderRadius: 50 }}
                                                onClick={() =>
                                                    onChangePageReview(0)
                                                }
                                            >
                                                {`<<`}
                                            </button>
                                        </li>
                                        {rows}
                                        <li
                                            className={
                                                pageReview === totalReview - 1
                                                    ? "page-item disabled"
                                                    : "page-item"
                                            }
                                        >
                                            <button
                                                className="page-link"
                                                style={{ borderRadius: 50 }}
                                                onClick={() =>
                                                    onChangePageReview(
                                                        pageReview + 1
                                                    )
                                                }
                                            >
                                                {`>>`}
                                            </button>
                                        </li>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                    {/* Sản phẩm cùng thương hiệu */}
                    <div className="col-12 mt-5 border border-gray-200 rounded-2xl !p-10">
                        <div className="text-center">
                            <p style={{ fontSize: "34px" }}>
                                Sản phẩm cùng thương hiệu
                            </p>
                        </div>
                        <div className="!px-10 relative">
                            {relate?.length > 0 && (
                                <>
                                    <div className="absolute top-1/2 -left-5">
                                        <button
                                            onClick={() =>
                                                setPage((prev) => prev - 1)
                                            }
                                            disabled={page === 0}
                                        >
                                            {"<<"}
                                        </button>
                                    </div>
                                    <div className="absolute top-1/2 -right-5">
                                        <button
                                            onClick={() =>
                                                hasMore &&
                                                setPage((prev) => prev + 1)
                                            }
                                            disabled={!hasMore}
                                        >
                                            {">>"}
                                        </button>
                                    </div>
                                </>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                                {relate?.map((item) => (
                                    <div className="mb-3" key={item._id}>
                                        <div className="mb-3" key={item._id}>
                                            <div className="border rounded-2xl p-4 !overflow-y-hidden !h-full relative">
                                                <div className="absolute">
                                                    <span className="text-white bg-success small flex items-center px-2 py-1">
                                                        <i
                                                            className="fa fa-star"
                                                            aria-hidden="true"
                                                        ></i>
                                                        <span className="ml-1">
                                                            New
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="position-absolute right-6 text-[#EE4D2D] bg-[#FEEEEA] flex items-center px-2 py-1 text-[14px] font-medium">
                                                    <span className="ml-1">
                                                        Đã bán 12
                                                    </span>
                                                </div>

                                                <NavLink
                                                    to={`/product-detail/${item._id}`}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                        width: "100%",
                                                        height: "250px",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <img
                                                        src={item?.image}
                                                        alt="Product"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                        className="mini-card"
                                                    />
                                                </NavLink>

                                                <div className="card-body p-0">
                                                    <div className="flex flex-col justify-between">
                                                        <div className="flex items-center gap-1 pr-4 pt-2 rounded-2xl text-[#EE4D2D] line-through">
                                                            <div className="flex gap-1 font-medium text-[12px]">
                                                                <span>
                                                                    {Math.min(
                                                                        ...item.attributes.map(
                                                                            (
                                                                                a
                                                                            ) =>
                                                                                a.price ??
                                                                                0
                                                                        )
                                                                    ).toLocaleString(
                                                                        "vi-VN"
                                                                    )}{" "}
                                                                </span>
                                                                <span className="text-[12px]">
                                                                    đ
                                                                </span>
                                                            </div>
                                                            <span>-</span>
                                                            <div className="flex gap-1 font-medium text-[12px]">
                                                                <span>
                                                                    {Math.max(
                                                                        ...item.attributes.map(
                                                                            (
                                                                                a
                                                                            ) =>
                                                                                a.price ??
                                                                                0
                                                                        )
                                                                    ).toLocaleString(
                                                                        "vi-VN"
                                                                    )}{" "}
                                                                </span>
                                                                <span className="text-[12px]">
                                                                    đ
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-3 mb-1 items-center pr-4 py-2 rounded-2xl text-[#EE4D2D]">
                                                            <div className="flex gap-2">
                                                                <span className="font-medium text-[16px]">
                                                                    {(
                                                                        (Math.min(
                                                                            ...item.attributes.map(
                                                                                (
                                                                                    a
                                                                                ) =>
                                                                                    a.price ??
                                                                                    0
                                                                            )
                                                                        ) *
                                                                            (100 -
                                                                                item
                                                                                    ?.sale
                                                                                    ?.discount)) /
                                                                        100
                                                                    ).toLocaleString(
                                                                        "vi-VN"
                                                                    )}{" "}
                                                                    <span className="text-[12px]">
                                                                        đ
                                                                    </span>
                                                                </span>
                                                                <span>-</span>
                                                                <span className="font-medium text-[16px]">
                                                                    {(
                                                                        (Math.max(
                                                                            ...item.attributes.map(
                                                                                (
                                                                                    a
                                                                                ) =>
                                                                                    a.price ??
                                                                                    0
                                                                            )
                                                                        ) *
                                                                            (100 -
                                                                                item
                                                                                    ?.sale
                                                                                    ?.discount)) /
                                                                        100
                                                                    ).toLocaleString(
                                                                        "vi-VN"
                                                                    )}{" "}
                                                                    <span className="text-[12px]">
                                                                        đ
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            <div className="font-medium text-[14px]">
                                                                (
                                                                {
                                                                    item?.sale
                                                                        ?.discount
                                                                }
                                                                %)
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-warning d-flex align-items-center mb-3">
                                                        <i
                                                            className="fa fa-star"
                                                            aria-hidden="true"
                                                        ></i>
                                                        <i
                                                            className="fa fa-star"
                                                            aria-hidden="true"
                                                        ></i>
                                                        <i
                                                            className="fa fa-star"
                                                            aria-hidden="true"
                                                        ></i>
                                                        <i
                                                            className="fa fa-star"
                                                            aria-hidden="true"
                                                        ></i>
                                                        <i
                                                            className="fa fa-star"
                                                            aria-hidden="true"
                                                        ></i>
                                                    </p>
                                                    <div className="mb-0">
                                                        <span>
                                                            {item?.name}
                                                        </span>
                                                    </div>
                                                    <div className="!my-3">
                                                        <span className="font-medium">
                                                            Thương hiệu:
                                                        </span>
                                                        <span>
                                                            {item?.brand?.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex mb-3 justify-content-between">
                                                        <div className="flex gap-4">
                                                            <div className="flex gap-1">
                                                                <span className="font-medium">
                                                                    Lượt xem:
                                                                </span>
                                                                <span className="">
                                                                    {item?.view}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <span className="font-medium">
                                                                    Yêu thích:
                                                                </span>
                                                                <span className="">
                                                                    {
                                                                        item
                                                                            ?.likeQuantity
                                                                            ?.length
                                                                    }{" "}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <div className="">
                                                            <NavLink
                                                                to={`/product-detail/${item._id}`}
                                                                exact
                                                                className="btn btn-outline-primary btn-block"
                                                            >
                                                                <span className="!mr-2">
                                                                    Thêm vào giỏ
                                                                </span>
                                                                <i
                                                                    className="fa fa-shopping-basket ml-10"
                                                                    aria-hidden="true"
                                                                ></i>
                                                            </NavLink>
                                                        </div>
                                                        <div className="ml-2">
                                                            <NavLink
                                                                to="#"
                                                                className="btn btn-outline-success"
                                                                data-toggle="tooltip"
                                                                data-placement="left"
                                                                title="Add to Wishlist"
                                                                onClick={() =>
                                                                    handleLike(
                                                                        item._id,
                                                                        item?.liked
                                                                    )
                                                                }
                                                            >
                                                                <i
                                                                    className={`fa fa-heart ${
                                                                        item?.liked
                                                                            ? "text-danger"
                                                                            : ""
                                                                    }`}
                                                                    aria-hidden="true"
                                                                ></i>
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Sản phẩm gợi ý */}
                    <div className="col-12 mt-5 border border-gray-200 rounded-2xl !p-10 !mb-20">
                        <div className="text-center">
                            <p style={{ fontSize: "34px" }}>Sản phẩm gợi ý</p>
                        </div>
                        <div className="container-fluid padding">
                            <div className="row padding">
                                {recommendations?.map((item, index) => (
                                    <div className="col-md-4 mb-3" key={index}>
                                        <div className="card h-100 mini-pro">
                                            <div className="d-flex justify-content-between position-absolute w-100">
                                                <div className="label-new">
                                                    <span className="text-white bg-success small d-flex align-items-center px-2 py-1">
                                                        <i
                                                            className="fa fa-star"
                                                            aria-hidden="true"
                                                        ></i>
                                                        <span className="ml-1">
                                                            New
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            <NavLink
                                                to={`/product-detail/${item.id}`}
                                            >
                                                <img
                                                    src={item.image}
                                                    style={{
                                                        width: 150,
                                                        height: 150,
                                                    }}
                                                    alt="Product"
                                                    className="mini-card"
                                                />
                                            </NavLink>
                                            <div className="card-body px-2 pb-2 pt-1">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <p className="h4 text-primary mini-card">
                                                            {(
                                                                (item.price *
                                                                    (100 -
                                                                        item.discount)) /
                                                                100
                                                            ).toLocaleString(
                                                                "vi-VN"
                                                            )}{" "}
                                                            đ
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-warning d-flex align-items-center mb-2">
                                                    <i
                                                        className="fa fa-star"
                                                        aria-hidden="true"
                                                    ></i>
                                                    <i
                                                        className="fa fa-star"
                                                        aria-hidden="true"
                                                    ></i>
                                                    <i
                                                        className="fa fa-star"
                                                        aria-hidden="true"
                                                    ></i>
                                                    <i
                                                        className="fa fa-star"
                                                        aria-hidden="true"
                                                    ></i>
                                                    <i
                                                        className="fa fa-star"
                                                        aria-hidden="true"
                                                    ></i>
                                                </p>
                                                <p className="mb-0">
                                                    <strong>
                                                        <NavLink
                                                            to={`/product-detail/${item.id}`}
                                                            className="text-secondary "
                                                        >
                                                            {item.name}
                                                        </NavLink>
                                                    </strong>
                                                </p>
                                                <p className="mb-1">
                                                    <small>
                                                        <NavLink
                                                            to="#"
                                                            className="text-secondary "
                                                        >
                                                            {item.brand}
                                                        </NavLink>
                                                    </small>
                                                </p>
                                                <div className="d-flex mb-3 justify-content-between">
                                                    <div>
                                                        <p className="mb-0 small">
                                                            <b>Yêu thích: </b>{" "}
                                                            {item.view} lượt
                                                        </p>
                                                        <p className="mb-0 small">
                                                            <b>
                                                                Giá gốc:{" "}
                                                                {item.price.toLocaleString(
                                                                    "vi-VN"
                                                                )}{" "}
                                                                đ
                                                            </b>
                                                        </p>
                                                        <p className="mb-0 small text-danger">
                                                            <span className="font-weight-bold">
                                                                Tiết kiệm:{" "}
                                                            </span>{" "}
                                                            {(
                                                                (item.price *
                                                                    item.discount) /
                                                                100
                                                            ).toLocaleString(
                                                                "vi-VN"
                                                            )}{" "}
                                                            đ ({item.discount}
                                                            %)
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <div className="col px-0 ">
                                                        <button
                                                            onClick={() =>
                                                                handleShow(
                                                                    item.id
                                                                )
                                                            }
                                                            className="btn btn-outline-primary btn-block"
                                                            style={{
                                                                marginLeft:
                                                                    "-15px",
                                                            }}
                                                        >
                                                            So sánh
                                                        </button>
                                                        <NavLink
                                                            to={`/product-detail/${item.id}`}
                                                            exact
                                                            className="btn btn-outline-primary btn-block"
                                                        >
                                                            <span className="!mr-2">
                                                                Thêm vào giỏ
                                                            </span>
                                                            <i
                                                                className="fa fa-shopping-basket"
                                                                aria-hidden="true"
                                                            ></i>
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>So sánh sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th></th>
                                <th>{product?.name}</th>
                                <th>{temp?.name}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Code</td>
                                <td>{product?.code}</td>
                                <td>{temp?.code}</td>
                            </tr>
                            <tr>
                                <td>Thương hiệu</td>
                                <td>{product?.brand}</td>
                                <td>{temp?.brand}</td>
                            </tr>
                            <tr>
                                <td>Giá</td>
                                <td>
                                    {product?.price?.toLocaleString("vi-VN")} đ
                                </td>
                                <td>
                                    {temp?.price?.toLocaleString("vi-VN")} đ
                                </td>
                            </tr>
                            <tr>
                                <td>Giảm giá</td>
                                <td>{product?.discount} %</td>
                                <td>{temp?.discount} %</td>
                            </tr>
                            <tr>
                                <td>Lượt thích</td>
                                <td>{product?.view}</td>
                                <td>{temp?.view}</td>
                            </tr>
                            <tr>
                                <td>Size</td>
                                <td>
                                    {product?.attributes?.reduce(
                                        (result, product) =>
                                            result + " " + product.size + "",
                                        ""
                                    )}
                                </td>
                                <td>
                                    {temp?.attributes?.reduce(
                                        (result, product) =>
                                            result + " " + product.size + "",
                                        ""
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductDetail;
