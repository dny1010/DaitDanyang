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

  const [errors, setErrors] = useState({});


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
        msg: "아이디를 먼저 입력해주세요.",
      });
      return;
    }

    // TODO: 나중에 백엔드 API 연결
    setIdCheck({
      done: true,
      ok: true,
      msg: "사용 가능한 아이디입니다.",
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

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert(Object.values(newErrors)[0]);
      return;
    }

    alert("회원가입 완료(임시)!");
    navigate("/login");
  };



  const validate = () => {
    const errors = {};

    // ✅ 필수 입력
    if (!form.userId.trim()) errors.userId = "아이디는 필수입니다.";
    if (!form.pw.trim()) errors.pw = "비밀번호는 필수입니다.";
    if (!form.pw2.trim()) errors.pw2 = "비밀번호 확인은 필수입니다.";
    if (!form.name.trim()) errors.name = "이름은 필수입니다.";
    if (!form.phone.trim()) errors.phone = "전화번호는 필수입니다.";
    if (!form.email.trim()) errors.email = "이메일은 필수입니다.";
    if (!form.address.trim()) errors.address = "주소는 필수입니다.";

    // ✅ 비밀번호 규칙
    if (form.pw && form.pw.length < 8) errors.pw = "비밀번호는 8자 이상이어야 합니다.";
    if (form.pw && !/[0-9]/.test(form.pw)) errors.pw = "비밀번호에 숫자를 1개 이상 포함해야 합니다.";
    if (form.pw && !/[A-Za-z]/.test(form.pw)) errors.pw = "비밀번호에 영문을 1개 이상 포함해야 합니다.";
    if (form.pw && form.pw2 && form.pw !== form.pw2) errors.pw2 = "비밀번호가 서로 다릅니다.";

    // ✅ 이메일 형식
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "이메일 형식이 올바르지 않습니다.";
    }

    // ✅ 전화번호 형식(숫자만 10~11자리)
    const phoneOnly = form.phone.replace(/\D/g, "");
    if (form.phone && (phoneOnly.length < 10 || phoneOnly.length > 11)) {
      errors.phone = "전화번호는 숫자만 10~11자 입력해주세요.";
    }

    return errors;
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
              <label>아이디 
                <span className={styles.required}>*</span>
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

              {idCheck.done && (
                <div
                  className={`${styles.helpText} ${idCheck.ok ? styles.ok : styles.bad
                    }`}
                >
                  {idCheck.msg}
                </div>
              )}
             </div>
            </div>


            <div className={styles.fieldRow}>
              <label>비밀번호 
                <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                name="pw"
                value={form.pw}
                onChange={onChange}
                placeholder="비밀번호"
              />
              {/* {errors.pw && <p className={styles.errorText}>{errors.pw}</p>}               */}
            </div>

            <div className={styles.fieldRow}>
              <label>비밀번호 확인 
                <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                name="pw2"
                value={form.pw2}
                onChange={onChange}
                placeholder="비밀번호 확인"
              />
              {/* {errors.pw2 && <p className={styles.errorText}>{errors.pw2}</p>} */}
            </div>

            <div className={styles.fieldRow}>
              <label>이름 
                <span className={styles.required}>*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="이름"
              />
            </div>

            <div className={styles.fieldRow}>
              <label>주소 
                <span className={styles.required}>*</span>
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
                  name="addressDetail"
                  value={form.addressDetail}
                  onChange={onChange}
                  placeholder="상세주소"
                  className={styles.mt8}
                />
              </div>
            </div>


            <div className={styles.fieldRow}>
              <label>전화번호 
                <span className={styles.required}>*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="010-0000-0000"
              />
            </div>

            <div className={styles.fieldRow}>
              <label>이메일 
                <span className={styles.required}>*</span>
              </label>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="email@example.com"
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
