// scripts.js
const API_BASE_URL = ""; // 같은 서버에서 HTML과 API를 같이 쓸 때는 빈 문자열이면 됨

document.addEventListener("DOMContentLoaded", () => {
  // ===== 로그인 화면 관련 DOM =====
  const loginScreen   = document.getElementById("loginScreen");
  const loginForm     = document.getElementById("loginForm");
  const loginIdInput  = document.getElementById("loginId");
  const loginPwInput  = document.getElementById("loginPw");
  const loginErrorEl  = document.getElementById("loginError");

  // ===== 홈 / 채팅 화면 관련 DOM =====
  const homeScreen   = document.getElementById("homeScreen");
  const chatScreen   = document.getElementById("app");
  const startChatBtn = document.getElementById("startChatBtn");
  const subiconBtn   = document.getElementById("subiconBtn");

  // 나중에 채팅 쪽에서 채우는 함수 (로그인 성공 시 호출하기 위해)
  let loadMessages = null;

  // ===== 화면 전환 함수 =====
  function showLogin() {
    if (loginScreen)  loginScreen.classList.remove("hidden");
    if (homeScreen)   homeScreen.classList.add("hidden");
    if (chatScreen)   chatScreen.classList.add("hidden");
  }

  function showHome() {
    if (loginScreen)  loginScreen.classList.add("hidden");
    if (homeScreen)   homeScreen.classList.remove("hidden");
    if (chatScreen)   chatScreen.classList.add("hidden");
  }

  let userInput = null; // 아래에서 실제 DOM을 할당

  function showChat() {
    if (loginScreen)  loginScreen.classList.add("hidden");
    if (homeScreen)   homeScreen.classList.add("hidden");
    if (chatScreen)   chatScreen.classList.remove("hidden");

    if (userInput) userInput.focus();
  }

  // 처음엔 로그인 화면을 보여줌
  showLogin();

  if (startChatBtn) {
    startChatBtn.addEventListener("click", showChat);
  }

  if (subiconBtn) {
    subiconBtn.addEventListener("click", showHome);
  }

  // ===== 로그인 처리 =====
  if (loginForm && loginIdInput && loginPwInput) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = loginIdInput.value.trim();
      const password = loginPwInput.value.trim();

      if (!username || !password) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
          console.error("로그인 요청 실패", res.status);
          if (loginErrorEl) {
            loginErrorEl.textContent = "서버 오류가 발생했습니다.";
            loginErrorEl.classList.remove("hidden");
          }
          return;
        }

        const data = await res.json();
        if (data.success) {
          if (loginErrorEl) loginErrorEl.classList.add("hidden");

          // 로그인 성공 → 홈 화면으로 전환
          showHome();

          // 로그인 후 기존 메시지 불러오기
          if (typeof loadMessages === "function") {
            loadMessages();
          }
        } else {
          if (loginErrorEl) {
            loginErrorEl.textContent = data.message || "아이디 또는 비밀번호가 올바르지 않습니다.";
            loginErrorEl.classList.remove("hidden");
          }
        }
      } catch (err) {
        console.error("로그인 중 오류", err);
        if (loginErrorEl) {
          loginErrorEl.textContent = "네트워크 오류가 발생했습니다.";
          loginErrorEl.classList.remove("hidden");
        }
      }
    });
  }

  // ===== 사이드바 관련 =====
  const settingsBtn     = document.getElementById("settingsBtn");
  const sidebar         = document.getElementById("sidebar");
  const sidebarOverlay  = document.getElementById("sidebarOverlay");
  const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");

  if (settingsBtn && sidebar && sidebarOverlay && sidebarCloseBtn) {
    function openSidebar() {
      sidebar.classList.add("open");
      sidebarOverlay.classList.add("open");
    }
    function closeSidebar() {
      sidebar.classList.remove("open");
      sidebarOverlay.classList.remove("open");
    }

    settingsBtn.addEventListener("click", openSidebar);
    sidebarCloseBtn.addEventListener("click", closeSidebar);
    sidebarOverlay.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSidebar();
    });
  }

  // ===== 채팅 관련 DOM =====
  const mainScreen = document.getElementById("mainScreen");
  userInput        = document.getElementById("userTextInput"); // 위에서 선언한 let userInput에 할당
  const chatLog    = document.getElementById("chatLog");
  const chatMsgs   = document.getElementById("chatLogMessages");
  const closeBtn   = document.getElementById("chatLogCloseBtn");
  const sendBtn    = document.getElementById("sendBtn");
  const recordBtn  = document.getElementById("recordBtn");

  if (!mainScreen || !userInput || !chatLog || !chatMsgs || !closeBtn) {
    console.warn("채팅 관련 요소를 찾을 수 없습니다.");
    return;
  }

  // ===== 채팅 로그 표시/숨김 =====
  function showChatLog() {
    chatLog.classList.remove("hidden");
    mainScreen.classList.add("with-chat");
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function hideChatLog() {
    chatLog.classList.add("hidden");
    mainScreen.classList.remove("with-chat");
  }

  // ===== 말풍선 추가 함수 (나/상대 구분) =====
  function addChatMessage(text, who = "me") {
    const row = document.createElement("div");
    row.className = `chatRow ${who}`; // "chatRow me" 또는 "chatRow other"

    const bubble = document.createElement("div");
    bubble.className = "chatBubble";
    bubble.textContent = text;

    row.appendChild(bubble);
    chatMsgs.appendChild(row);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  // ===== 과거 메시지 불러오기 (로그인 후 호출) =====
  loadMessages = async function () {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages?room_id=default`);
      if (!res.ok) {
        console.error("메시지 목록 불러오기 실패", res.status);
        return;
      }
      const list = await res.json(); // [{id, room_id, text, ...}, ...]

      chatMsgs.innerHTML = ""; // 기존 내용 비우고
      for (const msg of list) {
        addChatMessage(msg.text, "me");
      }
      if (list.length > 0) {
        showChatLog();
      }
    } catch (err) {
      console.error("메시지 목록 로딩 중 오류", err);
    }
  };

  // ===== 입력 이벤트 & 전송 =====

  // 입력칸 포커스 → 로그 표시
  userInput.addEventListener("focus", showChatLog);

  // 입력 중에도 표시 유지
  userInput.addEventListener("input", () => {
    if (userInput.value.trim().length > 0) {
      showChatLog();
    }
  });

  // 메시지 전송 함수
  async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: "default",
          text: text,
          client_type: "web",
        }),
      });

      if (!res.ok) {
        console.error("메시지 전송 실패", res.status);
        return;
      }

      const saved = await res.json();
      // 1) 내가 보낸 메시지
      addChatMessage(saved.text, "me");

      // 2) 서버 B에서 처리한 답장 (있다면)
      if (saved.reply_text) {
        addChatMessage(saved.reply_text, "other");
      }

      userInput.value = "";
      showChatLog();
    } catch (err) {
      console.error("메시지 전송 중 오류", err);
    }
  }

  // Enter로 메시지 전송
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // 전송 버튼 클릭 → 메시지 전송
  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      sendMessage();
      userInput.focus();
    });
  }

  // X 버튼 → 로그 닫기
  closeBtn.addEventListener("click", hideChatLog);

  // 화면의 다른 곳 클릭 → 로그 닫기 (로그/입력칸/버튼 제외)
  document.addEventListener("click", (e) => {
    if (chatLog.classList.contains("hidden")) return;

    const isInChat  = chatLog.contains(e.target);
    const isInput   = (e.target === userInput);
    const isSend    = sendBtn && sendBtn.contains(e.target);
    const isRecord  = recordBtn && recordBtn.contains(e.target);

    // 로그 영역 / 입력칸 / 전송 버튼 / 녹음 버튼이 아니면 닫기
    if (!isInChat && !isInput && !isSend && !isRecord) {
      hideChatLog();
    }
  });

  // 녹음 버튼 토글 (색만 변경)
  if (recordBtn) {
    let isRecording = false;

    recordBtn.addEventListener("click", () => {
      isRecording = !isRecording;
      recordBtn.classList.toggle("recording", isRecording);

      // 접근성용: aria-pressed, aria-label
      recordBtn.setAttribute("aria-pressed", isRecording ? "true" : "false");
      recordBtn.setAttribute(
        "aria-label",
        isRecording ? "음성 녹음 중지" : "음성 녹음 시작"
      );
    });
  }
});