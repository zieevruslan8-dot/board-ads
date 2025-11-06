// Supabase клиент
const supabaseUrl = 'https://nbkwwikpknothvmmfnkj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia3Z3aWtwa25vdGh2bW1mbmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MjIwMjYsImV4cCI6MjA3Nzk5ODAyNn0.B8yh-oBFidrCUAJOnarCSeqxQ83nZpOMeboCcXa5g70'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

let selectedPhotos = []

// Предпросмотр фото
document.getElementById('ad-photo').addEventListener('change', function(event) {
    const preview = document.getElementById('photo-preview')
    preview.innerHTML = ''
    selectedPhotos = []
    
    const files = event.target.files
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        
        reader.onload = function(e) {
            selectedPhotos.push(e.target.result)
            const img = document.createElement('img')
            img.src = e.target.result
            img.className = 'preview-image'
            preview.appendChild(img)
        }
        reader.readAsDataURL(file)
    }
})

// Простая функция добавления
async function addAd() {
    const title = document.getElementById('ad-title').value
    const text = document.getElementById('ad-text').value
    const price = document.getElementById('ad-price').value
    const contact = document.getElementById('ad-contact').value

    if (!title) {
        alert('Введите название!')
        return
    }

    try {
        // Простой запрос к базе
        const { data, error } = await supabase
            .from('ads')
            .insert([{ 
                title: title,
                description: text || 'Нет описания',
                price: price || 'Не указана',
                contact: contact || 'Не указаны'
            }])

        if (error) throw error
        
        alert('УСПЕХ! Объявление в базе!')
        // Очищаем форму
        document.getElementById('ad-title').value = ''
        document.getElementById('ad-text').value = ''
        document.getElementById('ad-price').value = ''
        document.getElementById('ad-contact').value = ''
        
    } catch (error) {
        alert('Ошибка: ' + error.message)
    }
}

// Загрузка объявлений при старте
async function loadAds() {
    try {
        const { data, error } = await supabase
            .from('ads')
            .select('*')
            .order('created_at', { ascending: false })
            
        if (error) throw error
        
        const container = document.getElementById('ads-container')
        container.innerHTML = ''
        
        data.forEach(ad => {
            container.innerHTML += `
                <div class="ad-item">
                    <div class="ad-title">${ad.title}</div>
                    <div class="ad-text">${ad.description}</div>
                    <div class="ad-price">💰 ${ad.price}</div>
                </div>
            `
        })
    } catch (error) {
        console.log('Ошибка загрузки:', error)
    }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', loadAds)
