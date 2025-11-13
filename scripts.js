// scripts.js

document.addEventListener("DOMContentLoaded", () => {
  // ===== 화면 전환 (홈 ↔ 채팅) =====
  const homeScreen   = document.getElementById("homeScreen");
  const chatScreen   = document.getElementById("app");
  const startChatBtn = document.getElementById("startChatBtn");

  function showHome() {
    homeScreen.classList.remove("hidden");
    chatScreen.classList.add("hidden");
  }

  function showChat() {
    homeScreen.classList.add("hidden");
    chatScreen.classList.remove("hidden");

    const userInput = document.getElementById("userTextInput");
    if (userInput) userInput.focus();
  }

  if (startChatBtn) {
    startChatBtn.addEventListener("click", showChat);
  }

  // 예시: 왼쪽 아이콘 버튼을 "홈으로"로 쓰고 싶다면:
  const subiconBtn = document.getElementById("subiconBtn");
  if (subiconBtn) {
    subiconBtn.addEventListener("click", showHome);
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

  // ===== 채팅 로그 관련 =====
  const mainScreen = document.getElementById("mainScreen");
  const userInput  = document.getElementById("userTextInput");
  const chatLog    = document.getElementById("chatLog");
  const chatMsgs   = document.getElementById("chatLogMessages");
  const closeBtn   = document.getElementById("chatLogCloseBtn");

  if (!mainScreen || !userInput || !chatLog || !chatMsgs || !closeBtn) return;

  function showChatLog() {
    chatLog.classList.remove("hidden");
    mainScreen.classList.add("with-chat");
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function hideChatLog() {
    chatLog.classList.add("hidden");
    mainScreen.classList.remove("with-chat");
  }

  // 입력칸 포커스 → 로그 표시
  userInput.addEventListener("focus", showChatLog);

  // 입력 중에도 표시 유지
  userInput.addEventListener("input", () => {
    if (userInput.value.trim().length > 0) {
      showChatLog();
    }
  });

  // Enter로 메시지 추가
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const text = userInput.value.trim();
      if (!text) return;

      addChatMessage(text);
      userInput.value = "";
      showChatLog();
    }
  });

  // X 버튼 → 로그 닫기
  closeBtn.addEventListener("click", hideChatLog);

  // 화면의 다른 곳 클릭 → 로그 닫기 (로그/입력칸 제외)
  document.addEventListener("click", (e) => {
    if (chatLog.classList.contains("hidden")) return;

    const isInChat = chatLog.contains(e.target);
    const isInput  = (e.target === userInput);

    if (!isInChat && !isInput) {
      hideChatLog();
    }
  });

  function addChatMessage(text) {
    const row = document.createElement("div");
    row.className = "chatRow me";

    const bubble = document.createElement("div");
    bubble.className = "chatBubble";
    bubble.textContent = text;

    row.appendChild(bubble);
    chatMsgs.appendChild(row);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
});
