import React, { useState } from 'react';

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState(null); // 첨부파일 상태

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('제목:', title);
    console.log('내용:', content);
    console.log('첨부파일:', attachment);
    // 여기에 게시글 제출 로직을 구현할 수 있습니다.
    // (예: 서버로 데이터 전송)
    alert('게시글이 제출되었습니다! (실제 기능은 미구현)');
    setTitle('');
    setContent('');
    setAttachment(null);
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]); // 첫 번째 선택된 파일 저장
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '20px auto', border: '1px solid #e7e7e7', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '25px', textAlign: 'center', color: '#333' }}>새 게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>제목:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>내용:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical' }}
            placeholder="내용을 입력하세요"
            required
          ></textarea>
        </div>
        <div style={{ marginBottom: '25px' }}>
          <label htmlFor="attachment" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>첨부파일:</label>
          <input
            type="file"
            id="attachment"
            onChange={handleFileChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#f9f9f9' }}
          />
          {attachment && <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>선택된 파일: {attachment.name}</p>}
        </div>
        <button
          type="submit"
          style={{ width: '100%', padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '18px', cursor: 'pointer' }}
        >
          제출하기
        </button>
      </form>
    </div>
  );
}

export default PostForm;