
import React, { useEffect, useMemo, useState } from 'react'
import { Row, Col, Container, Button, Pagination } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'

import styles from './Category.module.css';
import { CATEGORY, CATEGORY_ORDER } from '../constants/category_name'


// 적어야할 것들
// 밑에 list.map에 navigate(`/product/${id}`) 라고 적었는데 다르면 수정하기 + img 경로

// Route path = "/category/:pet/:sub?" element = { <Category items={products} />} 여기서 ?는 있을 수도 없을 수도 있다


// const Category= (prop) => { const items = prop.items; } 를 줄인 게 const Category = ({ item }) => {}
const Category = ({ items }) => {
    const { pet, sub } = useParams();
    const [sortlist, setSortList] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();




    // ? : → 조건(삼항연산자), ?? → null/undefined 체크
    // CATEGORY_ORDER를 쓰고 order안에 없으면 [] 빈 문자열을 내보내라
    const categories = CATEGORY_ORDER[pet] ?? []; // .map() 에러방지용 (pet이 잘못됐거나 url에 pet이 없을 때)




    // 렌더 = React가 컴포넌트 함수를 다시 실행해서 화면에 무엇을 그릴지 계산하는 과정 (실제로 그리는 거 아니고 계산만)
    // 렌더가 일어나는 조건 1. state가 바뀔 때 2. props가 바뀔 때 3. 부모 컴퍼넌트가 렌더될 때

    // useMemo란 ? 렌더할 때마다 다시 계산하지 않아도 되는 값을 기억해두는 hook = 같은 조건이면 아까 만들어둔 배열을 그대로 다시 써라
    // useMemo가 없으면 렌더 1 내용과 렌더 2 내용이 같아도 새 배열에 저장되기 때문에 (참조가 다르기 때문) 다른 걸로 인식 = 렌더링
    // react는 원시값(= pet/sub같은 문자열 / 값 자체를 비교)은 내용, 객체/배열은 참조(주소)가 바뀌면 바뀌었다고 판단
    const list = useMemo(() => {
        // *** 아직 seed파일이 없으니까 items를 못 받아와서 에러방지용 safeitem
        const safeitems = Array.isArray(items) ? items : [];
        // *** seed파일 나오고 데이터 생기면 safeitems를 items로 고치기
        const categoryName = CATEGORY[sub]?.label ?? null;

        return safeitems
            .filter(x => x.pet_type === pet)
            .filter(x => !sub || x.category === categoryName)
    }, [items, pet, sub]) // []내용 : 언제 다시 계산해야하는지 조건을 걸어둔 것 (or) 여기에는 결과가 아닌 원인을 적는다 ( list가 아닌 safeitems를 적는 이유 )




    const PER_PAGE = 5;
    const PAGE_GROUP = 10;

    const totalPages = Math.ceil(sortlist.length / PER_PAGE); // Math.ceil => 올림함수 (소수점이 있으면 무조건 올려라)
    const start = (page - 1) * PER_PAGE;
    const pageItems = sortlist.slice(start, start + PER_PAGE)

    // Math.floor => 내림함수
    const startPage = Math.floor((page - 1) / PAGE_GROUP) * PAGE_GROUP + 1;
    const endPage = Math.min(startPage + PAGE_GROUP - 1, totalPages);

    // 필터, 카테고리 변경으로 상품수가 줄어들거나 검색어 입력, 데이터가 비동기로 갱신될 때 등 page가 예전값으로 남는 일이 생겨서 빈 화면이 나오는 걸 방지
    useEffect(() => {
        if (page > totalPages) { setPage(1); }
    }, [page, totalPages]);



    // 기본값 세팅, 상태 동기화 / 기본 목록(list)를 sortlist에 복사 = setSortList(list)
    // list는 렌더가 재실행될때마다 바뀐걸로 인식 = 새 배열
    // useEffect실행하면 setSortList실행 -> state 변경 -> 랜더 재발생 -> 새 list배열 생성
    useEffect(() => { setSortList(list); }, [list])




    return (
        <div className={styles.category}>
            {categories.length > 0 && <div className={`d-flex justify-content-between align-items-center ${styles.sub}`} >
                {categories.map(code => (
                    // 신버전 navigate(`/category/${pet}/${code}`) = 구버전 navigate('/category/'+ pet + '/' + code)
                    <button key={code} onClick={() => navigate(`/category/${pet}/${code}`)} className={styles.sub_ctgr}>
                        <img src={CATEGORY[code].img} alt={CATEGORY[code].label} className={styles.icon}></img>
                        <p>{CATEGORY[code].label}</p>
                    </button>
                ))}
            </div>}

            <div>
                {/* localeCompare = 문자열 정렬을 위한 비교함수 (JS 기본기능) */}
                <Button variant="light" onClick={() => {
                    let copy = [...sortlist]
                    copy.sort((a, b) => a.title.localeCompare(b.title))
                    setSortList(copy)
                }}>이름순 정렬</Button> {' '}
                <Button variant="light" onClick={() => {
                    let copy = [...sortlist]
                    copy.sort((a, b) => (a.views < b.views) ? 1 : -1)
                    setSortList(copy)
                }}>조회순</Button> {' '}
                <Button variant="light" onClick={() => {
                    let copy = [...sortlist]
                    copy.sort((a, b) => (a.review_count < b.review_count) ? 1 : -1)
                    setSortList(copy)
                }}>리뷰 많은 순</Button> {' '}
                <Button variant="light" onClick={() => {
                    let copy = [...sortlist]
                    copy.sort((a, b) => (a.price > b.price) ? 1 : -1)
                    setSortList(copy)
                }}>낮은 가격 순</Button> {' '}
                <Button variant="light" onClick={() => {
                    let copy = [...sortlist]
                    copy.sort((a, b) => (a.price < b.price) ? 1 : -1)
                    setSortList(copy)
                }}>높은 가격 순</Button>
            </div>

            <Container className={styles.container}>
                <Row className="row-cols-3 row-cols-lg-5 g-3 ">
                    {pageItems.map((item) =>
                        <Col className={styles.col} key={item.id} onClick={() => { navigate(`/product/${item.id}`) }} >
                            {/* process.env.PUBLIC_URL = public 폴더 안 파일을 가져올 때 쓰는 절대경로 => react가 자동으로 올바름 public경로를 붙여줌
                                ∵ 개발환경 / 배포환경에서 경로가 달라질 수 있기 때문 */}
                            <img src={`${process.env.PUBLIC_URL}${item.imgUrl}`} alt="상품이미지" />
                            <h5>{item.title}</h5>
                            <p>{item.price}원</p>
                        </Col>
                    )}
                </Row>

                {totalPages > 1 && (
                    <div className='d-flex jestify-content-center mt-4'>
                        <Pagination className={styles.page}>
                            <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
                            <Pagination.Prev onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} />
                            {/* Array.from = 배열처럼 생긴걸 진짜 배열로 바꿔주는 함수 / Array.from(대상, (value, index) => 새값)
                            Array.from(배열로 만들 대상, 각 요소를 어떻게 바꿀지 변환함수 설정(선택)) 
                            배열로 만들 대상: length: totalPages / totalPages가 5면 5칸짜리 배열처럼 보이기만 하고 값이 없어서 전부 undefined로 나타남
                            변환함수(value(배열의 값 / 현재 변환함수로 봤을 때에는 undefined ∴ 이 값은 안 쓴다고 정의), index) => 결과
                            : (_, i) => i / _은 안 쓰는 값(관례), i = index(Array.from이 정해놓은 약속) 
                            결론 = totalPages 길이만큼 배열을 만들고 index(0,1,2) 번호를 page(1,2,3) 번호로 바꿔라 */}
                            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((n) => (
                                <Pagination.Item key={n} active={n === page} onClick={() => setPage(n)}>
                                    {n}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
                            <Pagination.Last onClick={() => setPage(totalPages)} disabled={page === totalPages}/>
                        </Pagination>
                    </div>
                )}
            </Container>
        </div>
    )
}


export default Category
