import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userId: "",
    pw: "",
    pw2: "",
    name: "",
    address: "",
    addressDetail: "",
    phone: "",
    email: "",
    social: "",

    petType: "",   // 선택사항(예: 강아지/고양이)
    gender: "",    // 선택사항
    birth: "",     // 선택사항
  });

  const [idCheck, setIdCheck] = useState({
    done: false,
    ok: false,
    msg: "",
  });

  const handleCheckId = async () => {
    if (!form.userId.trim()) {
      setIdCheck({
        done: true,
        ok: false,
        msg: "아이디를 먼저 입력해줘!",
      });
      return;
    }

    // TODO: 나중에 백엔드 API 연결
    setIdCheck({
      done: true,
      ok: true,
      msg: "사용 가능한 아이디야! (임시)",
    });
  };

  const handleAddressSearch = () => {
    // TODO: 다음/카카오 주소검색 API 붙일 자리
    // 지금은 UI 확인용 임시 처리
    setForm((prev) => ({ ...prev, address: "경기도 수원시 (임시 주소)" }));
  };


  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!form.userId || !form.pw || !form.pw2) {
      alert("아이디/비밀번호를 입력해줘!");
      return;
    }
    if (form.pw !== form.pw2) {
      alert("비밀번호 확인이 달라!");
      return;
    }

    // TODO: 회원가입 API 연결
    alert("회원가입 완료(임시)!");
    navigate("/login");
  };

  return (
    <div className={styles.signupWrap}>
      <div className={styles.signupCard}>
        
        <div
          className={styles.signupHeader}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/daitdanyang-logo.png` }
            alt="DaitDanyang"
            className={styles.brandImage}
          />
        </div>

        <form onSubmit={onSubmit}>
          {/* 기본정보 */}
          <div className={styles.section}>
            <div className={styles.signup_sectionLabel}>기본정보</div>

            <div className={styles.fieldRow}>
              <label>아이디 :</label>

              <div className={styles.inlineRow}>
                <input
                  name="userId"
                  value={form.userId}
                  onChange={(e) => {
                    onChange(e);
                    setIdCheck({ done: false, ok: false, msg: "" });
                  }}
                  placeholder="아이디"
                />

                <button
                  type="button"
                  className={styles.btnInline}
                  onClick={handleCheckId}
                >
                  중복확인
                </button>
              </div>

              {idCheck.done && (
                <div
                  className={`${styles.helpText} ${idCheck.ok ? styles.ok : styles.bad
                    }`}
                >
                  {idCheck.msg}
                </div>
              )}

            </div>


            <div className={styles.fieldRow}>
              <label>비밀번호 :</label>
              <input
                type="password"
                name="pw"
                value={form.pw}
                onChange={onChange}
                placeholder="비밀번호"
              />
            </div>

            <div className={styles.fieldRow}>
              <label>비밀번호 확인 :</label>
              <input
                type="password"
                name="pw2"
                value={form.pw2}
                onChange={onChange}
                placeholder="비밀번호 확인"
              />
            </div>

            <div className={styles.fieldRow}>
              <label>이름 :</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="이름"
              />
            </div>

            <div className={styles.fieldRow}>
              <label>주소 :</label>

              <div className={styles.addressBlock}>
                <div className={styles.inlineRow}>
                  <input
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    placeholder="주소"
                    readOnly
                  />
                  <button
                    type="button"
                    className={styles.btnInline}
                    onClick={handleAddressSearch}
                  >
                    주소검색
                  </button>
                </div>

                <input
                  name="addressDetail"
                  value={form.addressDetail}
                  onChange={onChange}
                  placeholder="상세주소"
                  className={styles.mt8}
                />
              </div>
            </div>


            <div className={styles.fieldRow}>
              <label>전화번호 :</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="010-0000-0000"
              />
            </div>

            <div className={styles.fieldRow}>
              <label>이메일 :</label>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="email@example.com"
              />
            </div>

            <div className={styles.fieldRow}>
              <label>소셜연결 :</label>
              <input
                name="social"
                value={form.social}
                onChange={onChange}
                placeholder="카카오/네이버 등(선택)"
              />
            </div>
          </div>

          <hr className={styles.divider} />

          {/* 선택사항 */}
          <div className={styles.section}>
            <div className={styles.signup_sectionLabel}>선택사항</div>

            <div className={styles.fieldRow}>
              <label>종류 :</label>
              <select name="petType" value={form.petType} onChange={onChange}>
                <option value="">선택</option>
                <option value="dog">강아지</option>
                <option value="cat">고양이</option>
                <option value="etc">기타</option>
              </select>
            </div>

            <div className={styles.fieldRow}>
              <label>성별 :</label>
              <select name="gender" value={form.gender} onChange={onChange}>
                <option value="">선택</option>
                <option value="female">여</option>
                <option value="male">남</option>
                <option value="none">선택안함</option>
              </select>
            </div>

            <div className={styles.fieldRow}>
              <label>생일 :</label>
              <input
                type="date"
                name="birth"
                value={form.birth}
                onChange={onChange}
              />
            </div>
          </div>

          <div className={styles.submitRow}>
            <button className={styles.btnSignup} type="submit">
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
