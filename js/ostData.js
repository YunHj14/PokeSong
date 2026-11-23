const ostList = [
  // 1. 무인편
  { id: 1, no: "No. 001", series: "무인편", type: "#오프닝", title: "모험의 시작", videoId: "" },
  { id: 2, no: "No. 002", series: "무인편", type: "#오프닝", title: "포켓몬 FOREVER", videoId: "" },
  { id: 3, no: "No. 003", series: "무인편", type: "#엔딩", title: "우리는 모두 친구", videoId: "" },
  { id: 4, no: "No. 004", series: "무인편", type: "#엔딩", title: "좋은 친구들", videoId: "" },

  // 2. AG
  { id: 5, no: "No. 005", series: "AG", type: "#오프닝", title: "포켓몬스터 AG", videoId: "" },
  { id: 6, no: "No. 006", series: "AG", type: "#엔딩", title: "행복한 여행", videoId: "" },

  // 3. DP
  { id: 7, no: "No. 007", series: "DP", type: "#오프닝", title: "웃어봐", videoId: "" },
  { id: 8, no: "No. 008", series: "DP", type: "#오프닝", title: "Yes I Can!", videoId: "" },
  { id: 9, no: "No. 009", series: "DP", type: "#오프닝", title: "포켓몬 Love Forever", videoId: "" },
  { id: 10, no: "No. 010", series: "DP", type: "#엔딩", title: "힘을 내 Go Go!", videoId: "" },
  { id: 11, no: "No. 011", series: "DP", type: "#엔딩", title: "내게 주문을 걸어", videoId: "" },
  { id: 12, no: "No. 012", series: "DP", type: "#엔딩", title: "모든 게 궁금해", videoId: "" },
  { id: 13, no: "No. 013", series: "DP", type: "#엔딩", title: "언젠가 다시", videoId: "" },

  // 4. 베스트위시
  { id: 14, no: "No. 014", series: "베스트위시", type: "#오프닝", title: "Another Challenge", videoId: "" },
  { id: 15, no: "No. 015", series: "베스트위시", type: "#오프닝", title: "내 친구와 함께", videoId: "" },
  { id: 16, no: "No. 016", series: "베스트위시", type: "#오프닝", title: "우리는 하나", videoId: "" },
  { id: 17, no: "No. 017", series: "베스트위시", type: "#오프닝", title: "찬란한 계절", videoId: "" },
  { id: 18, no: "No. 018", series: "베스트위시", type: "#엔딩", title: "함께 걸어가는 길", videoId: "" },
  { id: 19, no: "No. 019", series: "베스트위시", type: "#엔딩", title: "하나지방 포켓몬 외워보자~!", videoId: "" },
  { id: 20, no: "No. 020", series: "베스트위시", type: "#엔딩", title: "무지개 저편", videoId: "" },
  { id: 21, no: "No. 021", series: "베스트위시", type: "#엔딩", title: "나야나야", videoId: "" },
  { id: 22, no: "No. 022", series: "베스트위시", type: "#엔딩", title: "우리들의 추억", videoId: "" },
  { id: 23, no: "No. 023", series: "베스트위시", type: "#엔딩", title: "손을 잡고", videoId: "" },

  // 5. XY
  { id: 24, no: "No. 024", series: "XY", type: "#오프닝", title: "한계를 넘어", videoId: "" },
  { id: 25, no: "No. 025", series: "XY", type: "#오프닝", title: "시작하는 여행", videoId: "" },
  { id: 26, no: "No. 026", series: "XY", type: "#엔딩", title: "Pika Pika", videoId: "" },
  { id: 27, no: "No. 027", series: "XY", type: "#엔딩", title: "해피 엔딩", videoId: "" },
  { id: 28, no: "No. 028", series: "XY", type: "#엔딩", title: "안녕! 나의 미래!", videoId: "" },
  { id: 29, no: "No. 029", series: "XY", type: "#엔딩", title: "영원한 친구", videoId: "" },

  // 6. XY&Z
  { id: 30, no: "No. 030", series: "XY&Z", type: "#오프닝", title: "Remember times", videoId: "" },
  { id: 31, no: "No. 031", series: "XY&Z", type: "#엔딩", title: "MY FRIEND", videoId: "" },
  { id: 32, no: "No. 032", series: "XY&Z", type: "#엔딩", title: "안녕! 나의 미래!", videoId: "" },
  { id: 33, no: "No. 033", series: "XY&Z", type: "#엔딩", title: "영원한 친구", videoId: "" },

  // 7. 썬&문
  { id: 34, no: "No. 034", series: "썬&문", type: "#오프닝", title: "ALOLA!", videoId: "" },
  { id: 35, no: "No. 035", series: "썬&문", type: "#오프닝", title: "모험의 시작(2017 ver.)", videoId: "" },
  { id: 36, no: "No. 036", series: "썬&문", type: "#오프닝", title: "빛나는 너를 만나", videoId: "" },
  { id: 37, no: "No. 037", series: "썬&문", type: "#오프닝", title: "미래의 꿈을 향해", videoId: "" },
  { id: 38, no: "No. 038", series: "썬&문", type: "#엔딩", title: "Let's go!", videoId: "" },
  { id: 39, no: "No. 039", series: "썬&문", type: "#엔딩", title: "With You", videoId: "" },
  { id: 40, no: "No. 040", series: "썬&문", type: "#엔딩", title: "꿈의 세계 (The Dream World)", videoId: "" },

  // 8. W
  { id: 41, no: "No. 041", series: "W", type: "#오프닝", title: "여행의 시작", videoId: "" },
  { id: 42, no: "No. 042", series: "W", type: "#오프닝", title: "FLY HIGH", videoId: "" },
  { id: 43, no: "No. 043", series: "W", type: "#오프닝", title: "FLY HIGH (지우&고우)", videoId: "" },
  { id: 44, no: "No. 044", series: "W", type: "#엔딩", title: "포켓몬 이름 외우기", videoId: "" },
  { id: 45, no: "No. 045", series: "W", type: "#엔딩", title: "JUMP UP", videoId: "" },

  // 9. W:내 꿈은 포켓몬마스터
  { id: 46, no: "No. 046", series: "W:내 꿈은 포켓몬마스터", type: "#오프닝", title: "모험의 시작(20th Anniversary Ver.)", videoId: "" },
  { id: 47, no: "No. 047", series: "W:내 꿈은 포켓몬마스터", type: "#엔딩", title: "우리는 모두 친구(20th Anniversary Ver.)", videoId: "" }
];
