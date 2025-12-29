import { useEffect, useMemo, useState } from "react";
import { getCart, setCart } from "../utils/cartStorage";
import styles from "./Cart.module.css";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [items, setItems] = useState([]);

  /* =======================
     테스트용 상품
  ======================= */
  const testProduct = {
    id: 1,
    name: "테스트 강아지 사료",
    price: 11700,
    image: "https://via.placeholder.com/90",
  };

  const addTestItem = () => {
    setItems((prev) => {
      const exists = prev.find((x) => x.id === testProduct.id);

      let next;
      if (exists) {
        next = prev.map((x) =>
          x.id === testProduct.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        next = [...prev, { ...testProduct, qty: 1, checked: true }];
      }

      setCart(next);
      return next;
    });
  };

  /* =======================
     초기 로딩
  ======================= */
  useEffect(() => {
    setItems(getCart());
  }, []);

  /* =======================
     장바구니 기능
  ======================= */
  const changeQty = (id, diff) => {
    setItems((prev) => {
      const next = prev.map((x) =>
        x.id === id ? { ...x, qty: Math.max(1, x.qty + diff) } : x
      );
      setCart(next);
      return next;
    });
  };

  const toggleCheck = (id) => {
    setItems((prev) => {
      const next = prev.map((x) =>
        x.id === id ? { ...x, checked: !x.checked } : x
      );
      setCart(next);
      return next;
    });
  };

  const removeItem = (id) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.id !== id);
      setCart(next);
      return next;
    });
  };

  /* =======================
     전체 선택
  ======================= */
  const allChecked = useMemo(
    () => items.length > 0 && items.every((x) => x.checked),
    [items]
  );

  const toggleAll = () => {
    setItems((prev) => {
      const next = prev.map((x) => ({ ...x, checked: !allChecked }));
      setCart(next);
      return next;
    });
  };

  /* =======================
     합계 계산
  ======================= */
  const summary = useMemo(() => {
    const selected = items.filter((x) => x.checked);
    const itemTotal = selected.reduce(
      (sum, x) => sum + x.price * x.qty,
      0
    );
    const shipping = selected.length === 0 ? 0 : 3000;

    return {
      itemTotal,
      shipping,
      payTotal: itemTotal + shipping,
    };
  }, [items]);

  /* =======================
     버튼 기능 3종
  ======================= */
  // 선택 삭제
  const removeSelected = () => {
    setItems((prev) => {
      const next = prev.filter((x) => !x.checked);
      setCart(next);
      return next;
    });
  };

  // 선택 구매 (임시)
  const buySelected = () => {
    const selected = items.filter((x) => x.checked);

    if (selected.length === 0) {
      alert("구매할 상품을 선택해줘!");
      return;
    }

    console.log("선택구매 상품:", selected);
    alert("선택 상품 결제 페이지로 이동(나중에 연결)");
  };

  // 전체 구매 (임시)
  const buyAll = () => {
    if (items.length === 0) {
      alert("장바구니가 비어있어!");
      return;
    }

    console.log("전체구매 상품:", items);
    alert("전체 상품 결제 페이지로 이동(나중에 연결)");
  };

  /* =======================
     JSX
  ======================= */
  return (
    <div className={styles.cartWrap}>
      <h2 className={styles.cartTitle}>CART</h2>

      {/* 테스트 버튼 */}
      <button onClick={addTestItem} className={styles.testBtn}>
        🧪 테스트 상품 장바구니 담기
      </button>

      <div className={styles.label}>일반상품</div>

      {/* 헤더 */}
      <div className={styles.cartHeader}>
        <div>
          <input type="checkbox" checked={allChecked} onChange={toggleAll} />
        </div>
        <div>이미지</div>
        <div>상품정보</div>
        <div>판매가</div>
        <div>수량</div>
        <div>배송구분</div>
        <div>합계</div>
      </div>

      {/* 아이템 */}
      {items.length === 0 ? (
        <div className={styles.empty}>장바구니가 비어있어요.</div>
      ) : (
        items.map((x) => (
          <div key={x.id} className={styles.cartRow}>
            <div>
              <input
                type="checkbox"
                checked={x.checked}
                onChange={() => toggleCheck(x.id)}
              />
            </div>

            <div>
              <img src={x.image} alt={x.name} className={styles.cartImg} />
            </div>

            <div>
              <div className={styles.cartName}>{x.name}</div>
              <button
                className={styles.deleteBtn}
                onClick={() => removeItem(x.id)}
              >
                삭제
              </button>
            </div>

            <div>{x.price.toLocaleString()}원</div>

            <div className={styles.qtyBox}>
              <button
                className={styles.qtyBtn}
                onClick={() => changeQty(x.id, -1)}
              >
                -
              </button>
              <div className={styles.qtyNum}>{x.qty}</div>
              <button
                className={styles.qtyBtn}
                onClick={() => changeQty(x.id, 1)}
              >
                +
              </button>
            </div>

            <div>기본배송</div>
            <div className={styles.sum}>
              {(x.price * x.qty).toLocaleString()}원
            </div>
          </div>
        ))
      )}

      {/* 합계 */}
      <div className={styles.cartSummary}>
        <div>총 상품금액: {summary.itemTotal.toLocaleString()}원</div>
        <div>총 배송비: {summary.shipping.toLocaleString()}원</div>
        <div>결제예정금액: {summary.payTotal.toLocaleString()}원</div>
      </div>

      {/* 하단 버튼 3개 */}
      <div className={styles.cartButtons}>
        <button className={styles.buyBtn} onClick={removeSelected}>
          선택삭제
        </button>
        <button className={styles.buyBtn} onClick={buySelected}>
          선택구매 
        </button>
        <button className={styles.buyBtn} onClick={buyAll}>
          전체구매
        </button>
      </div>
    </div>
  );
}
