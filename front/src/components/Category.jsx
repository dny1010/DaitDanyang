// import React from 'react'
// import { Row, Col, Container, Button } from 'react-bootstrap'
// import { useNavigate, useParams } from 'react-router-dom'

// import { CATEGORY_LABEL, CATEGORY_ORDER } from '../constants/category_name'

// // 적어야할 것들
// // 밑에 list.map에 navigate(`/product/${id}`) 라고 적었는데 다르면 수정하기 + img 경로

// // Route path = "/category/:pet/:sub?" element = { <Category items={products} />} 여기서 ?는 있을 수도 없을 수도 있다

// // 아직 seed파일이 없으니까 items를 못 받아와서 에러방지용 safeitem
// const safeitems = Array.isArray(items) ? items : [];


// // const Category= (prop) => { const items = prop.items; } 를 줄인 게 const Category = ({ item }) => {}
// const Category = ({ items }) => {
//     const { pet, sub } = useParams();

//     const navigate = useNavigate();

//     // ? : → 조건(삼항연산자), ?? → null/undefined 체크
//     // CATEGORY_ORDER를 쓰고 order안에 없으면 [] 빈 문자열을 내보내라
//     const categories = CATEGORY_ORDER[pet] ?? []; // .map() 에러방지용 (pet이 잘못됐거나 url에 pet이 없을 때)
//     const categoryName= sub ? CATEGORY_LABEL[sub] : null;

//     // seed파일 나오고 데이터 생기면 safeitems를 items로 고치기
//     const list = safeitems
//         .filter(x => x.pet_type === pet)
//         .filter(x => !sub || x.category === categoryName)

//     return (
//         <>
//             {categories.length > 0 && <div>
//                 { categories.map ( code => (
//                     // 신버전 navigate(`/category/${pet}/${code}`) = 구버전 navigate('/category/'+ pet + '/' + code)
//                     <button key={code} onClick={() => navigate(`/category/${pet}/${code}`)}>{CATEGORY_LABEL[code]}</button>
//                 )) }
//             </div>}
//             <div>
//                 {/* localeCompare = 문자열 정렬을 위한 비교함수 (JS 기본기능) */}
//                 {/* <Button variant="light" onClick={() => {
//                     let copy = [...items]
//                     copy.sort((a, b) => a.title.localeCompare(b.title))
//                     setProducts(copy)
//                 }}>이름순 정렬</Button> {' '}
//                 <Button variant="light" onClick={() => {
//                     let copy = [...products]
//                     copy.sort((a, b) => (a.views > b.views) ? 1 : -1)
//                     setProducts(copy)
//                 }}>조회순</Button> {' '}
//                 <Button variant="light" onClick={() => {
//                     let copy = [...products]
//                     copy.sort((a, b) => (a.review_count < b.review_count) ? 1 : -1)
//                     setProducts(copy)
//                 }}>리뷰 많은 순</Button> {' '}
//                 <Button variant="light" onClick={() => {
//                     let copy = [...products]
//                     copy.sort((a, b) => (a.price > b.price) ? 1 : -1)
//                     setProducts(copy)
//                 }}>낮은 가격 순</Button> {' '}
//                 <Button variant="light" onClick={() => {
//                     let copy = [...products]
//                     copy.sort((a, b) => (a.price < b.price) ? 1 : -1)
//                     setProducts(copy)
//                 }}>높은 가격 순</Button> */}
//             </div>
//             <Container>
//                 <Row>
//                     {list.map((item) =>
//                         <Col xl={5} sm={3} key={item.id} onClick={() => { navigate(`/product/${item.id}`) }} >
//                             {/* process.env.PUBLIC_URL = public 폴더 안 파일을 가져올 때 쓰는 절대경로 => react가 자동으로 올바름 public경로를 붙여줌
//                                 ∵ 개발환경 / 배포환경에서 경로가 달라질 수 있기 때문 */}
//                             <img src={`${process.env.PUBLIC_URL}/item.imgUrl`} alt="상품이미지" />
//                             <h4>{item.title}</h4>
//                             <p>{item.price}</p>
//                         </Col>
//                     )}
//                 </Row>
//             </Container>
//         </>
//     )
// }

// export default Category