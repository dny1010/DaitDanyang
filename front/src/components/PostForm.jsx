import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PostForm.module.css";

import { createPost } from "../api/postApi";
import { fetchMe } from "../api/authApi";

export default function PostForm() {
  const navigate = useNavigate();

  // 저장 위치(게시판)
  const [boardType, setBoardType] = useState("NOTICE"); // NOTICE | QNA | FREE

  const [title, setTitle] = useState("");

  // 작성자
  const [writer, setWriter] = useState("");
  const [writerLocked, setWriterLocked] = useState(true);

  // 이메일 분리
  const [emailId, setEmailId] = useState("");
  const [emailDomainSelect, setEmailDomainSelect] = useState("");
  const [emailDomainCustom, setEmailDomainCustom] = useState("");
  const [emailLocked, setEmailLocked] = useState(true);

  // 👉 실제 사용할 도메인 결정
  const emailDomain = useMemo(() => {
    return emailDomainSelect === "custom"
      ? emailDomainCustom
      : emailDomainSelect;
  }, [emailDomainSelect, emailDomainCustom]);

  // 👉 최종 email
  const email = useMemo(() => {
    if (!emailId || !emailDomain) return "";
    return `${emailId}@${emailDomain}`;
  }, [emailId, emailDomain]);

  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState(null);

  // ✅ 로그인 체크 + 내 정보 불러오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const me = await fetchMe(); // { nickname, email } 가정

        if (me?.nickname) setWriter(me.nickname);

        if (me?.email && me.email.includes("@")) {
          const [id, domain] = me.email.split("@");
          setEmailId(id);

          const known = ["gmail.com", "naver.com", "daum.net", "hanmail.net"];
          if (known.includes(domain)) {
            setEmailDomainSelect(domain);
            setEmailDomainCustom("");
          } else {
            setEmailDomainSelect("custom");
            setEmailDomainCustom(domain);
          }
        }
      } catch (err) {
        alert("로그인 정보 확인에 실패했습니다. 다시 로그인 해주세요.");
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    })();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("boardType", boardType);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("writer", writer);
      formData.append("email", email);

      if (attachment) formData.append("attachment", attachment);

      await createPost(formData);

      alert("게시글이 등록되었습니다.");
      navigate("/Noticeboard");
    } catch (err) {
      alert("등록에 실패했습니다.");
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.notice}>게시글 작성 페이지입니다.</div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* 저장 위치 */}
        <div className={styles.row}>
          <label>저장 위치</label>
          <select
            value={boardType}
            onChange={(e) => setBoardType(e.target.value)}
          >
            <option value="NOTICE">공지</option>
            <option value="QNA">Q&A</option>
            <option value="FREE">자유</option>
          </select>
        </div>

        <div className={styles.row}>
          <label>제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 작성자 */}
        <div className={styles.row}>
          <label>작성자</label>
          <div className={styles.inline}>
            <input
              value={writer}
              onChange={(e) => setWriter(e.target.value)}
              required
              disabled={writerLocked}
            />
            <button
              type="button"
              onClick={() => setWriterLocked((v) => !v)}
            >
              {writerLocked ? "수정" : "잠금"}
            </button>
          </div>
        </div>

        {/* 이메일 */}
        <div className={styles.row}>
          <label>이메일</label>
          <div className={styles.inlineCol}>
            <div className={styles.emailLine}>
              <input
                placeholder="아이디"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                required
                disabled={emailLocked}
              />
              <span>@</span>

              <select
                value={emailDomainSelect}
                onChange={(e) => setEmailDomainSelect(e.target.value)}
                required
                disabled={emailLocked}
              >
                <option value="">- 이메일 선택 -</option>
                <option value="gmail.com">gmail.com</option>
                <option value="naver.com">naver.com</option>
                <option value="daum.net">daum.net</option>
                <option value="hanmail.net">hanmail.net</option>
                <option value="custom">직접입력</option>
              </select>

              <button
                type="button"
                onClick={() => setEmailLocked((v) => !v)}
              >
                {emailLocked ? "수정" : "잠금"}
              </button>
            </div>

            {emailDomainSelect === "custom" && (
              <input
                placeholder="도메인 직접 입력 (예: company.co.kr)"
                value={emailDomainCustom}
                onChange={(e) => setEmailDomainCustom(e.target.value)}
                required
                disabled={emailLocked}
              />
            )}
          </div>
        </div>

        <div className={styles.editor}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className={styles.row}>
          <label>파일 첨부</label>
          <input
            type="file"
            onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className={styles.actions}>
          <button type="submit">등록하기</button>
          <button type="button" onClick={() => navigate(-1)}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
