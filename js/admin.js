// Konfigurasi Supabase
const SUPABASE_URL = "https://aopgrjwdzrplziecvclr.supabase.co/rest/v1/"; 
const SUPABASE_KEY = "sb_publishable_ukUVQ-ORoh7RjpzmM7sTXw_K4uagCOK";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const projectForm = document.getElementById('project-form');
const projectList = document.getElementById('admin-project-list');
const formTitle = document.getElementById('form-title');

// 1. Ambil Data dan Tampilkan di Dashboard Admin
async function fetchAdminProjects() {
    const { data, error } = await _supabase.from('projects').select('*').order('id', { ascending: false });
    
    if (error) return console.error(error);
    
    projectList.innerHTML = '';
    data.forEach(project => {
        projectList.innerHTML += `
            <div class="flex justify-between items-center p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <div>
                    <h3 class="font-bold text-slate-200">${project.title}</h3>
                    <p class="text-xs text-slate-400">${project.tag1} | ${project.tag2}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="editProject(${project.id}, '${project.title}', '${project.icon}', '${project.tag1}', '${project.tag2}', '${project.description}')" class="px-3 py-1.5 text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-600/40 transition-all">Edit</button>
                    <button onclick="deleteProject(${project.id})" class="px-3 py-1.5 text-xs bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/40 transition-all">Hapus</button>
                </div>
            </div>
        `;
    });
}

// 2. Tambah atau Update Data (Create / Update)
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('project-id').value;
    const title = document.getElementById('title').value;
    const icon = document.getElementById('icon').value;
    const tag1 = document.getElementById('tag1').value;
    const tag2 = document.getElementById('tag2').value;
    const description = document.getElementById('description').value;

    if (id) {
        // Jika ID ada, lakukan UPDATE
        await _supabase.from('projects').update({ title, icon, tag1, tag2, description }).eq('id', id);
        formTitle.innerText = "Tambah Karya Baru";
    } else {
        // Jika ID kosong, lakukan INSERT baru
        await _supabase.from('projects').insert([{ title, icon, tag1, tag2, description }]);
    }

    projectForm.reset();
    document.getElementById('project-id').value = '';
    fetchAdminProjects();
});

// 3. Fungsi Lempar Data ke Form saat tombol Edit diklik
window.editProject = (id, title, icon, tag1, tag2, description) => {
    formTitle.innerText = "Edit Karya";
    document.getElementById('project-id').value = id;
    document.getElementById('title').value = title;
    document.getElementById('icon').value = icon;
    document.getElementById('tag1').value = tag1;
    document.getElementById('tag2').value = tag2;
    document.getElementById('description').value = description;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 4. Fungsi Hapus Data (Delete)
window.deleteProject = async (id) => {
    if (confirm('Apakah kamu yakin ingin menghapus karya ini?')) {
        await _supabase.from('projects').delete().eq('id', id);
        fetchAdminProjects();
    }
};

// Jalankan fungsi tampil data saat halaman admin dibuka
document.addEventListener('DOMContentLoaded', fetchAdminProjects);