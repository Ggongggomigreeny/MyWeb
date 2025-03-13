// LED 제어 함수 선언
function ledON() {
  //console.log('led켜짐')
  var ref = database.ref('led');
  ref.update({ led: 1 })
}

function ledOFF() {
  //console.log('led꺼짐')
  var ref = database.ref('led');
  ref.update({ led: 0 })
}

// Firebase 접근 정보
var config = {
  apiKey: "AIzaSyATM-oDttnprFJn_DFv2lzvH-EWr6tvmgU",
  authDomain: "test-d0e11.firebaseapp.com",
  databaseURL: "https://test-d0e11-default-rtdb.firebaseio.com",
  projectId: "test-d0e11",
  storageBucket: "test-d0e11.firebasestorage.app",
  messagingSenderId: "621986880073",
  appId: "1:621986880073:web:c40f854e907f7137cf3d98"
};

//Firebase 데이터베이스 만들기
firebase.initializeApp(config);
database = firebase.database();

// Firebase 데이터베이스 정보 가져오기
var ref = database.ref("led");
ref.on("value", gotData);


function gotData(data) {
  var val = data.val();

  if (val.led == 0){
    //document.getElementById("ledstatus").innerHTML = "led가 현재 꺼짐";
    document.getElementById("img").src = "off.png";}
  else {
    //document.getElementById("ledstatus").innerHTML = "led가 현재 켜짐";
    document.getElementById("img").src = "on.png";}
  
  console.log(val)
}

// SpeechRecognition 객체 생성
// 다양한 브라우저에서 호환성을 위해 다른 prefixed 버전들을 대체(fallback)로 사용
// - window.SpeechRecognition: 표준 API
// - window.webkitSpeechRecognition: Chrome, Safari 등 Webkit 기반 브라우저용
// - window.mozSpeechRecognition: Firefox용
// - window.msSpeechRecognition: Microsoft Edge용
var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();

// 음성 인식 설정
recognition.lang = 'ko-KR';         // 인식할 언어 설정 (한국어)
recognition.interimResults = false;  // 중간 결과를 반환하지 않음 (최종 결과만 반환)
recognition.maxAlternatives = 1;     // 인식 결과의 대안 개수를 1개로 설정

// 음성 인식 시작
recognition.start();

// 음성 인식 결과 처리 이벤트 핸들러
recognition.onresult = function(event) {
  // 인식된 텍스트 추출 (첫 번째 결과의 첫 번째 대안)
  var speechResult = event.results[0][0].transcript;
  // 콘솔에 인식된 텍스트 출력
  console.log('인식된 텍스트: ' + speechResult);

  // '켜'라는 단어가 포함된 경우 LED를 켬
  if ((speechResult.indexOf('밝게') !== -1) || (speechResult.indexOf('켜') !== -1)){
    ledON()
  }

  // '꺼'라는 단어가 포함된 경우 LED를 끔
  if ((speechResult.indexOf('어둡게') !== -1) || (speechResult.indexOf('꺼') !== -1)) {
    ledOFF()
  }
};

// 음성 인식 오류 처리 이벤트 핸들러
recognition.onerror = function(event) {
  // 오류 메시지를 콘솔에 출력
  // 주요 오류 유형:
  // - no-speech: 음성이 감지되지 않음
  // - aborted: 사용자 또는 시스템에 의해 인식이 중단됨
  // - network: 네트워크 오류
  // - not-allowed: 마이크 권한이 없음
  console.log('오류 발생: ' + event.error);
};

// 음성 인식 종료 이벤트 핸들러
// 음성 인식이 종료될 때마다 다시 시작하여 연속적인 인식 가능
recognition.onend = function() {
  // 음성 인식 재시작
  recognition.start();
};