import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./Affiliated.module.css";

const Affiliated = () => {
  const [formData, setFormData] = useState({
    consultationType: "가맹상담",
    name: "",
    phoneCarrier: "SKT",
    phoneNumber: "",
    desiredLocation: "서울",
    inquiryContent: "",
    agreement: "동의함",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // 숫자만 입력 가능하도록
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length <= 11) {
        setFormData((prevState) => ({
          ...prevState,
          [name]: onlyNums,
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사 강화
    if (
      !formData.name ||
      !formData.phoneNumber ||
      !formData.desiredLocation ||
      !formData.inquiryContent ||
      formData.agreement === "동의안함"
    ) {
      alert("모든 필수 항목을 입력하고 이용약관에 동의해주세요.");
      return;
    }

    // 전화번호 형식 검사 (10자리 또는 11자리)
    if (!/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      alert("올바른 전화번호 형식이 아닙니다.");
      return;
    }

    try {
      // 전화번호 형식 변환 (하이픈 추가)
      const formattedPhone = formData.phoneNumber.replace(
        /(\d{3})(\d{3,4})(\d{4})/,
        "$1-$2-$3"
      );

      const requestData = {
        category: formData.consultationType,
        name: formData.name,
        phone: formattedPhone, // 형식이 변환된 전화번호
        location: formData.desiredLocation,
        content: formData.inquiryContent,
      };

      const response = await axios.post(
        "http://spring.mirae.network:8080/api/affiliated",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("가맹 문의가 성공적으로 접수되었습니다.");

        setFormData({
          consultationType: "가맹상담",
          name: "",
          phoneCarrier: "SKT",
          phoneNumber: "",
          desiredLocation: "",
          inquiryContent: "",
          agreement: "동의함",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          error.response.data.message ||
            "문의 접수 중 오류가 발생했습니다. 다시 시도해주세요."
        );
      } else {
        alert("문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <div className={style.menu_title}>
          <span className={style.underline}>AFFILIATED</span>
        </div>
        <p className={style.menu_content}>
          코키티 가맹 문의는 '1:1 맞춤' 상담으로 진행됩니다. <br />
          가맹 상담부터 오픈, 사후관리까지 토탈 서비스를 지원합니다.
        </p>

        <div className={style.FormContainer}>
          <h2 className={style.FormTitle}>기본정보</h2>

          <form className={style.Form} onSubmit={handleSubmit}>
            <div className={style.FormGroup}>
              <label>상담내용</label>
              <div className={style.RadioGroup}>
                <label className={style.RadioItem}>
                  <input
                    type="radio"
                    name="consultationType"
                    value="가맹상담"
                    checked={formData.consultationType === "가맹상담"}
                    onChange={handleInputChange}
                  />
                  가맹상담
                </label>
                <label className={style.RadioItem}>
                  <input
                    type="radio"
                    name="consultationType"
                    value="입점제안"
                    checked={formData.consultationType === "입점제안"}
                    onChange={handleInputChange}
                  />
                  입점제안
                </label>
                <label className={style.RadioItem}>
                  <input
                    type="radio"
                    name="consultationType"
                    value="기타문의"
                    checked={formData.consultationType === "기타문의"}
                    onChange={handleInputChange}
                  />
                  기타문의
                </label>
              </div>
            </div>

            <div className={style.FormGroup}>
              <label>이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="이름을 입력해주세요."
              />
            </div>

            <div className={style.FormGroup}>
              <label>연락처</label>
              <div className={style.PhoneInputGroup}>
                <select
                  className={style.PhonePrefix}
                  name="phoneCarrier"
                  value={formData.phoneCarrier}
                  onChange={handleInputChange}
                >
                  <option value="SKT">SKT</option>
                  <option value="KT">KT</option>
                  <option value="LG">LG</option>
                </select>
                <span className={style.PhoneSeparator}></span>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  maxLength="11"
                  className={style.PhoneInput}
                  placeholder="하이픈(-) 없이 입력해주세요."
                />
              </div>
            </div>

            <div className={style.FormGroup}>
              <label>희망 지역</label>
              <select
                value={formData.desiredLocation}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    desiredLocation: e.target.value,
                  }))
                }
                className={style.select_input}
              >
                <option value="서울">서울특별시</option>
                <option value="부산">부산광역시</option>
                <option value="대구">대구광역시</option>
                <option value="인천">인천광역시</option>
                <option value="광주">광주광역시</option>
                <option value="대전">대전광역시</option>
                <option value="울산">울산광역시</option>
                <option value="세종">세종특별자치시</option>
                <option value="경기">경기도</option>
                <option value="강원">강원도</option>
                <option value="충북">충청북도</option>
                <option value="충남">충청남도</option>
                <option value="전북">전라북도</option>
                <option value="전남">전라남도</option>
                <option value="경북">경상북도</option>
                <option value="경남">경상남도</option>
                <option value="제주">제주특별자치도</option>
              </select>
            </div>

            <div className={style.FormGroup}>
              <label>문의 내용</label>
              <textarea
                name="inquiryContent"
                value={formData.inquiryContent}
                onChange={handleInputChange}
                placeholder="문의 내용을 입력해주세요."
                rows="6"
              ></textarea>
            </div>

            <div className={style.FormFooter}>
              <div className={style.CheckboxGroup}>
                <label>
                  <span style={{ color: "#ba274a" }}>[필수]</span> 이용약관에
                  동의합니다.
                </label>
              </div>
              <div className={style.ButtonGroup}>
                <div className={style.RadioGroup}>
                  <div className={style.RadioItem}>
                    <input
                      type="radio"
                      id="agree"
                      name="agreement"
                      value="동의함"
                      checked={formData.agreement === "동의함"}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="agree">동의함</label>
                  </div>
                  <div className={style.RadioItem}>
                    <input
                      type="radio"
                      id="disagree"
                      name="agreement"
                      value="동의안함"
                      checked={formData.agreement === "동의안함"}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="disagree">동의안함</label>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.TermsContainer}>
              <div className={style.TermsContent}>
                제1조 (목적) 이 약관은 KOKEE TEA(이하 "회사"라 함)가 제공하는
                서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및
                책임사항 등을 규정함을 목적으로 합니다.
                <br />
                제2조 (약관의 효력과 변경) 1. 이 약관은 서비스를 통하여 이를
                공지하거나 전자메일 등의 방법으로 회원에게 통지함으로써 효력이
                발생합니다. 2. 회사는 필요한 경우 이 약관을 변경할 수 있으며,
                변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써
                효력이 발생합니다.
              </div>
            </div>

            <button type="submit" className={style.SubmitButton}>
              접수하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Affiliated;
