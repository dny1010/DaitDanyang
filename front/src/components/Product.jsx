import React from 'react'
import { useEffect, useState } from "react";
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";

import styles from "./Product.module.css";
import { fetchProductDetail } from "../api/productApi";
import { fetchMyCart, addCart, updateCart } from "../api/cartApi";

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 현재 상품 데이터
    const [product, setProduct] = useState([]);

    // 로딩, 에러 처리
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 밑에 상세페이지 부분
    const [activeTab, setActiveTab] = useState("info");

    const getImageSrc = (item) => {
        // item?.imgUrl 옵셔널체이닝(?.) → item이 있으면 가져오고 없으면 에러내지말고 undefined를 돌려달라는 문법
        // (item?.imgUrl 과 item ? item.imgUrl : undefined 이 같은 뜻)
        // trim() = 공백제거
        const url = (item?.imgUrl ?? "").trim();
        return url ? url : `${process.env.PUBLIC_URL}/images/no-image.png`;
    };

    // url의 id가 바뀔 때마다 다시 실행
    useEffect(() => {
        // component가 살아있을 때만 setState 한다는 안전장치
        // ( 상품 불러오는 중에 사용자가 다른 페이지로 이동하려고 하면 사라진 컴포넌트에 setState 하지말라는 뜻 )
        let alive = true;

        async function load() {
            setLoading(true); // 새 요청 시작 → 로딩 true
            setError(""); // 이전 에러 제거

            // 서버에 요청
            try {
                const data = await fetchProductDetail(id);
                // 안전 처리 (없으면 기본값)
                // ***** models에 category랑 sub_category 차이 물어보고 같으면 빼기 *****
                setProduct({
                    id: data?.id ?? Number(id), // 서버가 id주면 그 값을, 안 주면 url에 id를 숫자로 써라
                    title: data?.title ?? "",
                    content: data?.content ?? "",
                    price: Number(data?.price) || 0,
                    imgUrl: (data?.imgUrl ?? "").trim(),
                    category: data?.category ?? "",
                    sub_category: data?.sub_category ?? "",
                    pet_type: data?.pet_type ?? "",
                    review_count: Number(data?.review_count) || 0,
                });
                if (!alive) return;
                // 실패했을 때
            } catch (e) {
                if (!alive) return;
                setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
                setProduct(null);
                // 성공 실패 상관없이 로딩 종료
            } finally {
                if (alive) setLoading(false);
            }
        }

        // URL이 이상해서 id가 없으면 굳이 요청할 필요 없음, 있으면 load 실행
        if (!id) return;
        load();

        // page 이동 등으로 컴포넌트가 사라지면 이후 도착하는 응답 무시 
        return () => {
            alive = false;
        };
    }, [id]);

    // 찜
    const wishitem = () => {
        console.log("찜", product?.id);
    };

    // 카트
    const cartitem = async () => {
        if (!product?.id) return;

        try {
            // 내 장바구니 불러오기
            const cart = await fetchMyCart();
            // 같은 상품이 있으면 count+1
            console.log(cart);
            const existitem = cart?.find((c) => c.product_id === product.id);

            if (existitem) {
                await updateCart(existitem.id, existitem.count + 1);
            } else {
                await addCart(product.id, 1);
            }
            const yes = window.confirm("장바구니로 이동하시겠습니까?");
            if (yes) {
                navigate("/cart");
            }
        } catch (e) {
            alert(e.message || "장바구니 담기에 실패했습니다.");
        }
    };

        // 구매 (지금 cart page는 db에 저장 X, cartStorage = 브라우저에 저장해둠)
    const buyitem = async () => {
        if (!product?.id) return;

        try {
            const cart = await fetchMyCart();
            const exist = cart.find((c) => c.product_id === product.id);

            if (exist) {
                await updateCart(exist.id, exist.count + 1);
            } else {
                await addCart(product.id, 1);
            }
            // cart page는 browser에 저장 db로 바꿔달라고 요청하기 + check 표시 되게 할건지 물어보고
            // navigate(`/cart?buy=${product.id}`); 이렇게 고치고
            // cart.jsx에 const { search } = useLocation(); const buyProductId = Number(new URLSearchParams(search).get("buy")); → 화면에서만 쓰는 임시 체크상태 추가 (URL로 보냄)


            navigate("/cart");
        } catch (e) {
            alert("구매 처리 중 오류가 발생했습니다.");
        }
    };

    // 밑에 상세페이지 (탭처럼 보이지만 누르면 그 위치로 스크롤 이동시켜줌)
    // behavior: "smooth" 부드럽게 이동, start 섹션 맨 위가 화면 위쪽으로
    const scrollTo = (id) => {
        setActiveTab(id);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <Container className="my-4">
            {/* 로딩중일 때 */}
            {loading && (
                <div className="d-flex justify-content-center my-4">
                    <Spinner animation="border" />
                </div>
            )}

            {/* 에러 났을 때 */}
            {!loading && error && (
                <Alert variant="danger" className="my-3">
                    {error}
                </Alert>
            )}

            {/* 정상적으로 작동할 때 */}
            {!loading && !error && product && (
                <>
                    <div className={styles.content}>
                        <div className={styles.product}>
                            <img src={getImageSrc(product)} alt={product.title} />
                        </div>

                        <div className={styles.text}>
                            <h2>{product.title}</h2>
                            <hr />
                            <div className={styles.row}>
                                <span className={styles.label}>판매가</span>
                                <span className={styles.price}>
                                    {product.price}원
                                </span>
                            </div>

                            <div className={styles.row}>
                                <span className={styles.label}>배송비</span>
                                <span className={styles.value}>3000원</span>
                            </div>

                            <div className={styles.button}>
                                <button className={styles.wishBtn} onClick={wishitem}>
                                    ♡
                                </button>
                                <button className={styles.cartBtn} onClick={cartitem}>
                                    장바구니
                                </button>
                                <button className={styles.buyBtn} onClick={buyitem}>
                                    구매하기
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.detailNav}>
                        <button className={activeTab === "info" ? styles.active : ""} onClick={() => scrollTo("info")}>
                            상품정보
                        </button>
                        <button className={activeTab === "exchange" ? styles.active : ""} onClick={() => scrollTo("exchange")}>
                            교환/반품
                        </button>
                        <button className={activeTab === "review" ? styles.active : ""} onClick={() => scrollTo("review")}>
                            상품후기 ({product?.review_count ?? 0})
                        </button>

                        {/* **** question db에 product_id가 없어서 문의 개수 불러올 수 X **** */}
                        <button className={activeTab === "qna" ? styles.active : ""} onClick={() => scrollTo("qna")}>
                            상품문의 (0)
                        </button>
                    </div>

                    <section id="info" className={styles.detailpage}>
                        <ul className={styles.infoList}>
                            <h4>배송정보</h4>
                            <br />
                            <li>3만원 이상 구매 시 무료배송됩니다. (부피, 무게 무관)</li>
                            <li>제주, 도서산간 지역은 3,000원 택배비 추가됩니다.</li>
                            <li>
                                도그팡, 캣팡 출고상품은 평일 오후 5시까지,
                                토요일은 낮 12시 결제건까지 당일 출고됩니다.
                            </li>
                            <li>택배사 사정에 따라 CJ대한통운, 롯데택배로 출고될 수 있습니다.</li>
                            <li>업체 배송의 경우 1~3일 추가 소요일 수 있습니다.</li>
                            <li>천재지변, 물량 급증 등으로 배송 지연이 발생할 수 있습니다.</li>
                        </ul>
                    </section>

                    <section id="exchange" className={styles.detailpage}>
                        <ul className={styles.infoList}>
                            <h4>교환/반품 안내</h4>
                            <br />
                            <li>단순변심에 의한 환불은 제품 수령후 7일이내에 신청 가능합니다. (왕복배송비 고객부담)</li>
                            <li>단순변심에 의한 반품시 배송박스 수량에 따라 반품 택배비가 추가됩니다.</li>
                            <li>포장개봉, 조립, 사용 등으로 인해 재판매가 불가능할 경우 반품이 불가능 할 수 있습니다.</li>
                            <li>제품 하자의 경우 물품 수령 후 30일이내 반품 가능합니다.</li>
                        </ul>
                    </section>

                    <section id="review" className={styles.detailpage}>
                        <h4>상품후기</h4>
                        <p>리뷰</p>
                    </section>

                    <section id="qna" className={styles.detailpage}>
                        <h4>상품문의</h4>
                        <p>문의</p>
                    </section>
                </>
            )}

        </Container>
    );
}
export default Product