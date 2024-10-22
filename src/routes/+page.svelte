<script>
    let formData = {
      dosya_numarasi: '',
      taraf1isim: '',
      kimlik_no: '',
      taraf1adres: '',
      taraf2isim: '',
      taraf2mersis_no: '',
      taraf2adres: '',
      today: new Date().toLocaleDateString('tr-TR')
    };
    let status = '';
  
    async function generateDocument(type) {
      status = `${type === 'arbitration' ? 'Arabuluculuk Tutanağı' : 'İlk Oturum Tutanağı'} oluşturuluyor...`;
      try {
        const response = await fetch(`/api/generate-document?type=${type}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
  
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = type === 'arbitration' ? 'arabuluculuk_tutanagi.docx' : 'ilk_oturum_tutanagi.docx';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          status = `${type === 'arbitration' ? 'Arabuluculuk Tutanağı' : 'İlk Oturum Tutanağı'} oluşturuldu ve indirme başladı!`;
        } else {
          status = `Hata: ${response.status} ${response.statusText}`;
          console.error('Sunucu yanıtı:', await response.text());
        }
      } catch (error) {
        status = `Hata: ${error.message}`;
        console.error('Fetch hatası:', error);
      }
    }
  </script>
  
  <main>
    <h1>Arabuluculuk Belgeleri Oluşturucu</h1>
    <form>
      <input bind:value={formData.dosya_numarasi} placeholder="Dosya Numarası" required>
      <input bind:value={formData.taraf1isim} placeholder="Taraf 1 İsim" required>
      <input bind:value={formData.kimlik_no} placeholder="Taraf 1 TC Kimlik No" required>
      <input bind:value={formData.taraf1adres} placeholder="Taraf 1 Adres" required>
      <input bind:value={formData.taraf2isim} placeholder="Taraf 2 İsim" required>
      <input bind:value={formData.taraf2mersis_no} placeholder="Taraf 2 MERSİS No" required>
      <input bind:value={formData.taraf2adres} placeholder="Taraf 2 Adres" required>
      <div class="button-group">
        <button type="button" on:click={() => generateDocument('arbitration')}>Arabuluculuk Tutanağı Oluştur</button>
        <button type="button" on:click={() => generateDocument('firstSession')}>İlk Oturum Tutanağı Oluştur</button>
      </div>
    </form>
    {#if status}
      <p class="status" class:error={status.startsWith('Hata')}>{status}</p>
    {/if}
  </main>
  
  <style>
    main {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    input, button {
      padding: 10px;
      font-size: 16px;
    }
    .button-group {
      display: flex;
      gap: 10px;
    }
    button {
      flex: 1;
      background-color: #4CAF50;
      color: white;
      border: none;
      cursor: pointer;
    }
    button:hover {
      background-color: #45a049;
    }
    .status {
      margin-top: 20px;
      padding: 10px;
      background-color: #e7f3fe;
      border-left: 5px solid #2196F3;
    }
    .status.error {
      background-color: #ffebee;
      border-left-color: #f44336;
    }
  </style>