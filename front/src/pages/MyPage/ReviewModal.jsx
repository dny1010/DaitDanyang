import { useEffect, useState } from "react";
import styles from "./ReviewModal.module.css";

export default function ReviewModal({ open, item, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  // ✅ 업로드한 파일/미리보기
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (open) {
      setRating(5);
      setContent("");
      setFiles([]);
      setPreviews([]);
    }
  }, [open]);

  // ✅ 미리보기 URL 생성/해제
  useEffect(() => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    const next = files.map((f) => URL.createObjectURL(f));
    setPreviews(next);

    return () => {
      next.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      orderId: item?.orderId,
      orderItemId: item?.orderItemId,
      rating,
      content,
      files, // ✅ 이미지 파일들
    });
  };

  const handleChangeFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    // ✅ 최대 5장 제한
    const merged = [...files, ...selected].slice(0, 5);
    setFiles(merged);

    // 같은 파일 다시 선택 가능하게 초기화
    e.target.value = "";
  };

  const removeFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const handleBackdropClick = () => onClose();
  const stop = (e) => e.stopPropagation();

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} onClick={stop}>
        <div className={styles.header}>
          <h3 className={styles.title}>구매후기 작성</h3>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className={styles.productBox}>
          <img className={styles.thumb} src={item?.imageUrl} alt={item?.productName} />
          <div>
            <div className={styles.productTitle}>{item?.productName}</div>
            <div className={styles.subText}>옵션: {item?.optionText}</div>
            <div className={styles.subText}>주문번호: {item?.orderId}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>별점</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className={styles.select}
          >
            <option value={5}>★★★★★ (5점)</option>
            <option value={4}>★★★★☆ (4점)</option>
            <option value={3}>★★★☆☆ (3점)</option>
            <option value={2}>★★☆☆☆ (2점)</option>
            <option value={1}>★☆☆☆☆ (1점)</option>
          </select>

          <label className={styles.label} style={{ marginTop: 12 }}>
            후기 내용
          </label>
          <textarea
            className={styles.textarea}
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="상품은 어땠나요? 솔직한 후기를 남겨주세요 :)"
          />

          {/* ✅ 사진 업로드 */}
          <div className={styles.uploadWrap}>
            <div className={styles.uploadTop}>
              <label className={styles.label} style={{ margin: 0 }}>
                사진 업로드 (최대 5장)
              </label>

              <label className={styles.uploadBtn}>
                + 사진 추가
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleChangeFiles}
                  className={styles.fileInput}
                />
              </label>
            </div>

            {previews.length > 0 && (
              <div className={styles.previewGrid}>
                {previews.map((src, idx) => (
                  <div key={src} className={styles.previewItem}>
                    <img src={src} alt={`preview-${idx}`} />
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeFile(idx)}
                      aria-label="remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>
              취소
            </button>
            <button type="submit" className={styles.submit}>
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
