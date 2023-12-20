import { random } from "./fns";

export type TWord = typeof Shiritori;
export type DictionaryEntry = TWord & {
  enabled: boolean;
};

type PartOfSpeech = "noun" | "adj" | "verb" | "adverb";

const Shiritori = {
  kr: "끝말잇기",
  rm: "Kkeunmaritgi",
  en: "shiritori",
  speech: "noun",
  tags: [] as string[],
};

const defaultWords: TWord[] = [
  Shiritori,
  { kr: "책", rm: "chaek", en: "book", speech: "", tags: [] },
  { kr: "몇", rm: "myeot", en: "how many", speech: "", tags: [] },
  { kr: "없다", rm: "eopda", en: "to not exist", speech: "", tags: [] },
  { kr: "대학교", rm: "daehakgyo", en: "college", speech: "", tags: [] },
  { kr: "숙제하다", rm: "sukjehada", en: "to do homework", speech: "", tags: [] },
  { kr: "이학년", rm: "ihangnyeon", en: "sophomore", speech: "", tags: [] },
  { kr: "음악", rm: "eumak", en: "music", speech: "", tags: [] },
  { kr: "쇼핑하다", rm: "syopinghada", en: "to shop", speech: "", tags: [] },
  { kr: "좁다", rm: "jopda", en: "to be narrow", speech: "", tags: [] },
  { kr: "남자", rm: "namja", en: "man", speech: "", tags: [] },
  { kr: "가끔", rm: "gakkeum", en: "sometimes, occasionally", speech: "", tags: [] },
  { kr: "크리스마스", rm: "keuriseumaseu", en: "Christmas", speech: "", tags: [] },
  { kr: "어느", rm: "eoneu", en: "which", speech: "", tags: [] },
  { kr: "제", rm: "je", en: "my (humble)", speech: "", tags: [] },
  { kr: "내일", rm: "naeil", en: "tomorrow", speech: "", tags: [] },
  { kr: "지하철", rm: "jihacheol", en: "subway", speech: "", tags: [] },
  { kr: "식당", rm: "sikdang", en: "restaurant", speech: "", tags: [] },
  { kr: "조용하다", rm: "joyonghada", en: "to be quiet", speech: "", tags: [] },
  { kr: "보내다", rm: "bonaeda", en: "to send, to spend time", speech: "", tags: [] },
  { kr: "오른쪽", rm: "oreunjjok", en: "right side", speech: "", tags: [] },
  { kr: "걷다", rm: "geotda", en: "to walk", speech: "", tags: [] },
  { kr: "에", rm: "e", en: "in at on", speech: "", tags: [] },
  { kr: "수요일", rm: "suyoil", en: "Wednesday", speech: "", tags: [] },
  { kr: "뒤에", rm: "dwie", en: "behind", speech: "", tags: [] },
  { kr: "여자", rm: "yeoja", en: "woman", speech: "", tags: [] },
  { kr: "여동생", rm: "yeodongsaeng", en: "younger sister", speech: "", tags: [] },
  { kr: "전공", rm: "jeon'gong", en: "major", speech: "", tags: [] },
  { kr: "반갑다", rm: "ban'gapda", en: "glad to see (meet)", speech: "", tags: [] },
  { kr: "달", rm: "dal", en: "month (counter)", speech: "", tags: [] },
  { kr: "오래간만", rm: "oraeganman", en: "after a long time", speech: "", tags: [] },
  { kr: "햄버거", rm: "haembeogeo", en: "hamburger", speech: "", tags: [] },
  { kr: "지금", rm: "jigeum", en: "now", speech: "", tags: [] },
  { kr: "설거지하다", rm: "seolgeojihada", en: "to wash dishes", speech: "", tags: [] },
  { kr: "오전", rm: "ojeon", en: "before noon, am", speech: "", tags: [] },
  { kr: "반", rm: "ban", en: "half or class", speech: "", tags: [] },
  { kr: "질문", rm: "jilmun", en: "question", speech: "", tags: [] },
  { kr: "걸리다", rm: "geollida", en: "to take (time)", speech: "", tags: [] },
  { kr: "삼학년", rm: "samhangnyeon", en: "junior", speech: "", tags: [] },
  { kr: "배우다", rm: "bae'uda", en: "to learn", speech: "", tags: [] },
  { kr: "무슨", rm: "museun", en: "what, what kind of", speech: "", tags: [] },
  { kr: "연필", rm: "yeonpil", en: "pencil", speech: "", tags: [] },
  { kr: "학기", rm: "hakgi", en: "semester", speech: "", tags: [] },
  { kr: "오후", rm: "ohu", en: "afternoon, pm", speech: "", tags: [] },
  { kr: "아파트", rm: "apateu", en: "apartment", speech: "", tags: [] },
  { kr: "쓰다", rm: "sseuda", en: "to write", speech: "", tags: [] },
  { kr: "층", rm: "cheung", en: "floor", speech: "", tags: [] },
  { kr: "만나다", rm: "mannada", en: "to meet", speech: "", tags: [] },
  { kr: "자전거", rm: "jajeon'geo", en: "bicycle", speech: "", tags: [] },
  { kr: "크다", rm: "keuda", en: "to be big", speech: "", tags: [] },
  { kr: "여름", rm: "yeoreum", en: "summer", speech: "", tags: [] },
  { kr: "인사하다", rm: "insahada", en: "to greet", speech: "", tags: [] },
  { kr: "뉴욕", rm: "nyuyok", en: "New York", speech: "", tags: [] },
  { kr: "여행", rm: "yeohaeng", en: "travel", speech: "", tags: [] },
  { kr: "오다", rm: "oda", en: "to come", speech: "", tags: [] },
  { kr: "시청", rm: "sicheong", en: "city hall", speech: "", tags: [] },
  { kr: "처음", rm: "cheo'eum", en: "the first time", speech: "", tags: [] },
  { kr: "사전", rm: "sajeon", en: "dictionary", speech: "", tags: [] },
  { kr: "참", rm: "cham", en: "really, truly", speech: "", tags: [] },
  { kr: "예쁘다", rm: "yeppeuda", en: "to be pretty", speech: "", tags: [] },
  { kr: "다음", rm: "da'eum", en: "next, following", speech: "", tags: [] },
  { kr: "차", rm: "cha", en: "car", speech: "", tags: [] },
  { kr: "좀", rm: "jom", en: "a little", speech: "", tags: [] },
  { kr: "거기", rm: "geogi", en: "there", speech: "", tags: [] },
  { kr: "여기", rm: "yeogi", en: "here", speech: "", tags: [] },
  { kr: "살다", rm: "salda", en: "to live", speech: "", tags: [] },
  { kr: "지요?", rm: "Jiyo?", en: "isn't it? (seeking agreement)", speech: "", tags: [] },
  { kr: "어렵다", rm: "eoryeopda", en: "to be difficult", speech: "", tags: [] },
  { kr: "텔레비전", rm: "tellebijeon", en: "television", speech: "", tags: [] },
  { kr: "컴퓨터", rm: "keompyuteo", en: "computer", speech: "", tags: [] },
  { kr: "이야기하다", rm: "iyagihada", en: "to talk, to chat", speech: "", tags: [] },
  { kr: "지도", rm: "jido", en: "map", speech: "", tags: [] },
  { kr: "재미있다", rm: "jaemiitda", en: "to be interesting, fun", speech: "", tags: [] },
  { kr: "위에", rm: "wie", en: "on top of", speech: "", tags: [] },
  { kr: "개", rm: "gae", en: "dog", speech: "", tags: [] },
  { kr: "가다", rm: "gada", en: "to go", speech: "", tags: [] },
  { kr: "묻다", rm: "mutda", en: "to ask", speech: "", tags: [] },
  { kr: "인사", rm: "insa", en: "greeting", speech: "", tags: [] },
  { kr: "가르치다", rm: "gareuchida", en: "to teach", speech: "", tags: [] },
  { kr: "앉다", rm: "anda", en: "to sit", speech: "", tags: [] },
  { kr: "분", rm: "bun", en: "minute (counter)", speech: "", tags: [] },
  { kr: "중국", rm: "jungguk", en: "China", speech: "", tags: [] },
  { kr: "보이다", rm: "boida", en: "to be seen, visible", speech: "", tags: [] },
  { kr: "흐리다", rm: "heurida", en: "to be cloudy", speech: "", tags: [] },
  { kr: "캠퍼스", rm: "kaempeoseu", en: "campus", speech: "", tags: [] },
  { kr: "이름", rm: "ireum", en: "name", speech: "", tags: [] },
  { kr: "형", rm: "hyeong", en: "older brother (to male)", speech: "", tags: [] },
  { kr: "한국", rm: "han'guk", en: "Korea", speech: "", tags: [] },
  { kr: "보통", rm: "botong", en: "usually", speech: "", tags: [] },
  { kr: "이번", rm: "ibeon", en: "this (time)", speech: "", tags: [] },
  { kr: "교회", rm: "gyohoe", en: "church", speech: "", tags: [] },
  { kr: "공원", rm: "gong'won", en: "park", speech: "", tags: [] },
  { kr: "우표", rm: "upyo", en: "stamp", speech: "", tags: [] },
  { kr: "보스톤", rm: "boseuton", en: "Boston", speech: "", tags: [] },
  { kr: "생물학", rm: "saengmulhak", en: "biology (course)", speech: "", tags: [] },
  { kr: "말씀", rm: "malsseum", en: "speech, words (honorific)", speech: "", tags: [] },
  { kr: "참", rm: "cham", en: "by the way", speech: "", tags: [] },
  { kr: "동네", rm: "dongne", en: "neighbourhood", speech: "", tags: [] },
  { kr: "가게", rm: "gage", en: "store", speech: "", tags: [] },
  { kr: "서점", rm: "seojeom", en: "bookstore", speech: "", tags: [] },
  { kr: "시", rm: "si", en: "hour (counter)", speech: "", tags: [] },
  { kr: "수영하다", rm: "suyeonghada", en: "to swim", speech: "", tags: [] },
  { kr: "달러", rm: "dalleo", en: "dollar (counter)", speech: "", tags: [] },
  { kr: "얼마나", rm: "eolmana", en: "how long/how much", speech: "", tags: [] },
  { kr: "볼펜", rm: "bolpen", en: "ball point pen", speech: "", tags: [] },
  { kr: "주다", rm: "juda", en: "to give", speech: "", tags: [] },
  { kr: "시험", rm: "siheom", en: "test, exam", speech: "", tags: [] },
  { kr: "역사", rm: "yeoksa", en: "history", speech: "", tags: [] },
  { kr: "아니다", rm: "anida", en: "to not be", speech: "", tags: [] },
  { kr: "서울", rm: "seoul", en: "Seoul", speech: "", tags: [] },
  { kr: "운동하다", rm: "undonghada", en: "to exercise", speech: "", tags: [] },
  { kr: "매년", rm: "maenyeon", en: "every year", speech: "", tags: [] },
  { kr: "슈퍼", rm: "syupeo", en: "super market", speech: "", tags: [] },
  { kr: "돌다", rm: "dolda", en: "to turn", speech: "", tags: [] },
  { kr: "같이", rm: "gachi", en: "together", speech: "", tags: [] },
  { kr: "마시다", rm: "masida", en: "to drink", speech: "", tags: [] },
  { kr: "언제", rm: "eonje", en: "when", speech: "", tags: [] },
  { kr: "못", rm: "mot", en: "cannot", speech: "", tags: [] },
  { kr: "알다", rm: "alda", en: "to know", speech: "", tags: [] },
  { kr: "많다", rm: "manta", en: "to be many", speech: "", tags: [] },
  { kr: "랩", rm: "raep", en: "lab", speech: "", tags: [] },
  { kr: "넓다", rm: "neolda", en: "to be spacious, wide", speech: "", tags: [] },
  { kr: "기숙사", rm: "gisuksa", en: "dormitory", speech: "", tags: [] },
  { kr: "년", rm: "nyeon", en: "year (counter)", speech: "", tags: [] },
  { kr: "매주", rm: "maeju", en: "every week", speech: "", tags: [] },
  { kr: "누구", rm: "nugu", en: "who", speech: "", tags: [] },
  { kr: "하루", rm: "haru", en: "(one) day", speech: "", tags: [] },
  { kr: "근처", rm: "geuncheo", en: "nearby, vicinity", speech: "", tags: [] },
  { kr: "하다", rm: "hada", en: "to do", speech: "", tags: [] },
  { kr: "언니", rm: "eonni", en: "older sister (to female)", speech: "", tags: [] },
  { kr: "내", rm: "nae", en: "my", speech: "", tags: [] },
  { kr: "안에", rm: "ane", en: "inside", speech: "", tags: [] },
  { kr: "준비하다", rm: "junbihada", en: "to prepare", speech: "", tags: [] },
  { kr: "계시다", rm: "gyesida", en: "stay (honorific)", speech: "", tags: [] },
  { kr: "취미", rm: "chwimi", en: "hobby", speech: "", tags: [] },
  { kr: "미안하다", rm: "mianhada", en: "to be sorry", speech: "", tags: [] },
  { kr: "전화", rm: "jeonhwa", en: "telephone", speech: "", tags: [] },
  { kr: "역", rm: "yeok", en: "station", speech: "", tags: [] },
  { kr: "로스앤젤레스", rm: "roseuaenjelleseu", en: "Los Angeles", speech: "", tags: [] },
  { kr: "쉽다", rm: "swipda", en: "to be easy", speech: "", tags: [] },
  { kr: "룸메이트", rm: "rummeiteu", en: "roommate", speech: "", tags: [] },
  { kr: "생일", rm: "saeng'il", en: "birthday", speech: "", tags: [] },
  { kr: "비싸다", rm: "bissada", en: "to be expensive", speech: "", tags: [] },
  { kr: "덥다", rm: "deopda", en: "to be hot", speech: "", tags: [] },
  { kr: "저녁", rm: "jeonyeok", en: "evening", speech: "", tags: [] },
  { kr: "누나", rm: "nuna", en: "older sister (to male)", speech: "", tags: [] },
  { kr: "주", rm: "ju", en: "week", speech: "", tags: [] },
  { kr: "금요일", rm: "geumyoil", en: "Friday", speech: "", tags: [] },
  { kr: "아니요", rm: "aniyo", en: "no", speech: "", tags: [] },
  { kr: "읽다", rm: "ikda", en: "to read", speech: "", tags: [] },
  { kr: "1학년", rm: "1hangnyeon", en: "freshman", speech: "", tags: [] },
  { kr: "어디", rm: "eodi", en: "where", speech: "", tags: [] },
  { kr: "스포츠", rm: "seupocheu", en: "sports", speech: "", tags: [] },
  { kr: "저회", rm: "jeohoe", en: "we/us/our (humble)", speech: "", tags: [] },
  { kr: "시계", rm: "sigye", en: "clock", speech: "", tags: [] },
  { kr: "지내다", rm: "jinaeda", en: "to get along", speech: "", tags: [] },
  { kr: "백화점", rm: "baekhwajeom", en: "department store", speech: "", tags: [] },
  { kr: "말", rm: "mal", en: "speech, words (plain)", speech: "", tags: [] },
  {
    kr: "듣다",
    rm: "deutda",
    en: "to listen, to lift, to take (a course)",
    speech: "",
    tags: [],
  },
  { kr: "춥다", rm: "chupda", en: "to be cold", speech: "", tags: [] },
  { kr: "작다", rm: "jakda", en: "to be small", speech: "", tags: [] },
  { kr: "영어", rm: "yeong'eo", en: "English language", speech: "", tags: [] },
  { kr: "지난", rm: "jinan", en: "last; this past", speech: "", tags: [] },
  { kr: "부모님", rm: "bumonim", en: "parents", speech: "", tags: [] },
  { kr: "의", rm: "ui", en: "of (possession)", speech: "", tags: [] },
  { kr: "받다", rm: "batda", en: "to receive", speech: "", tags: [] },
  { kr: "전공하다", rm: "jeon'gonghada", en: "to major in", speech: "", tags: [] },
  { kr: "내리다", rm: "naerida", en: "to get off", speech: "", tags: [] },
  { kr: "홍콩", rm: "hongkong", en: "Hong Kong", speech: "", tags: [] },
  { kr: "조금", rm: "jogeum", en: "a little", speech: "", tags: [] },
  { kr: "영국", rm: "yeongguk", en: "England", speech: "", tags: [] },
  { kr: "쪽", rm: "jjok", en: "side, direction", speech: "", tags: [] },
  { kr: "매달", rm: "maedal", en: "every month", speech: "", tags: [] },
  { kr: "수업", rm: "sueop", en: "class, course", speech: "", tags: [] },
  // { "kr": "액션 영화", "rm": "aeksyeon yeonghwa", "en": "action movie", speech: "", tags: [] },
  { kr: "월요일", rm: "woryoil", en: "Monday", speech: "", tags: [] },
  { kr: "열심히", rm: "yeolsimhi", en: "diligently", speech: "", tags: [] },
  { kr: "자주", rm: "jaju", en: "often frequently", speech: "", tags: [] },
  { kr: "계절", rm: "gyejeol", en: "season", speech: "", tags: [] },
  { kr: "사이", rm: "sai", en: "between, relationship", speech: "", tags: [] },
  { kr: "옆에", rm: "yeope", en: "next to", speech: "", tags: [] },
  { kr: "거", rm: "geo", en: "thing", speech: "", tags: [] },
  { kr: "저", rm: "jeo", en: "I (humble)", speech: "", tags: [] },
  { kr: "음식", rm: "eumsik", en: "food", speech: "", tags: [] },
  { kr: "신문", rm: "sinmun", en: "newspaper", speech: "", tags: [] },
  // { "kr": "(으", "rm": "eu))로 (ro", "en": "by means of, using (a noun)", speech: "", tags: [] },
  { kr: "이다", rm: "ida", en: "to be", speech: "", tags: [] },
  { kr: "선물", rm: "seonmul", en: "gift", speech: "", tags: [] },
  { kr: "들", rm: "deul", en: "(plural particle)", speech: "", tags: [] },
  { kr: "저", rm: "jeo", en: "that over, there", speech: "", tags: [] },
  { kr: "의자", rm: "uija", en: "chair", speech: "", tags: [] },
  { kr: "미국", rm: "miguk", en: "America", speech: "", tags: [] },
  { kr: "학교", rm: "hakgyo", en: "school", speech: "", tags: [] },
  { kr: "집", rm: "jip", en: "home house", speech: "", tags: [] },
  { kr: "그", rm: "geu", en: "that", speech: "", tags: [] },
  { kr: "서로", rm: "seoro", en: "each other", speech: "", tags: [] },
  { kr: "아침", rm: "achim", en: "morning", speech: "", tags: [] },
  { kr: "일요일", rm: "iryoil", en: "Sunday", speech: "", tags: [] },
  { kr: "과목", rm: "gwamok", en: "course subject (counter)", speech: "", tags: [] },
  { kr: "극장", rm: "geukjang", en: "cinema, movie theater", speech: "", tags: [] },
  { kr: "오빠", rm: "oppa", en: "older brother (to female)", speech: "", tags: [] },
  // { "kr": "장을 보다", "rm": "jang'eul boda", "en": "to buy groceries", speech: "", tags: [] },
  { kr: "요즘", rm: "yojeum", en: "these days", speech: "", tags: [] },
  { kr: "교실", rm: "gyosil", en: "classroom", speech: "", tags: [] },
  { kr: "싸다", rm: "ssada", en: "to be cheap/ to wrap", speech: "", tags: [] },
  { kr: "가방", rm: "gabang", en: "bag", speech: "", tags: [] },
  { kr: "호선", rm: "hoseon", en: "subway line", speech: "", tags: [] },
  { kr: "수영장", rm: "suyeongjang", en: "swimming pool", speech: "", tags: [] },
  { kr: "아주", rm: "aju", en: "very", speech: "", tags: [] },
  { kr: "쭉", rm: "jjuk", en: "straight", speech: "", tags: [] },
  { kr: "저기", rm: "jeogi", en: "over there", speech: "", tags: [] },
  { kr: "왼쪽", rm: "oenjjok", en: "left side", speech: "", tags: [] },
  { kr: "학생", rm: "haksaeng", en: "student", speech: "", tags: [] },
  { kr: "시간", rm: "sigan", en: "hour, time (duration)", speech: "", tags: [] },
  { kr: "고맙다", rm: "gomapda", en: "to be thankful", speech: "", tags: [] },
  { kr: "공부하다", rm: "gongbuhada", en: "to study", speech: "", tags: [] },
  { kr: "화요일", rm: "hwayoil", en: "Tuesday", speech: "", tags: [] },
  { kr: "한국어", rm: "han'gugeo", en: "Korean language", speech: "", tags: [] },
  { kr: "대학원", rm: "daehagwon", en: "graduate school", speech: "", tags: [] },
  { kr: "소설", rm: "soseol", en: "novel", speech: "", tags: [] },
  { kr: "점심", rm: "jeomsim", en: "lunch", speech: "", tags: [] },
  { kr: "책방", rm: "chaekbang", en: "book store", speech: "", tags: [] },
  { kr: "선생님", rm: "seonsaengnim", en: "teacher", speech: "", tags: [] },
  { kr: "왜", rm: "wae", en: "why", speech: "", tags: [] },
  { kr: "나쁘다", rm: "nappeuda", en: "to be bad", speech: "", tags: [] },
  { kr: "아버지", rm: "abeoji", en: "father", speech: "", tags: [] },
  { kr: "그리고", rm: "geurigo", en: "and (conjunction)", speech: "", tags: [] },
  { kr: "밑에", rm: "mite", en: "under", speech: "", tags: [] },
  { kr: "잘", rm: "jal", en: "well", speech: "", tags: [] },
  { kr: "학생회권", rm: "haksaenghoegwon", en: "student centre", speech: "", tags: [] },
  { kr: "토요일", rm: "toyoil", en: "Saturday", speech: "", tags: [] },
  {
    kr: "정치학",
    rm: "jeongchihak",
    en: "political science (course)",
    speech: "",
    tags: [],
  },
  { kr: "재미없다", rm: "jaemieopda", en: "to be uninteresting", speech: "", tags: [] },
  { kr: "목요일", rm: "mogyoil", en: "Thursday", speech: "", tags: [] },
  { kr: "경제학", rm: "gyeongjehak", en: "economics (course)", speech: "", tags: [] },
  { kr: "감사하다", rm: "gamsahada", en: "to be thankful", speech: "", tags: [] },
  { kr: "일어나다", rm: "ireonada", en: "to get up", speech: "", tags: [] },
  { kr: "타다", rm: "tada", en: "to get on, to ride", speech: "", tags: [] },
  { kr: "보다", rm: "boda", en: "too see, to watch", speech: "", tags: [] },
  { kr: "우산", rm: "usan", en: "umbrella", speech: "", tags: [] },
  { kr: "이", rm: "i", en: "this", speech: "", tags: [] },
  { kr: "여러", rm: "yeoreo", en: "many, several", speech: "", tags: [] },
  { kr: "학년", rm: "hangnyeon", en: "school year", speech: "", tags: [] },
  { kr: "일", rm: "il", en: "day", speech: "", tags: [] },
  { kr: "어떻다", rm: "eotteota", en: "to be how", speech: "", tags: [] },
  { kr: "방학", rm: "banghak", en: "school vacation", speech: "", tags: [] },
  { kr: "커피", rm: "keopi", en: "coffee", speech: "", tags: [] },
  { kr: "좋아하다", rm: "joahada", en: "to like", speech: "", tags: [] },
  { kr: "쇼핑", rm: "syoping", en: "shopping", speech: "", tags: [] },
  { kr: "책상", rm: "chaeksang", en: "desk", speech: "", tags: [] },
  { kr: "초등학교", rm: "chodeunghakgyo", en: "elementary school", speech: "", tags: [] },
  { kr: "안", rm: "an", en: "not (before verb)", speech: "", tags: [] },
  { kr: "여행하다", rm: "yeohaenghada", en: "to travel", speech: "", tags: [] },
  { kr: "청소하다", rm: "cheongsohada", en: "to clean", speech: "", tags: [] },
  { kr: "어머니", rm: "eomeoni", en: "mother", speech: "", tags: [] },
  { kr: "연습", rm: "yeonseup", en: "practice", speech: "", tags: [] },
  { kr: "멀다", rm: "meolda", en: "to be far", speech: "", tags: [] },
  { kr: "방", rm: "bang", en: "room", speech: "", tags: [] },
  { kr: "권", rm: "gwon", en: "volume (counter)", speech: "", tags: [] },
  { kr: "오늘", rm: "oneul", en: "today", speech: "", tags: [] },
  { kr: "빌딩", rm: "bilding", en: "building", speech: "", tags: [] },
  { kr: "테니스", rm: "teniseu", en: "tennis", speech: "", tags: [] },
  { kr: "너무", rm: "neomu", en: "too much", speech: "", tags: [] },
  { kr: "정말", rm: "jeongmal", en: "really", speech: "", tags: [] },
  { kr: "그래서", rm: "geuraeseo", en: "so, therefore", speech: "", tags: [] },
  { kr: "가운데", rm: "gaunde", en: "the middle, the centre", speech: "", tags: [] },
  { kr: "대학생", rm: "daehaksaeng", en: "college student", speech: "", tags: [] },
  { kr: "숙제", rm: "sukje", en: "homework", speech: "", tags: [] },
  { kr: "까지", rm: "kkaji", en: "up to, until", speech: "", tags: [] },
  { kr: "약속", rm: "yaksok", en: "engagement promise", speech: "", tags: [] },
  { kr: "일본", rm: "ilbon", en: "Japan", speech: "", tags: [] },
  { kr: "맛없다", rm: "madeopda", en: "tasteless, not delicious", speech: "", tags: [] },
  { kr: "먹다", rm: "meokda", en: "to eat", speech: "", tags: [] },
  { kr: "뭐", rm: "mwo", en: "what", speech: "", tags: [] },
  { kr: "번", rm: "beon", en: "number time (occurrence) turn", speech: "", tags: [] },
  { kr: "봄", rm: "bom", en: "spring", speech: "", tags: [] },
  { kr: "따뜻하다", rm: "ttatteuthada", en: "to be warm", speech: "", tags: [] },
  { kr: "우체국", rm: "ucheguk", en: "post office", speech: "", tags: [] },
  { kr: "가깝다", rm: "gakkapda", en: "to be close; near", speech: "", tags: [] },
  { kr: "사람", rm: "saram", en: "person", speech: "", tags: [] },
  { kr: "운동", rm: "undong", en: "exercise", speech: "", tags: [] },
  { kr: "겨울", rm: "gyeoul", en: "winter", speech: "", tags: [] },
  { kr: "좋다", rm: "jota", en: "to be good", speech: "", tags: [] },
  { kr: "명", rm: "myeong", en: "people (counter)", speech: "", tags: [] },
  { kr: "많이", rm: "mani", en: "much many", speech: "", tags: [] },
  { kr: "마리", rm: "mari", en: "animal (counter)", speech: "", tags: [] },
  { kr: "안녕히", rm: "annyeonghi", en: "peacefully, in peace", speech: "", tags: [] },
  { kr: "일하다", rm: "ilhada", en: "to work", speech: "", tags: [] },
  { kr: "아마", rm: "ama", en: "probably perhaps", speech: "", tags: [] },
  { kr: "잡지", rm: "japji", en: "magazine", speech: "", tags: [] },
  { kr: "교과서", rm: "gyogwaseo", en: "text book", speech: "", tags: [] },
  { kr: "맛있다", rm: "masitda", en: "to be delicious", speech: "", tags: [] },
  { kr: "건너편", rm: "geonneopyeon", en: "the other side", speech: "", tags: [] },
  { kr: "뵙다", rm: "boepda", en: "to see (humble)", speech: "", tags: [] },
  { kr: "만", rm: "man", en: "only", speech: "", tags: [] },
  { kr: "테니스장", rm: "teniseujang", en: "tennis court", speech: "", tags: [] },
  { kr: "바쁘다", rm: "bappeuda", en: "to be busy", speech: "", tags: [] },
  { kr: "비행기", rm: "bihaenggi", en: "airplane", speech: "", tags: [] },
  { kr: "하와이", rm: "hawai", en: "Hawaii", speech: "", tags: [] },
  { kr: "주말", rm: "jumal", en: "weekend", speech: "", tags: [] },
  { kr: "대학원생", rm: "daehagwonsaeng", en: "graduate student", speech: "", tags: [] },
  { kr: "심리학", rm: "simnihak", en: "psychology (course)", speech: "", tags: [] },
  { kr: "매일", rm: "maeil", en: "every day", speech: "", tags: [] },
  { kr: "과", rm: "gwa", en: "lesson chapter", speech: "", tags: [] },
  { kr: "어떻게", rm: "eotteoke", en: "how", speech: "", tags: [] },
  { kr: "연습하다", rm: "yeonseuphada", en: "to practice", speech: "", tags: [] },
  { kr: "코메디", rm: "komedi", en: "comedy", speech: "", tags: [] },
  { kr: "꽃", rm: "kkot", en: "flower", speech: "", tags: [] },
  { kr: "준비", rm: "junbi", en: "preparation", speech: "", tags: [] },
  { kr: "있다", rm: "itda", en: "to exist", speech: "", tags: [] },
  // { "kr": "학교 식당", "rm": "hakgyo sikdang", "en": "school cafeteria", speech: "", tags: [] },
  { kr: "쯤", rm: "jjeum", en: "about around (time)", speech: "", tags: [] },
  { kr: "가을", rm: "ga'eul", en: "autumn fall", speech: "", tags: [] },
  { kr: "약국", rm: "yakguk", en: "drugstore", speech: "", tags: [] },
  { kr: "커피숍", rm: "keopisyop", en: "coffee shop", speech: "", tags: [] },
  { kr: "꽃집", rm: "kkotjip", en: "flower shop", speech: "", tags: [] },
  { kr: "치다", rm: "chida", en: "to play (tennis guitar)", speech: "", tags: [] },
  { kr: "도서관", rm: "doseogwan", en: "library", speech: "", tags: [] },
  { kr: "원", rm: "won", en: "won (Korean currency)", speech: "", tags: [] },
  { kr: "내년", rm: "naenyeon", en: "next year", speech: "", tags: [] },
  { kr: "선물하다", rm: "seonmulhada", en: "to give a gift", speech: "", tags: [] },
  { kr: "의사", rm: "uisa", en: "doctor", speech: "", tags: [] },
  { kr: "만화책", rm: "manhwachaek", en: "comic book", speech: "", tags: [] },
  { kr: "남동생", rm: "namdongsaeng", en: "younger brother", speech: "", tags: [] },
  { kr: "괜찮다", rm: "gwaenchanta", en: "to be ok", speech: "", tags: [] },
  { kr: "고", rm: "go", en: "clausal, connective", speech: "", tags: [] },
  { kr: "자다", rm: "jada", en: "to sleep", speech: "", tags: [] },
  { kr: "깨끗하다", rm: "kkaekkeuthada", en: "to be clean", speech: "", tags: [] },
  { kr: "군데", rm: "gunde", en: "place spot", speech: "", tags: [] },
  { kr: "나라", rm: "nara", en: "country", speech: "", tags: [] },
  { kr: "사학년", rm: "sahangnyeon", en: "senior (school year)", speech: "", tags: [] },
  { kr: "앞에", rm: "ape", en: "in front", speech: "", tags: [] },
  { kr: "마켓", rm: "maket", en: "market", speech: "", tags: [] },
  { kr: "날씨", rm: "nalssi", en: "weather", speech: "", tags: [] },
  { kr: "주스", rm: "juseu", en: "juice", speech: "", tags: [] },
  { kr: "그렇다", rm: "geureota", en: "to be so", speech: "", tags: [] },
  { kr: "우리", rm: "uri", en: "we/us/our (plain)", speech: "", tags: [] },
  { kr: "동생", rm: "dongsaeng", en: "younger sibling", speech: "", tags: [] },
  { kr: "청소", rm: "cheongso", en: "cleaning", speech: "", tags: [] },
  { kr: "사다", rm: "sada", en: "to buy", speech: "", tags: [] },
  { kr: "어제", rm: "eoje", en: "yesterday", speech: "", tags: [] },
  {
    kr: "고등학생",
    rm: "godeunghaksaeng",
    en: "high school student",
    speech: "",
    tags: [],
  },
  { kr: "그럼", rm: "geureom", en: "(if so) then", speech: "", tags: [] },
  { kr: "모르다", rm: "moreuda", en: "to not know", speech: "", tags: [] },
  { kr: "친구", rm: "chin'gu", en: "friend", speech: "", tags: [] },
  { kr: "은행", rm: "eunhaeng", en: "bank", speech: "", tags: [] },
  { kr: "팔다", rm: "palda", en: "to sell", speech: "", tags: [] },
  { kr: "그런데", rm: "geureonde", en: "but, however, by the way", speech: "", tags: [] },
]

export default class Dictionary {
  static id(word: TWord): string {
    return word.kr;
  }

  map: Map<string, DictionaryEntry>;

  constructor(wordList: TWord[]) {
    const entries = wordList.map(
      (word) =>
        [
          Dictionary.id(word), // map key
          { ...word, enabled: true }, // map value
        ] as const
    );
    this.map = new Map(entries.values());
  }

  getEntry(entry: string) {
    return this.map.get(entry);
  }

  getRandomEntry() {
    const index = random.int(0, this.map.size);
    const entry = Array.from(this.map.values())[index];
    return entry;
  }

  remove(id: string | string[]) {
    if (Array.isArray(id)) {
      id.forEach((i) => this.map.delete(i));
    } else {
      this.map.delete(id);
    }
  }

  add(word: TWord | TWord[], enabled = true) {
    const ad = (word: TWord, enabled: boolean) => {
      this.map.set(Dictionary.id(word), { ...word, enabled });
    };

    if (Array.isArray(word)) {
      word.forEach((w) => ad(w, enabled));
    } else {
      ad(word, enabled);
    }
  }

  enable(id: string | string[]) {
    const enbl = (id: string) => {
      const entry = this.map.get(id);
      if (entry) {
        entry.enabled = true;
      } else {
        console.error(`[dictionary] entry ${id} doesn't exist`);
      }
    };

    if (Array.isArray(id)) {
      id.forEach((i) => enbl(i));
    } else {
      enbl(id);
    }
  }
}

function getRandomWord(): TWord {
  const word = random.fromArray(defaultWords);
  if (!word) throw Error("DICT ERROR: Empty Dictionary???");
  return word;
}

// TODO chatgpt
function getRandomSyllables(count: number): string[] {
  const hangulBase = 0xac00; // Unicode value for the start of Hangul syllables
  const hangulEnd = 0xd7a3; // Unicode value for the end of Hangul syllables
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    const randomCode =
      Math.floor(Math.random() * (hangulEnd - hangulBase + 1)) + hangulBase;
    const syllable = String.fromCharCode(randomCode);
    result.push(syllable);
  }

  return result;
}

export const Dict = {
  Shiritori,
  defaultWords,
  getRandomWord,
  getRandomSyllables,
};
