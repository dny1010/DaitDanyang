import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination, Spinner, Alert } from "react-bootstrap";

import styles from "./Noticeboard.module.css";
import { fetchBoard } from "../api/boardApi";

const ITEMS_PER_PAGE = 10;

export default function Noticeboard() {
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);

  // ✅ 백에서 받는 값들
  const [totalPages, setTotalPages] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    async function load() {
      setLoading(true);
      setError("");

      try {
        const res = await fetchBoard(page, ITEMS_PER_PAGE);
        if (!alive) return;

        console.log("board res.data =", res.data);

        const items = res.data?.items;
        setList(Array.isArray(items) ? items : []);

        const tp = Number(res.data?.total_pages) || 1;
        setTotalPages(tp);

        // 백이 주면 그대로 쓰고, 없으면 기본값으로라도 세팅
        setStartPage(Number(res.data?.start_page) || 1);
        setEndPage(Number(res.data?.end_page) || tp);

        // page가 범위 넘어가면 보정
        if (page > tp) setPage(1);
      } catch (err) {
        if (!alive) return;

        console.log("board error:", err);
        console.log("status:", err.response?.status);
        console.log("data:", err.response?.data);

        if (err.response?.status === 401) {
          alert("로그인이 만료되었습니다.");
          navigate("/login");
        } else {
          setError("게시판 데이터를 불러오는 중 오류가 발생했습니다.");
        }

        setList([]);
        setTotalPages(1);
        setStartPage(1);
        setEndPage(1);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [navigate, page]);

  return (
    <div className={styles.page}>
      <div className={styles.noticeBoard}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>게시판</h2>
          <button className={styles.writeButton} onClick={() => navigate("/write")}>
            글쓰기
          </button>
        </div>

        {loading && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" />
          </div>
        )}

        {!loading && error && (
          <Alert variant="danger" className="my-3">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: 16 }}>
                        데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    list.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => navigate(`/Noticeboard/${item.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.writer}</td>
                        <td>{item.date}</td>
                        <td>{item.view}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ 백에서 준 total_pages 기준으로만 렌더 */}
            {totalPages > 0 && (
              <div className={styles.pagination}>
                <Pagination className={styles.category_pagination ?? ""}>
                  <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
                  <Pagination.Prev
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  />

                  {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((n) => (
                    <Pagination.Item key={n} active={n === page} onClick={() => setPage(n)}>
                      {n}
                    </Pagination.Item>
                  ))}

                  <Pagination.Next
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  />
                  <Pagination.Last onClick={() => setPage(totalPages)} disabled={page === totalPages} />
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
