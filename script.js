import { db, ref, set, onValue, update } from "./firebase.js";

// ===== GAME =====
const board = document.getElementById("board");
const diceEl = document.getElementById("dice");

let positions = [0, 0];
let currentPlayer = 0;
let moving = false;

let roomId = null;
let playerIndex = null;

let lastEventText = "";

// ✅ langsung bikin board
createBoard();

const snakes = {99:54,70:55,52:42,25:2};
const ladders = {4:14,9:31,28:84,40:59};

// ===== LIST PERTANYAAN 💗 =====
const truthList = [
"kamu suka kesel ga kalo aku terus nanya "kamu sayang sama aku ga??" ,kenapa??",
"menurut kamu aku masii egois ga waktu kita berantem??",
"menurut kamu apa kebiasaan aku yang sebenernya bikin kamu cape tapi kamu ga berani ngomong??",
"kapan terakhir kali kamu bohong ke aku meski bohong kecil dan kenapa kamu ngerasa perlu ngelakuin itu??",
"kalo kamu lagi cemburu aku harus ngapaian??","menurut kamu seberapa penting sii rasa cemburu di dalam hubungan??",
"ada ga hal yang menurut aku biasa aja tapi menurut kamu itu tuh ngeselin bangettt??",
"gimana caranya biar aku bisa jadi pasangan yang terbaik buat kamu??",
"ada ga masalah yang udaa kita anggap beres padahal masii pengen kamu bahas??",
"ada ga orang lain yang akhir² ini kamu chat secara intens??",
"menurut kamu alasan seseorang selingkuh itu kenapa??",
"aku udaa jadi support system kamu atau belum?? kenapa??",
"kalo kamu kecewa sama aku gimana caranya biar kamu bisa maafin aku??",
"menurut kamu selain selingkuh apa sii yang bisa bikin hubungan kita rusak??",
"ada ga hal yang belum kamu percayai sepenuhnya dari aku??",
"apa yang ada dipikaran kamu waktu pas pertama kali kenal??",
"kalo semisal kamu udaa tau semua keburukan aku apa yang bakal kamu lakuin??",
"hal apa yang sering bikin kamu overthinking??",
"sejauh ini aku lebih sering ngertiin kamu atau banyak salah pahamnya??",
"ada ga hal yang bikin kamu insecure di dalam hubungan ini??",
"apa yang kamu rasain waktu aku ceritain masa lalu aku??",
"dari 1-10 seberapa besar kamu ngerasa disayang sama aku?? kenapa??",
"kalau kamu lagi cape, terus respon aku ga sesuai sama apa yang kamu mau atau beda dari biasanya ( lebih cuek ), kamu marah atau malah nambah cape? dan kenapa?",
"semisalnya takdir berkata lain, kita yang awalnya mau tinggal bareng malah ga jadi, apa solusi dari masalah ini?",
"pas kita tinggal bareng nih, pasti selalu panggil sayang, nah kalau aku ga manggil sayang ke kamu seharian, kamu bakal mikir aku udah ga sayang atau aku udah bosen manggil sayang?",
"kalau aku manggil kamu nama doang di depan temen yang tau hubungan kita, itu jadi masalah bagi kamu ga?",
"kamu bisa ga kalau marah jangan malah tidur atau diem, ganti jadi bawel, rungsing, atau tantrum, bisa ga?",
"di hari masih kerja aku janji bakal ngajak kamu keluar buat jalan-jalan, tapi pas di weekend nya janji itu ga terlaksana, kamu bakal ngerasain apa?",
"aku ngajak temen kerja aku ke rumah kita berdua nanti, terus ga sengaja bahas sesuatu yang ga kamu suka, kamu bakal negur atau malah nanti negur nya ke aku doang?",
"sesuatu yang mustahil bakal terjadi, ga ada yang ga mungkin. kalau suatu saat kedua orang tua kamu tau hubungan kita berdua apa, setelahnya mereka pengen bawa kamu jauh dari aku, kamu menyikapi nya gimana? itu orang tua kamu, pasti kamu sayang",
"siap ga kamu kalau aku minta sesuatu yang ga kepikiran sama sekali di otak kamu?",
"ayo jujur sama aku ya, kamu masih tertarik sama lawan jenis, atau ga ada rasa tertarik sama sekali?",
"ada satu laki-laki yang merhatiin kamu banget, tau apapun yang kamu suka atau ga suka meski dia udah kamu hindari berkali-kali tapi dia ga nyerah. disalah satu kesempatan dia untuk dekat kamu itu, ada ga yang bakal kamu respon cara dia ngedeketin kamu?",
"kamu marah kalau aku bahas perempuan lain, misalnya perempuan di tiktok atau di media sosial lainnya yang lagi beredar?",
"kamu mau ngajarin sesuatu ga sama aku yang umurnya lebih muda dari kamu? itung-itung pengalaman hidup.",
"kalau aku lagi di dalam kondisi ga baik-baik aja, kamu bakal sadar? gimana caranya?",
"keadaan nya kita renggang karena masalah yang bisa dibilang gede, kira-kira siapa yang bakal ngerapihin masalah kerenggangan itu? aku atau kamu? jelasin.",
"suatu saat aku pasti negur kamu soal pakaian, tapi sebisa mungkin aku ngerangkai kata supaya kamu ga tersinggung atau merasa ga dihargai, kamu milih dengerin atau sebaliknya? bodoamat gitu.",
"jujur, bagi aku kamu perempuan yang bikin aku mau menata kembali masa depan indah disana, tapi di satu sisi pasti ada aja hal yang selalu bikin aku berpikiran sebaliknya, dan kamu kena imbasnya, kamu bakal bilang ke aku gimana?",
"siapa orang yang pertama kali bakal kamu hubungi kalau lagi berantem sama aku?",
"kamu lagi nangis nih terus aku liat, nah itu aku harus ngapain? soalnya aku takut kamu malah marah-marah kalau aku deketin pas lagi sensitif gitu.",
"siapa tau nanti kamu ngerasa ga kayak di posisi sebelumnya di hubungan ini, kamu ngerasa lebih turun posisi, yang tadinya di prioritasin jadi ga di prioritasin sama sekali, atau dibiarin sama aku. kamu ngeraih posisi sebelumnya atau langsung aja serang aku kenapa aku berubah gitu aja?",
"aku kan pelupa yang di sengaja, kalau aku pura-pura lupain hal-hal kecil tentang kamu, kamu gimana? respon nya",
"aku mau minta sesuatu dari kamu yang ga kamu pikirkan sama sekali sebelumnya, kamu siap ngasih nya?"
];

// ===== POPUP =====
function showModal(title, text){
  document.getElementById("eventTitle").innerText = title;
  document.getElementById("eventText").innerText = text;
  document.getElementById("modal").style.display = "flex";

  const sound = document.getElementById("tingSound");
  if(sound){
    sound.currentTime = 0;
    sound.volume = 0.5;
    sound.play().catch(()=>{});
  }
}

// ===== BOARD =====
function createBoard(){
  let zigzag = true;

  for(let row=10; row>=1; row--){
    let nums = [];
    for(let col=1; col<=10; col++){
      nums.push((row-1)*10+col);
    }

    if(!zigzag) nums.reverse();
    zigzag = !zigzag;

    nums.forEach(num=>{
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.id = "cell-" + num;
      cell.innerText = num;

      if(snakes[num]){
        let s = document.createElement("div");
        s.className = "icon";
        s.innerText = "🐍";
        cell.appendChild(s);
      }

      if(ladders[num]){
        let l = document.createElement("div");
        l.className = "icon";
        l.innerText = "🪜";
        cell.appendChild(l);
      }

      board.appendChild(cell);
    });
  }
}

function renderPlayers(){
  document.querySelectorAll(".player").forEach(p=>p.remove());

  positions.forEach((pos,index)=>{
    if(pos > 0){
      let piece = document.createElement("div");
      piece.className = "player " + (index===0?"p1":"p2");
      document.getElementById("cell-"+pos).appendChild(piece);
    }
  });
}

// ===== GAMEPLAY =====
function rollDice(){
  if(roomId && currentPlayer !== playerIndex) return;
  if(moving) return;

  moving = true;
  diceEl.innerText = "🎲";

  setTimeout(()=>{
    let dice = Math.floor(Math.random()*6)+1;
    diceEl.innerText = dice;
    movePlayer(dice);

    setTimeout(()=>{ diceEl.innerText="🎲"; },1000);
  },500);
}

function movePlayer(steps){
  let player = currentPlayer;

  let interval = setInterval(()=>{
    if(steps > 0){
      positions[player]++;
      if(positions[player] > 100) positions[player] = 100;

      renderPlayers();
      steps--;
    }else{
      clearInterval(interval);
      checkSpecial(player);
    }
  },200);
}

function checkSpecial(player){
  let pos = positions[player];

  if(snakes[pos]) return animateMove(player, snakes[pos]);
  if(ladders[pos]) return animateMove(player, ladders[pos]);

  showQuestion(player);
}

function animateMove(player, target){
  let interval = setInterval(()=>{
    if(positions[player] < target) positions[player]++;
    else if(positions[player] > target) positions[player]--;
    else{
      clearInterval(interval);
      showQuestion(player);
      return;
    }

    renderPlayers();
  },150);
}

// ===== 💗 PERTANYAAN SAJA =====
function showQuestion(player){
  let pos = positions[player];

  let title = "PERTANYAAN 💗";
  let text = truthList[(pos-1)%truthList.length];

  if(roomId && db){
    update(ref(db,"rooms/"+roomId),{
      event:{
        show:true,
        title:title,
        text:text
      },
      positions:positions,
      currentPlayer:currentPlayer
    });
  }else{
    showModal(title,text);
  }

  if(pos === 100){
    setTimeout(()=>{
      alert("Player "+(player+1)+" MENANG 💗");
      positions = [0,0];
      renderPlayers();
    },500);
  }

  currentPlayer = currentPlayer===0 ? 1 : 0;
  document.getElementById("info").innerText =
    "Giliran: Player " + (currentPlayer+1);

  moving = false;
  updateRoom();
}

// ===== CLOSE MODAL =====
function closeModal(){
  document.getElementById("modal").style.display = "none";

  if(roomId && db){
    update(ref(db,"rooms/"+roomId),{
      event:{show:false}
    });
  }
}

// ===== ROOM =====
function generateRoomCode(){
  return Math.random().toString(36).substring(2,7).toUpperCase();
}

function createRoom(){
  if(!db){
    alert("Firebase tidak aktif");
    return;
  }

  roomId = generateRoomCode();
  playerIndex = 0;

  set(ref(db,"rooms/"+roomId),{
    positions:[0,0],
    currentPlayer:0,
    event:{show:false}
  });

  alert("Room: "+roomId);
  listenRoom();
}

function joinRoom(){
  if(!db){
    alert("Firebase tidak aktif");
    return;
  }

  roomId = document.getElementById("roomInput").value.toUpperCase();
  playerIndex = 1;
  listenRoom();
}

function listenRoom(){
  if(!db) return;

  onValue(ref(db,"rooms/"+roomId),(snapshot)=>{
    const data = snapshot.val();

    if(data){
      positions = data.positions;
      currentPlayer = data.currentPlayer;

      renderPlayers();

      document.getElementById("info").innerText =
        "Giliran: Player " + (currentPlayer+1);

      if(data.event && data.event.show && data.event.text !== lastEventText){
        lastEventText = data.event.text;
        showModal(data.event.title,data.event.text);
      }
    }
  });
}

function updateRoom(){
  if(roomId && db){
    update(ref(db,"rooms/"+roomId),{
      positions,
      currentPlayer
    });
  }
}

// ===== GLOBAL (biar tombol HTML bisa jalan) =====
window.rollDice = rollDice;
window.createRoom = createRoom;
window.joinRoom = joinRoom;
window.closeModal = closeModal;
