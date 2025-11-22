#!/bin/bash

echo "🚀 GitHub에 코드 푸시 중..."
echo ""

# 현재 디렉토리로 이동
cd "/Users/leews/seowon app"

# 원격 저장소 설정 확인
echo "1. 원격 저장소 확인..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/solgae0527/seowon-award.git
git remote -v

# 파일 추가
echo ""
echo "2. 파일 추가 중..."
git add .

# 커밋
echo "3. 커밋 중..."
git commit -m "서원 시상식 앱 - Vercel 배포 준비"

# 푸시
echo ""
echo "4. GitHub에 푸시 중..."
echo "   👤 Username: solgae0527"
echo "   🔑 Password: (위에서 복사한 Personal Access Token 붙여넣기)"
echo ""

git push -u origin main

echo ""
echo "✅ 완료! 이제 Vercel에서 배포할 수 있습니다!"
