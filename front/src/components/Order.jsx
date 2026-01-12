import React, { useState } from "react";
import styles from "./Order.module.css";


const Order = () => {
  /* ===== 주문 데이터 ===== */
  const [orderData, setOrderData] = useState({
    orderName: "",
    email: "",
    phone: "",
    receiver: "",
    address: "",
    receiverPhone: "",
    message: "",
    paymentMethod: "",
  });

  /* ===== input 처리 ===== */
  const handleChange = (key, value) => {
    setOrderData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ===== 결제수단 선택 ===== */
  const selectPayment = (method) => {
    setOrderData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  /* ===== 결제하기 ===== */
  const handlePay = async () => {
    if (!orderData.paymentMethod) {
      alert("결제수단을 선택하세요");
      return;
    }

    

    //   alert("결제가 완료되었습니다");
    //   console.log("결제 결과:", res.data);
    // } catch (err) {
    //   console.error(err);
    //   alert("결제 실패");
    // }
  };

  return (
    <div className={styles.page}>
      <div className={styles.orderWrap}>

        <div className={styles.orderTitle}>주문 / 결제</div>

        {/* ================= 주문 정보 ================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>주문 정보</div>

          <div className={styles.sectionBody}>
            <div className={styles.formRow}>
              <div className={styles.label}>주문자</div>
              <input
                className={styles.inputBox}
                onChange={(e) => handleChange("orderName", e.target.value)}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.label}>이메일</div>
              <input
                className={styles.inputBox}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.label}>휴대전화</div>
              <input
                className={styles.inputBox}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ================= 배송지 ================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>배송지</div>

          <div className={styles.sectionBody}>
            <div className={styles.formRow}>
              <div className={styles.label}>받는사람</div>
              <input
                className={styles.inputBox}
                onChange={(e) => handleChange("receiver", e.target.value)}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.label}>주소</div>
              <input
                className={styles.inputBoxSmall}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.label}>휴대전화</div>
              <input
                className={styles.inputBox}
                onChange={(e) => handleChange("receiverPhone", e.target.value)}
              />
            </div>

            <select
              className={styles.messageBox}
              onChange={(e) => handleChange("message", e.target.value)}
            >
              <option value="">-- 메시지 선택 --</option>
              <option value="문앞에 놓아주세요">문앞에 놓아주세요</option>
              <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
              <option value="부재 시 연락주세요">부재 시 연락주세요</option>
            </select>
          </div>
        </section>

        {/* ================= 주문 상품 ================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>주문상품</div>

          <div className={styles.sectionBody}>
            <div className={styles.productRow}>
              <div className={styles.productImage}></div>

              <div className={styles.productInfo}>
                슈퍼 스펀즈 트릿 스틱<br />
                옵션: 치킨<br />
                원
              </div>
            </div>

            <div className={`${styles.priceRow} ${styles.productShipping}`}>
              <span>배송비</span>
              <span>원</span>
            </div>
          </div>
        </section>

        {/* ================= 결제 정보 ================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>결제정보</div>

          <div className={styles.sectionBody}>
            <div className={styles.priceRow}>
              <span>상품금액</span>
              <span>원</span>
            </div>

            <div className={styles.priceRow}>
              <span>배송비</span>
              <span>원</span>
            </div>

            <div className={styles.totalRow}>
              <span>최종 결제 금액</span>
              <span>원</span>
            </div>
          </div>
        </section>

        {/* ================= 결제 수단 ================= */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>결제수단</div>

          <div className={`${styles.sectionBody} ${styles.paymentMethods}`}>
            <button onClick={() => selectPayment("CARD")}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/logos/card.png" alt="카드" height="20" />
              카드결제
            </button><br />

            <button onClick={() => selectPayment("BANK")}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/logos/bank.png" alt="계좌이체" height="20" />
              실시간 계좌이체
            </button><br />

            <button onClick={() => selectPayment("VIRTUAL")}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/logos/virtual.png" alt="가상계좌" height="20" />
              가상계좌
            </button><br />

            <button onClick={() => selectPayment("PHONE")}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/logos/phone.png" alt="휴대폰" height="20" />
              휴대폰 결제
            </button><br />

            <button onClick={() => selectPayment("NAVER")}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/logos/naverpay.png" alt="네이버페이" height="20" />
              네이버페이
            </button><br />

            <button onClick={() => selectPayment("PAYCO")}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/logos/payco.png" alt="페이코" height="20" />
              페이코
            </button><br />

            <button onClick={() => selectPayment("TOSS")}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src="/logos/toss.png" alt="토스페이" height="20" />
              토스페이
            </button>
          </div>
        </section>

        {/* ================= 결제 버튼 ================= */}
        <button className={styles.payButton} onClick={handlePay}>
          결제하기
        </button>

      </div>
    </div>
  );
};

export default Order;
