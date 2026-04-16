# Field Layout Planner

식물 재배 게임용 밭 배치 실험 사이트입니다.

## 기능

- 기본 밭 배치 표시
- 외곽 클릭으로 밭 확장
- 클릭/우클릭으로 작물 심기 및 타일 제거
- 물, 중독, 버프 범위 시각화
- 드래그 이동, 휠 확대/축소
- GitHub Pages 자동 배포

## 로컬 실행

```powershell
npm install
npm run serve
```

브라우저에서 `http://127.0.0.1:4173` 를 열면 됩니다.

## 검증

```powershell
npm run verify
```

## 배포

`main` 브랜치에 푸시하면 GitHub Actions가 GitHub Pages로 배포합니다.
