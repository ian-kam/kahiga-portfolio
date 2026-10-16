// Kahiga portfolio interactions: typing headline, Matrix-style background,
// animated skill bars, and a safe simulated terminal.
document.addEventListener("DOMContentLoaded", () => {
  // Animated headline. The full text remains available if JavaScript is disabled.
  const typed = document.getElementById("typed-headline");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typed && !reduceMotion) {
    const phrase = "Building the future,";
    typed.textContent = "";
    let index = 0;
    const typeNext = () => {
      if (index < phrase.length) {
        typed.textContent += phrase.charAt(index++);
        window.setTimeout(typeNext, 75);
      }
    };
    typeNext();
  }

  // Matrix-style falling characters, kept subtle and disabled for reduced motion.
  const canvas = document.getElementById("matrix-canvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const chars = "01アイウエオカキクケコサシスセソABCDEF";
      const fontSize = 14;
      let columns = 0;
      let drops = [];
      let frame = 0;
      let width = 0;
      let height = 0;
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        columns = Math.ceil(width / fontSize);
        drops = Array.from({ length: columns }, () => Math.random() * -height / fontSize);
      };
      const draw = () => {
        // Draw less frequently to keep the effect lightweight on mobile devices.
        frame++;
        if (frame % 2 === 0) {
          ctx.fillStyle = "rgba(8, 13, 11, 0.10)";
          ctx.fillRect(0, 0, width, height);
          ctx.font = fontSize + "px monospace";
          ctx.fillStyle = "#65ff7a";
          for (let i = 0; i < drops.length; i++) {
            const char = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
            drops[i] += 0.45;
          }
        }
        requestAnimationFrame(draw);
      };
      resize();
      window.addEventListener("resize", resize, { passive: true });
      draw();
    }
  }

  // Animate skill bars when the skills section scrolls into view.
  const skillBars = document.querySelectorAll(".skill-fill");
  if (skillBars.length) {
    const fillBars = () => skillBars.forEach((bar) => {
      const level = Math.max(0, Math.min(100, Number(bar.dataset.level) || 0));
      bar.style.width = level + "%";
    });
    if ("IntersectionObserver" in window && !reduceMotion) {
      const section = document.getElementById("skills");
      if (section) {
        const observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            fillBars();
            observer.disconnect();
          }
        }, { threshold: 0.2 });
        observer.observe(section);
      } else fillBars();
    } else fillBars();
  }

  // Safe portfolio terminal: commands only display information and navigate locally.
  const form = document.getElementById("terminal-form");
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");
  if (form && input && output) {
    const addLine = (text, className = "") => {
      const p = document.createElement("p");
      if (className) p.className = className;
      p.textContent = text;
      output.appendChild(p);
      output.scrollTop = output.scrollHeight;
    };
    const commands = {
      help: () => {
        addLine("Available commands:");
        addLine("  help      - show this command list");
        addLine("  about     - learn about Kahiga");
        addLine("  skills    - view current learning skills");
        addLine("  projects  - open the projects page");
        addLine("  date      - show this device's date and time");
        addLine("  clear     - clear the terminal output");
      },
      about: () => addLine("I'm Kahiga, a Computer Science student learning C, Linux, and cybersecurity."),
      skills: () => {
        addLine("C programming: beginner — variables, conditions, loops, and problem solving.");
        addLine("Linux: learning — command line, files, permissions, and packages.");
        addLine("Cybersecurity: foundations — networking and authorized lab practice.");
      },
      projects: () => {
        addLine("Opening the projects page in this tab...");
        window.location.href = "projects.html";
      },
      date: () => addLine(new Date().toString()),
      clear: () => { output.replaceChildren(); }
    };
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const command = input.value.trim().toLowerCase();
      if (!command) return;
      addLine("visitor@kahiga:~$ " + command, "command-line");
      if (commands[command]) commands[command]();
      else addLine("Command not found: " + command + ". Type 'help' to see available commands.", "error");
      input.value = "";
      input.focus();
    });
  }
});
