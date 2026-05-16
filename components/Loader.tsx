"use client";

export default function Loader() {
  return (
    <div className="loaderWrap">
      <div className="loader" />

      <style jsx>{`
        .loaderWrap {
          display: flex;
          justify-content: center;
          padding: 60px;
        }

        .loader {
          width: 50px;
          height: 50px;
          border:
            5px solid #ddd;
          border-top:
            5px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}