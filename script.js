
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. NAVBAR RESPONSIVE
    // ==========================================

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            navMenu.classList.toggle("active");

            if (navMenu.classList.contains("active")) {
                menuToggle.textContent = "✕";
                menuToggle.setAttribute("aria-label", "Tutup menu");
            } else {
                menuToggle.textContent = "☰";
                menuToggle.setAttribute("aria-label", "Buka menu");
            }

        });

        // Menutup menu setelah link diklik
        navMenu.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navMenu.classList.remove("active");
                menuToggle.textContent = "☰";
                menuToggle.setAttribute("aria-label", "Buka menu");

            });

        });

    }


    // ==========================================
    // 2. LOGIKA HALAMAN UNDANGAN (index.html)
    // ==========================================

    const displayInstansi = document.getElementById("display-instansi");
    const displayKategori = document.getElementById("display-kategori");
    const rsvpInstansiInput = document.getElementById("rsvp-instansi");

    if (displayInstansi && displayKategori) {

        // Mengambil parameter dari URL (?to=...&kategori=...)
        const urlParams = new URLSearchParams(window.location.search);

        const tujuan = urlParams.get("to");
        const kategori = urlParams.get("kategori");

        if (tujuan) {
            displayInstansi.textContent = tujuan;

            if (rsvpInstansiInput) {
                rsvpInstansiInput.value = tujuan;
            }
        }

        if (kategori) {
            displayKategori.textContent = kategori;
        }

    }


    // ==========================================
    // 3. PENANGANAN FORM RSVP
    // ==========================================

    // ==========================================
    // 3. PENANGANAN FORM RSVP KE WHATSAPP
    // ==========================================

    const rsvpForm = document.getElementById("rsvp-form");
    const rsvpResult = document.getElementById("rsvp-result");

    if (rsvpForm) {

        rsvpForm.addEventListener("submit", (e) => {

            e.preventDefault();

            // Mengambil data form
            const nama = document.getElementById("rsvp-nama").value;
            const instansi = document.getElementById("rsvp-instansi").value;
            const status = document.getElementById("rsvp-status").value;
            const jumlah = document.getElementById("rsvp-jumlah").value;

            // Nomor WhatsApp tujuan
            const nomorWA = "6281381967395";

            // Membuat pesan otomatis
            const pesan = 
`Assalamualaikum, saya ingin mengonfirmasi kehadiran pada acara Edu Fair & Career Day 2026.

Nama: ${nama}
Instansi: ${instansi}
Status Kehadiran: ${status}
Jumlah Perwakilan: ${jumlah} orang

Terima kasih.`;

            // Mengubah pesan menjadi URL WhatsApp
            const urlWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;

            // Membuka WhatsApp
            window.open(urlWA, "_blank");

            // Menampilkan notifikasi di website
            rsvpResult.style.display = "block";

            rsvpResult.innerHTML = `
                <strong>Konfirmasi berhasil disiapkan!</strong><br>
                Silakan lanjutkan mengirim pesan melalui WhatsApp.
            `;

        });

    }


    // ==========================================
    // 4. LOGIKA HALAMAN ADMIN BLAST (admin.html)
    // ==========================================

    const csvInput = document.getElementById("csv-file-input");
    const tableBody = document.getElementById("guest-table-body");

    if (csvInput && tableBody) {

        csvInput.addEventListener("change", (event) => {

            const file = event.target.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = function (e) {

                const text = e.target.result;
                prosesCSV(text);

            };

            reader.readAsText(file);

        });

    }


    // ==========================================
    // 5. PROSES FILE CSV
    // ==========================================

    function prosesCSV(csvText) {

        // Memisahkan baris dan membersihkan spasi kosong
        const rows = csvText.trim().split(/\r?\n/);

        tableBody.innerHTML = "";

        // Mendapatkan base URL untuk index.html secara dinamis
        const baseUrl = window.location.href.replace("admin.html", "index.html");

        // Mulai dari index 1 untuk melewati header CSV
        for (let i = 1; i < rows.length; i++) {

            const cols = rows[i].split(",");

            if (cols.length < 5) continue;

            const id = cols[0].trim();
            const namaTamu = cols[1].trim();
            const instansi = cols[2].trim();
            const kategori = cols[3].trim();
            const noWa = cols[4].trim();

            // Membuat URL personalisasi
            const params = new URLSearchParams({
                to: instansi,
                kategori: kategori
            });

            const personalLink = `${baseUrl}?${params.toString()}`;

            // Template pesan WhatsApp otomatis
            const pesanWa = `Yth. Bapak/Ibu ${namaTamu} (${instansi}),

Kami mengundang Anda sebagai perwakilan kategori *${kategori}* untuk hadir dalam acara *Edu Fair & Career Day 2026*.

Informasi lengkap acara, rundown, dan konfirmasi kehadiran (RSVP) dapat diakses melalui tautan undangan digital berikut:

${personalLink}

Terima kasih atas perhatian dan kerja samanya.`;

            const waUrl = `https://wa.me/${noWa}?text=${encodeURIComponent(pesanWa)}`;

            // Membuat baris tabel
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${id}</td>
                <td>${namaTamu}</td>
                <td>${instansi}</td>
                <td>${kategori}</td>
                <td>${noWa}</td>
                <td>
                    <a href="${waUrl}"
                       target="_blank"
                       class="btn-wa">
                       Kirim Undangan WhatsApp
                    </a>
                </td>
            `;

            tableBody.appendChild(tr);

        }

    }

});
