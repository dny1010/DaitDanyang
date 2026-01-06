import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PostForm.module.css";

import { createPost, fetchMe } from "../api/postApi";

export default function PostForm() {
  const navigate = useNavigate();

  // 저장 위치(게시판)
  const [boardType, setBoardType] = useState("NOTICE"); // NOTICE | QNA | PARTNER | FREE 등

  const [title, setTitle] = useState("");

  // 작성자 / 이메일 (기본은 프로필에서 채움)
  const [writer, setWriter] = useState("");
  const [writerLocked, setWriterLocked] = useState(true);

  const [emailId, setEmailId] = useState("");
  const [emailDomainSelect, setEmailDomainSelect] = useState(""); // select 값
  const [emailDomainCustom, setEmailDomainCustom] = useState(""); // 직접입력 값
  const [emailLocked, setEmailLocked] = useState(true);

  const emailDomain = useMemo(() => {
    return emailDomainSelect === "custom" ? emailDomainCustom : emailDomainSelect;
  }, [emailDomainSelect, emailDomainCustom]);

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

        // writer 프리필
        if (me?.nickname) setWriter(me.nickname);

        // email 프리필 (있으면 분리해 넣기)
        if (me?.email && me.email.includes("@")) {
          const [id, domain] = me.email.split("@");
          setEmailId(id);

          // 목록에 있으면 select로, 아니면 custom로
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
        // 토큰 만료/불일치 가능
        alert("로그인 정보 확인에 실패했습니다. 다시 로그인 해주세요.");
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    })();
  }, [navigate]);

  // 기본 템플릿 (boardType이 PARTNER일 때만 자동 세팅 같은 것도 가능)
  useEffect(() => {
    if (boardType === "PARTNER") {
      setContent(
`안녕하세요 입점관련 문의남겨주시면 확인 후에 연락드리도록 하겠습니다.
관련 자료(상세페이지 등) 파일 첨부 부탁드립니다.
감사합니다.

1) 업체명 :
2) 담당자 :
3) 연락처 :
4) 이메일 :
5) 상품군 및 상품설명 :
6) 제조원 :
7) 판매원 :
8) 수입원 :
9) 판매처링크 : 온라인 판매처 기입 생략 및 관련 자료 첨부`
      );
    } else {
      setContent("");
    }
  }, [boardType]);

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
      formData.append("writer", writer); // 보통은 백에서 토큰으로 결정하지만, 일단 전송
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
      <div className={styles.notice}>
        게시글 작성 페이지입니다.
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* 저장 위치 */}
        <div className={styles.row}>
          <label>저장 위치</label>
          <select value={boardType} onChange={(e) => setBoardType(e.target.value)}>
            <option value="NOTICE">공지</option>
            <option value="QNA">Q&A</option>
            <option value="PARTNER">입점문의</option>
            <option value="FREE">자유</option>
          </select>
        </div>

        <div className={styles.row}>
          <label>제목</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        {/* 작성자: 기본 잠금 + 수정 토글 */}
        <div className={styles.row}>
          <label>작성자</label>
          <div className={styles.inline}>
            <input
              value={writer}
              onChange={(e) => setWriter(e.target.value)}
              required
              disabled={writerLocked}
            />
            <button type="button" onClick={() => setWriterLocked((v) => !v)}>
              {writerLocked ? "수정" : "잠금"}
            </button>
          </div>
        </div>

        {/* 이메일: 선택 + 직접입력 + 잠금 토글 */}
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

              <button type="button" onClick={() => setEmailLocked((v) => !v)}>
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
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>

        <div className={styles.row}>
          <label>파일 첨부</label>
          <input type="file" onChange={(e) => setAttachment(e.target.files?.[0] ?? null)} />
        </div>

        <div className={styles.actions}>
          <button type="submit">등록하기</button>
          <button type="button" onClick={() => navigate(-1)}>취소</button>
        </div>
      </form>
    </div>
  );
}
