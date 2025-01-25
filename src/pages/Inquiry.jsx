import React, { useState, useEffect } from "react";
import style from "./Inquiry.module.css";

const Inquiry = () => {
  // 페이지 들어왔들 때 제일 위로 이동하게 하는 코드
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    type: "문의",
    name: "",
    phone: "",
    emailId: "",
    emailDomain: "",
    title: "",
    content: "",
  });

  const emailDomains = [
    { value: "", label: "직접입력" },
    { value: "naver.com", label: "naver.com" },
    { value: "gmail.com", label: "gmail.com" },
    { value: "daum.net", label: "daum.net" },
    { value: "hanmail.net", label: "hanmail.net" },
  ];

  useEffect(() => {
    localStorage.setItem("inquiryFormData", JSON.stringify(formData));
  }, [formData]);

  const handleEmailDomainChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      emailDomain: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullEmail =
      formData.emailId && formData.emailDomain
        ? `${formData.emailId}@${formData.emailDomain}`
        : "";

    const submitData = {
      ...formData,
      email: fullEmail,
    };

    try {
      const response = await fetch('http://localhost:8080/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        throw new Error('문의 등록에 실패했습니다.');
      }

      alert('문의가 성공적으로 등록되었습니다.');
      
      const clearForm = {
        type: "문의",
        name: "",
        phone: "",
        emailId: "",
        emailDomain: "",
        title: "",
        content: "",
      };
      setFormData(clearForm);
    } catch (error) {
      console.error('Error:', error);
      alert('문의 등록 중 오류가 발생했습니다.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <div className={style.menu_title}>
          <span className={style.underline}>1:1 문의하기</span>
        </div>
        <p className={style.menu_content}>
          코키티는 접수해 주신 의견에 대해
          <br />
          신속하게 처리할 수 있도록 최선을 다하겠습니다.
        </p>

        <div className={style.FormContainer}>
          <p className={style.FormContainer_content}>
            ※ 정상업무시간 09:00 ~ 18:00(주말, 공휴일, 국경일 휴무)
          </p>
          <form className={style.Form} onSubmit={handleSubmit}>
            <div className={style.FormGroup}>
              <label>접수 구분</label>
              <div className={style.RadioGroup}>
                {["문의", "칭찬", "불만"].map((type) => (
                  <label key={type} className={style.RadioItem}>
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={handleChange}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {["name"].map((field) => (
              <div key={field} className={style.FormGroup}>
                <label>이름</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder="이름을 입력해주세요."
                />
              </div>
            ))}

            <div className={style.FormGroup}>
              <label>연락처</label>
              <div className={style.PhoneInputGroup}>
                <select className={style.PhonePrefix}>
                  <option value="SKT">SKT</option>
                  <option value="KT">KT</option>
                  <option value="LG">LG</option>
                </select>
                <span className={style.PhoneSeparator}></span>
                <input
                  type="text"
                  maxLength="11"
                  className={style.PhoneInput}
                  onChange={(e) =>
                    (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>
            </div>

            {["title"].map((field) => (
              <div key={field} className={style.FormGroup}>
                <label>제목</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder="제목을 입력해주세요."
                />
              </div>
            ))}

            <div className={style.FormGroup}>
              <label>이메일</label>
              <div className={style.EmailGroup}>
                <input
                  type="text"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  placeholder="이메일"
                />
                <span className={style.EmailAt}>@</span>
                <input
                  type="text"
                  name="emailDomain"
                  value={formData.emailDomain}
                  onChange={handleChange}
                />
                <select
                  value={formData.emailDomain}
                  onChange={handleEmailDomainChange}
                  className={style.EmailSelect}
                >
                  {emailDomains.map((domain) => (
                    <option key={domain.value} value={domain.value}>
                      {domain.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={style.FormGroup}>
              <label>문의 내용</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                placeholder="문의 내용을 입력해주세요."
              />
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

export default Inquiry;
