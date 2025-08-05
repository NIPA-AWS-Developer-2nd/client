import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URL 파라미터 제거하고 메인 페이지로 리다이렉트
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 500); // 0.5초 후 리다이렉트

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

