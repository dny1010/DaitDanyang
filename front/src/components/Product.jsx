import React from 'react'
import { useEffect, useState } from "react";
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useParams } from "react-router-dom";

import styles from "./Product.module.css";
import { fetchProductDetail } from "../api/productApi";

const Product = () => {
    const { id } = useParams();

    // 현재 상품 데이터
    const [product, setProduct] = useState([]);

    // 로딩, 에러 처리
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const getImageSrc = (item) => {
        // item?.image_url 옵셔널체이닝(?.) → item이 있으면 가져오고 없으면 에러내지말고 undefined를 돌려달라는 문법 
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
                <div className={`d-flex gap-10 ${styles.content}`}>
                    <div className={styles.product}>
                        <img src={getImageSrc(product)} alt={product.title} />
                    </div>

                    <div className={styles.text}>
                        <h2>{product.title}</h2>
                        <p>{product.content}</p>
                        <p>{Number(product.price)}원</p>
                    </div>
                </div>
            )}
        </Container>
    );
}
export default Product