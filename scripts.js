// scripts.js

document.addEventListener("DOMContentLoaded", () => {
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

    // 오른쪽 위 설정 버튼 클릭 → 열기
    settingsBtn.addEventListener("click", openSidebar);

    // 닫기 버튼, 오버레이 클릭 → 닫기
    sidebarCloseBtn.addEventListener("click", closeSidebar);
    sidebarOverlay.addEventListener("click", closeSidebar);

    // ESC 키로 닫기
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeSidebar();
      }
    });
  }

  // ===== 채팅 로그 관련 =====
  const mainScreen = document.getElementById("mainScreen");
  const userInput  = document.getElementById("userTextInput");
  const chatLog    = document.getElementById("chatLog");
  const chatMsgs   = document.getElementById("chatLogMessages");
  const closeBtn   = document.getElementById("chatLogCloseBtn");

  // 필요한 요소가 다 있을 때만 채팅 기능 활성화
  if (!mainScreen || !userInput || !chatLog || !chatMsgs || !closeBtn) {
    console.warn("채팅 관련 요소를 찾을 수 없습니다.");
    return;
  }

  // 공통: 로그 보여주기 / 숨기기
  function showChatLog() {
    chatLog.classList.remove("hidden");
    mainScreen.classList.add("with-chat");   // 메인 이미지 위로 올라가게
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function hideChatLog() {
    chatLog.classList.add("hidden");
    mainScreen.classList.remove("with-chat"); // 메인 이미지 다시 정가운데
  }

  // 입력 시작하면 로그 보이게
  userInput.addEventListener("input", () => {
    if (userInput.value.trim().length > 0) {
      showChatLog();
    } else {
      hideChatLog();
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

      // 메시지 보낸 직후에도, 다시 입력할 수 있도록 로그는 그대로 보이게
      showChatLog();
    }
  });

  // X 버튼으로 닫기
  closeBtn.addEventListener("click", () => {
    hideChatLog();
  });

  // 페이지 아무 곳이나 클릭했을 때,
  // 입력창이나 로그 영역이 아니면 로그 숨기기
  document.addEventListener("click", (e) => {
    if (chatLog.classList.contains("hidden")) return;

    const isInChat  = chatLog.contains(e.target);
    const isInput   = (e.target === userInput);

    if (!isInChat && !isInput) {
      hideChatLog();
    }
  });
  
  // 입력칸에 포커스가 되는 순간 로그 열기
	userInput.addEventListener("focus", () => {
		showChatLog();
	});

  // 채팅 메시지 추가 함수
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
