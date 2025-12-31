import React from 'react'
import styles from './Recent.module.css'
import { Col, Container, Row } from 'react-bootstrap'

const Recent = () => {

  const items = [{ id: 1, price: 2000, }, {id: 2, price: 5000}];



  return (
    <div className={styles.recent}>
      <div className={styles.title}>
        <div className={styles.tt}>
          최근 본 상품
        </div>
      </div>
      <div className={styles.content}>
        <Container fluid="md" className={styles.items}>
          <Row className={styles.row}>
            <Col xs={3} md={3} className={styles.item_t}>이미지</Col>
            <Col xs={5} md={5} className={styles.item_t}>상품명</Col>
            <Col xs={2} md={2} className={styles.item_t}>금액</Col>
            <Col xs={2} md={2} className={styles.item_t}>장바구니</Col>
          </Row>
          {items.map((i) => (
            <Row key={i.id} className={`g-0 ${styles.row}`}>
              <Col xs={3} md={3} className={`px-0 ${styles.item}`}>
                <img src={i.imgUrl} alt=""></img>
              </Col>
              <Col xs={5} md={5} className={`px-0 ${styles.item}`}>
                <div>{i.name}</div>
              </Col>
              <Col xs={2} md={2} className={`px-0 ${styles.item}`}>
                <div>{i.price}원</div>
              </Col>
              <Col xs={2} md={2} className={`px-0 ${styles.item}`}>
                <button>장바구니에 넣기</button>
              </Col>
            </Row>
          ))}
        </Container>
      </div>
    </div>
  )
}

export default Recent