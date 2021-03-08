const input = document.getElementById("input");
const lang = document.getElementById("lang");
const start = document.getElementById("start");
const progress = document.getElementById("p");
const result = document.getElementById("result");

const { createWorker } = Tesseract;

input.value =
  localStorage.getItem("input") ??
  "https://tesseract.projectnaptha.com/img/eng_bw.png";
lang.value = localStorage.getItem("lang") ?? "eng";

start.addEventListener("click", async (e) => {
  progress.hidden = false;
  progress.removeAttribute("value");
  localStorage.setItem("input", input.value);
  localStorage.setItem("lang", lang.value);

  const worker = createWorker({
    logger: (m) => {
      if (m.jobId) {
        progress.value = Number(m.progress);
      }
    },
  });

  await worker.load();
  await worker.loadLanguage(lang.value);
  await worker.initialize(lang.value);
  const {
    data: { text },
  } = await worker.recognize(input.value);
  console.log(text);
  result.textContent = text;
  await worker.terminate();
});
