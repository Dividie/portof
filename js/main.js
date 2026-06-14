// 1. Mobile Menu Toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    // Mengubah ikon menu dari bars ke 'xmark' (tanda silang) saat terbuka
    const icon = menuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
});

// Tutup menu otomatis jika link di mobile menu diklik
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = menuBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
    });
});

// --- INTEGRASI SUPABASE UNTUK HALAMAN UTAMA ---
SUPABASE_URL = "https://aopgrjwdzrplziecvclr.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_ukUVQ-ORoh7RjpzmM7sTXw_K4uagCOK";
const _supabaseMain = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function displayProjectsOnPortfolio() {
    const projectContainer = document.querySelector('#projects .grid');
    if (!projectContainer) return;

    const { data, error } = await _supabaseMain.from('projects').select('*').order('id', { ascending: false });
    
    if (error) return console.error(error);

    // Kosongkan card statis bawaan HTML
    projectContainer.innerHTML = '';

    // Render secara dinamis berdasarkan data dari database
    data.forEach(project => {
        projectContainer.innerHTML += `
            <div class="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all duration-300">
                <div class="h-48 bg-slate-800 flex items-center justify-center relative overflow-hidden">
                    <i class="fas ${project.icon} text-4xl text-slate-600 group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <div class="p-6 space-y-3">
                    <div class="flex gap-2">
                        <span class="text-[10px] uppercase font-semibold tracking-wider bg-indigo-950 text-indigo-400 px-2.5 py-1 rounded-md">${project.tag1}</span>
                        ${project.tag2 ? `<span class="text-[10px] uppercase font-semibold tracking-wider bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-md">${project.tag2}</span>` : ''}
                    </div>
                    <h3 class="text-lg font-bold group-hover:text-indigo-400 transition-colors">${project.title}</h3>
                    <p class="text-slate-400 text-sm font-light line-clamp-2">${project.description}</p>
                </div>
            </div>
        `;
    });
}

// Tambahkan library Supabase CDN ke index.html terlebih dahulu sebelum memanggil ini
document.addEventListener('DOMContentLoaded', displayProjectsOnPortfolio);