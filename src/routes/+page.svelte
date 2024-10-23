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
      const documentNames = {
        'arbitration': 'Arabuluculuk Tutanağı',
        'firstSession': 'İlk Oturum Tutanağı',
        'application': 'Başvuru Tutanağı',
        'agreement': 'Anlaşma Tutanağı'
      };
  
      status = `${documentNames[type]} oluşturuluyor...`;
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
          a.download = `${type === 'arbitration' ? 'arabuluculuk_tutanagi' : 
                        type === 'firstSession' ? 'ilk_oturum_tutanagi' : 
                        type === 'application' ? 'basvuru_tutanagi' : 
                        'anlasma_tutanagi'}.docx`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          status = `${documentNames[type]} oluşturuldu ve indirme başladı!`;
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
      <div class="form-group">
        <label for="dosya_numarasi">Dosya Numarası</label>
        <input id="dosya_numarasi" bind:value={formData.dosya_numarasi} required>
      </div>
      <div class="form-group">
        <label for="taraf1isim">Taraf 1 İsim</label>
        <input id="taraf1isim" bind:value={formData.taraf1isim} required>
      </div>
      <div class="form-group">
        <label for="kimlik_no">Taraf 1 TC Kimlik No</label>
        <input id="kimlik_no" bind:value={formData.kimlik_no} required>
      </div>
      <div class="form-group">
        <label for="taraf1adres">Taraf 1 Adres</label>
        <input id="taraf1adres" bind:value={formData.taraf1adres} required>
      </div>
      <div class="form-group">
        <label for="taraf2isim">Taraf 2 İsim</label>
        <input id="taraf2isim" bind:value={formData.taraf2isim} required>
      </div>
      <div class="form-group">
        <label for="taraf2mersis_no">Taraf 2 MERSİS No</label>
        <input id="taraf2mersis_no" bind:value={formData.taraf2mersis_no} required>
      </div>
      <div class="form-group">
        <label for="taraf2adres">Taraf 2 Adres</label>
        <input id="taraf2adres" bind:value={formData.taraf2adres} required>
      </div>
      <div class="button-group">
        <button type="button" on:click={() => generateDocument('arbitration')}>
          Arabuluculuk Tutanağı Oluştur
        </button>
        <button type="button" on:click={() => generateDocument('firstSession')}>
          İlk Oturum Tutanağı Oluştur
        </button>
        <button type="button" on:click={() => generateDocument('application')}>
          Başvuru Tutanağı Oluştur
        </button>
        <button type="button" on:click={() => generateDocument('agreement')}>
          Anlaşma Tutanağı Oluştur
        </button>
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
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      color: #666;
    }
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .button-group {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* Four equal columns */
    gap: 10px;
    margin-top: 20px;
  }

  button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap; /* Prevents text from wrapping */
    font-size: 14px; /* Slightly smaller font to fit better */
  }

  button:hover {
    background-color: #45a049;
  }

  /* Add responsive design for smaller screens */
  @media (max-width: 768px) {
    .button-group {
      grid-template-columns: repeat(2, 1fr); /* Stack in two columns on smaller screens */
    }
  }

  @media (max-width: 480px) {
    .button-group {
      grid-template-columns: 1fr; /* Stack vertically on very small screens */
    }
  }
    .status {
      margin-top: 15px;
      padding: 10px;
      background-color: #e7f3fe;
      border-left: 5px solid #2196F3;
    }
    .status.error {
      background-color: #ffebee;
      border-left-color: #f44336;
    }
  </style>