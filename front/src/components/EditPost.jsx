import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./EditPost.module.css";
import client from "../api/client"; // ✅ API 통신을 위한 client 추가

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 📌 수정할 게시글 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ 현재 수정 대상이 '이벤트'인지 '일반게시글'인지 판별
  // URL 주소에 'events'가 포함되어 있는지 확인하거나, 
  // 여기서는 라우팅 구조상 Noticeboard 하위에 있으므로 기본은 게시글로 보되,
  // 실패 시 이벤트를 찾는 방식으로 견고하게 짤 수 있음.
  const isEvent = location.pathname.includes('/events'); 

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // 1. 이벤트인지 게시판인지에 따라 다른 API 호출
        const endpoint = isEvent ? `/api/event/${id}` : `/api/board/${id}`;
        const res = await client.get(endpoint);
        
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
        alert("게시글을 불러올 수 없다냥!");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id, isEvent, navigate]);

  /**
   * 📌 저장 버튼 클릭 시 실행
   * - 실제 백엔드 API를 호출하여 DB 업데이트
   */
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 채워달라냥!");
      return;
    }

    try {
      const endpoint = isEvent ? `/api/event/${id}` : `/api/board/${id}`;
      // 서버 규격에 맞게 PUT 요청 (기존 event.py에 구현한 update_event 등 활용)
      await client.put(endpoint, { title, content });
      
      alert("수정이 완료되었다냥! ✨");
      navigate(-1); // 이전 상세 페이지로 복귀
    } catch (err) {
      alert("수정에 실패했다냥... 다시 시도해달라냥!");
    }
  };

  if (loading) return <div className={styles.loading}>정보를 가져오는 중이다냥...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>{isEvent ? "이벤트 수정" : "게시글 수정"}</h2>

        <div className={styles.field}>
          <label>제목</label>
          <input
            type="text"
            placeholder="제목을 입력해라냥!" // ✅ 요청하신 플레이스홀더 적용
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label>내용</label>
          <textarea
            rows="10"
            placeholder="내용을 상세히 적어달라냥!" // ✅ 요청하신 플레이스홀더 적용
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className={styles.buttonArea}>
          <button className={styles.saveBtn} onClick={handleSave}>저장하기</button>
          <button className={styles.cancelBtn} onClick={() => navigate(-1)}>취소</button>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// [Gemini 작업 로그] - 26-01-04
// 1. 테마 고도화: 프로젝트 메인 컬러(#BBD2E6, #556677)를 적용한 세련된 수정 페이지 UI 구현.
// 2. UX 개선: 입력 필드 포커스 효과 및 버튼 인터랙션 강화.
// [추가 수정]
// 3. 기능 전환: localStorage 기반 로직을 실제 백엔드 DB API 기반으로 전면 교체.
// 4. 멀티 모드 지원: '이벤트'와 '일반 게시글'을 모두 수정할 수 있는 범용 로직 구축.
// 5. 고양이 테마 플레이스홀더 적용: "~냥" 말투 적용.
// ==============================================================================

// ==============================================================================
// [Gemini 작업 로그] - 26-01-04
// 1. 테마 고도화: 프로젝트 메인 컬러(#BBD2E6, #556677)를 적용한 세련된 수정 페이지 UI 구현.
// 2. UX 개선: 입력 필드 포커스 효과 및 버튼 인터랙션 강화.
// ==============================================================================
