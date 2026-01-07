import React, { useMemo, useState } from "react";
import styles from "./OrderList.module.css";
import ReviewModal from "../ReviewModal"; // 경로 맞게 유지해줘 (너 코드 기준)

const STATUS_OPTIONS = [
  { value: "ALL", label: "전체 주문처리상태" },
  { value: "PAID", label: "결제완료" },
  { value: "READY", label: "배송준비중" },
  { value: "SHIPPING", label: "배송중" },
  { value: "DELIVERED", label: "배송완료" },
  { value: "CANCELLED", label: "취소완료" },
  { value: "RETURNED", label: "반품완료" },
];

const QUICK_RANGES = [
  { key: "7d", label: "1주일", days: 7 },
  { key: "1m", label: "1개월", days: 30 },
  { key: "3m", label: "3개월", days: 90 },
];

// ✅ 더미 주문 데이터 (나중에 API 응답으로 대체)
const DUMMY_ORDERS = [
  {
    orderId: "20240825-0009329",
    orderedAt: "2024-08-25",
    items: [
      {
        id: "item-1",
        imageUrl:
          "https://images.unsplash.com/photo-1520975958225-99f6cc2bbd9a?w=200&q=80",
        name: "하프넥 스티치 리본 맞주름 롱 원피스",
        optionText: "네이비(navy) / free",
        qty: 1,
        price: 40000,
        status: "DELIVERED",
        courier: "CJ대한통운",
        trackingNo: "593988682176",
        reviewWritten: false,
        deliveredAt: "2024-08-28",
      },
      {
        id: "item-2",
        imageUrl:
          "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=200&q=80",
        name: "[4천장 돌파✨] 1린카이 배색 세일러카라 집업 롱 원피스",
        optionText: "네이비(navy) / free",
        qty: 1,
        price: 49900,
        status: "DELIVERED",
        courier: "CJ대한통운",
        trackingNo: "593988682176",
        reviewWritten: true,
        deliveredAt: "2024-08-28",
      },
    ],
  },
  {
    orderId: "20251220-0012345",
    orderedAt: "2025-12-20",
    items: [
      {
        id: "item-3",
        imageUrl:
          "https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=200&q=80",
        name: "겨울 기모 후드 티셔츠",
        optionText: "오프화이트 / L",
        qty: 1,
        price: 29900,
        status: "SHIPPING",
        courier: "CJ대한통운",
        trackingNo: "123456789012",
        reviewWritten: false,
        deliveredAt: null,
      },
    ],
  },
];

function formatMoney(n) {
  return n.toLocaleString("ko-KR") + "원";
}

function toDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isWithinRange(dateStr, fromStr, toStr) {
  const date = toDate(dateStr);
  const from = toDate(fromStr);
  const to = toDate(toStr);
  const toEnd = new Date(to.getTime() + 24 * 60 * 60 * 1000 - 1);
  return date >= from && date <= toEnd;
}

export default function OrderList() {
  const [status, setStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState("2024-05-06");
  const [toDateStr, setToDateStr] = useState("2025-12-26");

  // ✅ 구매후기 모달 상태
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openReviewModal = (order, item) => {
    // 모달에서 주문/상품 정보를 보여주고, 제출 시 식별할 수 있게 합쳐서 넘김
    setSelectedItem({
      orderId: order.orderId,
      orderedAt: order.orderedAt,
      orderItemId: item.id,
      productName: item.name,
      optionText: item.optionText,
      imageUrl: item.imageUrl,
    });
    setReviewOpen(true);
  };

  const closeReviewModal = () => {
    setReviewOpen(false);
    setSelectedItem(null);
  };

  const handleSubmitReview = (reviewData) => {
    // ✅ 지금은 프론트 더미 처리 (나중에 axios로 API 호출로 바꾸면 됨)
    // reviewData: { orderId, orderItemId, rating, content, files }
    console.log("✅ 후기 등록 데이터:", reviewData);

    alert("후기 등록 완료! (임시)");
    closeReviewModal();
  };

  const filteredOrders = useMemo(() => {
    return DUMMY_ORDERS.map((order) => {
      const okRange = isWithinRange(order.orderedAt, fromDate, toDateStr);
      if (!okRange) return null;

      const items =
        status === "ALL"
          ? order.items
          : order.items.filter((it) => it.status === status);

      if (items.length === 0) return null;

      return { ...order, items };
    }).filter(Boolean);
  }, [status, fromDate, toDateStr]);

  const handleQuickRange = (days) => {
    const today = new Date();
    const to = today;
    const from = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

    const pad = (n) => String(n).padStart(2, "0");
    const fmt = (d) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    setFromDate(fmt(from));
    setToDateStr(fmt(to));
  };

  const openTracking = (courier, trackingNo) => {
    alert(`${courier}\n운송장: ${trackingNo}\n(여긴 나중에 링크로 연결)`);
  };

  const canCancel = (item) => item.status === "PAID" || item.status === "READY";
  const canReview = (item) =>
    item.status === "DELIVERED" && item.reviewWritten === false;

  const canReturn = (item) => {
    if (item.status !== "DELIVERED") return false;
    if (!item.deliveredAt) return false;
    const delivered = toDate(item.deliveredAt);
    const now = new Date();
    const diffDays = Math.floor((now - delivered) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>주문목록</h2>

      <div className={styles.filterBar}>
        <div className={styles.filterLeft}>
          <select
            className={styles.select}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className={styles.quickBtns}>
            {QUICK_RANGES.map((r) => (
              <button
                key={r.key}
                className={styles.quickBtn}
                type="button"
                onClick={() => handleQuickRange(r.days)}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className={styles.dateRange}>
            <input
              className={styles.dateInput}
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <span className={styles.tilde}>~</span>
            <input
              className={styles.dateInput}
              type="date"
              value={toDateStr}
              onChange={(e) => setToDateStr(e.target.value)}
            />
          </div>
        </div>
        <button className={styles.searchBtn} type="button">
          조회
        </button>
      </div>

      <ul className={styles.notice}>
        <li>기본적으로 최근 3개월간의 자료가 조회됩니다.</li>
        <li>주문번호를 클릭하면 해당 주문의 상세내역을 확인할 수 있습니다.</li>
        <li>취소/교환/반품 신청은 배송완료일 기준 7일까지 가능합니다.</li>
      </ul>

      <div className={styles.list}>
        <div className={styles.headerRow}>
          <div className={styles.colOrder}>주문일자 [주문번호]</div>
          <div className={styles.colImg}>이미지</div>
          <div className={styles.colInfo}>상품정보</div>
          <div className={styles.colQty}>수량</div>
          <div className={styles.colPrice}>상품구매금액</div>
          <div className={styles.colStatus}>주문처리상태</div>
          <div className={styles.colAction}>취소/교환/반품</div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className={styles.empty}>조회된 주문이 없습니다.</div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.orderId} className={styles.orderGroup}>
              <div className={styles.orderMeta}>
                <div className={styles.orderDate}>{order.orderedAt}</div>
                <button
                  type="button"
                  className={styles.orderIdLink}
                  onClick={() => alert(`주문상세로 이동: ${order.orderId}`)}
                >
                  [{order.orderId}]
                </button>
              </div>

              <div className={styles.orderItems}>
                {order.items.map((it) => (
                  <div key={it.id} className={styles.itemRow}>
                    <div className={styles.colImg}>
                      <img
                        className={styles.thumb}
                        src={it.imageUrl}
                        alt={it.name}
                      />
                    </div>

                    <div className={styles.colInfo}>
                      <div className={styles.itemName}>{it.name}</div>
                      <div className={styles.itemOption}>
                        [옵션: {it.optionText}]
                      </div>

                      <div className={styles.itemSubActions}>
                        <button
                          type="button"
                          className={styles.grayBtn}
                          onClick={() => alert("재구매: 장바구니 담기(나중에 연결)")}
                        >
                          재구매
                        </button>

                        {canReview(it) && (
                          <button
                            type="button"
                            className={styles.darkBtn}
                            onClick={() => openReviewModal(order, it)}
                          >
                            구매후기
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={styles.colQty}>{it.qty}</div>
                    <div className={styles.colPrice}>{formatMoney(it.price)}</div>

                    <div className={styles.colStatus}>
                      <div className={styles.statusText}>{statusLabel(it.status)}</div>
                      {it.courier && it.trackingNo && (
                        <button
                          type="button"
                          className={styles.trackingLink}
                          onClick={() => openTracking(it.courier, it.trackingNo)}
                        >
                          {it.courier} [{it.trackingNo}]
                        </button>
                      )}
                    </div>

                    <div className={styles.colAction}>
                      {canCancel(it) ? (
                        <button
                          type="button"
                          className={styles.grayBtn}
                          onClick={() => alert("주문취소(나중에 연결)")}
                        >
                          주문취소
                        </button>
                      ) : canReturn(it) ? (
                        <button
                          type="button"
                          className={styles.grayBtn}
                          onClick={() => alert("교환/반품 신청(나중에 연결)")}
                        >
                          교환/반품
                        </button>
                      ) : (
                        <span className={styles.dash}>-</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ 후기 모달 */}
      <ReviewModal
        open={reviewOpen}
        item={selectedItem}
        onClose={closeReviewModal}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}

function statusLabel(status) {
  switch (status) {
    case "PAID":
      return "결제완료";
    case "READY":
      return "배송준비중";
    case "SHIPPING":
      return "배송중";
    case "DELIVERED":
      return "배송완료";
    case "CANCELLED":
      return "취소완료";
    case "RETURNED":
      return "반품완료";
    default:
      return status;
  }
}
