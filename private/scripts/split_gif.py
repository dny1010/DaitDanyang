from PIL import Image
import os

# ==========================================
# 설정
# ==========================================
# 스크립트 위치 (C:\SynologyDrive\Nyang) 기준으로 상대 경로
GIF_PATH = os.path.join('front', 'public', 'images', 'walking_cat.gif')
OUTPUT_DIR = os.path.join('front', 'public', 'images', 'cat_frames')
# ==========================================

def split_gif_to_frames(gif_path, output_dir):
    # 파일 확인
    if not os.path.exists(gif_path):
        print(f"Error: GIF 파일이 없습니다 -> {gif_path}")
        print(f"현재 작업 디렉토리: {os.getcwd()}")
        print("GIF_PATH 설정이 올바른지 확인해주세요.")
        return

    # 출력 폴더 생성
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"폴더 생성됨: {output_dir}")

    try:
        # GIF 열기
        with Image.open(gif_path) as im:
            print(f"--- GIF 분해 시작: {gif_path} ---")
            
            # 프레임 순회
            frame_num = 0
            while True:
                # 프레임 저장을 위한 파일명
                output_filename = os.path.join(output_dir, f"frame_{frame_num:03d}.png")
                
                # 현재 프레임을 PNG로 저장
                im.save(output_filename)
                
                frame_num += 1
                try:
                    im.seek(frame_num) # 다음 프레임으로 이동
                except EOFError:
                    break # 더 이상 프레임이 없으면 종료

        print(f"--- 완료! 총 {frame_num}장의 이미지가 '{output_dir}' 폴더에 저장되었습니다. ---")

    except Exception as e:
        print(f"Error 발생: {e}")

if __name__ == '__main__':
    split_gif_to_frames(GIF_PATH, OUTPUT_DIR)