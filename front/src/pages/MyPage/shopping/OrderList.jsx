import React, { useEffect, useState } from "react";
import styles from "./OrderList.module.css";
import ReviewModal from "../ReviewModal"; // 경로 유지
import { getOrders } from "../../../api/orderListApi";


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

function formatMoney(n) {
  return Number(n || 0).toLocaleString("ko-KR") + "원";
}

// YYYY-MM-DD 문자열을 Date로 파싱 (간단 버전)
function toDate(s) {
  const [y, m, d] = String(s).split("-").map(Number);
  return new Date(y, m - 1, d);
}

export default function OrderList() {
  const [status, setStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState("2024-05-06");
  const [toDateStr, setToDateStr] = useState("2025-12-26");

  // ✅ 서버에서 받은 주문 목록
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ 구매후기 모달 상태
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openReviewModal = (order, item) => {
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
    console.log("✅ 후기 등록 데이터:", reviewData);
    alert("후기 등록 완료! (임시)");
    closeReviewModal();
  };

  // ✅ 조회 버튼 눌렀을 때만 서버 호출
  const handleSearch = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const data = await getOrders();

      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg = e?.normalized?.message || "주문목록을 불러오지 못했어.";
      setErrorMsg(msg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> {
    handleSearch();
  }, []);

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

  // 교환/반품: 배송완료 + 7일 이내(프론트 표시용)
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

      {/* 상단 필터 */}
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

        <button
          className={styles.searchBtn}
          type="button"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "조회중..." : "조회"}
        </button>
      </div>

      {/* 에러 메시지 */}
      {errorMsg && <div className={styles.error}>{errorMsg}</div>}

      {/* 안내 문구 */}
      <ul className={styles.notice}>
        <li>기본적으로 최근 3개월간의 자료가 조회됩니다.</li>
        <li>주문번호를 클릭하면 해당 주문의 상세내역을 확인할 수 있습니다.</li>
        <li>취소/교환/반품 신청은 배송완료일 기준 7일까지 가능합니다.</li>
      </ul>

      {/* 주문 리스트 */}
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

        {orders.length === 0 ? (
          <div className={styles.empty}>조회된 주문이 없습니다.</div>
        ) : (
          orders.map((order) => (
            <div key={order.orderId} className={styles.orderGroup}>
              {/* 왼쪽 주문정보 */}
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

              {/* 오른쪽 상품들 */}
              <div className={styles.orderItems}>
                {(order.items || []).map((it) => (
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
                      <div className={styles.statusText}>
                        {statusLabel(it.status)}
                      </div>

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
