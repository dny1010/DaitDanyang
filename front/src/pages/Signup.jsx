import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { register, checkUserId } from "../api/authApi";

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
    petType: "",
    gender: "",
    birth: "",
  });

  const [errors, setErrors] = useState({});

  const [idCheck, setIdCheck] = useState({
    done: false,
    ok: false,
    msg: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 아이디 중복확인
  const handleCheckId = async () => {
    if (!form.userId.trim()) {
      setIdCheck({ done: true, ok: false, msg: "아이디를 먼저 입력해주세요." });
      return;
    }

    try {
      const data = await checkUserId(form.userId); // { ok, msg }
      setIdCheck({ done: true, ok: data.ok, msg: data.msg });
    } catch (err) {
      setIdCheck({
        done: true,
        ok: false,
        msg: err.response?.data?.msg || "중복확인 실패",
      });
    }
  };

  const handleAddressSearch = () => {
    setForm((prev) => ({ ...prev, address: "경기도 수원시 (임시 주소)" }));
  };

  // ✅ 회원가입 제출
  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert(Object.values(newErrors)[0]);
      return;
    }

    if (!idCheck.done || !idCheck.ok) {
      alert("아이디 중복확인을 완료해주세요.");
      return;
    }

    try {
      await register({
        userId: form.userId.trim(),
        password: form.pw, // ⚠️ 백엔드 키 이름과 맞추기
        name: form.name.trim(),
        address: form.address.trim(),
        addressDetail: form.addressDetail.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        social: form.social,
        petType: form.petType,
        gender: form.gender,
        birth: form.birth,
      });

      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "회원가입 실패(서버 오류)");
    }
  };

  const validate = () => {
    const errors = {};

    if (!form.userId.trim()) errors.userId = "아이디는 필수입니다.";
    if (!form.pw.trim()) errors.pw = "비밀번호는 필수입니다.";
    if (!form.pw2.trim()) errors.pw2 = "비밀번호 확인은 필수입니다.";
    if (!form.name.trim()) errors.name = "이름은 필수입니다.";
    if (!form.phone.trim()) errors.phone = "전화번호는 필수입니다.";
    if (!form.email.trim()) errors.email = "이메일은 필수입니다.";
    if (!form.address.trim()) errors.address = "주소는 필수입니다.";

    // 비밀번호 조건(현재 방식 유지: 마지막 조건이 덮어쓸 수 있음)
    if (form.pw && form.pw.length < 8) errors.pw = "비밀번호는 8자 이상이어야 합니다.";
    if (form.pw && !/[0-9]/.test(form.pw)) errors.pw = "비밀번호에 숫자를 1개 이상 포함해야 합니다.";
    if (form.pw && !/[A-Za-z]/.test(form.pw)) errors.pw = "비밀번호에 영문을 1개 이상 포함해야 합니다.";
    if (form.pw && form.pw2 && form.pw !== form.pw2) errors.pw2 = "비밀번호가 서로 다릅니다.";

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "이메일 형식이 올바르지 않습니다.";
    }

    const phoneOnly = form.phone.replace(/\D/g, "");
    if (form.phone && (phoneOnly.length < 10 || phoneOnly.length > 11)) {
      errors.phone = "전화번호는 숫자만 10~11자 입력해주세요.";
    }

    return errors;
  };

  return (
    <div className={styles.signupWrap}>
      <div className={styles.signupCard}>
        {/* 상단 로고 영역(원하면 이미지 src만 맞춰서 사용) */}
        <div className={styles.signupHeader}>
          {/* 이미지 없으면 이 블록 삭제해도 됨 */}
          {/* <img className={styles.brandImage} src="/images/daitdanyang-logo.png" alt="logo" /> */}
          <h2>회원가입</h2>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.section}>
            <div className={styles.signup_sectionLabel}>기본 정보</div>

            {/* 아이디 */}
            <div className={styles.fieldRow}>
              <label>
                아이디 <span className={styles.required}>*</span>
              </label>

              <div className={styles.idArea}>
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

                {/* 중복확인 메시지 */}
                {idCheck.done && (
                  <p
                    className={`${styles.helpText} ${
                      idCheck.ok ? styles.ok : styles.bad
                    }`}
                  >
                    {idCheck.msg}
                  </p>
                )}
              </div>
            </div>

            {/* 비밀번호 */}
            <div className={styles.fieldRow}>
              <label>
                비밀번호 <span className={styles.required}>*</span>
              </label>
              <div>
                <input
                  type="password"
                  name="pw"
                  value={form.pw}
                  onChange={onChange}
                  placeholder="비밀번호 (8자 이상, 영문+숫자 포함)"
                />
                {errors.pw && <p className={`${styles.helpText} ${styles.bad}`}>{errors.pw}</p>}
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div className={styles.fieldRow}>
              <label>
                비밀번호 확인 <span className={styles.required}>*</span>
              </label>
              <div>
                <input
                  type="password"
                  name="pw2"
                  value={form.pw2}
                  onChange={onChange}
                  placeholder="비밀번호 확인"
                />
                {errors.pw2 && <p className={`${styles.helpText} ${styles.bad}`}>{errors.pw2}</p>}
              </div>
            </div>

            {/* 이름 */}
            <div className={styles.fieldRow}>
              <label>
                이름 <span className={styles.required}>*</span>
              </label>
              <div>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="이름"
                />
                {errors.name && <p className={`${styles.helpText} ${styles.bad}`}>{errors.name}</p>}
              </div>
            </div>

            {/* 전화번호 */}
            <div className={styles.fieldRow}>
              <label>
                전화번호 <span className={styles.required}>*</span>
              </label>
              <div>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="숫자만 입력 (예: 01012345678)"
                />
                {errors.phone && <p className={`${styles.helpText} ${styles.bad}`}>{errors.phone}</p>}
              </div>
            </div>

            {/* 이메일 */}
            <div className={styles.fieldRow}>
              <label>
                이메일 <span className={styles.required}>*</span>
              </label>
              <div>
                <input
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="example@email.com"
                />
                {errors.email && <p className={`${styles.helpText} ${styles.bad}`}>{errors.email}</p>}
              </div>
            </div>

            {/* 주소 */}
            <div className={styles.fieldRow}>
              <label>
                주소 <span className={styles.required}>*</span>
              </label>

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
                  className={styles.mt8}
                  name="addressDetail"
                  value={form.addressDetail}
                  onChange={onChange}
                  placeholder="상세주소"
                />

                {errors.address && (
                  <p className={`${styles.helpText} ${styles.bad}`}>{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.section}>
            <div className={styles.signup_sectionLabel}>추가 정보</div>

            {/* social */}
            <div className={styles.fieldRow}>
              <label>소셜</label>
              <div>
                <select name="social" value={form.social} onChange={onChange}>
                  <option value="">선택안함</option>
                  <option value="kakao">카카오</option>
                  <option value="naver">네이버</option>
                  <option value="google">구글</option>
                </select>
              </div>
            </div>

            {/* petType */}
            <div className={styles.fieldRow}>
              <label>반려동물</label>
              <div>
                <select name="petType" value={form.petType} onChange={onChange}>
                  <option value="">선택</option>
                  <option value="dog">강아지</option>
                  <option value="cat">고양이</option>
                </select>
              </div>
            </div>

            {/* gender */}
            <div className={styles.fieldRow}>
              <label>성별</label>
              <div>
                <select name="gender" value={form.gender} onChange={onChange}>
                  <option value="">선택</option>
                  <option value="M">남</option>
                  <option value="F">여</option>
                  <option value="N">비공개</option>
                </select>
              </div>
            </div>

            {/* birth */}
            <div className={styles.fieldRow}>
              <label>생년월일</label>
              <div>
                <input
                  type="date"
                  name="birth"
                  value={form.birth}
                  onChange={onChange}
                />
              </div>
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
